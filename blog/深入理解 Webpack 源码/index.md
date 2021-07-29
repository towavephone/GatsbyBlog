---
title: 深入理解 Webpack 源码
date: 2021-7-29 10:56:23
categories:
  - 前端
tags: 前端, webpack, 前端构建工具
path: /deep-learn-webpack-source-code/
---

# 实现一个简单的 webpack

## 目标

现在的 webpack 是一个庞然大物，我们不可能实现其所有功能。那么，应该将目光聚焦在哪儿呢？从 webpack 的 [第一个 commit](https://github.com/webpack/webpack/tree/2e1460036c5349951da86c582006c7787c56c543) 可以看出，其当初最主要的目的是在浏览器端复用符合 CommonJS 规范的代码模块。这个目标不是很难，我们努力一把还是可以实现的。

注意：在此我们不考虑插件、loaders、多文件打包等等复杂的问题，仅仅考虑最基本的问题：如何将多个符合 CommonJS 规范的模块打包成一个 JS 文件，以供浏览器执行。

## bundle.js

显然，浏览器没法直接执行 CommonJS 规范的模块，怎么办呢？

将其转换成一个自执行表达式

注意：此处涉及到 webpack 构建出来的 bundle.js 的内部结构问题，如果不了解 bundle.js 具体是如何执行的，请务必搞清楚再往下阅读。可以参考 [这里](https://segmentfault.com/a/1190000006814420)

## 例子

我们实际要处理的例子是 [这个](https://github.com/towavephone/fake-webpack/tree/1bfcd0edf10f1a2ff3bfd7c418e7490a735b9823/examples/simple)：example 依赖于 a、b 和 c，而且 c 位于 node_modules 文件夹中，我们要将所有模块构建成一个 JS 文件，就是这里的 [output.js](https://github.com/towavephone/fake-webpack/blob/1bfcd0edf10f1a2ff3bfd7c418e7490a735b9823/examples/simple/output.js)

## 思路

仔细观察 [output.js](https://github.com/towavephone/fake-webpack/blob/1bfcd0edf10f1a2ff3bfd7c418e7490a735b9823/examples/simple/output.js)，我们能够发现：

1. 不管有多少个模块，头部那一块都是一样的，所以可以写成一个模板，也就是 templateSingle.js。
2. 需要分析出各个模块间的依赖关系。也就是说，需要知道 example 依赖于 a、b 和 c。
3. c 模块位于 node_modules 文件夹当中，但是我们调用的时候却可以直接 require('c')，这里肯定是存在某种自动查找的功能。
4. 在生成的 output.js 中，每个模块的唯一标识是模块的 ID，所以在拼接 output.js 的时候，需要将每个模块的名字替换成模块的 ID。也就是说

```js
// 转换前
let a = require('a');
let b = require('b');
let c = require('c');

// 转换后
let a = require(/* a */ 1);
let b = require(/* b */ 2);
let c = require(/* c */ 3);
```

ok，下面我们来逐一看看这些问题

### 分析模块依赖关系

CommonJS 不同于 AMD，是不会在一开始声明所有依赖的。CommonJS 最显著的特征就是用到的时候再 require，所以我们得在整个文件的范围内查找到底有多少个 require。怎么办呢？最先蹦入脑海的思路是正则。然而，用正则来匹配 require，有以下两个缺点：

1. 如果 require 是写在注释中，也会匹配到。
2. 如果后期要支持 require 的参数是表达式的情况，如 require('a'+'b')，正则很难处理。

因此，正则行不通。

一种正确的思路是：使用 JS 代码解析工具（如 esprima 或者 acorn），将 JS 代码转换成抽象语法树（AST），再对 AST 进行遍历。这部分的核心代码是 [parse.js](https://github.com/towavephone/fake-webpack/blob/1bfcd0edf1/lib/parse.js)。

在处理好了 require 的匹配之后，还有一个问题需要解决。那就是匹配到 require 之后需要干什么呢？举个例子：

举个例子：

```js
// example.js
let a = require('a');
let b = require('b');
let c = require('c');
```

这里有三个 require，按照 CommonJS 的规范，在检测到第一个 require 的时候，根据 require 即执行的原则，程序应该立马去读取解析模块 a。如果模块 a 中又 require 了其他模块，那么继续解析。也就是说，总体上遵循深度优先遍历算法。这部分的控制逻辑写在 [buildDeps.js](https://github.com/towavephone/fake-webpack/blob/1bfcd0edf1/lib/buildDeps.js) 中。

### 找到模块

在完成依赖分析的同时，我们需要解决另外一个问题，那就是如何找到模块？也就是模块的寻址问题，举个例子：

```js
// example.js
let a = require('a');
let b = require('b');
let c = require('c');
```

在模块 example.js 中，调用模块 a、b、c 的方式都是一样的。但是，实际上他们所在的绝对路径层级并不一致：a 和 b 跟 example 同级，而 c 位于与 example 同级的 node_modules 中。所以，程序需要有一个查找模块的算法，这部分的逻辑在 [resolve.js](https://github.com/towavephone/fake-webpack/blob/1bfcd0edf1/lib/resolve.js) 中。

目前实现的查找逻辑是：

1. 如果给出的是绝对路径/相对路径，只查找一次。找到？返回绝对路径。找不到？返回 false。
2. 如果给出的是模块的名字，先在入口 js（example.js）文件所在目录下寻找同名 JS 文件（可省略扩展名）。找到？返回绝对路径。找不到？走第 3 步。
3. 在入口 js（example.js）同级的 node_modules 文件夹（如果存在的话）查找。找到？返回绝对路径。找不到？返回 false。

当然，此处实现的算法还比较简陋，之后有时间可以再考虑实现逐层往上的查找，就像 nodejs 默认的模块查找算法那样。

### 拼接 output.js

这是最后一步了。

在解决了模块依赖和模块查找的问题之后，我们将会得到一个依赖关系对象 depTree，此对象完整地描述了以下信息：都有哪些模块，各个模块的内容是什么，他们之间的依赖关系又是如何等等。具体的结构如下：

```js
{
    "modules": {
        "/Users/towavephone/www/fake-webpack/examples/simple/example.js": {
            "id": 0,
            "filename": "/Users/towavephone/www/fake-webpack/examples/simple/example.js",
            "name": "/Users/towavephone/www/fake-webpack/examples/simple/example.js",
            "requires": [
                {
                    "name": "a",
                    "nameRange": [
                        16,
                        19
                    ],
                    "id": 1
                },
                {
                    "name": "b",
                    "nameRange": [
                        38,
                        41
                    ],
                    "id": 2
                },
                {
                    "name": "c",
                    "nameRange": [
                        60,
                        63
                    ],
                    "id": 3
                }
            ],
            "source": "let a = require('a');\nlet b = require('b');\nlet c = require('c');\na();\nb();\nc();\n"
        },
        "/Users/towavephone/www/fake-webpack/examples/simple/a.js": {
            "id": 1,
            "filename": "/Users/towavephone/www/fake-webpack/examples/simple/a.js",
            "name": "a",
            "requires": [],
            "source": "// module a\n\nmodule.exports = function () {\n    console.log('a')\n};"
        },
        "/Users/towavephone/www/fake-webpack/examples/simple/b.js": {
            "id": 2,
            "filename": "/Users/towavephone/www/fake-webpack/examples/simple/b.js",
            "name": "b",
            "requires": [],
            "source": "// module b\n\nmodule.exports = function () {\n    console.log('b')\n};"
        },
        "/Users/towavephone/www/fake-webpack/examples/simple/node_modules/c.js": {
            "id": 3,
            "filename": "/Users/towavephone/www/fake-webpack/examples/simple/node_modules/c.js",
            "name": "c",
            "requires": [],
            "source": "module.exports = function () {\n    console.log('c')\n}"
        }
    },
    "mapModuleNameToId": {
        "/Users/towavephone/www/fake-webpack/examples/simple/example.js": 0,
        "a": 1,
        "b": 2,
        "c": 3
    }
}
```

根据这个 depTree 对象，我们便能完成这最后的一步：`output.js 文件的拼接`。其控制逻辑无非是一层循环，写在 [writeChunk.js](https://github.com/towavephone/fake-webpack/blob/1bfcd0edf1/lib/writeChunk.js) 中。但是这里有一个需要注意的地方，那就是本文思路章节提到的第 4 点：要把模块名转换成模块 ID，这是 [writeSource.js](https://github.com/towavephone/fake-webpack/blob/1bfcd0edf1/lib/writeSource.js) 所要完成的功能。

至此，我们就实现了一个非常简单的 webpack 了。

## 遗留问题

1. 尚未支持 require('a' + 'b')这种情况。
2. 如何实现自动 watch 的功能？
3. 其 loader 或者插件机制又是怎样的？
