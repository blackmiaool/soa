const webpack = require('webpack');
const globEntries = require('webpack-glob-entries');
const _ = require('lodash');
const path = require('path');
const BabiliPlugin = require("babili-webpack-plugin");

let env = process.env.NODE_ENV;
env='production'
let entries;
if (env === 'production') {
  entries = globEntries('./src/**/vue/*.js');
} else {
  entries = _.mapValues(globEntries('./src/**/vue/*.js'), entry => [entry, 'webpack-hot-middleware/client?reload=true']);
}

module.exports = {
  entry: entries,
  output: {
    path: path.resolve(__dirname, "dist/"), ///no real path is required, just pass "/"
    // publicPath: '/vue',
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: 'vue-style-loader!css-loader!sass-loader',
            sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
          },
          // other vue-loader options go here
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          query: {
            presets: ['es2015'],
            plugins: ['transform-runtime'],
          },
        },
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
        },
      },
    ],
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // Enable HMR
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  performance: {
    hints: false,
  },
  devtool: '#eval-source-map',
};

if (env === 'staging' || env === 'production') {
  //module.exports.devtool = env === 'staging' ? '#source-map' : false;
  module.exports.devtool = '#source-map';
  module.exports.output.path = path.resolve(__dirname, './src/v1/parse/cloud/public/vue');
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `"${env}"`,
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false,
      },
    }),
    // new BabiliPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
  ]);
}