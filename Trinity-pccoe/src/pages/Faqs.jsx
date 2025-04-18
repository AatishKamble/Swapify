import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaChevronDown, FaSearch } from "react-icons/fa"

const FAQsPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [openFaqId, setOpenFaqId] = useState(null)

  // FAQ Categories
  const categories = [
    { id: "all", name: "All FAQs" },
    { id: "account", name: "Account & Profile" },
    { id: "orders", name: "Orders & Shipping" },
    { id: "products", name: "Products & Listings" },
    { id: "payments", name: "Payments & Refunds" },
  ]

  // FAQ Data
  const faqData = [
    {
      id: 1,
      category: "account",
      question: "How do I create an account on Swapify?",
      answer:
        "Creating an account on Swapify is easy! Click on the 'Sign Up' button in the top right corner of the homepage. Fill in your details including your name, email address, and password. Verify your email address through the confirmation link we'll send you, and you're all set to start using Swapify!",
    },
    {
      id: 2,
      category: "account",
      question: "How can I reset my password?",
      answer:
        "To reset your password, click on the 'Sign In' button and then select 'Forgot Password'. Enter the email address associated with your account, and we'll send you a link to reset your password. Follow the instructions in the email to create a new password.",
    },
    {
      id: 3,
      category: "account",
      question: "Can I change my username or email address?",
      answer:
        "Yes, you can change your username and email address in your account settings. Go to your profile, click on 'Settings', and update your information. Note that changing your email address will require verification of the new email.",
    },
    {
      id: 4,
      category: "orders",
      question: "How do I track my order?",
      answer:
        "You can track your order by going to 'My Orders' in your account dashboard. Click on the specific order you want to track, and you'll see its current status. If the seller has provided a tracking number, you'll find it there as well.",
    },
    {
      id: 5,
      category: "orders",
      question: "What should I do if my order hasn't arrived?",
      answer:
        "If your order hasn't arrived within the expected delivery timeframe, first check the tracking information. If there's no update or the delivery is significantly delayed, contact the seller through our messaging system. If you don't receive a satisfactory response, you can open a dispute through our customer support.",
    },
    {
      id: 6,
      category: "products",
      question: "How do I list a product for sale?",
      answer:
        "To list a product, click on the 'Sell' button in the navigation bar. Fill out the product details including title, description, price, condition, and category. Upload clear photos of your item from multiple angles. Review your listing and click 'Publish' to make it live on the marketplace.",
    },
    {
      id: 7,
      category: "products",
      question: "Can I edit my product listing after publishing?",
      answer:
        "Yes, you can edit your listing at any time as long as it hasn't been sold. Go to 'My Products' in your account dashboard, find the listing you want to edit, and click on 'Edit'. Make your changes and save them to update your listing.",
    },
    {
      id: 8,
      category: "payments",
      question: "What payment methods are accepted on Swapify?",
      answer:
        "Swapify accepts various payment methods including credit/debit cards (Visa, Mastercard, American Express), PayPal, and bank transfers. The available payment options will be displayed during checkout.",
    },
    {
      id: 9,
      category: "payments",
      question: "How do refunds work?",
      answer:
        "If you're eligible for a refund, the amount will be credited back to your original payment method. Refunds typically take 5-10 business days to process, depending on your payment provider. For more details, please refer to our Refund Policy.",
    },
    {
      id: 10,
      category: "payments",
      question: "Is there a fee for selling on Swapify?",
      answer:
        "Swapify charges a small commission fee of 5% on each successful sale. This fee helps us maintain the platform and provide secure transactions. There are no fees for listing products or for buyers making purchases.",
    },
  ]

  // Filter FAQs based on search query and active category
  const filteredFaqs = faqData.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory
    return matchesSearch && matchesCategory
  })

  // Toggle FAQ open/close
  const toggleFaq = (id) => {
    setOpenFaqId(openFaqId === id ? null : id)
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
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <div className="w-24 h-1 bg-primary-600 mx-auto rounded-full mb-6"></div>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Find answers to common questions about using Swapify. Can't find what you're looking for?
            <a href="/contact" className="text-primary-600 hover:text-primary-700 ml-1">
              Contact us
            </a>
            .
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="mb-10 relative max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search for questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors shadow-sm"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          className="mb-10 overflow-x-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex space-x-2 min-w-max pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-primary-600 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* FAQs List */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <motion.div
                key={faq.id}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none"
                >
                  <h3 className="text-lg font-medium text-gray-800">{faq.question}</h3>
                  <FaChevronDown
                    className={`text-gray-500 transition-transform duration-300 ${
                      openFaqId === faq.id ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openFaqId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-2 text-gray-600 border-t border-gray-100">
                        <p>{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          ) : (
            <motion.div variants={itemVariants} className="text-center py-12 bg-white rounded-xl shadow-sm">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No results found</h3>
              <p className="mt-1 text-gray-500">
                We couldn't find any FAQs matching your search. Try different keywords or browse by category.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => {
                    setSearchQuery("")
                    setActiveCategory("all")
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Clear filters
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Still Need Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 bg-primary-50 rounded-2xl p-8 text-center border border-primary-100"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Still Need Help?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our support team is here to help you with any questions or
            concerns.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/contact"
              className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-sm"
            >
              Contact Support
            </a>
            <a
              href="/help"
              className="px-6 py-3 bg-white text-primary-600 rounded-xl font-medium hover:bg-gray-50 transition-colors shadow-sm border border-primary-200"
            >
              Visit Help Center
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default FAQsPage

