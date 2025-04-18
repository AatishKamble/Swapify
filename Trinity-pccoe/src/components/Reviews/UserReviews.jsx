import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import { getUserReviews } from "../../State/Review/Action.js"
import ReviewItem from "./ReviewItem.jsx"
import { MessageSquare, AlertCircle } from "lucide-react"

const UserReviews = () => {
  const dispatch = useDispatch()
  const { userReviews, loading, error } = useSelector((state) => state.review || {})

  // Fetch user reviews on component mount
  useEffect(() => {
    dispatch(getUserReviews())
  }, [dispatch])

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Your Reviews</h2>

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
      ) : userReviews && userReviews.length > 0 ? (
        <div className="space-y-4">
          {userReviews.map((review) => (
            <ReviewItem
              key={review._id}
              review={review}
              isUserReview={true}
              onReviewUpdated={() => dispatch(getUserReviews())}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-100">
          <MessageSquare size={40} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-800 mb-1">No Reviews Yet</h3>
          <p className="text-gray-500">You haven't reviewed any products yet</p>
        </div>
      )}
    </motion.div>
  )
}

export default UserReviews;