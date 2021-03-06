const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

const env = process.env.NODE_ENV || 'production';

module.exports = {
	mode: env,

	devtool: env === 'production' ? false : 'cheap-module-eval-source-map',

	entry: {
		app: './src/app.js',
	},

	output: {
		path: __dirname + "/build",
		filename: "[name].bundle.js"
	},

	devServer: {
		contentBase: "./public", //本地服务器所加载的页面所在的目录
		historyApiFallback: true, //不跳转
		inline: true, //实时刷新
		port: <%= port %>
	},

	resolve: {
		modules: [
      __dirname + "/node_modules/"
    ],
		extensions: ['.js', '.jsx', '.json', '.scss'],
		alias: {
			src: path.resolve(__dirname, 'src/')
		},
	},

	optimization: {
		minimize: true, //压缩js文件的组件，在4.0以上版本已被集成到webpack本身，所以直接填写参数即可
		runtimeChunk: false,
		splitChunks: {
			chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: false,
      cacheGroups: {
        vendor: {
          name: 'vendor',
          chunks: 'initial',
          priority: -10,
          reuseExistingChunk: false,
          test: /node_modules\/(.*)\.js/
        }
      }
	},

	module: {
		rules: [{
			test: /\.js$/,
			loader: 'eslint-loader',
			enforce: 'pre',
			exclude: /node_modules/,
			options: {
				emitWarning: true,
				emitError: true,
			}
		}, { //babel模块的引入
			test: /(\.jsx|\.js)$/,
			use: {
				loader: "babel-loader",
			},
			exclude: /node_modules/
		}, { //css模块引入
			test: /\.css$/,
			use: [{
				loader: "style-loader"
			}, {
				loader: "css-loader",
				options: { //用于解决url()路径解析错误
					url: false,
					minimize: true,
					sourceMap: true
				}
			}]
		}, { //sass模块引入
			test: /\.scss$/,
			use: [
				"style-loader",
				"css-loader",
				"sass-loader"
			]
		}, {
			test: /\.less$/,
			loader: `style!css!less`,
			include: path.resolve(__dirname, 'node_modules'),
		}, {
			test: /\.(png|jpg|gif|jpeg)$/i,
			use: [{ //加载url-loader 同时安装 file-loader;
				loader: 'url-loader',
				options: {
					//小于10000K的图片文件转base64到css
					limit: 10000,
					//设置最终img路径;
					name: '/images/[name].[test]'
				}
			}, {
				//压缩图片(另一个压缩图片：image-webpack-loader);
				loader: 'img-loader?minimize&optimizationLevel=5&progressive=true'
			}]
		}]
	},
	plugins: [
		new HtmlWebpackPlugin({ //根据模板自动引入打包之后的js文件
			template: __dirname + "/src/index.tmpl.html",
			inject:true
		}),
		new webpack.HotModuleReplacementPlugin(), //热加载插件
		new webpack.optimize.OccurrenceOrderPlugin(), //为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
	],
}
if (env === 'production') {
	config.plugins.push(
		new MiniCssExtractPlugin({
			filename: '[name].[hash].css',
			chunkFilename: '[name].[contenthash].css',
		}),
		new OptimizeCSSPlugin({
			cssProcessorOptions: {
				safe: true,
			}
		})
	);
}