import path from 'path'
import { Configuration } from 'webpack'
import CssMinimizerPlugin from "css-minimizer-webpack-plugin"

import jsRule from './rules/jsRules'
import cssRule from './rules/cssRule'

import createWebpackEnv from './utils/createWebpackEnv'
import createWebpackPaths from './utils/createWebpackPaths'

import MiniCssExtractPlugin from "mini-css-extract-plugin"
import { WebpackArgs } from './types'

const PATH_ROOT = path.resolve(__dirname, '..', '..')

const createWebpackConfig = (args: WebpackArgs): Configuration => {
    const env = createWebpackEnv(args)
    const paths = createWebpackPaths(PATH_ROOT)

    return {
        mode: 'production',
        entry: path.resolve(paths.root, "src", "client"),
        output: {
            path: path.resolve(paths.root, "assets", "client-js"),
            filename: '[name].js',
            publicPath: '/',
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js', 'jsx'],
        },
        module: {
            rules: [jsRule, cssRule],
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: "css/[name].css",
            })
        ],
        devtool: 'source-map',
        cache: false,
        optimization: {
            minimizer: [new CssMinimizerPlugin()],
            minimize: true
        },
    }
}

export default createWebpackConfig
