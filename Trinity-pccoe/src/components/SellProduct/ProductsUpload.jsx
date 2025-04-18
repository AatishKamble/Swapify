import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getSellProducts, sellProduct } from "../../State/Product/Action"
import { getAddresses } from "../../State/Address/Action"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Upload,
  MapPin,
  FileText,
  Image,
  X,
  AlertCircle,
  CheckCircle,
  Plus,
  Home,
  Phone,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

const ProductsUpload = ({ selectedCategory, backButton }) => {
  const nav = useNavigate()
  const jwt = localStorage.getItem("jwt")
  const dispatch = useDispatch()
  const { addresses = [], loading: addressesLoading } = useSelector((state) => state.address || {})

  const [productName, setProductName] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [expectedPrice, setExpectedPrice] = useState("")
  const [images, setImages] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [previewImages, setPreviewImages] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  // Address related states
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [showAddressList, setShowAddressList] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addressFormData, setAddressFormData] = useState({
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
  const [addressErrors, setAddressErrors] = useState({})

  // Fetch addresses on component mount
  useEffect(() => {
    dispatch(getAddresses())
  }, [dispatch])

  // Set default address when addresses are loaded
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      // Find default address or use the first one
      const defaultAddress = addresses.find((addr) => addr.isDefault) || addresses[0]
      if (defaultAddress && !selectedAddressId) {
        setSelectedAddressId(defaultAddress._id)
      }
    }
  }, [addresses])

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setImages((prevImages) => [...prevImages, ...files])

    // Create preview URLs
    const newPreviews = files.map((file) => URL.createObjectURL(file))
    setPreviewImages((prevPreviews) => [...prevPreviews, ...newPreviews])
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    setImages((prevImages) => [...prevImages, ...files])

    // Create preview URLs
    const newPreviews = files.map((file) => URL.createObjectURL(file))
    setPreviewImages((prevPreviews) => [...prevPreviews, ...newPreviews])
  }

  const removeImage = (index) => {
    // Create new arrays without the removed image
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)

    const newPreviews = [...previewImages]
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviews[index])
    newPreviews.splice(index, 1)
    setPreviewImages(newPreviews)
  }

  const handleAddressSelect = (address) => {
    setSelectedAddressId(address._id)
    setShowAddressList(false)
  }

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target
    setAddressFormData((prev) => ({ ...prev, [name]: value }))
    setAddressErrors((prev) => ({ ...prev, [name]: value ? "" : "This field is required" }))
  }

  const validateAddressForm = () => {
    const newErrors = {}
    Object.keys(addressFormData).forEach((key) => {
      if (key !== "_id" && key !== "isDefault" && !addressFormData[key].toString().trim()) {
        newErrors[key] = "This field is required"
      }
    })

    // Validate pincode format (6 digits)
    if (addressFormData.pincode && !/^\d{6}$/.test(addressFormData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits"
    }

    // Validate phone format (10 digits)
    if (addressFormData.phone && !/^\d{10}$/.test(addressFormData.phone)) {
      newErrors.phone = "Phone must be 10 digits"
    }

    setAddressErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccessMessage("")
    setIsSubmitting(true)

    try {
      // Validate form data
      if (!productName || !productDescription || !expectedPrice) {
        setError("Please fill in all required product fields")
        setIsSubmitting(false)
        return
      }

      if (!selectedAddressId && !validateAddressForm()) {
        setError("Please select an address or fill in all required address fields")
        setIsSubmitting(false)
        return
      }

      if (images.length === 0) {
        setError("Please upload at least one product image")
        setIsSubmitting(false)
        return
      }

      const formData = new FormData()
      formData.append("productName", productName)
      formData.append("productDescription", productDescription)
      formData.append("expectedPrice", expectedPrice)

      // Get the selected address or use the form data
      const selectedAddress = selectedAddressId
        ? addresses.find((addr) => addr._id === selectedAddressId)
        : addressFormData

      // Format address for backend
      const addressForBackend = {
        fullName: selectedAddress.fullName,
        phone: selectedAddress.phone,
        address: selectedAddress.address,
        locality: selectedAddress.locality,
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.pincode,
        addressType: selectedAddress.addressType,
        isDefault: selectedAddress.isDefault,
      }

      formData.append("address", JSON.stringify(addressForBackend))
      formData.append("mainCategory", selectedCategory.mainCategory)
      formData.append("subcategory", selectedCategory.subcategory)

      images.forEach((image) => {
        formData.append("productimages", image)
      })

      const formDataObject = Object.fromEntries(formData.entries());
      const result = await dispatch(sellProduct(formDataObject, jwt))

      if (result.success) {
        setSuccessMessage("Product submitted successfully! It will be reviewed by our team.")
        // Fetch updated products list
        await dispatch(getSellProducts())

        // Redirect after a short delay to show the success message
        setTimeout(() => {
          nav("/account")
        }, 2000)
      } else {
        setError(result.error || "Failed to submit product. Please try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error("Error submitting product:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
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

  // Get the selected address details
  const selectedAddress = selectedAddressId ? addresses.find((addr) => addr._id === selectedAddressId) : null

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div className="max-w-4xl mx-auto" initial="hidden" animate="visible" variants={containerVariants}>
        <motion.div className="bg-white rounded-2xl shadow-xl overflow-hidden" variants={itemVariants}>
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">List Your Product</h1>
                <p className="text-gray-600 mt-1">
                  {selectedCategory.mainCategory} / {selectedCategory.subcategory}
                </p>
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-xl text-sm text-gray-600 font-medium">Step 2 of 2</div>
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Success message */}
            {successMessage && (
              <motion.div
                className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-start gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>{successMessage}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                  <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FileText size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="productName"
                      className="pl-10 block w-full rounded-xl border-gray-300 shadow-sm 
                                                    focus:border-primary-500 focus:ring-primary-500 
                                                    transition duration-200 ease-in-out
                                                    text-gray-900 py-3 px-4"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label htmlFor="expectedPrice" className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 font-medium">₹</span>
                    </div>
                    <input
                      type="text"
                      id="expectedPrice"
                      className="pl-10 block w-full rounded-xl border-gray-300 shadow-sm 
                                                    focus:border-primary-500 focus:ring-primary-500
                                                    transition duration-200 ease-in-out
                                                    text-gray-900 py-3 px-4"
                      value={expectedPrice}
                      onChange={(e) => setExpectedPrice(e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </motion.div>
              </div>

              {/* Address Selection Section */}
              <motion.fieldset
                className="space-y-4 border border-gray-200 p-6 rounded-xl bg-gray-50"
                variants={itemVariants}
              >
                <legend className="text-lg font-semibold text-gray-700 px-2 flex items-center gap-2">
                  <MapPin size={18} className="text-primary-600" />
                  Address Details
                </legend>

                {/* Address Selection */}
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-800">Select Product Location</h3>
                  <button
                    type="button"
                    onClick={() => setShowAddressList(!showAddressList)}
                    className="text-primary-600 text-sm font-medium hover:text-primary-700 transition-colors flex items-center gap-1"
                  >
                    {showAddressList ? (
                      <>
                        <ChevronUp size={16} />
                        Hide Addresses
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} />
                        Select Address
                      </>
                    )}
                  </button>
                </div>

                {/* Selected Address Display */}
                {selectedAddress && !showAddressList && (
                  <div className="p-3 border rounded-lg border-primary-200 bg-primary-50">
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        <CheckCircle size={18} className="text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-gray-800">{selectedAddress.fullName}</p>
                          {selectedAddress.isDefault && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">Default</span>
                          )}
                          <span className="text-gray-500 text-sm">{selectedAddress.phone}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {selectedAddress.address}, {selectedAddress.locality}, {selectedAddress.city},{" "}
                          {selectedAddress.state} - {selectedAddress.pincode}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

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
                      {addressesLoading ? (
                        <div className="flex justify-center py-4">
                          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                        </div>
                      ) : addresses && addresses.length > 0 ? (
                        addresses.map((address) => (
                          <motion.div
                            key={address._id}
                            className={`p-3 border rounded-lg cursor-pointer transition-all ${
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
                                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">
                                      Default
                                    </span>
                                  )}
                                  <span className="text-gray-500 text-sm">{address.phone}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  {address.address}, {address.locality}, {address.city}, {address.state} -{" "}
                                  {address.pincode}
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
                        type="button"
                        className="w-full py-2 border border-dashed border-gray-300 rounded-lg flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all"
                        whileHover={{ scale: 1.01 }}
                        onClick={() => {
                          setShowAddressList(false)
                          setShowAddressForm(true)
                          setSelectedAddressId(null)
                          setAddressFormData({
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
                        }}
                      >
                        <Plus size={16} />
                        <span className="font-medium">Add New Address</span>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Manual Address Form */}
                <AnimatePresence>
                  {(showAddressForm || (!selectedAddressId && !showAddressList)) && (
                    <motion.div
                      className="mt-4 space-y-4"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            className="block w-full rounded-xl border-gray-300 shadow-sm py-3 px-4
                                                        focus:border-primary-500 focus:ring-primary-500
                                                        transition duration-200 ease-in-out"
                            value={addressFormData.fullName}
                            onChange={handleAddressInputChange}
                            placeholder="Enter full name"
                            required
                          />
                          {addressErrors.fullName && (
                            <p className="mt-1 text-sm text-red-600">{addressErrors.fullName}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Phone size={18} className="text-gray-400" />
                            </div>
                            <input
                              type="text"
                              id="phone"
                              name="phone"
                              className="pl-10 block w-full rounded-xl border-gray-300 shadow-sm py-3 px-4
                                                        focus:border-primary-500 focus:ring-primary-500
                                                        transition duration-200 ease-in-out"
                              value={addressFormData.phone}
                              onChange={handleAddressInputChange}
                              placeholder="10-digit phone number"
                              required
                            />
                          </div>
                          {addressErrors.phone && <p className="mt-1 text-sm text-red-600">{addressErrors.phone}</p>}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                          Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin size={18} className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="address"
                            name="address"
                            className="pl-10 block w-full rounded-xl border-gray-300 shadow-sm py-3 px-4
                                                    focus:border-primary-500 focus:ring-primary-500
                                                    transition duration-200 ease-in-out"
                            value={addressFormData.address}
                            onChange={handleAddressInputChange}
                            placeholder="House No, Building, Street, Area"
                            required
                          />
                        </div>
                        {addressErrors.address && <p className="mt-1 text-sm text-red-600">{addressErrors.address}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="locality" className="block text-sm font-medium text-gray-700 mb-1">
                            Locality/Village <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="locality"
                            name="locality"
                            className="block w-full rounded-xl border-gray-300 shadow-sm py-3 px-4
                                                    focus:border-primary-500 focus:ring-primary-500
                                                    transition duration-200 ease-in-out"
                            value={addressFormData.locality}
                            onChange={handleAddressInputChange}
                            placeholder="Enter locality or village"
                            required
                          />
                          {addressErrors.locality && (
                            <p className="mt-1 text-sm text-red-600">{addressErrors.locality}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                            Pincode <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="pincode"
                            name="pincode"
                            className="block w-full rounded-xl border-gray-300 shadow-sm py-3 px-4
                                                    focus:border-primary-500 focus:ring-primary-500
                                                    transition duration-200 ease-in-out"
                            value={addressFormData.pincode}
                            onChange={handleAddressInputChange}
                            placeholder="6-digit pincode"
                            required
                          />
                          {addressErrors.pincode && (
                            <p className="mt-1 text-sm text-red-600">{addressErrors.pincode}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                            City <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            className="block w-full rounded-xl border-gray-300 shadow-sm py-3 px-4
                                                    focus:border-primary-500 focus:ring-primary-500
                                                    transition duration-200 ease-in-out"
                            value={addressFormData.city}
                            onChange={handleAddressInputChange}
                            placeholder="Enter city"
                            required
                          />
                          {addressErrors.city && <p className="mt-1 text-sm text-red-600">{addressErrors.city}</p>}
                        </div>
                        <div>
                          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                            State <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="state"
                            name="state"
                            className="block w-full rounded-xl border-gray-300 shadow-sm py-3 px-4
                                                    focus:border-primary-500 focus:ring-primary-500
                                                    transition duration-200 ease-in-out"
                            value={addressFormData.state}
                            onChange={handleAddressInputChange}
                            placeholder="Enter state"
                            required
                          />
                          {addressErrors.state && <p className="mt-1 text-sm text-red-600">{addressErrors.state}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                        <div className="flex gap-4">
                          <div
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer ${
                              addressFormData.addressType === "home"
                                ? "bg-primary-50 border border-primary-200"
                                : "bg-gray-50 border border-gray-200"
                            }`}
                            onClick={() => setAddressFormData((prev) => ({ ...prev, addressType: "home" }))}
                          >
                            <Home
                              size={18}
                              className={addressFormData.addressType === "home" ? "text-primary-600" : "text-gray-500"}
                            />
                            <span
                              className={addressFormData.addressType === "home" ? "text-primary-700" : "text-gray-700"}
                            >
                              Home
                            </span>
                          </div>
                          <div
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer ${
                              addressFormData.addressType === "work"
                                ? "bg-primary-50 border border-primary-200"
                                : "bg-gray-50 border border-gray-200"
                            }`}
                            onClick={() => setAddressFormData((prev) => ({ ...prev, addressType: "work" }))}
                          >
                            <MapPin
                              size={18}
                              className={addressFormData.addressType === "work" ? "text-primary-600" : "text-gray-500"}
                            />
                            <span
                              className={addressFormData.addressType === "work" ? "text-primary-700" : "text-gray-700"}
                            >
                              Work
                            </span>
                          </div>
                        </div>
                      </div>

                      {addresses && addresses.length > 0 && (
                        <div className="flex justify-end">
                          <button
                            type="button"
                            className="text-primary-600 text-sm font-medium hover:text-primary-700 transition-colors flex items-center gap-1"
                            onClick={() => {
                              setShowAddressForm(false)
                              setShowAddressList(true)
                            }}
                          >
                            <ArrowLeft size={16} />
                            Back to saved addresses
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.fieldset>

              <motion.div variants={itemVariants}>
                <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={6}
                  id="productDescription"
                  className="block w-full rounded-xl border-gray-300 shadow-sm 
                                            focus:border-primary-500 focus:ring-primary-500
                                            transition duration-200 ease-in-out
                                            text-gray-900 py-3 px-4 resize-none"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="Describe your product in detail. Include condition, features, and any other relevant information."
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Images <span className="text-red-500">*</span>
                </label>
                <div
                  className={`mt-1 flex flex-col justify-center px-6 pt-5 pb-6 border-2 ${isDragging ? "border-primary-500 bg-primary-50" : "border-gray-300 border-dashed"} rounded-xl transition-colors duration-200`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="space-y-2 text-center">
                    <Image className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label
                        htmlFor="images"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500 px-4 py-2 shadow-sm transition-colors duration-200"
                      >
                        <span>Upload files</span>
                        <input
                          id="images"
                          type="file"
                          className="sr-only"
                          multiple
                          onChange={handleImageChange}
                          required={images.length === 0}
                        />
                      </label>
                      <p className="pl-1 flex items-center">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>

                  {/* Image previews */}
                  {previewImages.length > 0 && (
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {previewImages.map((preview, index) => (
                        <div key={index} className="relative group">
                          <div className="h-24 rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                            <img
                              src={preview || "/placeholder.svg"}
                              alt={`Preview ${index}`}
                              className="h-full w-full object-contain"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-1 shadow-sm transition-colors duration-200"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div className="flex justify-between pt-4 border-t border-gray-200" variants={itemVariants}>
                <motion.button
                  type="button"
                  onClick={backButton}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 
                                            rounded-xl shadow-sm text-base font-medium text-gray-700 
                                            bg-white hover:bg-gray-50 
                                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                                            transition duration-200 ease-in-out"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                >
                  <ArrowLeft size={18} className="mr-2" />
                  Back to Categories
                </motion.button>
                <motion.button
                  type="submit"
                  className={`inline-flex items-center px-6 py-3 border border-transparent 
                                            rounded-xl shadow-sm text-base font-medium text-white 
                                            ${isSubmitting ? "bg-primary-400" : "bg-primary-600 hover:bg-primary-700"} 
                                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                                            transition duration-200 ease-in-out`}
                  whileHover={
                    !isSubmitting
                      ? {
                          scale: 1.02,
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                        }
                      : {}
                  }
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload size={18} className="mr-2" />
                      List Product
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default ProductsUpload;