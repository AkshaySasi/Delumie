/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                sage: {
                    50: '#F4F7F5',
                    100: '#E3EBE6',
                    200: '#C5D6CC',
                    300: '#A3Beb0',
                    400: '#84A995', // Secondary
                    500: '#69927D',
                    600: '#52796F', // Primary
                    700: '#3F5D56',
                    800: '#2F4540',
                    900: '#202F2C',
                },
                calm: {
                    50: '#FAF9F6', // Cream
                    100: '#F5F5F0',
                    200: '#EAEAE0',
                    800: '#2F3E46', // Dark Slate
                }
            },
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
