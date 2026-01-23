
import FeaturedProducts from '@/components/featured-products';
import StudioVibes from '@/components/studio-vibes';
import SignatureProducts from '@/components/signature-products';
import ShopCollections from '@/components/shop-collections';
import MarqueeBanner from '@/components/marquee-banner';
import InstagramSection from '@/components/instagram-section';
import WhyChooseUs from '@/components/why-choose-us';
import FAQSection from '@/components/faq-section';
import NewsletterSection from '@/components/newsletter-section';
import HeroCarousel from '@/components/hero-carousel';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section - Image (no background) */}
      <section className="w-full">
          <HeroCarousel />
      </section>

      {/* Shop by Collections - White */}
      <section className="section-alt-white">
        <ShopCollections />
      </section>

      {/* Studio Vibes Section - Colored */}
      <section className="section-alt-colored">
        <StudioVibes />
      </section>

      {/* Signature Products - White */}
      <section className="section-alt-white">
        <SignatureProducts />
      </section>

      {/* Marquee Banner - Colored */}
      <section className="section-alt-colored">
        <MarqueeBanner />
      </section>

      {/* Featured Products - White */}
      <section className="section-alt-white">
        <FeaturedProducts />
      </section>

      {/* Instagram Section - Colored */}
      <section className="section-alt-colored">
        <InstagramSection />
      </section>

      {/* Why Choose Us - White */}
      <section className="section-alt-white">
        <WhyChooseUs />
      </section>

      {/* FAQ Section - Colored */}
      <section className="section-alt-colored">
        <FAQSection />
      </section>

      {/* Newsletter Section - White */}
      <section className="section-alt-white">
        <NewsletterSection />
      </section>
    </main>
  );
}
