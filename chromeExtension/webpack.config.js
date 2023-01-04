const { resolve } = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const tsRule = {
	test: /\.ts(x?)$/,
	exclude: /node_modules/,
	use: 'ts-loader',
};

const plugins = [
	new HTMLWebpackPlugin({
		template: 'src/popup_page/popup.html',
		filename: 'popup.html',
		chunks: ['popup'],
	}),
	new CopyWebpackPlugin({
		patterns: [{ from: 'public', to: '.' }],
	}),
	new CleanWebpackPlugin(),
];

module.exports = {
	mode: 'development',
	entry: {
		popup: './src/popup_page/popup.tsx',
	},
	output: {
		filename: '[name].js',
		path: resolve(__dirname, 'dist'),
	},
	module: {
		rules: [tsRule],
	},
	plugins,
};
