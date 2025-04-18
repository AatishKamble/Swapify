import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { findProducts } from "../../State/Product/Action.js"
import { addToCart, getUserCart } from "../../State/Cart/Action.js"
import { addToWishlist, getUserWishlist } from "../../State/Cart/Action.js"
import { ShoppingCart, Heart, Check } from "lucide-react"
import LoginPrompt from "../Auth/LoginPrompt.jsx"

const RecommendedProducts = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const auth = useSelector((store) => store.auth)
  const { products } = useSelector((store) => store.product)
  const wishlist = useSelector((store) => store.cart.wishlist)
  const cart = useSelector((store) => store.cart.cart)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [pendingAction, setPendingAction] = useState(null)
  const [wishlistedItems, setWishlistedItems] = useState({})
  const [cartedItems, setCartedItems] = useState({})
  const [addingToCart, setAddingToCart] = useState({})

  // Fetch products on component mount
  useEffect(() => {
    const data = {
      category: [],
      minPrice: 0,
      maxPrice: 1000000,
      sort: "Date-Created",
      pageNumber: 0,
      pageSize: 8, // Fetch 8 products (7 to display + 1 extra)
    }
    dispatch(findProducts(data))
  }, [dispatch])

  // Fetch wishlist and cart if user is logged in
  useEffect(() => {
    if (auth.user) {
      dispatch(getUserWishlist())
      dispatch(getUserCart())
    }
  }, [auth.user, dispatch])

  // Update wishlistedItems when wishlist changes
  useEffect(() => {
    if (wishlist?.wishlistItems) {
      const newWishlistedItems = {}
      wishlist.wishlistItems.forEach((item) => {
        if (item.product && item.product._id) {
          newWishlistedItems[item.product._id] = true
        }
      })
      setWishlistedItems(newWishlistedItems)
    }
  }, [wishlist])

  // Update cartedItems when cart changes
  useEffect(() => {
    if (cart?.cartItems) {
      const newCartedItems = {}
      cart.cartItems.forEach((item) => {
        if (item.product && item.product._id) {
          newCartedItems[item.product._id] = {
            inCart: true,
            quantity: item.quantity,
            cartItemId: item._id,
          }
        }
      })
      setCartedItems(newCartedItems)
    }
  }, [cart])

  // Handle pending actions after login
  useEffect(() => {
    // Check for pending actions in localStorage when user logs in
    if (auth.user) {
      const storedPendingAction = localStorage.getItem("pendingAction")
      if (storedPendingAction) {
        const action = JSON.parse(storedPendingAction)

        if (action.type === "cart") {
          const data = { productId: action.productId }
          dispatch(addToCart(data))
          dispatch(getUserCart())
        } else if (action.type === "wishlist") {
          const data = { productId: action.productId }
          dispatch(addToWishlist(data))
          setWishlistedItems((prev) => ({
            ...prev,
            [action.productId]: true,
          }))
        }

        // Clear the pending action from localStorage
        localStorage.removeItem("pendingAction")
      }

      // Also handle component-level pending action
      if (pendingAction) {
        if (pendingAction.type === "cart") {
          const data = { productId: pendingAction.productId }
          dispatch(addToCart(data))
          dispatch(getUserCart())
        } else if (pendingAction.type === "wishlist") {
          const data = { productId: pendingAction.productId }
          dispatch(addToWishlist(data))
          setWishlistedItems((prev) => ({
            ...prev,
            [pendingAction.productId]: true,
          }))
        }
        setPendingAction(null)
      }
    }
  }, [auth.user, pendingAction, dispatch])

  // Handle product click
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`)
  }

  // Handle add to cart
  const handleAddToCart = async (e, productId) => {
    e.stopPropagation() // Prevent navigating to product page

    if (!auth.user) {
      // If user is not logged in, store the pending action in localStorage and show login prompt
      localStorage.setItem("pendingAction", JSON.stringify({ type: "cart", productId }))
      setShowLoginPrompt(true)
      setPendingAction({ type: "cart", productId })
      return
    }

    // If already in cart, navigate to cart page instead
    if (cartedItems[productId]?.inCart) {
      navigate("/cart")
      return
    }

    try {
      setAddingToCart((prev) => ({ ...prev, [productId]: true }))
      const data = { productId }
      await dispatch(addToCart(data))
      await dispatch(getUserCart())

      // Optimistically update UI
      setCartedItems((prev) => ({
        ...prev,
        [productId]: { inCart: true, quantity: 1 },
      }))
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setAddingToCart((prev) => ({ ...prev, [productId]: false }))
    }
  }

  // Handle add to wishlist
  const handleAddToWishlist = (e, productId) => {
    e.stopPropagation() // Prevent navigating to product page

    if (!auth.user) {
      // If user is not logged in, store the pending action in localStorage and show login prompt
      localStorage.setItem("pendingAction", JSON.stringify({ type: "wishlist", productId }))
      setShowLoginPrompt(true)
      setPendingAction({ type: "wishlist", productId })
      return
    }

    const data = { productId }
    dispatch(addToWishlist(data))

    // Toggle wishlist state locally for immediate UI feedback
    setWishlistedItems((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }))
  }

  // Handle login confirmation
  const handleLoginConfirm = () => {
    setShowLoginPrompt(false)
    navigate("/signin")
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
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  const headingVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  // Cart button animation variants
  const cartButtonVariants = {
    initial: { scale: 1 },
    added: {
      scale: [1, 1.2, 1],
      transition: { duration: 0.5 },
    },
  }

  // If products are still loading, show a loading state
  if (!products?.content) {
    return (
      <section className="py-16 overflow-hidden bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-800">Recommended Products</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
          <div className="flex justify-center">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        {/* Animated heading */}
        <motion.div className="text-center mb-12" initial="hidden" animate="visible" variants={headingVariants}>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-800">Recommended Products</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </motion.div>

        {/* Animated product grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Display first 7 products */}
          {products?.content?.slice(0, 7).map((product, index) => (
            <motion.div
              key={product._id}
              className="mx-auto w-full max-w-xs sm:max-w-none" // Center cards and limit width on small screens
              variants={itemVariants}
              whileHover={{
                scale: 1.03,
                transition: { duration: 0.2 },
              }}
              onClick={() => handleProductClick(product._id)}
            >
              {/* Creative card design with layered look */}
              <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden h-full transform transition-all duration-300 hover:shadow-xl cursor-pointer">
                {/* Decorative top corner accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full z-0"></div>

                {/* Wishlist button */}
                <motion.button
                  className="absolute top-4 right-4 z-10 bg-white p-2 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                  onClick={(e) => handleAddToWishlist(e, product._id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart
                    size={18}
                    className={wishlistedItems[product._id] ? "text-red-500 fill-red-500" : "text-gray-400"}
                  />
                </motion.button>

                {/* Image container with hover effect */}
                <div className="relative overflow-hidden">
                  <motion.div
                    className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={product.imageURL || "/placeholder.svg?height=200&width=200"}
                      alt={product.title}
                      className="object-contain max-h-full max-w-full transition-all duration-500"
                    />

                    {/* Decorative circles */}
                    <div className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full bg-blue-500/5"></div>
                    <div className="absolute top-4 -right-4 w-12 h-12 rounded-full bg-purple-500/5"></div>
                  </motion.div>

                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                      {product.category?.name || "Product"}
                    </span>
                  </div>
                </div>

                {/* Product details with layered design */}
                <div className="p-6 relative">
                  {/* Title with animated underline on hover */}
                  <h3 className="text-gray-800 font-semibold text-lg mb-2 line-clamp-1 group">
                    {product.title}
                    <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-blue-600 mt-1"></span>
                  </h3>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex flex-col">
                      <span className="text-gray-500 text-sm">Price</span>
                      <span className="text-blue-600 text-xl font-bold">₹{product.price}</span>
                    </div>

                    {/* Cart button with different states */}
                    {cartedItems[product._id]?.inCart ? (
                      // Already in cart state
                      <motion.button
                        className="relative w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-md text-white overflow-hidden"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => handleAddToCart(e, product._id)}
                        initial="initial"
                        animate="added"
                        variants={cartButtonVariants}
                      >
                        <Check size={20} />

                        {/* Badge showing quantity */}
                        {cartedItems[product._id]?.quantity > 1 && (
                          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                            {cartedItems[product._id]?.quantity}
                          </span>
                        )}
                      </motion.button>
                    ) : (
                      // Not in cart state
                      <motion.button
                        className="relative w-12 h-12 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center shadow-md text-blue-600 overflow-hidden group disabled:opacity-70"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => handleAddToCart(e, product._id)}
                        disabled={addingToCart[product._id]}
                      >
                        {/* Animated fill background */}
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>

                        {addingToCart[product._id] ? (
                          <div className="relative z-10 w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin group-hover:border-white group-hover:border-t-transparent"></div>
                        ) : (
                          <ShoppingCart
                            size={20}
                            className="relative z-10 group-hover:text-white transition-colors duration-300"
                          />
                        )}
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* View All Products Card */}
          <motion.div
            className="mx-auto w-full max-w-xs sm:max-w-none" // Center cards and limit width on small screens
            variants={itemVariants}
            whileHover={{
              scale: 1.03,
              transition: { duration: 0.2 },
            }}
          >
            <div
              onClick={() => navigate("/items")}
              className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg overflow-hidden h-full flex flex-col items-center justify-center p-8 text-center text-white relative cursor-pointer"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mt-16"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mb-16"></div>

              <motion.div
                className="mb-6 bg-white/20 p-5 rounded-full relative z-10"
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </motion.div>
              <h3 className="text-2xl font-bold mb-3 relative z-10">View All Products</h3>
              <p className="text-white/80 mb-4 relative z-10">Explore our complete collection</p>
              <motion.div
                className="mt-2 flex items-center text-sm font-medium relative z-10"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              >
                Browse Now
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1"
                >
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Login Prompt Modal */}
      {showLoginPrompt && <LoginPrompt onConfirm={handleLoginConfirm} onCancel={() => setShowLoginPrompt(false)} />}
    </section>
  )
}

export default RecommendedProducts;