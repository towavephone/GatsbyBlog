---
title: 国际官网核心原理
categories:
   - 前端
path: /international-official-website-core-principle/
tags: 前端, 国际官网, 预研
date: 2022-3-11 09:57:01
draft: true
---

# 架构

## 选型背景

1. 搭建一个便于 SEO 的官网
2. 技术栈团队成员熟悉，开发方便

提到 SEO，主流的渲染方式都是 SSR

## 框架选型

详见 http://doc.ssr-fc.com/docs/features$technology

支持常见的流行前端框架 React/Vue2/Vue3，这里只列举 React 的

### 特性

- 前端框架: React v17, 实时跟进 React17 的新特性
- 开发语言: TypeScript
- 代码风格(可选): 默认 eslint-config-standard-react-ts
- 样式处理: less + css modules(根据后缀名自动识别 .module.less 文件使用 css-modules)
- UI 组件: 默认已对 antd 的使用做打包配置无需额外配置
- 前端路由: 约定式路由/声明式路由
- 数据管理: 使用 Hooks 提供的 useContext 实现极简的跨组件通信方案, 摒弃传统的 redux/dva 等数据管理方案
- 构建工具: Webpack/Vite

### 优点

1. 支持三种渲染模式

   支持服务端渲染与客户端渲染两种模式任意切换。随时安全降级。同时支持生成 html 文件独立部署也是同类型框架中唯一同时实现了三种功能的方案

2. 同时支持 Vite/Webpack
3. 轻量的数据管理方案（userContext + useReducer）
4. 支持约定式路由和声明式路由
5. 支持 antd 等流行框架（兼容 ssr）
6. 支持 midway，接口开发方便

### 缺点

1. 有些三方库并不支持 ssr，大多数时候需要改源码
2. 开发模式下采用 webpack 多次编译后会内存溢出
3. 文件较多时 webpack 编译速度较慢

### 优化方向

1. astro 孤岛架构，每个部分都可以延迟加载
2. remix 的并行加载、预加载
3. [前端 ssr](https://github.com/ascoders/weekly/blob/master/%E5%89%8D%E6%B2%BF%E6%8A%80%E6%9C%AF/54.%E7%B2%BE%E8%AF%BB%E3%80%8A%E5%9C%A8%E6%B5%8F%E8%A7%88%E5%99%A8%E8%BF%90%E8%A1%8C%20serverRender%E3%80%8B.md)，预渲染，设置合理缓存，减少服务器压力
4. service worker 缓存

## 目录介绍

详见 http://doc.ssr-fc.com/docs/features$structure

```
.
├── build # web 目录构建产物，与 public 文件夹一样会设置为静态资源文件夹，非应用构建产物静态资源文件如图片/字体等资源建议放在 public 文件夹前端代码通过绝对路径引入
│   ├── client # 存放前端静态资源文件
│   └── server # 存放 external 后的服务端 bundle
├── public # 作为静态资源目录存放静态资源文件
├── config.js # 定义应用的配置 (框架层面使用，生产环境需要)
├── config.prod.js # (可选) 若存在则视为生产环境的应用配置
├── f.yml # (可选)，仅在 Serverless 场景下使用，若调用 ssr deploy 检测到无此文件会自动创建
├── package.json
├── src # 存放服务端 Node.js 相关代码
│   └── index.ts
├── tsconfig.json # 服务端 Node.js 编译配置文件
├── typings # 存放前后端公共类型文件
├── web # 存放前端组件相关代码
│   ├── components # 存放公共组件
│   │   └── header # 公共头部
│   │   │   ├── index.less
│   │   │   └── index.tsx
│   │   └── layout # 页面 html 布局
│   │       └── index.tsx # 页面 html 布局，仅在服务端被渲染
│   │       └── App.tsx # 页面具体的组件内容，用于初始化公共配置
│   │       └── fetch.ts # layout 级别的 fetch，用于获取所有页面的公共数据，将会在每一个页面级别的 fetch 调用之前调用
│   ├── pages # pages 目录下的文件夹会映射为前端路由表，存放页面级别的组件
│   │   ├── index # index文件夹映射为根路由 /index => /
│   │   │   ├── fetch.ts # 定义 fetch 文件用来统一服务端/客户端获取数据的方式，通过 __isBrowser__ 变量区分环境，会在首页服务端渲染以及前端路由切换时被调用
│   │   │   ├── index.less
│   │   │   └── render.tsx # 定义 render 文件用来定义页面渲染逻辑
│   │   └── detail
│   │   │   ├── fetch.ts
│   │   │   ├── index.less
│   │   │   └── render$id.tsx # 映射为 /detail/:id
│   │   │   └── user
│   │   │        ├── fetch.ts
│   │   │        └── render$id.tsx # 多级路由按照规则映射为 /detail/user/:id
│   │   │        └── render$user$id.tsx # 多参数路由映射为 /detail/user/:user/:id
│   │   ├── bar
│   │   │   ├── fetch.ts
│   │   │   └── render.tsx
│   │   │   ├── fetch$id.ts
│   │   │   └── render$id.tsx # 当存在多个 render 类型的文件时，每个 render 文件对应与其同名的 fetch 文件，例如 render$id 对应 fetch$id
│   ├── tsconfig.json # web 目录下的 tsconfig 仅用于编辑器 ts 语法检测
```

# 核心

## 多语言

采用 react-i18next 适配多语言，支持解析多文件夹，携带路径前缀等特性

### 文件目录

```
locales
   lang
      da-DK
      en-US
      nb-NO
      nl-NL
      sv-SE
i18n.ts
```

### 使用方式

比如 locales/lang/da-DK/g3i/car-text.ts 下配置：

```js
export default {
   withPathPrefix: true,
   withFilePrefix: true,
   title: '123456'
};
```

此时拿到的 title 的 key 为 `g3I.carText.title`, 是哪个国家根据后端拿到的 language 字符判断

使用时代码如下：

```ts
const { t } = useTranslation();
const getValue = (param: string) => t(`g3I.carText.${param}`);
```

### 核心代码

进入通用组件，切换语言

```ts
initLanguage(state?.language).catch()
const { i18n } = useTranslation()
useEffect(() => {
   state?.language && i18n.changeLanguage(state.language)
   // eslint-disable-next-line react-hooks/exhaustive-deps
}, [state?.language])
```

读取文件夹下语言配置

```ts
import i18n, { Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { DEFAULT_LANGUAGE } from '@/constants';
import path from 'path';
import { camelCase } from 'lodash';

const moduleFiles = require.context('./lang', true, /\.ts$/);

const resources: Resource = {};

moduleFiles.keys().forEach((item: string) => {
   const dirname = path.dirname(item);
   // 取路径里面的第一个目录
   const keys = dirname.split('/').filter((item) => item && item !== '.');
   const [key, ...restKey] = keys;
   if (key) {
      let value = moduleFiles(item).default || moduleFiles(item);
      const pathPrefix = [];
      // 是否携带路径前缀
      if (value.withPathPrefix) {
         pathPrefix.push(...restKey);
      }

      // 是否携带文件前缀
      if (value.withFilePrefix) {
         const basename = path.basename(item, '.ts');
         pathPrefix.push(basename);
      }

      if (pathPrefix.length > 0) {
         const newValue: { [key: string]: any } = {};
         const newPathPrefix = pathPrefix.map(camelCase).join('.');
         Object.keys(value).forEach((key2) => {
            newValue[`${newPathPrefix}.${key2}`] = value[key2];
         });
         value = newValue;
      }

      if (resources[key]) {
         resources[key].translation = {
            ...(resources[key].translation as {}),
            ...value
         };
      } else {
         resources[key] = {
            translation: value
         };
      }
   }
});

export const initLanguage = async function(language: string = DEFAULT_LANGUAGE) {
   if (i18n.isInitialized) {
      if (language !== i18n.language) {
         await i18n.changeLanguage(language);
      }
      return;
   }
   return await i18n
      .use(initReactI18next) // passes i18n down to react-i18next
      .init({
         resources,
         debug: process.env.NODE_ENV === 'development',
         lng: language,
         keySeparator: false, // we do not use keys in form messages.welcome
         interpolation: {
            escapeValue: false
         }
         // 不能使用数组或对象，因为需要用户去填字符串
         // returnObjects: true
      })
      .catch((error) => {
         console.info('initReactI18next error:', error);
      });
};
```

### 优化方向

1. 改造成 history.push 的跳转时切换多语言未生效
2. 不支持热加载，需重新刷新后才会生效
3. 多语言配置到后台，直接从后台读

## 动效

[动效一览](https://lgst5rvnj2.feishu.cn/sheets/shtcnqVzHsbC1nnHIWrmlmssiVc?table=tblUDHlEq3ZXvNm4&view=vewUNrsVAJ&sheet=q7FBB0)

1. react-spring（触发型动效）
2. react-gsap（触发型动效，受控型动效）
3. react-scrollmagic（页面停留组件）
4. 图片序列帧

### 触发型动效

1. 位移 + 数字跳动（react-spring）
2. 文字从上到下逐渐显示、p7-wing 鹏翼门的放大缩小（react-gsap）

示例页面：https://www.heyxpeng.com/p7

### 受控型动效

1. 受控的图片序列帧的播放（canvas 实现的视频播放器，jsmpeg，react-gsap + jsmpeg）
2. 播放镂空文字（react-gsap + mix-blend-mode）

示例页面：https://www.heyxpeng.com/p7

### 优化方向

1. 图片序列帧的性能优化，目前方案在有些机器上帧率过低（采用图片序列帧 + avif）
2. 在页面滚动过快时，react-gsap 执行不完全

## 多端适配

### 方案

采用 @our-patches/postcss-px-to-viewport 插件

1. PC 端根据 1920 px 的设计稿宽度直接转换成 rem 单位，再由 css 多媒体查询去控制
2. h5 端直接使用 vw 单位

### 核心代码

配置代码：

```js
module.exports = {
   plugins: [
      [
         '@our-patches/postcss-px-to-viewport',
         {
            // https://github.com/evrone/postcss-px-to-viewport/blob/master/README_CN.md
            unitToConvert: 'px', // 需要转换的单位，默认为"px"
            viewportWidth: 1920, // 视窗的宽度，对应设计稿的宽度
            unitPrecision: 8, // 指定 px 转换为视窗单位值的小数后 x 位数，转换精度尽可能的大，防止出现图片比例问题
            viewportUnit: 'rem', // 希望使用的视口单位
            fontViewportUnit: 'rem', // 字体使用的视口单位,
            minPixelValue: 1, // 最小的转换数值
            mediaQuery: true, // 媒体查询里的单位是否需要转换单位
            selectorBlackList: [/^html$/, 'hack'],
            exclude: /node_modules/,
            include: [/(\\|\/)web(\\|\/)/]
         }
      ],
      // 此插件主要修复了移动端 100vh 的高度（即减去搜索框的高度）
      // 效果：https://codepen.io/team/css-tricks/full/vapjge
      // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
      'postcss-viewport-height-correction'
   ]
};
```

```css
@media screen and (min-width: 2560px) and (max-width: 5119px) {
   html {
      font-size: 22.26px;
   }
}

@media screen and (min-width: 2388px) and (max-width: 2559px) {
   html {
      font-size: 21.15px;
   }
}

/* ... */
```

### 优化方向

1. 所有端都使用 rem 单位，便于控制
2. 适配 ipad 端
3. 使用以下语法，保证适配的合理性

   ```css
   @media screen and (min-width: 375px) {
      html {
         /* 375 宽度使用 16px 的基准尺寸，414 宽度时字号大小为 18px */
         font-size: calc(16px + 2 * (100vw - 375px) / 39);
      }
   }
   ```

## 懒加载

lazyLoader 通用组件使用 vanilla-lazyload，对 video、img、div 的懒加载封装

[文档](https://lgst5rvnj2.feishu.cn/sheets/shtcnqVzHsbC1nnHIWrmlmssiVc?table=tbldGkkqr5yse2oT&view=vew1FvZJiF&sheet=j9pMmo)

### 优化方向

1. 预加载
2. 组件级别的懒加载、预加载

## 视频压缩

### 背景

需要对视频进行压缩，图片序列帧进行格式转换，支持多文件、并行压缩

### 核心代码

scripts/compress.mjs

```js
#!/usr/bin/env zx
const { get } = require('lodash');

const compressConfig = require('../compress.config');
const concurrentRun = require('./concurrentRun');

// 关闭日志输出
$.verbose = false;

const FILE_SUFFIX = 'mp4';
const TMP_FILE_SUFFIX = '.bak.mp4';

const delFiles = await globby(`public/**/*${TMP_FILE_SUFFIX}`);

await $`rm -rf ${delFiles}`;

let files = [];

const params = argv._.slice(1);
if (params.length > 0) {
   files = params.filter((item) => /mp4$/.test(item));
} else {
   files = await globby(`public/**/*.${FILE_SUFFIX}`);
}

console.log(`开始压缩 ${FILE_SUFFIX}`);

// https://github.com/google/zx/issues/126
$.noquote = async (...args) => {
   const q = $.quote;
   $.quote = (v) => v;
   const p = $(...args);
   await p;
   $.quote = q;
   return p;
};

const transformToMpeg = async (bashFunc, file) => {
   await $.noquote`${bashFunc(file, file.replace(/mp4$/, 'mpeg'))}`;
   // await $`rm -rf ${file}`
};

const transformToMp4 = async (bashFunc, file) => {
   await $.noquote`${bashFunc(file, file + TMP_FILE_SUFFIX)}`;
   await $`rm -rf ${file}`;
   await $`mv ${file}${TMP_FILE_SUFFIX} ${file}`;
   await $`rm -rf ${file}${TMP_FILE_SUFFIX}`;
};

const funcArray = [
   {
      path: 'mpeg.4',
      func: transformToMpeg
   },
   {
      path: 'mp4.hasAudio',
      func: transformToMp4
   },
   {
      path: 'mp4',
      func: transformToMp4
   }
];

await concurrentRun(
   files.map((file) => async () => {
      for (let i = 0; i < funcArray.length; i++) {
         const item = funcArray[i];
         const { bashFunc, files } = get(compressConfig.mp4, item.path);
         // files 未定义或者包含 file
         if (!files || files.includes(file)) {
            await item.func(bashFunc, file);
            return Promise.resolve();
         }
      }
      return Promise.resolve();
   })
);

console.log(`共 ${files.length} 个 ${FILE_SUFFIX} 压缩完成`);
```

compress.config.js

```js
module.exports = {
   mp4: {
      mp4: {
         bashFunc: (input, output) =>
            `ffmpeg -y -i ${input} -b:v 2048k -maxrate:v 2048k -minrate:v 2048k -r 25 -an -movflags faststart -v fatal ${output}`,
         hasAudio: {
            bashFunc: (input, output) =>
               `ffmpeg -y -i ${input} -b:v 2048k -maxrate:v 2048k -minrate:v 2048k -r 25 -movflags faststart -v fatal ${output}`,
            files: ['public/p7/xmart-os/p7-p6-1.mp4', 'public/no/p7/build-yours/p7-p1-1@long.mp4']
         }
      },
      mpeg: {
         4: {
            bashFunc: (input, output) =>
               `ffmpeg -y -i ${input} -f mpeg1video -codec:v mpeg1video -q 4 -bf 0 -r 25 -an -movflags faststart -v fatal ${output}`,
            files: [
               'public/p5/smart-space-internal/p5-inside.mp4',
               'public/p7/extra-performance/p7-chassis.mp4',
               'public/p7/learn-more/p7-wing.mp4',
               'public/g3i/xmart-os/g3i-inside.mp4'
            ]
         }
      }
   }
};
```

### 使用方式

```bash
yarn compress # 压缩全部视频文件
yarn public/g9/1.mp4 public/g9/2.mp4 public/g9/3.mp4 # 部分压缩
```

### 优化方向

1. 支持图片压缩
2. 压缩脚本工具化
3. 图片、视频的 cdn、格式优化（av1, avif）

# 痛点

1. 国际站与国家站，pc 与 h5 代码相互影响
2. 复用样式太多，导致需要重置的样式也很多（尽量少写或不写复用样式，除非非常确定。pc 端与 h5 端样式利用媒体查询分开写）
3. antd 组件的适配方式有问题，未转化为 rem 单位
4. h5 下应该使用 antd-mobile 组件
5. 国家站车型部分重复代码过多
6. 生成路由含有 2 个国家及以上的（已解决）
7. 官网内的链接跳转未使用 history.push（解决中）
