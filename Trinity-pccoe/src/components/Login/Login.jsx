import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { getUserProfile, login } from "../../State/Auth/Action.js"
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react"

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const auth = useSelector((store) => store.auth)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  })

  useEffect(() => {
    if (auth.jwt) {
      dispatch(getUserProfile(auth.jwt))
    }
  }, [auth.jwt, dispatch])

  // Add this useEffect to handle redirection after successful login
  useEffect(() => {
    if (auth.user) {
      // Check if there's a return URL stored in localStorage
      const returnUrl = localStorage.getItem("returnUrl")
      if (returnUrl) {
        localStorage.removeItem("returnUrl")
        navigate(returnUrl)
      } else {
        // Default redirect if no return URL is specified
        navigate("/")
      }
    }
  }, [auth.user, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { email: "", password: "" }

    if (!formData.email) {
      newErrors.email = "Email is required"
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
      valid = false
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    dispatch(login(formData))
      .then(() => {
        setFormData({ email: "", password: "" })
      })
      .catch((error) => {
        setErrors({
          email: "Invalid email or password",
          password: "Invalid email or password",
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

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
      transition: { duration: 0.4, ease: "easeOut" },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4 sm:p-6">
      <motion.div
        className="flex flex-col lg:flex-row w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Login Form */}
        <motion.div className="w-full lg:w-1/2 p-8 sm:p-12" variants={itemVariants}>
          <div className="flex justify-center mb-8">
            <motion.img
              src="/assets/swapify-with-logo.png"
              alt="Swapify Logo"
              className="h-16 object-contain"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <motion.div variants={itemVariants}>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-2">Welcome Back</h2>
            <p className="text-gray-600 text-center mb-8">Sign in to your account to continue</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                    errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
                  } focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 outline-none`}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border ${
                    errors.password ? "border-red-300 bg-red-50" : "border-gray-300"
                  } focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 outline-none`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                Forgot password?
              </Link>
            </motion.div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center relative overflow-hidden group"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="absolute right-full w-12 h-full bg-white/20 transform skew-x-12 transition-all duration-700 ease-out group-hover:right-0"></span>
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center">
                  Sign In
                  <ArrowRight size={18} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              )}
            </motion.button>
          </form>

          <motion.div variants={itemVariants} className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/signup"
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
              >
                Create an account
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Feature Showcase */}
        <motion.div className="hidden lg:block w-1/2 bg-white p-12 border-l border-gray-100" variants={itemVariants}>
          <div className="h-full flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="max-w-lg"
              >
                <motion.img
                  src="/assets/xchange.png"
                  alt="Swapify Features"
                  className="w-full h-auto rounded-lg"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.h3
                  className="text-gray-800 text-xl font-bold mt-6 mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  Campus Marketplace
                </motion.h3>
                <motion.p
                  className="text-gray-600"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  Buy, sell, and exchange items with other students on your campus. Save money and reduce waste with
                  Swapify.
                </motion.p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Login;