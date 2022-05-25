const glob = require('glob');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin')

module.exports = {
    entry: './src/style.css',
    output: {
        path: path.resolve(__dirname, 'build')
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new PurgecssPlugin({
            // watch Qute template directory
            paths: glob.sync(`${path.resolve(__dirname, '../resources/templates')}/**/*`, {nodir: true}),
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ],
            }
        ],
    },
}
