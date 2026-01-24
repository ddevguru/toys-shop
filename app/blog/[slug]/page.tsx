import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Tag, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const blogPosts: {
  [key: string]: {
    title: string;
    excerpt: string;
    category: string;
    image: string;
    readTime: number;
    date: string;
    author: string;
    content: string;
  };
} = {
  'educational-toys-learning-fun': {
    title: 'Top 10 Educational Toys That Make Learning Fun',
    excerpt: 'Discover the best educational toys that combine fun with learning.',
    category: 'Parenting',
    image: '/hero-toys-1.jpg',
    readTime: 5,
    date: 'Jan 15, 2024',
    author: 'Sarah Johnson',
    content: `Educational toys are more than just fun—they're powerful tools for child development. Let's explore the top 10 educational toys that parents and educators trust.

## Why Educational Toys Matter

Educational toys bridge the gap between play and learning. They encourage curiosity, problem-solving, and critical thinking while keeping children engaged and entertained.

### Benefits of Educational Toys:
- Cognitive development and brain stimulation
- Fine and gross motor skill development
- Social and emotional growth
- Confidence and independence building

## The Top 10 Educational Toys

Each of these toys has been carefully selected for its educational value and ability to keep children entertained:

1. **Building Blocks** - Develop spatial awareness and creativity
2. **Puzzle Sets** - Enhance problem-solving abilities
3. **STEM Kits** - Introduce science and engineering concepts
4. **Reading Flash Cards** - Build vocabulary and language skills
5. **Musical Instruments** - Develop auditory and motor skills
6. **Memory Games** - Improve concentration and memory
7. **Coding Robots** - Teach programming basics
8. **Art and Craft Kits** - Foster creativity and self-expression
9. **Nature Exploration Sets** - Encourage curiosity about science
10. **Board Games** - Develop strategic thinking and social skills

## Choosing the Right Educational Toy

When selecting educational toys, consider your child's age, interests, and learning style. Quality matters—look for toys from trusted manufacturers with safety certifications.

The best educational toys are those that your child will actually enjoy playing with. Engagement is key to learning!`,
  },
  'choose-safe-toys-child': {
    title: 'How to Choose Safe Toys for Your Child',
    excerpt: 'A comprehensive guide to understanding toy safety standards.',
    category: 'Toy Care',
    image: '/studio-collection.jpg',
    readTime: 7,
    date: 'Jan 12, 2024',
    author: 'Emma Davis',
    content: `Safety should always be the top priority when choosing toys for your children. Here's a complete guide to making safe choices.

## Understanding Safety Standards

Different countries have strict safety standards for toys. In India, look for toys that meet:
- BIS (Bureau of Indian Standards) certification
- International safety standards
- Non-toxic material certifications

## Key Safety Checks

Before purchasing any toy:

1. **Check Age Recommendations** - Toys are designed for specific age groups
2. **Inspect for Choking Hazards** - Small parts can be dangerous for babies
3. **Look for Sharp Edges** - Smooth, rounded edges are safer
4. **Verify Material Safety** - Non-toxic, washable materials are ideal
5. **Check for Proper Labeling** - Quality toys have clear safety information

## Red Flags to Avoid

- Toys with peeling paint or varnish
- Toys with loose or broken parts
- Unlabeled or counterfeit toys
- Toys that emit loud noises above safe levels

## Storage and Maintenance

Even safe toys can become hazardous if not maintained properly. Regularly inspect toys for damage and clean them according to manufacturer instructions.

Remember: A safe toy is a happy toy!`,
  },
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = blogPosts[params.slug];

  return {
    title: post ? `${post.title} - ToyCart Studio Blog` : 'Blog Post Not Found',
    description: post?.excerpt || 'Read more on ToyCart Studio Blog',
  };
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Post Not Found</h1>
          <p className="text-foreground/60">
            Sorry, we couldn't find the blog post you're looking for.
          </p>
          <a href="/blog" className="text-primary font-semibold hover:underline">
            Back to Blog
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-foreground/60">
          <a href="/" className="hover:text-foreground transition-colors">
            Home
          </a>
          <span>/</span>
          <a href="/blog" className="hover:text-foreground transition-colors">
            Blog
          </a>
          <span>/</span>
          <span className="text-foreground font-semibold truncate">{post.title}</span>
        </div>

        {/* Featured Image */}
        <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden mb-8">
          <Image
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Article Header */}
        <article className="space-y-8">
          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight text-balance">
              {post.title}
            </h1>
            <p className="text-xl text-foreground/60 text-balance">
              {post.excerpt}
            </p>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-foreground/60 border-t border-b border-border py-4">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-accent" />
              <span className="font-semibold text-accent uppercase tracking-wide">
                {post.category}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.readTime} min read</span>
            </div>
            <span>{post.date}</span>
            <span>By {post.author}</span>
            <button className="ml-auto md:ml-0 text-primary hover:text-primary/70 transition-colors">
              <Share2 className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="prose prose-sm md:prose-base max-w-none text-foreground/80 space-y-6">
            {post.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('##')) {
                return (
                  <h2
                    key={idx}
                    className="text-2xl font-bold text-foreground mt-8 mb-4"
                  >
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('###')) {
                return (
                  <h3
                    key={idx}
                    className="text-xl font-semibold text-foreground mt-6 mb-3"
                  >
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('-')) {
                return (
                  <ul key={idx} className="space-y-2 list-disc list-inside">
                    {paragraph.split('\n').map((item, i) => (
                      <li key={i} className="text-foreground/80">
                        {item.replace('- ', '')}
                      </li>
                    ))}
                  </ul>
                );
              }
              if (paragraph.match(/^\d\./)) {
                return (
                  <ol key={idx} className="space-y-2 list-decimal list-inside">
                    {paragraph.split('\n').map((item, i) => (
                      <li key={i} className="text-foreground/80">
                        {item.replace(/^\d\. /, '')}
                      </li>
                    ))}
                  </ol>
                );
              }
              return (
                <p key={idx} className="leading-relaxed text-foreground/80">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Call to Action */}
          <div className="mt-12 p-6 md:p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 text-center space-y-4">
            <h3 className="text-2xl font-bold text-foreground">
              Ready to Find the Perfect Toy?
            </h3>
            <p className="text-foreground/60">
              Explore our curated collection and find toys that match your child's interests and age.
            </p>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full">
              Shop Now
            </Button>
          </div>
        </article>

        {/* Navigation */}
        <div className="mt-12 border-t border-border pt-8 flex justify-between">
          <Link
            href="/blog"
            className="text-primary font-semibold hover:underline"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
