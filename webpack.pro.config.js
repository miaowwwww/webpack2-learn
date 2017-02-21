var webpack = require('webpack');
var path = require('path');
var extractTextPlugin = require('extract-text-webpack-plugin');
var extractCss = new extractTextPlugin('style/[name]-[contenthash].css')
var extractLess = new extractTextPlugin('style/[name]-[contenthash].less.css')
var webpackMd5Hash = require('webpack-md5-hash');
var HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
	target: 'web',

	devtool: 'cheap-source-map',

	entry: {
		main: './src/index.js',
		vendor: ['jquery'] //['react', 'react-dom'],把这两个打包成vendor文件
	},

	output: {
		path: path.resolve(__dirname, "dist"),
		filename: 'js/[name]-[hash].js',
		chunkFilename: 'js/[name]-[id]-[hash]-[chunkhash].js',
	},

	module: {
		rules: [

			{
				test: /\.css$/,
				use: extractCss.extract({
					fallback: 'style-loader',
					use: {
						loader: 'css-loader',
						options: {modules: true,}
					}
				})
			},
			{
				test: /\.less$/,
				use: extractLess.extract({
					fallback: 'style-loader',
					use: ['css-loader?modules', 'less-loader']
				})
			},
			{
				test: /\.js$/,
				exclude: [path.resolve(__dirname, 'node_modules')],
				include: [path.resolve(__dirname, 'src')],
				use: {
					loader: 'babel-loader',
					options: {
						presets: [['es2015', { modules: false }], 'react'],
						plugins: ['syntax-dynamic-import']
					}
				}
			}
		]
	},

	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor', 
			filename: 'js/vendor.js'
		}),
		new webpack.ProvidePlugin({
			$: 'jquery'
		}),
		extractCss,
		extractLess,
		new webpackMd5Hash(),	
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false //uglifyjs警告是否显示，default false
      },
			minimize: true //loader 最小化 ,default false
    }),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			title: 'webpack-learn'
		})
	]


}