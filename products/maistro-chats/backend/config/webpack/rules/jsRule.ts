import { RuleSetRule } from 'webpack'

const jsRule: RuleSetRule = {
    test: /\.(ts|js)x?$/,
    exclude: /node_modules/,
    use: "babel-loader",
}

export default jsRule
