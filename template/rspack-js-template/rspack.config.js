const path = require('path');

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
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: /src/,
        type: 'jsx'
      },
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
      }
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    extensions: ['.js']
  },
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
