import * as path from 'path'

import { Configuration } from 'webpack'

import { WebpackPaths } from './types'

const createWebpackPaths = (root: string): WebpackPaths => {
    return {
        root,
        src: path.resolve(root, 'src'),
        build: path.resolve(root, 'dist'),
    }
}

const PATH_ROOT = path.resolve(__dirname, "..", "..")
const paths = createWebpackPaths(PATH_ROOT)

const createDefaultWebpackConfig = (): Configuration => {
    return {
        target: "node",
        mode: "production",
        optimization: {
            minimize: false, // We don't need to minimize our Lambda code.
            moduleIds: "named",
        },
        performance: {
            // Turn off size warnings for entry points
            hints: false,
        },
        devtool: "nosources-source-map",
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    exclude: /node_modules/,
                    use: 'ts-loader',
                },
            ],
        },
        resolve: {
            plugins: [],
            extensions: ['.tsx', '.ts', '.js', 'jsx'],
        },
        output: {
            libraryTarget: "commonjs2",
            path: paths.build,
            filename: '[name].js',
            sourceMapFilename: "[file].map",
            chunkFilename: 'chunk.[name].[contenthash].js',
        },
    }
}

// TODO implement with fs.readdir
const createMultipleWebpackConfigs = [
    "video-processor"

].map(api => {
    console.info(`BUILDING: ${api}\n`)
    return ({
        ...createDefaultWebpackConfig(),
        entry: {
            ping: path.resolve(paths.src, "lambdas", api, 'index.ts'),
        },
        output: {
            libraryTarget: "commonjs2",
            path: `${paths.build}/${api}`,
            filename: 'index.js',
            sourceMapFilename: "[file].map",
            chunkFilename: 'chunk.[name].[contenthash].js',
        },
    })
})

export default createMultipleWebpackConfigs
