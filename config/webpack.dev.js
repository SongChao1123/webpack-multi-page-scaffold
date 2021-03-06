const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const mockRouter = require('../mock/router')
const buildConfig = require('./build')
const pages = require('./pages')

function createDevHistoryApiFallback () {
  if(!pages || !pages.length){
    return true
  }
  let reg = new RegExp('^\\/(' + pages.join('|') + ')(\\/|$)')
  return  {
    rewrites: [
      {
        from: reg,
        to(context) {
          return `/${context.match[1]}.html`;
        }
      }
    ]
  }
}

let config = merge(common, {
  mode: 'development',
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"development"'
      }
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].css'
    }),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [`Your application is running here: http://${buildConfig.host}:${buildConfig.port}${buildConfig.publicPath}app`],
      }
    })
  ],
  devtool: 'inline-source-map',
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, `../${buildConfig.outputName}`)
  },
  devServer: {
    contentBase: [path.resolve(__dirname, `../${buildConfig.outputName}`), path.resolve(__dirname, `../mock`)],
    hot: true,
    host: buildConfig.host,
    port: buildConfig.port,
    historyApiFallback: createDevHistoryApiFallback(),
    quiet: true,
    before: mockRouter,
    publicPath: buildConfig.publicPath
  }
})

module.exports = config
