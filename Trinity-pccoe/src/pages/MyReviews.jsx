import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { getUserReviews } from "../State/Review/Action.js"
import ReviewItem from "../components/Reviews/ReviewItem.jsx"
import { ArrowLeft, Star, Search, Filter, ChevronDown, AlertCircle, MessageSquare } from "lucide-react"

const MyReviews = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const auth = useSelector((state) => state.auth)
  const { userReviews, loading, error } = useSelector((state) => state.review || {})

  // State for filtering and sorting
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest") // newest, highest-rating, lowest-rating
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [filterRating, setFilterRating] = useState(0) // 0 means all ratings

  // Redirect if not logged in
  useEffect(() => {
    if (!auth.user) {
      navigate("/signin")
    }
  }, [auth.user, navigate])

  // Fetch user reviews on component mount
  useEffect(() => {
    dispatch(getUserReviews())
  }, [dispatch])

  // Handle review update
  const handleReviewUpdated = () => {
    dispatch(getUserReviews())
  }

  // Filter and sort reviews
  const filteredReviews = userReviews
    ? userReviews.filter((review) => {
        // Filter by rating if selected
        if (filterRating > 0 && review.rating !== filterRating) {
          return false
        }

        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          const productName = review.product?.title?.toLowerCase() || ""
          const comment = review.comment?.toLowerCase() || ""

          return productName.includes(query) || comment.includes(query)
        }

        return true
      })
    : []

  // Sort reviews
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt)
    } else if (sortBy === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt)
    } else if (sortBy === "highest-rating") {
      return b.rating - a.rating
    } else if (sortBy === "lowest-rating") {
      return a.rating - b.rating
    }
    return 0
  })

  // Calculate rating statistics
  const ratingCounts = userReviews
    ? [5, 4, 3, 2, 1].map((rating) => ({
        rating,
        count: userReviews.filter((review) => review.rating === rating).length,
      }))
    : []

  const averageRating =
    userReviews && userReviews.length > 0
      ? (userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length).toFixed(1)
      : "0.0"

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
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Reviews</h1>
            <p className="text-gray-600">Manage your product reviews</p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8" variants={itemVariants}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center">
            <div className="p-3 rounded-xl bg-primary-50 text-primary-600 mr-4">
              <MessageSquare size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-800">{userReviews?.length || 0}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center">
            <div className="p-3 rounded-xl bg-yellow-50 text-yellow-600 mr-4">
              <Star size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Rating</p>
              <p className="text-2xl font-bold text-gray-800">{averageRating}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <p className="text-sm text-gray-500 mb-2">Rating Distribution</p>
            <div className="space-y-1">
              {ratingCounts.map((item) => (
                <div key={item.rating} className="flex items-center gap-2">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-xs font-medium text-gray-700">{item.rating}</span>
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-600 rounded-full"
                      style={{
                        width: userReviews?.length ? `${(item.count / userReviews.length) * 100}%` : "0%",
                      }}
                    ></div>
                  </div>
                  <div className="w-6 text-xs text-gray-500 text-right">{item.count}</div>
                </div>
              ))}
            </div>
          </div>
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
              placeholder="Search reviews..."
              className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-transparent transition-all duration-200 w-full sm:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>

          <div className="flex gap-4 w-full sm:w-auto">
            {/* Rating Filter */}
            <div className="relative flex-1 sm:flex-none">
              <select
                className="appearance-none w-full bg-white border border-gray-200 rounded-xl py-2 px-4 pr-8 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-200"
                value={filterRating}
                onChange={(e) => setFilterRating(Number(e.target.value))}
              >
                <option value="0">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <Filter size={16} />
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex-1 sm:flex-none">
              <button
                className="flex items-center justify-between gap-1 px-4 py-2 w-full border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                onClick={() => setShowSortMenu(!showSortMenu)}
              >
                <span>
                  {sortBy === "newest" && "Newest First"}
                  {sortBy === "oldest" && "Oldest First"}
                  {sortBy === "highest-rating" && "Highest Rating"}
                  {sortBy === "lowest-rating" && "Lowest Rating"}
                </span>
                <ChevronDown size={16} />
              </button>

              <AnimatePresence>
                {showSortMenu && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-10 border border-gray-100"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Sort By</div>
                    <button
                      className={`w-full text-left px-4 py-2 text-sm ${sortBy === "newest" ? "bg-gray-100 text-gray-800" : "text-gray-700 hover:bg-gray-50"}`}
                      onClick={() => {
                        setSortBy("newest")
                        setShowSortMenu(false)
                      }}
                    >
                      Newest First
                    </button>
                    <button
                      className={`w-full text-left px-4 py-2 text-sm ${sortBy === "oldest" ? "bg-gray-100 text-gray-800" : "text-gray-700 hover:bg-gray-50"}`}
                      onClick={() => {
                        setSortBy("oldest")
                        setShowSortMenu(false)
                      }}
                    >
                      Oldest First
                    </button>
                    <button
                      className={`w-full text-left px-4 py-2 text-sm ${sortBy === "highest-rating" ? "bg-gray-100 text-gray-800" : "text-gray-700 hover:bg-gray-50"}`}
                      onClick={() => {
                        setSortBy("highest-rating")
                        setShowSortMenu(false)
                      }}
                    >
                      Highest Rating
                    </button>
                    <button
                      className={`w-full text-left px-4 py-2 text-sm ${sortBy === "lowest-rating" ? "bg-gray-100 text-gray-800" : "text-gray-700 hover:bg-gray-50"}`}
                      onClick={() => {
                        setSortBy("lowest-rating")
                        setShowSortMenu(false)
                      }}
                    >
                      Lowest Rating
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Reviews List */}
        <motion.div variants={itemVariants}>
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
              <h3 className="text-lg font-medium mb-2">Error Loading Reviews</h3>
              <p>{error}</p>
            </motion.div>
          ) : sortedReviews.length > 0 ? (
            <div className="space-y-6">
              {sortedReviews.map((review) => (
                <ReviewItem
                  key={review._id}
                  review={review}
                  isUserReview={true}
                  onReviewUpdated={handleReviewUpdated}
                />
              ))}
            </div>
          ) : (
            <motion.div className="text-center py-16 bg-white rounded-2xl shadow-sm" variants={itemVariants}>
              <MessageSquare size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-800 mb-2">No reviews found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || filterRating > 0
                  ? "Try changing your search or filter criteria"
                  : "You haven't reviewed any products yet"}
              </p>
              {searchQuery || filterRating > 0 ? (
                <button
                  onClick={() => {
                    setSearchQuery("")
                    setFilterRating(0)
                  }}
                  className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors duration-200"
                >
                  Clear Filters
                </button>
              ) : (
                <button
                  onClick={() => navigate("/products")}
                  className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors duration-200"
                >
                  Browse Products
                </button>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default MyReviews