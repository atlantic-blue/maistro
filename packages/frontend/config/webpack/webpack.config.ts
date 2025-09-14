import path from 'path';
import Webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import createWebpackEnv from "./utils/createWebpackEnv"
import createWebpackPaths from "./utils/createWebpackPaths"
import createWebpackPlugins from './utils/createWebpackPlugins';

type WebpackConfiguration = Webpack.Configuration;
type WebpackDevServerConfiguration = WebpackDevServer.Configuration
interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const createConfig = ({
  dirname,
  isProduction,
  analyse
}: {dirname: string, isProduction: boolean, analyse?: boolean}): Configuration => {
  const env = createWebpackEnv({
    ANALYSE: analyse || false,
    NODE_ENV: isProduction ? "production" : "development"
  })

  const paths = createWebpackPaths(dirname)
  const plugins = createWebpackPlugins(env, paths)

  const config: Configuration = {
  mode: isProduction ? 'production' : 'development',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true,
    publicPath: '/',
  },
  devtool: isProduction ? 'source-map' : 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { importLoaders: 1 }, // make imports go through postcss
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { importLoaders: 1 }, // make imports go through postcss
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(dirname, 'src'),
    },
  },
  plugins,
  devServer: {
    static: {
      directory: path.join(dirname, 'public'),
    },
    client: {
      overlay: false,
    },
    historyApiFallback: true,
    port: 3000,
    hot: true,
    open: true,
  },
  }

  config.plugins?.push(
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',

      })
    );

  return config
};



export default createConfig;