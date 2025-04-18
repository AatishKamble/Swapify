import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { getOrderHistory, cancelOrder } from "../../State/Order/Action.js"
import { ShoppingBag, Calendar, Package, ChevronRight, X, Search, Filter, ChevronDown, Clock, CheckCircle, Truck, Home, AlertCircle, AlertTriangle } from 'lucide-react'
import OrderDetailDialog from "./OrderDetailDialog"

const Orders = () => {
  const dispatch = useDispatch()
  const { orders, loading, error } = useSelector((state) => state.order)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [sortOrder, setSortOrder] = useState("newest")
  const [showSortMenu, setShowSortMenu] = useState(false)
  
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderDetail, setShowOrderDetail] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [orderToCancel, setOrderToCancel] = useState(null)
  const [isCancelling, setIsCancelling] = useState(false)
  const [cancelError, setCancelError] = useState("")

  // Refs for dropdown menus
  const filterMenuRef = useRef(null)
  const sortMenuRef = useRef(null)

  // Fetch orders on component mount
  useEffect(() => {
    dispatch(getOrderHistory())
  }, [dispatch])

  // Handle clicks outside of dropdown menus
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setShowFilterMenu(false)
      }
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
        setShowSortMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Filter orders based on search query and status
  const filteredOrders = Array.isArray(orders) 
    ? orders.filter(order => {
        // Filter by status
        if (filterStatus !== "all" && order.orderStatus !== filterStatus) {
          return false
        }
        
        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          const orderId = order._id?.toLowerCase() || ""
          const productNames = order.orderItems?.map(item => 
            item.product?.title?.toLowerCase() || ""
          ).join(" ")
          
          return orderId.includes(query) || productNames.includes(query)
        }
        
        return true
      })
    : []

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt)
    } else if (sortOrder === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt)
    } else if (sortOrder === "price-high") {
      return b.totalPrice - a.totalPrice
    } else if (sortOrder === "price-low") {
      return a.totalPrice - b.totalPrice
    }
    return 0
  })

  // Handle order click
  const handleOrderClick = (order) => {
    setSelectedOrder(order)
    setShowOrderDetail(true)
  }

  // Handle cancel order
  const handleCancelOrder = (order, e) => {
    e.stopPropagation() // Prevent opening the order detail
    setOrderToCancel(order)
    setShowCancelConfirm(true)
    setCancelError("")
  }

  // Confirm cancel order
  const confirmCancelOrder = async () => {
    if (!orderToCancel) return
    
    setIsCancelling(true)
    setCancelError("")
    
    try {
      await dispatch(cancelOrder(orderToCancel._id))
      setShowCancelConfirm(false)
      setOrderToCancel(null)
      
      // Refresh orders list
      dispatch(getOrderHistory())
    } catch (error) {
      setCancelError(error.message || "Failed to cancel order. Please try again.")
    } finally {
      setIsCancelling(false)
    }
  }

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "PLACED":
        return (
          <span className="px-2.5 py-1 inline-flex items-center text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-100">
            <Package size={12} className="mr-1" />
            Placed
          </span>
        )
      case "CONFIRMED":
        return (
          <span className="px-2.5 py-1 inline-flex items-center text-xs font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-100">
            <CheckCircle size={12} className="mr-1" />
            Confirmed
          </span>
        )
      case "SHIPPED":
        return (
          <span className="px-2.5 py-1 inline-flex items-center text-xs font-medium rounded-full bg-purple-50 text-purple-700 border border-purple-100">
            <Truck size={12} className="mr-1" />
            Shipped
          </span>
        )
      case "DELIVERED":
        return (
          <span className="px-2.5 py-1 inline-flex items-center text-xs font-medium rounded-full bg-green-50 text-green-700 border border-green-100">
            <Home size={12} className="mr-1" />
            Delivered
          </span>
        )
      case "CANCELLED":
        return (
          <span className="px-2.5 py-1 inline-flex items-center text-xs font-medium rounded-full bg-red-50 text-red-700 border border-red-100">
            <X size={12} className="mr-1" />
            Cancelled
          </span>
        )
      default:
        return (
          <span className="px-2.5 py-1 inline-flex items-center text-xs font-medium rounded-full bg-gray-50 text-gray-700 border border-gray-100">
            <Clock size={12} className="mr-1" />
            Processing
          </span>
        )
    }
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    
    try {
      const date = new Date(dateString)
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid Date"
      }
      
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid Date"
    }
  }

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${(amount || 0).toLocaleString("en-IN")}`
  }

  // Check if order can be cancelled
  const canCancelOrder = (order) => {
    return order.orderStatus === "PLACED" || order.orderStatus === "CONFIRMED"
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-5xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Orders</h1>
          <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600">Track and manage your orders</p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm mb-6 p-4 flex flex-col sm:flex-row gap-4 items-center justify-between"
          variants={itemVariants}
        >
          {/* Search */}
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-transparent transition-all duration-200 w-full sm:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            {/* Filter Dropdown */}
            <div className="relative" ref={filterMenuRef}>
              <button
                className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
                onClick={() => setShowFilterMenu(!showFilterMenu)}
              >
                <Filter size={18} />
              </button>

              {showFilterMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-10 border border-gray-100">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Filter by Status</div>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${filterStatus === "all" ? "bg-gray-100 text-gray-800" : "text-gray-700 hover:bg-gray-50"}`}
                    onClick={() => {
                      setFilterStatus("all")
                      setShowFilterMenu(false)
                    }}
                  >
                    All Orders
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${filterStatus === "PLACED" ? "bg-gray-100 text-gray-800" : "text-gray-700 hover:bg-gray-50"}`}
                    onClick={() => {
                      setFilterStatus("PLACED")
                      setShowFilterMenu(false)
                    }}
                  >
                    Placed
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${filterStatus === "CONFIRMED" ? "bg-gray-100 text-gray-800" : "text-gray-700 hover:bg-gray-50"}`}
                    onClick={() => {
                      setFilterStatus("CONFIRMED")
                      setShowFilterMenu(false)
                    }}
                  >
                    Confirmed
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${filterStatus === "SHIPPED" ? "bg-gray-100 text-gray-800" : "text-gray-700 hover:bg-gray-50"}`}
                    onClick={() => {
                      setFilterStatus("SHIPPED")
                      setShowFilterMenu(false)
                    }}
                  >
                    Shipped
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${filterStatus === "DELIVERED" ? "bg-gray-100 text-gray-800" : "text-gray-700 hover:bg-gray-50"}`}
                    onClick={() => {
                      setFilterStatus("DELIVERED")
                      setShowFilterMenu(false)
                    }}
                  >
                    Delivered
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${filterStatus === "CANCELLED" ? "bg-gray-100 text-gray-800" : "text-gray-700 hover:bg-gray-50"}`}
                    onClick={() => {
                      setFilterStatus("CANCELLED")
                      setShowFilterMenu(false)
                    }}
                  >
                    Cancelled
                  </button>
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex-1 sm:flex-none" ref={sortMenuRef}>
              <button
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium w-full sm:w-auto justify-between sm:justify-start"
                onClick={() => setShowSortMenu(!showSortMenu)}
              >
                <span>
                  {sortOrder === "newest" && "Newest First"}
                  {sortOrder === "oldest" && "Oldest First"}
                  {sortOrder === "price-high" && "Price: High to Low"}
                  {sortOrder === "price-low" && "Price: Low to High"}
                </span>
                <ChevronDown size={16} />
              </button>

              {showSortMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-10 border border-gray-100">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Sort By</div>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${sortOrder === "newest" ? "bg-gray-100 text-gray-800" : "text-gray-700 hover:bg-gray-50"}`}
                    onClick={() => {
                      setSortOrder("newest")
                      setShowSortMenu(false)
                    }}
                  >
                    Newest First
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${sortOrder === "oldest" ? "bg-gray-100 text-gray-800" : "text-gray-700 hover:bg-gray-50"}`}
                    onClick={() => {
                      setSortOrder("oldest")
                      setShowSortMenu(false)
                    }}
                  >
                    Oldest First
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${sortOrder === "price-high" ? "bg-gray-100 text-gray-800" : "text-gray-700 hover:bg-gray-50"}`}
                    onClick={() => {
                      setSortOrder("price-high")
                      setShowSortMenu(false)
                    }}
                  >
                    Price: High to Low
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${sortOrder === "price-low" ? "bg-gray-100 text-gray-800" : "text-gray-700 hover:bg-gray-50"}`}
                    onClick={() => {
                      setSortOrder("price-low")
                      setShowSortMenu(false)
                    }}
                  >
                    Price: Low to High
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Orders List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <motion.div 
            className="bg-red-50 border border-red-100 rounded-xl p-6 text-center text-red-700 flex flex-col items-center"
            variants={itemVariants}
          >
            <AlertCircle size={40} className="mb-4 text-red-500" />
            <h3 className="text-lg font-medium mb-2">Error Loading Orders</h3>
            <p>{error}</p>
          </motion.div>
        ) : sortedOrders.length > 0 ? (
          <motion.div className="space-y-6" variants={containerVariants}>
            {sortedOrders.map((order) => (
              <motion.div
                key={order._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
                variants={itemVariants}
                whileHover={{ y: -2 }}
                onClick={() => handleOrderClick(order)}
              >
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800">Order #{order._id?.substring(order._id.length - 8).toUpperCase()}</h3>
                        {getStatusBadge(order.orderStatus)}
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{formatDate(order.createdAt)}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="font-bold text-gray-800">{formatCurrency(order.totalPrice)}</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700 mb-2">Items</p>
                        <div className="space-y-2">
                          {order.orderItems?.map((item, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                <img 
                                  src={item.product?.imageURL || "/placeholder.svg?height=40&width=40"} 
                                  alt={item.product?.title || "Product"} 
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">{item.product?.title}</p>
                                <p className="text-xs text-gray-500">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center self-end mt-4 sm:mt-0 gap-3">
                        {/* Cancel Order Button - Only show for orders that can be cancelled */}
                        {canCancelOrder(order) && (
                          <button 
                            className="px-3 py-1.5 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
                            onClick={(e) => handleCancelOrder(order, e)}
                          >
                            Cancel Order
                          </button>
                        )}
                        
                        <button className="flex items-center gap-1 text-primary-600 text-sm font-medium">
                          <span>View Details</span>
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center"
            variants={itemVariants}
          >
            <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No Orders Found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || filterStatus !== "all" 
                ? "Try changing your search or filter criteria" 
                : "You haven't placed any orders yet"}
            </p>
            {(searchQuery || filterStatus !== "all") && (
              <button 
                onClick={() => {
                  setSearchQuery("")
                  setFilterStatus("all")
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Order Detail Dialog */}
      {selectedOrder && (
        <OrderDetailDialog 
          order={selectedOrder} 
          isOpen={showOrderDetail} 
          onClose={() => setShowOrderDetail(false)} 
        />
      )}

      {/* Cancel Order Confirmation Dialog */}
      <AnimatePresence>
        {showCancelConfirm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isCancelling && setShowCancelConfirm(false)}
          >
            <motion.div 
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-full text-red-600">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Cancel Order</h3>
              </div>
              
              <p className="text-gray-600 mb-4">
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>
              
              {cancelError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                  {cancelError}
                </div>
              )}
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  onClick={() => !isCancelling && setShowCancelConfirm(false)}
                  disabled={isCancelling}
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-2 ${isCancelling ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'} text-white rounded-xl transition-colors flex items-center gap-2`}
                  onClick={confirmCancelOrder}
                  disabled={isCancelling}
                >
                  {isCancelling ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Yes, Cancel Order</span>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Orders;