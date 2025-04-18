import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Tag, Truck, CreditCard } from "lucide-react"

const CartPriceDetails = ({ cart }) => {
  const navigate = useNavigate()

  // Calculate Discount (5% of Total Price)
  const discount = Math.round((cart.cart?.totalPrice * 5) / 100)

  // Calculate Total Amount (subtracting the discount)
  const totalAmount = Math.round(cart.cart?.totalPrice - discount)

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-24"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Price Details</h2>

        <div className="space-y-4 mb-6">
          {/* Items Price */}
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-gray-700">Price</span>
              <span className="text-xs text-gray-500 ml-2">
                ({cart.cart?.totalItems || 0} {cart.cart?.totalItems === 1 ? "item" : "items"})
              </span>
            </div>
            <span className="text-gray-800 font-medium">₹{cart.cart?.totalPrice || 0}</span>
          </div>

          {/* Discount */}
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Tag size={16} className="text-green-600 mr-2" />
              <span className="text-gray-700">Discount</span>
            </div>
            <span className="text-green-600 font-medium">- ₹{discount}</span>
          </div>

          {/* Delivery Charges */}
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Truck size={16} className="text-gray-600 mr-2" />
              <span className="text-gray-700">Delivery Charges</span>
            </div>
            <span className="text-green-600 font-medium">Free</span>
          </div>

          {/* Payment Method */}
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <CreditCard size={16} className="text-gray-600 mr-2" />
              <span className="text-gray-700">Payment Method</span>
            </div>
            <span className="text-gray-800 font-medium">Cash on Delivery</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-200 my-4"></div>

        {/* Total Amount */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-semibold text-gray-800">Total Amount</span>
          <span className="text-xl font-bold text-gray-800">₹{totalAmount}</span>
        </div>

        {/* Savings */}
        <div className="bg-green-50 text-green-700 text-sm p-3 rounded-xl mb-6 flex items-center">
          <Tag size={16} className="mr-2" />
          <span>You will save ₹{discount} on this order</span>
        </div>

        {/* Place Order Button */}
        <motion.button
          className="relative w-full py-3 px-4 bg-primary-600 text-white font-medium rounded-xl shadow-md overflow-hidden group"
          onClick={() => {
            localStorage.removeItem("direct")
            localStorage.removeItem("buyingProd")
            navigate("/checkout")
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Animated background on hover */}
          <span className="absolute inset-0 w-full h-full bg-primary-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out"></span>

          {/* Button text */}
          <span className="relative z-10">Place Order</span>

          {/* Animated pulse in corner */}
          <span className="absolute top-0 right-0 -mt-1 -mr-1">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
            </span>
          </span>
        </motion.button>

        {/* Secure Checkout Message */}
        <div className="flex items-center justify-center mt-4 text-xs text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span>Secure Checkout</span>
        </div>
      </div>
    </motion.div>
  )
}

export default CartPriceDetails

