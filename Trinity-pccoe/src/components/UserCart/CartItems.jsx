import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { removeItemFromCart } from "../../State/Cart/Action"
import { Trash2 } from "lucide-react"

const CartItems = ({ cart }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  function handleClickToDelete(id) {
    dispatch(removeItemFromCart(id))
  }

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
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  }

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Cart Items</h2>

        <AnimatePresence>
          {cart.cart?.cartItems?.map((item) => (
            <motion.div
              key={item?._id}
              className="relative bg-white border border-gray-100 rounded-xl mb-4 hover:shadow-md transition-all duration-300"
              variants={itemVariants}
              layout
              exit="exit"
            >
              <div className="flex flex-col sm:flex-row p-4">
                {/* Image Container */}
                <motion.div
                  className="w-full sm:w-32 h-32 flex-shrink-0 bg-gray-50 rounded-xl mb-4 sm:mb-0"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={item.product?.imageURL || "/placeholder.svg?height=128&width=128"}
                    alt={item.product?.title || "Product image"}
                    className="w-full h-full object-contain cursor-pointer"
                    onClick={() => navigate(`/product/${item?.product._id}`)}
                  />
                </motion.div>

                {/* Product Details */}
                <div className="flex-1 sm:px-6">
                  <h3
                    className="text-lg font-medium text-gray-800 mb-1 cursor-pointer hover:text-primary-600 transition-colors"
                    onClick={() => navigate(`/product/${item?.product._id}`)}
                  >
                    {item.product?.title || "Product Title"}
                  </h3>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {item.product?.description || "No description available"}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-semibold text-gray-800">₹{item.product?.price || 0}</span>
                      {item.product?.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">₹{item.product?.originalPrice}</span>
                      )}
                    </div>

                    <motion.button
                      className="group relative flex items-center justify-center p-2 rounded-full bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
                      onClick={() => handleClickToDelete(item._id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 size={18} />

                      {/* Tooltip */}
                      <span className="absolute top-full mt-2 w-16 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none text-center">
                        Remove
                      </span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {cart.cart?.cartItems?.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No items in cart</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default CartItems

