const { createBaseConfig } = require('@maistro/rsbuild-config');

module.exports = createBaseConfig({
    port: 3000,
    title: 'Maistro Websites',
    entry: './src/index.ts',
});