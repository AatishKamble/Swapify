import { useState, useEffect, useRef } from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"

// Custom arrow components with enhanced styling
function SampleNextArrow(props) {
  const { onClick } = props
  return (
    <button
      className="absolute right-6 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white/90 hover:bg-white text-primary-600 hover:text-primary-700 p-3 rounded-full shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      onClick={onClick}
      aria-label="Next slide"
    >
      <ArrowForwardIcon className="h-6 w-6" />
    </button>
  )
}

function SamplePrevArrow(props) {
  const { onClick } = props
  return (
    <button
      className="absolute left-6 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white/90 hover:bg-white text-primary-600 hover:text-primary-700 p-3 rounded-full shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      onClick={onClick}
      aria-label="Previous slide"
    >
      <ArrowBackIcon className="h-6 w-6" />
    </button>
  )
}

// Slide content component to trigger in-animation on mount only
const SlideContent = ({ item }) => {
  const [animateIn, setAnimateIn] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setAnimateIn(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="absolute inset-0 flex flex-col justify-center z-20 px-6 sm:px-12 md:px-16 lg:px-24">
      <div className="max-w-xl">
        <h2
          className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 md:mb-6 tracking-tight transition-all duration-700 ${
            animateIn ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {item.title}
        </h2>
        <p
          className={`text-white/90 text-base sm:text-lg md:text-xl mb-6 md:mb-8 max-w-md transition-all duration-700 delay-200 ${
            animateIn ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {item.description}
        </p>
        <button
          className={`px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-full transition-all duration-700 delay-400 shadow-lg hover:shadow-primary-500/30 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
            animateIn ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          onClick={() => (window.location.href = item.buttonLink)}
        >
          {item.buttonText}
        </button>
      </div>
    </div>
  )
}

export const HomeCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const sliderRef = useRef(null)
  const carouselRef = useRef(null)
  const [parallaxOffset, setParallaxOffset] = useState(0)

  // Refined parallax effect on the image container
  useEffect(() => {
    const handleScroll = () => {
      if (carouselRef.current) {
        const rect = carouselRef.current.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const offset = (window.innerHeight - rect.top) * 0.1
          setParallaxOffset(offset)
        }
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Carousel settings with autoplay enabled
  const settings = {
    autoplay: true,
    speed: 800,
    autoplaySpeed: 6000,
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    beforeChange: (current, next) => setCurrentSlide(next),
    appendDots: (dots) => (
      <div>
        <ul className="flex justify-center items-center gap-3 absolute bottom-8 left-1/2 -translate-x-1/2">{dots}</ul>
      </div>
    ),
    customPaging: (i) => (
      <button
        className={`transition-all duration-300 rounded-full ${
          i === currentSlide ? "w-8 h-2 bg-primary-600" : "w-2 h-2 bg-white/70 hover:bg-white"
        }`}
        aria-label={`Go to slide ${i + 1}`}
      />
    ),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
        },
      },
    ],
  }

  // Carousel data with enhanced information
  const carouselItems = [
    {
      image: "/assets/laptopGroup.jpg",
      title: "Premium Electronics",
      description: "Find quality laptops and electronics at student-friendly prices",
      buttonText: "Shop Electronics",
      buttonLink: "/items?category=Electronic",
    },
    {
      image: "https://thumbs.dreamstime.com/b/second-hand-label-round-band-sign-stamp-171557993.jpg",
      title: "Second-Hand Treasures",
      description: "Quality pre-owned items at a fraction of the original cost",
      buttonText: "Explore Deals",
      buttonLink: "/items",
    },
    {
      image: "https://www.prestonlaw.com.au/wp-content/uploads/2023/05/buy-sell.jpg",
      title: "Buy & Sell Easily",
      description: "Your campus marketplace for hassle-free trading",
      buttonText: "Start Selling",
      buttonLink: "/sell-product",
    },
  ]

  // Keyboard navigation for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        sliderRef.current.slickPrev()
      } else if (e.key === "ArrowRight") {
        sliderRef.current.slickNext()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <div ref={carouselRef} className="w-full overflow-hidden relative">
      <Slider ref={sliderRef} {...settings} className="w-full">
        {carouselItems.map((item, index) => (
          <div key={index} className="relative w-full outline-none">
            <div className="relative h-[400px] sm:h-[500px] md:h-[600px] w-full overflow-hidden">
              {/* Image Container with Parallax Effect */}
              <div
                className="absolute inset-0 transition-transform duration-200 ease-out"
                style={{ transform: `translateY(${parallaxOffset}px)` }}
              >
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="object-cover w-full h-full"
                />
              </div>
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10"></div>
              {/* Slide Text Content - key forces remount on slide change */}
              <SlideContent key={currentSlide} item={item} />
            </div>
          </div>
        ))}
      </Slider>

      <style jsx>{`
        :global(.slick-dots li button:before) {
          display: none;
        }
        :global(.slick-dots li) {
          margin: 0 2px;
        }
      `}</style>
    </div>
  )
}

export default HomeCarousel
