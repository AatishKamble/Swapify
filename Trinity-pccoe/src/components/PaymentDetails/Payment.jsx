import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { motion } from "framer-motion"
import { createOrder } from "../../State/Order/Action.js"
import InputField from "../FormFields/InputField"
import { CreditCard, ArrowLeft, CheckCircle, Calendar, Lock, AlertCircle } from "lucide-react"
import { CheckoutContext } from "../../pages/Checkout"

const Payment = ({ setCurrentStep }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { checkoutData, updateCheckoutData } = useContext(CheckoutContext)

  const [paymentMethod, setPaymentMethod] = useState("card")
  const [formData, setFormData] = useState({
    cardHolder: "",
    cardNumber: "",
    expiryMonth: "",
    cvc: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Update payment method in checkout context when it changes
  // Add paymentMethod to the dependency array to prevent infinite loop
  useEffect(() => {
    // Only update if the payment method in context is different from current state
    if (checkoutData.paymentMethod !== paymentMethod) {
      updateCheckoutData("paymentMethod", paymentMethod)
    }
  }, [paymentMethod, updateCheckoutData, checkoutData.paymentMethod])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // This function is needed because the InputField component expects this format
  const handleFormDataChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const isFormValid = () => {
    if (paymentMethod === "cod") return true

    return (
      formData.cardHolder.trim() !== "" &&
      formData.cardNumber.trim() !== "" &&
      formData.expiryMonth.trim() !== "" &&
      formData.cvc.trim() !== ""
    )
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()

    if (!checkoutData.shippingAddress) {
      setError("Missing shipping address. Please go back and try again.")
      return
    }

    if (!checkoutData.products || checkoutData.products.length === 0) {
      setError("No products in your order. Please go back and try again.")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      // Update payment info in checkout context
      if (paymentMethod === "card") {
        updateCheckoutData("paymentInfo", {
          cardHolder: formData.cardHolder,
          cardNumber: formData.cardNumber.replace(/\s/g, "").slice(-4), // Only store last 4 digits for security
          expiryMonth: formData.expiryMonth,
          cvc: formData.cvc,
        })
      }

      // Prepare the complete order data
      const orderData = {
        user: checkoutData.user,
        shippingAddress: checkoutData.shippingAddress,
        products: checkoutData.products,
        totalPrice: checkoutData.totalPrice,
        tax: checkoutData.tax,
        totalAmount: checkoutData.totalAmount,
        paymentMethod: paymentMethod === "card" ? "CARD" : "COD",
        paymentInfo:
          paymentMethod === "card"
            ? {
                cardHolder: formData.cardHolder,
                cardNumber: formData.cardNumber.replace(/\s/g, "").slice(-4),
                expiryMonth: formData.expiryMonth,
              }
            : null,
        isDirect: checkoutData.isDirect,
      }

      console.log("Submitting order:", orderData)

      // Create the order
      await dispatch(createOrder(orderData))

      // Show success message
      setSuccess(true)

      // Clear direct purchase data if it exists
      if (localStorage.getItem("direct")) {
        localStorage.removeItem("direct")
        localStorage.removeItem("buyingProd")
      }

      // Redirect to order confirmation after a delay
      setTimeout(() => {
        navigate("/orders")
      }, 1000)
    } catch (err) {
      console.error("Error creating order:", err)
      setError("Failed to place your order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

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

  // If order is successful, show success message
  if (success) {
    return (
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-8 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle size={40} className="text-green-600" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Order Placed Successfully!</h2>
        <p className="text-gray-600 mb-6">Thank you for your purchase. Your order has been placed successfully.</p>
        <p className="text-gray-500 mb-8">You will be redirected to your orders page shortly...</p>
        <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto rounded-full"></div>
      </motion.div>
    )
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
          <CreditCard size={22} className="text-white mr-2" />
          <h2 className="text-xl font-semibold text-white">Payment Information</h2>
        </motion.div>
      </div>

      {/* Error message */}
      {error && (
        <motion.div
          className="m-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 flex items-center gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle size={20} />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Order Summary */}
        <motion.div className="mb-6" variants={itemVariants}>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Order Summary</h3>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">₹{checkoutData.totalPrice || 0}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Tax:</span>
              <span className="font-medium">₹{checkoutData.tax || 0}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-800 pt-2 border-t border-gray-200">
              <span>Total:</span>
              <span>₹{checkoutData.totalAmount || 0}</span>
            </div>
          </div>
        </motion.div>

        {/* Payment Method Selection */}
        <motion.div className="mb-6" variants={itemVariants}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Payment Method</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className={`border ${
                paymentMethod === "card" ? "border-primary-500 bg-primary-50" : "border-gray-200"
              } rounded-xl p-4 cursor-pointer transition-all duration-200 hover:border-primary-500 hover:bg-primary-50`}
              onClick={() => setPaymentMethod("card")}
            >
              <div className="flex items-center">
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    paymentMethod === "card" ? "border-primary-500" : "border-gray-300"
                  }`}
                >
                  {paymentMethod === "card" && <div className="w-3 h-3 rounded-full bg-primary-500"></div>}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-800">Credit/Debit Card</p>
                  <p className="text-xs text-gray-500">Pay securely with your card</p>
                </div>
              </div>
            </div>

            <div
              className={`border ${
                paymentMethod === "cod" ? "border-primary-500 bg-primary-50" : "border-gray-200"
              } rounded-xl p-4 cursor-pointer transition-all duration-200 hover:border-primary-500 hover:bg-primary-50`}
              onClick={() => setPaymentMethod("cod")}
            >
              <div className="flex items-center">
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    paymentMethod === "cod" ? "border-primary-500" : "border-gray-300"
                  }`}
                >
                  {paymentMethod === "cod" && <div className="w-3 h-3 rounded-full bg-primary-500"></div>}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-800">Cash on Delivery</p>
                  <p className="text-xs text-gray-500">Pay when you receive your order</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Card Payment Form */}
        {paymentMethod === "card" && (
          <motion.form className="space-y-5" variants={containerVariants} initial="hidden" animate="visible">
            {/* Card Holder Name */}
            <motion.div variants={itemVariants}>
              <InputField
                type="text"
                name="cardHolder"
                lableText="Name on Card"
                setFormData={handleFormDataChange}
                value={formData.cardHolder}
                placeholder="Enter Name on Card"
                required
                icon={<CreditCard size={16} />}
              />
            </motion.div>

            {/* Card Number */}
            <motion.div variants={itemVariants}>
              <InputField
                type="text"
                name="cardNumber"
                lableText="Card Number"
                setFormData={handleFormDataChange}
                value={formData.cardNumber}
                placeholder="XXXX XXXX XXXX XXXX"
                required
                icon={<CreditCard size={16} />}
              />
            </motion.div>

            {/* Expiry Month & CVC */}
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4" variants={itemVariants}>
              <InputField
                type="month"
                name="expiryMonth"
                lableText="Expiry Date"
                setFormData={handleFormDataChange}
                value={formData.expiryMonth}
                required
                icon={<Calendar size={16} />}
              />
              <InputField
                type="password"
                name="cvc"
                lableText="CVC"
                setFormData={handleFormDataChange}
                value={formData.cvc}
                placeholder="XXX"
                required
                icon={<Lock size={16} />}
              />
            </motion.div>

            {/* Secure Payment Notice */}
            <motion.div
              className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-start gap-2"
              variants={itemVariants}
            >
              <Lock size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-600">
                Your payment information is secure. We use industry-standard encryption to protect your data.
              </p>
            </motion.div>
          </motion.form>
        )}

        {/* Cash on Delivery */}
        {paymentMethod === "cod" && (
          <motion.div className="bg-gray-50 rounded-xl p-4 border border-gray-100" variants={itemVariants}>
            <p className="text-gray-700 mb-2">You will pay for your order when it is delivered to your address.</p>
            <p className="text-sm text-gray-600">
              Please ensure someone is available to receive the package and make the payment.
            </p>
          </motion.div>
        )}
      </div>

      {/* Navigation Buttons */}
      <motion.div
        className="flex justify-between bg-gray-50 px-6 py-4 border-t border-gray-100"
        variants={itemVariants}
      >
        <motion.button
          className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-5 rounded-xl transition-all duration-200 shadow-sm"
          type="button"
          onClick={() => setCurrentStep(2)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </motion.button>

        <motion.button
          className={`flex items-center gap-2 ${
            isFormValid() ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
          } text-white font-medium py-2 px-5 rounded-xl transition-all duration-200 shadow-sm`}
          type="button"
          onClick={handleSubmit}
          whileHover={isFormValid() ? { scale: 1.02 } : {}}
          whileTap={isFormValid() ? { scale: 0.98 } : {}}
          disabled={isSubmitting || !isFormValid()}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <CheckCircle size={16} />
              <span>Place Order</span>
            </>
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default Payment;