import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string | null; // 'resume' or 'media'

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (type === 'resume') {
      // Save directly as public/resume.pdf
      const publicPath = path.join(process.cwd(), 'public');
      const filePath = path.join(publicPath, 'resume.pdf');
      
      // Ensure public directory exists
      await mkdir(publicPath, { recursive: true });
      await writeFile(filePath, buffer);
      
      return NextResponse.json({
        success: true,
        message: 'Resume uploaded successfully',
        url: '/resume.pdf',
      });
    } else {
      // Save in public/uploads
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      // Ensure directory exists
      await mkdir(uploadsDir, { recursive: true });

      // Create unique clean filename
      const fileExtension = path.extname(file.name);
      const fileNameWithoutExt = path.basename(file.name, fileExtension)
        .replace(/[^a-zA-Z0-9]/g, '_')
        .toLowerCase();
      const uniqueName = `${fileNameWithoutExt}_${Date.now()}${fileExtension}`;
      const filePath = path.join(uploadsDir, uniqueName);

      await writeFile(filePath, buffer);

      return NextResponse.json({
        success: true,
        message: 'File uploaded successfully',
        url: `/uploads/${uniqueName}`,
      });
    }
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
