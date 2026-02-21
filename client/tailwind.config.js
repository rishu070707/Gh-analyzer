/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'ui-monospace', 'monospace'],
            },
            colors: {
                // ── Backgrounds ──────────────────────────
                black: {
                    DEFAULT: '#000000',
                    900: '#050505',
                    800: '#0c0c0f',
                    750: '#101014',
                    700: '#131318',
                    600: '#1a1a22',
                },
                // ── Primary accent: Sage Neon Green ──────
                neon: {
                    green: '#4ade80',   // softer, more premium emerald-green
                    dim: '#16a34a',   // muted for borders/accents
                    bright: '#86efac',  // light for headlines
                },
                // ── Extended palette ──────────────────────
                emerald: {
                    neon: '#34d399',
                },
                cyan: {
                    neon: '#22d3ee',
                },
                violet: {
                    neon: '#a78bfa',
                },
                amber: {
                    neon: '#fbbf24',
                },
                rose: {
                    neon: '#fb7185',
                },
            },
            boxShadow: {
                'neon-dim': '0 0 20px rgba(74, 222, 128, 0.08)',
                'neon-hover': '0 0 30px rgba(134, 239, 172, 0.15)',
                'neon-glow': '0 0 40px rgba(74, 222, 128, 0.2)',
                'card': '0 1px 3px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.4)',
            },
            dropShadow: {
                'neon-glow': '0 0 6px rgba(74, 222, 128, 0.6)',
            },
            animation: {
                'fade-in': 'fadeIn 0.4s ease-out',
                'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                'pulse-glow': 'pulseGlow 4s infinite',
                'scanline': 'scanline 8s linear infinite',
                'grid-scroll': 'gridScroll 30s linear infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(4px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(24px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 6px rgba(74, 222, 128, 0.15)', borderColor: 'rgba(22, 163, 74, 0.4)' },
                    '50%': { boxShadow: '0 0 20px rgba(74, 222, 128, 0.3)', borderColor: 'rgba(74, 222, 128, 0.6)' },
                },
                gridScroll: {
                    '0%': { backgroundPosition: '0 0' },
                    '100%': { backgroundPosition: '40px 40px' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-6px)' },
                },
            },
            letterSpacing: {
                'terminal': '0.12em',
                'display': '-0.03em',
            },
        },
    },
    plugins: [],
}
