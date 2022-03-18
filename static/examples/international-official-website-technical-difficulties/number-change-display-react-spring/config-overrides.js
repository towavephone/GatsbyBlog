const { override, addLessLoader } = require('customize-cra');

module.exports = override(
  // 添加 less-loader
  addLessLoader({ lessOptions: { javascriptEnabled: true } }),

  // 自定义配置
  (config) => {
    // 全局删除 console
    if (process.env.GENERATE_SOURCEMAP === 'false') {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
    }

    // 打印运行配置
    // const fs = require('fs');
    // fs.writeFileSync(`config-${process.env.NODE_ENV}.json`, JSON.stringify(config.plugins[0], null, 2));

    return config;
  }
);
