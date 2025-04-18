import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronRight, FaArrowUp, FaExchangeAlt } from "react-icons/fa";

const RefundPolicy = () => {
  const [activeSection, setActiveSection] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Check scroll position to show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
      
      // Update active section based on scroll position
      const sections = document.querySelectorAll("section[id]");
      const scrollPosition = window.scrollY + 100;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute("id");

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          setActiveSection(sectionId);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Scroll to section function
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: "smooth",
      });
      setActiveSection(sectionId);
    }
  };

  // Last updated date
  const lastUpdated = "April 6, 2024";

  // Table of contents sections
  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "eligibility", title: "Refund Eligibility" },
    { id: "process", title: "Refund Process" },
    { id: "timeframes", title: "Refund Timeframes" },
    { id: "exceptions", title: "Exceptions" },
    { id: "returns", title: "Returns & Exchanges" },
    { id: "cancellations", title: "Order Cancellations" },
    { id: "disputes", title: "Disputes & Resolution" },
    { id: "contact", title: "Contact Information" },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <FaExchangeAlt className="h-12 w-12 text-white opacity-90" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Refund Policy</h1>
            <p className="text-lg opacity-90">
              Our commitment to fair and transparent refunds
            </p>
            <p className="mt-4 text-sm opacity-80">
              Last Updated: {lastUpdated}
            </p>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <nav className="flex text-sm">
            <Link to="/" className="text-gray-500 hover:text-green-600 transition-colors">
              Home
            </Link>
            <FaChevronRight className="mx-2 mt-1 text-gray-400" />
            <span className="text-gray-700 font-medium">Refund Policy</span>
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
                            ? "bg-green-50 text-green-700 font-medium"
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
                <div className="prose prose-green max-w-none">
                  <p>
                    At Swapify, we strive to ensure that all transactions on our platform are fair and satisfactory for both buyers and sellers. This Refund Policy outlines the conditions under which refunds may be requested and processed on our platform.
                  </p>
                  <p>
                    As a marketplace connecting campus community members, we aim to facilitate smooth transactions while providing appropriate protections for all users. This policy applies to all purchases made through the Swapify platform.
                  </p>
                  <p>
                    Please note that Swapify serves as a platform connecting buyers and sellers, and is not directly involved in the exchange of goods or services between users. However, we have established this Refund Policy to help resolve issues that may arise during transactions.
                  </p>
                </div>
              </section>

              {/* Refund Eligibility */}
              <section id="eligibility" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Refund Eligibility</h2>
                <div className="prose prose-green max-w-none">
                  <p>
                    Refunds may be eligible under the following circumstances:
                  </p>
                  
                  <h3>2.1 Item Not Received</h3>
                  <p>
                    If you have not received your item within the agreed-upon timeframe, you may be eligible for a refund. Before requesting a refund, we encourage you to contact the seller to resolve the issue.
                  </p>
                  
                  <h3>2.2 Item Not as Described</h3>
                  <p>
                    If the item you received is significantly different from what was described in the listing (e.g., different condition, wrong item, missing parts), you may be eligible for a refund. You must provide evidence of the discrepancy.
                  </p>
                  
                  <h3>2.3 Damaged Items</h3>
                  <p>
                    If an item arrives damaged, you may be eligible for a refund. You must provide photographic evidence of the damage within 48 hours of receiving the item.
                  </p>
                  
                  <h3>2.4 Seller Agreement</h3>
                  <p>
                    If the seller agrees to accept a return and issue a refund, you will be eligible for a refund according to the terms agreed upon with the seller.
                  </p>
                  
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                    <p className="text-yellow-700">
                      <strong>Important:</strong> All refund requests must be submitted within 7 days of receiving the item or within 14 days of the expected delivery date if the item was not received.
                    </p>
                  </div>
                </div>
              </section>

              {/* Refund Process */}
              <section id="process" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Refund Process</h2>
                <div className="prose prose-green max-w-none">
                  <p>
                    To request a refund, please follow these steps:
                  </p>
                  
                  <ol>
                    <li>
                      <strong>Contact the Seller:</strong> First, try to resolve the issue directly with the seller through our messaging system. Many issues can be resolved through direct communication.
                    </li>
                    <li>
                      <strong>Submit a Refund Request:</strong> If you cannot resolve the issue with the seller, submit a refund request through your account dashboard under "Orders" {">"} "Order Details" {">"} "Request Refund."
                    </li>
                    <li>
                      <strong>Provide Information:</strong> Include detailed information about why you're requesting a refund and provide any relevant evidence (photos, screenshots of conversations, etc.).
                    </li>
                    <li>
                      <strong>Return the Item (if applicable):</strong> In some cases, you may need to return the item to the seller before a refund can be processed. If this is required, you will receive instructions on how to proceed.
                    </li>
                    <li>
                      <strong>Await Decision:</strong> Swapify will review your request and make a decision based on the evidence provided by both parties.
                    </li>
                  </ol>
                  
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 my-4">
                    <p className="text-green-700">
                      <strong>Tip:</strong> Keep all communication within the Swapify platform to ensure there is a record of all interactions between you and the seller.
                    </p>
                  </div>
                </div>
              </section>

              {/* Refund Timeframes */}
              <section id="timeframes" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Refund Timeframes</h2>
                <div className="prose prose-green max-w-none">
                  <p>
                    The refund process typically follows these timeframes:
                  </p>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 text-left">Stage</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Timeframe</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">Review of Refund Request</td>
                          <td className="border border-gray-300 px-4 py-2">1-3 business days</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">Seller Response Period</td>
                          <td className="border border-gray-300 px-4 py-2">2 business days</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">Return Shipping (if required)</td>
                          <td className="border border-gray-300 px-4 py-2">Varies by location</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">Processing Refund After Approval</td>
                          <td className="border border-gray-300 px-4 py-2">3-5 business days</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">Funds Appearing in Your Account</td>
                          <td className="border border-gray-300 px-4 py-2">1-5 business days (depends on payment method)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <p className="mt-4">
                    Please note that these timeframes are estimates and may vary depending on the specific circumstances of each case.
                  </p>
                </div>
              </section>

              {/* Exceptions */}
              <section id="exceptions" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Exceptions</h2>
                <div className="prose prose-green max-w-none">
                  <p>
                    Refunds may not be available in the following situations:
                  </p>
                  
                  <ul>
                    <li>
                      <strong>Buyer's Remorse:</strong> Simply changing your mind about a purchase is not grounds for a refund unless the seller agrees to accept a return.
                    </li>
                    <li>
                      <strong>Misuse of Item:</strong> Damage caused by the buyer after receiving the item is not eligible for a refund.
                    </li>
                    <li>
                      <strong>Inaccurate Expectations:</strong> Minor differences between the listing description and the actual item that do not affect functionality or value may not qualify for a refund.
                    </li>
                    <li>
                      <strong>Late Refund Requests:</strong> Requests submitted after the 7-day period (or 14-day period for non-delivered items) may not be considered.
                    </li>
                    <li>
                      <strong>Off-Platform Transactions:</strong> Any transactions conducted outside of the Swapify platform are not covered by our Refund Policy.
                    </li>
                    <li>
                      <strong>Digital Goods:</strong> Due to their nature, digital goods may have different refund terms, which will be specified in the listing.
                    </li>
                  </ul>
                  
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
                    <p className="text-red-700">
                      <strong>Warning:</strong> Attempting to abuse the refund system may result in account suspension or termination.
                    </p>
                  </div>
                </div>
              </section>

              {/* Returns & Exchanges */}
              <section id="returns" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Returns & Exchanges</h2>
                <div className="prose prose-green max-w-none">
                  <h3>6.1 Return Process</h3>
                  <p>
                    If a return is required as part of the refund process:
                  </p>
                  <ol>
                    <li>Wait for return instructions before sending anything back.</li>
                    <li>Package the item securely in its original packaging if possible.</li>
                    <li>Include all original components, accessories, tags, and documentation.</li>
                    <li>Use a trackable shipping method and keep the tracking information.</li>
                    <li>Return the item within 5 business days of receiving return approval.</li>
                  </ol>
                  
                  <h3>6.2 Return Shipping Costs</h3>
                  <p>
                    Return shipping costs are typically the responsibility of:
                  </p>
                  <ul>
                    <li>The buyer if the return is due to buyer's remorse or a change of mind.</li>
                    <li>The seller if the item was misrepresented, damaged, or defective.</li>
                  </ul>
                  
                  <h3>6.3 Exchanges</h3>
                  <p>
                    Swapify does not directly handle exchanges. If you wish to exchange an item:
                  </p>
                  <ol>
                    <li>Request a refund for the original item.</li>
                    <li>Once approved, purchase the desired replacement item separately.</li>
                  </ol>
                  <p>
                    Alternatively, you may arrange an exchange directly with the seller through our messaging system, but both parties must agree to the terms.
                  </p>
                </div>
              </section>

              {/* Order Cancellations */}
              <section id="cancellations" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Order Cancellations</h2>
                <div className="prose prose-green max-w-none">
                  <h3>7.1 Buyer Cancellations</h3>
                  <p>
                    As a buyer, you may cancel an order under the following conditions:
                  </p>
                  <ul>
                    <li>The order has not yet been accepted by the seller.</li>
                    <li>The seller has not shipped the item yet.</li>
                    <li>The seller agrees to the cancellation.</li>
                  </ul>
                  <p>
                    To cancel an order, go to "Orders" in your account dashboard, select the order, and click "Request Cancellation."
                  </p>
                  
                  <h3>7.2 Seller Cancellations</h3>
                  <p>
                    Sellers may cancel orders if:
                  </p>
                  <ul>
                    <li>The item is no longer available.</li>
                    <li>There was an error in the listing (e.g., price, description).</li>
                    <li>The buyer requests changes that cannot be accommodated.</li>
                    <li>The seller suspects fraudulent activity.</li>
                  </ul>
                  <p>
                    Excessive cancellations by sellers may affect their seller rating and status on the platform.
                  </p>
                  
                  <h3>7.3 Automatic Cancellations</h3>
                  <p>
                    Orders may be automatically cancelled if:
                  </p>
                  <ul>
                    <li>Payment is not completed within 24 hours of placing the order.</li>
                    <li>The seller does not accept the order within 48 hours.</li>
                    <li>The seller does not ship the item within the agreed timeframe.</li>
                  </ul>
                </div>
              </section>

              {/* Disputes & Resolution */}
              <section id="disputes" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Disputes & Resolution</h2>
                <div className="prose prose-green max-w-none">
                  <h3>8.1 Dispute Process</h3>
                  <p>
                    If you and the other party cannot agree on a resolution:
                  </p>
                  <ol>
                    <li>Either party can escalate the issue to Swapify Support by clicking "Escalate to Support" in the order details.</li>
                    <li>Both parties will be asked to provide evidence and statements regarding the dispute.</li>
                    <li>Swapify will review all information and make a decision based on our policies and the evidence provided.</li>
                    <li>The decision will be communicated to both parties, and appropriate actions will be taken.</li>
                  </ol>
                  
                  <h3>8.2 Mediation</h3>
                  <p>
                    In complex cases, Swapify may offer mediation services to help both parties reach a mutually acceptable resolution. This is offered at our discretion and is typically reserved for high-value transactions.
                  </p>
                  
                  <h3>8.3 Final Decisions</h3>
                  <p>
                    Swapify reserves the right to make final decisions on all disputes. These decisions are based on:
                  </p>
                  <ul>
                    <li>Platform policies and terms of service</li>
                    <li>Evidence provided by both parties</li>
                    <li>Transaction history and account standing of both parties</li>
                    <li>Industry standards and best practices</li>
                  </ul>
                  <p>
                    While we strive to be fair to all parties, our primary goal is to maintain the integrity and trust of our marketplace.
                  </p>
                </div>
              </section>

              {/* Contact Information */}
              <section id="contact" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Contact Information</h2>
                <div className="prose prose-green max-w-none">
                  <p>
                    If you have any questions about our Refund Policy, please contact us:
                  </p>
                  
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 my-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Customer Support</h3>
                        <p className="mt-2">
                          <strong>Email:</strong> support@swapify.com<br />
                          <strong>Phone:</strong> (555) 123-4567<br />
                          <strong>Hours:</strong> Monday-Friday, 9am-5pm EST
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Refund Department</h3>
                        <p className="mt-2">
                          <strong>Email:</strong> refunds@swapify.com<br />
                          <strong>Response Time:</strong> Within 1-2 business days<br />
                          <strong>Online Form:</strong> <Link to="/contact" className="text-green-600 hover:text-green-800">Contact Form</Link>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <h3>Frequently Asked Questions</h3>
                  <p>
                    Before contacting us, you may find answers to common questions in our <Link to="/help/faq" className="text-green-600 hover:text-green-800">FAQ section</Link> or <Link to="/help" className="text-green-600 hover:text-green-800">Help Center</Link>.
                  </p>
                </div>
              </section>

              {/* Policy Updates */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Policy Updates</h2>
                <div className="prose prose-green max-w-none">
                  <p>
                    This Refund Policy may be updated from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will notify users of any significant changes through:
                  </p>
                  <ul>
                    <li>Email notifications to registered users</li>
                    <li>Notices on our website</li>
                    <li>Updates to the "Last Updated" date at the top of this policy</li>
                  </ul>
                  <p>
                    We encourage you to review this policy periodically to stay informed about our refund practices.
                  </p>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
                    <p className="text-blue-700">
                      <strong>Note:</strong> The terms of the Refund Policy in effect at the time of your purchase will apply to that transaction.
                    </p>
                  </div>
                </div>
              </section>

              {/* Print and Share */}
              <div className="flex flex-wrap justify-between items-center border-t border-gray-200 pt-6 mt-10">
                <div className="flex space-x-4 mb-4 sm:mb-0">
                  <button 
                    onClick={() => window.print()} 
                    className="flex items-center text-sm text-gray-600 hover:text-green-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print this policy
                  </button>
                  <button 
                    onClick={() => navigator.clipboard.writeText(window.location.href)}
                    className="flex items-center text-sm text-gray-600 hover:text-green-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy link
                  </button>
                </div>
                <div>
                  <Link 
                    to="/help" 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Visit Help Center
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-2 rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-opacity"
          aria-label="Scroll to top"
        >
          <FaArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default RefundPolicy;