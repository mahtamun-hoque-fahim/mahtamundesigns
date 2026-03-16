'use client'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  aspectRatio?: 'auto' | 'square' | 'video' | 'portrait'
  fill?: boolean
}

const aspectClasses = {
  auto: '',
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[3/4]',
}

export function LazyImage({ src, alt, className, aspectRatio = 'auto', fill = false }: LazyImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <div className={cn('overflow-hidden bg-muted relative', aspectRatio !== 'auto' && aspectClasses[aspectRatio], className)}>
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-sm">Image</div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={cn(
            'transition-opacity duration-500',
            fill ? 'absolute inset-0 w-full h-full object-cover' : 'w-full h-full object-cover',
            loaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}
    </div>
  )
}
