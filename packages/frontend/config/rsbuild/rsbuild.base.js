const { defineConfig } = require('@rsbuild/core');
const { pluginReact } = require('@rsbuild/plugin-react');

const createBaseConfig = (options = {}) => {
    return defineConfig({
        plugins: [pluginReact()],
        source: {
            entry: {
                index: options.entry || './src/index.ts'
            }
        },
        dev: {
            port: options.port || 3000,
            writeToDisk: options.writeToDisk || false
        },
        html: {
            title: options.title || 'Maistro Boost'
        },
        output: {
            distPath: {
                root: 'dist',
                js: 'static/js',
                css: 'static/css',
                assets: 'static/assets'
            },
            cleanDistPath: true
        },
        tools: {
            bundlerChain: options.bundlerChain || undefined
        }
    });
};

module.exports = { createBaseConfig };
