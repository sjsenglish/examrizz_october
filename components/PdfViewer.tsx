'use client';

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  pdfUrl: string;
  onPageChange?: (page: number) => void;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ pdfUrl, onPageChange }) => {
  console.log('📄 PdfViewer component mounted with URL:', pdfUrl);

  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log('✅ PdfViewer: PDF loaded successfully with', numPages, 'pages');
    setNumPages(numPages);
    setIsLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('❌ PdfViewer: Error loading PDF:', error);
    setIsLoading(false);
    setError('Failed to load PDF. This may be due to CORS restrictions or an invalid PDF file.');
    console.error('PDF load error details:', error);
  };

  const goToPreviousPage = () => {
    if (pageNumber > 1) {
      const newPage = pageNumber - 1;
      setPageNumber(newPage);
      onPageChange?.(newPage);
    }
  };

  const goToNextPage = () => {
    if (numPages && pageNumber < numPages) {
      const newPage = pageNumber + 1;
      setPageNumber(newPage);
      onPageChange?.(newPage);
    }
  };

  const containerRef = React.useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      setContainerWidth(node.offsetWidth);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        border: '2px solid #000000',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      {/* PDF Document Container */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '20px',
          backgroundColor: '#f5f5f5',
        }}
      >
        {isLoading && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              gap: '16px',
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

        {error && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              gap: '12px',
              padding: '20px',
              textAlign: 'center',
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

        {!isLoading && !error && (
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={null}
          >
            <Page
              pageNumber={pageNumber}
              width={containerWidth ? Math.min(containerWidth - 40, 800) : undefined}
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </Document>
        )}
      </div>

      {/* Navigation Controls */}
      {!isLoading && !error && numPages && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 24px',
            backgroundColor: '#ffffff',
            borderTop: '2px solid #e0e0e0',
          }}
        >
          <button
            onClick={goToPreviousPage}
            disabled={pageNumber <= 1}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '600',
              color: pageNumber <= 1 ? '#999' : '#000',
              backgroundColor: pageNumber <= 1 ? '#f0f0f0' : '#ffffff',
              border: '2px solid #000',
              borderRadius: '8px',
              cursor: pageNumber <= 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: pageNumber <= 1 ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (pageNumber > 1) {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
              }
            }}
            onMouseLeave={(e) => {
              if (pageNumber > 1) {
                e.currentTarget.style.backgroundColor = '#ffffff';
              }
            }}
          >
            ← Previous
          </button>

          <div
            style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#333',
            }}
          >
            Page {pageNumber} of {numPages}
          </div>

          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '600',
              color: pageNumber >= numPages ? '#999' : '#000',
              backgroundColor: pageNumber >= numPages ? '#f0f0f0' : '#ffffff',
              border: '2px solid #000',
              borderRadius: '8px',
              cursor: pageNumber >= numPages ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: pageNumber >= numPages ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (pageNumber < numPages) {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
              }
            }}
            onMouseLeave={(e) => {
              if (pageNumber < numPages) {
                e.currentTarget.style.backgroundColor = '#ffffff';
              }
            }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfViewer;
