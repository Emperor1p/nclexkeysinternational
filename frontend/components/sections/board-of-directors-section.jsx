"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Award, GraduationCap } from "lucide-react"

// Board of Directors data - you can update this with actual board member information
const boardMembers = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    position: "Chairperson",
    title: "Chief Executive Officer",
    image: "/images/board/dr-sarah-johnson.jpg", // You'll need to add this image
    description: "Dr. Johnson brings over 20 years of experience in nursing education and healthcare leadership. She holds a PhD in Nursing Education and has been instrumental in developing innovative learning methodologies.",
    credentials: ["PhD in Nursing Education", "RN, BSN, MSN", "20+ Years Experience"],
    expertise: ["Nursing Education", "Healthcare Leadership", "Curriculum Development"]
  },
  {
    id: 2,
    name: "Prof. Michael Chen",
    position: "Vice Chairperson",
    title: "Director of Academic Affairs",
    image: "/images/board/prof-michael-chen.jpg", // You'll need to add this image
    description: "Professor Chen is a renowned nursing educator with extensive experience in NCLEX preparation. He has authored several nursing textbooks and developed comprehensive study programs.",
    credentials: ["DNP", "RN, BSN, MSN", "15+ Years Experience"],
    expertise: ["NCLEX Preparation", "Academic Research", "Student Success"]
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    position: "Board Member",
    title: "Director of Clinical Practice",
    image: "/images/board/dr-emily-rodriguez.jpg", // You'll need to add this image
    description: "Dr. Rodriguez combines clinical expertise with educational excellence. She has worked in various healthcare settings and brings real-world experience to our curriculum development.",
    credentials: ["DNP", "RN, BSN, MSN", "18+ Years Experience"],
    expertise: ["Clinical Practice", "Patient Care", "Healthcare Innovation"]
  },
  {
    id: 4,
    name: "Mr. David Thompson",
    position: "Board Member",
    title: "Director of Technology & Innovation",
    image: "/images/board/mr-david-thompson.jpg", // You'll need to add this image
    description: "Mr. Thompson leads our technology initiatives, ensuring our platform provides the most effective and user-friendly learning experience for our students.",
    credentials: ["MS in Computer Science", "MBA", "12+ Years Experience"],
    expertise: ["Educational Technology", "Platform Development", "Digital Learning"]
  },
  {
    id: 5,
    name: "Dr. Lisa Wang",
    position: "Board Member",
    title: "Director of Student Affairs",
    image: "/images/board/dr-lisa-wang.jpg", // You'll need to add this image
    description: "Dr. Wang is passionate about student success and has developed comprehensive support programs to help students achieve their NCLEX goals.",
    credentials: ["PhD in Educational Psychology", "RN, BSN", "16+ Years Experience"],
    expertise: ["Student Support", "Educational Psychology", "Success Coaching"]
  },
  {
    id: 6,
    name: "Prof. James Wilson",
    position: "Board Member",
    title: "Director of Quality Assurance",
    image: "/images/board/prof-james-wilson.jpg", // You'll need to add this image
    description: "Professor Wilson ensures the highest standards of education and maintains our commitment to excellence in nursing education and NCLEX preparation.",
    credentials: ["PhD in Nursing", "RN, BSN, MSN", "22+ Years Experience"],
    expertise: ["Quality Assurance", "Educational Standards", "Program Evaluation"]
  }
]

export function BoardOfDirectorsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Users className="h-8 w-8 text-blue-600" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Board of Directors
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Meet our distinguished board of directors who bring decades of combined experience 
            in nursing education, healthcare leadership, and student success.
          </p>
        </div>

        {/* Board Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {boardMembers.map((member) => (
            <Card key={member.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white">
              <CardContent className="p-6">
                {/* Member Image */}
                <div className="relative mb-6">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <Image
                      src={member.image}
                      alt={`${member.name} - ${member.position}`}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold" style={{display: 'none'}}>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  {/* Position Badge */}
                  <Badge className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1">
                    {member.position}
                  </Badge>
                </div>

                {/* Member Info */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-semibold mb-3">
                    {member.title}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.description}
                  </p>
                </div>

                {/* Credentials */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Credentials
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {member.credentials.map((credential, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {credential}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Expertise */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Expertise
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {member.expertise.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-blue-200 text-blue-700">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Board Statistics */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">6</h3>
              <p className="text-gray-600">Board Members</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">100+</h3>
              <p className="text-gray-600">Combined Years Experience</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <GraduationCap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">15+</h3>
              <p className="text-gray-600">Advanced Degrees</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
