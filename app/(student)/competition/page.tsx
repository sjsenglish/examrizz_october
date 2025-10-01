import Link from 'next/link';

export default function CompetitionPage() {
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
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Arena</h1>
          <p className="text-lg text-gray-600">Competition and battles - weekly or when pinged</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Competition Announcements</h3>
            <p className="text-gray-600 mb-4">Visual callouts for upcoming competitions</p>
            <button className="btn-primary">Join Discord</button>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Battles</h3>
            <p className="text-gray-600 mb-4">Challenge other learners</p>
            <button className="btn-secondary">View Battles</button>
          </div>
        </div>
      </div>
    </div>
  );
}