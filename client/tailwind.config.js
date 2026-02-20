/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // The Void (Backgrounds)
                black: {
                    DEFAULT: '#000000',
                    900: '#050505',
                    800: '#0a0a0a',
                    700: '#121212',
                },
                // The Matrix (Accents)
                neon: {
                    green: '#00ff41',
                    dim: '#008F11',
                    bright: '#39ff14',
                },
                // The Text (Content)
                white: {
                    DEFAULT: '#ffffff',
                    dim: '#a3a3a3',
                }
            },
            boxShadow: {
                'neon-dim': '0 0 15px rgba(0, 143, 17, 0.1)',
                'neon-hover': '0 0 20px rgba(0, 255, 65, 0.2)',
            },
            dropShadow: {
                'neon-glow': '0 0 5px rgba(0, 255, 65, 0.8)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                'pulse-glow': 'pulseGlow 3s infinite',
                'scanline': 'scanline 8s linear infinite',
                'grid-pulse': 'gridPulse 4s ease-in-out infinite',
                'grid-scroll': 'gridScroll 20s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 5px #008F11', borderColor: '#008F11' },
                    '50%': { boxShadow: '0 0 20px #00ff41', borderColor: '#00ff41' },
                },
                scanline: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100%)' },
                },
                gridPulse: {
                    '0%, 100%': { opacity: '0.2' },
                    '50%': { opacity: '0.4' },
                },
                gridScroll: {
                    '0%': { backgroundPosition: '0 0' },
                    '100%': { backgroundPosition: '40px 40px' },
                }
            }
        },
    },
    plugins: [],
}
