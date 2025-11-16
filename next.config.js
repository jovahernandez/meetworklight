/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb',
        },
    },
    // Disable build-time page data collection for API routes
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.externals = config.externals || [];
            // Don't bundle infrastructure code in build output
            config.externals.push({
                '@/infrastructure/supabase/SupabaseAuthService': 'commonjs @/infrastructure/supabase/SupabaseAuthService',
                '@/infrastructure/supabase/SupabaseUserRepository': 'commonjs @/infrastructure/supabase/SupabaseUserRepository',
                '@/infrastructure/supabase/SupabaseJobPostingRepository': 'commonjs @/infrastructure/supabase/SupabaseJobPostingRepository',
                '@/infrastructure/supabase/SupabaseRecruiterProfileRepository': 'commonjs @/infrastructure/supabase/SupabaseRecruiterProfileRepository',
            });
        }
        return config;
    },
}

module.exports = nextConfig
