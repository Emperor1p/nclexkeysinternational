import { HeroSection } from "@/components/sections/hero-section"
import { OurCoursesSection } from "@/components/sections/our-courses-section"
import { OurServicesSection } from "@/components/sections/our-services-section"
import { AboutSchoolSection } from "@/components/sections/about-school-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { ContactUsSection } from "@/components/sections/contact-us-section"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <OurCoursesSection />
      <OurServicesSection />
      <AboutSchoolSection />
      <TestimonialsSection />
      <ContactUsSection />
    </div>
  )
}
