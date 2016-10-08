"use strict";

const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const validate = require('webpack-validator');
const PATHS = require('./configs/Paths');
const parts = require('./configs/parts');
const pkg = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let config,
	npmCommand = process.env.npm_lifecycle_event;

let entryPoints = {};

PATHS.entryPoints.forEach(function (entryPoint) {
	entryPoints[entryPoint.title] = [path.resolve(PATHS.src + PATHS.js + entryPoint.folder)];
});


const common = {
	entry: entryPoints,
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: PATHS.src + '/index.html',
			filename: '../index.html'
		})
	]
};

switch (npmCommand) {
	case 'build':
		config = merge(
			common,
			{
				devtool: 'source-map',
				output: {
					path: PATHS.dist,
					filename: '.' + PATHS.js + '/[name].[chunkhash].js',
					// This is used for require.ensure. The setup
					// will work without but this is useful to set.
					chunkFilename: '[chunkhash].js'
				}
			},
			parts.clean(PATHS.dist),
			parts.setFreeVariable(
				'process.env.NODE_ENV',
				'production'
			),
			parts.extractBundle({
				name: 'vendor',
				entries: Object.keys(pkg.dependencies) //['react', 'react-dom']
			}),
			parts.fonts([PATHS.fonts]),
			parts.json(),
			parts.extractCSS(PATHS.css),
			parts.purifyCSS([PATHS.src]),
			parts.babel([PATHS.src]),
			parts.minify()
		);
		break;

	default:
		config = merge(
			common,
			{
				devtool: 'eval-source-map'
			},
			parts.setupSass(PATHS.sass),
			parts.devServer({
				host: PATHS.host,
				port: PATHS.port
			}),
			parts.babelHot([PATHS.src]),
			parts.fonts([PATHS.fonts]),
			parts.json(),
			parts.openBrowser(PATHS.projectUrl)
		);
		break;

}

module.exports = validate(config, {
	quiet: true
});