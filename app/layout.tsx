import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono, Fredoka, Poppins } from 'next/font/google'
// Vercel Analytics - Only works on Vercel, disabled for Render
// import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/context/cart-context'
import { AuthProvider } from '@/context/auth-context'
import Header from '@/components/header'
import Footer from '@/components/footer'
import './globals.css'

const _geist = Geist({ subsets: ["latin"], weight: ["400", "500", "600"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _fredoka = Fredoka({ subsets: ["latin"], variable: "--font-display", weight: ["400", "500", "600"] });
const _poppins = Poppins({ weight: ["500", "600", "700", "800"], subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  title: 'ToyCart Studio - Modern Kids Toys & Characters',
  description: 'Shop curated cartoon, superhero, and character toys in our modern studio-aesthetic toy store',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#f5e6d3',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${_fredoka.variable} ${_poppins.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
        {/* Vercel Analytics - Only works on Vercel */}
        {/* <Analytics /> */}
      </body>
    </html>
  )
}
