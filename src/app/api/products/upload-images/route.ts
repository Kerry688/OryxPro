import { NextRequest, NextResponse } from 'next/server';
import { uploadFile } from '@/lib/google-storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No images provided' },
        { status: 400 }
      );
    }

    const uploadedImages = [];

    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { success: false, error: `Invalid file type: ${file.name}` },
          { status: 400 }
        );
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: `File too large: ${file.name}` },
          { status: 400 }
        );
      }

      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload to Firebase Storage
      const uploadResult = await uploadFile(
        buffer,
        file.name,
        'products' // Upload to products folder
      );

      uploadedImages.push({
        originalName: file.name,
        filename: uploadResult.filename,
        publicUrl: uploadResult.publicUrl,
        gcsPath: uploadResult.gcsPath,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString()
      });
    }

    return NextResponse.json({
      success: true,
      images: uploadedImages,
      message: `${uploadedImages.length} image(s) uploaded successfully`
    });

  } catch (error) {
    console.error('Error uploading images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload images' },
      { status: 500 }
    );
  }
}
