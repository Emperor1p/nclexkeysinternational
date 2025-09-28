export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About <span className="text-blue-600">NCLEX Keys International</span>
            </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your dedicated partner in achieving NCLEX success through personalized learning, 
              expert guidance, and proven strategies.
            </p>
        </div>

        {/* Meet Our Tutor Section */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              Meet Our Tutor
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Image */}
              <div className="flex justify-center">
                <div className="relative">
                  <img
                    src="/images/tutor/lawal-boluwatife-joseph.jpg"
                    alt="Lawal Boluwatife Joseph - NCLEX Tutor"
                    className="w-80 h-80 object-cover rounded-2xl shadow-2xl"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold">
                    Tife Pixels
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    Lawal Boluwatife Joseph
                  </h3>
                  <p className="text-lg text-blue-600 font-semibold mb-4">
                    Registered Nurse (NGN RN, U.S. RN) | NCLEX Expert | Career Coach
                  </p>
                </div>

                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    Meet Lawal Boluwatife Joseph, a compassionate, versatile, dynamic, and results-driven 
                    Registered Nurse (NGN RN, U.S. RN) with a strong foundation in nursing careers.
                  </p>
                  
                  <p>
                    Beyond clinical expertise, I serve as a mentor, career coach, and relocation consultant, 
                    helping nurses excel in NCLEX preparation, achieve career growth, and navigate international 
                    transitions with confidence.
                  </p>
                  
                  <p>
                    Passionate about raising global nursing standards, I combine clinical knowledge, leadership, 
                    and coaching skills to empower nurses at every stage of their journey.
                  </p>
                  
                  <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
                    <p className="text-gray-800 font-medium">
                      <strong>My Mission:</strong> To inspire, guide, and support the next generation of 
                      healthcare professionals to thrive in diverse practice environments worldwide and also 
                      build men who transform nations and territories.
                    </p>
                  </div>
                </div>

                {/* Key Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">NCLEX Preparation Expert</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">Career Growth Coach</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">International Relocation Consultant</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">Mentor & Leadership Development</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Board of Directors Section */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              Board of Directors
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Board Member 1 - Lawal Boluwatife Joseph */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img
                    src="/User1.jpg"
                    alt="Lawal Boluwatife Joseph - Board Member"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Chairman
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Lawal Boluwatife Joseph
                  </h3>
                  <p className="text-blue-600 font-semibold mb-3">
                    Registered Nurse (NGN RN, U.S. RN) | NCLEX Expert
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    A compassionate, versatile, dynamic, and results-driven Registered Nurse with a strong foundation in nursing careers. 
                    Serves as a mentor, career coach, and relocation consultant, helping nurses excel in NCLEX preparation and achieve career growth.
                  </p>
                </div>
              </div>

              {/* Board Member 2 - Rita Okoro */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img
                    src="/user2.jpg"
                    alt="Rita Okoro - Board Member"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Director
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Rita Okoro
                  </h3>
                  <p className="text-green-600 font-semibold mb-3">
                    USRN, RN, RM, BNSc. | Coach & Educator
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Boasts over nine years of professional experience in nursing practice and education. At the Academy, she serves as a coach and educator, playing a pivotal role in developing high quality learning materials that have significantly enhanced students' learning experiences both online and in the classroom. Her teaching philosophy is guided by a learner centred approach, combining professional expertise with practical application, empowering students to build confidence and achieve mastery as they prepare for their licensure examinations.
                  </p>
                </div>
              </div>

              {/* Board Member 3 - Oladimeji Ajayi */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img
                    src="/user3.jpg"
                    alt="Oladimeji Ajayi - Board Member"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Director
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Oladimeji Ajayi
                  </h3>
                  <p className="text-purple-600 font-semibold mb-3">
                    ND, BSc, MSc, NLA, AERM, PM, HRM | HR/Admin Manager
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    A seasoned Human Resources Manager excelling in strategy, business development, team management, content development, and project management. Currently serves as HR/Admin at NCLEX Keys, leveraging his expertise to drive organizational success. Additionally works as a Management Services Manager at Paul Esther Consulting, overseeing office operations and conducting training sessions in leadership, management, and communication. He's a certified Project Manager and Enterprise Risk Management Specialist, known for meticulous planning, diligent work ethic, and effective teamwork.
                  </p>
                </div>
              </div>

              {/* Board Member 4 - Placeholder */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img
                    src="/images/board/board-member-4.jpg"
                    alt="Board Member 4"
                    className="w-full h-64 object-cover bg-gray-200"
                  />
                  <div className="absolute top-4 right-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Director
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Board Member 4
                  </h3>
                  <p className="text-orange-600 font-semibold mb-3">
                    Position Title
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Brief description of the board member's background, expertise, and contribution to the organization.
                  </p>
                </div>
              </div>

              {/* Board Member 5 - Placeholder */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img
                    src="/images/board/board-member-5.jpg"
                    alt="Board Member 5"
                    className="w-full h-64 object-cover bg-gray-200"
                  />
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Director
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Board Member 5
                  </h3>
                  <p className="text-red-600 font-semibold mb-3">
                    Position Title
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Brief description of the board member's background, expertise, and contribution to the organization.
                  </p>
                </div>
              </div>

              {/* Board Member 6 - Placeholder */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img
                    src="/images/board/board-member-6.jpg"
                    alt="Board Member 6"
                    className="w-full h-64 object-cover bg-gray-200"
                  />
                  <div className="absolute top-4 right-4 bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Director
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Board Member 6
                  </h3>
                  <p className="text-teal-600 font-semibold mb-3">
                    Position Title
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Brief description of the board member's background, expertise, and contribution to the organization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-16 bg-white rounded-2xl shadow-lg">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              To empower aspiring nurses with the knowledge, confidence, and skills needed to pass the NCLEX 
              examination and embark on successful nursing careers. We believe that every student deserves 
              personalized attention and the highest quality education to achieve their dreams.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
