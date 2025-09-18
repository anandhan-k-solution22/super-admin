import { NextRequest, NextResponse } from 'next/server';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email, resetLink } = await request.json();

    if (!email || !resetLink) {
      return NextResponse.json(
        { success: false, error: 'Email and reset link are required' },
        { status: 400 }
      );
    }

    const result = await sendPasswordResetEmail(email, resetLink);

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in send-reset-email API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
