const { maistroColours } = require("./src/colours");
const { typography } = require('./src/styles/typography');

module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: maistroColours,
            fontFamily: typography.fontFamily,
            fontSize: typography.fontSize,
            fontWeight: typography.fontWeight,
            lineHeight: typography.lineHeight,
            letterSpacing: typography.letterSpacing,
        },
    },
    plugins: [],
};
