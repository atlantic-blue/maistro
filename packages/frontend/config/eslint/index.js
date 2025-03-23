module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:jsx-a11y/recommended',
        'plugin:prettier/recommended',
    ],
    plugins: ['react', 'react-hooks', '@typescript-eslint', 'import', 'jsx-a11y'],
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    settings: {
        react: {
            version: 'detect'
        },
        'import/resolver': {
            typescript: {}
        }
    },
    rules: {
        'prettier/prettier': 'error',

        // React rules
        'react/react-in-jsx-scope': 'off', // Not needed in React 17+
        'react/prop-types': 'off', // Not needed when using TypeScript

        // Import rules
        'import/order': [
            'error',
            {
                groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                'newlines-between': 'always',
                alphabetize: { order: 'asc', caseInsensitive: true }
            }
        ],

        // TypeScript rules
        '@typescript-eslint/no-unused-vars': ['error', {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_'
        }],
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',

        // Other rules
        'no-console': ['warn', { allow: ['warn', 'error'] }]
    }
};