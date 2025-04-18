import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { motion } from "framer-motion"
import ReviewForm from "./ReviewForm.jsx"
import ReviewsList from "./ReviewsList.jsx"
import { AlertCircle } from "lucide-react"

const ProductReviewSection = ({ productId }) => {
  const auth = useSelector((state) => state.auth)
  const { productReviews } = useSelector((state) => state.review || {})

  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [hasUserReviewed, setHasUserReviewed] = useState(false)

  // Check if user has already reviewed this product
  useEffect(() => {
    if (auth.user && productReviews && productReviews.length > 0) {
      const userReview = productReviews.find((review) => review.user && review.user._id === auth.user._id)
      setHasUserReviewed(!!userReview)
    } else {
      setHasUserReviewed(false)
    }
  }, [auth.user, productReviews])

  return (
    <div className="space-y-8">
      {/* Review Form - Only show if user is logged in and hasn't reviewed yet */}
      {auth.user
        ? !hasUserReviewed && (
            <ReviewForm
              productId={productId}
              onSuccess={() => {
                // This will be handled by the ReviewsList component which will refresh
              }}
            />
          )
        : showLoginPrompt && (
            <motion.div
              className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 text-blue-700"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Please sign in to write a review</p>
                <p className="text-sm mt-1">Your feedback helps other shoppers make informed decisions</p>
              </div>
            </motion.div>
          )}

      {/* Reviews List */}
      <ReviewsList productId={productId} />
    </div>
  )
}

export default ProductReviewSection

