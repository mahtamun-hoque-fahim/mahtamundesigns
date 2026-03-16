import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/layout/Providers'

export const metadata: Metadata = {
  title: 'Mahtamun Designs — Logo & Brand Identity Designer',
  description: 'Helping startups and businesses build memorable brands that stand out. From logo concepts to full brand identity systems.',
  metadataBase: new URL('https://mahtamundesigns.vercel.app'),
  openGraph: {
    title: 'Mahtamun Designs',
    description: 'Logo & Brand Identity Designer',
    url: 'https://mahtamundesigns.vercel.app',
    siteName: 'Mahtamun Designs',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
