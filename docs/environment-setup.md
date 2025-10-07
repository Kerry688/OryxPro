# Environment Setup Guide

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Database Configuration
```env
MONGODB_URI=mongodb://localhost:27017
DB_NAME=oryxpro
```

### Google Cloud Storage (Optional for Development)
```env
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_KEY_FILE=./service-account-key.json
GOOGLE_CLOUD_STORAGE_BUCKET=oryx-pro-documents
```

### Authentication
```env
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:9002
```

### Development
```env
NODE_ENV=development
```

## Development Setup

### For Local Development (Recommended)
If you don't have Google Cloud Storage configured, the application will automatically fall back to local file storage in the `uploads/documents` directory.

### For Production
1. Set up Google Cloud Storage as described in `document-center-setup.md`
2. Configure all environment variables
3. Ensure MongoDB is accessible

## Quick Start

1. Create `.env.local` with at minimum:
```env
MONGODB_URI=mongodb://localhost:27017
DB_NAME=oryxpro
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://localhost:9002
```

2. Start MongoDB (if running locally):
```bash
mongod
```

3. Start the development server:
```bash
npm run dev
```

4. Navigate to `http://localhost:9002/documents` to test document uploads

## Troubleshooting

### Document Upload Issues
- **"Missing required fields"**: Ensure MongoDB is running and accessible
- **"Failed to upload file"**: Check file size (max 100MB) and storage configuration
- **"Network error"**: Check if the development server is running on port 9002

### Storage Fallback
The application automatically detects if Google Cloud Storage is configured:
- If configured: Uses Google Cloud Storage
- If not configured: Uses local file storage in `uploads/documents/`

### File Access
- Local files are served via `/api/documents/local/[filename]`
- Cloud files use signed URLs for secure access
