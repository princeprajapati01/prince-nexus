import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

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

    // Send email notification
    const formattedDate = parsedDate.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });

    await sendEmail({
      subject: `🗓️ New Interview Scheduled: ${name} (${company || 'No Company'})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 8px;">
          <h2 style="color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 10px;">New Interview Request</h2>
          <p>Hi Prince, someone has scheduled an interview with you from your portfolio site!</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 120px;">Name:</td>
              <td style="padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Email:</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Company:</td>
              <td style="padding: 8px 0;">${company || 'Not Specified'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Date & Time:</td>
              <td style="padding: 8px 0; color: #4f46e5; font-weight: bold;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Type:</td>
              <td style="padding: 8px 0;">${type}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Message:</td>
              <td style="padding: 8px 0; white-space: pre-line;">${message || 'No additional notes.'}</td>
            </tr>
          </table>
          <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #777777; text-align: center;">This notification was automatically sent from your Prince Nexus Portfolio site.</p>
        </div>
      `,
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
