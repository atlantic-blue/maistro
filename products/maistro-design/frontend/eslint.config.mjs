import { defineConfig } from "eslint/config";
import storybook from 'eslint-plugin-storybook'
import maistroEslintConfig from "@maistro/eslint-config";

export default defineConfig([
    ...maistroEslintConfig,
    ...storybook.configs['flat/recommended'],
    {
        rules: {
            'no-redeclare': 'off',
        },
    }
]);
