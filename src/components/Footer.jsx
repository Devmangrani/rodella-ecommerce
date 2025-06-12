import React from "react";
import { Link } from "react-router-dom";
import {
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  

       

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Products */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-gray-400">
              Our Products
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/Composite-tubes"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Composite Tubes
                </Link>
              </li>
              <li>
                <Link
                  to="/composite-plates"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Composite Plates
                </Link>
              </li>
              <li>
                <Link
                  to="/reinforcement"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Reinforcement Materials
                </Link>
              </li>
              <li>
                <Link
                  to="/epoxy-system"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Epoxy Systems
                </Link>
              </li>
              <li>
                <Link
                  to="/custom-solutions"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Custom Solutions
                </Link>
              </li>
            </ul>
          </div>

          {/* Materials */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-gray-400">
              Materials
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/materials/carbon-fiber"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Carbon Fiber
                </Link>
              </li>
              <li>
                <Link
                  to="/materials/fiberglass"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Fiberglass
                </Link>
              </li>
              <li>
                <Link
                  to="/materials/carbon-kevlar"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Carbon-Kevlar
                </Link>
              </li>
              <li>
                <Link
                  to="/materials/prepregs"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Prepregs
                </Link>
              </li>
              <li>
                <Link
                  to="/materials/hybrid"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Hybrid Composites
                </Link>
              </li>
            </ul>
          </div>

        

          {/* Contact Us */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-gray-400">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:info@rodella.com"
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center"
                >
                  <FaEnvelope className="mr-2 text-sm" />
                  info@rodella.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+91628163817"
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center"
                >
                  <FaPhone className="mr-2 text-sm" />
                  (+91) 628163817
                </a>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Get Quote
                </Link>
              </li>
              <li>
                <Link
                  to="/support"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Technical Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              Copyright © {currentYear} Rodella Composites. All rights reserved. Made with precision and care.
            </p>
            <div className="flex flex-wrap items-center space-x-6 text-sm">
              <div className="flex items-center space-x-4">
                <a
                  href="https://www.linkedin.com/company/rodella-composites/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <FaLinkedin className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <FaTwitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <FaInstagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <FaYoutube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 