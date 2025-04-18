import { useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import {
  FaSearch,
  FaUserCircle,
  FaShoppingCart,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaShieldAlt,
  FaQuestionCircle,
  FaArrowRight,
  FaHeadset,
  FaEnvelope,
  FaComments,
} from "react-icons/fa"

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("")

  // Help categories with icons and descriptions
  const helpCategories = [
    {
      id: "account",
      title: "Account & Profile",
      icon: <FaUserCircle className="h-8 w-8" />,
      description: "Manage your account, update profile information, and security settings.",
      articles: [
        "How to create an account",
        "Updating your profile information",
        "Changing your password",
        "Account verification process",
        "Deleting your account",
      ],
    },
    {
      id: "orders",
      title: "Orders & Shipping",
      icon: <FaShoppingCart className="h-8 w-8" />,
      description: "Track orders, shipping information, and delivery status.",
      articles: [
        "Tracking your order",
        "Shipping policies and timeframes",
        "Order cancellation process",
        "Delivery issues and solutions",
        "International shipping guidelines",
      ],
    },
    {
      id: "payments",
      title: "Payments & Refunds",
      icon: <FaMoneyBillWave className="h-8 w-8" />,
      description: "Payment methods, billing issues, and refund processes.",
      articles: [
        "Accepted payment methods",
        "How to request a refund",
        "Payment security measures",
        "Billing issues troubleshooting",
        "Understanding transaction fees",
      ],
    },
    {
      id: "selling",
      title: "Selling on Swapify",
      icon: <FaExchangeAlt className="h-8 w-8" />,
      description: "Learn how to list items, manage inventory, and handle sales.",
      articles: [
        "Creating effective product listings",
        "Setting the right price",
        "Managing your inventory",
        "Communicating with buyers",
        "Shipping sold items",
      ],
    },
    {
      id: "security",
      title: "Safety & Security",
      icon: <FaShieldAlt className="h-8 w-8" />,
      description: "Stay safe while trading, privacy policies, and security tips.",
      articles: [
        "Safe trading guidelines",
        "Privacy policy explained",
        "Reporting suspicious activity",
        "Secure payment practices",
        "Identity verification",
      ],
    },
    {
      id: "faq",
      title: "Frequently Asked Questions",
      icon: <FaQuestionCircle className="h-8 w-8" />,
      description: "Quick answers to common questions about using Swapify.",
      articles: [
        "General platform questions",
        "Account-related FAQs",
        "Buying process FAQs",
        "Selling process FAQs",
        "Payment and refund FAQs",
      ],
    },
  ]

  // Popular help articles
  const popularArticles = [
    "How to create a compelling product listing",
    "Understanding Swapify's fee structure",
    "Tips for safe trading on campus",
    "Resolving disputes with sellers or buyers",
    "Getting verified as a trusted seller",
  ]

  // Filter categories based on search query
  const filteredCategories = searchQuery
    ? helpCategories.filter(
        (category) =>
          category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.articles.some((article) => article.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    : helpCategories

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
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How can we help you?</h1>
          <div className="w-24 h-1 bg-primary-600 mx-auto rounded-full mb-6"></div>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-8">
            Find answers, guides, and resources to help you make the most of Swapify.
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto relative">
            <input
              type="text"
              placeholder="Search for help articles, topics, or questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors shadow-md text-lg"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </motion.div>

        {/* Help Categories */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Browse Help Topics</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <motion.div
                key={category.id}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-primary-50 text-primary-600 mr-4">{category.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-800">{category.title}</h3>
                </div>

                <p className="text-gray-600 mb-5">{category.description}</p>

                <ul className="space-y-2 mb-6">
                  {category.articles.slice(0, 3).map((article, index) => (
                    <li key={index} className="flex items-start">
                      <FaArrowRight className="h-4 w-4 text-primary-500 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-gray-700 hover:text-primary-600 cursor-pointer transition-colors">
                        {article}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  // to={`/help/${category.id}`}
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
                >
                  <span>View all articles</span>
                  <FaArrowRight className="ml-2 h-3 w-3" />
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredCategories.length === 0 && (
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
                We couldn't find any help topics matching your search. Try different keywords or browse all categories.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setSearchQuery("")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Clear search
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Popular Articles Section */}
        {!searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Popular Help Articles</h2>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {popularArticles.map((article, index) => (
                <div
                  key={index}
                  className={`p-5 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between ${
                    index !== popularArticles.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <div className="flex items-center">
                    <FaQuestionCircle className="h-5 w-5 text-primary-500 mr-3" />
                    <span className="text-gray-800 hover:text-primary-600 transition-colors">{article}</span>
                  </div>
                  <FaArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Contact Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-lg p-8 text-white"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-6">
              <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
              <p className="text-primary-100 max-w-xl">
                Can't find what you're looking for? Our support team is ready to assist you with any questions or issues
                you may have.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                to="/contact"
                className="bg-white text-primary-600 px-5 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors shadow-sm flex items-center justify-center"
              >
                <FaHeadset className="mr-2" />
                <span>Contact Us</span>
              </Link>

              <a
                href="mailto:support@swapify.com"
                className="bg-primary-500 text-white px-5 py-3 rounded-xl font-medium hover:bg-primary-400 transition-colors shadow-sm flex items-center justify-center"
              >
                <FaEnvelope className="mr-2" />
                <span>Email Support</span>
              </a>

              <Link
                to="/faqs"
                className="bg-primary-800 text-white px-5 py-3 rounded-xl font-medium hover:bg-primary-900 transition-colors shadow-sm flex items-center justify-center"
              >
                <FaComments className="mr-2" />
                <span>View FAQs</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default HelpCenter