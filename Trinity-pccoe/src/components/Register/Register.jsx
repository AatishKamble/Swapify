import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUserProfile, register } from "../../State/Auth/Action.js"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle } from "lucide-react"

const Register = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const auth = useSelector((store) => store.auth)

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showError, setShowError] = useState("")
  const [formStage, setFormStage] = useState(0) // 0: form, 1: success

  useEffect(() => {
    if (auth.jwt) {
      dispatch(getUserProfile(auth.jwt))
    }
  }, [auth.jwt, dispatch])

  const validateForm = () => {
    const newErrors = {}

    if (!form.firstName.trim()) {
      newErrors.firstName = "First name is required"
    } else if (form.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters"
    }

    if (!form.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    } else if (form.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters"
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!form.password) {
      newErrors.password = "Password is required"
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
    // Clear general error message
    if (showError) {
      setShowError("")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      setShowError("Please fix the errors before submitting.")
      return
    }

    setIsSubmitting(true)
    try {
      await dispatch(register(form))
      setFormStage(1) // Show success state
      setTimeout(() => {
        navigate("/signin")
      }, 3000)
    } catch (error) {
      setShowError("Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
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

  const successVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4 sm:p-6">
      <motion.div
        className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {formStage === 0 ? (
          <div className="p-8 sm:p-12">
            <motion.div className="flex justify-center mb-8" variants={itemVariants}>
              <img src="/assets/swapify-with-logo.png" alt="Swapify Logo" className="h-16 object-contain" />
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-2">Create Your Account</h2>
              <p className="text-gray-600 text-center mb-8">Join our community and start exploring</p>
            </motion.div>

            {showError && (
              <motion.div
                className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {showError}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div className="grid grid-cols-1 gap-6 sm:grid-cols-2" variants={itemVariants}>
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={form.firstName}
                      onChange={handleChange}
                      className={`pl-10 block w-full px-4 py-3 rounded-xl border ${
                        errors.firstName ? "border-red-300 bg-red-50" : "border-gray-300"
                      } shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 outline-none`}
                      placeholder="First Name"
                    />
                  </div>
                  {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                </div>

                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={form.lastName}
                      onChange={handleChange}
                      className={`pl-10 block w-full px-4 py-3 rounded-xl border ${
                        errors.lastName ? "border-red-300 bg-red-50" : "border-gray-300"
                      } shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 outline-none`}
                      placeholder="Last Name"
                    />
                  </div>
                  {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className={`pl-10 block w-full px-4 py-3 rounded-xl border ${
                      errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
                    } shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 outline-none`}
                    placeholder="Email address"
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
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    className={`pl-10 pr-12 block w-full px-4 py-3 rounded-xl border ${
                      errors.password ? "border-red-300 bg-red-50" : "border-gray-300"
                    } shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 outline-none`}
                    placeholder="Password (min. 6 characters)"
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

              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 relative overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="absolute right-full w-12 h-full bg-white/20 transform skew-x-12 transition-all duration-700 ease-out group-hover:right-0"></span>
                  {isSubmitting ? (
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
                      Creating account...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Create account
                      <ArrowRight
                        size={18}
                        className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </span>
                  )}
                </motion.button>
              </motion.div>
            </form>

            <motion.div variants={itemVariants} className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/signin"
                  className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                >
                  Sign in to your account
                </Link>
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div className="p-12 text-center" variants={successVariants} initial="hidden" animate="visible">
            <div className="flex justify-center mb-6">
              <motion.div
                className="rounded-full bg-green-100 p-3"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle size={48} className="text-green-600" />
              </motion.div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Created!</h2>
            <p className="text-gray-600 mb-8">
              Your account has been successfully created. Redirecting you to login...
            </p>
            <div className="flex justify-center">
              <Link
                to="/signin"
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
              >
                Go to Login
              </Link>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default Register

