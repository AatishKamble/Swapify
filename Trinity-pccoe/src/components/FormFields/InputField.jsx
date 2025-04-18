import { motion } from "framer-motion"

const InputField = ({
  type,
  name,
  lableText,
  setFormData,
  value,
  placeholder = "",
  error = "",
  required = false,
  disabled = false,
  icon = null,
}) => {
  function handleOnChange(event) {
    const name = event.target.name
    const value = event.target.value
    // Call setFormData with name and value directly, not with a function
    setFormData(name, value)
  }

  return (
    <motion.div
      className="mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1.5">
        {lableText}
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
          className={`w-full ${icon ? "pl-10" : "pl-4"} pr-4 py-2.5 bg-white border ${
            error ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-gray-100"
          } rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:border-gray-300 transition-all duration-200 text-gray-800 text-sm ${
            disabled ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""
          }`}
          onChange={handleOnChange}
        />
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
    </motion.div>
  )
}

export default InputField