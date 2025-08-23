import path from 'path'
import { Configuration, WebpackPluginInstance } from 'webpack'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import { StatsWriterPlugin } from "webpack-stats-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import Dotenv from "dotenv-webpack"

import { WebpackArgs, WebpackPaths } from './types'
import jsRule from './rules/jsRule'
import cssRule from './rules/cssRule'
import urlRule from './rules/urlRule'
import createWebpackEnv from './utils/createWebpackEnv'

const createWebpackPaths = (root: string): WebpackPaths => {
    return {
        root,
        src: path.resolve(root, 'src', 'index.browser'),
        build: path.resolve(root, 'dist', 'public'),
    }
}

const PATH_ROOT = path.resolve(__dirname, "..", "..")

const createWebpackConfig = (args: WebpackArgs): Configuration => {
    const env = createWebpackEnv(args)
    const paths = createWebpackPaths(PATH_ROOT)

    return {
        target: "web",
        entry: paths.src,
        mode: env.isProduction() ? "production" : "development",
        devtool: env.isProduction() ? "cheap-module-source-map" : "nosources-source-map",
        optimization: {
            runtimeChunk: "single",
            splitChunks: {
                cacheGroups: {
                    // TODO: Customize code splitting to your needs
                    vendor: {
                        name: "vendor",
                        test: /[\\/]node_modules[\\/]/,
                        chunks: "all",
                    },
                    components: {
                        name: "components",
                        test: /[\\/]src[\\/]components[\\/]/,
                        chunks: "all",
                        minSize: 0,
                    },
                    pages: {
                        name: "pages",
                        test: /[\\/]src[\\/]pages[\\/]/,
                        chunks: "all",
                        minSize: 0,
                    },
                },
            },
        },
        performance: {
            // Turn off size warnings for entry points
            hints: false,
        },
        module: {
            rules: [
                jsRule,
                urlRule,
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader',
                        'sass-loader',
                    ],
                    },
                    {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader',
                    ],
                },
            ],
        },
        plugins: [
            /**
             * .env
             */
            new Dotenv({
                path: path.join(paths.root, '.env'),
            }) as unknown as WebpackPluginInstance,

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
            }) as unknown as WebpackPluginInstance,

            /**
             * Extract CSS
             */
            new MiniCssExtractPlugin({
                filename: "[name].[contenthash:8].css",
            }) as unknown as WebpackPluginInstance,,

            /**
             * Create Stats
             */
            new StatsWriterPlugin({
                filename: "stats.json",
                transform(data, _opts) {
                    const assets = data.assetsByChunkName as Record<string, Array<string>>;
                    const stats = JSON.stringify(
                        {
                            scripts: Object.entries(assets).flatMap(([_asset, files]) => {
                                return files
                                    .filter((filename) => filename.endsWith(".js") && !/\.hot-update\./.test(filename))
                                    .map(filename => `public/${filename}`);
                            }),
                            styles: Object.entries(assets).flatMap(([_asset, files]) => {
                                return files.filter((filename) => filename.endsWith(".css") && !/\.hot-update\./.test(filename))
                                    .map(filename => `public/${filename}`);
                            }),
                        },
                        null,
                        2,
                    );
                    return stats;
                },
            }) as unknown as WebpackPluginInstance,
        ],
        resolve: {
            plugins: [
            ],
            extensions: ['.tsx', '.ts', '.js', '.jsx'],
        },
        output: {
            crossOriginLoading: "anonymous",
            path: paths.build,
            filename: "[name].[contenthash:8].js",
            sourceMapFilename: "[file].map",
            chunkFilename: 'chunk.[name].[contenthash].js',
        },
    }
}

export default createWebpackConfig
