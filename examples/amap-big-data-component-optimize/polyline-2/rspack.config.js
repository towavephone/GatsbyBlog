const path = require('path');

module.exports = {
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
        style: true
      }
    ]
  },
  module: {
    rules: [
      {
        test: /.*\.js$/,
        include: /src/,
        type: 'jsx'
      },
      {
        test: /.less$/,
        use: [
          {
            loader: 'less-loader',
            options: {
              lessOptions: { javascriptEnabled: true }
            }
          }
        ],
        type: 'css/module'
      }
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  devServer: {
    allowedHosts: 'all'
  }
};
