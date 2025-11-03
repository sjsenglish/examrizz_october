// File signature validation for enhanced security
// Validates file types by checking magic numbers/signatures instead of just MIME types

export const FILE_SIGNATURES = {
  pdf: [0x25, 0x50, 0x44, 0x46], // %PDF
  docx: [0x50, 0x4B, 0x03, 0x04], // PK.. (ZIP format used by DOCX)
  txt: [] // Text files don't have a consistent signature, validate by content
} as const;

export function validateFileSignature(buffer: ArrayBuffer, expectedType: keyof typeof FILE_SIGNATURES): boolean {
  const bytes = new Uint8Array(buffer);
  const signature = FILE_SIGNATURES[expectedType];
  
  // For text files, we'll allow them through (they don't have consistent signatures)
  if (expectedType === 'txt') {
    return true;
  }
  
  // Check if the file starts with the expected signature
  for (let i = 0; i < signature.length; i++) {
    if (bytes[i] !== signature[i]) {
      return false;
    }
  }
  
  return true;
}

export function getFileTypeFromMime(mimeType: string): keyof typeof FILE_SIGNATURES | null {
  switch (mimeType) {
    case 'application/pdf':
      return 'pdf';
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return 'docx';
    case 'text/plain':
      return 'txt';
    default:
      return null;
  }
}

export function validateFileIntegrity(buffer: ArrayBuffer, mimeType: string): { valid: boolean; error?: string } {
  const fileType = getFileTypeFromMime(mimeType);
  
  if (!fileType) {
    return { valid: false, error: 'Unsupported file type' };
  }
  
  const signatureValid = validateFileSignature(buffer, fileType);
  
  if (!signatureValid) {
    return { 
      valid: false, 
      error: `File content doesn't match declared type. Expected ${fileType.toUpperCase()} file.` 
    };
  }
  
  return { valid: true };
}