'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef, useCallback } from 'react'
import { ChevronRight, Home } from 'lucide-react'

const routeLabels: Record<string, string> = {
  '/': 'Home',
  '/clients': 'Portfolio',
  '/reviews': 'Reviews',
  '/contact': 'Contact',
}

export function RouteIndicator() {
  const pathname = usePathname()
  const [bottomOffset, setBottomOffset] = useState(24)
  const rafRef = useRef<number>(0)

  const updatePosition = useCallback(() => {
    const footer = document.querySelector('footer')
    if (!footer) return
    const footerRect = footer.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const desiredBottom = 24
    if (footerRect.top < viewportHeight) {
      setBottomOffset(viewportHeight - footerRect.top + desiredBottom)
    } else {
      setBottomOffset(desiredBottom)
    }
  }, [])

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(updatePosition)
    }
    updatePosition()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [updatePosition])

  if (pathname === '/' || pathname === '/contact' || pathname.startsWith('/admin')) return null

  const isCompanyPage = pathname.startsWith('/clients/')
  const segments = pathname.split('/').filter(Boolean)
  const crumbs: { label: string; path: string }[] = [{ label: 'Home', path: '/' }]

  if (isCompanyPage) {
    crumbs.push({ label: 'Portfolio', path: '/clients' })
    const slug = segments[1] || ''
    crumbs.push({ label: slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), path: pathname })
  } else {
    crumbs.push({ label: routeLabels[pathname] || segments[0] || '', path: pathname })
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        style={{ bottom: `${bottomOffset}px` }}
        className="fixed left-1/2 -translate-x-1/2 z-40 transition-[bottom] duration-300 ease-out"
      >
        <div className="flex items-center gap-1.5 bg-card/90 backdrop-blur-md border border-border/50 rounded-full px-4 py-2 shadow-lg">
          {crumbs.map((crumb, i) => (
            <span key={crumb.path} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="w-3 h-3 text-muted-foreground" />}
              {i === crumbs.length - 1 ? (
                <span className="text-xs font-display font-semibold text-primary">
                  {i === 0 ? <Home className="w-3 h-3" /> : crumb.label}
                </span>
              ) : (
                <Link href={crumb.path} className="text-xs font-display text-muted-foreground hover:text-foreground transition-colors">
                  {i === 0 ? <Home className="w-3 h-3" /> : crumb.label}
                </Link>
              )}
            </span>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
