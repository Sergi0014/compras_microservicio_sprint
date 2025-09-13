/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html"
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Paleta Tigo Auténtica
                tigo: {
                    // Azul corporativo Tigo (color principal)
                    blue: {
                        50: '#e6f0ff',
                        100: '#cce0ff',
                        200: '#99c2ff',
                        300: '#66a3ff',
                        400: '#3385ff',
                        500: '#0066ff',
                        600: '#0052cc',
                        700: '#003d82', // Azul corporativo principal
                        800: '#002952',
                        900: '#001429',
                        950: '#000a14'
                    },
                    // Verde/Lima Tigo (color secundario)
                    lime: {
                        50: '#f7ffe0',
                        100: '#ecfccb',
                        200: '#d9f99d',
                        300: '#bef264',
                        400: '#a3e635',
                        500: '#84cc16', // Verde lima principal
                        600: '#65a30d',
                        700: '#4d7c0f',
                        800: '#365314',
                        900: '#1a2e05'
                    },
                    // Amarillo Tigo (acento)
                    yellow: {
                        50: '#fffbeb',
                        100: '#fef3c7',
                        200: '#fde68a',
                        300: '#fcd34d',
                        400: '#fbbf24',
                        500: '#f59e0b', // Amarillo Tigo
                        600: '#d97706',
                        700: '#b45309',
                        800: '#92400e',
                        900: '#78350f'
                    },
                    // Grises para interfaces
                    gray: {
                        50: '#f8fafc',
                        100: '#f1f5f9',
                        200: '#e2e8f0',
                        300: '#cbd5e1',
                        400: '#94a3b8',
                        500: '#64748b',
                        600: '#475569',
                        700: '#334155',
                        800: '#1e293b',
                        900: '#0f172a',
                        950: '#020617'
                    }
                },
                // Colores de estado
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
                info: '#3b82f6'
            },
            fontFamily: {
                'inter': ['Inter', 'system-ui', 'sans-serif'],
                'ibm-plex': ['IBM Plex Sans', 'system-ui', 'sans-serif'],
                'plex-mono': ['IBM Plex Mono', 'Consolas', 'monospace']
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-in': 'slideIn 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'bounce-subtle': 'bounceSubtle 1s ease-in-out infinite'
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                },
                slideIn: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(0)' }
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' }
                },
                bounceSubtle: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' }
                }
            },
            boxShadow: {
                'tigo': '0 4px 14px 0 rgba(37, 99, 235, 0.1)',
                'tigo-lg': '0 10px 25px -3px rgba(37, 99, 235, 0.1), 0 4px 6px -2px rgba(37, 99, 235, 0.05)',
                'lime': '0 4px 14px 0 rgba(132, 204, 22, 0.15)',
                'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem'
            },
            borderRadius: {
                'xl': '0.75rem',
                '2xl': '1rem',
                '3xl': '1.5rem'
            },
            backdropBlur: {
                xs: '2px'
            }
        }
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography')
    ],
    safelist: [
        'animate-fade-in',
        'animate-slide-in',
        'animate-scale-in',
        'animate-pulse-slow',
        'animate-bounce-subtle',
        {
            pattern: /(bg|text|border)-(tigo|lime|gray)-(50|100|200|300|400|500|600|700|800|900|950)/,
            variants: ['hover', 'focus', 'active', 'dark']
        },
        {
            pattern: /shadow-(tigo|lime|card|card-hover)/,
            variants: ['hover', 'focus']
        }
    ]
}
