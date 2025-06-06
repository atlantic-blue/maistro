import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CircularDependencyPlugin from "circular-dependency-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import path from 'path'
import webpack from 'webpack'
import { EnvironmentPlugin, WebpackPluginInstance } from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import Dotenv from "dotenv-webpack"

import { WebpackEnv, WebpackPaths } from '../types'

const createWebpackPlugins = (
    env: WebpackEnv,
    paths: WebpackPaths
): WebpackPluginInstance[] => {
    const plugins: WebpackPluginInstance[] = [
        new EnvironmentPlugin(env),
        new Dotenv(),

        /**
         * Provide HTML template
         */
        new HtmlWebpackPlugin({
            template: path.join(paths.root, 'public', 'index.html'),
        }),
        /**
         * Add public to dist
         */
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.join(paths.root, 'public'),
                    to: path.join(paths.root, 'dist', 'public'),
                },
            ],
        }),

        /**
         * Add robots.txt
         */
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.join(paths.root, 'public', 'robots.txt'),
                    to: path.join(paths.root, 'dist'),
                },
            ],
        }),


        new CircularDependencyPlugin({
            exclude: /node_modules/,
            failOnError: true, // Set true if you want builds to fail
          }) as any as WebpackPluginInstance,
        // new MiniCssExtractPlugin({
        //     filename: "css/[name][contenthash].css",
        // }),
    ]

    if (env.ANALYSE) {
        plugins.push(
            new BundleAnalyzerPlugin({
                openAnalyzer: true,
            })
        )
    }

    if (env.isDevelopment()) {
        plugins.push(new webpack.HotModuleReplacementPlugin())
    }

    return plugins
}

export default createWebpackPlugins
