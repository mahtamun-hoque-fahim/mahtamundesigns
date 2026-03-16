'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CmsMap } from '@/lib/supabase/query-types'
import { getCms } from '@/lib/supabase/query-types'

export function Header({ cms }: { cms: CmsMap }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const c = (page: string, section: string, key: string, fallback: string) =>
    getCms(cms, page, section, key, fallback)

  const navLinks = [
    { label: c('global', 'header', 'nav_home', 'Home'), path: '/' },
    { label: c('global', 'header', 'nav_portfolio', 'Portfolio'), path: '/clients' },
    { label: c('global', 'header', 'nav_reviews', 'Reviews'), path: '/reviews' },
    { label: c('global', 'header', 'nav_contact', 'Contact'), path: '/contact' },
  ]

  const ctaText = c('global', 'header', 'cta_text', 'Book a Meeting')
  const ctaUrl = c('global', 'header', 'cta_url', 'https://wa.me/8801795931345')
  const brandName = c('global', 'header', 'brand_name', 'MAHTAMUN')

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-xl font-bold tracking-tight text-foreground">
          {brandName}<span className="text-primary">.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === link.path ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-display font-semibold tracking-wide hover:bg-primary/90 transition-all duration-300"
          >
            {ctaText}
          </a>
        </nav>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-foreground p-2"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <nav className="container mx-auto px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'text-sm font-medium transition-colors py-2',
                  pathname === link.path ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center justify-center h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-display font-semibold tracking-wide hover:bg-primary/90 transition-all duration-300 w-fit"
            >
              {ctaText}
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
