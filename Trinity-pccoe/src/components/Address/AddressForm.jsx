import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { createAddress, updateAddress, getAddresses } from "../../State/Address/Action.js"
import Title from "../FormTitle/Title.jsx"
import InputField from "../FormFields/InputField.jsx"
import { MapPin, User, Phone, Home, Briefcase, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"

const AddressForm = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { addressId } = useParams()
  const { addresses = [], loading = false, error = null } = useSelector((state) => state.address || {})

  // State
  const [isWork, setIsWork] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    locality: "",
    address: "",
    city: "",
    state: "",
    addressType: "home",
    isDefault: false,
    openSaturday: false,
    openSunday: false,
  })
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [isEditMode, setIsEditMode] = useState(false)

  // Load address data if in edit mode
  useEffect(() => {
    if (addressId) {
      setIsEditMode(true)

      // Only fetch addresses if we don't already have them
      if (addresses.length === 0) {
        dispatch(getAddresses()).then(() => {
          const addressToEdit = addresses.find((addr) => addr._id === addressId)
          if (addressToEdit) {
            setFormData({
              fullName: addressToEdit.fullName || "",
              phone: addressToEdit.phone || "",
              pincode: addressToEdit.pincode || "",
              locality: addressToEdit.locality || "",
              address: addressToEdit.address || "",
              city: addressToEdit.city || "",
              state: addressToEdit.state || "",
              addressType: addressToEdit.addressType || "home",
              isDefault: addressToEdit.isDefault || false,
              openSaturday: addressToEdit.openSaturday || false,
              openSunday: addressToEdit.openSunday || false,
            })
            setIsWork(addressToEdit.addressType === "work")
          }
        })
      } else {
        // If we already have addresses, find the one to edit
        const addressToEdit = addresses.find((addr) => addr._id === addressId)
        if (addressToEdit) {
          setFormData({
            fullName: addressToEdit.fullName || "",
            phone: addressToEdit.phone || "",
            pincode: addressToEdit.pincode || "",
            locality: addressToEdit.locality || "",
            address: addressToEdit.address || "",
            city: addressToEdit.city || "",
            state: addressToEdit.state || "",
            addressType: addressToEdit.addressType || "home",
            isDefault: addressToEdit.isDefault || false,
            openSaturday: addressToEdit.openSaturday || false,
            openSunday: addressToEdit.openSunday || false,
          })
          setIsWork(addressToEdit.addressType === "work")
        }
      }
    }
  }, [addressId, dispatch, addresses.length])

  // Showing work options
  const handleWorkClick = () => {
    setIsWork(true)
    setFormData((prev) => ({ ...prev, addressType: "work" }))
  }

  const handleHomeClick = () => {
    setIsWork(false)
    setFormData((prev) => ({ ...prev, addressType: "home" }))
  }

  // Validate form
  const validateForm = () => {
    const errors = {}

    // Phone validation - 10 digits only
    if (!formData.phone) {
      errors.phone = "Phone number is required"
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = "Phone number must be exactly 10 digits"
    }

    // Pincode validation - 6 digits only
    if (!formData.pincode) {
      errors.pincode = "Pincode is required"
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      errors.pincode = "Pincode must be exactly 6 digits"
    }

    // Required fields
    if (!formData.fullName) errors.fullName = "Full name is required"
    if (!formData.locality) errors.locality = "Locality is required"
    if (!formData.address) errors.address = "Address is required"
    if (!formData.city) errors.city = "City is required"
    if (!formData.state) errors.state = "State is required"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Form handling
  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      if (isEditMode) {
        await dispatch(updateAddress(addressId, formData))
        setSuccessMessage("Address updated successfully!")
      } else {
        await dispatch(createAddress(formData))
        setSuccessMessage("Address added successfully!")
      }

      // Clear form after successful submission if not editing
      if (!isEditMode) {
        setFormData({
          fullName: "",
          phone: "",
          pincode: "",
          locality: "",
          address: "",
          city: "",
          state: "",
          addressType: "home",
          isDefault: false,
          openSaturday: false,
          openSunday: false,
        })
        setIsWork(false)
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
        // Navigate back to address list after successful edit
        if (isEditMode) {
          navigate("/addresses")
        }
      }, 700)
    } catch (err) {
      console.error("Error saving address:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Checkbox handling
  const handleCheckbox = (event) => {
    const { name, checked } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  // Handle input change with validation
  const handleInputChange = (name, value) => {
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }

    // Special validation for phone and pincode
    if (name === "phone") {
      // Allow only digits and limit to 10 characters
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10)
      setFormData((prev) => ({ ...prev, [name]: digitsOnly }))
    } else if (name === "pincode") {
      // Allow only digits and limit to 6 characters
      const digitsOnly = value.replace(/\D/g, "").slice(0, 6)
      setFormData((prev) => ({ ...prev, [name]: digitsOnly }))
    } else {
      // Normal handling for other fields
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
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
            onClick={() => navigate("/addresses")}
            className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </motion.button>
          <Title
            title={isEditMode ? "Edit Address" : "Add New Address"}
            subtitle={isEditMode ? "Update your address details" : "Add a new delivery address"}
          />
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
              className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 flex items-center gap-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AlertCircle size={20} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Contact Details Section */}
              <motion.div className="mb-8" variants={itemVariants}>
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
                    <User size={20} />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">Contact Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <InputField
                      type="text"
                      name="fullName"
                      lableText="Full Name"
                      setFormData={handleInputChange}
                      value={formData.fullName}
                      placeholder="Enter your full name"
                      required
                      icon={<User size={18} />}
                      error={formErrors.fullName}
                    />
                  </div>

                  <div>
                    <InputField
                      type="tel"
                      name="phone"
                      lableText="Mobile Number"
                      setFormData={handleInputChange}
                      value={formData.phone}
                      placeholder="Enter your 10-digit mobile number"
                      required
                      icon={<Phone size={18} />}
                      error={formErrors.phone}
                    />
                    {formErrors.phone && <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>}
                  </div>
                </div>
              </motion.div>

              {/* Address Section */}
              <motion.div className="mb-8" variants={itemVariants}>
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
                    <MapPin size={20} />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">Address</h2>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <InputField
                        type="text"
                        name="pincode"
                        lableText="Pincode"
                        setFormData={handleInputChange}
                        value={formData.pincode}
                        placeholder="Enter your 6-digit pincode"
                        required
                        error={formErrors.pincode}
                      />
                      {formErrors.pincode && <p className="mt-1 text-sm text-red-600">{formErrors.pincode}</p>}
                    </div>

                    <div>
                      <InputField
                        type="text"
                        name="locality"
                        lableText="Locality/Town"
                        setFormData={handleInputChange}
                        value={formData.locality}
                        placeholder="Enter your locality or town"
                        required
                        error={formErrors.locality}
                      />
                      {formErrors.locality && <p className="mt-1 text-sm text-red-600">{formErrors.locality}</p>}
                    </div>
                  </div>

                  <div>
                    <InputField
                      type="text"
                      name="address"
                      lableText="Address (House No, Building, Area, Street)"
                      setFormData={handleInputChange}
                      value={formData.address}
                      placeholder="Enter your complete address"
                      required
                      icon={<MapPin size={18} />}
                      error={formErrors.address}
                    />
                    {formErrors.address && <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <InputField
                        type="text"
                        name="city"
                        lableText="City"
                        setFormData={handleInputChange}
                        value={formData.city}
                        placeholder="Enter your city"
                        required
                        error={formErrors.city}
                      />
                      {formErrors.city && <p className="mt-1 text-sm text-red-600">{formErrors.city}</p>}
                    </div>

                    <div>
                      <InputField
                        type="text"
                        name="state"
                        lableText="State"
                        setFormData={handleInputChange}
                        value={formData.state}
                        placeholder="Enter your state"
                        required
                        error={formErrors.state}
                      />
                      {formErrors.state && <p className="mt-1 text-sm text-red-600">{formErrors.state}</p>}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Address Type Section */}
              <motion.div className="mb-8" variants={itemVariants}>
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
                    {isWork ? <Briefcase size={20} /> : <Home size={20} />}
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">Save Address As</h2>
                </div>

                <div className="flex gap-4 mb-6">
                  <motion.button
                    type="button"
                    className={`px-6 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all duration-200 ${
                      !isWork
                        ? "bg-gray-800 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                    }`}
                    onClick={handleHomeClick}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Home size={16} />
                    Home
                  </motion.button>

                  <motion.button
                    type="button"
                    className={`px-6 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all duration-200 ${
                      isWork
                        ? "bg-gray-800 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                    }`}
                    onClick={handleWorkClick}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Briefcase size={16} />
                    Work
                  </motion.button>
                </div>

                {isWork && (
                  <motion.div
                    className="bg-gray-50 p-5 rounded-xl space-y-4 border border-gray-100"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="openSaturday"
                        name="openSaturday"
                        checked={formData.openSaturday}
                        className="h-4 w-4 text-gray-800 focus:ring-gray-500 border-gray-300 rounded transition-colors"
                        onChange={handleCheckbox}
                      />
                      <label htmlFor="openSaturday" className="ml-3 text-sm text-gray-700">
                        Open On Saturday
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="openSunday"
                        name="openSunday"
                        checked={formData.openSunday}
                        className="h-4 w-4 text-gray-800 focus:ring-gray-500 border-gray-300 rounded transition-colors"
                        onChange={handleCheckbox}
                      />
                      <label htmlFor="openSunday" className="ml-3 text-sm text-gray-700">
                        Open On Sunday
                      </label>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Default Address Option */}
              <motion.div className="mb-8" variants={itemVariants}>
                <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    checked={formData.isDefault}
                    className="h-4 w-4 text-gray-800 focus:ring-gray-500 border-gray-300 rounded transition-colors"
                    onChange={handleCheckbox}
                  />
                  <label htmlFor="isDefault" className="ml-3 text-sm text-gray-700">
                    Make this my default address
                  </label>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div className="flex justify-center" variants={itemVariants}>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gray-800 text-white font-medium rounded-xl shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70"
                  whileHover={{ scale: 1.02, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </div>
                  ) : isEditMode ? (
                    "Update Address"
                  ) : (
                    "Save Address"
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

export default AddressForm;