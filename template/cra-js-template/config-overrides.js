const {
  override,
  // addBabelPlugins,
  fixBabelImports,
  addLessLoader,
  removeModuleScopePlugin,
  // setWebpackOptimizationSplitChunks,
  addWebpackPlugin,
  addWebpackAlias,
  adjustStyleLoaders
} = require('customize-cra');
const fs = require('fs');
const webpack = require('webpack');
// const PreloadWebpackPlugin = require('preload-webpack-plugin')
const path = require('path');
// const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const WebpackBarPlugin = require('webpackbar');
const { get, pick } = require('lodash');
const threadLoader = require('thread-loader');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const { LAZY_BUILD, DISABLE_CACHE, DEBUG_CACHE, BUNDLE_ANALYZER } = process.env;

threadLoader.warmup(
  {
    // pool options, like passed to loader options
    // must match loader options to boot the correct pool
  },
  [
    // modules to load
    // can be any module, i. e.
    'babel-loader'
  ]
);

const craDir = path.join(process.cwd() + '/.cra');

if (!fs.existsSync(craDir)) {
  fs.mkdirSync(craDir);
}

const addBeforeLoaders = (webpackConfig, matchLoader, newLoader = []) => {
  const matchLoaders = get(webpackConfig, 'module.rules.0.oneOf', []).filter((item) =>
    get(item, 'loader', '').includes(matchLoader)
  );
  if (matchLoaders.length > 0) {
    matchLoaders.forEach((item) => {
      const props = ['loader', 'options'];
      item.use = [...newLoader, pick(item, props)];
      props.forEach((item2) => {
        delete item[item2];
      });
    });
  }
};

const formatConfig = (config) =>
  JSON.stringify(
    config,
    (key, value) => {
      if (typeof value === 'function') {
        return value.toString();
      }
      return value;
    },
    2
  );

module.exports = {
  webpack: (config, env) => {
    const isProd = env === 'production';

    const localConfig = override(
      // addBabelPlugins(['@babel/plugin-proposal-nullish-coalescing-operator'], ['@babel/plugin-syntax-optional-chaining']),
      fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true
      }),
      addLessLoader({
        lessOptions: { javascriptEnabled: true }
      }),
      adjustStyleLoaders(({ use: [, , postcss] }) => {
        const postcssOptions = postcss.options;
        postcss.options = { postcssOptions };
      }),
      addWebpackAlias({
        '@': path.resolve(__dirname, 'src')
      }),
      removeModuleScopePlugin(),
      // isProd &&
      //   setWebpackOptimizationSplitChunks({
      //     cacheGroups: {
      //       vendors: {
      //         minChunks: 2,
      //         test: /[\\/]node_modules[\\/]\.pnpm[\\/](?!google-protobuf|@antv|highcharts|mathjs|two\.js|konva|victory-core)/,
      //         priority: -10,
      //         reuseExistingChunk: true,
      //         name: 'vendors'
      //       },
      //       default: {
      //         minChunks: 2,
      //         priority: -20,
      //         reuseExistingChunk: true
      //       }
      //     }
      //   }),
      // isProd &&
      //   addWebpackPlugin(
      //     new PreloadWebpackPlugin({
      //       rel: 'prefetch',
      //       as: 'script',
      //       fileBlacklist: [/\d{1,2}\.(\d?[a-z]?)+\.chunk\.js$/, /main\..+\.js$/, /\.css$/, /\.txt$/, /\.png$/, /.jpeg$/, /.cjs$/, /.svg$/, /.ttf$/],
      //       include: 'allAssets'
      //     })
      //   ),
      // addWebpackPlugin(
      //   new MonacoWebpackPlugin({
      //     languages: ['json']
      //   })
      // ),
      addWebpackPlugin(
        new webpack.DefinePlugin({
          'process.env.BUILD_TOOL': "'webpack'"
        })
      ),
      // addWebpackPlugin(
      //   new webpack.ProvidePlugin({
      //     Buffer: ['buffer', 'Buffer']
      //   })
      // ),
      BUNDLE_ANALYZER &&
        addWebpackPlugin(
          new BundleAnalyzerPlugin({
            analyzerPort: 8080,
            generateStatsFile: true
          })
        ),
      addWebpackPlugin(new WebpackBarPlugin())
    )(config);

    addBeforeLoaders(localConfig, 'babel-loader', ['thread-loader']);

    localConfig.resolve.extensions = ['.js'];
    localConfig.resolve.modules = ['node_modules'];
    // localConfig.resolve.fallback = {
    //   buffer: require.resolve('buffer')
    // }

    if (LAZY_BUILD) {
      localConfig.experiments = {
        lazyCompilation: {
          // disable lazy compilation for dynamic imports
          imports: true,

          // disable lazy compilation for entries
          entries: false

          // do not lazily compile moduleB
          // test: module => !/moduleB/.test(module.nameForCondition())
        }
      };
    }

    if (DEBUG_CACHE) {
      localConfig.infrastructureLogging = { debug: /PackFileCache/ };
    }

    if (DISABLE_CACHE) {
      localConfig.cache = false;
    }

    if (!isProd) {
      localConfig.stats = {
        errors: true,
        children: false,
        warnings: false,
        colors: true,
        assets: false,
        modules: false,
        entrypoints: false,
        timings: true,
        builtAt: true,
        hash: true
      };
    }

    fs.writeFileSync(path.join(craDir, `webpack.${env}.json`), formatConfig(localConfig));

    return localConfig;
  },
  devServer: (configFunction) => (proxy, allowedHost) => {
    const config = configFunction(proxy, allowedHost);

    config.allowedHosts = 'all';

    fs.writeFileSync(path.join(craDir, 'webpack-dev-server.json'), formatConfig(config));

    return config;
  }
};
