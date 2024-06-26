import { RuleSetRule } from 'webpack'
import MiniCssExtractPlugin from "mini-css-extract-plugin"

const sassCss: RuleSetRule = {
    test: /\.s[ac]ss$/i,
    use: [
        {
            loader: MiniCssExtractPlugin.loader,
        },
        {
            loader: 'css-loader',
            options: {
                modules: {
                    // localIdentName: '[name]___[local]___[hash:base64:5]',  // TODO hashing makes posting css to pages hard
                    localIdentName: '[name]___[local]',
                    namedExport: true,
                },
                importLoaders: 1,
                url: true,
                import: true,
            },
        },
        {
            loader: 'sass-loader',
        },
    ],
}

/**
 * Imports raw css, helpful when using 3rd party libraries such as prism
 * e.g:
 * import 'prismjs/themes/prism-tomorrow?raw';
 */
const rawCss: RuleSetRule = {
    test: /\.css$/,
    resourceQuery: /^\?raw$/,
    use: [
        {
            loader: MiniCssExtractPlugin.loader,
        },
        {
            loader: 'css-loader',
        },
    ],
}

const cssRule: RuleSetRule = ({
    oneOf: [rawCss, sassCss],
})

export default cssRule
