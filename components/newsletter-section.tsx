'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription logic here
    setIsSubmitted(true);
    setEmail('');
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section className="py-24 container mx-auto px-4 md:px-6">
        <div className="bg-primary rounded-[2.5rem] p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/30">
           {/* Decorative circles */}
           <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
           <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3" />
           
           <div className="relative z-10 max-w-2xl mx-auto space-y-8 animate-fadeInUp">
             <div className="w-20 h-20 bg-white text-primary rounded-full flex items-center justify-center mx-auto text-3xl font-bold shadow-lg animate-float">✉</div>
             <h2 
               className="text-4xl md:text-5xl font-bold text-white animate-slideUp"
               style={{ fontFamily: 'var(--font-heading)', animationDelay: '0.1s' }}
             >
               Join the Play Squad
             </h2>
             <p className="text-lg text-white/90 font-medium leading-relaxed animate-fadeIn" style={{ animationDelay: '0.2s' }}>
               Get updates on new arrivals, secret offers, and limited edition drops delivered straight to your inbox.
             </p>
             <div className="flex gap-3 max-w-md mx-auto">
               <Input placeholder="Enter your email address" className="bg-white text-foreground border-none h-12 rounded-full px-6 shadow-inner" />
               <Button size="lg" className="rounded-full bg-foreground text-background hover:bg-foreground/90 h-12 px-8 font-bold shadow-lg transition-all duration-300">
                 Subscribe
               </Button>
             </div>
             <p className="text-xs opacity-70">No spam, just fun stuff. Unsubscribe anytime.</p>
           </div>
        </div>
      </section>
  );
}
