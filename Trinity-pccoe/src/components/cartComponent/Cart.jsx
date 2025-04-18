import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee"
import { ShoppingCart, Heart } from "lucide-react"

const Cart = ({ productName, productImage, productPrice, productId }) => {
  const navigate = useNavigate()

  // Handle add to cart - prevent navigation when clicking the cart button
  const handleAddToCart = (e) => {
    e.stopPropagation()
    // Add to cart functionality here
  }

  return (
    <motion.div
      className="w-[300px] bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-300"
      whileHover={{
        y: -5,
        scale: 1.02,
        transition: { duration: 0.3 },
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => {
        navigate(`/product/${productId}`);
      }}
    >
      {/* Product Image with hover effect */}
      <div className="relative overflow-hidden bg-gray-50 h-[270px]">
        {/* Wishlist button */}
        <motion.button
          className="absolute top-3 right-3 z-10 bg-white p-1.5 rounded-full shadow-sm hover:bg-gray-50 text-gray-500 hover:text-red-500 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation()
            // Add wishlist functionality here
          }}
        >
          <Heart size={18} />
        </motion.button>

        {/* Product image */}
        <motion.div
          className="w-full h-full flex items-center justify-center p-4"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={productImage || "/placeholder.svg?height=270&width=270"}
            alt={productName}
            className="object-contain w-full h-full"
          />
        </motion.div>
      </div>

      {/* Product details */}
      <div className="p-4">
        <h3 className="text-gray-800 font-medium text-lg mb-2 line-clamp-2 min-h-[3rem]">{productName}</h3>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center text-primary-600">
            <CurrencyRupeeIcon fontSize="small" />
            <span className="text-xl font-semibold">{productPrice}</span>
          </div>

          <motion.button
            className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center shadow-md text-white"
            whileHover={{
              scale: 1.05,
              backgroundColor: "#4338CA",
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
          >
            <ShoppingCart size={20} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default Cart
