---
title: 前后端调试工具应用
categories:
   - 后端
path: /frontend-backend-debug-tool/
tags: 前端, 后端, python, 预研
date: 2024-05-15 18:52:15
---

# 前端远程调试

## 背景

由于有些时候不方便到用户实地/远程桌面复现 bug，需要远程查看对方网页的控制台，经过预研发现远程调试工具 [page-spy-web](https://github.com/HuolalaTech/page-spy-web/tree/main) 比较合适

## 实现

1. 在开发机（由于开发只能完全控制开发机，同时要保证此开发机能被下面的前端服务器访问）上部署一个 [docker 镜像](https://github.com/HuolalaTech/page-spy-web/blob/main/README_ZH.md)

   ```bash
   docker run -d --restart=always -p 6752:6752 --name="pageSpy" ghcr.io/huolalatech/page-spy-web:latest
   ```

2. 通过特定域名（可以自定义域名后缀，配合下面的前端服务器），配置 nginx 转发到此开发机

   ```bash
   server {
      listen 80;
      server_name *.你的对外域名后缀（和前端域名保持一致后缀）;
      access_log  /var/log/nginx/access.log main;
      proxy_read_timeout 240s;

      location / {
         proxy_http_version 1.1;
         proxy_set_header Upgrade $http_upgrade;
         proxy_set_header Connection "Upgrade";
         proxy_set_header Host $host;
         proxy_pass http://localhost:6752;
      }
   }
   ```

3. 由于前端服务器需要能访问到开发机，所以需要在前端服务器对应的 nginx 做转发，这里配置到前端域名的子路径，参考[步骤](https://github.com/HuolalaTech/page-spy-web/wiki/%F0%9F%90%9E-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98%E8%A7%A3%E7%AD%94#%E5%A6%82%E4%BD%95%E9%83%A8%E7%BD%B2%E5%88%B0%E5%AD%90%E8%B7%AF%E5%BE%84)

   ```bash
   server {
      location /pagespy/  {
         # 这里请求转发到开发机，同时由于开发机的 nginx 配置的和前端域名一致，所以能成功转发到开发机对应的 pagespy 服务
         rewrite ^/pagespy/(.*)$ /$1 break;
         proxy_pass  http://开发机对外ip;
         proxy_http_version 1.1;
         proxy_set_header  Upgrade $http_upgrade;
         proxy_set_header  Connection "upgrade";
         proxy_set_header  Host $host;
         proxy_set_header  X-Real-IP $remote_addr;
         proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
      }

      location /pagespy {
         return 301 $scheme://$host$request_uri/;
      }
   }
   ```

4. 修改前端代码主入口适配远程调试

   src/utils/index.js

   ```js
   // 异步加载单个脚本
   async function loadSingleScript(src, options) {
      return await new Promise((resolve, reject) => {
         // 这里未考虑到同一 src 同时发起的情况，改用缓存实现
         // if (!id) {
         //   const NAMESPACE = 'c2b16a16-12b3-423a-879f-6b46d1a01d60'
         //   const PREFIX = 'script-id-'
         //   id = PREFIX + uuidv5(src, NAMESPACE)
         // }
         // if (!src || document.querySelector(`#${id}`)) {
         //   return
         // }
         const script = document.createElement('script');
         const { attributesMap = {}, ...rest } = options;
         Object.keys(rest).forEach((key) => {
            script[key] = rest[key];
         });
         Object.keys(attributesMap).forEach((key) => {
            script.setAttribute(key, attributesMap[key]);
         });
         script.async = true;
         script.src = src;
         script.onload = resolve;
         script.onerror = reject;
         document.getElementsByTagName('head')[0].appendChild(script);
      });
   }

   // 异步加载多个脚本
   // memoize 默认情况下用第一个参数作为缓存的 key，即 src
   export const loadScript = memoize(loadSingleScript);
   ```

   src/index.js

   ```js
   import { loadScript } from './utils';

   async function loadScriptFunc() {
      // 这里使用别名访问 pagespy 服务
      await loadScript('/pagespy/page-spy/index.min.js', { attributesMap: { crossorigin: 'anonymous' } });
      if (!window.PageSpy) {
         return;
      }
      window.$pageSpy = new window.PageSpy({
         api: window.location.host + '/pagespy',
         clientOrigin: window.location.origin + '/pagespy',
         project: window.location.host,
         title: window.localStorage.getItem('simUsername') || 'anonymous'
      });
   }

   const is_debug = new URLSearchParams(window.location.hash.split('?')[1]).get('is_debug');

   if (process.env.NODE_ENV === 'production' && is_debug) {
      loadScriptFunc();
   }
   ```

## 实现效果

1. 让需要调试的远程页面加上 `?is_debug=1` 参数，可以看到左下角进入待调试状态，点击左下角按钮然后点击 copy 复制出来待调试的远程链接，如果不方便让用户复制，转步骤 2

![](res/2024-05-16-11-03-42.png)

![](res/2024-05-16-11-03-29.png)

![](res/2024-05-16-11-08-15.png)

2. 进入调试界面，网址为前端域名加上 /pagespy/，找到对应的项目/用户名/设备号（设备号可让用户截图发过来避免调试错误页面的情况）进入房间列表去调试

![](res/2024-05-16-11-01-42.png)

![](res/2024-05-16-11-07-05.png)

# 后端调试

## django

### Django-debug-toolbar

### Django-silk

## flask

### flask-debugtoolbar

### flask_profiler
