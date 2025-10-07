import { NextRequest, NextResponse } from 'next/server';
import { deleteFile } from '@/lib/google-storage';

export async function DELETE(request: NextRequest) {
  try {
    const { filename } = await request.json();

    if (!filename) {
      return NextResponse.json(
        { success: false, error: 'Filename is required' },
        { status: 400 }
      );
    }

    // Delete the file from storage
    const deleted = await deleteFile(filename);

    if (deleted) {
      return NextResponse.json(
        { success: true, message: 'Image deleted successfully' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to delete image' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error deleting product image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
