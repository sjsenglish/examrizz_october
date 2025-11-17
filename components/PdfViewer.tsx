'use client';

import React, { useState } from 'react';

interface PdfViewerProps {
  pdfUrl: string;
  onPageChange?: (page: number) => void;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ pdfUrl }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError('Failed to load PDF. Please try again later.');
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        border: '2px solid #000000',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Loading Spinner */}
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f5f5f5',
            gap: '16px',
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: '50px',
              height: '50px',
              border: '4px solid #e0e0e0',
              borderTop: '4px solid #000000',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <p style={{ fontSize: '14px', color: '#666' }}>Loading PDF...</p>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f5f5f5',
            gap: '12px',
            padding: '20px',
            textAlign: 'center',
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontSize: '48px',
              color: '#ff4444',
            }}
          >
            ⚠️
          </div>
          <p style={{ fontSize: '16px', color: '#333', fontWeight: 'bold' }}>
            Error Loading PDF
          </p>
          <p style={{ fontSize: '14px', color: '#666' }}>
            {error}
          </p>
        </div>
      )}

      {/* PDF Iframe - Use URL directly without any transformation */}
      <iframe
        src={pdfUrl}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: '12px',
        }}
        title="PDF Viewer"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
      />
    </div>
  );
};

export default PdfViewer;
