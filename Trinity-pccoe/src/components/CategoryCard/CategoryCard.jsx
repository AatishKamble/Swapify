import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

const CategoryCard = ({ title, price, image, category, bgColor = "bg-teal-800" }) => {
  const navigate = useNavigate()

  // Handle card click
  const handleCardClick = () => {
    navigate(`/items?Categories=${encodeURIComponent(title)}`)
  }

  return (
    <motion.div
      className={`cursor-pointer overflow-hidden ${bgColor} rounded-xl shadow-lg group h-full relative`}
      onClick={handleCardClick}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
    >
      {/* Decorative SVG background - Reduced scaling and disabled pointer events */}
      <svg
        className="absolute bottom-0 left-0 mb-8 scale-100 group-hover:scale-110 transition-transform duration-500 pointer-events-none"
        viewBox="0 0 375 283"
        fill="none"
        style={{ opacity: 0.1 }}
      >
        <rect x="159.52" y="175" width="152" height="152" rx="8" transform="rotate(-45 159.52 175)" fill="white" />
        <rect y="107.48" width="152" height="152" rx="8" transform="rotate(-45 0 107.48)" fill="white" />
      </svg>

      {/* Image container with hover animation */}
      <motion.div
        className="relative pt-10 px-10 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div
          className="block absolute w-48 h-48 bottom-0 left-0 -mb-24 ml-3"
          style={{
            background: "radial-gradient(black, transparent 60%)",
            transform: "rotate3d(0, 0, 1, 20deg) scale3d(1, 0.6, 1)",
            opacity: 0.2,
          }}
        />
        <motion.img
          className="relative w-40 h-40 object-contain"
          src={image}
          alt={title}
          whileHover={{ rotate: [0, -5, 5, -5, 0] }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>

      {/* Card content */}
      <div className="relative text-white px-6 pb-6 mt-6">
        <motion.span className="block opacity-75 -mb-1" whileHover={{ opacity: 1 }}>
          {category}
        </motion.span>
        <div className="flex justify-between items-center">
          <motion.span className="block font-semibold text-xl" whileHover={{ scale: 1.05, originX: 0 }}>
            {title}
          </motion.span>
          {price && (
            <motion.span
              className="bg-white rounded-full text-teal-500 text-xs font-bold px-3 py-2 leading-none flex items-center"
              whileHover={{ scale: 1.1 }}
            >
              {price}
            </motion.span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default CategoryCard
