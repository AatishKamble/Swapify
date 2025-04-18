import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Trash2, ShoppingCart, ArrowRight, Loader, Check } from "lucide-react"
import { getUserWishlist, removeItemFromWishlist, addToCart, getUserCart } from "../../State/Cart/Action.js"

const Wishlist = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { wishlist, loading, cart } = useSelector((store) => store.cart)
  const auth = useSelector((store) => store.auth)
  const [removingItems, setRemovingItems] = useState({})
  const [addingToCart, setAddingToCart] = useState({})
  const [removedItems, setRemovedItems] = useState({}) // Track locally removed items
  const [cartItems, setCartItems] = useState({}) // Track which items are in cart
  const [cartButtonAnimating, setCartButtonAnimating] = useState({}) // Track cart button animations

  // Fetch wishlist and cart on component mount if user is logged in
  useEffect(() => {
    if (auth.user) {
      dispatch(getUserWishlist())
      dispatch(getUserCart())
    } else {
      // Redirect to login if not authenticated
      navigate("/signin")
    }
  }, [auth.user, dispatch, navigate])

  // Update cartItems when cart changes
  useEffect(() => {
    if (cart?.cartItems) {
      const newCartItems = {}
      cart.cartItems.forEach((item) => {
        if (item.product && item.product._id) {
          newCartItems[item.product._id] = {
            inCart: true,
            quantity: item.quantity,
            cartItemId: item._id,
          }
        }
      })
      setCartItems(newCartItems)
    }
  }, [cart])

  // Debug logging to help troubleshoot
  useEffect(() => {
    console.log("Current wishlist state:", wishlist)
    console.log("Current cart state:", cart)
  }, [wishlist, cart])

  // Function to remove item from wishlist
  const handleRemoveFromWishlist = async (wishlistItemId) => {
    try {
      setRemovingItems((prev) => ({ ...prev, [wishlistItemId]: true }))

      // Optimistically update UI by marking item as removed
      setRemovedItems((prev) => ({ ...prev, [wishlistItemId]: true }))

      // Call the action creator to remove the item
      await dispatch(removeItemFromWishlist(wishlistItemId))

      // Refresh wishlist after removal
      await dispatch(getUserWishlist())

      console.log(`Item ${wishlistItemId} removed successfully`)
    } catch (error) {
      console.error("Error removing item from wishlist:", error)
      // Revert optimistic update if there was an error
      setRemovedItems((prev) => ({ ...prev, [wishlistItemId]: false }))
    } finally {
      setRemovingItems((prev) => ({ ...prev, [wishlistItemId]: false }))
    }
  }

  // Function to add item to cart
  const handleAddToCart = async (productId, wishlistItemId) => {
    // If already in cart, navigate to cart page
    if (cartItems[productId]?.inCart) {
      navigate("/cart")
      return
    }

    try {
      setAddingToCart((prev) => ({ ...prev, [wishlistItemId]: true }))
      await dispatch(addToCart({ productId }))

      // Optimistically update UI
      setCartItems((prev) => ({
        ...prev,
        [productId]: {
          inCart: true,
          quantity: 1,
        },
      }))

      // Trigger animation
      setCartButtonAnimating((prev) => ({ ...prev, [wishlistItemId]: true }))
      setTimeout(() => {
        setCartButtonAnimating((prev) => ({ ...prev, [wishlistItemId]: false }))
      }, 500)

      // Refresh cart data
      await dispatch(getUserCart())
    } catch (error) {
      console.error("Error adding item to cart:", error)
      // Revert optimistic update if there was an error
      setCartItems((prev) => ({
        ...prev,
        [productId]: {
          inCart: false,
        },
      }))
    } finally {
      setAddingToCart((prev) => ({ ...prev, [wishlistItemId]: false }))
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
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: {
        duration: 0.3,
        ease: "easeIn",
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

  // Calculate discount percentage
  const calculateDiscount = (originalPrice, price) => {
    if (!originalPrice || !price || originalPrice <= price) return 0
    return Math.round(((originalPrice - price) / originalPrice) * 100)
  }

  // Loading state
  if (loading && !wishlist) {
    return (
      <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    )
  }

  // Get wishlist items from the Redux store and filter out locally removed items
  const wishlistItems = wishlist?.wishlistItems?.filter((item) => !removedItems[item._id]) || []

  return (
    <motion.div
      className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <motion.div className="mb-8 text-center sm:text-left" variants={itemVariants}>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center justify-center sm:justify-start gap-2">
            <Heart className="text-primary-600" size={28} />
            <span>My Wishlist</span>
          </h1>
          {wishlistItems.length > 0 && (
            <p className="text-gray-600 mt-2">
              You have {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} in your wishlist
            </p>
          )}
        </motion.div>

        {/* Wishlist Items */}
        {wishlistItems.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {wishlistItems.map((item) => (
                <motion.div
                  key={item._id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300"
                  variants={itemVariants}
                  layout
                  exit="exit"
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}
                >
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <motion.img
                      src={item.product.imageURL || "/placeholder.svg?height=300&width=300"}
                      alt={item.product.title}
                      className="w-full h-full object-contain p-4 cursor-pointer"
                      onClick={() => navigate(`/product/${item.product._id}`)}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Discount Badge */}
                    {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                      <div className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {calculateDiscount(item.product.originalPrice, item.product.price)}% OFF
                      </div>
                    )}

                    {/* Remove Button */}
                    <motion.button
                      className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-sm text-gray-500 hover:text-red-500 transition-colors group disabled:opacity-70"
                      onClick={() => handleRemoveFromWishlist(item._id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={removingItems[item._id]}
                    >
                      {removingItems[item._id] ? <Loader size={16} className="animate-spin" /> : <Trash2 size={16} />}

                      {/* Tooltip */}
                      <span className="absolute top-full right-0 mt-2 w-16 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none text-center">
                        Remove
                      </span>
                    </motion.button>
                  </div>

                  {/* Product Details */}
                  <div className="p-4">
                    <h3
                      className="text-lg font-medium text-gray-800 mb-1 line-clamp-1 cursor-pointer hover:text-primary-600 transition-colors"
                      onClick={() => navigate(`/product/${item.product._id}`)}
                    >
                      {item.product.title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-10">{item.product.description}</p>

                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-lg font-semibold text-gray-800">₹{item.product.price}</span>
                      {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                        <span className="text-sm text-gray-500 line-through">₹{item.product.originalPrice}</span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {cartItems[item.product._id]?.inCart ? (
                        // Already in cart button
                        <motion.button
                          className="flex-1 py-2 px-3 bg-green-500 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-1 relative"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => navigate("/cart")}
                          variants={cartButtonVariants}
                          animate={cartButtonAnimating[item._id] ? "added" : "initial"}
                        >
                          <Check size={16} />
                          <span>Go to Cart</span>

                          {/* Badge showing quantity if more than 1 */}
                          {cartItems[item.product._id]?.quantity > 1 && (
                            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                              {cartItems[item.product._id]?.quantity}
                            </span>
                          )}
                        </motion.button>
                      ) : (
                        // Add to cart button
                        <motion.button
                          className="flex-1 py-2 px-3 bg-primary-600 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-1 disabled:opacity-70"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAddToCart(item.product._id, item._id)}
                          disabled={addingToCart[item._id]}
                        >
                          {addingToCart[item._id] ? (
                            <Loader size={16} className="animate-spin mr-1" />
                          ) : (
                            <ShoppingCart size={16} />
                          )}
                          <span>Add to Cart</span>
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div className="flex flex-col items-center justify-center py-12" variants={itemVariants}>
            <motion.div
              className="relative w-64 h-64 mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <img src="/assets/Empty-wishlist.png" alt="Empty Wishlist" className="w-full h-full object-contain" />

              {/* Animated heart */}
              <motion.div
                className="absolute top-1/4 right-1/4"
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                <Heart className="text-primary-600 fill-primary-600" size={32} />
              </motion.div>
            </motion.div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-3 text-center">Your wishlist is empty</h2>
            <p className="text-gray-600 text-center max-w-md mb-6">
              Save your favorite items to your wishlist and come back to them anytime.
            </p>

            <motion.button
              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-md flex items-center gap-2"
              onClick={() => navigate("/items")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Explore Products</span>
              <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default Wishlist

