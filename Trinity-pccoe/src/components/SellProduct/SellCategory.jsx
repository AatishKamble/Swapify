import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Package, ChevronRight, ArrowRight } from "lucide-react"

const SellCategory = ({ onSelectCategory, selectedCategory }) => {
  const [open, setOpen] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  const categories = [
    "Books & Study Materials",
    "Electronic",
    "Photography & Videography",
    "Clothing & Accessories",
    "Furniture & Home Essentials",
    "Gaming & Accessories",
    "Sports & Fitness",
    "Toy",
    "Miscellaneous",
  ]

  const subcategories = {
    Electronic: [
      "Mobile Phones & Tablets",
      "Laptops & Accessories",
      "Cameras",
      "Headphones & Speakers",
      "Smartwatches & Gadgets",
      "Desktops & Monitors",
      "Keyboards & Mice",
      "Wi-Fi Routers & Modems",
      "Cables & Adapters",
      "USB Hubs",
    ],
    "Books & Study Materials": [
      "Fiction",
      "Non-fiction",
      "Fantasy",
      "Textbooks & Reference Books",
      "Notebooks & Stationery",
    ],
    Toy: ["Action Figures", "Board Games", "Puzzles"],
    "Furniture & Home Essentials": ["Desks & Chairs", "Beds & Mattresses", "Kitchen Appliances"],
    "Clothing & Accessories": ["Formal Wear", "Casual Wear", "Shoes & Bags"],
    Miscellaneous: ["Sports & Fitness Equipment", "Hobby & Musical Instruments"],
    "Gaming & Accessories": ["Gaming Consoles & Controllers", "VR Headsets & Simulators", "Gaming Chairs & Desks"],
    "Photography & Videography": ["DSLR & Mirrorless Cameras", "Camera Accessories", "Lighting & Studio Equipment"],
    "Sports & Fitness": [
      "Dumbbells & Resistance Bands",
      "Yoga Mats & Foam Rollers",
      "Footballs & Basketballs",
      "Cricket Bats & Kits",
      "Badminton & Tennis Rackets",
    ],
  }

  function handleParentCategory(item) {
    if (item !== selectedCategory.mainCategory) {
      onSelectCategory((prev) => ({ ...prev, mainCategory: item }))
      setOpen(true)
    }
    if (item === selectedCategory.mainCategory) {
      setOpen(!open)
    }
  }

  function handleSubCategory(item) {
    if (item !== selectedCategory.subcategory) {
      onSelectCategory((prev) => ({ ...prev, subcategory: item }))
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
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

  const subCategoryVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div className="max-w-5xl mx-auto" initial="hidden" animate="visible" variants={containerVariants}>
        <motion.div className="text-center mb-10" variants={itemVariants}>
          <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-full mb-4">
            <Package size={28} className="text-primary-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">What would you like to sell?</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Select a category and subcategory to start listing your product
          </p>
        </motion.div>

        <motion.div className="bg-white rounded-2xl shadow-xl p-6 md:p-8" variants={itemVariants}>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Main Categories */}
            <motion.div className="w-full md:w-1/2 space-y-3" variants={containerVariants}>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Categories</h3>

              {categories.map((item, index) => (
                <motion.button
                  key={index}
                  variants={itemVariants}
                  onClick={() => handleParentCategory(item)}
                  onMouseEnter={() => {
                    if (!isMobile) {
                      handleParentCategory(item)
                      setHoveredCategory(item)
                    }
                  }}
                  onMouseLeave={() => {
                    if (!isMobile) {
                      setHoveredCategory(null)
                    }
                  }}
                  className={`w-full px-5 py-4 text-left rounded-xl transition-all duration-300 flex items-center justify-between
                    ${
                      selectedCategory.mainCategory === item
                        ? "bg-primary-600 text-white shadow-md transform scale-[1.02]"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md"
                    }
                    text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{item}</span>
                  <ChevronRight
                    size={18}
                    className={`transition-transform duration-300 ${selectedCategory.mainCategory === item ? "rotate-90" : ""}`}
                  />
                </motion.button>
              ))}
            </motion.div>

            {/* Sub Categories */}
            <AnimatePresence>
              {open && (
                <motion.div
                  className="w-full md:w-1/2 space-y-3 md:border-l md:border-gray-200 md:pl-8"
                  initial="hidden"
                  animate="visible"
                  variants={subCategoryVariants}
                >
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Subcategories</h3>

                  {subcategories[selectedCategory.mainCategory]?.map((item, index) => (
                    <motion.button
                      key={index}
                      variants={itemVariants}
                      onClick={() => handleSubCategory(item)}
                      className={`w-full px-5 py-3 text-left rounded-xl transition-all duration-300 flex items-center justify-between
                        ${
                          selectedCategory.subcategory === item
                            ? "bg-green-600 text-white shadow-md transform scale-[1.02]"
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:shadow-md"
                        }
                        text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>{item}</span>
                      {selectedCategory.subcategory === item && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
                          <ArrowRight size={18} />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default SellCategory

