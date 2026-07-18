import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, dateTime, duration, type, message } = body;

    // Validation
    if (!name || !email || !dateTime || !type) {
      return NextResponse.json(
        { error: 'Name, email, date/time, and interview type are required fields.' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address.' },
        { status: 400 }
      );
    }

    // Parse date-time
    const parsedDate = new Date(dateTime);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date and time format.' },
        { status: 400 }
      );
    }

    // Ensure the date is in the future
    if (parsedDate <= new Date()) {
      return NextResponse.json(
        { error: 'Please choose a date and time in the future.' },
        { status: 400 }
      );
    }

    // Save to database
    const newInterview = await prisma.interview.create({
      data: {
        name,
        email,
        company: company || null,
        dateTime: parsedDate,
        duration: duration ? parseInt(duration, 10) : 30,
        type,
        message: message || null,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Interview scheduled successfully!', data: newInterview },
      { status: 201 }
    );
  } catch (error) {
    console.error('Interview booking error:', error);
    return NextResponse.json(
      { error: 'Failed to schedule interview. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const interviews = await prisma.interview.findMany({
      orderBy: {
        dateTime: 'asc',
      },
      take: 50,
    });

    return NextResponse.json({ success: true, data: interviews });
  } catch (error) {
    console.error('Fetch interviews error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interviews.' },
      { status: 500 }
    );
  }
}
