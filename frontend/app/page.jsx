export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            NCLEX Keys International
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Professional NCLEX preparation courses designed to help you pass your exam with confidence.
            <br />
            <span className="text-sm text-blue-600 font-semibold">🚀 Automatic deployment is now active!</span>
            <br />
            <span className="text-sm text-green-600 font-semibold">🔗 Frontend connected to live backend!</span>
          </p>
          <div className="space-x-4">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Get Started
            </button>
            <button className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
