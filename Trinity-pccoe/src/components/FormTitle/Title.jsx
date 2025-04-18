import { motion } from "framer-motion"

const Title = ({ title, subtitle }) => {
  return (
    <motion.div
      className="w-full mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{title}</h1>
        <p className="text-gray-600 text-sm md:text-base">{subtitle}</p>
      </div>
      <div className="mt-4 flex justify-center">
        <div className="w-20 h-1 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full"></div>
      </div>
    </motion.div>
  )
}

export default Title