import path from 'path'
import { Configuration } from 'webpack'

import jsRule from './rules/jsRule'
import { serverSideCss } from './rules/cssRule'
import urlRule from './rules/urlRule'
import { WebpackPaths } from './types'


const createWebpackPaths = (root: string): WebpackPaths => {
    return {
        root,
        src: path.resolve(root, 'src', 'devServer'),
        build: path.resolve(root, 'dist-dev-server'),
    }
}

const PATH_ROOT = path.resolve(__dirname, "..", "..")

const createWebpackConfig = (): Configuration => {
    const paths = createWebpackPaths(PATH_ROOT)

    return {
        target: "node",
        entry: paths.src,
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
                jsRule,
                serverSideCss,
                urlRule,
            ],
        },
        resolve: {
            plugins: [],
            extensions: ['.tsx', '.ts', '.js', '.jsx'],
        },
        output: {
            libraryTarget: "commonjs2",
            path: paths.build,
            filename: "index.js",
            sourceMapFilename: "[file].map",
            chunkFilename: 'chunk.[name].[contenthash].js',
        },
    }
}

export default createWebpackConfig
