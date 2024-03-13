'use strict'

const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const Dotenv = require('dotenv-webpack');
require('dotenv').config();

module.exports = {
    mode: 'production',
    devtool: "inline-source-map",
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].bundle.js',
        publicPath: '/',
    },
    devServer: {
        historyApiFallback: true,
        compress: true,
        static: path.resolve(__dirname, 'build'),
        port: 3000,
        hot: true,
        proxy: [
            {
                context: ['/api'],
                target: 'https://localhost:3001',
                changeOrigin: true,
                secure: false,
            },
            {
                context: ['/ws'],
                target: 'ws://localhost:3000',
                changeOrigin: false,
                secure: false,
            },
        ],
    },
    plugins: [
        new NodePolyfillPlugin(),
        new Dotenv(),
        new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
            resource.request = resource.request.replace(/^node:/, "");
        }),
        new CopyWebpackPlugin({
            patterns:[
                {
                    from:'./src/service-worker.js',
                    to:path.resolve(__dirname, 'build', '[name][ext]'),
                }
            ]
        }),
        new HtmlWebpackPlugin(
          Object.assign(
            {},
            {
              inject: true,
              template: './public/index.html',
            },
            process.env.NODE_ENV == 'production'
              ? {
                  minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true,
                  },
                }
              : undefined
          )
        ),
        // Generate a service worker script that will precache, and keep up to date,
        // the HTML & assets that are part of the webpack build.
        process.env.NODE_ENV == 'production' &&
          fs.existsSync('src/service-worker') &&
          new WorkboxWebpackPlugin.InjectManifest({
            path: path.resolve(__dirname, 'src/service-worker'),
            dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
            exclude: [/\.map$/, /asset-manifest\.json$/, /LICENSE/],
            // Bump up the default maximum size (2mb) that's precached,
            // to make lazy-loading failure scenarios less likely.
            // See https://github.com/cra-template/pwa/issues/13#issuecomment-722667270
            maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          }),
    ],
    module: {
        rules: [
            {
                test: /\.(der)$/i,
                use: [
                  {
                    loader: 'file-loader',
                  },
                ],
            },
            {
                test: /\.(js|jsx)$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(css|scss)$/,
                use: [
                    {
                        // Adds CSS to the DOM by injecting a `<style>` tag
                        loader: 'style-loader'
                    },
                    {
                        // Interprets `@import` and `url()` like `import/require()` and will resolve them
                        loader: 'css-loader'
                    },
                    {
                        // Loader for webpack to process CSS with PostCSS
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    autoprefixer
                                ]
                            }
                        }
                    },
                    {
                        // Loads a SASS/SCSS file and compiles it to CSS
                        loader: 'sass-loader'
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.json', '.wasm', '.html', '.ico', '.css', '.scss'],
        fallback: {
            assert: require.resolve('assert'),
            crypto: require.resolve('crypto-browserify'),
            http: require.resolve('stream-http'),
            https: require.resolve('https-browserify'),
            os: require.resolve('os-browserify/browser'),
            stream: require.resolve('stream-browserify'),
        },
    },
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
      // Calculates sizes of gziped bundles.
      assetFilter: function (assetFilename) {
        return assetFilename.endsWith(".js.gz");
      },
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            // chunks: 'all',
            minSize: 10000,
            maxSize: 512000,
          },
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true
                    }
                }
            })
        ]
    }
}
