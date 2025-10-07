import { Storage } from '@google-cloud/storage';
import { promises as fs } from 'fs';
import path from 'path';

// Check if Google Cloud Storage is configured
const isGoogleCloudConfigured = () => {
  return !!(
    process.env.GOOGLE_CLOUD_PROJECT_ID &&
    process.env.GOOGLE_CLOUD_KEY_FILE &&
    process.env.GOOGLE_CLOUD_STORAGE_BUCKET
  );
};

// Initialize Google Cloud Storage only if configured
let storage: Storage | null = null;
let bucket: any = null;

if (isGoogleCloudConfigured()) {
  try {
    let storageConfig: any = {
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    };

    // Check if GOOGLE_CLOUD_KEY_FILE is a JSON string or file path
    if (process.env.GOOGLE_CLOUD_KEY_FILE) {
      if (process.env.GOOGLE_CLOUD_KEY_FILE.startsWith('{')) {
        // It's a JSON string, parse it
        try {
          storageConfig.credentials = JSON.parse(process.env.GOOGLE_CLOUD_KEY_FILE);
        } catch (parseError) {
          console.warn('Failed to parse Google Cloud credentials JSON:', parseError);
          storageConfig.keyFilename = process.env.GOOGLE_CLOUD_KEY_FILE;
        }
      } else {
        // It's a file path
        storageConfig.keyFilename = process.env.GOOGLE_CLOUD_KEY_FILE;
      }
    }

    storage = new Storage(storageConfig);

    const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET || 'oryx-pro-documents';
    bucket = storage.bucket(bucketName);
    
    console.log('Google Cloud Storage initialized successfully');
  } catch (error) {
    console.warn('Google Cloud Storage configuration failed, falling back to local storage:', error);
    console.warn('Error details:', error.message);
    storage = null;
    bucket = null;
  }
}

// Local storage directory for fallback
const LOCAL_STORAGE_DIR = path.join(process.cwd(), 'uploads', 'documents');

export interface UploadResult {
  filename: string;
  publicUrl: string;
  gcsPath: string;
}

export interface DownloadResult {
  buffer: Buffer;
  metadata: {
    contentType: string;
    size: number;
    name: string;
  };
}

/**
 * Upload a file to Google Cloud Storage or local storage fallback
 */
export async function uploadFile(
  file: Buffer,
  originalName: string,
  folder: string = 'documents'
): Promise<UploadResult> {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();
    const filename = `${timestamp}_${randomString}.${extension}`;

    // Use Google Cloud Storage if configured, otherwise fallback to local storage
    if (storage && bucket) {
      console.log('Using Google Cloud Storage for upload');
      return await uploadToGoogleCloud(file, filename, originalName, extension || '', folder);
    } else {
      console.log('Using local storage for upload (Google Cloud not configured)');
      return await uploadToLocal(file, filename, originalName, extension || '');
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
}

/**
 * Upload to Google Cloud Storage
 */
async function uploadToGoogleCloud(
  file: Buffer,
  filename: string,
  originalName: string,
  extension: string,
  folder: string = 'documents'
): Promise<UploadResult> {
  if (!storage || !bucket) {
    throw new Error('Google Cloud Storage not configured');
  }

  const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET || 'oryx-pro-documents';
  const fullFilename = `${folder}/${filename}`;
  
  // Create file reference in bucket
  const fileRef = bucket.file(fullFilename);

  // Upload file
  await fileRef.save(file, {
    metadata: {
      contentType: getContentType(extension),
      metadata: {
        originalName,
        uploadedAt: new Date().toISOString(),
      },
    },
    public: true, // Make files public for direct access
  });

  // Generate public URL (will be signed URL for private files)
  const publicUrl = `https://storage.googleapis.com/${bucketName}/${fullFilename}`;

  return {
    filename: fullFilename,
    publicUrl,
    gcsPath: `gs://${bucketName}/${fullFilename}`,
  };
}

/**
 * Upload to local storage (fallback)
 */
async function uploadToLocal(
  file: Buffer,
  filename: string,
  originalName: string,
  extension: string
): Promise<UploadResult> {
  try {
    console.log('Starting local upload:', { filename, originalName, extension });
    
    // Ensure uploads directory exists
    await fs.mkdir(LOCAL_STORAGE_DIR, { recursive: true });
    console.log('Local storage directory created/verified:', LOCAL_STORAGE_DIR);
    
    const filePath = path.join(LOCAL_STORAGE_DIR, filename);
    const relativePath = path.join('uploads', 'documents', filename);
    
    console.log('Writing file to:', filePath);
    
    // Write file to local storage
    await fs.writeFile(filePath, file);
    console.log('File written successfully');

    // Generate public URL for local file
    const publicUrl = `/api/documents/local/${filename}`;

    const result = {
      filename,
      publicUrl,
      gcsPath: relativePath, // Use relative path for local storage
    };
    
    console.log('Local upload completed:', result);
    return result;
  } catch (error) {
    console.error('Error in uploadToLocal:', error);
    throw error;
  }
}

/**
 * Download a file from Google Cloud Storage or local storage
 */
export async function downloadFile(filename: string): Promise<DownloadResult> {
  try {
    // Use Google Cloud Storage if configured, otherwise fallback to local storage
    if (storage && bucket && isGoogleCloudConfigured()) {
      return await downloadFromGoogleCloud(filename);
    } else {
      return await downloadFromLocal(filename);
    }
  } catch (error) {
    console.error('Error downloading file:', error);
    throw new Error('Failed to download file');
  }
}

/**
 * Download from Google Cloud Storage
 */
async function downloadFromGoogleCloud(filename: string): Promise<DownloadResult> {
  if (!storage || !bucket) {
    throw new Error('Google Cloud Storage not configured');
  }

  const fileRef = bucket.file(filename);
  
  // Check if file exists
  const [exists] = await fileRef.exists();
  if (!exists) {
    throw new Error('File not found in cloud storage');
  }

  // Get file metadata
  const [metadata] = await fileRef.getMetadata();
  
  // Download file as buffer
  const [buffer] = await fileRef.download();

  return {
    buffer,
    metadata: {
      contentType: metadata.contentType || 'application/octet-stream',
      size: parseInt(metadata.size || '0'),
      name: metadata.name || filename,
    },
  };
}

/**
 * Download from local storage (fallback)
 */
async function downloadFromLocal(filename: string): Promise<DownloadResult> {
  const filePath = path.join(LOCAL_STORAGE_DIR, filename);
  
  try {
    // Check if file exists
    await fs.access(filePath);
    
    // Read file as buffer
    const buffer = await fs.readFile(filePath);
    
    // Get file stats for metadata
    const stats = await fs.stat(filePath);
    const extension = path.extname(filename).toLowerCase();
    
    return {
      buffer,
      metadata: {
        contentType: getContentType(extension.replace('.', '')),
        size: stats.size,
        name: filename,
      },
    };
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      throw new Error('File not found in local storage');
    }
    throw error;
  }
}

/**
 * Generate a signed URL for private file access or local URL
 */
export async function generateSignedUrl(
  filename: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<string> {
  try {
    if (storage && bucket && isGoogleCloudConfigured()) {
      return await generateGoogleCloudSignedUrl(filename, expiresIn);
    } else {
      return generateLocalUrl(filename);
    }
  } catch (error) {
    console.error('Error generating URL:', error);
    throw new Error('Failed to generate URL');
  }
}

/**
 * Generate Google Cloud signed URL
 */
async function generateGoogleCloudSignedUrl(filename: string, expiresIn: number): Promise<string> {
  if (!storage || !bucket) {
    throw new Error('Google Cloud Storage not configured');
  }

  const fileRef = bucket.file(filename);
  
  const [signedUrl] = await fileRef.getSignedUrl({
    action: 'read',
    expires: Date.now() + expiresIn * 1000,
  });

  return signedUrl;
}

/**
 * Generate local file URL
 */
function generateLocalUrl(filename: string): string {
  return `/api/documents/local/${filename}`;
}

/**
 * Delete a file from Google Cloud Storage or local storage
 */
export async function deleteFile(filename: string): Promise<boolean> {
  try {
    if (storage && bucket && isGoogleCloudConfigured()) {
      return await deleteFromGoogleCloud(filename);
    } else {
      return await deleteFromLocal(filename);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

/**
 * Delete from Google Cloud Storage
 */
async function deleteFromGoogleCloud(filename: string): Promise<boolean> {
  if (!storage || !bucket) {
    throw new Error('Google Cloud Storage not configured');
  }

  const fileRef = bucket.file(filename);
  
  // Check if file exists
  const [exists] = await fileRef.exists();
  if (!exists) {
    return true; // File doesn't exist, consider it deleted
  }

  // Delete the file
  await fileRef.delete();
  return true;
}

/**
 * Delete from local storage
 */
async function deleteFromLocal(filename: string): Promise<boolean> {
  const filePath = path.join(LOCAL_STORAGE_DIR, filename);
  
  try {
    // Check if file exists
    await fs.access(filePath);
    
    // Delete the file
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      return true; // File doesn't exist, consider it deleted
    }
    throw error;
  }
}

/**
 * Get content type based on file extension
 */
function getContentType(extension: string): string {
  const contentTypes: Record<string, string> = {
    // Documents
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    txt: 'text/plain',
    rtf: 'application/rtf',
    
    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    bmp: 'image/bmp',
    svg: 'image/svg+xml',
    webp: 'image/webp',
    
    // Archives
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    tar: 'application/x-tar',
    gz: 'application/gzip',
    
    // Code
    js: 'application/javascript',
    ts: 'application/typescript',
    html: 'text/html',
    css: 'text/css',
    json: 'application/json',
    xml: 'application/xml',
    
    // Audio
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    
    // Video
    mp4: 'video/mp4',
    avi: 'video/x-msvideo',
    mov: 'video/quicktime',
    wmv: 'video/x-ms-wmv',
  };

  return contentTypes[extension.toLowerCase()] || 'application/octet-stream';
}

/**
 * Check if bucket exists and is accessible, or if local storage is available
 */
export async function checkBucketAccess(): Promise<boolean> {
  try {
    if (storage && bucket && isGoogleCloudConfigured()) {
      const [exists] = await bucket.exists();
      return exists;
    } else {
      // Check if local storage directory is accessible
      await fs.mkdir(LOCAL_STORAGE_DIR, { recursive: true });
      return true;
    }
  } catch (error) {
    console.error('Error checking storage access:', error);
    return false;
  }
}

