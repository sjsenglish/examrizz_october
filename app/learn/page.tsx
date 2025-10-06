import Link from 'next/link';
import './learn.css';

export default function LearnPage() {
  return (
    <div style={{ 
      backgroundColor: '#F8F8F5', 
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 40px',
        backgroundColor: '#F8F8F5'
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <h1 style={{
            fontFamily: "'Madimi One', cursive",
            fontSize: '32px',
            fontWeight: '400',
            color: '#000000',
            margin: '0',
            cursor: 'pointer'
          }}>
            examrizzsearch
          </h1>
        </Link>
      </div>

      {/* Main Content Container */}
      <div style={{ 
        padding: '32px',
        paddingBottom: '120px'
      }}>
        <div style={{
          maxWidth: '1024px',
          margin: '0 auto'
        }}>
          <div style={{ marginBottom: '32px' }}>
            <Link 
              href="/" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                color: '#00CED1',
                textDecoration: 'none',
                marginBottom: '16px'
              }}
            >
              ← Back to Hub
            </Link>
            <h1 style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#1F2937',
              marginBottom: '16px'
            }}>Learn</h1>
            <p style={{
              fontSize: '18px',
              color: '#6B7280'
            }}>Learning paths and study buddy for daily use</p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            marginBottom: '48px'
          }}>
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

          {/* Space for Biology containers and future content */}
          {/* Add your Biology containers here - they will scroll naturally */}
          
        </div>
      </div>
    </div>
  );
}