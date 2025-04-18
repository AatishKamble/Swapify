import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ProductsUpload from "./ProductsUpload.jsx"
import SellCategory from "./SellCategory.jsx"

const SellProduct = () => {
  const [selectedCategory, setSelectedCategory] = useState({
    mainCategory: "",
    subcategory: "",
  })

  const backButton = () => {
    setSelectedCategory({
      mainCategory: "",
      subcategory: "",
    })
  }

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence mode="wait">
        {selectedCategory.mainCategory === "" || selectedCategory.subcategory === "" ? (
          <motion.div key="category-selection" initial="initial" animate="animate" exit="exit" variants={pageVariants}>
            <SellCategory onSelectCategory={setSelectedCategory} selectedCategory={selectedCategory} />
          </motion.div>
        ) : (
          <motion.div key="product-upload" initial="initial" animate="animate" exit="exit" variants={pageVariants}>
            <ProductsUpload selectedCategory={selectedCategory} backButton={backButton} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SellProduct