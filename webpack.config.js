const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const config = {
    entry: './index.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'image_preview.js',
    },
    plugins: [new CleanWebpackPlugin()],
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
        ],
    },
}
module.exports = config
