# webpack操作指南


## 使用淘宝NPM镜像
国内直接使用npm的官方镜像比较慢，我们可以使用淘宝NPM镜像。
```
npm install -g cnpm --registry=https://registry.npm.taobao.org
```
然后可以使用cnpm命令来安装模块了：
```
cnpm install [name]
```


## 什么是webpack？
![what is webpack?](./webpack.jpg "what is webpack?")  
webpack是一个前端资源加载/打包工具。它将根据模块的依赖关系进行静态分析，然后将这些模块按照指定的规则生成对应的静态资源。


## 安装
在安装webpack之前，先安装好node和npm，因为webpack是基于node的
```
npm install -g webpack
```


## 配置webpack
webpack是高度可配置的，但是，在开始配置之前我们需要先理解四个核心概念：入口(entry)、输出(output)、加载器(loader)、插件(plugin)。

### 入口(entry)
entry是应用程序的起点入口。从这个起点开始，应用程序启动执行。  
简单规则：每个HTML页面都有一个入口起点。单页面应用(SPA)：一个入口起点，多页应用(MPA)：多个入口起点。  
如果传入一个字符串或字符串数组，chunk 会被命名为 main。如果传入一个对象，则每个键(key)会是 chunk 的名称，该值描述了 chunk 的入口起点。
```
// entry: [string|[string]|object{<key>: string|[string]}]

// 这种方式比较常见于，只有一个入口起点（不包括 vendor）的单页应用程序(SPA)中。
// 分离 应用程序(app) 和 公共库(vendor) 入口
{
	entry: {
		app: './src/app.js',
		vendors: './src/vendors.js'
	}
}

// 多页面应用程序
{
	entry: {
		pageOne: './src/pageOne/index.js',
	    	pageTwo: './src/pageTwo/index.js',
	    	pageThree: './src/pageThree/index.js'
	}
}
```
对象语法比较繁琐，但是是应用程序中定义入口最可扩展的方式。

### 输出(output)
output是对应输出项配置，即入口文件最终要生成什么名字的文件以及存放在哪里。注意，即使可以存在多个入口起点，但只指定一个输出配置。
```
// 单个入口
{
	entry: {
		app: './src/app.js',
	},
	output: {
		path: __dirname + '/build',
		filename: 'bundle.js'
	}
}
// 写入到硬盘：./build/bundle.js

// 多个入口
{
	entry: {
		app: './src/app.js',
	    	search: './src/search.js'
	},
	output: {
	    	path: __dirname + '/build',
	    	filename: '[name].bundle.js'
	}
}
// 写入到硬盘：./build/app.bundle.js, ./build/search.bundle.js
```

### 加载器(loaders)
loaders就是webpack最强大的地方了，不同的loaders通过正则来对不同模块文件进行处理。

loaders常用配置项：
- test： 一个匹配loaders所处理的文件的拓展名的正则表达式（必须）
- loader：loader的名称（必须）
- include/exclude：手动添加必须处理的文件（文件夹）或屏蔽不需要处理的文件（文件夹）（可选）
- query：为loaders提供额外的设置选项（可选）  
PS：webpack2.0 loaders改成了rules，query改成了options，不过也兼容原来的写法
```
module: {
    loaders: [
      	{
	        test: /\.jsx?$/,
	        loader: 'babel-loader',
	        exclude: /node_nodules/,
	        query: {
	          	presets: ['es2015']
	        }
      	},
    ]
}
```

### 插件(plugin)
插件是 wepback 的支柱功能。插件目的在于解决 loader 无法实现的其他事。  
最常用的四个插件：CommonsChunkPlugin(公共模块提取插件)、UglifyJSPlugin(JS代码混淆压缩插件)、HtmlWebpackPlugin(html自动生成插件)和ExtractTextPlugin(独立样式打包插件)。  
CommonsChunkPlugin和UglifyJsPlugin是webpack内置插件，因此可以不用安装，但是ExtractTextPlugin和HtmlWebpackPlugin插件需要手动安装。
```
npm install extract-text-webpack-plugin html-webpack-plugin --save-dev
```
```
plugins: [
	// 构建优化插件
	// 自定义公共模块提取，CommonsChunkPlugin插件用于提取这些依赖到共享的 bundle 中，来避免重复打包
  	new webpack.optimize.CommonsChunkPlugin({
    		name: 'vendor',
    		filename: 'vendor-[hash].min.js',
  	}),
  	// 压缩混淆JS插件
  	new webpack.optimize.UglifyJsPlugin({
		compress: {
			warnings: false
		}
  	}),
  	// 独立打包样式，ExtractTextPlugin可以把css从js中独立抽离出来
  	new ExtractTextPlugin({
    		filename: 'build.min.css',
    		allChunks: true
  	}),
  	// html自动生成插件
  	new HtmlWebpackPlugin({
            template: path.join(__dirname,'template.html'),
            filename:'index.html',
            chunks:['vendor','app'],
            hash: true
    })
]
```

## 使用webpack构建本地服务器
webpack-dev-server可以给我们提供一个服务器和实时重载（live reloading） 功能。而且配置比较简单。

安装webpack-dev-server
```
npm install webpack-dev-server --save-dev
```
安装完成以后在webpack.config.js文件中配置
```
// 本地服务器配置
devServer: {
	contentBase: path.join(__dirname, '/build'), // 告诉服务器从哪里提供内容
	port: 8000, // 设置默认监听端口，如果省略，默认为”8080“
	noInfo: true, // webpack包（bundle）消息将被隐藏，但错误和警告仍会显示
	hot: true, // 启用webpack的模块热替换特性
	inline: true, // 当源文件改变时自动刷新页面
	compress: true, // 启用gzip压缩
	open: true, // 自动在浏览器中打开项目
	historyApiFallback: true // 在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
}
```
然后再package.json文件中配置运行npm命令
```
"scripts": {
	"start": "webpack-dev-server --hot --inline"
}
```

## 搭建项目
搭建一个简单的项目
```
mkdir webpack-demo
cd webpack-demo
mkdir src
cd src
touch index.js
touch sub.js
cd ..
npm init
touch webpack.config.js
```

js代码
sub.js文件
```javascript
// 这里使用commonJS的风格
function productText(){
	var element = document.createElement('h2');
	element.innerHTML = 'webpack demo h2';
	return element;
}
module.exports = pruductText;
```

index.js文件
```javascript
var sub = require('./sub');
var app = document.createElement('div');
app.innerHTML = '<h1>webpack demo h1</h1>';
app.appendChild(sub());
document.body.appendChild(app);
```

代码写完了，完成一个很简单的功能，新建一个单独的module，并且在另外一个module里面引用他，最后会在页面里面输出两个标题。

现在开始配置webpack，目标是把这两个js文件合并成一个文件. 我们可以自己在build文件夹里面手动建一个index.html文件夹，然后再把合并以后的js引用在里面，但是这样有些麻烦，所以我们这里安装一个plugin，可以自动快速的帮我们生成HTML。
```
npm install html-webpack-plugin --save-dev
```
配置webpack.config.js文件
```javascript
var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

// 定义文件夹的路径
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'src');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');

module.exports = {
	entry: APP_PATH, // 项目起点入口

	output: { // 打包文件输出
		path: BUILD_PATH, // 打包后的文件存放的路径
		filename: 'bundle.js' // 打包后输出文件的文件名
	},

	// 添加插件 会自动生成一个html文件
	plugins: [
		new HtmlWebpackPlugin({
			title: 'webpack demo'
		})
	],

	// 本地服务器配置
	devServer: {
		contentBase: path.join(__dirname, '/build'), // 告诉服务器从哪里提供内容
		port: 8000, // 设置默认监听端口，如果省略，默认为”8080“
		noInfo: true, // webpack包（bundle）消息将被隐藏，但错误和警告仍会显示
		hot: true, // 启用webpack的模块热替换特性
		inline: true, // 当源文件改变时自动刷新页面
		compress: true, // 启用gzip压缩
		open: true, // 自动在浏览器中打开项目
		historyApiFallback: true // 在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
	}
};
```
在项目的根目录运行
```
webpack
```
运行成功以后会多出一个build文件夹，里面包含两个文件，一个打包好的bundle.js文件和一个由html-webpack-pulgin生成的index.html文件，生成的index.html自动引入了打包好的bundle.js文件。

### 添加样式
webpack使用loader的方式来处理各种各样的资源，比如说样式文件，我们需要两种loader，css-loader 和 style－loader，css-loader会遍历css文件，找到所有的url(...)并且处理。style-loader会把所有的样式插入到你页面的一个style标签中。

安装样式用到的loader
```
npm install css-loader style-loader --save-dev
```
在webpack.config.js文件中，配置样式加载器
```
loaders: [
			{
				test: /\.css$/,
				// loader: 'style-loader!css-loader',
				loader: ['style-loader','css-loader'],
				include: APP_PATH
			}
		]
```

### 处理图片和其他静态文件
url-loader加载器可以根据需求将图片自动转成base64编码的，这样可以减轻很多网络请求。
安装url-loader
```
npm install url-loader --save-dev
```
在webpack.config.js文件中，配置处理图片加载器
```
{
	test: /\.(png|jpe?g)$/,
	loader: 'url?limit=80000'
}
```
注意后面那个limit的参数，当你图片大小小于这个限制的时候，会自动启用base64编码图片。

### 添加第三方库
在项目开发中一般都会引入第三方库，比如jQuery、moment等  
安装jQuery和moment库
```
npm install jquery moment --save-dev
```

### 在项目中使用ES6
安装支持ES6所需的loader
```
npm install babel-loader babel-preset-es2015 --save-dev
```
在webpack.config.js文件中配置
```
{
	test: /\.jsx?$/,
	loader: 'babel-loader',
	includes: APP_PATH,
	query:{
		presets: ['es2015']
	}
}
```
然后我们可以把commonJS风格改成ES6.

在这个demo中使用了import，export，let，promise以及箭头函数等es6特性。

