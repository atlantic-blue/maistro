const { createBaseConfig } = require('@maistro/rsbuild-config');

module.exports = createBaseConfig({
    port: 3002,
    title: 'Maistro Funnels',
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