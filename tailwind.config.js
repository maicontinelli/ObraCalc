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
                    DEFAULT: '#2563EB', // Royal Blue
                    hover: '#1D4ED8',
                },
                secondary: '#1E3A8A', // Dark Blue
                accent: {
                    DEFAULT: '#2563EB',
                    foreground: '#ffffff',
                    light: '#EFF6FF', // Light Blue
                },
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
            },
            animation: {
                blob: "blob 7s infinite",
                shimmer: "shimmer 3s ease-in-out infinite",
                'glow-border': "glow-border 2s ease-in-out infinite",
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
            },
        },
    },
    plugins: [],
}
