import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { cancelRequest, getSellProducts } from "../../State/Product/Action"
import { useNavigate } from "react-router-dom"
import {
  Trash2,
  ChevronDown,
  Edit2,
  AlertCircle,
  User,
  Mail,
  MapPin,
  Tag,
  Package,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react"

const AccountDetail = () => {
  const user = useSelector((store) => store.auth)
  const product = useSelector((store) => store.product)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [openIndex, setOpenIndex] = useState(null)
  const [editMode, setEditMode] = useState({
    personalInfo: false,
    email: false,
  })
  const [formData, setFormData] = useState({
    firstName: user.user?.firstName || "",
    lastName: user.user?.lastName || "",
    email: user.user?.email || "",
  })

  useEffect(() => {
    dispatch(getSellProducts())
  }, [dispatch])

  useEffect(() => {
    if (user.user) {
      setFormData({
        firstName: user.user.firstName || "",
        lastName: user.user.lastName || "",
        email: user.user.email || "",
      })
    }
  }, [user.user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleEdit = (section) => {
    setEditMode((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleSave = (section) => {
    // Here you would dispatch an action to update the user data
    // For now, we'll just toggle edit mode off
    setEditMode((prev) => ({
      ...prev,
      [section]: false,
    }))
  }

  const cancelReq = (id) => {
    dispatch(cancelRequest(id))
    dispatch(getSellProducts())
  }

  const getStatusDetails = (status) => {
    if(status.includes("Approved")){
      status = "approved"
    }else if(status.includes("Pending")){
      status = "pending"
    }else if(status.includes("Rejected")){
      status = "rejected"
    }
    
    switch (status) {
      case "approved":
        return {
          icon: <CheckCircle size={16} />,
          color: "bg-green-50 text-green-600",
          label: "Approved",
        }
      case "pending":
      case "sellrequest":
        return {
          icon: <Clock size={16} />,
          color: "bg-amber-50 text-amber-600",
          label: "Pending",
        }
      case "rejected":
        return {
          icon: <XCircle size={16} />,
          color: "bg-red-50 text-red-600",
          label: "Rejected",
        }
      default:
        return {
          icon: <Clock size={16} />,
          color: "bg-gray-50 text-gray-600",
          label: status || "Unknown",
        }
    }
  }

  const faqs = [
    {
      question: "What happens when I update my email address (or mobile number)?",
      answer:
        "Your login email id (or mobile number) changes, likewise. You'll receive all your account-related communication on your updated email address (or mobile number).",
    },
    {
      question: "When will my account be updated with the new email address (or mobile number)?",
      answer:
        "It happens as soon as you confirm the verification code sent to your email (or mobile) and save the changes.",
    },
    {
      question: "What happens to my existing account when I update my email address (or mobile number)?",
      answer:
        "Updating your email address (or mobile number) doesn't invalidate your account. Your account remains fully functional.",
    },
    {
      question: "Does my seller account get affected when I update my email address?",
      answer: "Any changes will reflect in your Seller account also.",
    },
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <motion.div
      className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-5xl mx-auto">
        <motion.h1 className="text-2xl font-bold text-gray-800 mb-6" variants={itemVariants}>
          Account Details
        </motion.h1>

        {/* Personal Information */}
        <motion.div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100" variants={itemVariants}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <User size={20} className="text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
            </div>
            <button
              onClick={() => handleEdit("personalInfo")}
              className="text-gray-600 hover:text-gray-800 flex items-center gap-1 text-sm font-medium transition-colors duration-200 rounded-full px-3 py-1 hover:bg-gray-100"
            >
              <Edit2 size={16} />
              {editMode.personalInfo ? "Cancel" : "Edit"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-600 mb-1">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!editMode.personalInfo}
                className={`w-full p-3 border ${
                  editMode.personalInfo ? "border-gray-300" : "border-gray-200 bg-gray-50"
                } rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all duration-200 outline-none`}
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-600 mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!editMode.personalInfo}
                className={`w-full p-3 border ${
                  editMode.personalInfo ? "border-gray-300" : "border-gray-200 bg-gray-50"
                } rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all duration-200 outline-none`}
              />
            </div>
          </div>

          {editMode.personalInfo && (
            <motion.div
              className="mt-4 flex justify-end"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => handleSave("personalInfo")}
                className="px-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors duration-200"
              >
                Save Changes
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Email Address */}
        <motion.div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100" variants={itemVariants}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Mail size={20} className="text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-800">Email Address</h2>
            </div>
            <button
              onClick={() => handleEdit("email")}
              className="text-gray-600 hover:text-gray-800 flex items-center gap-1 text-sm font-medium transition-colors duration-200 rounded-full px-3 py-1 hover:bg-gray-100"
            >
              <Edit2 size={16} />
              {editMode.email ? "Cancel" : "Edit"}
            </button>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!editMode.email}
              className={`w-full p-3 border ${
                editMode.email ? "border-gray-300" : "border-gray-200 bg-gray-50"
              } rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all duration-200 outline-none`}
            />
          </div>

          {editMode.email && (
            <motion.div
              className="mt-4 flex justify-end"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => handleSave("email")}
                className="px-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors duration-200"
              >
                Save Changes
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Seller Products */}
        <motion.div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100" variants={itemVariants}>
          <div className="flex items-center gap-2 mb-6">
            <Package size={20} className="text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-800">Your Products</h2>
          </div>

          {Array.isArray(product.products) && product.products.length > 0 ? (
            <div className="space-y-6">
              {product.products.map((item) => {
                const status = getStatusDetails(item.state)

                return (
                  <motion.div
                    key={item?._id}
                    className="relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex flex-col md:flex-row">
                      <div
                        className="w-full md:w-40 h-40 bg-gray-50 flex-shrink-0 cursor-pointer overflow-hidden"
                        onClick={() => navigate(`/product/${item?._id}`)}
                      >
                        <img
                          src={item.images[0]?.imageUrl || "/placeholder.svg?height=160&width=160"}
                          alt={item?.productName || "Product"}
                          className="w-full h-full object-contain p-2 rounded-lg transition-transform duration-300 hover:scale-105"
                        />
                      </div>

                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3
                                className="text-lg font-medium text-gray-800 hover:text-gray-600 cursor-pointer transition-colors"
                                onClick={() => navigate(`/product/${item?._id}`)}
                              >
                                {item?.productName}
                              </h3>
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}
                              >
                                {status.icon}
                                <span>{status.label}</span>
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">{item?.productDescription}</p>
                            <p className="text-lg font-semibold text-gray-800 mt-2">₹{item?.expectedPrice}</p>
                          </div>

                          <div className="flex flex-row md:flex-col justify-between md:items-end gap-4 mt-2 md:mt-0">
                            <div className="flex items-start gap-2 text-sm text-gray-600">
                              <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                              <div>
                                <p>
                                  {item?.address?.[0]?.city}, {item?.address?.[0]?.state}
                                </p>
                                <p>{item?.address?.[0]?.pincode}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Tag size={16} className="text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">
                                {item?.category?.name || "Uncategorized"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {item.state === "sellrequest" || item.state === "pending" ? (
                          <motion.button
                            onClick={() => cancelReq(item?._id)}
                            className="self-start mt-4 flex items-center gap-1 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors duration-200 text-sm font-medium"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Trash2 size={16} />
                            <span>Cancel Request</span>
                          </motion.button>
                        ) : null}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <Package size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">You haven't listed any products yet.</p>
              <button
                onClick={() => navigate("/sell-product")}
                className="px-6 py-2.5 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors duration-200"
              >
                Start Selling
              </button>
            </div>
          )}
        </motion.div>

        {/* FAQs */}
        <motion.div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100" variants={itemVariants}>
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle size={20} className="text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-800">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-100 rounded-xl overflow-hidden">
                <button
                  className={`w-full text-left py-4 px-5 flex justify-between items-center focus:outline-none group ${openIndex === index ? "bg-gray-50" : "bg-white"}`}
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="font-medium text-gray-800 group-hover:text-gray-600 transition-colors">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-500"
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden bg-white border-t border-gray-100"
                    >
                      <p className="text-gray-600 py-4 px-5 italic">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Account Actions */}
        <motion.div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100" variants={itemVariants}>
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Account Actions</h2>

          <div className="space-y-4">
            <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="text-base font-medium text-gray-800 mb-2">Deactivate Account</h3>
              <p className="text-sm text-gray-600 mb-4">
                Temporarily disable your account. You can reactivate it anytime by logging in.
              </p>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                Deactivate Account
              </button>
            </div>

            <div className="p-5 bg-red-50 rounded-xl border border-red-100">
              <h3 className="text-base font-medium text-red-800 mb-2">Delete Account</h3>
              <p className="text-sm text-red-700 mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <button className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200">
                Delete Account
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default AccountDetail

