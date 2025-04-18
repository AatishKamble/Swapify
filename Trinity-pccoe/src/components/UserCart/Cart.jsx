import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { getUserCart } from "../../State/Cart/Action.js"
import CartPriceDetails from "./CartPriceDetails.jsx"
import CartItems from "./CartItems.jsx"
import { ShoppingCart } from "lucide-react"

const Cart = () => {
  const cart = useSelector((store) => store.cart)
  const auth = useSelector((store) => store.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(getUserCart())
  }, [cart.cart, dispatch])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.div
      className="bg-gray-50 min-h-[50%] py-8 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.div className="mb-8 text-center sm:text-left" variants={itemVariants}>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Your Shopping Cart</h1>
          {auth.user && cart.cart?.totalItems > 0 && (
            <p className="text-gray-600 mt-2">
              You have {cart.cart.totalItems} {cart.cart.totalItems === 1 ? "item" : "items"} in your cart
            </p>
          )}
        </motion.div>

        {auth.user && cart.cart?.totalItems ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items Section */}
            <motion.div className="lg:w-2/3 w-full" variants={itemVariants}>
              <CartItems cart={cart} />
            </motion.div>

            {/* Price Details Section */}
            <motion.div className="lg:w-1/3 w-full" variants={itemVariants}>
              <CartPriceDetails cart={cart} />
            </motion.div>
          </div>
        ) : (
          <motion.div className="flex flex-col items-center justify-center py-16 px-4" variants={itemVariants}>
            <div className="bg-white rounded-full p-8 mb-6 shadow-md">
              <ShoppingCart size={64} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 text-center max-w-md mb-8">
              Looks like you haven't added anything to your cart yet. Browse our products and find something you'll
              love!
            </p>
            <motion.button
              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-md"
              onClick={() => navigate("/items")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Shopping
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default Cart;