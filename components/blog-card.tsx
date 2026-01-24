import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface BlogCardProps {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  readTime: number;
  date: string;
  slug: string;
}

export default function BlogCard({
  id,
  title,
  excerpt,
  category,
  image,
  readTime,
  date,
  slug,
}: BlogCardProps) {
  return (
    <Link href={`/blog/${slug}`}>
      <article className="group rounded-2xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full animate-scaleIn">
        {/* Image Container */}
        <div className="relative w-full aspect-video overflow-hidden bg-muted">
          {/* Category Badge - Top Left */}
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-secondary/80 backdrop-blur-sm text-secondary-foreground px-3 py-1 rounded-full text-xs font-medium shadow-sm">
              {category}
            </span>
          </div>
          
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="p-5 space-y-3 flex-1 flex flex-col bg-card">
          {/* Date and Read Time */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{date}</span>
            <span>•</span>
            <span>{readTime} min read</span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-muted-foreground line-clamp-2 flex-grow">
            {excerpt}
          </p>

          {/* Read Article Button */}
          <div className="pt-2">
            <span className="text-sm text-primary font-semibold group-hover:text-primary/80 transition-colors inline-flex items-center gap-1">
              Read Article
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
