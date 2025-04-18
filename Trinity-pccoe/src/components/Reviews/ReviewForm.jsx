import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import { createReview, updateReview, resetReviewState } from "../../State/Review/Action.js"
import StarRating from "./StarRating.jsx"
import { Send, AlertCircle } from "lucide-react"

const ReviewForm = ({ productId, existingReview = null, onSuccess = () => {} }) => {
  const dispatch = useDispatch()
  const { loading, error, success } = useSelector((state) => state.review || {})

  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [comment, setComment] = useState(existingReview?.comment || "")
  const [formError, setFormError] = useState("")

  // Reset form state when success changes
  useEffect(() => {
    if (success) {
      if (!existingReview) {
        // Only reset form for new reviews, not updates
        setRating(0)
        setComment("")
      }
      onSuccess()
      dispatch(resetReviewState())
    }
  }, [success, dispatch, existingReview, onSuccess])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError("")

    // Validate form
    if (rating === 0) {
      setFormError("Please select a rating")
      return
    }

    try {
      if (existingReview) {
        // Update existing review
        await dispatch(updateReview(existingReview._id, { rating, comment }))
      } else {
        // Create new review
        await dispatch(createReview({ productId, rating, comment }))
      }
    } catch (err) {
      setFormError(err.message || "An error occurred while submitting your review")
    }
  }

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {existingReview ? "Update Your Review" : "Write a Review"}
      </h3>

      {(error || formError) && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-red-600">
          <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
          <span>{error || formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
          <StarRating initialRating={rating} onChange={setRating} size="large" />
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            Your Review (Optional)
          </label>
          <textarea
            id="comment"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            placeholder="Share your experience with this product..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <motion.button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>{existingReview ? "Update Review" : "Submit Review"}</span>
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}

export default ReviewForm

