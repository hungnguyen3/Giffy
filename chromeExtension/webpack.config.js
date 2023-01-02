const { resolve } = require('path');

const tsRule = {
	test: /\.ts(x?)$/,
	exclude: /node_modules/,
	use: 'ts-loader',
};

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
};
