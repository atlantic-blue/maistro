import path from 'path';
import { fileURLToPath } from 'url';
import {merge} from "webpack-merge"
import createWebpackConfig from "@maistro/webpack-config"

const isProduction = process.env.NODE_ENV === 'production';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default merge(
  createWebpackConfig({isProduction, dirname: __dirname}),
);