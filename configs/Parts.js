const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

exports.devServer = function(options) {
	return {
		devServer: {
			historyApiFallback: false,
			hot: true,
			inline: true,
			stats: { colors: true },
			host: options.host, // Defaults to `localhost`
			port: options.port, // Defaults to 8080,
			headers: {'Access-Control-Allow-Origin': '*'}
		},
		plugins: [
			new webpack.HotModuleReplacementPlugin({
				multiStep: true
			}),
			new webpack.NoErrorsPlugin()
		]
	};
};

exports.setupSass = function(paths) {
	return {
		module: {
			loaders: [
				{
					test: /\.scss$/,
					loaders: ['style', 'css', 'sass'],
					include: paths
				}
			]
		}
	};
};

exports.babel = function(paths) {
	return {
		module: {
			loaders: [
				{
					test: /\.jsx?$/,
					loaders: ['babel'],
					include: paths,
					exclude: /(node_modules|bower_components)/
				}
			]
		}
	};
};

exports.babelHot = function(paths) {
	return {
		module: {
			loaders: [
				{
					test: /\.jsx?$/,
					loaders: ['babel?cacheDirectory=./babel-cache'],
					include: paths,
					exclude: /(node_modules|bower_components)/,
				}
			]
		}
	};
};

exports.fonts = function(path) {
	return {
		module: {
			loaders: [
				{
					test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
					loader: 'file-loader?name=' + path + '/[hash].[ext]'
				}
			]
		}
	}
};
exports.json = function(paths) {
	return {
		module: {
			loaders: [
				{test: /\.json$/, loader: 'json-loader'},
			]
		}
	}
};

exports.minify = function() {
	return {
		plugins: [
			new webpack.optimize.LimitChunkCountPlugin({maxChunks: 15}),
			new webpack.optimize.MinChunkSizePlugin({minChunkSize: 10000}),
			new webpack.optimize.DedupePlugin(),
			new webpack.optimize.UglifyJsPlugin({
				compress: {
					warnings: false
				}
			})
		]
	};
};

exports.clean = function(path) {
	return {
		plugins: [
			new CleanWebpackPlugin([path], {
				// Without `root` CleanWebpackPlugin won't point to our
				// project and will fail to work.
				root: process.cwd()
			})
		]
	};
};

exports.setFreeVariable = function(key, value) {
	const env = {};
	env[key] = JSON.stringify(value);

	return {
		plugins: [
			new webpack.DefinePlugin(env)
		]
	};
};

exports.extractCSS = function(paths) {

	return {
		module: {
			loaders: [
				// Extract CSS during build
				{
					test: /\.scss$/,
					loader: ExtractTextPlugin.extract(
						"css!sass?sourceMap"
					)
				}
			]
		},
		plugins: [
			// Output extracted CSS to a file
			new ExtractTextPlugin('.' + paths + '/[name].[chunkhash].css')
		]
	};
};

exports.purifyCSS = function(paths) {
	return {
		plugins: [
			new PurifyCSSPlugin({
				basePath: process.cwd(),
				// `paths` is used to point PurifyCSS to files not
				// visible to Webpack. You can pass glob patterns
				// to it.
				paths: paths
			}),
		]
	}
};

exports.extractBundle = function(options) {
	const entry = {};
	entry[options.name] = options.entries;

	return {
		// Define an entry point needed for splitting.
		entry: entry,
		plugins: [
			// Extract bundle and manifest files. Manifest is
			// needed for reliable caching.
			new webpack.optimize.CommonsChunkPlugin({
				names: [options.name]
			})
		]
	};
};

exports.openBrowser = function(url) {
	return {
		plugins: [
			new OpenBrowserPlugin({ url: url, browser: 'Google Chrome' })
		]
	}
};

exports.testLint = function (options) {
	return {
		module: {
			preLoaders: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					loader: 'eslint-loader',
					include: options.paths
				}
			]
		},
		eslint: {
			configFile: options.conf
		}
	}
};

exports.testStyles = function (options) {
	return {
		plugins: [
			new StyleLintPlugin({
				configFile: options.conf,
				syntax: 'sass',
				context: options.path,
				files: "**/*.scss",
				failOnError: false
			})
		]
	}
};