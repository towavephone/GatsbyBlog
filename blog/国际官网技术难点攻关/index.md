---
title: 国际官网技术难点攻关
categories:
   - 前端
path: /international-official-website-technical-difficulties/
tags: 前端, 动效, 源码优化, 预研
date: 2021-11-15 11:49:34
draft: true
---

# 大纲

- 国际化语言的动态加载
- react-spring 时间序列化（react-spring ref delay）
- swiper 嵌套情况下的垂直滚动（滚动到边缘会出界即边缘检测）
- swiper 延迟滚动、解决滚轮不够顺滑问题
- 图片动效的全局控制，react-srping 的反向动画
- 懒加载实现、封装类似 react-spring 的 lazyloader，动态监听 src/srcSet 实现同步
- 编译原理相关：利用 ts-morph、ts-morpher 自动导入 lazyloader 的 lazyElement 的 div、video、img 组件
- useModal、useImgAndTextDisplayer 封装
