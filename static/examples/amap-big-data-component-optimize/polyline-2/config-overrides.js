const {
  override,
  addLessLoader,
  fixBabelImports,
  addWebpackPlugin,
  addWebpackAlias,
  overrideDevServer,
  adjustStyleLoaders
} = require('customize-cra');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const path = require('path');
const fs = require('fs');

if (!fs.existsSync('.cra')) {
  fs.mkdirSync('.cra');
}

const modifyDevServer = () => (config) => {
  // 打印运行配置
  fs.writeFileSync(`.cra/dev-server-${process.env.NODE_ENV}.json`, JSON.stringify(config, null, 2));

  // config = {
  //   ...config,
  //   contentBase: [path.resolve(__dirname, 'public'), path.resolve(__dirname, 'images')],
  //   headers: {
  //     'Access-Control-Allow-Origin': '*'
  //   }
  // };
  return config;
};

module.exports = {
  webpack: override(
    // 添加 less-loader
    addLessLoader({ lessOptions: { javascriptEnabled: true } }),
    adjustStyleLoaders(({ use: [, , postcss] }) => {
      const postcssOptions = postcss.options;
      postcss.options = { postcssOptions };
    }),
    addWebpackAlias({
      '@': path.resolve(__dirname, 'src')
    }),
    // 配置常用的按需加载
    fixBabelImports('antd', { libraryDirectory: 'es', style: true }),
    // Day.js 替换 momentjs 来大幅减小打包大小
    addWebpackPlugin(new AntdDayjsWebpackPlugin()),
    // 自定义配置
    (config) => {
      // 全局删除 console
      if (process.env.GENERATE_SOURCEMAP === 'false') {
        config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
      }

      fs.writeFileSync(`.cra/env-${process.env.NODE_ENV}.json`, JSON.stringify(process.env, null, 2));
      // 打印运行配置
      fs.writeFileSync(`.cra/webpack-${process.env.NODE_ENV}.json`, JSON.stringify(config, null, 2));

      return config;
    }
  ),
  devServer: overrideDevServer(
    // dev server plugin
    modifyDevServer()
  )
};
