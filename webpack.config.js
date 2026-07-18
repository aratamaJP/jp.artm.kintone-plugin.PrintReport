var path = require('path')
const webpack = require('webpack')

const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  entry: {
    config: path.resolve(__dirname, './src/config/main.ts'),
    desktop: path.resolve(__dirname, './src/desktop/main.ts')
  },
  output: {
    path: path.resolve(__dirname, './plugin/js'),
    publicPath: '/plugin/',
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
          configFile: path.resolve(__dirname, 'tsconfig.json')
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      // {
      //   test: /\.(png|jpg|gif|svg)$/,
      //   loader: 'file-loader',
      //   options: {
      //     name: '[name].[ext]?[hash]'
      //   }
      // }
    ]
  },
  resolve: {
    alias: {
      // 'vue$': 'vue/dist/vue.esm.js',
      ['@']: path.resolve(__dirname + '/src'),
    },
    extensions: ['*', '.js', '.ts', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  plugins: [
    new VueLoaderPlugin()
  ],
}
