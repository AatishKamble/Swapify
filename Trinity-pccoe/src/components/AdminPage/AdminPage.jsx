import { useEffect, useState, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  acceptSellRequest,
  getSellRequests,
  rejectSellRequest,
  getProductRequestStats,
  acceptCancelRequest,
  rejectCancelRequest,
} from "../../State/Product/Action"
import {
  Users,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Search,
  ChevronDown,
  Filter,
  Eye,
  XCircleIcon,
  ShoppingBag,
  RotateCcw,
} from "lucide-react"

const AdminPage = () => {
  const nav = useNavigate()
  const jwt = localStorage.getItem("jwt")
  const dispatch = useDispatch()
  const product = useSelector((store) => store.product)

  // State for active section and tab
  const [activeSection, setActiveSection] = useState("sell") // "sell" or "cancel"
  const [activeSellTab, setActiveSellTab] = useState("requests")
  const [activeCancelTab, setActiveCancelTab] = useState("requests")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [sortOrder, setSortOrder] = useState("newest")
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeSellers: 0,
    pendingRequests: 0,
    pendingCancelRequests: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showRequestDetails, setShowRequestDetails] = useState(false)

  // Fetch sell requests and stats
  const fetchData = useCallback(() => {
    setIsLoading(true)

    // Fetch product stats from backend
    dispatch(getProductRequestStats())
      .then((statsData) => {
        setStats({
          totalProducts: statsData.totalProducts || 0,
          activeSellers: statsData.activeSellers || 0,
          pendingRequests: statsData.pendingRequests || 0,
          pendingCancelRequests: Array.isArray(product.sellRequests)
            ? product.sellRequests.filter((req) => req.state === "cancelrequest").length
            : 0,
        })
      })
      .catch((error) => {
        console.error("Error fetching stats:", error)
        // Fallback to calculating stats from requests
        const pendingRequests = Array.isArray(product.sellRequests)
          ? product.sellRequests.filter((req) => req.state === "sellrequest").length
          : 0
        const pendingCancelRequests = Array.isArray(product.sellRequests)
          ? product.sellRequests.filter((req) => req.state === "cancelrequest").length
          : 0

        setStats({
          totalProducts: product.sellRequests?.length || 0,
          activeSellers: 0,
          pendingRequests,
          pendingCancelRequests,
        })
      })

    // Fetch sell requests
    dispatch(getSellRequests())
      .catch((error) => {
        console.error("Error fetching sell requests:", error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [dispatch, product.sellRequests])

  useEffect(() => {
    fetchData()
  }, [])

  // Handler for accepting a seller request
  const handleAcceptSell = async (id) => {
    try {
      await dispatch(acceptSellRequest(id))
      fetchData() // Refresh data after action
    } catch (error) {
      console.error("Error accepting sell request:", error)
    }
  }

  // Handler for rejecting a seller request
  const handleRejectSell = async (id) => {
    try {
      await dispatch(rejectSellRequest(id))
      fetchData() // Refresh data after action
    } catch (error) {
      console.error("Error rejecting sell request:", error)
    }
  }

  // Handler for accepting a cancel request
  const handleAcceptCancel = async (id) => {
    try {
      await dispatch(acceptCancelRequest(id))
      fetchData() // Refresh data after action
    } catch (error) {
      console.error("Error accepting cancel request:", error)
    }
  }

  // Handler for rejecting a cancel request
  const handleRejectCancel = async (id) => {
    try {
      await dispatch(rejectCancelRequest(id))
      fetchData() // Refresh data after action
    } catch (error) {
      console.error("Error rejecting cancel request:", error)
    }
  }

  // View request details
  const handleViewDetails = (request) => {
    setSelectedRequest(request)
    setShowRequestDetails(true)
  }

  // Filter requests based on active section, tab, status and search query
  const filteredRequests = Array.isArray(product.sellRequests)
    ? product.sellRequests.filter((request) => {
        // First filter by section (sell or cancel)
        if (activeSection === "sell") {
          // Filter out cancel requests
          if (request.state === "cancelrequest" || request.state === "Cancel_Approved") return false

          // Filter by sell tab
          if (activeSellTab === "requests" && request.state !== "sellrequest") return false
          if (activeSellTab === "approved" && request.state !== "Request_Approved") return false
          if (activeSellTab === "rejected" && request.state !== "Request_Rejected") return false
        } else if (activeSection === "cancel") {
          // Filter by cancel tab
          if (activeCancelTab === "requests" && request.state !== "cancelrequest") return false
          if (activeCancelTab === "approved" && request.state !== "Cancel_Approved") return false
        }

        // Filter by status if filter is applied
        if (filterStatus !== "all") {
          if (filterStatus === "sellrequest" && request.state !== "sellrequest") return false
          if (filterStatus === "Request_Approved" && request.state !== "Request_Approved") return false
          if (filterStatus === "Request_Rejected" && request.state !== "Request_Rejected") return false
          if (filterStatus === "cancelrequest" && request.state !== "cancelrequest") return false
          if (filterStatus === "Cancel_Approved" && request.state !== "Cancel_Approved") return false
        }

        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          const productName = request.productName?.toLowerCase() || ""
          const sellerName = `${request.user?.firstName || ""} ${request.user?.lastName || ""}`.toLowerCase()

          return productName.includes(query) || sellerName.includes(query)
        }

        return true
      })
    : []

  // Sort requests
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt)
    } else if (sortOrder === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt)
    } else if (sortOrder === "price-high") {
      return (b.expectedPrice || 0) - (a.expectedPrice || 0)
    } else if (sortOrder === "price-low") {
      return (a.expectedPrice || 0) - (b.expectedPrice || 0)
    }
    return 0
  })

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

  // Get status badge based on state
  const getStatusBadge = (status) => {
    switch (status) {
      case "Request_Approved":
        return (
          <span className="px-2.5 py-1 inline-flex items-center text-xs font-medium rounded-full bg-green-50 text-green-700 border border-green-100">
            <CheckCircle size={12} className="mr-1" />
            Approved
          </span>
        )
      case "Request_Rejected":
        return (
          <span className="px-2.5 py-1 inline-flex items-center text-xs font-medium rounded-full bg-red-50 text-red-700 border border-red-100">
            <XCircle size={12} className="mr-1" />
            Rejected
          </span>
        )
      case "cancelrequest":
        return (
          <span className="px-2.5 py-1 inline-flex items-center text-xs font-medium rounded-full bg-orange-50 text-orange-700 border border-orange-100">
            <RotateCcw size={12} className="mr-1" />
            Cancel Requested
          </span>
        )
      case "Cancel_Approved":
        return (
          <span className="px-2.5 py-1 inline-flex items-center text-xs font-medium rounded-full bg-gray-50 text-gray-700 border border-gray-100">
            <XCircleIcon size={12} className="mr-1" />
            Cancelled
          </span>
        )
      case "sellrequest":
        return (
          <span className="px-2.5 py-1 inline-flex items-center text-xs font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-100">
            <Clock size={12} className="mr-1" />
            Pending
          </span>
        )
      default:
        return (
          <span className="px-2.5 py-1 inline-flex items-center text-xs font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-100">
            <Clock size={12} className="mr-1" />
            Pending
          </span>
        )
    }
  }

  // Get current tab title
  const getCurrentTabTitle = () => {
    if (activeSection === "sell") {
      switch (activeSellTab) {
        case "requests":
          return "Pending Seller Requests"
        case "approved":
          return "Approved Listings"
        case "rejected":
          return "Rejected Listings"
        default:
          return "Seller Requests"
      }
    } else {
      switch (activeCancelTab) {
        case "requests":
          return "Pending Cancel Requests"
        case "approved":
          return "Approved Cancellations"
        default:
          return "Cancel Requests"
      }
    }
  }

  // Get current tab description
  const getCurrentTabDescription = () => {
    if (activeSection === "sell") {
      switch (activeSellTab) {
        case "requests":
          return "Review and manage product listing requests from sellers"
        case "approved":
          return "View all approved product listings"
        case "rejected":
          return "View all rejected product listings"
        default:
          return "Manage seller requests"
      }
    } else {
      switch (activeCancelTab) {
        case "requests":
          return "Review and manage cancellation requests from sellers"
        case "approved":
          return "View all approved cancellations"
        default:
          return "Manage cancellation requests"
      }
    }
  }

  // Get empty state message
  const getEmptyStateMessage = () => {
    if (searchQuery) return `No results matching "${searchQuery}"`

    if (activeSection === "sell") {
      switch (activeSellTab) {
        case "requests":
          return "All seller requests have been processed"
        case "approved":
          return "No approved listings yet"
        case "rejected":
          return "No rejected listings yet"
        default:
          return "No requests found"
      }
    } else {
      switch (activeCancelTab) {
        case "requests":
          return "No pending cancellation requests"
        case "approved":
          return "No approved cancellations yet"
        default:
          return "No cancellation requests found"
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <motion.header
        className="bg-white shadow-sm border-b border-gray-100"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Swapify Admin Dashboard</h1>
            {/* <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all duration-200 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                <User size={20} />
              </div>
            </div> */}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main
        className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Stats Overview */}
        <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" variants={itemVariants}>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600 mr-4">
              <Package size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalProducts}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
            <div className="p-3 rounded-xl bg-green-50 text-green-600 mr-4">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Sellers</p>
              <p className="text-2xl font-bold text-gray-800">{stats.activeSellers}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 mr-4">
              <ShoppingBag size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Sell</p>
              <p className="text-2xl font-bold text-gray-800">{stats.pendingRequests}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
            <div className="p-3 rounded-xl bg-orange-50 text-orange-600 mr-4">
              <RotateCcw size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Cancel</p>
              <p className="text-2xl font-bold text-gray-800">{stats.pendingCancelRequests}</p>
            </div>
          </div>
        </motion.div>

        {/* Main Section Tabs */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 mb-6 flex flex-wrap gap-2"
          variants={itemVariants}
        >
          <button
            onClick={() => setActiveSection("sell")}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeSection === "sell" ? "bg-gray-800 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <ShoppingBag size={18} />
              <span>Sell Requests</span>
              {stats.pendingRequests > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {stats.pendingRequests}
                </span>
              )}
            </span>
          </button>
          <button
            onClick={() => setActiveSection("cancel")}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeSection === "cancel" ? "bg-gray-800 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <RotateCcw size={18} />
              <span>Cancel Requests</span>
              {stats.pendingCancelRequests > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {stats.pendingCancelRequests}
                </span>
              )}
            </span>
          </button>
        </motion.div>

        {/* Sub Tabs - Sell Requests */}
        {activeSection === "sell" && (
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 mb-8 flex flex-wrap gap-2"
            variants={itemVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => setActiveSellTab("requests")}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeSellTab === "requests" ? "bg-gray-800 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <Clock size={18} />
                <span>Pending</span>
                {stats.pendingRequests > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {stats.pendingRequests}
                  </span>
                )}
              </span>
            </button>
            <button
              onClick={() => setActiveSellTab("approved")}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeSellTab === "approved" ? "bg-gray-800 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <CheckCircle size={18} />
                <span>Approved</span>
              </span>
            </button>
            <button
              onClick={() => setActiveSellTab("rejected")}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeSellTab === "rejected" ? "bg-gray-800 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <XCircle size={18} />
                <span>Rejected</span>
              </span>
            </button>
          </motion.div>
        )}

        {/* Sub Tabs - Cancel Requests */}
        {activeSection === "cancel" && (
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 mb-8 flex flex-wrap gap-2"
            variants={itemVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => setActiveCancelTab("requests")}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeCancelTab === "requests" ? "bg-gray-800 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <Clock size={18} />
                <span>Pending</span>
                {stats.pendingCancelRequests > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {stats.pendingCancelRequests}
                  </span>
                )}
              </span>
            </button>
            <button
              onClick={() => setActiveCancelTab("approved")}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeCancelTab === "approved" ? "bg-gray-800 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <XCircleIcon size={18} />
                <span>Cancellation Approved</span>
              </span>
            </button>
          </motion.div>
        )}

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* Requests Tab Content */}
          <motion.div
            key={`${activeSection}-${activeSection === "sell" ? activeSellTab : activeCancelTab}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{getCurrentTabTitle()}</h3>
                <p className="text-sm text-gray-500">{getCurrentTabDescription()}</p>
              </div>
              <div className="flex items-center gap-2">
                {/* Filter Button */}
                <div className="relative">
                  <button
                    className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                  >
                    <Filter size={18} />
                  </button>

                  {/* Filter Dropdown */}
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
                        All Requests
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2 text-sm ${filterStatus === "sellrequest" ? "bg-gray-100 text-gray-800" : "text-gray-700 hover:bg-gray-50"}`}
                        onClick={() => {
                          setFilterStatus("sellrequest")
                          setShowFilterMenu(false)
                        }}
                      >
                        Pending Sell
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2 text-sm ${filterStatus === "Request_Approved" ? "bg-gray-100 text-gray-800" : "text-gray-700 hover:bg-gray-50"}`}
                        onClick={() => {
                          setFilterStatus("Request_Approved")
                          setShowFilterMenu(false)
                        }}
                      >
                        Approved Sell
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2 text-sm ${filterStatus === "Request_Rejected" ? "bg-gray-100 text-gray-800" : "text-gray-700 hover:bg-gray-50"}`}
                        onClick={() => {
                          setFilterStatus("Request_Rejected")
                          setShowFilterMenu(false)
                        }}
                      >
                        Rejected Sell
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2 text-sm ${filterStatus === "cancelrequest" ? "bg-gray-100 text-gray-800" : "text-gray-700 hover:bg-gray-50"}`}
                        onClick={() => {
                          setFilterStatus("cancelrequest")
                          setShowFilterMenu(false)
                        }}
                      >
                        Pending Cancel
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2 text-sm ${filterStatus === "Cancel_Approved" ? "bg-gray-100 text-gray-800" : "text-gray-700 hover:bg-gray-50"}`}
                        onClick={() => {
                          setFilterStatus("Cancel_Approved")
                          setShowFilterMenu(false)
                        }}
                      >
                        Approved Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <button
                    className="flex items-center gap-1 px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium"
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
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="py-12 flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {sortedRequests.length > 0 ? (
                  sortedRequests.map((request) => (
                    <motion.div
                      key={request._id}
                      className="p-6 hover:bg-gray-50 transition-colors"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          {/* Product Image */}
                          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={request.images?.[0]?.imageUrl || "/placeholder.svg?height=64&width=64"}
                              alt={request.productName || "Product"}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-gray-800">{request.productName || "Unnamed Product"}</h4>
                              {getStatusBadge(request.state)}
                            </div>

                            <div className="flex items-center gap-4 mt-1">
                              <p className="text-gray-600">
                                <span className="font-medium">₹{request.expectedPrice?.toLocaleString() || "N/A"}</span>
                              </p>
                              <p className="text-sm text-gray-500">
                                Seller: {request.user?.firstName} {request.user?.lastName}
                              </p>
                            </div>

                            <p className="text-sm text-gray-500 mt-1">
                              Requested on: {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3 ml-16 md:ml-0">
                          {/* View Details Button */}
                          <motion.button
                            onClick={() => handleViewDetails(request)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors shadow-sm flex items-center gap-1"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Eye size={16} />
                            <span>Details</span>
                          </motion.button>

                          {/* Action Buttons - Only show for pending sell requests */}
                          {request.state === "sellrequest" && (
                            <>
                              <motion.button
                                onClick={() => handleAcceptSell(request._id)}
                                className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors shadow-sm flex items-center gap-1"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <CheckCircle size={16} />
                                <span>Accept</span>
                              </motion.button>
                              <motion.button
                                onClick={() => handleRejectSell(request._id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors shadow-sm flex items-center gap-1"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <XCircle size={16} />
                                <span>Reject</span>
                              </motion.button>
                            </>
                          )}

                          {/* Action Buttons - Only show for pending cancel requests */}
                          {request.state === "cancelrequest" && (
                            <>
                              <motion.button
                                onClick={() => handleAcceptCancel(request._id)}
                                className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors shadow-sm flex items-center gap-1"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <CheckCircle size={16} />
                                <span>Accept Cancel</span>
                              </motion.button>
                              <motion.button
                                onClick={() => handleRejectCancel(request._id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors shadow-sm flex items-center gap-1"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <XCircle size={16} />
                                <span>Reject Cancel</span>
                              </motion.button>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                      <Package size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-1">No requests found</h3>
                    <p className="text-gray-500">{getEmptyStateMessage()}</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.main>

      {/* Request Details Modal */}
      {showRequestDetails && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold text-gray-800">Product Request Details</h3>
                  {getStatusBadge(selectedRequest.state)}
                </div>
                <button
                  onClick={() => setShowRequestDetails(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <XCircle size={20} className="text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Product Images */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Product Images</h4>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    {selectedRequest.images && selectedRequest.images.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {selectedRequest.images.map((image, index) => (
                          <div
                            key={index}
                            className="aspect-square bg-white rounded-lg overflow-hidden border border-gray-100"
                          >
                            <img
                              src={image.imageUrl || "/placeholder.svg?height=150&width=150"}
                              alt={`Product image ${index + 1}`}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-40 text-gray-400">
                        <p>No images available</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Details */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Product Information</h4>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Product Name</p>
                      <p className="font-medium text-gray-800">{selectedRequest.productName || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Description</p>
                      <p className="text-gray-700">{selectedRequest.productDescription || "No description provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-medium text-gray-800">
                        ₹{selectedRequest.expectedPrice?.toLocaleString() || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="text-gray-700">{selectedRequest.category?.name || "Uncategorized"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      {getStatusBadge(selectedRequest.state)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Seller & Location Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Seller Information */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Seller Information</h4>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {selectedRequest.user?.firstName} {selectedRequest.user?.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{selectedRequest.user?.email || "No email provided"}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Request Date</p>
                      <p className="text-gray-700">{new Date(selectedRequest.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Location Information</h4>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
                    {selectedRequest.address && selectedRequest.address.length > 0 ? (
                      <>
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="text-gray-700">
                            {selectedRequest.address[0]?.address || "No address provided"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">City & State</p>
                          <p className="text-gray-700">
                            {selectedRequest.address[0]?.city}, {selectedRequest.address[0]?.state} -{" "}
                            {selectedRequest.address[0]?.pincode}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-20 text-gray-400">
                        <p>No location information available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowRequestDetails(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>

                {/* Sell Request Actions */}
                {selectedRequest.state === "sellrequest" && (
                  <>
                    <button
                      onClick={() => {
                        handleAcceptSell(selectedRequest._id)
                        setShowRequestDetails(false)
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors shadow-sm flex items-center gap-1"
                    >
                      <CheckCircle size={16} />
                      <span>Accept Request</span>
                    </button>
                    <button
                      onClick={() => {
                        handleRejectSell(selectedRequest._id)
                        setShowRequestDetails(false)
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors shadow-sm flex items-center gap-1"
                    >
                      <XCircle size={16} />
                      <span>Reject Request</span>
                    </button>
                  </>
                )}

                {/* Cancel Request Actions */}
                {selectedRequest.state === "cancelrequest" && (
                  <>
                    <button
                      onClick={() => {
                        handleAcceptCancel(selectedRequest._id)
                        setShowRequestDetails(false)
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors shadow-sm flex items-center gap-1"
                    >
                      <CheckCircle size={16} />
                      <span>Accept Cancellation</span>
                    </button>
                    <button
                      onClick={() => {
                        handleRejectCancel(selectedRequest._id)
                        setShowRequestDetails(false)
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors shadow-sm flex items-center gap-1"
                    >
                      <XCircle size={16} />
                      <span>Reject Cancellation</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminPage;