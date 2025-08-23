import { RuleSetRule } from 'webpack'

const urlRule: RuleSetRule = {
    test: /\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$/,
    use: [
        {
            loader: "url-loader",
            options: { limit: 8192 },
        },
    ],
}

export default urlRule
