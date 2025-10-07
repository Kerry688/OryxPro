'use client';

import React from 'react';
import { X, Upload, Image as ImageIcon, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UploadedImage {
  originalName: string;
  filename: string;
  publicUrl: string;
  gcsPath: string;
  size: number;
  type: string;
  uploadedAt: string;
}

interface ImageUploadPreviewProps {
  uploadedImages: UploadedImage[];
  localImages?: File[];
  isUploading?: boolean;
  onRemoveUploaded?: (index: number) => void;
  onRemoveLocal?: (index: number) => void;
  onUpload?: (files: File[]) => void;
  maxImages?: number;
  className?: string;
}

export function ImageUploadPreview({
  uploadedImages = [],
  localImages = [],
  isUploading = false,
  onRemoveUploaded,
  onRemoveLocal,
  onUpload,
  maxImages = 10,
  className = ''
}: ImageUploadPreviewProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (onUpload && files.length > 0) {
      onUpload(files);
    }
  };

  const canUploadMore = (uploadedImages.length + localImages.length) < maxImages;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Button */}
      {canUploadMore && onUpload && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600 mb-2">Upload images</p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
            disabled={isUploading}
          />
          <label htmlFor="image-upload">
            <Button 
              type="button" 
              variant="outline" 
              disabled={isUploading}
              className="transition-all duration-200 rounded-lg"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Images
                </>
              )}
            </Button>
          </label>
          <p className="text-xs text-gray-500 mt-2">
            Supported formats: JPG, PNG, GIF, WebP (max 10MB each)
          </p>
        </div>
      )}

      {/* Uploaded Images */}
      {uploadedImages.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-green-600 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Uploaded Images ({uploadedImages.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {uploadedImages.map((image, index) => (
              <div key={`uploaded-${index}`} className="relative group">
                <img
                  src={image.publicUrl}
                  alt={image.originalName}
                  className="w-full h-32 object-cover rounded-lg border border-green-200"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg" />
                {onRemoveUploaded && (
                  <button
                    type="button"
                    onClick={() => onRemoveUploaded(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
                <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-75 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="truncate">{image.originalName}</div>
                  <div>{(image.size / 1024 / 1024).toFixed(1)} MB</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Local Images (fallback for failed uploads) */}
      {localImages.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-orange-600 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Local Images ({localImages.length}) - Upload Failed
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {localImages.map((image, index) => (
              <div key={`local-${index}`} className="relative group">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Image ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-orange-200"
                />
                {onRemoveLocal && (
                  <button
                    type="button"
                    onClick={() => onRemoveLocal(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
                <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-75 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="truncate">{image.name}</div>
                  <div>{(image.size / 1024 / 1024).toFixed(1)} MB</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No images message */}
      {uploadedImages.length === 0 && localImages.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No images uploaded yet</p>
          <p className="text-sm">Upload images to showcase your content</p>
        </div>
      )}

      {/* Max images reached */}
      {!canUploadMore && (
        <div className="text-center py-4 text-orange-600 bg-orange-50 rounded-lg">
          <AlertCircle className="h-5 w-5 mx-auto mb-2" />
          <p className="text-sm">Maximum {maxImages} images reached</p>
        </div>
      )}
    </div>
  );
}
