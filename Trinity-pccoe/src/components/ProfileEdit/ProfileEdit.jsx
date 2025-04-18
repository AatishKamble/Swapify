import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { updateUserProfile } from "../../State/Auth/Action.js"
import Title from "../FormTitle/Title"
import InputField from "../FormFields/InputField"
import { User, Mail, Phone, Calendar, Edit, Shield, ArrowLeft, CheckCircle } from "lucide-react"

function ProfileEdit() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, isLoading, error } = useSelector((store) => store.auth)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    gender: "",
    birthDate: "",
  })

  const [isEdit, setIsEdit] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        mobileNumber: user.mobileNumber || "",
        gender: user.gender || "",
        birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split("T")[0] : "",
      })
    }
  }, [user])

  // Handling form submit
  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      await dispatch(updateUserProfile(formData))
      setSuccessMessage("Profile updated successfully!")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsSubmitting(false)
      setIsEdit(false)
    }
  }

  const handleChangeButton = () => {
    setIsEdit(!isEdit)
  }

  // Handle gender button click
  const handleGenderButtonClick = (gender) => {
    setFormData((prevData) => ({ ...prevData, gender: prevData.gender === gender ? "" : gender }))
  }

  // Get full name from first and last name
  const getFullName = () => {
    return `${formData.firstName || ""} ${formData.lastName || ""}`.trim()
  }

  // Handle full name change (split into first and last name)
  const handleFullNameChange = (name, value) => {
    const nameParts = value.split(" ")
    const firstName = nameParts[0] || ""
    const lastName = nameParts.slice(1).join(" ") || ""

    setFormData((prevData) => ({
      ...prevData,
      firstName,
      lastName,
    }))
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-6">
          <motion.button
            onClick={() => navigate("/profile")}
            className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </motion.button>
          <Title title="Profile Edit" subtitle="Edit your personal details" />
        </div>

        {/* Success message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl text-green-600 flex items-center gap-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CheckCircle size={20} />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Personal Information Section */}
              <motion.div className="mb-8" variants={itemVariants}>
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
                    <User size={20} />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
                </div>

                {/* Mobile Number Section */}
                <div className="mb-6 p-5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-lg text-gray-600 mt-1 shadow-sm">
                        <Phone size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Mobile Number</p>

                        <AnimatePresence mode="wait">
                          {isEdit ? (
                            <motion.div
                              key="edit"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              <InputField
                                type="tel"
                                name="mobileNumber"
                                lableText=""
                                setFormData={setFormData}
                                value={formData.mobileNumber || ""}
                                placeholder="Enter your mobile number"
                              />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="display"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-center"
                            >
                              <p className="font-medium text-gray-800">{formData.mobileNumber || "Not provided"}</p>
                              {formData.mobileNumber && (
                                <div className="ml-2 text-green-600 flex items-center">
                                  <Shield size={16} />
                                  <span className="text-xs ml-1">Verified</span>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <motion.button
                      type="button"
                      onClick={handleChangeButton}
                      className={`${isEdit ? "hidden" : "flex items-center gap-1 px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-medium transition-colors duration-200 shadow-sm border border-gray-200"}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Edit size={16} />
                      <span className="hidden sm:inline">Change</span>
                    </motion.button>
                  </div>
                </div>

                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <InputField
                    type="text"
                    name="fullName"
                    lableText="Full Name"
                    setFormData={handleFullNameChange}
                    value={getFullName()}
                    placeholder="Enter your full name"
                    required
                    icon={<User size={18} />}
                  />

                  <InputField
                    type="email"
                    name="email"
                    lableText="Email"
                    setFormData={setFormData}
                    value={formData.email || ""}
                    placeholder="Enter your email address"
                    required
                    icon={<Mail size={18} />}
                    disabled={true} // Email should not be editable
                  />
                </div>
              </motion.div>

              {/* Gender Section */}
              <motion.div className="mb-8" variants={itemVariants}>
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
                    <User size={20} />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">Gender</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    type="button"
                    className={`px-6 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                      formData.gender === "male"
                        ? "bg-gray-800 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                    }`}
                    onClick={() => handleGenderButtonClick("male")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <User size={16} />
                    <span>Male</span>
                  </motion.button>

                  <motion.button
                    type="button"
                    className={`px-6 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                      formData.gender === "female"
                        ? "bg-gray-800 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                    }`}
                    onClick={() => handleGenderButtonClick("female")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <User size={16} />
                    <span>Female</span>
                  </motion.button>
                </div>
              </motion.div>

              {/* Birthdate Section */}
              <motion.div className="mb-8" variants={itemVariants}>
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
                    <Calendar size={20} />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">Birth Date</h2>
                </div>

                <InputField
                  type="date"
                  name="birthDate"
                  lableText="Select your birth date"
                  setFormData={setFormData}
                  value={formData.birthDate || ""}
                  icon={<Calendar size={18} />}
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div className="flex justify-center" variants={itemVariants}>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gray-800 text-white font-medium rounded-xl shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    "Save Details"
                  )}
                </motion.button>
              </motion.div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default ProfileEdit;