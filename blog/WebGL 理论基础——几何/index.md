---
title: WebGL 理论基础——几何
date: 2022-06-21 18:20:05
categories:
  - 前端
tags: 前端, 可视化, WebGL, 读书笔记
path: /webgl-fundamental-geometry/
---

# WebGL 三维几何加工

有人问我怎么在 WebGL 中制作一个保龄球瓶，聪明的回答是`使用一个三维建模工具例如 Blender, Maya, 3D Studio Max, Cinema 4D, 等等`。使用它创建一个保龄球瓶，导出，读取点坐标(OBJ 格式相对简单些)。

但是，这让我想到，如果他们想做一个模型库该怎么办？

这有几种方法，一种方法是将圆柱体按照正弦函数放置在合适位置上，但这样表面并不平滑。一个标准的圆柱需要一些间距相等的圆环，但当曲线变得锐利的时候所需圆环的数量就会很多。

在模型库中你需要制作一个二维轮廓或者是一个符合边缘的曲线，然后将他们加工成三维图形。这里加工的意思就是将生成的二维点按照某些轴旋转。这样就可以很轻松的做出一些圆的物体，例如碗，棒球棒，瓶子，灯泡之类的物体。

那么该怎么做呢？首先我们要通过某种方式生成一个曲线，计算曲线上的点。然后使用矩阵运算将这些点按照某个轴旋转，构建出三角形网格。

计算机中常用的曲线就是贝塞尔曲线，你可能在一些编辑器例如 Adobe Illustrator 或 Inkscape 或 Affinity Designer 中编辑过贝塞尔曲线。

贝塞尔曲线或三次贝塞尔曲线由 4 个点组成，2 个端点，2 个“控制点”。

这就是四个点

<iframe src="https://codesandbox.io/embed/sz315s?codemirror=1&hidenavigation=1&theme=light&view=preview&initialpath=?maxDepth=0" class="embedded-codesandbox" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

<!-- [bezier-curve-diagram](embedded-codesandbox://webgl-fundamental-geometry/bezier-curve-diagram?view=preview&initialpath=?maxDepth=0) -->

从 0 到 1 之间选一个数（叫做 t），其中 0 是起点，1 是终点。然后在每个线段中计算出与 t 相关的点，`P1 P2`, `P2 P3`, `P3 P4`。

<iframe src="https://codesandbox.io/embed/sz315s?codemirror=1&hidenavigation=1&theme=light&view=preview&initialpath=?maxDepth=1" class="embedded-codesandbox" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

<!-- [bezier-curve-diagram](embedded-codesandbox://webgl-fundamental-geometry/bezier-curve-diagram?view=preview&initialpath=?maxDepth=1) -->

换句话说如果 `t = .25` 那么就计算出 P1 到 P2 距离为 25% 的点，从 P2 到 P3 距离为 25% 的点，从 P3 到 P4 距离为 25% 的点。

你可以拖动滑块调整 t 的值，也可以拖动 `P1, P2, P3` 和 P4 调整位置。

对这些结果点做同样的操作，计算 t 对应的 `Q1 Q2` 和 `Q2 Q3` 之间的点。

<iframe src="https://codesandbox.io/embed/sz315s?codemirror=1&hidenavigation=1&theme=light&view=preview&initialpath=?maxDepth=2" class="embedded-codesandbox" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

<!-- [bezier-curve-diagram](embedded-codesandbox://webgl-fundamental-geometry/bezier-curve-diagram?view=preview&initialpath=?maxDepth=2) -->

最后在 `R1 R2` 中计算出与 t 相关的点。

<iframe src="https://codesandbox.io/embed/sz315s?codemirror=1&hidenavigation=1&theme=light&view=preview&initialpath=?maxDepth=3" class="embedded-codesandbox" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

<!-- [bezier-curve-diagram](embedded-codesandbox://webgl-fundamental-geometry/bezier-curve-diagram?view=preview&initialpath=?maxDepth=3) -->

红点的位置就构成了一个曲线。

<iframe src="https://codesandbox.io/embed/sz315s?codemirror=1&hidenavigation=1&theme=light&view=preview&initialpath=?maxDepth=4" class="embedded-codesandbox" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

<!-- [bezier-curve-diagram](embedded-codesandbox://webgl-fundamental-geometry/bezier-curve-diagram?view=preview&initialpath=?maxDepth=4) -->

这就是三次贝塞尔曲线。

注意到在上述差值过程中通过 4 个点差出 3 个点，3 个点差出 2 个点，最后从 2 个点差出 1 个点，这并不是常用的做法，有人将这些数学运算简化成了一个公式，像这样

```
invT = (1 - t)
P = P1 * invT^3 +
    P2 * 3 * t * invT^2 +
    P3 * 3 * invT * t^2 +
    P4 * t^3
```

// TODO https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-3d-geometry-lathe.html
