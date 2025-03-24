const { createBaseConfig } = require('@maistro/rsbuild-config');

module.exports = createBaseConfig({
    port: 3001,
    title: 'Maistro Socials',
    entry: './src/index.ts',
});