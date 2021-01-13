const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const config = {
  entry: './main.js',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'image_preview.js',
    publicPath: '',
  },
  devServer: {
    contentBase: '/',
    compress: true, // enable gzip compression
    hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
    port: 9000,
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Webpack Plugin Sample',
      template: './public/index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
          },
        ],
      },
      {
        test: /\.jp(e|)g/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 50,
              outputPath: 'images/',
            },
          },
        ],
      },
      {
        test: /\.(htm|html)$/i,
        loader: 'html-loader',
        options: {
          attributes: {
            list: [
              {
                tag: 'div',
                attribute: 'data-src',
                type: 'src',
              },
              {
                tag: 'img',
                attribute: 'data-src',
                type: 'src',
              },
              {
                tag: 'img',
                attribute: 'src',
                type: 'src',
              },
            ],
          },
        },
      },
    ],
  },
}
module.exports = config
