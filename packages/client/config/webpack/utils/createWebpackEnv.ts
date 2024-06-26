import { WebpackArgs, WebpackEnv } from '../types'

const createWebpackEnv = (args: WebpackArgs): WebpackEnv => {
    return {
        ...args,
        NODE_ENV: args.NODE_ENV || 'development',
        ANALYSE: Boolean(args.ANALYSE),
        isProduction: (): boolean => args.NODE_ENV === 'production',
        isDevelopment: (): boolean => args.NODE_ENV === 'development',
    }
}

export default createWebpackEnv
