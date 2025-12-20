/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb',
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'fvqaczvjimslzupfrjrm.supabase.co',
                port: '',
                pathname: '/storage/v1/object/public/**',
            },
        ],
    },
    env: {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fvqaczvjimslzupfrjrm.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2cWFjenZqaW1zbHp1cGZyanJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMzI2NTQsImV4cCI6MjA3ODgwODY1NH0.2rG53jx_dKGf61mykgUdMzS1VsxZKI1wWa2QvlwPSv4'
    }
}

module.exports = nextConfig
