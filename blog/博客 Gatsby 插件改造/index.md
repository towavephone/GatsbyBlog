---
title: 博客 Gatsby 插件改造
categories:
   - 前端
path: /gatsby-plugin-transformation/
tags: 前端, 源码优化, 预研
date: 2023-11-28 16:17:27
---

# 需求背景

针对本博客现有的 Gatsby 框架实现代码复制、代码实时查看编辑的功能

# 技术选型

以下都是采用最后一种方案，由于插件功能不满足，所以对其源码做出改动

## 代码复制

| 技术选型 | 语法 | 优点 | 缺点 |
| :-- | :-- | :-- | :-- |
| 项目代码自实现 | 未实现 | 定制化程度高 | <ol><li>实现难度大；</li><li>拓展较差</li></ol> |
| [gatsby-remark-code-buttons](https://github.com/iamskok/gatsby-remark-code-buttons) | 不需特定语法，只要是代码块默认具有复制功能 | 已具有代码复制功能 | <ol><li>有多复制一行的 bug；</li><li>UI 不符合博客主题</li></ol> |

## 代码实时查看编辑

| 技术选型 | 语法 | 优点 | 缺点 | 样例页面 |
| :-- | :-- | :-- | :-- | --- |
| iframe + [gatsby-remark-embed-snippet](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-remark-embed-snippet) | `<iframe src="/examples/snow.html" width="800" height="400"></iframe>` <br /> `` `embed:snow.html` `` | 实现最为简单，容易出效果 | <ol><li>没有实时编辑功能；<li>嵌入的代码往往需要将其写成一个 html 文件且一般情况下只支持静态页面的展示；</li><li>需要 iframe、embed 标签声明两次</li></ol> | [下雪特效](/snow-css/) |
| iframe + code-editor.html 传参 | `<iframe src="/examples/code-editor.html?html=转义字符串&css=转义字符串&js=转义字符串` | 基本实现代码的实时查看编辑 | <ol><li>嵌入的代码只支持静态的 html 页面；</li><li>需要明确拆分出 js、css、html 三个结构；</li><li>嵌入的 js、css、html 分别需要手动 escape 加密</li></ol> | [CSS 世界四大盒尺寸](/css-world-four-kinds-of-box/#border-等高布局技术) |
| [gatsby-remark-embedded-codesandbox](https://github.com/elboman/gatsby-remark-embedded-codesandbox) | `[pms-example](embedded-codesandbox://gantt-component-optimization/pms-example)` | 借助 codesandbox 实现了较为丰富的代码实时查看编辑功能 | <ol><li>借助第三方实现的功能，不够稳定；</li><li>不支持带目录的文件夹；</li><li>单次请求过大（即上传代码过多）会报请求体过大错误；</li><li>会上传 node_modules 等等大文件</li></ol> | 需实现 |

# 核心逻辑

## 代码复制

### 修复复制多一行 bug

代码在[这里](https://github.com/towavephone/gatsby-remark-code-buttons/commit/d95bb194d74182a3c5b8118102b3826695c2ff6d)

src/gatsby-browser.js

```diff
@@ -7,19 +7,9 @@ exports.onClientEntry = () => {
    el.innerHTML = str;
    document.body.appendChild(el);

-   const range = document.createRange();
-   range.selectNode(el);
-   window.getSelection().removeAllRanges();
-   window.getSelection().addRange(range);
-   document.execCommand(`copy`);
-   document.activeElement.blur();
-   setTimeout(() => {
-     document.getSelection().removeAllRanges();
-     document.body.removeChild(el);
-   }, 100);
+   el.select();
+   document.execCommand("copy");
+   document.body.removeChild(el);
    if (toasterId) {
      window.showClipboardToaster(toasterId);
    }
```

### 增加显示语言类型的功能；改变按钮文本显示逻辑；任何语言都可以显示复制按钮

主要针对原插件做出的一些 UI、功能上的适配，代码在[这里](https://github.com/towavephone/gatsby-remark-code-buttons/commit/90094cd1c6a4a6fa7253f61e898f8a832173d6a9)

src/index.js

```diff
@@ -21,10 +21,6 @@ module.exports = function gatsbyRemarkCodeButtons(
    const actions = qs.parse(params);
    const { clipboard } = actions;

-   if (!language) {
-     return;
-   }
-
    if (clipboard === 'false') {
      delete actions['clipboard'];
    } else {
@@ -57,12 +53,12 @@ module.exports = function gatsbyRemarkCodeButtons(
            >
              <div
                class="${buttonClass}"
-               data-tooltip="${tooltipText}"
+               ${tooltipText ? `data-tooltip="${tooltipText}"` : ''}
              >
-               ${buttonText}${svgIcon}
+               ${[language, buttonText || svgIcon].filter((item) => item).join(' ')}
              </div>
            </div>
-           `.trim()
+         `.trim()
      };

      parent.children.splice(index, 0, buttonNode);
```

### 实现效果

```js
// 测试代码复制功能，这个代码块应该具有复制代码功能
```

## 代码实时查看编辑

代码在[这里](https://github.com/towavephone/gatsby-remark-embedded-codesandbox/commit/6a1947c22566c6ad5baae33dabf99edd16f4c8eb)

### 递归遍历文件夹；增加忽略文件功能

原插件不支持目录的读取，这里拓展了目录下也能递归读取的功能，同时也实现了默认忽略文件的功能

```js
const DEFAULT_IGNORED_FILES = ['node_modules', 'package-lock.json', 'yarn.lock'];

const ignoredFilesSet = new Set(ignoredFiles);

const getAllFiles = (dirPath) =>
   fs.readdirSync(dirPath).reduce((acc, file) => {
      // 过滤文件立即跳出下一个
      if (ignoredFilesSet.has(file)) return acc;
      const relativePath = path.join(dirPath, file);
      const isDirectory = fs.statSync(relativePath).isDirectory();
      // 判断是目录继续递归遍历
      const additions = isDirectory ? getAllFiles(relativePath) : [relativePath.replace(`${directory}/`, '')];
      return [...acc, ...additions];
   }, []);
```

### 默认模式为静态服务器

因为 codesandbox 需要明确模板类型，这里默认为静态模板，否则静态文件不能正常运行

```js
const getFileExist = (fileList, filename = 'package.json') => {
   const found = fileList.filter((name) => name === filename);
   return found.length > null;
};

if (!getFileExist(folderFiles, 'sandbox.config.json')) {
   sandboxFiles.push({
      name: 'sandbox.config.json',
      content: '{ "template": "static" }'
   });
}
```

### codesandbox 请求方式改为 post 异步化

原插件是基于 get 请求的，一旦上传文件过多就会报错，这里改为 post 请求就不再有请求体大小的限制，同时也要注意 post 的异步

```js
const convertNodeToEmbedded = async (node, params, options = {}) => {
   delete node.children;
   delete node.position;
   delete node.title;
   delete node.url;

   // merge the overriding options with the plugin one
   const mergedOptions = { ...embedOptions, ...options };
   const encodedEmbedOptions = queryString.stringify(mergedOptions);

   const { sandbox_id } = await fetch('https://codesandbox.io/api/v1/sandboxes/define?json=1', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         Accept: 'application/json'
      },
      body: params
   }).then((x) => x.json());

   const sandboxUrl = `https://codesandbox.io/embed/${sandbox_id}?${encodedEmbedOptions}`;
   const embedded = getIframe(sandboxUrl);
   node.type = 'html';
   node.value = embedded;

   return node;
};

const nodes = [];
map(markdownAST, (node, index, parent) => {
   if (node.type === 'link' && node.url.startsWith(protocol)) {
      // split the url in base and query to allow user
      // to customise embedding options on a per-node basis
      const url = getUrlParts(node.url);
      // get all files in the folder and generate
      // the embeddeing parameters
      const dir = getDirectoryPath(url.base);
      const files = getFilesList(dir);
      const params = createParams(files);
      convertNodeToEmbedded(node, params, url.query);
      const currentNode = convertNodeToEmbedded(node, params, url.query);
      nodes.push(currentNode);
   }

   return node;
});

// 注意这里的异步化，必须等所有的请求成功响应才可继续遍历
await Promise.all(nodes);
```

### 实现效果

[甘特图组件源码优化](/gantt-component-optimization/#实现效果)

### 后续优化

[代码地址](https://github.com/elboman/gatsby-remark-embedded-codesandbox/compare/master...towavephone:gatsby-remark-embedded-codesandbox:master)

1. 增加上传文件忽略功能，支持 post 上传文件
2. 修复 json 解析报错
3. 限制请求并发防止 codesandbox 报错

# 总结

1. 复制功能需考虑兼容性、复制性能，可参考[JS 复制文字到剪切板的极简实现及扩展](https://www.zhangxinxu.com/wordpress/2021/10/js-copy-paste-clipboard/)
2. 代码实时查看编辑借助于第三方服务不够稳定，可自行搭建第三方服务或者参照 [live-editor](https://github.com/gfxfundamentals/live-editor) 自建本地编辑器，必要时具有分享功能

# 其他优化

1. 把 gatsby-remark-graph 配置化，以支持最新的 mermaid 特性，[代码地址](https://github.com/konsumer/gatsby-remark-graph/compare/master...towavephone:gatsby-remark-graph-towavephone:master)
2. gatsby-remark-design-system 支持文字转语音（利用百度翻译），[代码地址](https://github.com/LekoArts/gatsby-remark-design-system/compare/master...towavephone:gatsby-remark-design-system-towavephone:master)
3. img、video、iframe 增加懒加载功能，[代码地址](https://github.com/1kohei1/gatsby-remark-lazy-load/compare/master...towavephone:gatsby-remark-lazy-load:master)
