var HTMLWebpackPlugin = require('html-webpack-plugin');
var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
	template: __dirname + '/app/index.html',
	filename: 'index.html',
	inject:	'body'
});

module.exports = {
	entry: __dirname + '/app/playNine.js',
	module: {
		loaders: [
			{
				test: /\.(js|jsx)?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query:
					{
						plugins: ['transform-runtime'],
						presets: ['react', 'es2015', 'stage-0']
					}
			}
		]
	},
	output: {
		filename: 'transformed.js',
		path: __dirname + '/build'
	},
	plugins: [HTMLWebpackPluginConfig]
};
