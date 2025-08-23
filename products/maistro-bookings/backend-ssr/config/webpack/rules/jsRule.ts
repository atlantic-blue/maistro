import { RuleSetRule } from 'webpack'

const jsRule: RuleSetRule = {
    test: /\.(ts|js)x?$/,
    exclude: /node_modules/,
    use: "ts-loader",
}

export default jsRule
