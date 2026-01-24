'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

interface InstagramStory {
  id: number;
  username: string;
  avatar: string;
  image: string;
  viewed: boolean;
}

interface InstagramPost {
  id: number;
  username: string;
  avatar: string;
  image: string;
  likes: number;
  comments: number;
  caption: string;
  timestamp: string;
  liked: boolean;
}

const stories: InstagramStory[] = [
  {
    id: 1,
    username: 'New Drops',
    avatar: '',
    image: '/hero-toys-1.jpg',
    viewed: false,
  },
  {
    id: 2,
    username: 'Unboxing',
    avatar: '',
    image: '/studio-collection.jpg',
    viewed: false,
  },
  {
    id: 3,
    username: 'Fan Love',
    avatar: '',
    image: '/hero-toys-1.jpg',
    viewed: true,
  },
  {
    id: 4,
    username: 'Studio Life',
    avatar: '',
    image: '/studio-collection.jpg',
    viewed: true,
  },
  {
    id: 5,
    username: 'Safe Play',
    avatar: '',
    image: '/hero-toys-1.jpg',
    viewed: false,
  },
];

const posts: InstagramPost[] = [
  {
    id: 1,
    username: 'toycart.studio',
    avatar: '🎮',
    image: '/hero-toys-1.jpg',
    likes: 2543,
    comments: 128,
    caption: 'Superhero collection just dropped! Every toy tells a story of adventure and imagination. Which character is your favorite?',
    timestamp: '2 days ago',
    liked: false,
  },
  {
    id: 2,
    username: 'toycart.studio',
    avatar: '🎮',
    image: '/studio-collection.jpg',
    likes: 3891,
    comments: 245,
    caption: 'Our customers love these collectible figures! Limited edition pieces that make perfect gifts. Grab yours before they are gone!',
    timestamp: '1 week ago',
    liked: false,
  },
  {
    id: 3,
    username: 'toycart.studio',
    avatar: '🎮',
    image: '/hero-toys-1.jpg',
    likes: 5234,
    comments: 367,
    caption: 'Unboxing the new Cartoon Favorites collection! These adorable characters bring joy to every playroom. Who wants to see more?',
    timestamp: '10 days ago',
    liked: false,
  },
];

export default function InstagramSection() {
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  const toggleLike = (postId: number) => {
    const newLiked = new Set(likedPosts);
    if (newLiked.has(postId)) {
      newLiked.delete(postId);
    } else {
      newLiked.add(postId);
    }
    setLikedPosts(newLiked);
  };

  return (
    <section className="py-16 md:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-16 space-y-4 text-center animate-fadeInUp">
          <div className="flex items-center justify-center gap-2 mb-2 animate-fadeIn">
            <span className="text-4xl animate-pulse-slow">📸</span>
            <h2
              className="text-4xl md:text-5xl font-bold text-foreground animate-slideUp"
              style={{ fontFamily: 'var(--font-heading)', animationDelay: '0.1s' }}
            >
              Follow Our Story
            </h2>
          </div>
          <p className="text-lg text-foreground/70 font-medium leading-relaxed animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            Join thousands of happy kids and parents sharing their toy moments with us
          </p>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-primary font-bold hover:underline"
          >
            @toycart.studio
          </a>
        </div>

        {/* Stories Section */}
        <div className="mb-12 md:mb-16">
          <div className="flex gap-6 md:gap-8 overflow-x-auto pb-4 md:pb-0 justify-center items-center">
            {stories.map((story, index) => {
              // Alternate gradient direction: even indices get orange-to-purple, odd get purple-to-orange
              const gradientStyle = index % 2 === 0 
                ? { background: 'linear-gradient(to bottom right, #f97316, #a855f7)' }
                : { background: 'linear-gradient(to bottom right, #a855f7, #f97316)' };
              
              return (
                <div
                  key={story.id}
                  className="flex-shrink-0 flex flex-col items-center gap-3 group cursor-pointer"
                >
                  <div
                    className="relative w-24 h-24 md:w-28 md:h-28 rounded-full p-[3px] transition-all duration-300 hover:scale-105"
                    style={gradientStyle}
                  >
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-background">
                      <Image
                        src={story.image || "/placeholder.svg"}
                        alt={story.username}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                  </div>
                  <p className="text-foreground font-medium text-sm md:text-base text-center whitespace-nowrap">
                    {story.username}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Posts Section */}
        <div>
          <h3
            className="text-2xl md:text-3xl font-bold text-foreground mb-8 md:mb-12"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Latest Posts
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {posts.map((post, idx) => (
              <div
                key={post.id}
                className="group rounded-2xl overflow-hidden border-2 border-muted hover:border-primary/50 transition-all duration-500 bg-card shadow-lg hover:shadow-2xl hover:shadow-primary/20 animate-slideUp"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Post Image */}
                <div className="relative h-72 overflow-hidden bg-muted">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.caption}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500 flex items-center justify-center gap-6 opacity-0 group-hover:opacity-100">
                    <div className="flex flex-col items-center gap-2">
                      <Heart className="h-8 w-8 text-white" />
                      <span className="text-white font-bold text-sm">Like</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <MessageCircle className="h-8 w-8 text-white" />
                      <span className="text-white font-bold text-sm">Comment</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Share2 className="h-8 w-8 text-white" />
                      <span className="text-white font-bold text-sm">Share</span>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-5 md:p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl">
                      {post.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm">
                        {post.username}
                      </p>
                      <p className="text-foreground/50 text-xs">{post.timestamp}</p>
                    </div>
                  </div>

                  {/* Caption */}
                  <p className="text-foreground/80 text-sm leading-relaxed line-clamp-3">
                    {post.caption}
                  </p>

                  {/* Engagement */}
                  <div className="flex items-center gap-6 pt-3 border-t border-muted">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className="flex items-center gap-2 group/like transition-all duration-300 hover:text-red-500"
                    >
                      <Heart
                        className={`h-5 w-5 transition-all duration-300 ${
                          likedPosts.has(post.id)
                            ? 'fill-red-500 text-red-500'
                            : 'text-foreground/60'
                        }`}
                      />
                      <span className="text-sm font-semibold text-foreground/70">
                        {likedPosts.has(post.id)
                          ? post.likes + 1
                          : post.likes}
                      </span>
                    </button>
                    <button className="flex items-center gap-2 transition-all duration-300 hover:text-primary">
                      <MessageCircle className="h-5 w-5 text-foreground/60" />
                      <span className="text-sm font-semibold text-foreground/70">
                        {post.comments}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View More */}
          <div className="flex justify-center mt-12 md:mt-16">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              View More on Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
