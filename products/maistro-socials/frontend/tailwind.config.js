module.exports = {
    content: [
        './src/**/*.{js,jsx,ts,tsx}',
        '../../../packages/frontend/ui/src/**/*.{js,jsx,ts,tsx}'
    ],
    theme: {
        extend: {

        },
    },
    presets: [
        require('../../../packages/frontend/ui/tailwind.config.js')
    ],
    plugins: [],
};
