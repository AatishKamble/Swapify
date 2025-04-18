import { Link } from "react-router-dom"
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaArrowUp } from "react-icons/fa"

export const Footer = () => {
  // Current year for copyright
  const currentYear = new Date().getFullYear()

  // Quick links with proper routing
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Collections", path: "/items" },
    { name: "Categories", path: "/categories" },
  ]

  // Help links
  const helpLinks = [
    { name: "Contact", path: "/contact" },
    { name: "FAQs", path: "/faqs" },
    { name: "Help Center", path: "/help" },
  ]

  // Legal links
  const legalLinks = [
    { name: "Terms of Service", path: "/terms" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Refund Policy", path: "/refunds" },
  ]

  // Social media links
  const socialLinks = [
    { name: "Facebook", icon: <FaFacebook className="h-5 w-5" />, url: "#" },
    { name: "Twitter", icon: <FaTwitter className="h-5 w-5" />, url: "#" },
    { name: "Instagram", icon: <FaInstagram className="h-5 w-5" />, url: "#" },
    { name: "LinkedIn", icon: <FaLinkedin className="h-5 w-5" />, url: "#" },
    { name: "YouTube", icon: <FaYoutube className="h-5 w-5" />, url: "#" },
  ]

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Render links with a fallback to home if empty
  const renderLinks = (links, type) => {
    // Define different styles based on link type
    const getLinkStyle = () => {
      switch (type) {
        case "quick":
          return "text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200 text-sm inline-block relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-primary-600 after:left-0 after:-bottom-0.5 after:transition-all after:duration-300 hover:after:w-full"
        case "help":
          return "text-gray-600 hover:text-green-600 font-medium transition-colors duration-200 text-sm inline-block relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-green-600 after:left-0 after:-bottom-0.5 after:transition-all after:duration-300 hover:after:w-full"
        case "legal":
          return "text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 text-sm inline-block relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-600 after:left-0 after:-bottom-0.5 after:transition-all after:duration-300 hover:after:w-full"
        default:
          return "text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200 text-sm"
      }
    }

    if (!links || links.length === 0) {
      return (
        <li>
          <Link to="/" onClick={scrollToTop} className={getLinkStyle()}>
            Home
          </Link>
        </li>
      )
    }
    return links.map((link) => (
      <li key={link.name}>
        <Link to={link.path || "/"} onClick={scrollToTop} className={getLinkStyle()}>
          {link.name}
        </Link>
      </li>
    ))
  }

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        {/* Main footer content */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left md:flex-row md:justify-between">
          {/* Logo and company info */}
          <div className="w-full max-w-md mb-10 mr-2 md:mb-0 md:max-w-xs lg:max-w-sm">
            <div className="flex justify-center md:justify-start">
              {/* Removed background class to blend logo with footer */}
              <div className="rounded-lg p-1">
                <img
                  src="/assets/swapify-with-logo.png"
                  alt="Swapify Logo"
                  className="h-14 w-auto object-contain hover:scale-105 transition-all duration-300 ease-in-out"
                />
              </div>
            </div>

            <p className="mt-4 text-gray-600 text-sm leading-relaxed">
              Swapify is your campus marketplace, connecting students to buy, sell, and exchange goods and services.
              Find what you need or sell what you don't at prices that make sense for student life.
            </p>

            {/* Social media links */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Connect With Us</h3>
              <div className="mt-4 flex justify-center md:justify-start space-x-5">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    className="text-gray-500 hover:text-primary-600 transition-colors duration-300 transform hover:scale-110"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Footer links - 4x1 on large screens, 2x2 on smaller screens */}
          <div className="w-full ml-0 md:ml-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-10 md:grid-cols-3 md:gap-8 lg:gap-12">
            {/* Quick Links */}
            <div className="footer-links-column">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b-2 border-primary-500 pb-2 inline-block">
                Quick Links
              </h3>
              <ul className="mt-4 space-y-3">{renderLinks(quickLinks, "quick")}</ul>
            </div>

            {/* Help */}
            <div className="footer-links-column">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b-2 border-green-500 pb-2 inline-block">
                Help
              </h3>
              <ul className="mt-4 space-y-3">{renderLinks(helpLinks, "help")}</ul>
            </div>

            {/* Legal */}
            <div className="footer-links-column">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b-2 border-blue-500 pb-2 inline-block">
                Legal
              </h3>
              <ul className="mt-4 space-y-3">{renderLinks(legalLinks, "legal")}</ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-gray-200 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">&copy; {currentYear} Swapify. All rights reserved.</p>

            {/* Back to top button */}
            <button
              onClick={scrollToTop}
              className="mt-4 sm:mt-0 flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors duration-200 group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md p-1"
              aria-label="Back to top"
            >
              <span>Back to top</span>
              <FaArrowUp className="h-4 w-4 transform group-hover:-translate-y-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;