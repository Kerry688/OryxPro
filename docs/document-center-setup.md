# Document Center Setup Guide

## Overview
The Document Center allows users to upload, share, and manage documents with different permission levels. Documents are stored in Google Cloud Storage for scalability and reliability.

## Features
- **File Upload**: Drag and drop or browse to upload documents
- **Permission Management**: Public, Private, or Assigned Users access
- **Document Sharing**: Share documents with specific users
- **Search & Filter**: Find documents by name, tags, or metadata
- **Statistics**: Track downloads, views, and usage
- **Multiple Views**: Grid and list view options

## Google Cloud Storage Setup

### 1. Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your project ID

### 2. Enable Cloud Storage API
1. Navigate to "APIs & Services" > "Library"
2. Search for "Cloud Storage API"
3. Click "Enable"

### 3. Create a Storage Bucket
1. Go to "Cloud Storage" > "Buckets"
2. Click "Create Bucket"
3. Choose a unique name (e.g., `oryx-pro-documents`)
4. Select your preferred region
5. Choose "Standard" storage class
6. Set access control to "Uniform"

### 4. Create Service Account
1. Go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Enter name: `oryx-pro-storage`
4. Enter description: `Service account for Document Center`
5. Click "Create and Continue"
6. Grant roles:
   - "Storage Object Admin" (for full access)
   - "Storage Legacy Bucket Reader" (for bucket access)
7. Click "Continue" and "Done"

### 5. Generate Service Account Key
1. Click on the created service account
2. Go to "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose "JSON" format
5. Download the key file
6. Store it securely in your project directory

## Environment Variables

Add these environment variables to your `.env.local` file:

```env
# Google Cloud Storage Configuration
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_KEY_FILE=path/to/service-account-key.json
GOOGLE_CLOUD_STORAGE_BUCKET=your-bucket-name

# Example:
# GOOGLE_CLOUD_PROJECT_ID=my-oryx-project
# GOOGLE_CLOUD_KEY_FILE=./service-account-key.json
# GOOGLE_CLOUD_STORAGE_BUCKET=oryx-pro-documents
```

## File Structure

```
src/
├── app/
│   ├── documents/
│   │   └── page.tsx                    # Main Document Center page
│   └── api/
│       └── documents/
│           ├── route.ts                # Document CRUD operations
│           ├── [id]/
│           │   ├── route.ts            # Individual document operations
│           │   └── download/
│           │       └── route.ts        # Document download
│           └── stats/
│               └── route.ts            # Document statistics
├── components/
│   └── documents/
│       ├── DocumentUploadDialog.tsx    # Upload dialog component
│       ├── DocumentViewDialog.tsx      # Document viewer
│       └── DocumentPermissionsDialog.tsx # Permission management
└── lib/
    ├── models/
    │   └── document.ts                 # Document data models
    └── google-storage.ts               # Google Cloud Storage utilities
```

## Usage

### Upload Documents
1. Navigate to Document Center
2. Click "Upload Document"
3. Drag and drop or select a file
4. Configure permissions and metadata
5. Click "Upload Document"

### Manage Permissions
1. Click on a document's menu (three dots)
2. Select "Share"
3. Choose permission type:
   - **Public**: Anyone can access
   - **Private**: Only you can access
   - **Assigned Users**: Specific users only
4. Configure additional permissions (download, edit, delete)

### Download Documents
1. Click on a document
2. Click "Download" button
3. File will be downloaded to your device

## Security Considerations

1. **Service Account Key**: Store securely and never commit to version control
2. **Bucket Permissions**: Use least privilege principle
3. **File Validation**: Implement file type and size restrictions
4. **Access Control**: Regularly review document permissions
5. **Audit Logging**: Monitor document access and modifications

## Troubleshooting

### Common Issues

1. **Upload Fails**
   - Check Google Cloud credentials
   - Verify bucket exists and is accessible
   - Check file size limits

2. **Download Fails**
   - Verify document permissions
   - Check if file exists in storage
   - Verify signed URL generation

3. **Permission Errors**
   - Check service account roles
   - Verify bucket access permissions
   - Ensure proper authentication

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

This will provide detailed error messages and stack traces.

## Cost Optimization

1. **Storage Class**: Use appropriate storage classes for different document types
2. **Lifecycle Rules**: Set up automatic deletion of old documents
3. **Access Patterns**: Monitor and optimize based on usage
4. **Compression**: Compress large files before upload

## Scaling Considerations

1. **CDN Integration**: Use Google Cloud CDN for global distribution
2. **Load Balancing**: Implement for high-traffic scenarios
3. **Caching**: Cache frequently accessed documents
4. **Database Indexing**: Optimize document queries with proper indexes


