import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLocation, useNavigate } from "react-router-dom"
import { Search, X, ChevronDown, ChevronRight, Check } from "lucide-react"

const FilterBy = ({ FilterByType, dataArray, More }) => {
  const [visible, setVisible] = useState(false)
  const [showInput, setShowInput] = useState(false)
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [selected, setSelected] = useState([])
  const [toShowElement, setToShowElement] = useState(dataArray.slice(0, 5))

  const location = useLocation()
  const history = useNavigate()
  const searchParams = new URLSearchParams(location.search)

  // Toggle filter section visibility
  function handleVisibility() {
    setVisible(!visible)
  }

  // Toggle search input
  function handleInputShow() {
    setShowInput(!showInput)
    setSearch("")
  }

  // Handle search input change
  function handleSearch(event) {
    const searchValue = event.target.value
    setSearch(searchValue)
    const searchResult = dataArray.filter((item) => item.toLowerCase().includes(searchValue.toLowerCase()))
    setSearchResult(searchResult)
  }

  // Update URL parameters based on selected filters
  function updateUrlParams(selectedValues) {
    if (selectedValues.length > 0) {
      searchParams.delete(FilterByType)
      selectedValues.forEach((value) => {
        searchParams.append(FilterByType, value)
      })
    } else {
      // If no items are selected, remove the parameter completely
      searchParams.delete(FilterByType)
    }
    history({ search: `?${searchParams.toString()}` })
  }

  // Initialize selected values from URL on component mount
  useEffect(() => {
    const selectedValues = searchParams.getAll(FilterByType)
    setSelected(selectedValues)
    setVisible(true)
  }, [location.search, FilterByType])

  // Handle checkbox change
  function handleInputChange(event) {
    const value = event.target.value
    setSelected((prevSelected) => {
      if (prevSelected.includes(value)) {
        const updateSelected = prevSelected.filter((item) => item !== value)
        updateUrlParams(updateSelected)
        return updateSelected
      } else {
        const updatedSelected = [...prevSelected, value]
        updateUrlParams(updatedSelected)
        return updatedSelected
      }
    })
  }

  // Update visible elements when selection changes
  useEffect(() => {
    const combinedItems = [...selected, ...dataArray.filter((item) => !selected.includes(item))]
    setToShowElement(combinedItems.slice(0, 10))
  }, [selected, dataArray])

  // Animation variants
  const containerVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: "auto",
      opacity: 1,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.3, delay: 0.1 },
      },
    },
  }

  // Add a function to clear filters for this filter type
  function clearFilters() {
    setSelected([])
    searchParams.delete(FilterByType)
    history({ search: `?${searchParams.toString()}` })
  }

  return (
    <div className="border-b border-gray-200 py-2">
      <div className="px-4 py-2">
        {showInput ? (
          <motion.div
            className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${FilterByType.toLowerCase()}...`}
              value={search}
              onChange={handleSearch}
              className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 text-sm"
              autoFocus
            />
            <button onClick={handleInputShow} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={18} />
            </button>
          </motion.div>
        ) : (
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-800 text-[15px]">{FilterByType}</h3>
            <div className="flex items-center gap-2">
              {More && (
                <button
                  onClick={handleInputShow}
                  className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
                >
                  <Search size={18} />
                </button>
              )}
              <button onClick={handleVisibility} className="p-1 text-gray-500 hover:text-primary-600 transition-colors">
                {visible ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {visible && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="px-4 pb-2 overflow-hidden"
          >
            <div className="bg-white rounded-lg">
              {(search ? searchResult : toShowElement).map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-between py-2 px-1 hover:bg-gray-50 rounded-md transition-colors"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.03 },
                  }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        id={`${FilterByType}-${item}`}
                        name={item}
                        value={item}
                        checked={selected.includes(item)}
                        onChange={handleInputChange}
                        className="w-4 h-4 opacity-0 absolute cursor-pointer"
                      />
                      <div
                        className={`w-4 h-4 border ${selected.includes(item) ? "border-primary-600 bg-primary-50" : "border-gray-300 bg-white"} rounded-sm flex items-center justify-center`}
                      >
                        {selected.includes(item) && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <Check size={14} className="text-primary-600" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                    <label htmlFor={`${FilterByType}-${item}`} className="text-sm text-gray-700 cursor-pointer">
                      {item}
                    </label>
                  </div>
                  {selected.includes(item) && (
                    <span className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full ml-2">
                      Selected
                    </span>
                  )}
                </motion.div>
              ))}

              {search && searchResult.length === 0 && (
                <motion.p
                  className="text-sm text-gray-500 py-2 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  No {FilterByType.toLowerCase()} found matching "{search}"
                </motion.p>
              )}
            </div>
            {visible && selected.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-xs text-primary-600 hover:text-primary-800 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-primary-50 transition-colors"
                >
                  <X size={12} />
                  Clear {FilterByType}
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FilterBy

