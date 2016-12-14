var webpack = require('webpack');
// It will take the html and insert the respective js
var HtmlwebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './app/main.ts',
  output: { 
    path: './public',
    filename: 'app.bundle.js'
  },
  // Configure the ts-load module that helps compile ts
  module: {
    loaders: [
    // Any files that end with ts should be loadd with the ts loader
    {test: /.*\.ts$/, loader: 'ts-loader', exclude: /node_modules/}
    ]
  },

  resolve: {
    // List all the extensions that should be process by webpack
    //  '' empty string are for folders
    extensions: ['', '.js', '.ts']
  },
  
  plugins: [
    new HtmlwebpackPlugin({
      template: './app/index.html'
    })
  ]

};