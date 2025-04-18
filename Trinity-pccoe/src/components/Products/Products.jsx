import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { findProducts } from "../../State/Product/Action.js"
import FilterBy from "./FilterBy.jsx"
import FilteredProducts from "./FilteredProducts.jsx"
import { Filter, Check, ChevronDown, X, SlidersHorizontal } from "lucide-react"

const Products = () => {
  // Filter data
  const uniqueCategories = [
    "Electronic",
    "Books & Study Materials",
    "Photography & Videography",
    "Clothing & Accessories",
    "Furniture & Home Essentials",
    "Gaming & Accessories",
    "Sports & Fitness",
    "Toy's",
    "Miscellaneous",
  ]

  const uniqueAddresses = ["Maharashtra", "Gujrat", "Delhi", "Karnatka", "Rajshthan", "Tamilnadu", "Jammu Kashmir"]

  const sortByOptions = ["Date-Created", "Price: Low to High", "Price: High to Low"]

  const priceRange = ["0-1000", "1000-2000", "2000-3000", "3000-6000", "6000-10000", ">10000"]

  // State
  const [dropDown, setDropDown] = useState(false)
  const [selectedOption, setSelectedOption] = useState("")
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // Hooks
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Get URL parameters
  const searchParams = new URLSearchParams(location.search)
  const categoryValue = searchParams.getAll("Categories").map(decodeURIComponent)
  const subCategoryValue = searchParams.getAll("subcategory" || "Subcategory" || "Sub-category").map(decodeURIComponent)
  const priceValue = searchParams.get("Price") || null
  const sortValue = searchParams.get("sort")
  const pageNumber = searchParams.get("page") || 1

  // Fetch products when filters change
  useEffect(() => {
    let minPrice, maxPrice

    if (priceValue !== null) {
      [minPrice, maxPrice] = priceValue.split("-").map(Number)
    } else {
      minPrice = 0
      maxPrice = 1000000
    }

    const data = {
      category: categoryValue,
      subCategory: subCategoryValue,
      minPrice,
      maxPrice,
      sort: sortValue,
      pageNumber: pageNumber,
      pageSize: 10,
    }

    dispatch(findProducts(data))
  }, [priceValue, sortValue, pageNumber, categoryValue, dispatch])

  // Toggle sort dropdown
  function handleDropDown() {
    setDropDown(!dropDown)
  }

  // Update URL with sort option
  function updatedUrl(value) {
    if (value) {
      searchParams.delete("sort")
      searchParams.set("sort", value)
      searchParams.set("page", pageNumber)
    }

    navigate({ search: `?${searchParams.toString()}` })
  }

  // Handle sort option change
  function handleOptionChange(event) {
    const value = event.currentTarget.getAttribute("data-value")

    let newOption
    if (value === "Price: Low to High") {
      newOption = "asc-price"
    } else if (value === "Price: High to Low") {
      newOption = "desc-price"
    } else {
      newOption = value
    }

    setSelectedOption(value)
    updatedUrl(newOption)
    setDropDown(false)
  }

  // Set selected option from URL on mount
  useEffect(() => {
    const selected = searchParams.get("sort")

    let newOption
    if (selected === "asc-price") {
      newOption = "Price: Low to High"
    } else if (selected === "desc-price") {
      newOption = "Price: High to Low"
    } else {
      newOption = selected
    }

    setSelectedOption(newOption)
  }, [location.search])

  // Set default sort on initial load
  useEffect(() => {
    if (location.pathname === "/items" && !sortValue) {
      updatedUrl("Date-Created")
    }
  }, [location.pathname])

  // Count active filters
  const activeFilterCount = categoryValue.length + (priceValue ? 1 : 0)

  // Add a function to clear all filters
  function clearAllFilters() {
    // Keep only the sort parameter
    const sortParam = searchParams.get("sort")
    searchParams.forEach((value, key) => {
      if (key !== "sort" && key !== "page") {
        searchParams.delete(key)
      }
    })

    if (sortParam) {
      searchParams.set("sort", sortParam)
    }

    searchParams.set("page", "1")
    navigate({ search: `?${searchParams.toString()}` })
    setMobileFilterOpen(false)
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-6 pb-12">
      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile filter button */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Products</h1>
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Filter size={18} />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-primary-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Desktop sidebar */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-semibold text-gray-800">Filters</h2>
                <div className="flex items-center gap-2">
                  {activeFilterCount > 0 && (
                    <span className="bg-primary-50 text-primary-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      {activeFilterCount} active
                    </span>
                  )}
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-xs text-primary-600 hover:text-primary-800 flex items-center gap-1 px-2 py-1 rounded-xl hover:bg-primary-50 transition-colors"
                    >
                      <X size={12} />
                      Clear all
                    </button>
                  )}
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                <FilterBy FilterByType="Categories" dataArray={uniqueCategories} More={true} />
                <FilterBy FilterByType="Location" dataArray={uniqueAddresses} More={true} />
                <FilterBy FilterByType="Price" dataArray={priceRange} More={false} />
              </div>
            </div>
          </div>

          {/* Mobile filter sidebar */}
          <AnimatePresence>
            {mobileFilterOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                  onClick={() => setMobileFilterOpen(false)}
                />

                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "tween", duration: 0.3 }}
                  className="fixed top-16 bottom-0 right-0 w-full max-w-xs bg-white shadow-xl z-50 lg:hidden overflow-y-auto"
                >
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="font-semibold text-gray-800">Filters</h2>
                    <button
                      onClick={() => setMobileFilterOpen(false)}
                      className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="divide-y divide-gray-200">
                    <FilterBy FilterByType="Categories" dataArray={uniqueCategories} More={true} />
                    <FilterBy FilterByType="Location" dataArray={uniqueAddresses} More={true} />
                    <FilterBy FilterByType="Price" dataArray={priceRange} More={false} />
                  </div>

                  <div className="p-4 border-t border-gray-200 flex flex-col gap-3">
                    {activeFilterCount > 0 && (
                      <button
                        onClick={clearAllFilters}
                        className="w-full py-2 border border-gray-200 text-primary-600 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <X size={16} />
                        Clear all filters
                      </button>
                    )}
                    <button
                      onClick={() => setMobileFilterOpen(false)}
                      className="w-full py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
                    >
                      Apply Filters
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main content */}
          <div className="flex-1">
            {/* Sort dropdown */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-800 hidden lg:block">Products</h1>

              <div className="relative ml-auto">
                <button
                  onClick={handleDropDown}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <SlidersHorizontal size={16} />
                  <span className="text-sm font-medium">{selectedOption ? `Sort: ${selectedOption}` : "Sort By"}</span>
                  <ChevronDown size={16} className={`transition-transform ${dropDown ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {dropDown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-30 overflow-hidden"
                    >
                      {sortByOptions.map((option, index) => (
                        <div
                          key={index}
                          data-value={option}
                          onClick={handleOptionChange}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors rounded-xl mx-1 my-0.5"
                        >
                          <div className="w-5 h-5 flex-shrink-0">
                            {selectedOption === option && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-primary-600">
                                <Check size={20} />
                              </motion.div>
                            )}
                          </div>
                          <span className="text-sm text-gray-700">{option}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Products grid */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <FilteredProducts />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Products;