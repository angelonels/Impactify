import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-indigo-600">Impactify</div>
            <div className="flex gap-4">
              <Link href="/login" className="px-4 py-2 text-gray-700 hover:text-indigo-600 transition">
                Login
              </Link>
              <Link href="/signup" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your AI-Powered
            <span className="text-indigo-600"> Data Analyst</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform raw data into actionable insights. Ask questions in plain English,
            get instant visualizations. No SQL knowledge required.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/signup"
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 transition shadow-lg"
            >
              Get Started
            </Link>
            <Link 
              href="/upload"
              className="px-8 py-3 bg-white text-indigo-600 rounded-lg text-lg font-semibold hover:bg-gray-50 transition shadow-lg border-2 border-indigo-600"
            >
              Upload Dataset
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Automated Profiling</h3>
            <p className="text-gray-600">
              Get instant insights about your data - missing values, data types, and inconsistencies detected automatically.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-4">🧹</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Interactive Cleaning</h3>
            <p className="text-gray-600">
              Fix data issues with simple, intuitive tools. Fill missing values, merge duplicates, and correct types.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">AI Query Engine</h3>
            <p className="text-gray-600">
              Ask questions in natural language. Our AI converts them to SQL and generates beautiful visualizations.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-indigo-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to unlock insights from your data?</h2>
          <p className="text-indigo-100 mb-6 text-lg">
            Join Impactify today and start making data-driven decisions effortlessly.
          </p>
          <Link 
            href="/signup"
            className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
          >
            Start Free
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2025 Impactify. Empowering data-driven decisions.</p>
        </div>
      </footer>
    </div>
  )
}
