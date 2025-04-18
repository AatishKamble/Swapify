import { useState, useEffect, useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { getAddresses } from "../../State/Address/Action.js"
import InputField from "../FormFields/InputField"
import { MapPin, ArrowLeft, ArrowRight, Save, Phone, Home, Plus, CheckCircle } from "lucide-react"
import { CheckoutContext } from "../../pages/Checkout.jsx"

const AddressEdit = ({ setCurrentStep }) => {
  const dispatch = useDispatch()
  const { addresses = [], loading = false } = useSelector((state) => state.address || {})
  const { checkoutData, updateCheckoutData } = useContext(CheckoutContext)

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
  })

  const [errors, setErrors] = useState({})
  const [isFormSaved, setIsFormSaved] = useState(false)
  const [showAddressList, setShowAddressList] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState(null)

  // Fetch addresses on component mount
  useEffect(() => {
    dispatch(getAddresses())
  }, [dispatch])

  // Use address from checkout context if available
  useEffect(() => {
    if (checkoutData?.shippingAddress) {
      setFormData(checkoutData.shippingAddress)
      setSelectedAddressId(checkoutData.shippingAddress._id)
      setIsFormSaved(true)
    }
    // Otherwise set default address when addresses are loaded
    else if (addresses && addresses.length > 0 && !selectedAddressId) {
      // Find default address or use the first one
      const defaultAddress = addresses.find((addr) => addr.isDefault) || addresses[0]
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress._id)
        populateFormWithAddress(defaultAddress)
        setIsFormSaved(true) // Enable the "Next" button since we have a valid address
      }
    }
  }, [addresses, checkoutData.shippingAddress])

  const populateFormWithAddress = (address) => {
    setFormData({
      fullName: address.fullName || "",
      phone: address.phone || "",
      pincode: address.pincode || "",
      locality: address.locality || "",
      address: address.address || "",
      city: address.city || "",
      state: address.state || "",
      addressType: address.addressType || "home",
      isDefault: address.isDefault || false,
      _id: address._id, // Keep track of the address ID
    })
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: value ? "" : "This field is required" }))
    setIsFormSaved(false) // Reset form saved state on change
  }

  const handleAddressSelect = (address) => {
    setSelectedAddressId(address._id)
    populateFormWithAddress(address)
    setShowAddressList(false)
    setIsFormSaved(true) // Enable the "Next" button

    // Save to checkout context
    updateCheckoutData("shippingAddress", {
      ...address,
    })
  }

  function handleSubmit(event) {
    event.preventDefault()

    const newErrors = {}
    Object.keys(formData).forEach((key) => {
      if (key !== "_id" && key !== "isDefault" && !formData[key].toString().trim()) {
        newErrors[key] = "This field is required"
      }
    })

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      // Save to checkout context
      updateCheckoutData("shippingAddress", {
        ...formData,
      })

      setIsFormSaved(true) // Enable the "Next" button
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
        <motion.div className="flex items-center" variants={itemVariants}>
          <MapPin size={22} className="text-white mr-2" />
          <h2 className="text-xl font-semibold text-white">Delivery Address</h2>
        </motion.div>
      </div>

      {/* Address Selection */}
      <motion.div className="p-4 border-b border-gray-100" variants={itemVariants}>
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-800">Select Delivery Address</h3>
          <button
            onClick={() => setShowAddressList(!showAddressList)}
            className="text-primary-600 text-sm font-medium hover:text-primary-700 transition-colors"
          >
            {showAddressList ? "Hide Addresses" : "Use Different Address"}
          </button>
        </div>

        {/* Address List */}
        <AnimatePresence>
          {showAddressList && (
            <motion.div
              className="mt-4 space-y-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                </div>
              ) : addresses && addresses.length > 0 ? (
                addresses.map((address) => (
                  <motion.div
                    key={address._id}
                    className={`p-3 border rounded-xl cursor-pointer transition-all ${
                      selectedAddressId === address._id
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-primary-300 hover:bg-gray-50"
                    }`}
                    onClick={() => handleAddressSelect(address)}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        {selectedAddressId === address._id ? (
                          <CheckCircle size={18} className="text-primary-600" />
                        ) : (
                          <div className="w-[18px] h-[18px] border-2 border-gray-300 rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-800">{address.fullName}</p>
                          {address.isDefault && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">Default</span>
                          )}
                          <span className="text-gray-500 text-sm">{address.phone}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {address.address}, {address.locality}, {address.city}, {address.state} - {address.pincode}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No saved addresses found. Please add a new address.
                </div>
              )}

              <motion.button
                className="w-full py-2 border border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all"
                whileHover={{ scale: 1.01 }}
                onClick={() => {
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
                  })
                  setSelectedAddressId(null)
                  setIsFormSaved(false)
                }}
              >
                <Plus size={16} />
                <span className="font-medium">Add New Address</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Full Name & Phone */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4" variants={itemVariants}>
          <InputField
            type="text"
            name="fullName"
            lableText="Full Name"
            setFormData={handleInputChange}
            value={formData.fullName}
            placeholder="Full Name"
            error={errors.fullName}
            required
          />
          <InputField
            type="text"
            name="phone"
            lableText="Mobile Number"
            setFormData={handleInputChange}
            value={formData.phone}
            placeholder="Mobile Number"
            error={errors.phone}
            required
            icon={<Phone size={18} />}
          />
        </motion.div>

        {/* Pincode & Locality */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4" variants={itemVariants}>
          <InputField
            type="text"
            name="pincode"
            lableText="Pincode"
            setFormData={handleInputChange}
            value={formData.pincode}
            placeholder="Pincode"
            error={errors.pincode}
            required
          />
          <InputField
            type="text"
            name="locality"
            lableText="Locality/Town"
            setFormData={handleInputChange}
            value={formData.locality}
            placeholder="Locality or Town"
            error={errors.locality}
            required
          />
        </motion.div>

        {/* Address */}
        <motion.div variants={itemVariants}>
          <InputField
            type="textarea"
            name="address"
            lableText="Address (House No, Building, Area, Street)"
            setFormData={handleInputChange}
            value={formData.address}
            placeholder="Complete Address"
            error={errors.address}
            required
            icon={<MapPin size={18} />}
          />
        </motion.div>

        {/* City & State */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4" variants={itemVariants}>
          <InputField
            type="text"
            name="city"
            lableText="City"
            setFormData={handleInputChange}
            value={formData.city}
            placeholder="City"
            error={errors.city}
            required
          />
          <InputField
            type="text"
            name="state"
            lableText="State"
            setFormData={handleInputChange}
            value={formData.state}
            placeholder="State"
            error={errors.state}
            required
          />
        </motion.div>

        {/* Address Type */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
          <div className="flex gap-4">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer ${
                formData.addressType === "home"
                  ? "bg-primary-50 border border-primary-200"
                  : "bg-gray-50 border border-gray-200"
              }`}
              onClick={() => {
                setFormData((prev) => ({ ...prev, addressType: "home" }))
                setIsFormSaved(false)
              }}
            >
              <Home size={18} className={formData.addressType === "home" ? "text-primary-600" : "text-gray-500"} />
              <span className={formData.addressType === "home" ? "text-primary-700" : "text-gray-700"}>Home</span>
            </div>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer ${
                formData.addressType === "work"
                  ? "bg-primary-50 border border-primary-200"
                  : "bg-gray-50 border border-gray-200"
              }`}
              onClick={() => {
                setFormData((prev) => ({ ...prev, addressType: "work" }))
                setIsFormSaved(false)
              }}
            >
              <MapPin size={18} className={formData.addressType === "work" ? "text-primary-600" : "text-gray-500"} />
              <span className={formData.addressType === "work" ? "text-primary-700" : "text-gray-700"}>Work</span>
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div className="flex justify-center mt-6" variants={itemVariants}>
          <motion.button
            className={`flex items-center gap-2 py-2.5 px-6 rounded-xl transition-all duration-300 font-medium text-white ${
              Object.values(formData).some((val) => typeof val === "string" && !val.trim())
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary-600 hover:bg-primary-700 shadow-sm"
            }`}
            type="submit"
            disabled={Object.values(formData).some((val) => typeof val === "string" && !val.trim())}
            whileHover={
              !Object.values(formData).some((val) => typeof val === "string" && !val.trim()) ? { scale: 1.02 } : {}
            }
            whileTap={
              !Object.values(formData).some((val) => typeof val === "string" && !val.trim()) ? { scale: 0.98 } : {}
            }
          >
            <Save size={16} />
            <span>Save Address</span>
          </motion.button>
        </motion.div>
      </form>

      {/* Navigation Buttons */}
      <motion.div
        className="flex justify-between bg-gray-50 px-6 py-4 border-t border-gray-100"
        variants={itemVariants}
      >
        <motion.button
          className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-5 rounded-xl transition-all duration-200 shadow-sm"
          type="button"
          onClick={() => setCurrentStep(0)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </motion.button>

        <motion.button
          className={`flex items-center gap-2 py-2 px-5 rounded-xl font-medium text-white transition-all duration-200 ${
            isFormSaved ? "bg-primary-600 hover:bg-primary-700 shadow-sm" : "bg-gray-400 cursor-not-allowed"
          }`}
          type="button"
          onClick={() => isFormSaved && setCurrentStep(2)}
          disabled={!isFormSaved}
          whileHover={isFormSaved ? { scale: 1.02 } : {}}
          whileTap={isFormSaved ? { scale: 0.98 } : {}}
        >
          <span>Continue</span>
          <ArrowRight size={16} />
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default AddressEdit;