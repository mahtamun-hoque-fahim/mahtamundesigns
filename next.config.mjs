/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rxrfnscinvfrmkwghylu.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    // Suppress the _not-found prerender issue with certain Radix components
    missingSuspenseWithCSRBailout: false,
  },
}

export default nextConfig
