import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, url, caption, order } = body;

    if (!projectId || !url) {
      return NextResponse.json(
        { error: 'projectId and url are required' },
        { status: 400 }
      );
    }

    const newImage = await prisma.projectImage.create({
      data: {
        projectId,
        url,
        caption,
        order: order || 0,
      },
    });

    return NextResponse.json({ success: true, data: newImage });
  } catch (error) {
    console.error('Create project image error:', error);
    return NextResponse.json(
      { error: 'Failed to add project image' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }

    await prisma.projectImage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete project image error:', error);
    return NextResponse.json(
      { error: 'Failed to delete project image' },
      { status: 500 }
    );
  }
}
