const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const autoprefixer = require("autoprefixer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry:  "./app/js/script.js",  
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",   // определяем загрузчик
        options:{
            presets:[ "@babel/preset-env"]
        }
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {              
              hmr: process.env.NODE_ENV === 'development',
              reloadAll: true
            },
          },       
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                  autoprefixer({
                      browsers:['ie >= 8', 'last 2 version']
                  })
              ],
              sourceMap: true
            }
          },
          'less-loader'               
        ]
      },
      {
        test: /\.(svg|png|gif|jpg)$/,        
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'img/'
        }
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'fonts/'
        }       
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,     
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: { '^/api': '' },
      }
    }

  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'     
     }),
    new HtmlWebpackPlugin({
      template: "./index.html"
    })
  ]
 
};