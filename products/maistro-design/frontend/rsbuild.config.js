const { createBaseConfig } = require('@maistro/rsbuild-config');
const path = require("path")

module.exports = createBaseConfig({
    port: 3003,
    title: 'Maistro Design',
    entry: './src/index.ts',

    source: {
        alias: {
          '@maistro/ui': require.resolve('@maistro/ui')
        },
      },
    
      html: {
        template: './public/index.html'
      },

     
      output: {
        cssModules: {
          auto: true,
        }
      },
      tools: {
        typescript: {
            transpileOnly: true
          },
        postcss: {
          postcssOptions: {
            plugins: [
              'tailwindcss',
              'autoprefixer'
            ]
          }
        }
      }
});