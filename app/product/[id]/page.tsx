import React from 'react';
import { Metadata } from 'next';
import ProductDetailsView from '@/components/product-details-view';
import ProductReviews from '@/components/product-reviews';
import RecommendedProducts from '@/components/recommended-products';

// Mock product data
const productData = {
  1: {
    id: 1,
    name: 'Cartoon Characters Set',
    category: 'Cartoon',
    price: 2499,
    discountPrice: 1999,
    rating: 4.5,
    reviewCount: 128,
    description: 'A delightful collection of colorful cartoon character figures that bring your favorite shows to life. Perfect for kids aged 5-8.',
    features: [
      'Highly detailed cartoon character designs',
      'Non-toxic, child-safe materials',
      'Perfect size for small hands',
      'Great for imaginative play and storytelling',
      'Collectible quality packaging',
    ],
    material: 'Eco-friendly plastic and fabric',
    ageGroup: '5-8 years',
    stockCount: 45,
  },
  2: {
    id: 2,
    name: 'Superhero Action Figures',
    category: 'Superhero',
    price: 1999,
    rating: 4.8,
    reviewCount: 256,
    description: 'Premium articulated superhero figures with amazing detail and multiple points of articulation for dynamic poses.',
    features: [
      'Multiple points of articulation',
      'Highly detailed sculpting',
      'Authentic character designs',
      'Includes accessories and weapons',
      'Display-ready quality',
    ],
    material: 'Premium plastic',
    ageGroup: '8-12 years',
    stockCount: 78,
  },
};

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = productData[params.id as keyof typeof productData];

  return {
    title: product ? `${product.name} - ToyCart Studio` : 'Product Not Found',
    description: product?.description || 'Shop toys at ToyCart Studio',
  };
}

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = productData[id as keyof typeof productData];

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Product Not Found</h1>
          <p className="text-foreground/60">
            Sorry, we couldn't find the product you're looking for.
          </p>
          <a href="/shop" className="text-primary font-semibold hover:underline">
            Back to Shop
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-foreground/60">
          <a href="/" className="hover:text-foreground transition-colors">Home</a>
          <span>/</span>
          <a href="/shop" className="hover:text-foreground transition-colors">Shop</a>
          <span>/</span>
          <span className="text-foreground font-semibold">{product.name}</span>
        </div>

        {/* Product Details */}
        <ProductDetailsView {...product} />

        {/* Reviews Section */}
        <div className="my-12 md:my-20 border-t border-border pt-12 md:pt-20">
          <ProductReviews
            productId={product.id}
            productName={product.name}
            rating={product.rating}
            totalReviews={product.reviewCount}
          />
        </div>

        {/* Divider */}
        <div className="my-12 md:my-20 border-t border-border" />

        {/* Related Products */}
        <div className="py-12 md:py-20">
          <RecommendedProducts />
        </div>
      </div>
    </div>
  );
}
