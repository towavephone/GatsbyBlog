const path = require('path');
const { defineConfig } = require('@rspack/cli');
const fs = require('fs');
const rspack = require('@rspack/core');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const dotenv = resolveApp('.env');

const NODE_ENV = process.env.NODE_ENV;
// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const dotenvFiles = [
  `${dotenv}.${NODE_ENV}.local`,
  // Don't include `.env.local` for `test` environment
  // since normally you expect tests to produce the same
  // results for everyone
  NODE_ENV !== 'test' && `${dotenv}.local`,
  `${dotenv}.${NODE_ENV}`,
  dotenv
].filter(Boolean);

// Load environment variables from .env* files. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.  Variable expansion is supported in .env files.
// https://github.com/motdotla/dotenv
// https://github.com/motdotla/dotenv-expand
dotenvFiles.forEach((dotenvFile) => {
  if (fs.existsSync(dotenvFile)) {
    require('dotenv-expand')(
      require('dotenv').config({
        path: dotenvFile
      })
    );
  }
});

const { DISABLE_OVERLAY } = process.env;

module.exports = defineConfig({
  mode: 'development',
  entry: {
    main: './src/index.js'
  },
  builtins: {
    pluginImport: [
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true
      }
    ],
    define: {
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
      {
        test: /\.(png|svg|jpg|jpeg|ttf)$/,
        type: 'asset'
      }
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
      // 'antd/es/theme': false // 修复因 @ant-design/pro-components 导致的编译报错问题
    },
    extensions: ['.js'],
    // 修复因 @ant-design/pro-components 导致的编译报错问题
    mainFields: ['main', 'browser', 'module']
  },
  devServer: {
    port: 3000,
    allowedHosts: 'all',
    client: {
      overlay: !DISABLE_OVERLAY
    }
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
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: './public/index.html'
    }),
    new rspack.ProgressPlugin()
  ]
});
