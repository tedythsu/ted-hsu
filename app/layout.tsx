import type { Metadata } from 'next'
import { Geist, Geist_Mono, DM_Serif_Display } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { site } from '@/data/site'

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
  metadataBase: new URL(site.url),
  title: `${site.name} — ${site.nameFull}`,
  description: site.description,
  openGraph: {
    title: `${site.name} — ${site.nameFull}`,
    description: site.description,
    images: [{ url: site.ogImage, width: 1200, height: 630 }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-TW" className={`${geistSans.variable} ${geistMono.variable} ${dmSerif.variable}`} style={{ background: '#09090b' }}>
      <body className="bg-zinc-950 text-zinc-100 antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
