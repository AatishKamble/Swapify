import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaChevronRight, FaArrowUp, FaShieldAlt } from "react-icons/fa"

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState("")
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Check scroll position to show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)

      // Update active section based on scroll position
      const sections = document.querySelectorAll("section[id]")
      const scrollPosition = window.scrollY + 100

      sections.forEach((section) => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.offsetHeight
        const sectionId = section.getAttribute("id")

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(sectionId)
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Scroll to section function
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId)
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: "smooth",
      })
      setActiveSection(sectionId)
    }
  }

  // Last updated date
  const lastUpdated = "April 6, 2024"

  // Table of contents sections
  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "information", title: "Information We Collect" },
    { id: "usage", title: "How We Use Your Information" },
    { id: "sharing", title: "Information Sharing" },
    { id: "cookies", title: "Cookies & Tracking" },
    { id: "security", title: "Data Security" },
    { id: "rights", title: "Your Privacy Rights" },
    { id: "children", title: "Children's Privacy" },
    { id: "international", title: "International Data Transfers" },
    { id: "changes", title: "Changes to Privacy Policy" },
    { id: "contact", title: "Contact Information" },
  ]

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <FaShieldAlt className="h-12 w-12 text-white opacity-90" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-lg opacity-90">How we collect, use, and protect your personal information</p>
            <p className="mt-4 text-sm opacity-80">Last Updated: {lastUpdated}</p>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <nav className="flex text-sm">
            <Link to="/" className="text-gray-500 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <FaChevronRight className="mx-2 mt-1 text-gray-400" />
            <span className="text-gray-700 font-medium">Privacy Policy</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar - Table of Contents */}
          <div className="lg:w-1/4 mb-8 lg:mb-0">
            <div className="sticky top-24 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Table of Contents</h2>
              <nav>
                <ul className="space-y-2">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <button
                        onClick={() => scrollToSection(section.id)}
                        className={`text-left w-full px-3 py-2 rounded-md text-sm transition-colors ${
                          activeSection === section.id
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        {section.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4 lg:pl-8">
            <div className="max-w-3xl bg-white rounded-lg">
              {/* Introduction */}
              <section id="introduction" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Introduction</h2>
                <div className="prose prose-blue max-w-none">
                  <p>
                    Swapify ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains
                    how we collect, use, disclose, and safeguard your information when you use our website, mobile
                    application, and services (collectively, the "Service").
                  </p>
                  <p>
                    Please read this Privacy Policy carefully. By accessing or using the Service, you acknowledge that
                    you have read, understood, and agree to be bound by all the terms of this Privacy Policy. If you do
                    not agree with our policies and practices, please do not use our Service.
                  </p>
                  <p>
                    This Privacy Policy applies to all users of the Service, including without limitation users who are
                    browsers, vendors, customers, merchants, and/or contributors of content.
                  </p>
                </div>
              </section>

              {/* Information We Collect */}
              <section id="information" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Information We Collect</h2>
                <div className="prose prose-blue max-w-none">
                  <h3>2.1 Personal Information</h3>
                  <p>
                    We may collect personal information that you voluntarily provide to us when you register for an
                    account, express an interest in obtaining information about us or our products and services,
                    participate in activities on the Service, or otherwise contact us. The personal information we
                    collect may include:
                  </p>
                  <ul>
                    <li>Name</li>
                    <li>Email address</li>
                    <li>Phone number</li>
                    <li>Educational institution affiliation</li>
                    <li>Mailing address</li>
                    <li>Username and password</li>
                    <li>Profile picture</li>
                    <li>Payment information</li>
                    <li>Social media account information</li>
                    <li>Other information you choose to provide</li>
                  </ul>

                  <h3>2.2 Information Automatically Collected</h3>
                  <p>
                    When you access or use our Service, we may automatically collect certain information, including:
                  </p>
                  <ul>
                    <li>Device information (such as your mobile device ID, model, and manufacturer)</li>
                    <li>IP address</li>
                    <li>Browser type and version</li>
                    <li>Operating system</li>
                    <li>Access times and dates</li>
                    <li>Referring website addresses</li>
                    <li>Pages viewed and how you navigate the Service</li>
                  </ul>

                  <h3>2.3 Information from Third Parties</h3>
                  <p>We may collect information about you from third-party sources, such as:</p>
                  <ul>
                    <li>Educational institutions for verification purposes</li>
                    <li>Social media platforms when you connect your account</li>
                    <li>Payment processors regarding your payment history</li>
                    <li>Other users who may provide information about you when they use our Service</li>
                  </ul>
                </div>
              </section>

              {/* How We Use Your Information */}
              <section id="usage" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">3. How We Use Your Information</h2>
                <div className="prose prose-blue max-w-none">
                  <p>We may use the information we collect for various purposes, including to:</p>
                  <ul>
                    <li>Create and maintain your account</li>
                    <li>Provide, operate, and maintain our Service</li>
                    <li>Verify your educational institution affiliation</li>
                    <li>Process transactions and send related information</li>
                    <li>Send administrative information, such as updates, security alerts, and support messages</li>
                    <li>Respond to your comments, questions, and requests</li>
                    <li>Provide customer support</li>
                    <li>Send you marketing and promotional communications (with your consent)</li>
                    <li>Personalize your experience on our Service</li>
                    <li>Monitor and analyze usage and trends</li>
                    <li>Detect, prevent, and address technical issues</li>
                    <li>Improve our Service and develop new products, services, and features</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>
              </section>

              {/* Information Sharing */}
              <section id="sharing" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Information Sharing</h2>
                <div className="prose prose-blue max-w-none">
                  <p>We may share your information in the following situations:</p>

                  <h3>4.1 With Other Users</h3>
                  <p>
                    When you use our Service, certain information may be visible to other users, such as your username,
                    profile picture, listings, ratings, and reviews. When you engage in transactions with other users,
                    we may share information necessary to facilitate the transaction.
                  </p>

                  <h3>4.2 With Service Providers</h3>
                  <p>
                    We may share your information with third-party vendors, service providers, contractors, or agents
                    who perform services for us or on our behalf and require access to such information to do that work.
                  </p>

                  <h3>4.3 For Business Transfers</h3>
                  <p>
                    We may share or transfer your information in connection with, or during negotiations of, any merger,
                    sale of company assets, financing, or acquisition of all or a portion of our business to another
                    company.
                  </p>

                  <h3>4.4 With Your Consent</h3>
                  <p>We may disclose your personal information for any other purpose with your consent.</p>

                  <h3>4.5 For Legal Purposes</h3>
                  <p>
                    We may disclose your information where we believe it is necessary to comply with applicable laws, to
                    exercise or defend our legal rights, to protect the rights, property, or safety of our users, or to
                    investigate potential violations of our Terms of Service.
                  </p>
                </div>
              </section>

              {/* Cookies & Tracking */}
              <section id="cookies" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Cookies & Tracking</h2>
                <div className="prose prose-blue max-w-none">
                  <p>
                    We use cookies and similar tracking technologies to track activity on our Service and hold certain
                    information. Cookies are files with a small amount of data that may include an anonymous unique
                    identifier.
                  </p>

                  <h3>5.1 Types of Cookies We Use</h3>
                  <ul>
                    <li>
                      <strong>Essential Cookies:</strong> Necessary for the Service to function properly.
                    </li>
                    <li>
                      <strong>Preference Cookies:</strong> Enable the Service to remember your preferences and settings.
                    </li>
                    <li>
                      <strong>Analytics Cookies:</strong> Help us understand how users interact with the Service.
                    </li>
                    <li>
                      <strong>Marketing Cookies:</strong> Used to track visitors across websites to display relevant
                      advertisements.
                    </li>
                  </ul>

                  <h3>5.2 Your Cookie Choices</h3>
                  <p>
                    Most web browsers allow you to control cookies through their settings preferences. However, if you
                    limit the ability of websites to set cookies, you may worsen your overall user experience and/or
                    lose access to certain features of our Service.
                  </p>
                </div>
              </section>

              {/* Data Security */}
              <section id="security" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Data Security</h2>
                <div className="prose prose-blue max-w-none">
                  <p>
                    We have implemented appropriate technical and organizational security measures designed to protect
                    the security of any personal information we process. However, despite our safeguards and efforts to
                    secure your information, no electronic transmission over the Internet or information storage
                    technology can be guaranteed to be 100% secure.
                  </p>
                  <p>
                    We will make any legally required disclosures of any breach of the security, confidentiality, or
                    integrity of your unencrypted electronically stored "personal data" (as defined in applicable state
                    statutes on security breach notification) to you via email or conspicuous posting on our Service as
                    promptly as possible and without unreasonable delay, consistent with (i) the legitimate needs of law
                    enforcement or (ii) any measures necessary to determine the scope of the breach and restore the
                    reasonable integrity of the data system.
                  </p>
                </div>
              </section>

              {/* Your Privacy Rights */}
              <section id="rights" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Your Privacy Rights</h2>
                <div className="prose prose-blue max-w-none">
                  <p>
                    Depending on your location, you may have certain rights regarding your personal information,
                    including:
                  </p>

                  <h3>7.1 Access and Portability</h3>
                  <p>
                    You have the right to request copies of your personal information. We may charge you a small fee for
                    this service.
                  </p>

                  <h3>7.2 Correction</h3>
                  <p>
                    You have the right to request that we correct any information you believe is inaccurate or
                    incomplete.
                  </p>

                  <h3>7.3 Deletion</h3>
                  <p>
                    You have the right to request that we erase your personal information, under certain conditions.
                  </p>

                  <h3>7.4 Restriction</h3>
                  <p>
                    You have the right to request that we restrict the processing of your personal information, under
                    certain conditions.
                  </p>

                  <h3>7.5 Object</h3>
                  <p>
                    You have the right to object to our processing of your personal information, under certain
                    conditions.
                  </p>

                  <h3>7.6 Exercising Your Rights</h3>
                  <p>
                    To exercise any of these rights, please contact us using the contact information provided below. We
                    will respond to your request within a reasonable timeframe.
                  </p>
                </div>
              </section>

              {/* Children's Privacy */}
              <section id="children" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Children's Privacy</h2>
                <div className="prose prose-blue max-w-none">
                  <p>
                    Our Service is not directed to children under the age of 18. We do not knowingly collect personal
                    information from children under 18. If you are a parent or guardian and you are aware that your
                    child has provided us with personal information, please contact us. If we become aware that we have
                    collected personal information from children without verification of parental consent, we take steps
                    to remove that information from our servers.
                  </p>
                </div>
              </section>

              {/* International Data Transfers */}
              <section id="international" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">9. International Data Transfers</h2>
                <div className="prose prose-blue max-w-none">
                  <p>
                    Our Service is primarily operated and managed on servers located in the United States. If you access
                    our Service from outside the United States, please be aware that your information may be transferred
                    to, stored, and processed in the United States where our servers are located and our central
                    database is operated. The data protection and other laws of the United States might not be as
                    comprehensive as those in your country.
                  </p>
                  <p>
                    By using our Service, you consent to your information being transferred to our facilities and to the
                    facilities of those third parties with whom we share it as described in this Privacy Policy.
                  </p>
                </div>
              </section>

              {/* Changes to Privacy Policy */}
              <section id="changes" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Changes to Privacy Policy</h2>
                <div className="prose prose-blue max-w-none">
                  <p>
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the
                    new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy
                    Policy.
                  </p>
                  <p>
                    You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy
                    Policy are effective when they are posted on this page.
                  </p>
                </div>
              </section>

              {/* Contact Information */}
              <section id="contact" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Contact Information</h2>
                <div className="prose prose-blue max-w-none">
                  <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                  <p>
                    <strong>Email:</strong> privacy@swapify.com
                    <br />
                    <strong>Address:</strong> 123 Campus Drive, University City, CA 90210
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Scroll to top"
        >
          <FaArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}

export default PrivacyPolicy

