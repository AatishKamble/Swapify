import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { getAddresses, deleteAddress, setDefaultAddress } from "../../State/Address/Action.js"
import { MapPin, Home, Briefcase, Plus, Edit2, Trash2, CheckCircle, AlertCircle } from "lucide-react"

const AddressList = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { addresses, loading, error } = useSelector((state) => state.address)

  console.log("AddressList component:", { addresses, loading, error })

  const [successMessage, setSuccessMessage] = useState("")
  const [deletingId, setDeletingId] = useState(null)
  const [settingDefaultId, setSettingDefaultId] = useState(null)

  // Fetch addresses on component mount
  useEffect(() => {
    dispatch(getAddresses())
  }, [dispatch])

  // Handle delete address
  const handleDeleteAddress = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      setDeletingId(addressId)
      try {
        await dispatch(deleteAddress(addressId))
        setSuccessMessage("Address deleted successfully")

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage("")
        }, 3000)
      } catch (error) {
        console.error("Error deleting address:", error)
      } finally {
        setDeletingId(null)
      }
    }
  }

  // Handle set as default
  const handleSetDefault = async (addressId) => {
    setSettingDefaultId(addressId)
    try {
      await dispatch(setDefaultAddress(addressId))
      setSuccessMessage("Default address updated successfully")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    } catch (error) {
      console.error("Error setting default address:", error)
    } finally {
      setSettingDefaultId(null)
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
      transition: { duration: 0.4, ease: "easeOut" },
    },
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">My Addresses</h1>
            <p className="text-gray-600">Manage your delivery addresses</p>
          </div>

          <motion.button
            onClick={() => navigate("/add-address")}
            className="mt-4 sm:mt-0 px-5 py-2.5 bg-gray-800 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={18} />
            <span>Add New Address</span>
          </motion.button>
        </div>

        {/* Success message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl text-green-600 flex items-center gap-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CheckCircle size={20} />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 flex items-center gap-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AlertCircle size={20} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        ) : addresses && addresses.length > 0 ? (
          <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
            {addresses.map((address) => (
              <motion.div
                key={address._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative"
                variants={itemVariants}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
              >
                {/* Default badge */}
                {address.isDefault && (
                  <div className="absolute top-4 right-4 bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <CheckCircle size={14} />
                    <span>Default</span>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-full ${address.addressType === "work" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"}`}
                  >
                    {address.addressType === "work" ? <Briefcase size={20} /> : <Home size={20} />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-800">{address.fullName}</h3>
                      <span className="text-sm text-gray-500">|</span>
                      <span className="text-sm text-gray-600">{address.phone}</span>
                    </div>

                    <p className="text-gray-600 mb-2">
                      {address.address}, {address.locality}, {address.city}, {address.state} - {address.pincode}
                    </p>

                    {address.addressType === "work" && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {address.openSaturday && (
                          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                            Open on Saturday
                          </span>
                        )}
                        {address.openSunday && (
                          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">Open on Sunday</span>
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3 mt-4">
                      <motion.button
                        onClick={() => navigate(`/edit-address/${address._id}`)}
                        className="px-4 py-1.5 border border-gray-300 rounded-xl text-gray-700 text-sm font-medium flex items-center gap-1.5 hover:bg-gray-50 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Edit2 size={14} />
                        <span>Edit</span>
                      </motion.button>

                      <motion.button
                        onClick={() => handleDeleteAddress(address._id)}
                        className="px-4 py-1.5 border border-red-200 rounded-xl text-red-600 text-sm font-medium flex items-center gap-1.5 hover:bg-red-50 transition-colors disabled:opacity-70"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={deletingId === address._id}
                      >
                        {deletingId === address._id ? (
                          <div className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-1.5"></div>
                        ) : (
                          <Trash2 size={14} />
                        )}
                        <span>Delete</span>
                      </motion.button>

                      {!address.isDefault && (
                        <motion.button
                          onClick={() => handleSetDefault(address._id)}
                          className="px-4 py-1.5 border border-green-200 rounded-xl text-green-600 text-sm font-medium flex items-center gap-1.5 hover:bg-green-50 transition-colors disabled:opacity-70"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={settingDefaultId === address._id}
                        >
                          {settingDefaultId === address._id ? (
                            <div className="w-3.5 h-3.5 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-1.5"></div>
                          ) : (
                            <CheckCircle size={14} />
                          )}
                          <span>Set as Default</span>
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gray-100 rounded-full">
                <MapPin size={32} className="text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No addresses found</h3>
            <p className="text-gray-600 mb-6">You haven't added any delivery addresses yet.</p>
            <motion.button
              onClick={() => navigate("/add-address")}
              className="px-6 py-2.5 bg-gray-800 text-white rounded-xl font-medium inline-flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus size={18} />
              <span>Add Your First Address</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AddressList;