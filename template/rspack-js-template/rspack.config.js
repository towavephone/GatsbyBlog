const path = require('path');
// const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
// const NodePolyfill = require('@rspack/plugin-node-polyfill')

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js'
  },
  builtins: {
    html: [
      {
        template: './public/index.html'
      }
    ],
    pluginImport: [
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true
      }
    ],
    define: {
      // 'process.env.NODE_ENV': "'development'",
      'import.meta.env': "'development'",
      'import.meta.env.MODE': "'development'",
      'process.env.NODE_DEBUG': false,
      'process.env.BUILD_TOOL': "'rspack'"
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: /src/,
        type: 'jsx'
      },
      // {
      //   test: /(StreamDataWorker|MapDataWorker|FrameProcessWorker)\.js/,
      //   // use: [
      //   //   {
      //   //     loader: 'worker-loader',
      //   //     options: {
      //   //       filename: '[name].[hash].worker.js'
      //   //     }
      //   //   }
      //   // ]
      //   type: 'asset/resource'
      // },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'less-loader',
            options: {
              lessOptions: { javascriptEnabled: true }
            }
          }
        ],
        type: 'css/module'
      },
      {
        test: /\.less$/,
        include: /node_modules/,
        use: [
          {
            loader: 'less-loader',
            options: {
              lessOptions: { javascriptEnabled: true }
            }
          }
        ],
        type: 'css'
      },
      // {
      //   test: /\.css$/,
      //   type: 'css'
      // },
      {
        test: /\.(png|svg|jpg|jpeg|ttf)$/,
        type: 'asset'
      }
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'antd/es/theme': false // 修复因 @ant-design/pro-components 导致的编译报错问题
    },
    extensions: ['.js']
    // mainFields: ['main']
  },
  // plugins: [
  //   new MonacoWebpackPlugin({
  //     languages: ['json']
  //   })
  //   // new NodePolyfill()
  // ],
  devServer: {
    port: 3000,
    allowedHosts: 'all'
  },
  devtool: 'source-map',
  snapshot: {
    resolve: {
      hash: true,
      timestamp: false
    },
    module: {
      hash: true,
      timestamp: false
    }
  },
  stats: {
    preset: 'errors-only',
    reasons: true,
    hash: true,
    builtAt: true,
    timings: true
  },
  experiments: {
    incrementalRebuild: true
  }
};
