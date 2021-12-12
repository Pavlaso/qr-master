const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssWebpackPlugin = require('mini-css-extract-plugin')
const OptimazeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

const cssLoaders = extra => {
    const loaders = [  MiniCssWebpackPlugin.loader , 'css-loader']
    
    if(extra) loaders.push(extra)

    return loaders
}

const optimization = () => {
    const config  = {
        splitChunks: {
            chunks: 'all'
        }
    }

    if(isProd) {
        config.minimizer = [
            new OptimazeCssAssetsPlugin(),
            new TerserWebpackPlugin()
        ]
    }

    return config
}
const bableOptions = (preset) => {
    const option = {
         presets: ['@babel/preset-env', '@babel/preset-react'],
         plugins: ['@babel/plugin-syntax-jsx']
    }
    if(preset)  option.presets.push(preset)
    return option
}


module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        main: ['@babel/polyfill', path.resolve(__dirname, './src/index.tsx')],
    },
    output: { 
        path: path.resolve(__dirname, './dist'), 
        filename: filename("js")
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.json'],
        alias: {
            '@styles': path.resolve(__dirname, './src/styles')
        }
    },
    optimization: optimization(),
    devServer: {
        port: 4200,
        hot: isDev
    },
    devtool: isDev ? 'source-map' : '',
    plugins: [
        new HtmlWebpackPlugin({ 
            template: path.resolve(__dirname, './src/template.html'),
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
               { 
                   from: path.resolve(__dirname, './src/favicon.ico'), 
                   to: path.resolve(__dirname, 'dist/favicon.ico') 
               }
           ] 
       }),
       new MiniCssWebpackPlugin({ 
            filename: filename('css')
       })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoaders('sass-loader') 
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-typescript'],
                   }
                }
            }, 
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: bableOptions()
                }
            }, 
            {
                test: /\.tsx$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: bableOptions('@babel/preset-typescript')
                }
            },
        ]
    }
}

function newFunction() {
    return 'style-loader'
}
