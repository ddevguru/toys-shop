
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
      {/* Hero Section */}
      <section className="w-full">
        <HeroCarousel />
      </section>

      {/* Shop by Collections */}
      <section className="section-alt-1">
        <ShopCollections />
      </section>

      {/* Studio Vibes Section */}
      <section className="section-alt-2">
        <StudioVibes />
      </section>

      {/* Signature Products */}
      <section className="section-alt-1">
        <SignatureProducts />
      </section>

      {/* Marquee Banner */}
      <section className="section-alt-3">
        <MarqueeBanner />
      </section>

      {/* Featured Products */}
      <section className="section-alt-2">
        <FeaturedProducts />
      </section>

      {/* Instagram Section */}
      <section className="section-alt-1">
        <InstagramSection />
      </section>

      {/* Why Choose Us */}
      <section className="section-alt-2">
        <WhyChooseUs />
      </section>

      {/* FAQ Section */}
      <section className="section-alt-1">
        <FAQSection />
      </section>

      {/* Newsletter Section */}
      <section className="section-alt-3">
        <NewsletterSection />
      </section>
    </main>
  );
}
