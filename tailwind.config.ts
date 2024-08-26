import type { Config } from 'tailwindcss';

export const statusColor = {
    placed: '#D3D7FF',
    shipping: '#FADCD9',
    delivered: '#BBEAD9',
    cancelled: '#DFDFDF',
    cancelled_by_admin: '#DFDFDF',
    cancelled_by_customer: '#DFDFDF',
};

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/theme/**/*.{js,ts,jsx,tsx,mdx}',
        './src/styles/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {},
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            width: {
                main: '1280px',
                mobile: '484px',

                'slide-btn': '48px',
            },
            height: {
                header: '80px',
                navbar: '38px',
                'slide-btn': '48px',
            },
            colors: {
                'green-main': '#A3E635',
                'green-main-dark': '#65A30D',
                'green-dark-md': '#065F46',
                'green-86EFAC': '#86EFAC',
                'green-5FA503': '#5FA503',
                'black-main': '#374151',
                'fill-heart': '#FA536B',
                'gray-primary': '#838383',
                'red-primary': '#EF4444',
                'violet-primary': '#505DE8',
                'violet-secondary-2': '#5F4EE0',
                'violet-post-primary': '#B3A8FF',
                'violet-secondary': '#6366F1',
                'blue-primary': '#0EA5E9',
                'grey-secondary': '#666',
                'post-primary': '#3E3771',
                'white-opacity-50': 'rgba(22,24,35,0.5)',
                'white-opacity': 'rgb(22,24,35)',
                'black-040': 'rgba(0,0,0,0.4)',
                placed: '#D3D7FF',
                shipping: '#FADCD9',
                delivered: '#BBEAD9',
                cancelled: '#DFDFDF',
            },
            borderColor: {
                'green-main': '#A3E635',
                'green-main-dark': '#65A30D',
                'gray-primary': '#DBDBDB',
                'orange-primary': '#FF7A00',
                'violet-primary': '#505DE8',
                'violet-secondary': '#6366F1',
                'red-primary': '#EF4444',
                'violet-post-primary': '#B5A8FF',
                placed: '#D3D7FF',
                shipping: '#FADCD9',
                delivered: '#BBEAD9',
                cancelled: '#DFDFDF',
                register: '#FADCD9',
                adopted: '#BBEAD9',
            },
            backgroundColor: {
                'green-65a30d': '#65A30D',
                'orange-primary': '#FF7A00',
                'violet-primary': '#505DE8',
                'violet-secondary': '#6366F1',
                'violet-post-primary': '#B3A8FF',
                placed: '#D3D7FF',
                shipping: '#FADCD9',
                delivered: '#BBEAD9',
                cancelled: '#DFDFDF',
                register: '#FADCD9',
                adopted: '#BBEAD9',
            },
            fontSize: {
                '1xl': '16px',
                '7xl': '48px',
            },
            boxShadow: {
                primary: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
            },
            gridAutoColumns: {
                '5item': '21%',
            },
        },
    },
    plugins: [],
};
export default config;
