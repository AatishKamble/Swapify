import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaChevronRight, FaArrowUp } from "react-icons/fa"

const TermsOfService = () => {
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
    { id: "definitions", title: "Definitions" },
    { id: "account", title: "Account Registration & Requirements" },
    { id: "marketplace", title: "Marketplace Rules" },
    { id: "prohibited", title: "Prohibited Activities" },
    { id: "content", title: "User Content" },
    { id: "intellectual", title: "Intellectual Property" },
    { id: "liability", title: "Limitation of Liability" },
    { id: "disputes", title: "Disputes & Governing Law" },
    { id: "termination", title: "Termination" },
    { id: "changes", title: "Changes to Terms" },
    { id: "contact", title: "Contact Information" },
  ]

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-lg opacity-90">Please read these terms carefully before using Swapify</p>
            <p className="mt-4 text-sm opacity-80">Last Updated: {lastUpdated}</p>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <nav className="flex text-sm">
            <Link to="/" className="text-gray-500 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <FaChevronRight className="mx-2 mt-1 text-gray-400" />
            <span className="text-gray-700 font-medium">Terms of Service</span>
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
                            ? "bg-primary-50 text-primary-700 font-medium"
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
                <div className="prose prose-primary max-w-none">
                  <p>
                    Welcome to Swapify, a campus marketplace platform that connects students to buy, sell, and exchange
                    goods and services. These Terms of Service ("Terms") govern your access to and use of the Swapify
                    website, mobile application, and services (collectively, the "Service").
                  </p>
                  <p>
                    By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any
                    part of the Terms, you may not access the Service. Your use of the Service is also subject to our
                    Privacy Policy and Refund Policy.
                  </p>
                  <p>
                    Swapify is designed specifically for campus communities. By using our Service, you acknowledge that
                    you are a current student, faculty member, or staff of an educational institution, or otherwise
                    authorized to use the Service.
                  </p>
                </div>
              </section>

              {/* Definitions */}
              <section id="definitions" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Definitions</h2>
                <div className="prose prose-primary max-w-none">
                  <ul>
                    <li>
                      <strong>"Service"</strong> refers to the Swapify website, mobile application, and all services
                      provided by Swapify.
                    </li>
                    <li>
                      <strong>"User"</strong> refers to any individual who accesses or uses the Service, including
                      buyers and sellers.
                    </li>
                    <li>
                      <strong>"Content"</strong> refers to text, images, photos, audio, video, and all other forms of
                      data or communication posted on or transmitted through the Service.
                    </li>
                    <li>
                      <strong>"User Content"</strong> refers to Content that users submit or transmit to, through, or in
                      connection with the Service.
                    </li>
                    <li>
                      <strong>"Swapify Content"</strong> refers to Content that we create and make available in
                      connection with the Service.
                    </li>
                    <li>
                      <strong>"Third Party Content"</strong> refers to Content that originates from parties other than
                      Swapify or its users, which is made available in connection with the Service.
                    </li>
                    <li>
                      <strong>"Intellectual Property Rights"</strong> refers to all patent rights, copyright rights,
                      moral rights, rights of publicity, trademark, trade dress and service mark rights, goodwill, trade
                      secret rights, and other intellectual property rights as may now exist or hereafter come into
                      existence.
                    </li>
                  </ul>
                </div>
              </section>

              {/* Account Registration & Requirements */}
              <section id="account" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Account Registration & Requirements</h2>
                <div className="prose prose-primary max-w-none">
                  <h3>3.1 Account Creation</h3>
                  <p>
                    To use certain features of the Service, you must register for an account. You must provide accurate,
                    current, and complete information during the registration process and keep your account information
                    up-to-date.
                  </p>

                  <h3>3.2 Account Eligibility</h3>
                  <p>
                    You must be at least 18 years old or the age of legal majority in your jurisdiction to create an
                    account. By creating an account, you represent and warrant that you are at least 18 years old.
                  </p>

                  <h3>3.3 Account Security</h3>
                  <p>
                    You are responsible for safeguarding your password and for all activities that occur under your
                    account. You agree to notify Swapify immediately of any unauthorized use of your account.
                  </p>

                  <h3>3.4 Educational Affiliation</h3>
                  <p>
                    Swapify is designed for campus communities. You may be required to verify your affiliation with an
                    educational institution using an educational email address or other verification methods.
                  </p>

                  <h3>3.5 One Account Per User</h3>
                  <p>
                    You may not create or use more than one account. You may not share your account with anyone else.
                  </p>
                </div>
              </section>

              {/* Marketplace Rules */}
              <section id="marketplace" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Marketplace Rules</h2>
                <div className="prose prose-primary max-w-none">
                  <h3>4.1 Listing Items</h3>
                  <p>
                    When listing items for sale, you must provide accurate, complete information about the item,
                    including its condition, any defects, and a fair price. You may only list items that you own or are
                    authorized to sell.
                  </p>

                  <h3>4.2 Prohibited Items</h3>
                  <p>
                    You may not list items that are illegal, stolen, counterfeit, infringing on intellectual property
                    rights, or otherwise prohibited by these Terms or applicable law. Swapify reserves the right to
                    remove any listing at its sole discretion.
                  </p>

                  <h3>4.3 Transactions</h3>
                  <p>
                    Swapify is a platform that facilitates transactions between buyers and sellers. Swapify is not a
                    party to any transaction between users. Users are solely responsible for the transactions they enter
                    into with other users.
                  </p>

                  <h3>4.4 Fees</h3>
                  <p>
                    Swapify may charge fees for certain features of the Service. You agree to pay all fees and charges
                    incurred in connection with your use of the Service.
                  </p>

                  <h3>4.5 Taxes</h3>
                  <p>
                    You are responsible for paying all taxes associated with your use of the Service, including any
                    taxes related to purchases or sales made through the Service.
                  </p>
                </div>
              </section>

              {/* Prohibited Activities */}
              <section id="prohibited" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Prohibited Activities</h2>
                <div className="prose prose-primary max-w-none">
                  <p>You agree not to engage in any of the following prohibited activities:</p>
                  <ul>
                    <li>
                      Using the Service for any illegal purpose or in violation of any local, state, national, or
                      international law
                    </li>
                    <li>Harassing, threatening, stalking, or abusing other users</li>
                    <li>Impersonating another person or entity</li>
                    <li>Interfering with or disrupting the Service or servers or networks connected to the Service</li>
                    <li>Attempting to gain unauthorized access to the Service or other users' accounts</li>
                    <li>
                      Using the Service to transmit any viruses, worms, defects, Trojan horses, or other items of a
                      destructive nature
                    </li>
                    <li>Using automated scripts to collect information from or otherwise interact with the Service</li>
                    <li>Creating multiple accounts</li>
                    <li>Selling or transferring your account</li>
                    <li>Using the Service to spam, phish, or scam other users</li>
                    <li>Using the Service to distribute unsolicited commercial messages</li>
                  </ul>
                </div>
              </section>

              {/* User Content */}
              <section id="content" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">6. User Content</h2>
                <div className="prose prose-primary max-w-none">
                  <h3>6.1 Responsibility for Content</h3>
                  <p>
                    You are solely responsible for the Content that you post on or through the Service. You represent
                    and warrant that: (i) you own the Content posted by you or otherwise have the right to grant the
                    rights and licenses set forth in these Terms; and (ii) your Content does not violate the privacy
                    rights, publicity rights, copyright rights, or other rights of any person.
                  </p>

                  <h3>6.2 Content License</h3>
                  <p>
                    By posting Content on or through the Service, you grant Swapify a worldwide, non-exclusive,
                    royalty-free license to use, copy, modify, adapt, distribute, translate, create derivative works
                    from, publicly display, and publicly perform such Content for the purpose of providing the Service.
                  </p>

                  <h3>6.3 Content Removal</h3>
                  <p>
                    Swapify reserves the right, but not the obligation, to remove any Content from the Service at any
                    time and for any reason, without notice to you.
                  </p>
                </div>
              </section>

              {/* Intellectual Property */}
              <section id="intellectual" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Intellectual Property</h2>
                <div className="prose prose-primary max-w-none">
                  <h3>7.1 Swapify Content</h3>
                  <p>
                    The Service and its original content (excluding User Content), features, and functionality are and
                    will remain the exclusive property of Swapify and its licensors. The Service is protected by
                    copyright, trademark, and other laws of both the United States and foreign countries.
                  </p>

                  <h3>7.2 Trademarks</h3>
                  <p>
                    The Swapify name and logo are trademarks of Swapify. You may not use these trademarks without the
                    prior written consent of Swapify.
                  </p>

                  <h3>7.3 Copyright Policy</h3>
                  <p>
                    Swapify respects the intellectual property rights of others and expects users of the Service to do
                    the same. Swapify will respond to notices of alleged copyright infringement that comply with
                    applicable law.
                  </p>
                </div>
              </section>

              {/* Limitation of Liability */}
              <section id="liability" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Limitation of Liability</h2>
                <div className="prose prose-primary max-w-none">
                  <p>
                    TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL SWAPIFY, ITS AFFILIATES,
                    OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL,
                    CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS,
                    GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO THE USE OF, OR
                    INABILITY TO USE, THE SERVICE.
                  </p>
                  <p>
                    TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, SWAPIFY ASSUMES NO LIABILITY OR RESPONSIBILITY
                    FOR ANY: (I) ERRORS, MISTAKES, OR INACCURACIES OF CONTENT; (II) PERSONAL INJURY OR PROPERTY DAMAGE,
                    OF ANY NATURE WHATSOEVER, RESULTING FROM YOUR ACCESS TO OR USE OF THE SERVICE; (III) UNAUTHORIZED
                    ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY PERSONAL INFORMATION STORED THEREIN; (IV)
                    INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM THE SERVICE; (V) BUGS, VIRUSES, TROJAN HORSES,
                    OR THE LIKE THAT MAY BE TRANSMITTED TO OR THROUGH THE SERVICE BY ANY THIRD PARTY; (VI) ERRORS OR
                    OMISSIONS IN ANY CONTENT OR FOR ANY LOSS OR DAMAGE INCURRED AS A RESULT OF THE USE OF ANY CONTENT
                    POSTED, EMAILED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE THROUGH THE SERVICE; AND/OR (VII) USER
                    CONTENT OR THE DEFAMATORY, OFFENSIVE, OR ILLEGAL CONDUCT OF ANY THIRD PARTY.
                  </p>
                </div>
              </section>

              {/* Disputes & Governing Law */}
              <section id="disputes" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Disputes & Governing Law</h2>
                <div className="prose prose-primary max-w-none">
                  <h3>9.1 Governing Law</h3>
                  <p>
                    These Terms shall be governed by the laws of the State of [State], without respect to its conflict
                    of laws principles.
                  </p>

                  <h3>9.2 Dispute Resolution</h3>
                  <p>
                    Any dispute arising from or relating to the subject matter of these Terms shall be finally settled
                    by arbitration in [City, State], using the English language in accordance with the Arbitration Rules
                    and Procedures of JAMS then in effect, by one commercial arbitrator with substantial experience in
                    resolving intellectual property and commercial contract disputes.
                  </p>

                  <h3>9.3 Class Action Waiver</h3>
                  <p>
                    YOU AND SWAPIFY AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL
                    CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE
                    PROCEEDING.
                  </p>
                </div>
              </section>

              {/* Termination */}
              <section id="termination" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Termination</h2>
                <div className="prose prose-primary max-w-none">
                  <p>
                    We may terminate or suspend your account and bar access to the Service immediately, without prior
                    notice or liability, under our sole discretion, for any reason whatsoever and without limitation,
                    including but not limited to a breach of the Terms.
                  </p>
                  <p>
                    If you wish to terminate your account, you may simply discontinue using the Service or contact us to
                    request account deletion.
                  </p>
                  <p>
                    All provisions of the Terms which by their nature should survive termination shall survive
                    termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity,
                    and limitations of liability.
                  </p>
                </div>
              </section>

              {/* Changes to Terms */}
              <section id="changes" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Changes to Terms</h2>
                <div className="prose prose-primary max-w-none">
                  <p>
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a
                    revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
                    What constitutes a material change will be determined at our sole discretion.
                  </p>
                  <p>
                    By continuing to access or use our Service after any revisions become effective, you agree to be
                    bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to
                    use the Service.
                  </p>
                </div>
              </section>

              {/* Contact Information */}
              <section id="contact" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">12. Contact Information</h2>
                <div className="prose prose-primary max-w-none">
                  <p>If you have any questions about these Terms, please contact us at:</p>
                  <p>
                    <strong>Email:</strong> legal@swapify.com
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
          className="fixed bottom-8 right-8 bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label="Scroll to top"
        >
          <FaArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}

export default TermsOfService

