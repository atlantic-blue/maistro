const { createBaseConfig } = require('@maistro/rsbuild-config');

module.exports = createBaseConfig({
    port: 3002,
    title: 'Maistro Websites',
    entry: './src/index.tsx',
});