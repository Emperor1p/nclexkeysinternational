import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter, Stethoscope } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <Link href="#" className="flex items-center gap-2 text-2xl font-bold text-white">
            <Stethoscope className="h-8 w-8 text-white" /> {/* Changed icon to Stethoscope */}
            NCLEX KEYS {/* Changed text to NCLEX KEYS */}
          </Link>
          <p className="text-sm leading-relaxed">
            Your trusted partner for NCLEX success. Providing expert tutoring and comprehensive resources.
          </p>
          <div className="flex gap-4">
            <a href="https://www.facebook.com/share/1FJJwajxh7/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Facebook className="h-6 w-6" />
              <span className="sr-only">Facebook</span>
            </a>
            <a href="https://x.com/nclexkeys?t=4GfZzurcLrtZ0fzY4oL3AA&s=08" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Twitter className="h-6 w-6" />
              <span className="sr-only">Twitter</span>
            </a>
            <a href="https://www.linkedin.com/groups/14597271" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Linkedin className="h-6 w-6" />
              <span className="sr-only">LinkedIn</span>
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-2">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/programs" className="hover:text-white transition-colors">
                Our Courses
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-white transition-colors">
                Our Services
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-2">Support</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/faq" className="hover:text-white transition-colors">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms-of-service" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-2">Contact Us</h3>
          <p className="text-sm">
            Ikorodu, Lagos <br />
            Nigeria
          </p>
          <p className="text-sm">
            Email: <a href="mailto:nclexkeysintl.academy@gmail.com" className="text-blue-400 hover:text-blue-300 transition-colors">
              nclexkeysintl.academy@gmail.com
            </a>
          </p>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} NCLEX Keys International. All rights reserved.
      </div>
    </footer>
  )
}
