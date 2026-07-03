import React from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full border-t border-premium bg-gray-50/50 dark:bg-gray-950/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12">
          {/* Logo and Description */}
          <div className="md:col-span-2 space-y-5">
            <img
              src={assets.logo}
              className="w-28 filter dark:brightness-110 dark:contrast-125 transition-transform duration-300"
              alt="ZenTra logo"
            />
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm leading-relaxed">
              Thoughtfully designed clothing that blends premium comfort, durable quality, and modern minimalist styles for everyday refined wear.
            </p>
          </div>

          {/* Company links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              Company
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/collection" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition duration-200">
                  Collection
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition duration-200">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              Get in Touch
            </h3>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+919528865099" className="hover:text-black dark:hover:text-white transition">+91 9528865099</a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:contact@zentra.com" className="break-all hover:text-black dark:hover:text-white transition">contact@zentra.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-premium flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} ZenTra. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-gray-400 dark:text-gray-500">
            <a href="#" className="hover:text-black dark:hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
