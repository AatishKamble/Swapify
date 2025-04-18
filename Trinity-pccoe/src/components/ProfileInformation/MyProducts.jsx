import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { cancelRequest, getSellProducts } from "../../State/Product/Action.js"
import { Package, MapPin, Tag, CheckCircle, Clock, XCircle, Trash2, ArrowLeft, Plus } from "lucide-react"

const MyProducts = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const product = useSelector((store) => store.product)
  const [filter, setFilter] = useState("all") // all, pending, approved, rejected
  const [cancellingRequests, setCancellingRequests] = useState({})

  useEffect(() => {
    dispatch(getSellProducts())
    console.log("Fetching products...", product)
  }, [dispatch])

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

  const getStatusDetails = (status) => {
    switch (status) {
      case "Request_Approved":
        return {
          icon: <CheckCircle size={16} />,
          color: "bg-green-50 text-green-600",
          label: "Approved",
        }
      case "Request_Rejected":
        return {
          icon: <XCircle size={16} />,
          color: "bg-red-50 text-red-600",
          label: "Rejected",
        }
      case "sellrequest":
      case "pending":
        return {
          icon: <Clock size={16} />,
          color: "bg-amber-50 text-amber-600",
          label: "Pending",
        }
      case "cancelrequest":
        return {
          icon: <Trash2 size={16} />,
          color: "bg-orange-50 text-orange-600",
          label: "Cancel Requested",
        }
      case "Cancel_Approved":
        return {
          icon: <XCircle size={16} />,
          color: "bg-gray-50 text-gray-600",
          label: "Cancelled",
        }
      case "Sold":
        return {
          icon: <Tag size={16} />,
          color: "bg-blue-50 text-blue-600",
          label: "Sold",
        }
      default:
        return {
          icon: <Clock size={16} />,
          color: "bg-gray-50 text-gray-600",
          label: status || "Unknown",
        }
    }
  }

  // Filter products based on status
  const filteredProducts = Array.isArray(product.products)
    ? product.products.filter((item) => {
        if (filter === "all") return true
        if (filter === "pending") return item.state === "sellrequest" || item.state === "pending"
        if (filter === "approved") return item.state === "Request_Approved"
        if (filter === "rejected") return item.state === "Request_Rejected"
        if (filter === "cancelled") return item.state === "cancelrequest" || item.state === "Cancel_Approved"
        if (filter === "sold") return item.state === "Sold"
        return true
      })
    : []

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
        {/* Header with back button */}
        <motion.div className="flex items-center gap-4 mb-6" variants={itemVariants}>
          <button
            onClick={() => navigate("/profile")}
            className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">My Products</h1>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          className="bg-white rounded-xl shadow-sm mb-6 p-1 gap-2 flex overflow-x-auto"
          variants={itemVariants}
        >
          <button
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors ${
              filter === "all" ? "bg-primary-600 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors ${
              filter === "pending" ? "bg-amber-500 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors ${
              filter === "approved" ? "bg-green-500 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setFilter("approved")}
          >
            Approved
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors ${
              filter === "sold" ? "bg-blue-500 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setFilter("sold")}
          >
            Sold
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors ${
              filter === "rejected" ? "bg-red-500 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setFilter("rejected")}
          >
            Rejected
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors ${
              filter === "cancelled" ? "bg-gray-500 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setFilter("cancelled")}
          >
            Cancelled
          </button>
        </motion.div>

        {/* Add new product button */}
        <motion.div className="mb-6" variants={itemVariants}>
          <motion.button
            onClick={() => navigate("/sell-product")}
            className="w-full py-4 bg-white border border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Plus size={20} />
            <span className="font-medium">List a New Product</span>
          </motion.button>
        </motion.div>

        {/* Products list */}
        {filteredProducts.length > 0 ? (
          <motion.div className="space-y-6" variants={containerVariants}>
            {filteredProducts.map((item) => {
              const status = getStatusDetails(item.state)

              return (
                <motion.div
                  key={item?._id}
                  className="relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                  variants={itemVariants}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex flex-col md:flex-row">
                    <div
                      className="w-full md:w-40 h-40 bg-gray-50 flex-shrink-0 cursor-pointer overflow-hidden relative"
                      // onClick={() => navigate(`/product/${item?._id}`)}
                    >
                      <img
                        src={item.images?.[0]?.imageUrl || "/placeholder.svg?height=160&width=160"}
                        alt={item?.productName || "Product"}
                        className="w-full h-full object-contain p-2 rounded-xl transition-transform duration-300 hover:scale-105"
                      />
                      {item.state === "Sold" && (
                        <div className="absolute bottom-0 left-0 bg-blue-600 text-white px-3 py-1 text-xs font-bold uppercase">
                          Sold
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              className="text-lg font-medium text-gray-800 hover:text-gray-600 cursor-pointer transition-colors"
                              // onClick={() => navigate(`/product/${item?._id}`)}
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
          </motion.div>
        ) : (
          <motion.div className="text-center py-16 bg-white rounded-2xl shadow-sm" variants={itemVariants}>
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">
              {filter === "all" ? "You haven't listed any products yet." : `You don't have any ${filter} products.`}
            </p>
            <button
              onClick={() => navigate("/sell-product")}
              className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors duration-200"
            >
              Start Selling
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default MyProducts;