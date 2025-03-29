import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
    tseslint.configs.recommended,
    {
        files: ["**/*.{js,jsx,mjs,cjs,ts,ts,tsx}"],
        languageOptions: {
            sourceType: "commonjs",
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.jest,
            },
        },
        plugins: {
            js,
        },
        extends: [
            "js/recommended",
        ],
        rules: {
            
        }
    },
];
