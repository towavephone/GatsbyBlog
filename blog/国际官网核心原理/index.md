---
title: 国际官网核心原理
categories:
   - 前端
path: /international-official-website-core-principle/
tags: 前端, 国际官网
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
5. 内置 antd 等流行框架（兼容 ssr）

### 缺点

1. 有些三方库并不支持 ssr 大多数时候需要改源码
2. 开发模式下采用 webpack 多次编译后会内存溢出
3. webpack 编译速度较慢

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

## 动效

## 多端适配

## 懒加载

## 视频压缩
