import Link from 'next/link';

export default function TeacherPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            ← Back to Hub
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Teacher Dashboard</h1>
          <p className="text-lg text-gray-600">Class management and question pack library</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Class Lists</h3>
            <p className="text-gray-600 mb-4">Manage your students and track progress</p>
            <button className="btn-primary">View Classes</button>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Student Stats</h3>
            <p className="text-gray-600 mb-4">Performance analytics and insights</p>
            <button className="btn-secondary">View Analytics</button>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Question Library</h3>
            <p className="text-gray-600 mb-4">Access to all question packs</p>
            <button className="btn-secondary">Browse Library</button>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Pack Creator</h3>
            <p className="text-gray-600 mb-4">Create custom question sets</p>
            <button className="btn-primary">Create Pack</button>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Assignments</h3>
            <p className="text-gray-600 mb-4">Assign packs to students</p>
            <button className="btn-secondary">Manage</button>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Reports</h3>
            <p className="text-gray-600 mb-4">Generate progress reports</p>
            <button className="btn-secondary">Generate</button>
          </div>
        </div>
      </div>
    </div>
  );
}