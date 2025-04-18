import { Link, useNavigate, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState, useRef } from "react"
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined"
import SearchIcon from "@mui/icons-material/Search"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import MenuIcon from "@mui/icons-material/Menu"
import CloseIcon from "@mui/icons-material/Close"
import { getUserProfile, logout } from "../../State/Auth/Action.js"
import { getUserCart } from "../../State/Cart/Action.js"
import { searchProducts } from "../../State/Product/Action.js"
import { AiTwotoneShop } from "react-icons/ai"
import { IoMdLogIn } from "react-icons/io"
import { motion, AnimatePresence } from "framer-motion"

const categories = [
  {
    name: "Books & Study Materials",
    subcategories: ["Fiction", "Non-fiction", "Fantasy", "Textbooks & Reference Books", "Notebooks & Stationery"],
  },
  {
    name: "Electronic",
    subcategories: [
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
  },
  {
    name: "Photography & Videography",
    subcategories: ["DSLR & Mirrorless Cameras", "Camera Accessories", "Lighting & Studio Equipment"],
  },
  {
    name: "Clothing & Accessories",
    subcategories: ["Formal Wear", "Casual Wear", "Shoes & Bags"],
  },
  {
    name: "Furniture & Home Essentials",
    subcategories: ["Desks & Chairs", "Beds & Mattresses", "Kitchen Appliances"],
  },
  {
    name: "Gaming & Accessories",
    subcategories: ["Gaming Consoles & Controllers", "VR Headsets & Simulators", "Gaming Chairs & Desks"],
  },
  {
    name: "Sports & Fitness",
    subcategories: [
      "Dumbbells & Resistance Bands",
      "Yoga Mats & Foam Rollers",
      "Footballs & Basketballs",
      "Cricket Bats & Kits",
      "Badminton & Tennis Rackets",
    ],
  },
  {
    name: "Toy",
    subcategories: ["Action Figures", "Board Games", "Puzzles"],
  },
  {
    name: "Miscellaneous",
    subcategories: ["Sports & Fitness Equipment", "Hobby & Musical Instruments"],
  },
]

export const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const jwt = localStorage.getItem("jwt")
  const auth = useSelector((store) => store.auth)
  const cart = useSelector((store) => store.cart)
  const product = useSelector((store) => store.product)

  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showCategories, setShowCategories] = useState(false)
  const [timeoutId, setTimeoutId] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [isSearchLoading, setIsSearchLoading] = useState(false)
  const [cartAnimation, setCartAnimation] = useState(false)

  const dropdownRef = useRef(null)
  const profileRef = useRef(null)
  const mobileMenuRef = useRef(null)
  const searchRef = useRef(null)

  // Get cart items count from Redux store
  const cartItemsCount = cart?.cart?.totalItems || 0

  // Fetch user profile and cart on component mount
  useEffect(() => {
    if (jwt) {
      dispatch(getUserProfile(jwt))
      dispatch(getUserCart())
    }
  }, [jwt, dispatch])

  // Redirect if user is logged in and on auth pages
  useEffect(() => {
    if (auth.user && (location.pathname === "/signin" || location.pathname === "/signup")) {
      navigate(-1)
    }
  }, [auth.user, location, navigate])

  // Listen for cart updates from localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const cartAdded = localStorage.getItem("cartItemAdded")
      if (cartAdded === "true") {
        setCartAnimation(true)
        setTimeout(() => {
          setCartAnimation(false)
          localStorage.removeItem("cartItemAdded")
        }, 1000)

        // Refresh cart data
        dispatch(getUserCart())
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Check on mount as well
    handleStorageChange()

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [dispatch])

  // Handle search input changes with debounce
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      setIsSearchLoading(true)
      const debounceTimer = setTimeout(() => {
        dispatch(searchProducts(searchQuery))
          .then((results) => {
            setSearchResults(results?.content || [])
            setShowSearchResults(true)
            setIsSearchLoading(false)
          })
          .catch(() => {
            setIsSearchLoading(false)
          })
      }, 300)

      return () => clearTimeout(debounceTimer)
    } else {
      setShowSearchResults(false)
      setSearchResults([])
    }
  }, [searchQuery, dispatch])

  const handleProfileClick = () => {
    setOpen((prevOpen) => {
      const newOpen = !prevOpen
      if (newOpen) {
        if (timeoutId) {
          clearTimeout(timeoutId)
          setTimeoutId(null)
        }
        const id = setTimeout(() => {
          setOpen(false)
          setTimeoutId(null)
        }, 2000)
        setTimeoutId(id)
      } else {
        if (timeoutId) {
          clearTimeout(timeoutId)
          setTimeoutId(null)
        }
      }
      return newOpen
    })
  }

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [timeoutId])

  const handleLogout = () => {
    dispatch(logout())
    setOpen(false)
    setMobileMenuOpen(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/items?search=${encodeURIComponent(searchQuery)}`)
    setShowSearchResults(false)
    setMobileSearchOpen(false)
  }

  const handleSearchItemClick = (productId) => {
    navigate(`/product/${productId}`)
    setShowSearchResults(false)
    setSearchQuery("")
  }

  const handleCategoryClick = (category) => {
    navigate(`/items?category=${encodeURIComponent(category)}`)
    setShowCategories(false)
  }

  const handleSubcategoryClick = (category, subcategory) => {
    navigate(`/items?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subcategory)}`)
    setShowCategories(false)
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCategories(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setOpen(false)
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest(".menu-button")
      ) {
        setMobileMenuOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Close mobile menu on navigation
  const handleMobileNavigation = (path) => {
    navigate(path)
    setMobileMenuOpen(false)
  }

  return (
    <div className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="bg-white">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 group">
              <img
                src="/assets/swapify-with-logo.png"
                alt="logo"
                className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Navigation Links - Desktop */}
            <ul className="hidden md:flex items-center space-x-8">
              <li className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center nav-link nav-link-hover py-2"
                  onMouseEnter={() => setShowCategories(true)}
                >
                  Categories
                  <KeyboardArrowDownIcon className="h-4 w-4 ml-0.5" />
                </button>

                {/* Mega Menu */}
                {showCategories && (
                  <div
                    className="absolute left-0 mt-1 w-[1000px] bg-white shadow-lg rounded-xl p-6 overflow-y-auto max-h-[450px] transition-all duration-300 ease-in-out border border-gray-100 animate-fadeIn"
                    onMouseLeave={() => setShowCategories(false)}
                  >
                    <div className="grid grid-cols-3 gap-8">
                      {categories.map((category) => (
                        <div key={category.name} className="space-y-3">
                          <button
                            onClick={() => handleCategoryClick(category.name)}
                            className="w-full text-left font-semibold text-gray-800 text-sm transition-all duration-300 hover:text-primary-600"
                          >
                            {category.name}
                          </button>
                          <div className="space-y-1 ml-2 border-l-2 border-gray-100 pl-3">
                            {category.subcategories.map((subcategory) => (
                              <button
                                key={subcategory}
                                onClick={() => handleSubcategoryClick(category.name, subcategory)}
                                className="dropdown-item"
                              >
                                {subcategory}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </li>

              <li>
                <Link to="/items" className="nav-link nav-link-hover py-2">
                  Collections
                </Link>
              </li>
            </ul>

            {/* Search Bar - Desktop */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center max-w-xl w-full mx-4 relative"
              ref={searchRef}
            >
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full bg-gray-50 border border-gray-200 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 transition-all duration-200 outline-none text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary-600 transition-colors duration-200"
                >
                  <SearchIcon className="h-5 w-5" />
                </button>

                {/* Search Results Dropdown */}
                {showSearchResults && searchQuery.trim().length > 1 && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 max-h-[400px] overflow-y-auto z-50">
                    {isSearchLoading ? (
                      <div className="p-4 text-center">
                        <div className="inline-block w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm text-gray-500 mt-2">Searching...</p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="py-2">
                        {searchResults.map((item) => (
                          <div
                            key={item._id}
                            className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                            onClick={() => handleSearchItemClick(item._id)}
                          >
                            <div className="w-10 h-10 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                              <img
                                src={item.imageURL || "/placeholder.svg?height=40&width=40"}
                                alt={item.title}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                              <p className="text-xs text-gray-500 truncate">{item.category?.name}</p>
                            </div>
                            <div className="text-sm font-semibold text-primary-600">₹{item.price}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">No products found matching "{searchQuery}"</div>
                    )}
                  </div>
                )}
              </div>
            </form>

            {/* Right Side Icons - Desktop */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Sell icon */}
              <Link to="/sell-product" className="nav-icon-button group">
                <div className="relative p-2 rounded-full bg-gray-50 group-hover:bg-primary-50 transition-colors duration-200">
                  <AiTwotoneShop className="h-5 w-5 text-gray-600 group-hover:text-primary-600 transition-colors duration-200" />
                </div>
                <span className="text-sm font-medium">Sell</span>
              </Link>

              {/* Wishlist */}
              <Link to="/wishlist" className="nav-icon-button group">
                <div className="relative p-2 rounded-full bg-gray-50 group-hover:bg-primary-50 transition-colors duration-200">
                  <FavoriteBorderIcon className="h-5 w-5 text-gray-600 group-hover:text-primary-600 transition-colors duration-200" />
                </div>
                <span className="text-sm font-medium">Wishlist</span>
              </Link>

              {/* Cart */}
              <button onClick={() => navigate("/cart")} className="nav-icon-button group relative">
                <div className="relative p-2 rounded-full bg-gray-50 group-hover:bg-primary-50 transition-colors duration-200">
                  <ShoppingCartOutlinedIcon className="h-5 w-5 text-gray-600 group-hover:text-primary-600 transition-colors duration-200" />

                  {/* Cart Count Badge */}
                  <AnimatePresence>
                    {cartItemsCount > 0 && (
                      <motion.span
                        className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-accent-500 text-white text-xs font-bold rounded-full"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        key={cartItemsCount}
                      >
                        {cartItemsCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <span className="text-sm font-medium">Cart</span>

                {/* Cart Animation */}
                <AnimatePresence>
                  {cartAnimation && (
                    <motion.div
                      className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [0, 1.2, 1],
                        opacity: [0, 1, 1],
                      }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <span className="text-xs">+1</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              {auth.user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={handleProfileClick}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md"
                  >
                    <span className="text-lg font-semibold">{auth.user?.firstName?.[0]?.toUpperCase()}</span>
                  </button>

                  {open && (
                    <div className="absolute right-0 mt-2 w-[7vw] bg-white rounded-xl shadow-lg py-1 z-50 border border-gray-100">
                      <button
                        className="w-full text-center px-4 py-2 text-sm text-gray-900 hover:bg-gray-200 transition-colors duration-300"
                        onClick={() => navigate("/profile")}
                      >
                        Profile
                      </button>
                      <hr className="my-1" />
                      {auth.user?.role === "admin" && (
                        <>
                          <button
                            className="w-full text-center px-4 py-2 text-sm text-gray-900 hover:bg-gray-200 transition-colors duration-300"
                            onClick={() => navigate("/admin")}
                          >
                            Admin
                          </button>
                          <hr className="my-1" />
                        </>
                      )}
                      <button
                        className="w-full text-center px-4 py-2 text-sm text-red-500 hover:bg-gray-200 transition-colors duration-300"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/signin"
                  className="group flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  <IoMdLogIn className="h-6 w-6" />
                  <span className="text-sm font-semibold">Login</span>
                </Link>
              )}
            </div>

            {/* Mobile Navigation */}
            <div className="flex items-center space-x-4 md:hidden">
              {/* Mobile Search Toggle */}
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <SearchIcon className="h-6 w-6 text-gray-700" />
              </button>

              {/* Mobile Cart */}
              <button
                onClick={() => navigate("/cart")}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 relative"
              >
                <ShoppingCartOutlinedIcon className="h-6 w-6 text-gray-700" />

                {/* Mobile Cart Count Badge */}
                <AnimatePresence>
                  {cartItemsCount > 0 && (
                    <motion.span
                      className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-accent-500 text-white text-xs font-bold rounded-full"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      key={cartItemsCount}
                    >
                      {cartItemsCount}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Mobile Cart Animation */}
                <AnimatePresence>
                  {cartAnimation && (
                    <motion.div
                      className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [0, 1.2, 1],
                        opacity: [0, 1, 1],
                      }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <span className="text-xs">+1</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="menu-button p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                {mobileMenuOpen ? (
                  <CloseIcon className="h-6 w-6 text-gray-700" />
                ) : (
                  <MenuIcon className="h-6 w-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {mobileSearchOpen && (
          <div
            className="md:hidden px-4 py-3 bg-white border-t border-gray-100 animate-fadeIn relative"
            ref={searchRef}
          >
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-full bg-gray-50 border border-gray-200 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 transition-all duration-200 outline-none text-sm"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary-600 transition-colors duration-200"
                >
                  <SearchIcon className="h-5 w-5" />
                </button>
              </div>
            </form>

            {/* Mobile Search Results */}
            {showSearchResults && searchQuery.trim().length > 1 && (
              <div className="absolute left-4 right-4 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 max-h-[400px] overflow-y-auto z-50">
                {isSearchLoading ? (
                  <div className="p-4 text-center">
                    <div className="inline-block w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-500 mt-2">Searching...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((item) => (
                      <div
                        key={item._id}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                        onClick={() => handleSearchItemClick(item._id)}
                      >
                        <div className="w-10 h-10 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                          <img
                            src={item.imageURL || "/placeholder.svg?height=40&width=40"}
                            alt={item.title}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                          <p className="text-xs text-gray-500 truncate">{item.category?.name}</p>
                        </div>
                        <div className="text-sm font-semibold text-primary-600">₹{item.price}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">No products found matching "{searchQuery}"</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="fixed inset-y-0 right-0 w-4/5 max-w-sm bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out animate-slideInRight"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <CloseIcon className="h-6 w-6 text-gray-700" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="py-2">
                  {/* User Profile Section */}
                  {auth.user ? (
                    <div className="px-4 py-3 mb-2 bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center text-white">
                          <span className="text-lg font-semibold">{auth.user?.firstName?.[0]?.toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {auth.user?.firstName} {auth.user?.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{auth.user?.email}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <button
                          onClick={() => handleMobileNavigation("/profile")}
                          className="flex-1 py-2 px-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                          Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          className="flex-1 py-2 px-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-red-500 hover:bg-gray-50 transition-colors duration-200"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-3 mb-2 bg-gray-50 flex flex-col space-y-2">
                      <Link
                        to="/signin"
                        className="w-full py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors duration-200 text-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200 text-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Register
                      </Link>
                    </div>
                  )}

                  {/* Navigation Links */}
                  <div className="mt-2">
                    <Link to="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                      Home
                    </Link>
                    <Link to="/items" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                      Collections
                    </Link>
                    <Link to="/sell-product" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                      Sell Product
                    </Link>
                    <Link to="/wishlist" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                      Wishlist
                    </Link>
                    <Link to="/cart" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                      Cart
                    </Link>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 text-center">© 2025 Swapify. All rights reserved.</p>
              </div>
            </div>
          </div>
        )}

        {/* Overlay for mobile menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setMobileMenuOpen(false)}></div>
        )}
      </nav>
    </div>
  )
}

export default Navbar;