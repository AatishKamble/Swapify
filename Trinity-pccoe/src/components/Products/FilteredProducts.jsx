import { useEffect } from "react"
import { motion } from "framer-motion"
import { useSelector, useDispatch } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import Pagination from "@mui/material/Pagination"
import ProductCard from "./ProductCard"
import { ShoppingBag } from "lucide-react"
import { getUserCart, getUserWishlist } from "../../State/Cart/Action.js"

const FilteredProducts = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const searchParams = new URLSearchParams(location.search)
  const { product } = useSelector((store) => store)
  const auth = useSelector((store) => store.auth)

  // Get current page from query, default to 1
  const currentPage = Number(searchParams.get("page")) || 1
  const totalPages = product.products?.totalPages || 1

  // Fetch cart and wishlist data if user is logged in
  useEffect(() => {
    if (auth.user) {
      dispatch(getUserCart())
      dispatch(getUserWishlist())
    }
  }, [auth.user, dispatch])

  // Handle pagination change
  function handlePageChange(event, page) {
    searchParams.set("page", page)
    navigate({ search: `?${searchParams.toString()}` })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  // Empty state when no products are found
  if (!product.products?.content || product.products.content.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center py-16 px-4"
      >
        <div className="bg-gray-50 rounded-full p-6 mb-6">
          <ShoppingBag size={64} className="text-gray-400" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">No products found</h3>
        <p className="text-gray-600 text-center max-w-md mb-6">
          We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
        </p>
        <button
          onClick={() => navigate("/items")}
          className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          View all products
        </button>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col min-h-[60vh]">
      {/* Products grid with responsive columns */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {product.products?.content?.map((item) => (
          <motion.div key={item._id} variants={itemVariants} className="flex justify-center">
            <ProductCard
              productName={item.title}
              productImage={item.imageURL}
              productPrice={item.price}
              productId={item._id}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 mb-6 flex justify-center">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            size="large"
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#4F46E5",
                borderColor: "#E5E7EB",
                fontWeight: 500,
                "&.Mui-selected": {
                  backgroundColor: "#4F46E5",
                  color: "white",
                  borderColor: "#4F46E5",
                  "&:hover": {
                    backgroundColor: "#4338CA",
                  },
                },
                "&:hover": {
                  backgroundColor: "#F9FAFB",
                },
              },
            }}
          />
        </div>
      )}
    </div>
  )
}

export default FilteredProducts;