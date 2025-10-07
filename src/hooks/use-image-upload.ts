import { useState } from 'react';
import { useToast } from './use-toast';

interface UploadedImage {
  originalName: string;
  filename: string;
  publicUrl: string;
  gcsPath: string;
  size: number;
  type: string;
  uploadedAt: string;
}

interface UseImageUploadReturn {
  uploadImages: (files: File[]) => Promise<UploadedImage[]>;
  isUploading: boolean;
  uploadProgress: number;
}

export function useImageUpload(): UseImageUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const uploadImages = async (files: File[]): Promise<UploadedImage[]> => {
    if (files.length === 0) return [];

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });

      const response = await fetch('/api/products/upload-images', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Upload failed:', errorData);
        
        // Fallback: create mock uploaded images for testing
        const fallbackImages = files.map((file, index) => {
          const objectUrl = URL.createObjectURL(file);
          return {
            originalName: file.name,
            filename: `fallback-${Date.now()}-${index}`,
            publicUrl: objectUrl, // Use object URL for preview
            gcsPath: `fallback/${file.name}`,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString()
          };
        });

        toast({
          title: "Upload Failed - Using Fallback",
          description: `Upload failed, using local preview for ${fallbackImages.length} image(s)`,
          variant: "destructive",
        });

        setUploadProgress(100);
        return fallbackImages;
      }

      const result = await response.json();
      
      toast({
        title: "Images Uploaded",
        description: `${result.images.length} image(s) uploaded successfully`,
        variant: "default",
      });

      setUploadProgress(100);
      return result.images;

    } catch (error) {
      console.error('Error uploading images:', error);
      
      // Fallback: create mock uploaded images for testing
      const fallbackImages = files.map((file, index) => {
        const objectUrl = URL.createObjectURL(file);
        return {
          originalName: file.name,
          filename: `fallback-error-${Date.now()}-${index}`,
          publicUrl: objectUrl, // Use object URL for preview
          gcsPath: `fallback/${file.name}`,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString()
        };
      });

      toast({
        title: "Upload Failed - Using Fallback",
        description: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}. Using local preview for ${fallbackImages.length} image(s)`,
        variant: "destructive",
      });

      setUploadProgress(100);
      return fallbackImages;
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  return {
    uploadImages,
    isUploading,
    uploadProgress,
  };
}
