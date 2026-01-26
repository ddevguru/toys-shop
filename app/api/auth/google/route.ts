import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateToken } from '@/lib/auth';
import { z } from 'zod';

const googleAuthSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  photo: z.string().url().optional(),
  providerId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = googleAuthSchema.parse(body);

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (user) {
      // Update provider info if needed
      if (!user.providerId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            provider: 'google',
            providerId: validatedData.providerId,
            photo: validatedData.photo || user.photo,
          },
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            role: true,
            photo: true,
          },
        });
      }
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
          photo: validatedData.photo,
          provider: 'google',
          providerId: validatedData.providerId,
          isEmailVerified: true,
        },
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          role: true,
          photo: true,
        },
      });
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      message: 'Google authentication successful',
      user,
      token,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Google auth error:', error);
    return NextResponse.json(
      { error: 'Failed to authenticate with Google' },
      { status: 500 }
    );
  }
}

