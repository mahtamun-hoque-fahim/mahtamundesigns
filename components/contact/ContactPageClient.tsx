'use client'
import { motion } from 'framer-motion'
import { Instagram, Globe, Dribbble, Mail } from 'lucide-react'
import { ContactForm } from '@/components/shared/ContactForm'
import type { LogoStripItem, CmsMap } from '@/lib/supabase/query-types'
import { getCms } from '@/lib/supabase/query-types'

export function ContactPageClient({ logoItems, cms }: { logoItems: LogoStripItem[]; cms: CmsMap }) {
  const c = (p: string, s: string, k: string, f: string) => getCms(cms, p, s, k, f)
  const doubled = [...logoItems, ...logoItems]
  const email = c('contact','form','email','mahtamunhoquefahim@pm.me')
  const whatsapp = c('contact','form','whatsapp','+880 1795 931345')
  const whatsappUrl = c('contact','form','whatsapp_url','https://wa.me/8801795931345')
  const socials = [
    { icon: Instagram, label: 'Instagram', href: c('global','footer','instagram_url','#') },
    { icon: Globe, label: 'Behance', href: c('global','footer','behance_url','#') },
    { icon: Dribbble, label: 'Dribbble', href: c('global','footer','dribbble_url','#') },
    { icon: Mail, label: 'Email', href: `mailto:${email}` },
  ]
  const title = c('contact','header','title',"Let's Build Something Together")
  const titleParts = title.split(' ')
  const lastWord = titleParts[titleParts.length - 1]
  const rest = titleParts.slice(0, -1).join(' ')

  return (
    <>
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight">
              {rest} <span className="text-primary">{lastWord}</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl">{c('contact','header','description',"Whether you have a project in mind or just want to say hello — I'd love to hear from you.")}</p>
          </motion.div>
        </div>
      </section>

      {doubled.length > 0 && (
        <section className="py-12 border-y border-border/50 overflow-hidden">
          <div className="container mx-auto px-6 mb-8">
            <p className="text-center text-sm uppercase tracking-[0.3em] text-muted-foreground font-display">{c('contact','brands','title',"Brands I've Worked With")}</p>
          </div>
          <div className="relative">
            <div className="logo-strip-scroll flex items-center gap-16 w-max">
              {doubled.map((item, i) => (
                <div key={`${item.id}-${i}`} className="flex-shrink-0 w-20 h-10 flex items-center justify-center opacity-40">
                  {item.logo_url ? <img src={item.logo_url} alt={item.name} loading="lazy" className="max-w-full max-h-full object-contain grayscale" /> : <div className="w-16 h-8 rounded bg-muted-foreground/10" />}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <h2 className="text-2xl font-display font-bold mb-8">{c('contact','details','title','Get In Touch')}</h2>
              <div className="space-y-6 mb-8">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-display mb-1">Email</p>
                  <a href={`mailto:${email}`} className="text-primary hover:underline">{email}</a>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-display mb-1">WhatsApp</p>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{whatsapp}</a>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-display mb-4">Social</p>
                <div className="flex gap-4">
                  {socials.map(({ icon: Icon, label, href }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all">
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
              <ContactForm sourcePage="/contact" />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
