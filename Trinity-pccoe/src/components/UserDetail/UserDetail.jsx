import { useSelector } from "react-redux"
import { motion } from "framer-motion"
import { CheckCircle, LogOut, ArrowRight } from "lucide-react"
import { useContext, useEffect } from "react"
import { CheckoutContext } from "../../pages/Checkout"

const UserDetail = ({ handleNext }) => {
  const auth = useSelector((store) => store.auth)
  const { checkoutData, updateCheckoutData } = useContext(CheckoutContext)

  // Save user data to checkout context when component mounts
  useEffect(() => {
    if (auth.user) {
      updateCheckoutData("user", {
        userId: auth.user._id,
        firstName: auth.user.firstName,
        lastName: auth.user.lastName,
        email: auth.user.email,
        phone: auth.user.mobileNumber,
      })
    }
  }, [auth.user])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
        <motion.div className="flex items-center" variants={itemVariants}>
          <CheckCircle size={22} className="text-white mr-2" />
          <h2 className="text-xl font-semibold text-white">Account Information</h2>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6">
        {auth.user ? (
          <motion.div className="space-y-6" variants={itemVariants}>
            {/* User info card */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <div className="flex items-start gap-4">
                {/* User avatar */}
                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-xl flex-shrink-0">
                  {auth.user?.firstName?.[0]?.toUpperCase()}
                </div>

                {/* User details */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {auth.user?.firstName} {auth.user?.lastName}
                  </h3>
                  <p className="text-gray-600 mb-2">{auth.user?.email}</p>
                  <div className="flex items-center text-green-600 text-sm">
                    <CheckCircle size={16} className="mr-1" />
                    <span>Verified Account</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional options */}
            <motion.div
              className="flex justify-between items-center"
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <button className="text-gray-600 hover:text-primary-600 flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 px-3 py-2 rounded-xl hover:bg-gray-50">
                <LogOut size={16} />
                <span>Logout and sign in with another account</span>
              </button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div className="text-center py-8" variants={itemVariants}>
            <p className="text-gray-600 mb-4">Please sign in to continue with checkout</p>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
              Sign In
            </button>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <motion.div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end" variants={itemVariants}>
        <motion.button
          onClick={() => handleNext((prev) => prev + 1)}
          className="relative flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-all duration-200 shadow-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!auth.user}
        >
          <span>Continue</span>
          <ArrowRight size={16} />

          {/* Animated notification dot */}
          <span className="absolute top-0 right-0 -mt-1 -mr-1">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
            </span>
          </span>
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default UserDetail;