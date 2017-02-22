var webpack = require('webpack');
var path = require('path');
var extractTextPlugin = require('extract-text-webpack-plugin');
var webpackMd5Hash = require('webpack-md5-hash');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var extractCss = new extractTextPlugin('style/[name]-[contenthash].css')
var extractLess = new extractTextPlugin('style/[name]-[contenthash].less.css')

module.exports = {
	
	entry: {
		main: './src/index.js',
		vendor: ['jquery'] //['react', 'react-dom'],把这两个打包成vendor文件
	},

	output: {
		// 1.使用path模块指定绝对路径，稳妥
		path: path.resolve(__dirname, "dist"),
		// publicPath:引用源文件的根目录，此处网站开在webpack-learn目录，path指定dist文件夹，所以publicPath可以为''
		// 2.入口块的文件名： [name].js?[hash], 没有chunkhash
		filename: 'js/[name]-[hash:6].js',
		// 3.非入口块的文件名
		chunkFilename: 'js/[name]-[id]-[hash:6]-[chunkhash:6].js',
		// 4.热加载模块
		// hotUpdateChunkFilename: 'hot-update[id].js?[hash]',
		// hotUpdateFunction: webpackHotUpdate,
		// hotUpdateMainFilename: 'hot-update.json?[hash]',
		// 5.jsonpFunction: webpackJson, //异步加载块的函数，require.ensure
		// 6.库
		// library: 'mylibrary',
		// libraryTarget: 'var|this|commonjs|commonjs2|amd|umd',//到出库的格式
		// sourceMapFilename: '[file]-[id].map?[hash]'
	},

	// 映射源，源代码与生成代码之间的映射关系
	devtool: 'eval', //cheap-module-eval-source-map : dev, source-map : pro

	// 生成的代码使用的环境， web, node default: web
	target: 'web',

	// loader 匹配
	module: {
		rules: [
			// use: string / object / array
			// { test: /\.css?$/, use: 'css-loader'},
			// { test: /\.css?$/, use: ['style-loader', 'css-loader?modules']},
			// { test: /\.css?$/, use: [{loader: 'style-loader'}, {loader: 'css-loader'}]},
			// { test: /\.css$/, use: {
			// 	loader: 'css-loader',
			// 	options: {
			// 		modules: true
			// 	}
			// }},
			{
				test: /\.css$/,
				use: extractCss.extract({
					fallback: 'style-loader',
					use: {
						loader: 'css-loader',
						options: {
							modules: true,
							devtool: 'source-map'
						}
					}
					// publicPath: string
				})
			},
			{
				test: /\.less$/,
				use: extractLess.extract({
					fallback: 'style-loader',
					use: ['css-loader?modules', 'less-loader']
					// publicPath: string
				})
			},
			{
				test: /\.js$/,
				exclude: [path.resolve(__dirname, 'node_modules')],
				use: {
					loader: 'babel-loader',
					options: {
						// 使用import()，要modules：false && syntax-dynamic-import
						presets: [['es2015', { modules: false }], 'react'],
						plugins: ['syntax-dynamic-import']
					}
				}
			}
		]
	},

	// webpack-dev-server config
	devServer: {
		// --告诉服务器从哪里提供内容。这只有在您想要提供静态文件时才需要。例如图片？？
		// contentBase: path.join(__dirname, 'dist'),
		// contentBase: false,
		// --告诉服务器观看由devServer.contentBase选项提供的文件。文件更改将触发整个页面重新加载。
		// watchContentBase: true,
		// --随所有内容启用gzip压缩
		compress: true,
		port: 9997,
		host: '0.0.0.0',
		// --这个是使用热更新的标志，然后并不提供热更新功能，需要引入hotModule
		// hot:true, 不加入HotModuleReplacementPlugin，因为API无法访问您的webpack配置
		// --hot添加它。 （因为CLI可以访问您的webpack配置）
		hot: true,
		// --使用HTML5 History API时，系统可能会放送index.html网页来取代404回应
		historyApiFallback: true,
		// --在构建失败的情况下，启用热模块替换（请参阅devServer.hot）而不刷新页面作为回退。
		// hotOnly: true,
		// --devtool控制台显示信息
		// clientLogLevel: 'none', //none, info, (warning,error 一直有）
		// --延迟编译，对于异步模块，只有在请求时才会编译，在生产中不需要
		// lazy: true,
		// filename: "bundle.js"
		// --为所有请求添加请求头
		// headers: {
		// 	"X-Custom-Foo": "bar"
		// },
		// historyApiFallback: {
		// 	rewrites: [
		// 		{ from: /^\/$/, to: '/views/landing.html' },
		// 		{ from: /^\/subpage/, to: '/views/subpage.html' },
		// 		{ from: /./, to: '/views/404.html' }
		// 	]
		// }
		// https: true, //使用https协议
		// --在开发服务器的两种不同模式之间切换(--inline, --iframe)。默认情况下，将使用内联模式启用应用程序。这意味着一个脚本将插入到您的包中以处理实时重新加载，并且构建消息将显示在浏览器控制台中。
		// inline: true
		// --隐藏webpack打包是的信息
		// noInfo: true,
		// --使用代理，需要 http-proxy-middleware  代理包,连接后台接口的时候使用
		// proxy: {
		// 	"/api": "http://localhost:3000"
		// 	"/api": {
		// 		target: "http://localhost:3000",
		// 		pathRewrite: {"^/api" : ""},
		// 		secure: false
		// 	}
		// }
		// public: "myapp.test:80",
		// --也是静态文件的目录， 相当于 output.publicPath
		// publicPath: "/assets/",
		// --启用安静功能后，除了初始启动信息之外的任何内容都将写入控制台。这也意味着来自webpack的错误或警告不可见。
		// quiet: true
	},

	// 如何合理的处理模块的问题
	resolve: {
		// 设置模块的别名：import xxx from alias
		alias: {
			Acss: path.resolve(__dirname, 'src/css/index.css') // import 'Acss';
		},
		// 指定要根据本规范解析的字段，default browser
		aliasFields: ['browser'],
		// 描述项目的json文件
		descriptionFiles: ["package.json"],
		// 是否允许无扩展名的文件, require('./foo), 若为true,不匹配foo.js
		enforceExtension: false,
		// 是否需要使用模块的扩展
		enforceModuleExtension: false,
		// 自动解决某些扩展程序, 默认就这两个
		extensions: ['.js', '.json'], 
	},

	// 插件
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor', //提取公共代码，放到公共模块vendor中，如果vendor不存在就创建一个
			filename: 'vendor.js' //公共模块的名字，默认是=name（vendor.js)，否则修改
			// names: ['vendor','main'] // 把公共模块一步一步往后放，然后都在'main'模块中
		}),
		
		// 热更新需要，不然需要给 commonsChunkPlugin({name: 'vendor-chunk'}),设置一个另外的名字，
		// 不然会替换原来的vnedor.js，导致不能热更新（大概是更新的代码在vendor.js里面吧）
		new webpack.HotModuleReplacementPlugin(),

		// new extractTextPlugin({
		// 	//每一个入口文件生成一个css文件，所以每个入口不要有相同的样式模块
		// 	filename: '[name]-[id]-[contenthash].css', 
		// 	allChunks: false,
		// 	disable: false,
		// 	ignoreOrder: false
		// }),
		// 定义这两个的时候可以增加参数
		extractCss,
		extractLess,

		// hash & chunkhash
		new webpackMd5Hash(),	// js文件与css文件，chunkhash解决方案
		// contenthash， css文件 独立hash， 解决方案

		// 设置全局变量，var $ = require(“jquery”)每次遇到全局$标识符时进行预处理
		new webpack.ProvidePlugin({
			$: 'jquery'
		}),

		// 导致热更新时一直处于compiling...
		// new OpenBrowserPlugin({
		// 	url: 'http://localhost:9997'
		// }),

		new HtmlWebpackPlugin({
			filename: 'index.html',
			title: 'webpack-learn'
		})
	]
}