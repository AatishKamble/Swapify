import { useEffect, useRef } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { HomeCarousel } from "../components/Carousel/HomeCarousel"
import PopularCategory from "../components/PopularCategory/PopularCategory"
import RecommendedProducts from "../components/RecommendedProducts/RecommendedProducts"

export const Home = () => {
  // Refs for scroll detection
  const whySwapifyRef = useRef(null)

  // Check if sections are in view with a smaller threshold for mobile
  // Using a smaller amount value (0.05 instead of 0.2) to trigger animations earlier
  const whySwapifyInView = useInView(whySwapifyRef, {
    once: false,
    amount: 0.05, // Reduced from 0.2 to trigger earlier
    margin: "0px 0px -100px 0px", // Negative bottom margin to trigger before element is fully in view
  })

  // Animation controls
  const whySwapifyControls = useAnimation()

  // Trigger animations when sections come into view
  useEffect(() => {
    if (whySwapifyInView) {
      whySwapifyControls.start("visible")
    }
  }, [whySwapifyInView, whySwapifyControls])

  // Why Swapify data
  const whySwapifyReasons = [
    {
      title: "Easy & Secure Exchange",
      description: "Safe transactions with verified campus users",
      image:
        "https://image3.jdomni.in/banner/13062021/58/97/7C/E53960D1295621EFCB5B13F335_1623567851299.png?output-format=webp",
      color: "bg-blue-600",
      lightColor: "from-blue-50 to-blue-100",
      borderColor: "border-blue-600",
    },
    {
      title: "Affordable Cost",
      description: "Student-friendly prices on all items",
      image:
        "https://image2.jdomni.in/banner/13062021/3E/57/E8/1D6E23DD7E12571705CAC761E7_1623567977295.png?output-format=webp",
      color: "bg-green-600",
      lightColor: "from-green-50 to-green-100",
      borderColor: "border-green-600",
    },
    {
      title: "Quick & Hassle-Free Deals",
      description: "Simple process from listing to delivery",
      image:
        "https://image3.jdomni.in/banner/13062021/16/7E/7E/5A9920439E52EF309F27B43EEB_1623568010437.png?output-format=webp",
      color: "bg-purple-600",
      lightColor: "from-purple-50 to-purple-100",
      borderColor: "border-purple-600",
    },
    {
      title: "Trusted Student Community",
      description: "Connect with peers from your campus",
      image:
        "https://image3.jdomni.in/banner/13062021/EB/99/EE/8B46027500E987A5142ECC1CE1_1623567959360.png?output-format=webp",
      color: "bg-orange-600",
      lightColor: "from-orange-50 to-orange-100",
      borderColor: "border-orange-600",
    },
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
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  const headingVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  return (
    <>
      <HomeCarousel />
      <PopularCategory />

      {/* Recommended Products Section - Now using the dynamic component */}
      <RecommendedProducts />

      {/* Why Swapify Section */}
      <section ref={whySwapifyRef} className="py-20 bg-white">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          {/* Animated heading */}
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            animate={whySwapifyControls}
            variants={headingVariants}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-800">Why Swapify?</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Discover why students across campus choose Swapify for their buying and selling needs
            </p>
          </motion.div>

          {/* Animated reasons grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10"
            variants={containerVariants}
            initial="hidden"
            animate={whySwapifyControls}
          >
            {whySwapifyReasons.map((reason, index) => (
              <motion.div
                key={index}
                className="mx-auto w-full max-w-xs sm:max-w-none" // Center cards and limit width on small screens
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
              >
                <div
                  className={`bg-gradient-to-br ${reason.lightColor} rounded-2xl shadow-md overflow-hidden h-full border-b-4 ${reason.borderColor}`}
                >
                  {/* Icon container with animation */}
                  <div className="relative pt-8 pb-4 px-6 flex flex-col items-center">
                    {/* Decorative circle */}
                    <div
                      className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br ${reason.lightColor} opacity-70 -mr-8 -mt-8`}
                    ></div>

                    <motion.div
                      className="relative z-10 w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-md border-2 border-gray-100"
                      whileHover={{
                        rotate: [0, -5, 5, -5, 0],
                        scale: 1.1,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <img
                        src={reason.image || "/placeholder.svg"}
                        alt={reason.title}
                        className="w-16 h-16 object-contain"
                      />
                    </motion.div>

                    <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">{reason.title}</h3>

                    <p className="text-gray-600 text-center mb-4">{reason.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default Home

