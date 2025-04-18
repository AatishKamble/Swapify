import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { findProductById } from "../../State/Product/Action.js"
import { addToCart, addToWishlist, getUserCart, getUserWishlist } from "../../State/Cart/Action.js"
import { getProductReviews } from "../../State/Review/Action.js"
import {
  Heart,
  ShoppingCart,
  Zap,
  Star,
  Tag,
  Truck,
  Shield,
  ChevronDown,
  ChevronUp,
  Check,
  Loader,
  MessageSquare,
} from "lucide-react"
import LoginPrompt from "../Auth/LoginPrompt.jsx"
import ReviewForm from "../Reviews/ReviewForm.jsx"
import ReviewsList from "../Reviews/ReviewsList.jsx"

const ProductDetails = () => {
  const params = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const product = useSelector((store) => store.product)
  const auth = useSelector((store) => store.auth)
  const { cart, wishlist } = useSelector((store) => store.cart)
  const { productReviews } = useSelector((store) => store.review || {})

  // States
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isInCart, setIsInCart] = useState(false)
  const [cartQuantity, setCartQuantity] = useState(0)
  const [addingToCart, setAddingToCart] = useState(false)
  const [addingToWishlist, setAddingToWishlist] = useState(false)
  const [cartButtonAnimating, setCartButtonAnimating] = useState(false)
  const [wishlistButtonAnimating, setWishlistButtonAnimating] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [pendingAction, setPendingAction] = useState(null)

  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(null)
  const [selectedOption, setSelectedOption] = useState("direct")
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [activeTab, setActiveTab] = useState("description")
  const [imageLoaded, setImageLoaded] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [hasUserReviewed, setHasUserReviewed] = useState(false)

  // Fetch product data
  useEffect(() => {
    const data = {
      productId: params.productId,
    }
    dispatch(findProductById(data))

    // Fetch product reviews
    dispatch(getProductReviews(params.productId))
  }, [params.productId, dispatch])

  // Fetch cart and wishlist if user is logged in
  useEffect(() => {
    if (auth.user) {
      dispatch(getUserCart())
      dispatch(getUserWishlist())
    }
  }, [auth.user, dispatch])

  // Check if user has already reviewed this product
  useEffect(() => {
    if (auth.user && productReviews && productReviews.length > 0) {
      const userReview = productReviews.find((review) => review.user && review.user._id === auth.user._id)
      setHasUserReviewed(!!userReview)
    } else {
      setHasUserReviewed(false)
    }
  }, [auth.user, productReviews])

  // Check if product is in wishlist
  useEffect(() => {
    if (wishlist?.wishlistItems && product.product) {
      const found = wishlist.wishlistItems.some((item) => item.product && item.product._id === product.product._id)
      setIsInWishlist(found)
    }
  }, [wishlist, product.product])

  // Check if product is in cart
  useEffect(() => {
    if (cart?.cartItems && product.product) {
      const cartItem = cart.cartItems.find((item) => item.product && item.product._id === product.product._id)
      if (cartItem) {
        setIsInCart(true)
        setCartQuantity(cartItem.quantity)
      } else {
        setIsInCart(false)
        setCartQuantity(0)
      }
    }
  }, [cart, product.product])

  // Handle pending actions after login
  useEffect(() => {
    if (auth.user && pendingAction && product.product) {
      if (pendingAction.type === "cart") {
        handleAddToCart(null, true)
      } else if (pendingAction.type === "wishlist") {
        handleWishlistToggle(null, true)
      }
      setPendingAction(null)
    }
  }, [auth.user, pendingAction, product.product])

  // Handle Add to Cart
  const handleAddToCart = async (e, skipAuth = false) => {
    if (e) e.preventDefault()

    if (!auth.user && !skipAuth) {
      // If user is not logged in, store the pending action and show login prompt
      localStorage.setItem("pendingAction", JSON.stringify({ type: "cart", productId: params.productId }))
      setShowLoginPrompt(true)
      setPendingAction({ type: "cart", productId: params.productId })
      return
    }

    // If already in cart, navigate to cart page
    if (isInCart) {
      navigate("/cart")
      return
    }

    try {
      setAddingToCart(true)
      const data = {
        productId: params.productId,
      }
      await dispatch(addToCart(data))
      await dispatch(getUserCart())

      // Optimistically update UI
      setIsInCart(true)
      setCartQuantity((prev) => prev + 1)

      // Trigger animation
      setCartButtonAnimating(true)
      setTimeout(() => {
        setCartButtonAnimating(false)
      }, 500)
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setAddingToCart(false)
    }
  }

  // Handle Buy Now
  const handleBuyNow = (e) => {
    e.preventDefault()

    if (!auth.user) {
      // If user is not logged in, store the pending action and show login prompt
      localStorage.setItem("pendingAction", JSON.stringify({ type: "cart", productId: params.productId }))
      setShowLoginPrompt(true)
      setPendingAction({ type: "cart", productId: params.productId })
      return
    }

    // Add to cart and navigate to checkout
    const data = {
      productId: params.productId,
    }

    const simplifiedProduct = {
      _id: product.product?._id,
      productName: product.product?.title,
      productDescription: product.product?.description,
      price: product.product?.price,
      expectedPrice: product.product?.price,
      images: product.product?.imageURL ? [{ imageUrl: product.product.imageURL }] : [],
    }

    // dispatch(addToCart(data))
    localStorage.setItem("direct", true)
    localStorage.setItem("buyingProd", JSON.stringify(simplifiedProduct))
    navigate("/checkout")
  }

  // Handle Wishlist Toggle
  const handleWishlistToggle = async (e, skipAuth = false) => {
    if (e) e.preventDefault()

    if (!auth.user && !skipAuth) {
      // If user is not logged in, store the pending action and show login prompt
      localStorage.setItem("pendingAction", JSON.stringify({ type: "wishlist", productId: params.productId }))
      setShowLoginPrompt(true)
      setPendingAction({ type: "wishlist", productId: params.productId })
      return
    }

    try {
      setAddingToWishlist(true)

      // Optimistically update UI
      setIsInWishlist((prev) => !prev)

      // Trigger animation
      setWishlistButtonAnimating(true)
      setTimeout(() => {
        setWishlistButtonAnimating(false)
      }, 500)

      const data = {
        productId: params.productId,
      }
      await dispatch(addToWishlist(data))
      await dispatch(getUserWishlist())
    } catch (error) {
      console.error("Error updating wishlist:", error)
      // Revert optimistic update if there was an error
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

  // Calculate discount percentage
  const calculateDiscount = () => {
    if (!product.product?.originalPrice || !product.product?.price) return 0
    return Math.round(((product.product.originalPrice - product.product.price) / product.product.originalPrice) * 100)
  }

  // Calculate price with delivery fee
  const calculatePriceWithDelivery = () => {
    if (!product.product?.price) return 0
    return Math.round(product.product.price + (product.product.price * 20) / 100)
  }

  // Handle review form toggle
  const handleReviewFormToggle = () => {
    if (!auth.user) {
      setShowLoginPrompt(true)
      setPendingAction({ type: "review", productId: params.productId })
      return
    }
    if(!showReviewForm){
      window.scrollTo(650, 650)
    }
    setShowReviewForm(!showReviewForm)
  }

  // Handle review submission success
  const handleReviewSuccess = () => {
    setShowReviewForm(false)
    // Refresh reviews
    dispatch(getProductReviews(params.productId))
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

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
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

  // Wishlist button animation variants
  const wishlistButtonVariants = {
    initial: { scale: 1 },
    added: {
      scale: [1, 1.2, 1],
      transition: { duration: 0.5 },
    },
  }

  // Mock data for additional sections
  const specifications = [
    { label: "Brand", value: "Swapify" },
    { label: "Model", value: product.product?.title?.split(" ")[0] || "Standard" },
    { label: "Warranty", value: "1 Year Manufacturer Warranty" },
    { label: "In Box", value: "Product, Manual, Warranty Card" },
  ]

  const highlights = [
    "Premium quality product",
    "Durable and long-lasting",
    "Easy to use and maintain",
    "Perfect for everyday use",
  ]

  const bankOffers = [
    "10% off on HDFC Bank Credit Cards, up to ₹1,500 on orders of ₹5,000 and above",
    "5% Unlimited Cashback on Flipkart Axis Bank Credit Card",
    "No Cost EMI on Bajaj Finserv EMI Card on cart value above ₹2,999",
  ]

  // Calculate average rating
  const averageRating =
    productReviews && productReviews.length > 0
      ? (productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length).toFixed(1)
      : 0

  return (
    <motion.div
      className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Product Image & Buttons */}
          <motion.div className="lg:w-2/5 lg:sticky lg:top-24 lg:self-start" variants={itemVariants}>
            {/* Product Image Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden relative">
              {/* Wishlist Button */}
              <motion.button
                className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                  isInWishlist ? "bg-red-50" : "bg-white"
                } disabled:opacity-70`}
                onClick={handleWishlistToggle}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                variants={wishlistButtonVariants}
                animate={wishlistButtonAnimating ? "added" : "initial"}
                disabled={addingToWishlist}
              >
                {addingToWishlist ? (
                  <Loader size={22} className="animate-spin text-gray-400" />
                ) : (
                  <AnimatePresence mode="wait">
                    {isInWishlist ? (
                      <motion.div
                        key="filled"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Heart size={22} fill="#f43f5e" stroke="#f43f5e" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="outline"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Heart size={22} className="text-gray-400" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </motion.button>

              {/* Product Image with Loading State */}
              <div className="relative aspect-square bg-gray-100 flex items-center justify-center">
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                  </div>
                )}
                <motion.img
                  src={product.product?.imageURL || "/placeholder.svg?height=500&width=500"}
                  alt={product.product?.title || "Product Image"}
                  className={`object-contain w-full h-full p-6 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: imageLoaded ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                  onLoad={() => setImageLoaded(true)}
                  whileHover={{ scale: 1.05 }}
                />
              </div>

              {/* Action Buttons */}
              <div className="p-4 grid grid-cols-2 gap-4">
                {isInCart ? (
                  // Already in cart button
                  <motion.button
                    className="relative overflow-hidden bg-green-500 text-white font-medium rounded-xl py-3 px-4 flex items-center justify-center gap-2 group shadow-md"
                    onClick={() => navigate("/cart")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    variants={cartButtonVariants}
                    animate={cartButtonAnimating ? "added" : "initial"}
                  >
                    <Check size={20} className="relative z-10" />
                    <span className="relative z-10">Go to Cart</span>
                  </motion.button>
                ) : (
                  // Add to cart button
                  <motion.button
                    className="relative overflow-hidden bg-white border-2 border-primary-600 text-primary-600 font-medium rounded-xl py-3 px-4 flex items-center justify-center gap-2 group disabled:opacity-70"
                    onClick={handleAddToCart}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={addingToCart}
                  >
                    {/* Animated background fill on hover */}
                    <span className="absolute inset-0 w-full h-full bg-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out"></span>

                    {addingToCart ? (
                      <Loader
                        size={20}
                        className="animate-spin relative z-10 group-hover:text-white transition-colors duration-300"
                      />
                    ) : (
                      <ShoppingCart
                        size={20}
                        className="relative z-10 group-hover:text-white transition-colors duration-300"
                      />
                    )}
                    <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                      Add to Cart
                    </span>
                  </motion.button>
                )}

                <motion.button
                  className="relative overflow-hidden bg-primary-600 text-white font-medium rounded-xl py-3 px-4 flex items-center justify-center gap-2 group shadow-md"
                  onClick={handleBuyNow}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Animated background pulse on hover */}
                  <span className="absolute inset-0 w-full h-full bg-primary-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out"></span>

                  <Zap size={20} className="relative z-10" />
                  <span className="relative z-10">Buy Now</span>
                </motion.button>
              </div>
            </div>

            {/* Delivery Options Card - Mobile Only */}
            <motion.div className="mt-6 bg-white rounded-xl shadow-sm p-4 lg:hidden" variants={itemVariants}>
              <h3 className="font-medium text-gray-800 mb-3">Delivery Options</h3>
              <div className="flex items-center mb-2">
                <Truck size={18} className="text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">Free delivery available</span>
              </div>
              <div className="flex items-center">
                <Shield size={18} className="text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">7-day return policy</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Product Details */}
          <motion.div className="lg:w-3/5" variants={itemVariants}>
            {/* Product Title & Rating */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <motion.h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4" variants={fadeInVariants}>
                {product.product?.title || "Product Title"}
              </motion.h1>

              {/* Rating Display */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center bg-green-50 px-2 py-1 rounded-lg">
                  <span className="font-medium text-green-700 mr-1">{averageRating}</span>
                  <Star size={16} className="text-green-700 fill-green-700" />
                </div>
                <span className="text-sm text-gray-500">
                  {productReviews?.length || 0} {productReviews?.length === 1 ? "review" : "reviews"}
                </span>
                {!hasUserReviewed && auth.user && (
                  <button
                    onClick={handleReviewFormToggle}
                    className="text-sm text-primary-600 font-medium hover:underline"
                  >
                    Write a review
                  </button>
                )}
              </div>

              {/* Price Section */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-gray-800">₹{product.product?.price || 0}</span>
                  {product.product?.originalPrice && (
                    <>
                      <span className="text-lg text-gray-500 line-through">₹{product.product.originalPrice}</span>
                      <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                        {calculateDiscount()}% off
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-500">Inclusive of all taxes</p>
              </div>

              {/* Bank Offers */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-3">Available Offers</h3>
                <div className="space-y-2">
                  {bankOffers.map((offer, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Tag size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600">{offer}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Purchase Options */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-3">Purchase Options</h3>
                <div className="space-y-3">
                  <motion.div
                    className={`border rounded-xl p-3 cursor-pointer transition-all ${
                      selectedOption === "direct" ? "border-primary-600 bg-primary-50" : "border-gray-200"
                    }`}
                    onClick={() => setSelectedOption("direct")}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          selectedOption === "direct" ? "border-primary-600" : "border-gray-300"
                        }`}
                      >
                        {selectedOption === "direct" && (
                          <motion.div
                            className="w-3 h-3 rounded-full bg-primary-600"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="font-medium text-gray-800">Buy Direct From Seller</p>
                        <p className="text-sm text-gray-500">Standard delivery, no additional fees</p>
                      </div>
                      <div className="text-lg font-bold text-gray-800">₹{product.product?.price || 0}</div>
                    </div>
                  </motion.div>

                  <motion.div
                    className={`border rounded-xl p-3 cursor-pointer transition-all ${
                      selectedOption === "doorstep" ? "border-primary-600 bg-primary-50" : "border-gray-200"
                    }`}
                    onClick={() => setSelectedOption("doorstep")}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          selectedOption === "doorstep" ? "border-primary-600" : "border-gray-300"
                        }`}
                      >
                        {selectedOption === "doorstep" && (
                          <motion.div
                            className="w-3 h-3 rounded-full bg-primary-600"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="font-medium text-gray-800">Buy On The Doorstep</p>
                        <p className="text-sm text-gray-500">Premium delivery with additional services</p>
                      </div>
                      <div className="text-lg font-bold text-gray-800">₹{calculatePriceWithDelivery()}</div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Delivery Options - Desktop Only */}
              <motion.div className="hidden lg:block mb-6" variants={itemVariants}>
                <h3 className="font-medium text-gray-800 mb-3">Delivery & Returns</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Truck size={18} className="text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Free delivery available</span>
                  </div>
                  <div className="flex items-center">
                    <Shield size={18} className="text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">7-day return policy</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Review Form - Only show if user clicked "Write a review" and hasn't reviewed yet */}
            <AnimatePresence>
              {showReviewForm && !hasUserReviewed && (
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ReviewForm productId={params.productId} onSuccess={handleReviewSuccess} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tabbed Content */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              {/* Tab Headers */}
              <div className="flex border-b overflow-x-auto">
                <button
                  className={`flex-1 py-3 px-4 text-center font-medium transition-colors whitespace-nowrap ${
                    activeTab === "description"
                      ? "text-primary-600 border-b-2 border-primary-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => setActiveTab("description")}
                >
                  Description
                </button>
                <button
                  className={`flex-1 py-3 px-4 text-center font-medium transition-colors whitespace-nowrap ${
                    activeTab === "specifications"
                      ? "text-primary-600 border-b-2 border-primary-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => setActiveTab("specifications")}
                >
                  Specifications
                </button>
                <button
                  className={`flex-1 py-3 px-4 text-center font-medium transition-colors whitespace-nowrap ${
                    activeTab === "highlights"
                      ? "text-primary-600 border-b-2 border-primary-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => setActiveTab("highlights")}
                >
                  Highlights
                </button>
                <button
                  className={`flex-1 py-3 px-4 text-center font-medium transition-colors whitespace-nowrap ${
                    activeTab === "reviews"
                      ? "text-primary-600 border-b-2 border-primary-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => setActiveTab("reviews")}
                >
                  Reviews ({productReviews?.length || 0})
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {activeTab === "description" && (
                    <motion.div
                      key="description"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="relative">
                        <p className={`text-gray-700 leading-relaxed ${!showFullDescription && "line-clamp-4"}`}>
                          {product.product?.description ||
                            "This product description is not available. Please check back later for more information about this product."}
                        </p>

                        {product.product?.description && product.product.description.length > 200 && (
                          <motion.button
                            className="mt-2 text-primary-600 font-medium flex items-center"
                            onClick={() => setShowFullDescription(!showFullDescription)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {showFullDescription ? (
                              <>
                                Show Less <ChevronUp size={16} className="ml-1" />
                              </>
                            ) : (
                              <>
                                Read More <ChevronDown size={16} className="ml-1" />
                              </>
                            )}
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "specifications" && (
                    <motion.div
                      key="specifications"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {specifications.map((spec, index) => (
                          <div key={index} className="flex">
                            <span className="text-gray-500 w-1/3">{spec.label}:</span>
                            <span className="text-gray-800 font-medium w-2/3">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "highlights" && (
                    <motion.div
                      key="highlights"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ul className="space-y-2">
                        {highlights.map((highlight, index) => (
                          <motion.li
                            key={index}
                            className="flex items-start gap-2"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Check size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{highlight}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {activeTab === "reviews" && (
                    <motion.div
                      key="reviews"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Reviews List Component */}
                      <ReviewsList productId={params.productId} />

                      {/* Add Review Button - Only show if user hasn't reviewed yet */}
                      {!hasUserReviewed && auth.user && !showReviewForm && (
                        <div className="mt-6 text-center">
                          <motion.button
                            onClick={handleReviewFormToggle}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <MessageSquare size={18} />
                            <span>Write a Review</span>
                          </motion.button>
                        </div>
                      )}

                      {/* Login to Review Message - Only show if user is not logged in */}
                      {!auth.user && (
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg text-center">
                          <p className="text-blue-700 mb-2 font-medium">Sign in to write a review</p>
                          <button
                            onClick={() => navigate("/signin")}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Sign In
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Login Prompt Modal */}
      {showLoginPrompt && <LoginPrompt onConfirm={handleLoginConfirm} onCancel={() => setShowLoginPrompt(false)} />}
    </motion.div>
  )
}

export default ProductDetails;