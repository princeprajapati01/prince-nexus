import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const featured = searchParams.get('featured');
    const published = searchParams.get('published');

    const where: any = {};

    if (featured === 'true') {
      where.featured = true;
    }

    if (published !== 'false') {
      where.published = true;
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        images: {
          orderBy: {
            order: 'asc',
          },
        },
        videos: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error('Fetch projects error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      title,
      slug,
      description,
      longDescription,
      problem,
      solution,
      architecture,
      features,
      challenges,
      learnings,
      results,
      technologies,
      githubUrl,
      demoUrl,
      coverImage,
      featured,
      published,
      order,
    } = body;

    // Validation
    if (!title || !slug || !description) {
      return NextResponse.json(
        { error: 'Title, slug, and description are required' },
        { status: 400 }
      );
    }

    const newProject = await prisma.project.create({
      data: {
        title,
        slug,
        description,
        longDescription,
        problem,
        solution,
        architecture,
        features,
        challenges,
        learnings,
        results,
        technologies: technologies || [],
        githubUrl,
        demoUrl,
        coverImage,
        featured: featured || false,
        published: published !== false,
        order: order || 0,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Project created successfully', data: newProject },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create project error:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A project with this slug already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
