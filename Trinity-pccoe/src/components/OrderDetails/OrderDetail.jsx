import { motion } from "framer-motion"
import { Box, Stepper, Step, StepLabel, StepConnector } from "@mui/material"
import { styled } from "@mui/material/styles"
import { MapPin, Package, FileText, CreditCard, Check, Truck, Home, X } from "lucide-react"

const OrderDetail = ({ order }) => {
  // Map order status to stepper index
  const getStatusIndex = (status) => {
    switch (status) {
      case "PLACED":
        return 0
      case "CONFIRMED":
        return 1
      case "SHIPPED":
        return 2
      case "DELIVERED":
        return 3
      case "CANCELLED":
        return -1 // Special case for cancelled orders
      default:
        return 0
    }
  }

  const statusIndex = getStatusIndex(order?.orderStatus)

  const steps = [
    { label: "Order Placed", icon: <Package size={20} /> },
    { label: "Order Confirmed", icon: <Check size={20} /> },
    { label: "Out For Delivery", icon: <Truck size={20} /> },
    { label: "Delivered", icon: <Home size={20} /> },
  ]

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

  // Custom styled StepConnector for the stepper
  const CustomConnector = styled(StepConnector)(({ theme }) => ({
    [`&.MuiStepConnector-root`]: {
      top: 10,
    },
    [`&.MuiStepConnector-alternativeLabel`]: {
      left: "calc(-50% + 16px)",
      right: "calc(50% + 16px)",
    },
    [`&.Mui-active`]: {
      [`& .MuiStepConnector-line`]: {
        borderColor: "#4F46E5",
      },
    },
    [`&.Mui-completed`]: {
      [`& .MuiStepConnector-line`]: {
        borderColor: "#4F46E5",
      },
    },
    [`& .MuiStepConnector-line`]: {
      borderColor: "#E5E7EB",
      borderTopWidth: 3,
      borderRadius: 1,
    },
  }))

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${(amount || 0).toLocaleString("en-IN")}`
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // If order is cancelled, show special message
  if (order?.orderStatus === "CANCELLED") {
    return (
      <motion.div
        className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Order Details</h1>
            <p className="mt-2 text-gray-600">
              Order #{order?._id?.substring(order._id.length - 8).toUpperCase() || "N/A"} •{" "}
              {formatDate(order?.createdAt)}
            </p>
          </motion.div>

          {/* Cancelled Order Message */}
          <motion.div
            className="bg-red-50 border border-red-100 rounded-xl p-8 text-center mb-6"
            variants={itemVariants}
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X size={32} className="text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-red-700 mb-2">Order Cancelled</h2>
            <p className="text-red-600 mb-4">This order has been cancelled and is no longer active.</p>
            <p className="text-gray-600">Cancellation Date: {formatDate(order?.updatedAt)}</p>
          </motion.div>

          {/* Continue with the rest of the order details */}
          {/* ... */}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="bg-gray-50 py-10 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Order Details</h1>
          <p className="mt-2 text-gray-600">
            Order #{order?._id?.substring(order._id.length - 8).toUpperCase() || "N/A"} • {formatDate(order?.createdAt)}
          </p>
        </motion.div>

        {/* Order Progress Stepper */}
        <motion.div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6" variants={itemVariants}>
          <Box sx={{ width: "100%" }}>
            <Stepper activeStep={statusIndex} alternativeLabel connector={<CustomConnector />}>
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel
                    StepIconProps={{
                      sx: {
                        "&.Mui-active": {
                          color: "#4F46E5",
                        },
                        "&.Mui-completed": {
                          color: "#4F46E5",
                        },
                      },
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`mb-2 ${index <= statusIndex ? "text-primary-600" : "text-gray-400"}`}>
                        {step.icon}
                      </div>
                      <span
                        className={`text-sm font-medium ${index <= statusIndex ? "text-gray-800" : "text-gray-500"}`}
                      >
                        {step.label}
                      </span>
                    </div>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </motion.div>

        {/* Delivery Address */}
        <motion.div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6" variants={itemVariants}>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
              <MapPin size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Delivery Address</h2>
              <div className="space-y-2">
                <p className="font-medium text-gray-800">{order.shippingAddress?.fullName}</p>
                <p className="text-gray-600 leading-relaxed">
                  {order.shippingAddress?.address}, {order.shippingAddress?.locality}, {order.shippingAddress?.city},{" "}
                  {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                </p>
                <div className="pt-2">
                  <p className="font-medium text-gray-800">Phone</p>
                  <p className="text-gray-600">{order.shippingAddress?.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Product Details */}
        <motion.div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6" variants={itemVariants}>
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
              <Package size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Product Details</h2>
          </div>

          <div className="space-y-4">
            {order.orderItems?.map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-start gap-6 p-4 bg-gray-50 rounded-xl">
                <motion.div
                  className="w-28 h-28 bg-white rounded-lg overflow-hidden flex items-center justify-center border border-gray-200"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={item.product?.imageURL || "/placeholder.svg?height=112&width=112"}
                    alt={item.product?.title || "Product"}
                    className="w-full h-full object-contain p-2"
                  />
                </motion.div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-lg mb-1">{item.product?.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{item.product?.description?.substring(0, 100)}...</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Price</p>
                      <p className="font-medium text-gray-800">{formatCurrency(item.price)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Quantity</p>
                      <p className="font-medium text-gray-800">{item.quantity}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Total</p>
                      <p className="font-medium text-gray-800">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6" variants={itemVariants}>
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
              <FileText size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Order Summary</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Order ID</p>
                  <p className="font-medium text-gray-800">
                    #{order._id?.substring(order._id.length - 8).toUpperCase() || "N/A"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Order Date</p>
                  <p className="font-medium text-gray-800">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Payment Method</p>
                  <p className="font-medium text-gray-800">{order.paymentDetails?.paymentMethod || "COD"}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Payment Status</p>
                  <p className="font-medium text-gray-800">{order.paymentDetails?.paymentStatus || "PENDING"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Subtotal</p>
                <p className="font-medium text-gray-800">{formatCurrency(order.totalPrice)}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Tax</p>
                <p className="font-medium text-gray-800">{formatCurrency(order.tax || 0)}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Delivery Charges</p>
                <p className="font-medium text-gray-800">{formatCurrency(0)}</p>
              </div>
              <div className="border-t border-dashed border-gray-200 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-gray-800">Total</p>
                  <p className="font-bold text-gray-800">{formatCurrency(order.totalAmount || order.totalPrice)}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Total Paid */}
        <motion.div
          className="bg-gray-800 text-white rounded-2xl shadow-md p-4 text-center"
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-center gap-2">
            <CreditCard size={20} />
            <p className="font-bold text-lg">Total Paid: {formatCurrency(order.totalAmount || order.totalPrice)}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default OrderDetail;