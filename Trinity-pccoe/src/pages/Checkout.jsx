import { useEffect, useState, createContext } from "react"
import UserDetail from "../components/UserDetail/UserDetail.jsx"
import AddressEdit from "../components/AddressEdit/AddressEdit.jsx"
import Payment from "../components/PaymentDetails/Payment.jsx"
import OrderSummary from "../components/OrderSummarys/OrderSummary.jsx"
import { useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, MapPin, ShoppingBag, CreditCard } from "lucide-react"

// Create context for checkout data
export const CheckoutContext = createContext(null)

const steps = [
  { label: "Details", icon: <CheckCircle size={18} /> },
  { label: "Address", icon: <MapPin size={18} /> },
  { label: "Order Summary", icon: <ShoppingBag size={18} /> },
  { label: "Payment", icon: <CreditCard size={18} /> },
]

const Checkout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const searchParams = new URLSearchParams(location.search)
  const [currentStep, setCurrentStep] = useState(0)
  const [checkoutData, setCheckoutData] = useState({
    user: null,
    shippingAddress: null,
    products: null,
    totalPrice: 0,
    tax: 0,
    totalAmount: 0,
    paymentMethod: null,
    paymentInfo: null,
    isDirect: false,
  })

  // Check if this is a direct product purchase
  useEffect(() => {
    const isDirect = localStorage.getItem("direct")
    const buyingProduct = localStorage.getItem("buyingProd")

    if (isDirect && buyingProduct) {
      try {
        const parsedProduct = JSON.parse(buyingProduct)
        setCheckoutData((prev) => ({
          ...prev,
          isDirect: true,
          products: [parsedProduct],
        }))
      } catch (error) {
        console.error("Error parsing direct product:", error)
      }
    }
  }, [])

  useEffect(() => {
    searchParams.set("step", currentStep)
    const query = searchParams.toString()
    navigate({ search: `?${query}` })
  }, [currentStep, navigate, searchParams])

  const updateCheckoutData = (key, value) => {
    setCheckoutData((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  }

  return (
    <CheckoutContext.Provider value={{ checkoutData, updateCheckoutData }}>
      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
        {/* Stepper */}
        <motion.div
          className="max-w-5xl mx-auto mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Checkout</h1>
              <p className="text-sm text-gray-500">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>

            <div className="relative">
              {/* Progress bar */}
              <div className="absolute left-0 w-[96%] h-0.5 bg-gray-200 translate-y-5 z-0"></div>
              <div
                className="absolute left-0 h-0.5 bg-primary-600 translate-y-5 transition-all duration-500 z-0"
                style={{ width: `${(currentStep / (steps.length - 1)) * 96}%` }}
              ></div>

              {/* Steps */}
              <div className="relative z-10 flex justify-between">
                {steps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center">
                    {/* Circle container with fixed positioning relative to the line */}
                    <div className="w-10 h-10 flex items-center justify-center relative">
                      <div
                        className={`w-10 h-10 rounded-full border-2 transition-all duration-300 flex items-center justify-center absolute top-1/2 -translate-y-1/2 ${
                          index <= currentStep
                            ? "border-primary-600 bg-primary-600 text-white"
                            : "border-gray-300 bg-white text-gray-400"
                        }`}
                      >
                        {step.icon}
                      </div>
                    </div>
                    {/* Label with margin to separate from circle */}
                    {step.label && <span className="mt-10 text-xs font-medium">{step.label}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div key="user-detail" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                <UserDetail handleNext={setCurrentStep} />
              </motion.div>
            )}
            {currentStep === 1 && (
              <motion.div key="address-edit" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                <AddressEdit setCurrentStep={setCurrentStep} />
              </motion.div>
            )}
            {currentStep === 2 && (
              <motion.div key="order-summary" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                <OrderSummary setCurrentStep={setCurrentStep} />
              </motion.div>
            )}
            {currentStep === 3 && (
              <motion.div key="payment" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                <Payment setCurrentStep={setCurrentStep} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </CheckoutContext.Provider>
  )
}

export default Checkout;