const config = {
    testEnvironment: "node",
    /**
     * Watch
     */
    watchPlugins: [
        "jest-watch-typeahead/filename",
        "jest-watch-typeahead/testname"
    ],
    /**
     * NYC coverage
     * see https://jestjs.io/docs/en/configuration#coveragedirectory-string
     */
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.{ts,tsx,js,jsx}',
    ],
    coverageReporters: ['lcov', 'text', 'text-summary'],
    coverageThreshold: {
        global: {
            branches: 98,
            functions: 98,
            lines: 98,
            statements: 98,
        },
    },

    transform: {
        "^.+\\.[t|j]sx?$": "babel-jest"
    },
    transformIgnorePatterns: [
        "node_modules/(?!(stringify-entities|character-entities-legacy|character-entities-html4)/)"
    ],
}

module.exports = config
