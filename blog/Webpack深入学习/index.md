---
title: Webpack 深入学习
date: 2021-9-1 18:12:15
categories:
  - 前端
tags: 前端, webpack, 前端构建工具
path: /webpack-deep-learn/
---

# 基础

## 简介

### entry(入口)

入口起点(entry point)即是 webpack 通过该起点找到本次项目所直接或间接依赖的资源（模块、库等），并对其进行处理，最后输出到 bundle 中。入口文件由用户自定义，可以是一个或者多个，每一个 entry 最后对应一个 bundle。

### output(出口)

通过配置 output 属性可以告诉 webpack 将 bundle 命名并输出到对应的位置。

### loader

webpack 核心，webpack 本身只能识别 js 文件，对于非 js 文件，即需要 loader 转换为 js 文件。换句话说，,Loader 就是资源转换器。由于在 webpack 里，所有的资源都是模块，不同资源都最终转化成 js 去处理。针对不同形式的资源采用不同的 Loader 去编译，这就是 Loader 的意义。

### 插件（plugin）

webpack 核心，loader 处理非 js 文件，那么插件可以有更广泛的用途。整个 webpack 其实就是各类的插件形成的，插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。插件接口功能极其强大，可以用来处理各种各样的任务。

### Chunk

被 entry 所依赖的额外的代码块，同样可以包含一个或者多个文件。chunk 也就是一个个的 js 文件，在异步加载中用处很大。chunk 实际上就是 webpack 打包后的产物，如果你不想最后生成一个包含所有的 bundle，那么可以生成一个个 chunk，并通过按需加载引入。同时它还能通过插件提取公共依赖生成公共 chunk，避免多个 bundle 中有多个相同的依赖代码。

## 实践 & 优化

### url-loader & image-webpack-loader

url-loader 可以在文件大小（单位 byte）低于指定的限制，将文件转换为 DataURL，这在实际开发中非常有效，能够减少请求数，在 vue-cli 和 create-react-app 中也都能看到对这个 loader 的使用。

```js
// "url" loader works just like "file" loader but it also embeds
// assets smaller than specified size as data URLs to avoid requests.
{
  test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
  loader: require.resolve('url-loader'),
  options: {
    limit: 10000,
    name: 'static/media/[name].[hash:8].[ext]',
  },
},
```

image-webpack-loader 这是一个可以通过设置质量参数来压缩图片的插件，但个人觉得在实际开发中并不会经常使用，图片一般是 UI 提供，一般来说，他们是不会同意图片的质量有问题。

### 资源私有化

以这种方式加载资源，你可以以更直观的方式将模块和资源组合在一起。无需依赖于含有全部资源的 /assets 目录，而是将资源与代码组合在一起。例如，类似这样的结构会非常有用

```
- |- /assets
+ |– /components
+ |  |– /my-component
+ |  |  |– index.jsx
+ |  |  |– index.css
+ |  |  |– icon.svg
+ |  |  |– img.png
```

当然，这种选择见仁见智

### Tree-Shaking

前端中的 tree-shaking 就是将一些无关的代码删掉不打包。在 Webpack 项目中，我们通常会引用很多文件，但实际上我们只引用了其中的某些模块，但却需要引入整个文件进行打包，会导致我们的打包结果变得很大，通过 tree-shaking 将没有使用的模块摇掉，这样来达到删除无用代码的目的。

Tree-Shaking 的原理可以参考[这篇文章](https://juejin.cn/post/6844903544756109319)

归纳起来就是

> 1. ES6 的模块引入是静态分析的，故而可以在编译时正确判断到底加载了什么代码。
> 2. 分析程序流，判断哪些变量未被使用、引用，进而删除此代码

[Tree-Shaking 不起作用，代码没有被删？](https://segmentfault.com/a/1190000012794598)

归纳起来就是

> 因为 Babel 的转译，使得引用包的代码有了副作用，而副作用会导致 Tree-Shaking 失效。

Webpack 4 默认启用了 Tree Shaking。对副作用进行了消除，以下是在 4.19.1 的实验

index.js

```js
import { cube } from './math.js';

console.log(cube(5));
```

math.js

```js
// 不打包 square
export class square {
  constructor() {
    console.log('square');
  }
}

export class cube {
  constructor(x) {
    return x * x * x;
  }
}
```

```js
// babel 编译后，同不打包
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.cube = cube;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

var square = (exports.square = function square() {
  _classCallCheck(this, square);

  console.log('square');
});

function cube(x) {
  console.log('cube');
  return x * x * x;
}
```

```js
// 不打包
export function square(x) {
  console.log('square');
  return x.a;
}

export function cube(x) {
  return x * x * x;
}
```

```js
// wow 被打包
export function square() {
  console.log('square');
  return x.a;
}

square({ a: 1 });

export function cube() {
  return x * x * x;
}
```

### sourcemap

简单说，Source map 就是一个信息文件，里面储存着位置信息。也就是说，转换后的代码的每一个位置，所对应的转换前的位置。

有了它，出错的时候，除错工具将直接显示原始代码，而不是转换后的代码，这无疑给开发者带来了很大方便。

webpack 中的 devtool 配置项可以设置 sourcemap，可以参考官方文档，然而 devtool 的许多选项都讲的不是很清楚，这里推荐该[文章](https://juejin.cn/post/6844903450644316174)，讲的比较详细

要注意，避免在生产中使用 `inline-*` 和 `eval-*`，因为它们可以增加 bundle 大小，并降低整体性能。

// TODO https://juejin.cn/post/6844903780123672590#heading-14
