import Link from 'next/link';

export default function PracticePage() {
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
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Practice Hub</h1>
          <p className="text-lg text-gray-600">Weekly revision with practice packs</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Practice Packs</h3>
            <p className="text-gray-600 mb-4">Auto-adds stats to study buddy journal</p>
            <button className="btn-primary">Start Practice</button>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Pack Maker</h3>
            <p className="text-gray-600 mb-4">Create custom practice sets</p>
            <button className="btn-secondary">Create Pack</button>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Discord Community</h3>
            <p className="text-gray-600 mb-4">Connect with fellow learners</p>
            <button className="btn-secondary">Join Discord</button>
          </div>
        </div>
      </div>
    </div>
  );
}