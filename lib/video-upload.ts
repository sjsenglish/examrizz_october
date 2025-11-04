// Video upload utility for Supabase Storage
export interface VideoUploadOptions {
  fileName: string;
  fileType: string;
  fileSize: number;
  userId: string;
  ticketId?: string;
  onProgress?: (progress: number) => void;
}

export interface VideoUploadResult {
  success: boolean;
  publicUrl?: string;
  error?: string;
}

export const uploadVideoToSupabase = async (
  file: File,
  options: VideoUploadOptions
): Promise<VideoUploadResult> => {
  try {
    // Step 1: Get presigned upload URL
    const uploadUrlResponse = await fetch('/api/video-upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options)
    });

    if (!uploadUrlResponse.ok) {
      const error = await uploadUrlResponse.json();
      return {
        success: false,
        error: error.error || 'Failed to prepare video upload'
      };
    }

    const { uploadUrl, publicUrl, token } = await uploadUrlResponse.json();

    // Step 2: Upload file directly to Supabase Storage with progress tracking
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && options.onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100);
          options.onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({
            success: true,
            publicUrl: publicUrl
          });
        } else {
          resolve({
            success: false,
            error: `Upload failed with status ${xhr.status}: ${xhr.statusText}`
          });
        }
      });

      xhr.addEventListener('error', () => {
        resolve({
          success: false,
          error: 'Network error during upload. Please check your connection and try again.'
        });
      });

      xhr.addEventListener('timeout', () => {
        resolve({
          success: false,
          error: 'Upload timed out. Please try again with a smaller file or better connection.'
        });
      });

      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      
      // Set timeout to 30 minutes for large files
      xhr.timeout = 30 * 60 * 1000;
      
      xhr.send(file);
    });

  } catch (error) {
    console.error('Video upload error:', error);
    return {
      success: false,
      error: 'Unexpected error during upload. Please try again.'
    };
  }
};

export const validateVideoFile = (file: File): { valid: boolean; error?: string } => {
  // Validate file type
  const allowedVideoTypes = [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/avi',
    'video/mov',
    'video/quicktime',
    'video/x-msvideo',
    'video/3gpp',
    'video/x-ms-wmv'
  ];

  if (!allowedVideoTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please select a video file (MP4, MOV, AVI, etc.)'
    };
  }

  // Validate file size (max 2GB)
  const maxSize = 2 * 1024 * 1024 * 1024; // 2GB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Video file must be smaller than 2GB'
    };
  }

  return { valid: true };
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};