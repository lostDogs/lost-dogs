var webpack = require('webpack');
// It will take the html and insert the respective js
var HtmlwebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
  entry: {
        app: ['./app/main.ts']
  },
  output: { 
    path: './public',
    filename: 'app.bundle.js'
  },
  // Configure the ts-load module that helps compile ts
  module: {
    loaders: [
      // Any files that end with ts should be loadd with the ts loader
      {test: /.*\.ts$/, loader: 'ts-loader', exclude: /node_modules/},
      //any files that with html will be loaded as plan text with the raw loader
      {test: /\.html$/, loader: 'raw'},
      //Fonts and images will be loaded with the URL-loader only if  the size of the file  is under 700
      { test: /\.(jpg|fig|png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=7000' },
      //in chain loader for sass  ssas to css to style
      {test: /\.scss$/, loaders: ['to-string', 'style-loader', 'css-loader', 'sass-loader']},
      {test: /\.css$/, loaders: [ 'style-loader', 'css-loader']}
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