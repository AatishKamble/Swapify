import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"

const Profilecard = ({ title, subtitle, icon, onClick }) => {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full transition-all duration-300 cursor-pointer"
      onClick={onClick}
      whileHover={{
        y: -5,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gray-50 rounded-xl text-gray-700">{icon}</div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">{title}</h2>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center justify-center w-10 h-10">
          <ChevronRight className="text-gray-400" size={20} />
        </div>
      </div>
    </motion.div>
  )
}

export default Profilecard