import Link from 'next/link';

export default function LearnPage() {
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
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Learn</h1>
          <p className="text-lg text-gray-600">Learning paths and study buddy for daily use</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Learning Paths</h3>
            <p className="text-gray-600 mb-4">Beginner • Intermediate • Advanced</p>
            <button className="btn-primary">Browse Paths</button>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Study Buddy</h3>
            <p className="text-gray-600 mb-4">Diary/journal with stats</p>
            <button className="btn-secondary">View Journal</button>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Videos + Questions</h3>
            <p className="text-gray-600 mb-4">Interactive learning content</p>
            <button className="btn-secondary">Start Learning</button>
          </div>
        </div>
      </div>
    </div>
  );
}