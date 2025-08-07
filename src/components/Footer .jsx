import { useState } from 'react';
import { Link } from 'react-router-dom';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const footerData = [
  {
    title: 'Resources',
    content: [
      'Find A Store',
      'Become A Member',
      'Running Shoe Finder',
      'Product Advice',
      'Education Discounts',
      'Send Us Feedback',
    ],
  },
  {
    title: 'Help',
    content: [
      'Get Help',
      'Order Status',
      'Delivery',
      'Returns',
      'Payment Options',
      'Contact Us',
    ],
  },
  {
    title: 'Company',
    content: [
      'About Nike',
      'News',
      'Careers',
      'Investors',
      'Sustainability',
      'Impact',
      'Report a Concern',
    ],
  },
  { title: '', content: [] },
  { title: '', content: [] },
  {
    title: '',
    content: [
      <div className="flex items-center space-x-2" key="singapore">
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 24 24"
          role="img"
          width="24px"
          height="24px"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          className="text-[#707072]"
        >
          <path d="M21.75 12A9.75 9.75 0 0112 21.75M21.75 12A9.75 9.75 0 0012 2.25M21.75 12c0 2.071-4.365 3.75-9.75 3.75S2.25 14.071 2.25 12m19.5 0c0-2.071-4.365-3.75-9.75-3.75S2.25 9.929 2.25 12M12 21.75A9.75 9.75 0 012.25 12M12 21.75c2.9 0 5.25-4.365 5.25-9.75S14.9 2.25 12 2.25m0 19.5c-2.9 0-5.25-4.365-5.25-9.75S9.1 2.25 12 2.25M2.25 12A9.75 9.75 0 0112 2.25" />
        </svg>
        <span>Singapore</span>
      </div>,
    ],
  },
];

const Footer = () => {
  // First column open state (true initially)
  const [isFirstOpen, setIsFirstOpen] = useState(true);
  // Only one other column open at a time (null = none)
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    if (index === 0) {
      setIsFirstOpen((prev) => !prev);
    } else {
      setOpenIndex((prev) => (prev === index ? null : index));
    }
  };

  return (
    <footer
      className="bg-white text-sm px-4 md:px-16 py-8 font-nike mt-5"
      style={{ fontFamily: "'Helvetica Now Text Medium', Helvetica, Arial, sans-serif" }}
    >
      <hr className="mb-16" />

      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 border-b border-gray-300 pb-6">
        {footerData.map((col, idx) => (
          <div key={idx}>
            {/* Desktop */}
            <div className="hidden md:block">
              {col.title && (
                <h3 className="text-[#111111] mb-2 md:mb-10">
                  <Link to="/products" className="hover:underline ">
                    {col.title}
                  </Link>
                </h3>
              )}
              <ul className="text-[#707072] space-y-4">
                {col.content.map((item, i) => (
                  <li key={i}>
                    <Link to="/products" className="hover:underline text-[#707072]">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mobile Accordion */}
            <div className="md:hidden">
              {col.title && (
                <>
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full flex justify-between items-center text-[#111111] py-2 font-medium"
                    aria-expanded={idx === 0 ? isFirstOpen : openIndex === idx}
                    aria-controls={`footer-accordion-panel-${idx}`}
                  >
                    <Link to="/products" className="hover:underline">
                      {col.title}
                    </Link>
                    <FontAwesomeIcon
                      icon={
                        idx === 0
                          ? isFirstOpen
                            ? faChevronUp
                            : faChevronDown
                          : openIndex === idx
                          ? faChevronUp
                          : faChevronDown
                      }
                      className="ml-2"
                    />
                  </button>
                  {(idx === 0 ? isFirstOpen : openIndex === idx) && (
                    <ul
                      id={`footer-accordion-panel-${idx}`}
                      className="text-[#707072] pl-4 space-y-4 !my-6"
                    >
                      {col.content.map((item, i) => (
                        <li key={i}>
                          <Link to="/products" className="hover:underline text-[#707072]">
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Row 2 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-6 space-y-4 md:space-y-0 text-[#707072] text-xs">
        <div>© 2025 PeachCherryTechnology, Inc. All rights reserved</div>
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-1 md:space-y-0">
          {[
            'Guides',
            'Terms of Sale',
            'Terms of Use',
            'Nike Privacy Policy',
            'Privacy Settings',
          ].map((label, i) => (
            <Link
              key={i}
              to="/products"
              className="hover:underline cursor-pointer"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
