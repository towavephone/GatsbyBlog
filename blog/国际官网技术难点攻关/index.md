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

1. 国际化语言的动态加载
2. react-spring 时间序列化（react-spring ref delay）
3. swiper 嵌套情况下的垂直滚动（滚动到边缘会出界即边缘检测）
4. swiper 延迟滚动、解决滚轮不够顺滑问题
5. 图片动效的全局控制，react-srping 的反向动画
6. 懒加载实现、封装类似 react-spring 的 lazyloader，动态监听 src/srcSet 实现同步
7. 编译原理相关：利用 ts-morph、ts-morpher 自动导入 lazyloader 的 lazyElement 的 div、video、img 组件
8. useModal、useImgAndTextDisplayer 封装
9. lazyloader 循环引用导致的报错、检测
10. 移动端 100vh 解决（插件）
11. lazyloader 加载不同分辨率的图片（useReponsive 封装）
12. 子级滚动、父级不滚动的兼容性处理
13. scroll 动画选型过程：

      1. scrollMagic
      2. react-scrollmagic
      3. react-gsap + scrollTrigger
      4. gsap + scrollTrigger

14. 动画序列帧选型过程（参考张博客）：

      1. 预加载所有图片+图片序列帧
      2. pixi-apngAndGif，使用 apng（控制播放进度）
      3. video 播放
      4. jsmpeg + canvas（版本 2 与最新版本实现）

         ```bash
         # ts 压缩
         ffmpeg -i demo.mp4 -f mpegts -codec:v mpeg1video -b:v 1024k -bf 0 -r 20 -an demo@1024.ts

         ffmpeg -i demo.mp4 -f mpeg1video -codec:v mpeg1video -b:v 1200k -bf 0 -r 20 -an demo.mpeg

         # mpeg 压缩
         ffmpeg -i demo.mp4 -f mpeg1video -codec:v mpeg1video -b:v 2048k -bf 0 -r 30 -an demo@2048.mpeg

         ffmpeg -i demo.mp4 -f mpeg1video -codec:v mpeg1video -b:v 2048k -maxrate:v 2048k -minrate:v 2048k -r 30 -an demo@2048.mpeg

         # mp4 压缩
         ffmpeg -i p7-p3-1.mp4 -b:v 2048k -bf 0 -r 25 -an p7-p3-1@2048.mp4

         ffmpeg -i p7-p3-1.mp4 -b:v 2048k -maxrate:v 2048k -minrate:v 2048k -r 25 -an p7-p3-1@2048.mp4

         ffmpeg -i p7-p3-1.mp4 -b:v 2048k -maxrate:v 2048k -minrate:v 2048k -r 25 -an -movflags faststart p7-p3-1@2048.mp4

         # 批量压缩
         #!/bin/bash
         for i in *.mp4
         do
            echo "File $i selected"
            # ffmpeg -i "$i" "$i.mp3"
            ffmpeg -i "$i" -b:v 2048k -maxrate:v 2048k -minrate:v 2048k -r 25 -an -movflags faststart "$i.mp4"
         done
         ```

15. 视频批量压缩脚本、支持单个压缩（有声音、转 mpeg 单独压缩）
16. loadScript 优化之路（uuid、函数缓存）

# 其他大纲

1. 博客 sanbox 插件忽略文件实现，支持二进制文件的忽略

// TODO 国际官网技术难点待写作
