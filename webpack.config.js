const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const config = {
  entry: './main.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'image_preview.js'
  },
  plugins: [
    new CleanWebpackPlugin(),
  ]
}
module.exports = config
