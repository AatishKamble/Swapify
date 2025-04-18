import { useEffect, useState, useContext } from "react"
import { useSelector, useDispatch } from "react-redux"
import { motion } from "framer-motion"
import { getUserCart } from "../../State/Cart/Action.js"
import CartItems from "../UserCart/CartItems"
import { ShoppingBag, MapPin, CreditCard, ArrowLeft, ArrowRight, Truck, Edit2 } from "lucide-react"
import { CheckoutContext } from "../../pages/Checkout.jsx"

const OrderSummary = ({ setCurrentStep }) => {
  const cart = useSelector((store) => store.cart)
  const auth = useSelector((store) => store.auth)
  const dispatch = useDispatch()
  const { checkoutData, updateCheckoutData } = useContext(CheckoutContext)

  // State for products and address
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [products, setProducts] = useState([])
  const [subtotal, setSubtotal] = useState(0)
  const [tax, setTax] = useState(0)
  const [total, setTotal] = useState(0)

  // First, modify the useEffect that handles direct product loading to prevent the loop
  useEffect(() => {
    // Load address from context
    if (checkoutData.shippingAddress) {
      setSelectedAddress(checkoutData.shippingAddress)
    }

    // Check if this is a direct product purchase or cart checkout
    const isDirect = localStorage.getItem("direct")
    const buyingProduct = localStorage.getItem("buyingProd")

    if (isDirect && buyingProduct) {
      // Direct product purchase
      try {
        const product = JSON.parse(buyingProduct)
        console.log("Direct product from localStorage:", product) // Debug log
        setProducts([product])

        // Update isDirect in context ONLY if it's different from current value
        // This prevents the infinite loop
        if (checkoutData.isDirect !== true) {
          updateCheckoutData("isDirect", true)
        }
      } catch (error) {
        console.error("Error parsing direct product:", error)
      }
    } else {
      // Normal cart checkout - only dispatch if not direct
      if (!checkoutData.isDirect) {
        dispatch(getUserCart())
      }
    }
  }, [dispatch, checkoutData.shippingAddress]) // Remove checkoutData.isDirect from dependencies

  // Modify the useEffect that updates products from cart to prevent loops
  useEffect(() => {
    if (!checkoutData.isDirect && cart?.cart?.cartItems) {
      setProducts(cart.cart.cartItems)
    }
  }, [cart.cart, checkoutData.isDirect])

  // Calculate tax and total
  useEffect(() => {
    const newSubtotal = checkoutData.isDirect
      ? products.reduce((total, item) => total + (item.price || item.expectedPrice || 0), 0)
      : cart?.cart?.totalPrice || 0

    const newTax = Math.round(newSubtotal * 0.05)
    const newTotal = newSubtotal + newTax

    setSubtotal(newSubtotal)
    setTax(newTax)
    setTotal(newTotal)
  }, [products, cart?.cart?.totalPrice, checkoutData.isDirect])

  // Modify the useEffect that stores order data in checkout context
  useEffect(() => {
    // Only run this effect if we have products and an address
    if ((products.length > 0 || cart?.cart) && selectedAddress) {
      // Create a batch of updates to apply at once
      const updates = {}

      // Only update if values have changed - use deep comparison for products
      if (JSON.stringify(checkoutData.products) !== JSON.stringify(products)) {
        updates.products = products
      }

      if (checkoutData.totalPrice !== subtotal) {
        updates.totalPrice = subtotal
      }

      if (checkoutData.tax !== tax) {
        updates.tax = tax
      }

      if (checkoutData.totalAmount !== total) {
        updates.totalAmount = total
      }

      // Only call updateCheckoutData if we have changes to make
      if (Object.keys(updates).length > 0) {
        // Apply all updates at once
        Object.entries(updates).forEach(([key, value]) => {
          updateCheckoutData(key, value)
        })
      }
    }
  }, [products, selectedAddress, subtotal, tax, total]) // Remove checkoutData dependencies to prevent loops

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

  // Debug function to check product structure
  const debugProduct = (product) => {
    if (!product) return null

    // Try to access properties using different possible structures
    const name = product.productName || product.title || "Product"
    const description = product.productDescription || product.description || ""
    const price = product.price || product.expectedPrice || 0

    // Try to get image URL from different possible structures
    let imageUrl = "/placeholder.svg?height=80&width=80"
    if (product.images && product.images.length > 0 && product.images[0].imageUrl) {
      imageUrl = product.images[0].imageUrl
    } else if (product.imageURL) {
      imageUrl = product.imageURL
    }

    return { name, description, price, imageUrl }
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
          <ShoppingBag size={22} className="text-white mr-2" />
          <h2 className="text-xl font-semibold text-white">Order Summary</h2>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Order Details Section */}
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" variants={itemVariants}>
          {/* Shipping Address */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 relative">
            <div className="flex items-start gap-2 mb-3">
              <MapPin size={18} className="text-primary-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Shipping Address</h3>
                {selectedAddress ? (
                  <>
                    <p className="text-gray-700 text-sm font-medium">{selectedAddress.fullName}</p>
                    <p className="text-gray-600 text-sm">
                      {selectedAddress.address}, {selectedAddress.locality}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                    </p>
                    <p className="text-gray-600 text-sm">Phone: {selectedAddress.phone}</p>
                  </>
                ) : (
                  <p className="text-gray-500 text-sm">No address selected</p>
                )}
              </div>
            </div>
            <button
              onClick={() => setCurrentStep(1)}
              className="absolute top-3 right-3 p-1 text-gray-500 hover:text-primary-600 transition-colors"
            >
              <Edit2 size={16} />
            </button>
          </div>

          {/* Delivery Method */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-start gap-2 mb-3">
              <Truck size={18} className="text-primary-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Delivery Method</h3>
                <p className="text-gray-700 text-sm">Standard Delivery</p>
                <p className="text-gray-600 text-sm">Free - 3-5 business days</p>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-start gap-2 mb-3">
              <CreditCard size={18} className="text-primary-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Payment Method</h3>
                <p className="text-gray-700 text-sm">To be selected</p>
                <p className="text-gray-600 text-sm italic">Proceed to next step</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div className="mb-8" variants={itemVariants}>
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Price Details</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Items Subtotal ({products.length || cart?.cart?.totalItems || 0} items)</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (5%)</span>
                <span>₹{tax}</span>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold text-gray-800">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        </motion.div>

        {/* Products Section */}
        <motion.div variants={itemVariants}>
          <h3 className="font-semibold text-gray-800 mb-4">Order Items</h3>
          <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
            {checkoutData.isDirect ? (
              // Display direct product
              products.length > 0 && (
                <div className="flex items-center border-b border-gray-100 pb-4">
                  {/* Use the debugProduct helper to normalize product data */}
                  {(() => {
                    const product = debugProduct(products[0])
                    return (
                      <>
                        <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden mr-4 flex-shrink-0">
                          <img
                            src={product.imageUrl || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-gray-800 font-medium">{product.name}</h4>
                          <p className="text-gray-500 text-sm">{product.description?.substring(0, 60)}...</p>
                          <p className="text-gray-800 font-semibold mt-1">₹{product.price}</p>
                        </div>
                      </>
                    )
                  })()}
                </div>
              )
            ) : (
              // Display cart items
              <CartItems cart={cart} />
            )}
          </div>
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <motion.div
        className="flex justify-between bg-gray-50 px-6 py-4 border-t border-gray-100"
        variants={itemVariants}
      >
        <motion.button
          className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-5 rounded-xl transition-all duration-200 shadow-sm"
          type="button"
          onClick={() => setCurrentStep(1)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </motion.button>

        <motion.button
          className="relative flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-5 rounded-xl transition-all duration-200 shadow-sm"
          type="button"
          onClick={() => setCurrentStep(3)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!selectedAddress}
        >
          <span>Continue to Payment</span>
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

export default OrderSummary;