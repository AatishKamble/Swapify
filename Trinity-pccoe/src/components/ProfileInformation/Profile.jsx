import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { logout } from "../../State/Auth/Action.js"
import { cancelRequest, getSellProducts } from "../../State/Product/Action.js"
import { getUserReviews } from "../../State/Review/Action.js"
import Profilecard from "../ProfileCard/Profilecard.jsx"
import ReviewItem from "../Reviews/ReviewItem.jsx"
import {
  ShoppingBag,
  Heart,
  MapPin,
  LogOut,
  Edit2,
  Package,
  AlertCircle,
  ChevronDown,
  Tag,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
  Trash2,
  MessageSquare,
  Star,
} from "lucide-react"

export default function Profile() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((store) => store.auth)
  const product = useSelector((store) => store.product)
  const { userReviews, loading: reviewsLoading } = useSelector((store) => store.review || { userReviews: [] })

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

  // Fetch user's products and reviews
  useEffect(() => {
    dispatch(getSellProducts())
    dispatch(getUserReviews())
  }, [dispatch])

  // Update form data when user data changes
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

  const handleLogout = () => {
    dispatch(logout())
    navigate("/signin")
  }

  const [cancellingRequests, setCancellingRequests] = useState({})

  const cancelReq = (id) => {
    // Set this product as being cancelled
    setCancellingRequests((prev) => ({ ...prev, [id]: true }))

    // Dispatch the cancel request
    dispatch(cancelRequest(id))
      .then(() => {
        // Refresh products after successful cancellation
        dispatch(getSellProducts())
      })
      .catch((error) => {
        console.error("Error cancelling request:", error)
        // Reset cancelling state if there's an error
        setCancellingRequests((prev) => ({ ...prev, [id]: false }))
      })
  }

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const getStatusDetails = (status) => {
    if (status.includes("Approved")) {
      status = "approved"
    } else if (status.includes("Pending")) {
      status = "pending"
    } else if (status.includes("Rejected")) {
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

  // Handle review update
  const handleReviewUpdated = () => {
    dispatch(getUserReviews())
  }

  // FAQs data
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
    <motion.div
      className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Account</h1>
          <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600">Manage your profile, orders, and preferences</p>
        </motion.div>

        {/* User Information Card */}
        <motion.div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100" variants={itemVariants}>
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* User Avatar */}
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-2xl flex-shrink-0">
              {user.user?.firstName?.[0]}
              {user.user?.lastName?.[0]}
            </div>

            {/* User Details */}
            <div className="flex-1 text-center md:text-left flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col justify-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                  {user.user?.firstName} {user.user?.lastName}
                </h2>
                <p className="text-gray-600">{user.user?.email}</p>
              </div>

              <button
                onClick={() => navigate("/profile-edit")}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors mt-4 md:mt-0 self-center md:self-auto"
              >
                <Edit2 size={16} />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div className="mb-8" variants={containerVariants}>
          <motion.h2 className="text-xl font-semibold text-gray-800 mb-4 px-1" variants={itemVariants}>
            Quick Actions
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 md:gap-6"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Link to="/orders" className="block no-underline text-inherit">
                <Profilecard
                  title="Your Orders"
                  subtitle="Track and manage your purchases"
                  icon={<ShoppingBag size={24} />}
                />
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link to="/wishlist" className="block no-underline text-inherit">
                <Profilecard title="Your Wishlist" subtitle="View your saved items" icon={<Heart size={24} />} />
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link to="/addresses" className="block no-underline text-inherit">
                <Profilecard title="Address" subtitle="Manage your delivery locations" icon={<MapPin size={24} />} />
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link to="/my-products" className="block no-underline text-inherit">
                <Profilecard title="My Products" subtitle="Manage your listed products" icon={<Package size={24} />} />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* My Reviews Section */}
        <motion.div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100" variants={itemVariants}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <MessageSquare size={20} className="text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-800">Your Reviews</h2>
            </div>

            <Link
              to="/my-reviews"
              className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
            >
              View All
              <ChevronRight size={16} />
            </Link>
          </div>

          {reviewsLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          ) : userReviews && userReviews.length > 0 ? (
            <div className="space-y-6">
              {/* Show only first 2 reviews as preview */}
              {userReviews.slice(0, 2).map((review) => (
                <ReviewItem
                  key={review._id}
                  review={review}
                  isUserReview={true}
                  onReviewUpdated={handleReviewUpdated}
                />
              ))}

              {userReviews.length > 2 && (
                <div className="text-center pt-2">
                  <Link
                    to="/my-reviews"
                    className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  >
                    View all {userReviews.length} reviews
                    <ChevronRight size={16} />
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <Star size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">You haven't reviewed any products yet.</p>
              <button
                onClick={() => navigate("/products")}
                className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors duration-200"
              >
                Browse Products
              </button>
            </div>
          )}
        </motion.div>

        {/* My Products Preview Section */}
        <motion.div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100" variants={itemVariants}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Package size={20} className="text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-800">Your Products</h2>
            </div>

            <Link
              to="/my-products"
              className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
            >
              View All
              <ChevronRight size={16} />
            </Link>
          </div>

          {Array.isArray(product.products) && product.products.length > 0 ? (
            <div className="space-y-6">
              {/* Show only first 2 products as preview */}
              {product.products.slice(0, 2).map((item) => {
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
                          src={item.images?.[0]?.imageUrl || "/placeholder.svg?height=160&width=160"}
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

                        {(item.state === "sellrequest" || item.state === "pending") &&
                          (cancellingRequests[item?._id] ? (
                            <div className="self-start mt-4 flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-500 rounded-xl text-sm font-medium">
                              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                              <span>Cancelling...</span>
                            </div>
                          ) : (
                            <motion.button
                              onClick={() => cancelReq(item?._id)}
                              className="self-start mt-4 flex items-center gap-1 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors duration-200 text-sm font-medium"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Trash2 size={16} />
                              <span>Cancel Request</span>
                            </motion.button>
                          ))}
                      </div>
                    </div>
                  </motion.div>
                )
              })}

              {product.products.length > 2 && (
                <div className="text-center pt-2">
                  <Link
                    to="/my-products"
                    className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  >
                    View all {product.products.length} products
                    <ChevronRight size={16} />
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <Package size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">You haven't listed any products yet.</p>
              <button
                onClick={() => navigate("/sell-product")}
                className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors duration-200"
              >
                Start Selling
              </button>
            </div>
          )}
        </motion.div>

        {/* FAQs Section */}
        <motion.div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100" variants={itemVariants}>
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
        <motion.div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100" variants={itemVariants}>
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

        {/* Logout Button */}
        <motion.div className="flex justify-center mb-8" variants={itemVariants}>
          <motion.button
            onClick={handleLogout}
            className="flex items-center gap-2 px-8 py-3 bg-gray-800 text-white rounded-xl shadow-md hover:bg-gray-700 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}
