/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#00704A', // Brand Green
                    hover: '#005c3d',
                },
                secondary: {
                    DEFAULT: '#1E3A8A', // Deep Blue
                    hover: '#1e3a8a',
                },
                accent: {
                    DEFAULT: '#F97316', // Vibrant Orange for details
                    hover: '#ea580c',
                    foreground: '#ffffff',
                    light: '#FFF7ED', // Orange-50
                },
                destructive: {
                  DEFAULT: '#ef4444',
                  foreground: '#ffffff',
                },
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
            },
            animation: {
                blob: "blob 7s infinite",
                shimmer: "shimmer 3s ease-in-out infinite",
                'glow-border': "glow-border 2s ease-in-out infinite",
                float: "float 20s ease-in-out infinite",
            },
            keyframes: {
                blob: {
                    "0%": {
                        transform: "translate(0px, 0px) scale(1)",
                    },
                    "33%": {
                        transform: "translate(30px, -50px) scale(1.1)",
                    },
                    "66%": {
                        transform: "translate(-20px, 20px) scale(0.9)",
                    },
                    "100%": {
                        transform: "translate(0px, 0px) scale(1)",
                    },
                },
                shimmer: {
                    "0%": {
                        backgroundPosition: "-200% 0",
                    },
                    "100%": {
                        backgroundPosition: "200% 0",
                    },
                },
                'glow-border': {
                    "0%, 100%": {
                        textShadow: "0 0 2px rgba(59, 130, 246, 0.3), 0 0 4px rgba(59, 130, 246, 0.2)",
                    },
                    "50%": {
                        textShadow: "0 0 4px rgba(59, 130, 246, 0.5), 0 0 8px rgba(59, 130, 246, 0.3), 0 0 12px rgba(59, 130, 246, 0.15)",
                    },
                },
                float: {
                    "0%, 100%": {
                        transform: "translateY(0px) translateX(0px)",
                        opacity: "0.15",
                    },
                    "25%": {
                        transform: "translateY(-20px) translateX(10px)",
                        opacity: "0.25",
                    },
                    "50%": {
                        transform: "translateY(-40px) translateX(-5px)",
                        opacity: "0.1",
                    },
                    "75%": {
                        transform: "translateY(-20px) translateX(-10px)",
                        opacity: "0.2",
                    },
                },
            },
        },
    },
    plugins: [],
}
