/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                // Robotic terminal display font for headings
                sans: ['Orbitron', 'Share Tech Mono', 'ui-monospace', 'monospace'],
                // Classic terminal mono for body/code
                mono: ['Share Tech Mono', 'VT323', 'Courier New', 'ui-monospace', 'monospace'],
            },
            colors: {
                // ── Backgrounds ──────────────────────────
                black: {
                    DEFAULT: '#000000',
                    900: '#050505',
                    800: '#080808',
                    750: '#0c0c0c',
                    700: '#101010',
                    600: '#141414',
                },
                // ── Primary accent: Classic Matrix Neon Green ──────
                neon: {
                    green: '#00ff41',   // classic matrix green
                    dim: '#008F11',   // muted for borders/accents
                    bright: '#39ff14',   // electric lime for highlights
                },
                // ── Extended palette ──────────────────────
                emerald: {
                    neon: '#00ff41',
                },
                cyan: {
                    neon: '#00f3ff',
                },
                violet: {
                    neon: '#bc13fe',
                },
                amber: {
                    neon: '#fcee0a',
                },
                rose: {
                    neon: '#ff3131',
                },
            },
            boxShadow: {
                'neon-dim': '0 0 20px rgba(0,255,65,0.12)',
                'neon-hover': '0 0 30px rgba(57,255,20,0.25)',
                'neon-glow': '0 0 40px rgba(0,255,65,0.30)',
                'card': '0 1px 3px rgba(0,0,0,0.8), 0 8px 24px rgba(0,0,0,0.6)',
            },
            dropShadow: {
                'neon-glow': '0 0 8px rgba(0,255,65,0.8)',
            },
            animation: {
                'fade-in': 'fadeIn 0.4s ease-out',
                'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                'pulse-glow': 'pulseGlow 2s infinite',
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
                    '0%, 100%': { boxShadow: '0 0 8px rgba(0,255,65,0.25)', borderColor: 'rgba(0,143,17,0.5)' },
                    '50%': { boxShadow: '0 0 24px rgba(0,255,65,0.50)', borderColor: 'rgba(0,255,65,0.8)' },
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
                'terminal': '0.15em',
                'display': '0.08em',
            },
        },
    },
    plugins: [],
}
