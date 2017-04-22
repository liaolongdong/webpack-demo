var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

// 定义文件夹的路径
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'src');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');

module.exports = {
	// entry: APP_PATH, // 项目起点入口
	
	entry: {
		app: path.resolve(APP_PATH, 'index.js'),
		vendor: ['jquery', 'moment']
	},

	// output: { // 打包文件输出
	// 	path: BUILD_PATH, // 打包后的文件存放的路径
	// 	filename: 'bundle.js' // 打包后输出文件的文件名
	// },
	
	output: { // 打包文件输出
		path: BUILD_PATH, // 打包后的文件存放的路径
		filename: '[name].bundle.js' // 打包后输出文件的文件名
	},
	
	// 添加插件 会自动生成一个html文件
	plugins: [
		// 第三方库独立提取
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor'
		}),

		// 自动生成html文件
		new HtmlWebpackPlugin({
			title: 'webpack demo',
			template: path.join(__dirname, 'template.html'),
			filename: 'index.html',
			chunks: ['vendor', 'app'],
			hash: true
		}),

		//独立打包样式
		new ExtractTextPlugin({
			filename: 'bunlde.css',
			disable: false,
			allChunks: true
		}),
		
		// JS代码混淆压缩插件
		new webpack.optimize.UglifyJsPlugin({
	      compress: {
	        warnings: false
	      }
	    }),
	    // loader-options-plugin 和其他插件不同。它的用途是帮助人们从 webpack 1 迁移至 webpack 2。
	    new webpack.LoaderOptionsPlugin({
	        minimize: true // 切换到优化模式
	    })
	],
	module: {
		// 配置加载器
		loaders: [
			// {
			// 	test: /\.css$/,
			// 	// loader: 'style-loader!css-loader',
			// 	loader: ['style-loader', 'css-loader'],
			// 	include: APP_PATH
			// },
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract({
					fallbackLoader: 'style-loader',
					loader: 'css-loader'
				}),
				include: APP_PATH
			},
			{
				test: /\.(png|jpe?g)$/,
				loader: 'url-loader'
			},
			{
				test: /\.jsx?$/,
				loader: 'babel-loader',
				include: APP_PATH,
				query:{
					presets: ['es2015']
				}
			}
		]
	},

	// 本地服务器配置
	devServer: {
		contentBase: path.join(__dirname, '/build'), // 告诉服务器从哪里提供内容
		port: 8866, // 设置默认监听端口，如果省略，默认为”8080“
		noInfo: true, // webpack包（bundle）消息将被隐藏，但错误和警告仍会显示
		hot: true, // 启用webpack的模块热替换特性
		inline: true, // 当源文件改变时自动刷新页面
		compress: true, // 启用gzip压缩
		open: true, // 自动在浏览器中打开项目
		historyApiFallback: true // 在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
	},

	// 给第三方库设置别名
	resolve: {
		alias: {
			'jquery': 'jquery/dist/jquery.js',
			'moment': 'moment/src/moment.js'
		}
	}
};