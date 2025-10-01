import Link from 'next/link';

export default function VideoPage() {
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
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Video</h1>
          <p className="text-lg text-gray-600">Video zone for on-demand topic study</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Topic Videos</h3>
            <p className="text-gray-600 mb-4">Comprehensive video library</p>
            <button className="btn-primary">Browse Videos</button>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Revision Sessions</h3>
            <p className="text-gray-600 mb-4">Quick review videos</p>
            <button className="btn-secondary">Start Revision</button>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Interactive Content</h3>
            <p className="text-gray-600 mb-4">Videos with embedded questions</p>
            <button className="btn-secondary">Explore</button>
          </div>
        </div>
      </div>
    </div>
  );
}