import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Meetwork branding colors - Verde primario según PDF
                primary: {
                    DEFAULT: '#3EBF4E', // Verde Meetwork primario
                    light: '#7FD98A', // Verde claro
                    dark: '#1F9D47', // Verde oscuro
                },
                accent: {
                    DEFAULT: '#FFC700', // Amarillo acento
                    light: '#FFD633',
                    dark: '#CC9F00',
                },
                secondary: {
                    green: '#7FD98A', // Verde claro secundario
                    teal: '#17A398', // Turquesa secundario
                    coral: '#FF6B6B', // Coral/Rojo acento
                    yellow: '#FFC700', // Amarillo acento
                },
                neutral: {
                    50: '#F9FAFB',
                    100: '#F3F4F6',
                    200: '#E5E7EB',
                    300: '#D1D5DB',
                    400: '#9CA3AF',
                    500: '#6B7280',
                    600: '#4B5563',
                    700: '#374151',
                    800: '#1F2937',
                    900: '#111827',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                heading: ['Montserrat', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
export default config
