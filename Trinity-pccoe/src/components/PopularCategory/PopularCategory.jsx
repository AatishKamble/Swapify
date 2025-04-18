import { useEffect, useRef } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import CategoryCard from "../CategoryCard/CategoryCard"

const PopularCategory = () => {
  // Categories data
  const categories = [
    {
      title: "Books & Study Materials",
      category: "Academic",
      image: "https://cdn-icons-png.flaticon.com/512/6347/6347299.png",
      bgColor: "bg-blue-500",
    },
    {
      title: "Electronic",
      category: "Gadgets",
      image: "https://cdn-icons-png.flaticon.com/512/5175/5175273.png",
      bgColor: "bg-purple-500",
    },
    {
      title: "Photography & Videography",
      category: "Equipment",
      image: "https://cdn-icons-png.flaticon.com/512/7178/7178848.png",
      bgColor: "bg-pink-500",
    },
    {
      title: "Gaming & Accessories",
      category: "Entertainment",
      image: "https://cdn-icons-png.flaticon.com/512/10630/10630188.png",
      bgColor: "bg-green-500",
    },
    {
      title: "Sports & Fitness",
      category: "Fitness",
      image: "https://cdn-icons-png.flaticon.com/512/9839/9839844.png",
      bgColor: "bg-red-500",
    },
    {
      title: "Furniture & Home Essentials",
      category: "Home",
      image: "https://cdn-icons-png.flaticon.com/512/4392/4392541.png",
      bgColor: "bg-yellow-500",
    },
  ]

  // Ref for scroll detection
  const ref = useRef(null)

  // Check if section is in view
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  // Animation controls
  const controls = useAnimation()

  // Trigger animations when section comes into view
  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Stagger children animations
        delayChildren: 0.2, // Delay before starting children animations
      },
    },
  }

  // Heading animation variants
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
    <section ref={ref} className="py-16 md:py-24 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-10 lg:px-8">
        {/* Animated heading */}
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-800"
          initial="hidden"
          animate={controls}
          variants={headingVariants}
        >
          Popular Categories
        </motion.h2>

        {/* Animated subtitle */}
        <motion.p
          className="text-center text-gray-600 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: -10 }}
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: -10 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.6,
                delay: 0.3,
                ease: "easeOut",
              },
            },
          }}
        >
          Discover and explore our most popular product categories
        </motion.p>

        {/* Animated card container */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {categories.map((category, index) => (
            <motion.div
              key={index}
              // Responsive sizing: small on mobile, larger on normal screens
              className="mx-auto w-full max-w-xs md:max-w-sm lg:max-w-md"
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    ease: "easeOut",
                  },
                },
              }}
              // Parallax effect on scroll
              style={{
                y: isInView ? (index % 2 === 0 ? -5 : 5) : 0,
              }}
              whileHover={{
                y: isInView ? (index % 2 === 0 ? -10 : 0) : 0,
                transition: { duration: 0.3 },
              }}
            >
              <CategoryCard {...category} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default PopularCategory
