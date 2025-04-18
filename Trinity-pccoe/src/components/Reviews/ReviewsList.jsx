import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import { getProductReviews } from "../../State/Review/Action.js"
import ReviewItem from "./ReviewItem.jsx"
import { MessageSquare, AlertCircle } from "lucide-react"

const ReviewsList = ({ productId }) => {
  const dispatch = useDispatch()
  const { productReviews, loading, error } = useSelector((state) => state.review || {})
  const [sortBy, setSortBy] = useState("newest") // newest, highest, lowest

  // Fetch reviews on component mount
  useEffect(() => {
    if (productId) {
      dispatch(getProductReviews(productId))
    }
  }, [dispatch, productId])

  // Sort reviews based on selected option
  const sortedReviews = [...(productReviews || [])].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt)
    } else if (sortBy === "highest") {
      return b.rating - a.rating
    } else if (sortBy === "lowest") {
      return a.rating - b.rating
    }
    return 0
  })

  // Calculate average rating
  const averageRating =
    productReviews && productReviews.length > 0
      ? (productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length).toFixed(1)
      : 0

  // Rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = productReviews ? productReviews.filter((review) => review.rating === rating).length : 0
    const percentage = productReviews && productReviews.length > 0 ? (count / productReviews.length) * 100 : 0
    return { rating, count, percentage }
  })

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Customer Reviews</h2>

      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Average Rating */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Average Rating</h3>
            <div className="text-4xl font-bold text-primary-600 mb-1">{averageRating}</div>
            <p className="text-gray-500 text-sm mb-3">out of 5</p>
            <p className="text-gray-600">
              Based on {productReviews ? productReviews.length : 0}{" "}
              {productReviews?.length === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Rating Distribution</h3>
          <div className="space-y-2">
            {ratingDistribution.map((item) => (
              <div key={item.rating} className="flex items-center gap-2">
                <div className="w-12 text-sm font-medium text-gray-700">{item.rating} stars</div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-600 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                </div>
                <div className="w-8 text-sm text-gray-500 text-right">{item.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-medium text-gray-800">
          {productReviews ? productReviews.length : 0} {productReviews?.length === 1 ? "Review" : "Reviews"}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select
            className="text-sm border border-gray-300 rounded-xl px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3 text-red-600">
          <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      ) : sortedReviews && sortedReviews.length > 0 ? (
        <div className="space-y-4">
          {sortedReviews.map((review) => (
            <ReviewItem
              key={review._id}
              review={review}
              onReviewUpdated={() => dispatch(getProductReviews(productId))}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-100">
          <MessageSquare size={40} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-800 mb-1">No Reviews Yet</h3>
          <p className="text-gray-500">Be the first to review this product</p>
        </div>
      )}
    </motion.div>
  )
}

export default ReviewsList

