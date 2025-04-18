import { motion } from "framer-motion"
import { X } from "lucide-react"

const LoginPrompt = ({ onConfirm, onCancel }) => {
  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { delay: 0.1, duration: 0.3 },
    },
  }

  // Store the current URL to return to after login
  const handleConfirm = () => {
    localStorage.setItem("returnUrl", window.location.pathname)
    onConfirm()
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={backdropVariants}
      onClick={onCancel}
    >
      <motion.div
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Sign In Required</h3>
          <button onClick={onCancel} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <p className="text-gray-600 mb-6">Please sign in to your account to add items to your cart or wishlist.</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default LoginPrompt;