import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee"
import { ShoppingCart, Heart, Check, Loader } from "lucide-react"
import { addToCart, addToWishlist } from "../../State/Cart/Action.js"
import LoginPrompt from "../Auth/LoginPrompt.jsx"

const ProductCard = ({ productName, productImage, productPrice, productId }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const auth = useSelector((store) => store.auth)
  const { cart, wishlist } = useSelector((store) => store.cart)

  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [pendingAction, setPendingAction] = useState(null)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isInCart, setIsInCart] = useState(false)
  const [cartQuantity, setCartQuantity] = useState(0)
  const [addingToCart, setAddingToCart] = useState(false)
  const [addingToWishlist, setAddingToWishlist] = useState(false)

  // Check if product is in wishlist
  useEffect(() => {
    if (wishlist?.wishlistItems) {
      const found = wishlist.wishlistItems.some((item) => item.product && item.product._id === productId)
      setIsInWishlist(found)
    }
  }, [wishlist, productId])

  // Check if product is in cart
  useEffect(() => {
    if (cart?.cartItems) {
      const cartItem = cart.cartItems.find((item) => item.product && item.product._id === productId)
      if (cartItem) {
        setIsInCart(true)
        setCartQuantity(cartItem.quantity)
      } else {
        setIsInCart(false)
        setCartQuantity(0)
      }
    }
  }, [cart, productId])

  // Handle pending actions after login
  useEffect(() => {
    if (auth.user && pendingAction) {
      if (pendingAction.type === "cart") {
        handleAddToCart(null, true)
      } else if (pendingAction.type === "wishlist") {
        handleAddToWishlist(null, true)
      }
      setPendingAction(null)
    }
  }, [auth.user, pendingAction])

  // Handle add to cart
  const handleAddToCart = async (e, skipAuth = false) => {
    if (e) e.stopPropagation() // Prevent navigation when clicking the cart button

    if (!auth.user && !skipAuth) {
      // If user is not logged in, store the pending action and show login prompt
      localStorage.setItem("pendingAction", JSON.stringify({ type: "cart", productId }))
      setShowLoginPrompt(true)
      setPendingAction({ type: "cart", productId })
      return
    }

    // If already in cart, navigate to cart page
    if (isInCart) {
      navigate("/cart")
      return
    }

    try {
      setAddingToCart(true)
      await dispatch(addToCart({ productId }))

      // Optimistically update UI
      setIsInCart(true)
      setCartQuantity((prev) => prev + 1)
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setAddingToCart(false)
    }
  }

  // Handle add to wishlist
  const handleAddToWishlist = async (e, skipAuth = false) => {
    if (e) e.stopPropagation() // Prevent navigation when clicking the wishlist button

    if (!auth.user && !skipAuth) {
      // If user is not logged in, store the pending action and show login prompt
      localStorage.setItem("pendingAction", JSON.stringify({ type: "wishlist", productId }))
      setShowLoginPrompt(true)
      setPendingAction({ type: "wishlist", productId })
      return
    }

    try {
      setAddingToWishlist(true)

      // Optimistically update UI before API call
      setIsInWishlist((prev) => !prev)

      await dispatch(addToWishlist({ productId }))

      // No need to update state here as it was already updated optimistically
      // and will be confirmed by the API response
    } catch (error) {
      console.error("Error updating wishlist:", error)
      // Revert the optimistic update if there was an error
      setIsInWishlist((prev) => !prev)
    } finally {
      setAddingToWishlist(false)
    }
  }

  // Handle login confirmation
  const handleLoginConfirm = () => {
    setShowLoginPrompt(false)
    navigate("/signin")
  }

  return (
    <>
      <motion.div
        className="w-[300px] bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-300"
        whileHover={{
          y: -5,
          scale: 1.02,
          transition: { duration: 0.3 },
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => {
          navigate(`/product/${productId}`)
        }}
      >
        {/* Product Image with hover effect */}
        <div className="relative overflow-hidden bg-gray-50 h-[270px]">
          {/* Wishlist button */}
          <motion.button
            className={`absolute top-3 right-3 z-10 bg-white p-1.5 rounded-full shadow-sm hover:bg-gray-50 transition-colors ${
              isInWishlist ? "text-red-500" : "text-gray-500 hover:text-red-500"
            } disabled:opacity-70`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToWishlist}
            disabled={addingToWishlist}
          >
            {addingToWishlist ? (
              <Loader size={18} className="animate-spin" />
            ) : (
              <Heart size={18} className={isInWishlist ? "fill-red-500" : ""} />
            )}
          </motion.button>

          {/* Product image */}
          <motion.div
            className="w-full h-full flex items-center justify-center p-4"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={productImage || "/placeholder.svg?height=270&width=270"}
              alt={productName}
              className="object-contain w-full h-full"
            />
          </motion.div>
        </div>

        {/* Product details */}
        <div className="p-4">
          <h3 className="text-gray-800 font-medium text-lg mb-2 line-clamp-2 min-h-[3rem]">{productName}</h3>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center text-primary-600">
              <CurrencyRupeeIcon fontSize="small" />
              <span className="text-xl font-semibold">{productPrice}</span>
            </div>

            {isInCart ? (
              // Already in cart state - Always keeping it green
              <motion.button
                className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-md text-white relative"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation() // Prevent navigation
                  navigate("/cart")
                }}
                initial={{ scale: 1 }}
                animate={{ 
                  scale: [1, 1.2, 1],
                  transition: { duration: 0.5 }
                }}
              >
                <Check size={20} />

                {/* Badge showing quantity */}
                {cartQuantity > 1 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cartQuantity}
                  </span>
                )}
              </motion.button>
            ) : (
              // Not in cart state
              <motion.button
                className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center shadow-md text-white disabled:opacity-70"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "#4338CA",
                  boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                disabled={addingToCart}
              >
                {addingToCart ? <Loader size={18} className="animate-spin" /> : <ShoppingCart size={20} />}
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Login Prompt Modal */}
      {showLoginPrompt && <LoginPrompt onConfirm={handleLoginConfirm} onCancel={() => setShowLoginPrompt(false)} />}
    </>
  )
}

export default ProductCard