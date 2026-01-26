import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, getTokenFromRequest } from '@/lib/auth';
import { z } from 'zod';

const cartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
});

// GET - Get user's cart
export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    const user = await getCurrentUser(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = cartItems.reduce(
      (sum, item) => sum + (item.product.discountPrice || item.product.price) * item.quantity,
      0
    );

    return NextResponse.json({
      cart: cartItems,
      total,
    });
  } catch (error) {
    console.error('Get cart error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST - Add item to cart
export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    const user = await getCurrentUser(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = cartItemSchema.parse(body);

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: validatedData.productId },
    });

    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: 'Product not found or unavailable' },
        { status: 404 }
      );
    }

    // Check stock
    if (product.stock < validatedData.quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      );
    }

    // Add or update cart item
    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: user.id,
          productId: validatedData.productId,
        },
      },
      update: {
        quantity: validatedData.quantity,
      },
      create: {
        userId: user.id,
        productId: validatedData.productId,
        quantity: validatedData.quantity,
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json(
      { message: 'Item added to cart', cartItem },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Add to cart error:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

// DELETE - Clear cart
export async function DELETE(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    const user = await getCurrentUser(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await prisma.cartItem.deleteMany({
      where: { userId: user.id },
    });

    return NextResponse.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Clear cart error:', error);
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}

