import { useState, useEffect } from "react"
import { Star } from "lucide-react"

const StarRating = ({ initialRating = 0, size = "medium", onChange, readOnly = false }) => {
  const [rating, setRating] = useState(initialRating)
  const [hover, setHover] = useState(0)

  useEffect(() => {
    setRating(initialRating)
  }, [initialRating])

  // Determine star size based on prop
  const getStarSize = () => {
    switch (size) {
      case "small":
        return 16
      case "large":
        return 24
      case "medium":
      default:
        return 20
    }
  }

  const starSize = getStarSize()

  const handleClick = (newRating) => {
    if (readOnly) return
    setRating(newRating)
    if (onChange) {
      onChange(newRating)
    }
  }

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`cursor-${readOnly ? "default" : "pointer"} transition-colors duration-200`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
        >
          <Star
            size={starSize}
            className={`${
              star <= (hover || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            } transition-colors duration-200`}
          />
        </span>
      ))}
    </div>
  )
}

export default StarRating

