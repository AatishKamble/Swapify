import { useState } from "react"
import { motion } from "framer-motion"
import Title from "../FormTitle/Title.jsx"
import InputField from "../FormFields/InputField.jsx"
import { MapPin, User, Phone, Home, Briefcase } from "lucide-react"

const Address = () => {
  // State
  const [isWork, setIsWork] = useState(false)
  const [formData, setFormData] = useState({
    openSaturday: false,
    openSunday: false,
    defaultAddress: false,
  })

  // Showing work options
  function handleWorkClick() {
    setIsWork(true)
  }

  function handleHomeClick() {
    setIsWork(false)
  }

  // Form handling
  function handleSubmit(event) {
    event.preventDefault()
    console.log("Form submitted successfully", formData)
    for (const key in formData) {
      if (Object.hasOwnProperty.call(formData, key)) {
        console.log(key + ": " + formData[key])
      }
    }
  }

  // Checkbox handling
  function handleCheckbox(event) {
    const { name, checked } = event.target
    setFormData((formData) => ({
      ...formData,
      [name]: checked,
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
        <Title title="Address" subtitle="Edit Your Address" />

        <motion.div
          className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <form onSubmit={handleSubmit} method="get">
            {/* Contact Details Section */}
            <motion.div className="mb-8" variants={itemVariants}>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
                  <User size={20} />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">Contact Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <InputField
                  type="text"
                  name="fullName"
                  lableText="Full Name"
                  setFormData={setFormData}
                  value={formData.fullName || ""}
                  placeholder="Enter your full name"
                  required
                  icon={<User size={18} />}
                />

                <InputField
                  type="tel"
                  name="phone"
                  lableText="Mobile Number"
                  setFormData={setFormData}
                  value={formData.phone || ""}
                  placeholder="Enter your mobile number"
                  required
                  icon={<Phone size={18} />}
                />
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
                  <InputField
                    type="text"
                    name="pincode"
                    lableText="Pincode"
                    setFormData={setFormData}
                    value={formData.pincode || ""}
                    placeholder="Enter your pincode"
                    required
                  />

                  <InputField
                    type="text"
                    name="locality"
                    lableText="Locality/Town"
                    setFormData={setFormData}
                    value={formData.locality || ""}
                    placeholder="Enter your locality or town"
                    required
                  />
                </div>

                <InputField
                  type="text"
                  name="address"
                  lableText="Address (House No, Building, Area, Street)"
                  setFormData={setFormData}
                  value={formData.address || ""}
                  placeholder="Enter your complete address"
                  required
                  icon={<MapPin size={18} />}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <InputField
                    type="text"
                    name="city"
                    lableText="City"
                    setFormData={setFormData}
                    value={formData.city || ""}
                    placeholder="Enter your city"
                    required
                  />

                  <InputField
                    type="text"
                    name="state"
                    lableText="State"
                    setFormData={setFormData}
                    value={formData.state || ""}
                    placeholder="Enter your state"
                    required
                  />
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
                  id="defaultAddress"
                  name="defaultAddress"
                  checked={formData.defaultAddress}
                  className="h-4 w-4 text-gray-800 focus:ring-gray-500 border-gray-300 rounded transition-colors"
                  onChange={handleCheckbox}
                />
                <label htmlFor="defaultAddress" className="ml-3 text-sm text-gray-700">
                  Make this my default address
                </label>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div className="flex justify-center" variants={itemVariants}>
              <motion.button
                type="submit"
                className="px-8 py-3 bg-gray-800 text-white font-medium rounded-xl shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                whileHover={{ scale: 1.02, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.98 }}
              >
                Save Address Details
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default Address

