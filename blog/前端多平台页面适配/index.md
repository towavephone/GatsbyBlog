---
title: 前端多平台页面适配
categories:
   - 后端
path: /frontend-multi-platform-page-adaptation/
tags: 前端, 页面适配, 预研
date: 2025-10-27 11:43:35
---

# 背景

网页在不同平台上展示的布局不一致，需要改成类似等比缩放的效果以便在各平台显示

# 选型

1. [主流方案](/mobile-page-adaptation/)
2. [官网方案](/international-official-website-technical-difficulties/#%E5%A4%9A%E5%B9%B3%E5%8F%B0%E9%80%82%E9%85%8D)

# 实现

## 核心逻辑

1. 使用 postcss-px-to-viewport 插件，将 src 以及三方库(node_modules)下的所有样式文件 `(*.css|*.module.css|*.less|*.module.less)` 里面的 px 单位转换到 rem 单位
2. 在公共样式下根据媒体查询（屏幕宽度 or 屏幕 dpi）设置每种字体的大小
3. 由于目前插件不能转换非样式文件里面的 px 单位，所以需要写两种公共样式，这里会通过 url 来决定哪种生效

   1. 需要等比缩放的，根据屏幕宽度改变字体大小（新页面，即此次重构页面）
   2. 需要固定大小的，固定设置为 1920 下的字体大小（老页面）

重构目标：重构页面采用等比缩放，老页面维持固定大小，注意上线之后所有非样式代码即 js 文件里面禁止使用 px 单位，需要手动转换为 rem 单位，转换公式为 px 大小 / 10

最终目标：所有页面统一采用等比缩放 （即将 js 代码里面的 px 单位全部改为 rem 单位，三方库里面的 js 代码暂不考虑，之后才能全部采用此方案）

## postcss.config.js（插件转换 px 为 rem）

### 配置分离

由于想让 cra 使用 postcss.config.js 的配置（cra 默认不使用），在 cra 5 版本和 customize-cra 情况下，addPostcssPlugins [不起作用](https://github.com/arackaf/customize-cra/issues/327#issuecomment-1210459104)，有 2 种方式可以解决

1. 重写 addPostcssPlugins

   ```js
   const addPostcssPlugins = (plugins) => (config) => {
      const rules = config.module.rules.find((rule) => Array.isArray(rule.oneOf)).oneOf;
      rules.forEach(
         (r) =>
            r.use &&
            r.use.forEach((u) => {
               if (u.options && u.options.ident === 'postcss') {
                  const postcssOptions = {
                     ident: 'postcss',
                     config: false
                  };
                  if (!u.options.plugins) {
                     // u.options.plugins = () => [...plugins]
                     postcssOptions.plugins = plugins;
                  } else {
                     // const originalPlugins = u.options.plugins
                     // u.options.plugins = () => [...originalPlugins(), ...plugins]
                     postcssOptions.plugins = plugins;
                  }

                  delete u.options.plugins;
                  delete u.options.ident;

                  u.options.postcssOptions = postcssOptions;
               } else if (u.options && u.options.postcssOptions && u.options.postcssOptions.ident === 'postcss') {
                  if (!u.options.postcssOptions.plugins) {
                     u.options.postcssOptions.plugins = plugins;
                  } else {
                     const originalPlugins = u.options.postcssOptions.plugins;
                     u.options.postcssOptions.plugins = [...originalPlugins, ...plugins];
                  }
               }
            })
      );
      return config;
   };
   ```

2. 去掉相关配置，[依赖 postcss.config.js](https://github.com/arackaf/customize-cra/issues/327#issuecomment-1371815281)

   ```js
   const enablePostcssRc = () => (config) => {
      const rules = config.module.rules.find((rule) => Array.isArray(rule.oneOf)).oneOf;
      rules.forEach(
         (r) =>
            r.use &&
            r.use.forEach((u) => {
               if (u.options && u.options.ident === 'postcss') {
                  delete u.options.ident;
                  if (u.options.plugins) {
                     delete u.options.plugins; // 删除 plugins 属性，使用 postcss.config.js 中的配置
                  }
               }

               if (u.options && u.options.postcssOptions && u.options.postcssOptions.ident === 'postcss') {
                  delete u.options.postcssOptions;
               }
            })
      );
      return config;
   };
   ```

采用方案二

### rspack 适配

rule 需要添加以下规则来兼容业务代码/三方库的样式文件

```js
{
   module: {
      rules: [
         {
            test: /\.css$/,
            exclude: /\.module\.css$/,
            use: ['postcss-loader'],
            type: 'css'
         },
         {
            test: /\.module\.css$/,
            use: ['postcss-loader'],
            type: 'css/module'
         },
         {
            test: /\.less$/,
            exclude: /\.module\.less$/,
            use: [
               'postcss-loader',
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
            test: /\.module\.less$/,
            use: [
               'postcss-loader',
               {
                  loader: 'less-loader',
                  options: {
                     lessOptions: { javascriptEnabled: true }
                  }
               }
            ],
            type: 'css/module'
         }
      ];
   }
}
```

### 配置代码

postcss.config.js

```js
module.exports = {
   plugins: [
      'postcss-flexbugs-fixes',
      [
         'postcss-preset-env',
         {
            autoprefixer: {
               flexbox: 'no-2009'
            },
            stage: 3
         }
      ],
      'postcss-normalize',
      [
         'postcss-px-to-viewport',
         {
            // https://github.com/evrone/postcss-px-to-viewport/blob/master/README_CN.md
            unitToConvert: 'px', // 需要转换的单位，默认为"px"
            viewportWidth: 1000, // 视窗的宽度，对应设计稿的宽度
            unitPrecision: 8, // 指定 px 转换为视窗单位值的小数后 x 位数，转换精度尽可能的大，防止出现图片比例问题
            viewportUnit: 'rem', // 希望使用的视口单位
            fontViewportUnit: 'rem', // 字体使用的视口单位
            minPixelValue: 1, // 最小的转换数值
            mediaQuery: true, // 媒体查询里的单位是否需要转换单位
            selectorBlackList: [/^html$/, 'hack'] // 需要忽略的 CSS 选择器，不会转为视口单位，使用原有的 px 等单位
            // include: /\/src\//
            // exclude: /node_modules/,
         }
      ]
   ]
};
```

## common.less（缩放规则）

```less
// 固定大小的页面
.hackFixedPage {
   font-size: 10px;
}

// 等比缩放的页面
.hackResponsivePage {
   // 大于 1500px (10px)
   @media screen and (min-width: 1501px) {
      font-size: 10px;
   }

   // 1300px～1500px 的宽度区间的根字号大小是某个范围（8px～10px）
   @media screen and (min-width: 1300px) and (max-width: 1500px) {
      font-size: calc(8px + 2 * (100vw - 1300px) / 200);
   }

   // 小于 1300px 的屏幕宽度，固定根字号大小（8px）
   @media screen and (max-width: 1299px) {
      font-size: 8px;
   }
}
```

## 实际使用

```less
.hintIcon {
   font-size: 14px; // 实际转换为 14 / 10 = 1.4rem
   margin-left: 8px; // 实际转换为 8 / 10 = 0.8rem
   vertical-align: 1px; // 不做转换
}
```

# 三方库非样式文件单位转换

在上面适配规则上线之后，发现有的三方库不能正确的缩放，导致页面看起来不协调，以下是各个三方库的修复

## pro components

参考[文档](https://github.com/ant-design/cssinjs?tab=readme-ov-file)，对应[源码](https://github.com/ant-design/cssinjs/blob/master/src/transformers/px2rem.ts)，可以看出是运行时的单位转换

```js
import { px2remTransformer, StyleProvider } from '@ant-design/cssinjs';

const StyleHoc = ({ children }) => {
   // 和上面的 postcss-px-to-viewport 的适配策略保持一致
   // 以 10 为根字体大小进行转换，保留 8 位小数，媒体查询下也进行转换
   return (
      <StyleProvider transformers={[px2remTransformer({ rootValue: 10, precision: 8, mediaQuery: true })]}>
         {children}
      </StyleProvider>
   );
};
```

## mui

参考[文档](https://v5.mui.com/material-ui/customization/theming/)

```js
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
   // 和上面的 postcss-px-to-viewport 的适配策略保持一致
   // 以 10 为根字体大小进行转换
   typography: {
      pxToRem: (size) => `${size / 10}rem`
   }
});

const ThemeHoc = ({ children }) => {
   return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
```
