import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { deleteReview } from "../../State/Review/Action.js"
import StarRating from "./StarRating.jsx"
import ReviewForm from "./ReviewForm.jsx"
import { Edit2, Trash2, AlertTriangle } from "lucide-react"

const ReviewItem = ({ review, isUserReview = false, onReviewUpdated = () => {} }) => {
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth)
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Handle delete review
  const handleDeleteReview = async () => {
    setIsDeleting(true)
    try {
      await dispatch(deleteReview(review._id))
      setShowDeleteConfirm(false)
      onReviewUpdated()
    } catch (error) {
      console.error("Error deleting review:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  // Check if the current user is the author of the review
  const isAuthor = auth.user && review.user && auth.user._id === review.user._id

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {isEditing ? (
        <ReviewForm
          productId={review.product._id}
          existingReview={review}
          onSuccess={() => {
            setIsEditing(false)
            onReviewUpdated()
          }}
        />
      ) : (
        <>
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              {/* User Avatar */}
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-semibold text-sm">
                {review.user?.firstName?.[0] || "U"}
              </div>

              <div>
                {/* User Name and Date */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <h4 className="font-medium text-gray-800">
                    {review.user?.firstName} {review.user?.lastName}
                  </h4>
                  <span className="text-xs text-gray-500">{formatDate(review.createdAt)}</span>
                </div>

                {/* Rating */}
                <div className="mt-1">
                  <StarRating initialRating={review.rating} readOnly size="small" />
                </div>
              </div>
            </div>

            {/* Action Buttons - Only show for the author */}
            {isAuthor && (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors"
                  title="Edit review"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full transition-colors"
                  title="Delete review"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Review Comment */}
          {review.comment && (
            <div className="mt-3 text-gray-700">
              <p>{review.comment}</p>
            </div>
          )}

          {/* Product Info - Only show for user reviews page */}
          {isUserReview && review.product && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-50 rounded-md overflow-hidden">
                  <img
                    src={review.product.imageURL || "/placeholder.svg?height=48&width=48"}
                    alt={review.product.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h5 className="font-medium text-gray-800">{review.product.title}</h5>
                  <p className="text-sm text-gray-500">₹{review.product.price}</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isDeleting && setShowDeleteConfirm(false)}
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
                <h3 className="text-xl font-semibold text-gray-800">Delete Review</h3>
              </div>

              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this review? This action cannot be undone.
              </p>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => !isDeleting && setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-2 ${isDeleting ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"} text-white rounded-lg transition-colors flex items-center gap-2`}
                  onClick={handleDeleteReview}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Yes, Delete</span>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default ReviewItem

