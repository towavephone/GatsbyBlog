---
title: 前端性能测试工具
categories:
   - 前端
path: /frontend-performance-testing-tools/
tags: 前端, 性能测试, 预研
date: 2025-10-24 11:23:45
---

# 背景

前端页面需要量化页面性能，以此来说明优化前后的效果

# 选型

## 本地

| 选型 | Star 数 | 最后代码提交时间 | 优点 | 缺点 | 截图 | 实现效果 | 备注 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Chrome DevTools Performance 面板 | 无 | 无 | 浏览器自带 | 只能简单的说明性能 |  |  |  |
| Performance API（window.performance） | 无 | 无 | 浏览器原生方法 | 需要自己写代码来生成报告 |  |  |  |
| [Lighthouse](https://github.com/GoogleChrome/lighthouse) | 29.2K | 2025-08-05 | 浏览器自带，很快可以出报告 | 1. 需要用隐私模式打开排除干扰<br>2. CLI/node 版本需要 Node 18 | <img src="./res/2025-10-24-13-44-51.png" /> |  |  |
| [PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v5/get-started) 或者叫 [Google Page Speed Insights](https://github.com/sitespeedio/plugin-gpsi) |  |  | 返回关键性页面渲染指标 | 1. 只适用于线上<br>2. 需要申请秘钥 |  |  |  |
| [Checkbot](https://chromewebstore.google.com/detail/checkbot-seo-web-speed-se/dagohlmlhagincbfilmkadjgmdnkjinl/reviews) | 无 | 无 | 安装简单，只需要安装浏览器拓展 | 只能展示 100 个 URL，超过收费 | <img src="./res/2025-10-24-13-46-50.png" /> |  | https://www.checkbot.io/ |
| [WebPageTest](https://github.com/catchpoint/WebPageTest) | 3.2K | 2025-07-14 | 测试结果完善，有录屏，有瀑布图 | 1. 可能收费<br>2. 不支持私有域名 | <img src="./res/2025-10-24-13-48-21.png" /> <img src="./res/2025-10-24-13-48-44.png" /> | https://www.webpagetest.org/result/250807_ZiDc4K_4PX/ | 1. 安装过程：https://github.com/catchpoint/WebPageTest.agent/blob/master/docs/docker.md <br> 2. 说明文档：https://docs.webpagetest.org/getting-started/ |
| [sitespeed.io](https://github.com/sitespeedio/sitespeed.io) | 4.9K | 2025-08-05 | 1. 支持 Firefox、Chrome、Android 版 Chrome，并对 OS X 和 iOS 版 Safari 提供有限支持<br>2. 支持本地在线测试（Docker 本地私有化部署）<br>3. 支持各种[插件](https://www.sitespeed.io/documentation/sitespeed.io/plugins/)，包含 Lighthouse/WebPageTest/PageSpeed Insights API<br>4. 支持[持续集成](https://www.sitespeed.io/documentation/sitespeed.io/continuously-run-your-tests/)<br>5. 支持模拟慢速网络连接<br>6. 支持[页面性能/har 比较](https://compare.sitespeed.io/)<br>7. 支持[线上性能监控](https://dashboard.sitespeed.io/d/9NDMzFfMk/page-metrics-desktop)<br>8. [指标全面](https://www.sitespeed.io/documentation/sitespeed.io/metrics/)<br>9. 支持[脚本](https://www.sitespeed.io/documentation/sitespeed.io/scripting/)<br>10. 支持[视频比较](https://www.sitespeed.io/documentation/sitespeed.io/video/) | 想完全用起来还需要编写登录脚本或者让网站支持自动登录 | <img src="./res/2025-10-24-13-52-23.png" /> |  | [最佳实践](https://www.sitespeed.io/documentation/sitespeed.io/web-performance-testing-in-practice/) |

## 线上监控

| 选型 | Star 数 | 最后代码提交时间 | 优点 |
| --- | --- | --- | --- |
| sentry |  |  |  |
| [web-vitals](https://github.com/GoogleChrome/web-vitals) | 8.1K | 2025-08-01 | 健康网站基本指标 |
| [Lighthouse](https://github.com/GoogleChrome/lighthouse) |  |  |  |
| [Perfume.js](https://github.com/Zizzamia/perfume.js) | 3.2K | 2024-06-04 | 用于测量所有性能重要指标的 Web 性能库，web-vitals 的超集 |
| [boomerang](https://github.com/akamai/boomerang) |  |  | 面向最终用户的 Web 性能测试和指标 |
| [PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v5/get-started) |  |  |  |
| [sitespeed.io](https://github.com/sitespeedio/sitespeed.io) | 4.9K | 2025-08-05 |  |
| OpenTelemetry |  |  |  |
| Elastic APM |  |  |  |
| Jaeger |  |  |  |
| Pinpoint |  |  |  |
| Prometheus + Grafana |  |  |  |

最终选定 sitespeed.io 作为性能测试工具，暂不考虑线上性能监控

# 实现

这里只量化首次进入页面的性能

## 目录结构

```
└── test
    └── perf
        ├── .env.example
        ├── .gitignore
        ├── config.json
        ├── index.mjs
        ├── loadEnv.js
        └── start.sh
```

## 核心代码

.env.example

配置样例代码，复制一份为 env，在改为自己的账号信息

```
ACCOUNT=xxx
TOKEN=xxx
```

.gitignore

```
output
.env
```

config.json

```json
{
   "browsertime": {
      "iterations": 1,
      "urls": [
         {
            "url": "网页链接1",
            "label": "网页名称1"
         },
         {
            "url": "网页链接2",
            "label": "网页名称2"
         }
      ]
   },
   "multi": true,
   "cpu": true
}
```

index.mjs

主要实现自动登录功能

```js
import loadEnv from './loadEnv.js';

await loadEnv();

const { ACCOUNT, TOKEN } = process.env;

export default async function(context, commands) {
   const urls = context.options.urls;
   if (!urls || urls.length === 0) {
      throw new Error('No URLs provided to test');
   }

   for (let item of urls) {
      const [base, hash] = item.url.split('#'); // 分离基础URL和哈希部分
      const [hashPath, hashQuery] = hash.split('?'); // 分离哈希路径和参数
      const params = new URLSearchParams(hashQuery);
      // 用于登录的参数通过 url 传递，业务端需要实现对应功能
      params.append('username', ACCOUNT); // 添加新参数
      params.append('token', TOKEN); // 添加新参数
      const newUrl = `${base}#${hashPath}?${params.toString()}`;

      await commands.measure.start(newUrl, item.label);
      // When the test is finished, clear the browser cache
      await commands.cache.clear();
      // Navigate to a blank page so you kind of start from scratch for the next URL
      await commands.navigate('about:blank');
   }
}
```

loadEnv.js

实现读取 env 配置的功能

```js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// 解决ES模块中__dirname缺失问题
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 解析.env文件并设置环境变量
 * @param {string} [envPath='.env'] - 自定义.env文件路径
 */
async function loadEnv(envPath = '.env') {
   try {
      // 构建.env文件绝对路径
      const resolvedPath = path.resolve(__dirname, envPath);

      // 读取文件内容
      const content = await fs.readFile(resolvedPath, 'utf8');

      // 解析每一行并设置环境变量
      content.split('\n').forEach((line) => {
         // 忽略注释和空行
         const trimmedLine = line.trim();
         if (!trimmedLine || trimmedLine.startsWith('#')) return;

         // 提取键值对（支持等号前后有空格的情况）
         const [key, value] = trimmedLine.split('=').map((item) => item.trim());
         if (key && value) {
            process.env[key] = value; // 设置环境变量
         }
      });

      // console.log(`✅ .env loaded from ${resolvedPath}`);
   } catch (error) {
      // console.warn(`⚠️ No .env file found at ${envPath}, using system environment variables`);
   }
}

// 导出默认函数
export default loadEnv;
```

start.sh

各终端性能测试运行策略，这里除了测试性能，还测试了各个终端浏览器缩放比例的显示效果，以下为需要测试的终端

| 屏幕类型 | 物理分辨率 | 推荐缩放比例 | 适用场景与说明 |
| --- | --- | --- | --- |
| 24 英寸及以下显示器 | 1920×1080 | 100% | 日常办公与网页浏览，PPI 约 93-102，文字清晰不累眼 |
| 15.6 英寸笔记本普通屏 | 1366\*768 | Windows 默认缩放 125%，macOS（如 MacBook 外接）推荐 125%-150% | 文字清晰且兼顾性能，适合文档处理、网页浏览和视频播放 |
| 13 英寸 MacBook Pro | 2560×1600（等效逻辑分辨率 1440×900） | 200%（Retina） |  |

```bash
current_time=$(date +"%Y-%m-%d-%H-%M-%S")

# 台式机桌面端 1920x1080 运行 5 次
docker run -e MAX_OLD_SPACE_SIZE=4096 -e TZ=Asia/Shanghai --rm -v $(pwd):/sitespeed.io sitespeedio/sitespeed.io:38.1.1 --config config.json index.mjs --browsertime.viewPort 1920x1080 --outputFolder ./output/$current_time/desktop -n 5

# 苹果笔记本端 1440*900 运行 1 次
docker run -e MAX_OLD_SPACE_SIZE=4096 -e TZ=Asia/Shanghai --rm -v "$(pwd):/sitespeed.io" sitespeedio/sitespeed.io:38.1.1 --config config.json index.mjs --browsertime.viewPort 1440*900 --outputFolder ./output/$current_time/mac

# windows/ubuntu 笔记本端 1366x768 运行 1 次
docker run -e MAX_OLD_SPACE_SIZE=4096 -e TZ=Asia/Shanghai --rm -v "$(pwd):/sitespeed.io" sitespeedio/sitespeed.io:38.1.1 --config config.json index.mjs --browsertime.viewPort 1366x768 --outputFolder ./output/$current_time/laptop
```

## 运行步骤

```bash
cp ./.env.example ./.env && vim ./.env # 在线上环境找到对应的 token，设置自己的环境变量 ACCOUNT/TOKEN，否则不能正常测试

cd ./test/perf && chmod +x ./start.sh && ./start.sh
```

# 对比维度

选择以下维度进行对比

1. 页面传输资源大小（KB）
2. 本页面相关 xhr 请求数量
3. 85% 页面可见耗时 5 次耗时中位数（s）

# 其他

在性能测试的过程中，发现 nginx 没有开启 gzip，需要配置一下 nginx

```nginx
gzip on;
gzip_comp_level 6;         # 压缩等级，1-9，推荐 5~6，数值越大压缩率越高但 CPU 占用更高
gzip_min_length 1k;        # 只压缩大于 1k 的响应体
gzip_buffers 16 8k;        # 压缩缓冲区设置
gzip_http_version 1.1;     # 默认即可，http/1.1及以上
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml; # 需要压缩的内容类型
gzip_vary on;              # 响应头增加 Vary: Accept-Encoding，便于代理缓存
gzip_proxied any;          # 允许代理服务器压缩
gzip_disable "msie6";      # 禁用 IE6 gzip

# 可选: 避免对图片、压缩包等二进制文件压缩
# gzip_types 省略常见的二进制类型，如 image/*, application/zip, application/gzip
```
