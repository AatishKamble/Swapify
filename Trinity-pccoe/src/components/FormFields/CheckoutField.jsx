import { useState } from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

const CheckoutField = ({
  type,
  name,
  labelText,
  setFormData,
  value,
  placeholder = "",
  error = "",
  required = false,
  disabled = false,
  icon = null,
  autoComplete = "",
  mask = null,
  validation = null,
  successMessage = "",
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isValid, setIsValid] = useState(false)

  function handleOnChange(event) {
    const name = event.target.name
    let value = event.target.value

    // Apply mask if provided (e.g., for credit card, phone numbers)
    if (mask && typeof mask === "function") {
      value = mask(value)
    }

    setFormData((formData) => ({ ...formData, [name]: value }))

    // Validate input if validation function is provided
    if (validation && typeof validation === "function") {
      setIsValid(validation(value))
    }
  }

  return (
    <motion.div
      className="mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1.5">
        {labelText}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            {icon}
          </div>
        )}

        <input
          type={type}
          id={name}
          name={name}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`w-full ${icon ? "pl-10" : "pl-4"} pr-${isValid ? "10" : "4"} py-2.5 bg-white border ${
            error
              ? "border-red-300 focus:ring-red-200"
              : isFocused
                ? "border-primary-300 focus:ring-primary-100"
                : "border-gray-200 focus:ring-gray-100"
          } rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:border-gray-300 transition-all duration-200 text-gray-800 text-sm ${
            disabled ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""
          }`}
          onChange={handleOnChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {/* Success indicator */}
        {isValid && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-green-100 text-green-600 rounded-full p-0.5"
            >
              <Check size={16} />
            </motion.div>
          </div>
        )}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-1.5 text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}

      {isValid && successMessage && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-1.5 text-sm text-green-600"
        >
          {successMessage}
        </motion.p>
      )}
    </motion.div>
  )
}

export default CheckoutField

