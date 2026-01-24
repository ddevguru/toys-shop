'use client';

import React from 'react';
import { HelpCircle, MessageCircle, AlertCircle, Truck, CreditCard, RotateCcw } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqCategories = [
  {
    category: 'Safety & Quality',
    icon: AlertCircle,
    faqs: [
      {
        id: 'faq-1',
        question: 'Are your toys safe for kids?',
        answer: 'Yes, all our toys are rigorously tested and certified by international safety standards. We only source from trusted manufacturers who prioritize child safety and use non-toxic materials.',
      },
      {
        id: 'faq-2',
        question: 'Are there any age recommendations for the toys?',
        answer: 'Yes, all our products have clear age recommendations on the product page. We carefully curate toys suitable for different age groups to ensure they are developmentally appropriate.',
      },
    ],
  },
  {
    category: 'Shipping & Delivery',
    icon: Truck,
    faqs: [
      {
        id: 'faq-4',
        question: 'Do you ship pan-India?',
        answer: 'Yes, we ship to most parts of India including remote areas. Delivery times vary based on location, typically between 3-7 business days. We provide tracking for all orders.',
      },
      {
        id: 'faq-3',
        question: 'How much does shipping cost?',
        answer: 'Shipping is FREE on orders above ₹499. For orders below ₹499, a small shipping fee applies based on your location. Express delivery options are also available.',
      },
    ],
  },
  {
    category: 'Payment & Returns',
    icon: CreditCard,
    faqs: [
      {
        id: 'faq-2',
        question: 'Do you offer Cash on Delivery (COD)?',
        answer: 'Yes, we accept COD payments across most of India. You can pay directly to our delivery partner when your order arrives. Online payment methods like cards, UPI, and wallets are also supported.',
      },
      {
        id: 'faq-5',
        question: 'What is your return policy?',
        answer: 'We offer a hassle-free 30-day return policy. If you\'re not satisfied with your purchase, return it within 30 days for a full refund or exchange. Items must be unused and in original packaging.',
      },
      {
        id: 'faq-6',
        question: 'Can I cancel or modify my order?',
        answer: 'Orders can be cancelled within 24 hours of placement. After that, we cannot make modifications. Please contact our support team immediately if you need to cancel.',
      },
    ],
  },
  {
    category: 'Customer Support',
    icon: MessageCircle,
    faqs: [
      {
        id: 'faq-7',
        question: 'How can I contact customer support?',
        answer: 'You can reach our 24/7 support team via email at support@toycart.com, call 1800-TOYS-CART, or use our live chat feature on the website. We respond within 2 hours.',
      },
      {
        id: 'faq-8',
        question: 'Do you have a loyalty program?',
        answer: 'Yes! Every purchase earns you reward points that can be redeemed for discounts. Join our ToyCart Club for exclusive deals, early access to new products, and birthday specials.',
      },
    ],
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="py-16 md:py-28 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-16 space-y-4 text-center animate-fadeInUp">
          <div className="flex items-center justify-center gap-2 mb-2 animate-fadeIn">
            <HelpCircle className="h-8 w-8 text-primary animate-pulse-slow" />
            <span className="text-primary font-bold text-lg">Got Questions?</span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold text-foreground animate-slideUp"
            style={{ fontFamily: 'var(--font-heading)', animationDelay: '0.1s' }}
          >
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            Find quick answers to everything about our toys, delivery, and service
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          {faqCategories.map((categoryData) => {
            const IconComponent = categoryData.icon;
            return (
              <div
                key={categoryData.category}
                className="rounded-3xl border-2 border-muted hover:border-primary/50 transition-all duration-300 p-8 md:p-10 bg-gradient-to-br from-white to-muted/20 hover:shadow-xl hover:shadow-primary/10"
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3
                    className="text-2xl font-bold text-foreground"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {categoryData.category}
                  </h3>
                </div>

                {/* FAQ Accordion */}
                <Accordion type="single" collapsible className="space-y-3">
                  {categoryData.faqs.map((faq) => (
                    <AccordionItem
                      key={faq.id}
                      value={faq.id}
                      className="border-2 border-muted rounded-2xl px-6 overflow-hidden transition-all duration-300 data-[state=open]:border-primary data-[state=open]:bg-primary/5"
                    >
                      <AccordionTrigger
                        className="hover:text-primary transition-colors py-4 font-bold text-foreground hover:no-underline"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-foreground/80 pb-4 leading-relaxed font-medium">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            );
          })}
        </div>

       
      </div>
    </section>
  );
}
