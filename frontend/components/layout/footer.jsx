"use client"

import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter, Stethoscope, Mail, MapPin, Heart } from "lucide-react"
import { motion } from "framer-motion"

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
        <div className="space-y-4">
              <motion.div
                className="flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="p-2 bg-blue-600/20 rounded-xl">
                  <Stethoscope className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  NCLEX Keys International
                </h3>
              </motion.div>
              <p className="text-gray-300 leading-relaxed">
                Empowering the next generation of healthcare professionals through world-class NCLEX preparation and mentorship.
              </p>
              <div className="flex space-x-4">
                <motion.a 
                  href="https://www.facebook.com/share/1FJJwajxh7/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-3 bg-blue-600/20 rounded-xl hover:bg-blue-600/40 transition-all duration-300 hover:scale-110"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Facebook className="h-6 w-6 text-blue-400" />
              <span className="sr-only">Facebook</span>
                </motion.a>
                <motion.a 
                  href="https://x.com/nclexkeys?t=4GfZzurcLrtZ0fzY4oL3AA&s=08" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-3 bg-sky-600/20 rounded-xl hover:bg-sky-600/40 transition-all duration-300 hover:scale-110"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Twitter className="h-6 w-6 text-sky-400" />
              <span className="sr-only">Twitter</span>
                </motion.a>
                <motion.a 
                  href="https://www.linkedin.com/groups/14597271" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-3 bg-indigo-600/20 rounded-xl hover:bg-indigo-600/40 transition-all duration-300 hover:scale-110"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Linkedin className="h-6 w-6 text-indigo-400" />
              <span className="sr-only">LinkedIn</span>
                </motion.a>
          </div>
        </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold text-white mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {[
                { href: "/about", label: "About Us" },
                { href: "/programs", label: "Our Courses" },
                { href: "/services", label: "Our Services" },
                { href: "/contact", label: "Contact" }
              ].map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link 
                    href={link.href} 
                    className="text-gray-300 hover:text-blue-400 transition-all duration-300 hover:translate-x-2 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
              </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold text-white mb-6">Support</h3>
            <ul className="space-y-4">
              {[
                { href: "/faq", label: "FAQ" },
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/terms-of-service", label: "Terms of Service" }
              ].map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link 
                    href={link.href} 
                    className="text-gray-300 hover:text-green-400 transition-all duration-300 hover:translate-x-2 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
              </Link>
                </motion.li>
              ))}
          </ul>
          </motion.div>

          {/* Contact Us */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold text-white mb-6">Contact Us</h3>
        <div className="space-y-4">
              <motion.div
                className="flex items-start space-x-3"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-300 font-medium">Location</p>
                  <p className="text-gray-400">Ikorodu, Lagos, Nigeria</p>
                </div>
              </motion.div>
              
              <motion.div
                className="flex items-start space-x-3"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-gray-300 font-medium">Email</p>
                  <a 
                    href="mailto:nclexkeysintl.academy@gmail.com" 
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    nclexkeysintl.academy@gmail.com
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div 
          className="border-t border-gray-700/50 pt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400">
                &copy; {new Date().getFullYear()} NCLEX Keys International. All rights reserved.
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Empowering healthcare professionals worldwide
              </p>
        </div>
      </div>
        </motion.div>
      </div>
    </footer>
  )
}