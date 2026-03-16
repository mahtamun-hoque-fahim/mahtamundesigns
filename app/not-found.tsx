import Link from 'next/link'

export default function NotFound() {
  return (
    <html lang="en" className="dark">
      <body style={{ margin: 0, background: 'hsl(240 6% 6%)', color: 'hsl(45 20% 90%)', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column' }}>
        <h1 style={{ fontSize: '6rem', fontWeight: 700, margin: 0, color: 'hsl(263 70% 58%)' }}>404</h1>
        <p style={{ color: 'hsl(240 5% 50%)', marginBottom: '2rem' }}>Page not found</p>
        <Link href="/" style={{ color: 'hsl(263 70% 58%)', textDecoration: 'none' }}>← Back Home</Link>
      </body>
    </html>
  )
}
