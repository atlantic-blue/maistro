import * as path from 'path'

import { Configuration } from 'webpack'

import jsRule from './rules/jsRule'
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
                jsRule,
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
    "ping",
    "upload", // TODO move to projects

    "content-create",
    "content-read",
    "content-update-by-id",
    // TODO "content-delete",

    "hosting-redirect",

    "email-entries-create",
    "email-entries-read-by-id",

    "email-lists-create",
    "email-lists-read",
    // TODO "email-lists-update-by-id",

    "pages-create",
    "pages-read",
    "pages-read-by-id",
    "pages-update-by-id",
    // TODO "pages-delete",

    "projects-create",
    "projects-read",
    "projects-read-by-id",
    "projects-update-by-id",
    "projects-delete",

    "payments-subscriptions-read"
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
