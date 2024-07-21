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
    // "ping",
    // "upload", // TODO move to projects
    // "images",

    // "ai-assistant",
    // "ai-components-create",
    // "ai-templates-create",
    // "ai-templates-read",
    // "ai-templates-read-by-id",

    // "ai-images-create",
    // "ai-threads-create",
    // "ai-threads-read",
    // "ai-threads-read-by-id",
    // "ai-threads-update-by-id",

    // "content-create",
    // "content-read",
    // "content-update-by-id",
    // "content-delete",

    // "hosting-redirect",

    // "email-entries-create",
    // "email-entries-read-by-id",

    // "email-lists-create",
    // "email-lists-read",
    // // TODO "email-lists-update-by-id",

    // "orders-create",

    // "pages-create",
    // "pages-read",
    // "pages-read-by-id",
    // "pages-update-by-id",
    // // TODO "pages-delete",

    // STRIPE
    // "payments-accounts-create",
    // "payments-accounts-read",
    // "payments-accounts-read-by-id",

    // "payments-checkouts-create",
    // MERCADO-PAGO
    // "payments-checkouts-mercado-pago-create",
    // "payments-process-mercado-pago-create",

    // "payments-shopping-carts-create",
    // "payments-shopping-carts-read-by-id"

    "payments-shopping-carts-patch-by-id",
    // "payments-shopping-carts-update-by-id",

    // "payments-accounts-link-create",
    // "payments-subscriptions-read"

    // "products-create",
    // "products-read",
    // "products-read-by-id",
    // "products-update-by-id",
    // "products-delete-by-id",

    // "projects-create",
    // "projects-read",
    // "projects-read-by-id",
    // "projects-update-by-id",
    // "projects-delete",
    // "projects-upload",
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
