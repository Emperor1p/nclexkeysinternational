"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { 
  ClipboardCheck, 
  Languages, 
  Users, 
  BookOpen, 
  Video, 
  MessageCircle, 
  Clock, 
  Award, 
  Heart, 
  Shield, 
  Zap, 
  Target,
  CheckCircle,
  Star,
  GraduationCap,
  Brain,
  Calendar,
  Phone,
  Mail
} from "lucide-react"

export default function ServicesPage() {
  const mainServices = [
    {
      title: "NCLEX-RN Preparation",
      description: "Comprehensive preparation for the NCLEX-RN examination, covering all essential topics with expert guidance.",
      icon: ClipboardCheck,
      features: [
        "Complete NCLEX-RN curriculum coverage",
        "Practice questions with detailed explanations",
        "Live teaching sessions (9 hours/week)",
        "Personalized study plans",
        "Mock exams and assessments"
      ],
      duration: "Monthly Subscription",
      price: "From $60 USD",
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "NCLEX-PN Preparation",
      description: "Tailored study programs for the NCLEX-LPN exam, focusing on practical nursing skills and knowledge.",
      icon: ClipboardCheck,
      features: [
        "LPN-specific curriculum",
        "Practical nursing skills training",
        "Interactive learning modules",
        "Progress tracking system",
        "Expert instructor support"
      ],
      duration: "Monthly Subscription",
      price: "From $50 USD",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50"
    },
    {
      title: "IELTS Coaching",
      description: "Expert coaching for the IELTS exam, helping you achieve your desired band score for international opportunities.",
      icon: Languages,
      features: [
        "All four IELTS modules (Listening, Reading, Writing, Speaking)",
        "Practice tests and mock exams",
        "Speaking practice with native speakers",
        "Writing task feedback",
        "Band score improvement strategies"
      ],
      duration: "6-12 weeks",
      price: "From $200 USD",
      color: "from-purple-500 to-violet-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Personalized Tutoring",
      description: "One-on-one and group tutoring sessions with experienced instructors for all nursing subjects.",
      icon: Users,
      features: [
        "One-on-one mentoring",
        "Small group sessions",
        "Subject-specific tutoring",
        "Flexible scheduling",
        "Customized learning approach"
      ],
      duration: "Flexible",
      price: "From $30/hour",
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50"
    }
  ]

  const additionalServices = [
    {
      title: "Study Materials & Resources",
      description: "Access to comprehensive study materials, practice questions, and reference guides.",
      icon: BookOpen,
      features: [
        "Digital textbooks and guides",
        "Practice question banks",
        "Video lectures and tutorials",
        "Study guides and summaries",
        "Mobile app access"
      ]
    },
    {
      title: "Live Teaching Sessions",
      description: "Interactive live sessions with expert instructors covering all NCLEX topics.",
      icon: Video,
      features: [
        "9 hours of live teaching per week",
        "Interactive Q&A sessions",
        "Real-time problem solving",
        "Recorded sessions for review",
        "Expert instructor guidance"
      ]
    },
    {
      title: "WhatsApp & Telegram Groups",
      description: "Exclusive online communities for peer support and instructor guidance.",
      icon: MessageCircle,
      features: [
        "24/7 peer support",
        "Instructor availability",
        "Study group discussions",
        "Resource sharing",
        "Motivation and encouragement"
      ]
    },
    {
      title: "Progress Tracking",
      description: "Comprehensive tracking of your learning progress and performance analytics.",
      icon: Target,
      features: [
        "Performance analytics",
        "Weak area identification",
        "Improvement recommendations",
        "Study time tracking",
        "Goal setting and monitoring"
      ]
    }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "NCLEX-RN Graduate",
      content: "NCLEX Keys helped me pass my NCLEX-RN on the first try! The personalized approach and expert guidance made all the difference.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "NCLEX-PN Graduate",
      content: "The live teaching sessions and practice questions were incredibly helpful. I felt confident and prepared for my exam.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "IELTS Student",
      content: "The IELTS coaching program helped me achieve a band 8.0! The instructors were knowledgeable and supportive.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Our <span className="text-blue-600">Services</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Comprehensive NCLEX preparation and nursing education services designed to help you succeed 
              in your nursing career journey.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Award className="h-4 w-4 mr-2" />
                95% Pass Rate
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Users className="h-4 w-4 mr-2" />
                10,000+ Students
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Clock className="h-4 w-4 mr-2" />
                24/7 Support
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from our comprehensive range of NCLEX preparation and nursing education services.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {mainServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${service.color}`}></div>
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`w-16 h-16 ${service.bgColor} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <service.icon className={`h-8 w-8 text-${service.color.split('-')[1]}-600`} />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900">{service.title}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {service.duration}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {service.price}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-gray-600">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <h4 className="font-semibold text-gray-900 mb-3">What's Included:</h4>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full group-hover:bg-blue-700 transition-colors duration-300">
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Additional Support Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive support services to enhance your learning experience and ensure your success.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {additionalServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <service.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      {service.features.slice(0, 3).map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                      {service.features.length > 3 && (
                        <li className="text-blue-600 font-medium">
                          +{service.features.length - 3} more features
                        </li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Our Students Say
            </h2>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Hear from successful graduates who achieved their nursing career goals with our programs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-white mb-4 italic">"{testimonial.content}"</p>
                    <div>
                      <h4 className="font-semibold text-white">{testimonial.name}</h4>
                      <p className="text-blue-100 text-sm">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Start Your NCLEX Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of successful nursing professionals who chose NCLEX Keys for their exam preparation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8 py-3">
                View Programs
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-3">
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}