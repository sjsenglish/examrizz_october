import Link from 'next/link';

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            ← Back to Hub
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Search</h1>
          <p className="text-lg text-gray-600">Searchable question library powered by Algolia</p>
        </div>
        
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search questions, topics, subjects..."
              className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Recent Searches</h3>
            <p className="text-gray-600">Your search history</p>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Popular Topics</h3>
            <p className="text-gray-600">Trending questions</p>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Saved Questions</h3>
            <p className="text-gray-600">Your bookmarked content</p>
          </div>
        </div>
      </div>
    </div>
  );
}