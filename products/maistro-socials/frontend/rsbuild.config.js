const { createBaseConfig } = require('@maistro/rsbuild-config');

module.exports = createBaseConfig({
    port: 3001,
    title: 'Maistro Websites',
    entry: './src/index.tsx',
});