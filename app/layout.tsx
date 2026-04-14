import type { Metadata } from 'next'
import { Geist, Geist_Mono, DM_Serif_Display } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { profile } from '@/data/profile'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const dmSerif = DM_Serif_Display({
  variable: '--font-dm-serif',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://tedythsu.vercel.app'),
  title: `${profile.name} — Frontend Engineer`,
  description: profile.seo.description,
  openGraph: {
    title: `${profile.name} — Frontend Engineer`,
    description: profile.seo.description,
    images: [{ url: profile.seo.ogImage, width: 1200, height: 630 }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // inline style prevents white flash before CSS loads
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${dmSerif.variable}`} style={{ background: '#09090b' }}>
      <body className="bg-zinc-950 text-zinc-100 antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
