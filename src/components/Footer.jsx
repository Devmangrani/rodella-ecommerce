import React from "react";
import { Link } from "react-router-dom";
import {
  FaTwitter,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaChevronRight,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/20 to-transparent"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Custom Solutions Section */}
        <div className="border-t border-gray-700/50 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Custom Solutions
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              We build custom composite solutions tailored to your specific requirements. 
              Whether it's specialized dimensions, unique material combinations, or innovative designs - we make it happen.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-500 transition-all duration-300 focus:outline-none"
            >
              <span>Get Your Custom Solution</span>
              <FaChevronRight className="ml-2 text-sm" />
            </Link>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Section */}
            <div className="space-y-4 lg:col-span-3">
             
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Email */}
                <div className="group">
                  <a
                    href="mailto:RodellaAerospace@gmail.com"
                    className="flex items-center space-x-3 p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 hover:border-gray-600 transition-all duration-300 focus:outline-none"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-red-600 rounded-md flex items-center justify-center">
                      <FaEnvelope className="text-white text-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-400 mb-1">Email</p>
                      <p className="text-sm break-all">
                        rodellaAerospace@gmail.com
                      </p>
                    </div>
                  </a>
                </div>

                {/* Phone */}
                <div className="group">
                  <a
                    href="tel:+91628163817"
                    className="flex items-center space-x-3 p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 hover:border-gray-600 transition-all duration-300 focus:outline-none"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-md flex items-center justify-center">
                      <FaPhone className="text-white text-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-400 mb-1">Phone</p>
                      <p className="text-sm">
                        (+91) 6380897553
                      </p>
                    </div>
                  </a>
                </div>

                {/* Location */}
                <div className="group">
                  <div className="flex items-center space-x-3 p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                      <FaMapMarkerAlt className="text-white text-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-400 mb-1">Location</p>
                      <p className="text-sm">
                        Bhopal, Madhya Pradesh
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>



        {/* Bottom Section */}
        <div className="border-t border-gray-700/50 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            
            {/* Copyright */}
            <div className="text-center lg:text-left space-y-2">
              <p className="text-gray-400 text-sm">
                Copyright © {currentYear} Rodella Aerospace Labs. All rights reserved.
              </p>

            </div>

            {/* Social Media */}
            <div className="flex items-center space-x-6">
              <span className="text-gray-400 text-sm font-medium hidden sm:block">Follow Us:</span>
              <div className="flex items-center space-x-4">
                <a
                  href="https://www.linkedin.com/company/roedlla-aerospace-labs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center hover:from-blue-500 hover:to-blue-600 transition-all duration-300 hover:scale-110 hover:rotate-3 focus:outline-none"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="text-white text-lg group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </a>
                <a
                  href="https://twitter.com/rodellaaero"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center hover:from-sky-400 hover:to-blue-500 transition-all duration-300 hover:scale-110 hover:-rotate-3 focus:outline-none"
                  aria-label="Twitter"
                >
                  <FaTwitter className="text-white text-lg group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
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