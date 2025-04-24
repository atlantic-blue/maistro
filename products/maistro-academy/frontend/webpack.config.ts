import {merge} from "webpack-merge"
import createWebpackConfig from "@maistro/webpack-config"

const isProduction = process.env.NODE_ENV === 'production';
const __dirname = process.cwd();

export default merge(
  createWebpackConfig({isProduction, dirname: __dirname}),
);