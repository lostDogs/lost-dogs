var webpack = require('webpack');
// It will take the html and insert the respective js
var HtmlwebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
  entry: {
        app: ['./app/main.ts']
  },
  output: { 
    path: 'public',
    chunkFilename: 'module-chunk.js',
    filename: 'app.bundle.js',
    publicPath: '/'
  },
  // Configure the ts-load module that helps compile ts
  module: {
     rules: [
    // jQuery & plugins
    {
        test: require.resolve('jquery'),
        use: [
            {
                loader: 'expose-loader',
                options: 'jQuery'
            },
            {
                loader: 'expose-loader',
                options: '$'
            },
            {
                loader: 'expose-loader',
                options: 'window.jQuery'
            }
        ]
    }
  ],
    rules: [
    {
      test: /\.es6.js$/,
      loader: 'babel-loader',
      options: {
        presets: ["es2015"],
        plugins: ['transform-async-to-generator']

      }
    },
      // Any files that end with ts should be loadd with the ts loader
      {
        test: /.*\.ts$/,
        use: [ 'ts-loader', 'angular-router-loader'],
        exclude: /node_modules/
      },
      //any files that with html will be loaded as plan text with the raw loader
      {
        test: /\.html$/,
        use: [{loader: 'raw-loader'}]
      },
      //Fonts and images will be loaded with the URL-loader only if  the size of the file  is under 700
      { 
        test: /\.(jpg|fig|png|woff|woff2|eot|ttf|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {limit: 7000}
        }]
      },
      //in chain loader for sass  ssas to css to style
      {
        test: /\.scss$/,
        use: ['to-string-loader', 'style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader']
      }
    ]
  }, 
  resolve: {
    // List all the extensions that should be process by webpack
    //  '' empty string are for folders
    extensions: [ '.js', '.ts']
  },
  plugins: [
    new HtmlwebpackPlugin({
      template: './app/index.html'
    }),
    new webpack.ProvidePlugin({
        jQuery: 'jquery',
        $: 'jquery',
        jquery: 'jquery' ,
        'window.jQuery' : 'jquery',
         Hammer: 'hammerjs/hammer'
    }),
    new webpack.ContextReplacementPlugin(/protobufjs/, /^$/),
        new webpack.DefinePlugin({'process.env': {
          'ENV': JSON.stringify('prd'),
          'MERCHANT_ID': JSON.stringify('mxvt14ztaqjv8hfq61jh'),
          'PUBLIC_KEY': JSON.stringify('pk_e7d314e2c176477f86220b5801e813da'),
          'API_URL': JSON.stringify('https://lostdog-api.herokuapp.com/api/')
          }
        })
  ],
  node: {
    fs: 'empty'
  }
};