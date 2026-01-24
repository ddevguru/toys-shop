'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orderId: '',
    reason: 'product-query',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    setIsSubmitted(true);
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        orderId: '',
        reason: 'product-query',
        message: '',
      });
      setIsSubmitted(false);
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'hello@toycart.studio',
      subtext: 'We\'ll respond within 24 hours',
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '+91 9876 543 210',
      subtext: 'Monday to Saturday, 10 AM - 6 PM',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      content: '+91 9876 543 210',
      subtext: 'Quick support available',
    },
    {
      icon: MapPin,
      title: 'Location',
      content: 'Mumbai, India',
      subtext: 'Studio Office Hours',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-12 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
            Let's Talk Playtime
          </h1>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto text-balance">
            Got questions? Feedback? Or just want to say hello? We'd love to hear from you. Reach out anytime!
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((info, idx) => {
            const Icon = info.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-card border border-border p-6 space-y-3 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="inline-block p-3 rounded-xl bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{info.title}</h3>
                <p className="text-foreground font-semibold">{info.content}</p>
                <p className="text-sm text-foreground/60">{info.subtext}</p>
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Contact Form */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">Send us a Message</h2>
              <p className="text-foreground/60">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="Your name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="+91 XXXX XXXX XX"
                  />
                </div>

                {/* Reason for Contact */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Reason for Contact *
                  </label>
                  <select
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  >
                    <option value="product-query">Product Query</option>
                    <option value="order-issue">Order Issue</option>
                    <option value="collaboration">Collaboration</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Order ID (Optional) */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Order ID (if applicable)
                  </label>
                  <input
                    type="text"
                    name="orderId"
                    value={formData.orderId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="Order #12345"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full py-3"
                >
                  Send Message
                </Button>

                <p className="text-xs text-foreground/50 text-center">
                  We respect your privacy. Your information will only be used to respond to your inquiry.
                </p>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="p-4 rounded-full bg-green-100/50">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Message Sent!</h3>
                <p className="text-foreground/60 text-center">
                  Thanks for reaching out. We'll get back to you within 24 hours.
                </p>
              </div>
            )}
          </div>

          {/* Side Info */}
          <div className="space-y-8">
            {/* FAQ Quick Links */}
            <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/30 p-8 space-y-4">
              <h3 className="text-xl font-bold text-foreground">Common Questions?</h3>
              <p className="text-foreground/60 text-sm">
                Check out our FAQ section for quick answers.
              </p>
              <Button
                variant="outline"
                className="w-full border-border rounded-full bg-transparent"
                onClick={() => {
                  document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View FAQ
              </Button>
            </div>

            {/* Business Hours */}
            <div className="rounded-2xl border border-border p-8 space-y-4">
              <h3 className="text-xl font-bold text-foreground">Business Hours</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground/60">Monday - Friday</span>
                  <span className="font-semibold text-foreground">10 AM - 7 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">Saturday</span>
                  <span className="font-semibold text-foreground">10 AM - 6 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">Sunday</span>
                  <span className="font-semibold text-foreground">Closed</span>
                </div>
              </div>
            </div>

            {/* Support Options */}
            <div className="rounded-2xl border border-border p-8 space-y-4">
              <h3 className="text-xl font-bold text-foreground">Other Ways to Connect</h3>
              <div className="space-y-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors group"
                >
                  <span className="text-primary">📷</span>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    Follow us on Instagram
                  </span>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors group"
                >
                  <span className="text-primary">▶️</span>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    Subscribe on YouTube
                  </span>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors group"
                >
                  <span className="text-primary">f</span>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    Like us on Facebook
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
