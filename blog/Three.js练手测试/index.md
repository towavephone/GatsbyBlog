---
title: Three.js练手测试
date: 2022-12-19 17:29:39
categories:
   - 前端
tags: 前端, three.js, WebGL, 练手测试
path: /three-js-practice-test/
---

# 测试一

画 3 个带有反光的立方体

[test-1](embedded-codesandbox://three-js-practice-test/test-1?module=index.js)

# 测试二

对 3 个带有反光的立方体做响应式处理，要求满足下面条件

1. 窗口任意大小立方体不会被拉伸
2. 不能出现明显的锯齿（块状化）
3. 支持高分屏

[test-2](embedded-codesandbox://three-js-practice-test/test-2?module=index.js)

# 测试三

绘制常见的图元

[test-3](embedded-codesandbox://three-js-practice-test/test-3?module=index.js)

# 测试四

太阳，地球，月球模拟

[test-4](embedded-codesandbox://three-js-practice-test/test-4?module=index.js)

# 测试五

实现坦克多视角切换

[test-5](embedded-codesandbox://three-js-practice-test/test-5?module=index.js)

# 测试六

实现常见的不同材质

[test-6](embedded-codesandbox://three-js-practice-test/test-6?module=index.js)

# 测试七

多个纹理加载

[test-7](embedded-codesandbox://three-js-practice-test/test-7?module=index.js)

# 测试八

实现过滤和 mipmaps

[test-8](embedded-codesandbox://three-js-practice-test/test-8?module=index.js)

# 测试九

重复，偏移，旋转，包裹一个纹理

[test-9](embedded-codesandbox://three-js-practice-test/test-9?module=index.js)

# 测试十

创建环境光

[test-10](embedded-codesandbox://three-js-practice-test/test-10?module=index.js)

# 测试十一

创建半球光

[test-11](embedded-codesandbox://three-js-practice-test/test-11?module=index.js)

# 测试十二

创建方向光

[test-12](embedded-codesandbox://three-js-practice-test/test-12?module=index.js)

# 测试十三

创建点光源

[test-13](embedded-codesandbox://three-js-practice-test/test-13?module=index.js)

# 测试十四

创建聚光灯

[test-14](embedded-codesandbox://three-js-practice-test/test-14?module=index.js)

# 测试十五

创建矩形区域光

[test-15](embedded-codesandbox://three-js-practice-test/test-15?module=index.js)

# 测试十六

模拟实际的光照衰减

[test-16](embedded-codesandbox://three-js-practice-test/test-16?module=index.js)

# 测试十七

实现透视摄像

[test-17](embedded-codesandbox://three-js-practice-test/test-17?module=index.js)

# 测试十八

z 冲突实例

[test-18](embedded-codesandbox://three-js-practice-test/test-18?module=index.js)

# 测试十九

实现正交摄像

[test-19](embedded-codesandbox://three-js-practice-test/test-19?module=index.js)

# 测试二十

正交摄像模拟实现 2d canvas

[test-20](embedded-codesandbox://three-js-practice-test/test-20?module=index.js)

# 测试二十一

假阴影贴图实现

[test-21](embedded-codesandbox://three-js-practice-test/test-21?module=index.js)

# 测试二十二

定向光阴影

[test-22](embedded-codesandbox://three-js-practice-test/test-22?module=index.js)

# 测试二十三

聚光灯阴影

[test-23](embedded-codesandbox://three-js-practice-test/test-23?module=index.js)

# 测试二十四

点光源阴影

[test-24](embedded-codesandbox://three-js-practice-test/test-24?module=index.js)

# 测试二十五

1. 实现 2 种雾
2. 是否受雾的影响参数

[test-25](embedded-codesandbox://three-js-practice-test/test-25?module=index.js)

# 测试二十六

雾的各项参数

[test-26](embedded-codesandbox://three-js-practice-test/test-26?module=index.js)

# 测试二十七

实现简单的渲染目标

[test-27](embedded-codesandbox://three-js-practice-test/test-27?module=index.js)

# 测试二十八

创建一个使用 BufferGeometry 的方块

[test-28](embedded-codesandbox://three-js-practice-test/test-28?module=index.js)

# 测试二十九

使用 BufferGeometry 方块的重复顶点数据索引化

[test-29](embedded-codesandbox://three-js-practice-test/test-29?module=index.js)

# 测试三十

使用类型数组 TypedArrays 动态更新顶点数据的任何一部分

[test-30](embedded-codesandbox://three-js-practice-test/test-30?module=index.js)

# 测试三十一

按需渲染（不使用 requestAnimationFrame）

[test-31](embedded-codesandbox://three-js-practice-test/test-31?module=index.js)

# 测试三十二

canvas 截图：

1. 截图前调用一次渲染代码
2. 防止 canvas 被清空（即使使用 `preserveDrawingBuffer: true` 切换横竖屏、切换分辨率还是会清空）

这里使用方案一，方案二不推荐

[test-32](embedded-codesandbox://three-js-practice-test/test-32?module=index.js)

# 测试三十三

canvas 获取键盘输入

[test-33](embedded-codesandbox://three-js-practice-test/test-33?module=index.js)

# 测试三十四

透明化 canvas

[test-34](embedded-codesandbox://three-js-practice-test/test-34?module=index.js)

# 测试三十五

大量对象的优化方案：合并几何体

优化前：

[test-35](embedded-codesandbox://three-js-practice-test/test-35?module=index.js)

优化后：

[test-35-2](embedded-codesandbox://three-js-practice-test/test-35-2?module=index.js)

# 测试三十六

优化对象的同时保持动画效果

[test-36](embedded-codesandbox://three-js-practice-test/test-36?module=index.js)
