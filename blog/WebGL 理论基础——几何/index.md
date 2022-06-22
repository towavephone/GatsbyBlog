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

其中 P1, P2, P3, P4 就像上例中的四个点，P 就是那个红点。

在二维美术应用例如 Adobe Illustrator 中，当你制作一个较长的曲线时通常是由一些小的四点片段组成的。默认情况下应用将控制点沿着起/终点方向锁死，确保在公共点部分方向相反。

看这个例子，移动 P3 或 P5 会同时移动另一个。

[bezier-curve-edit](embedded-codesandbox://webgl-fundamental-geometry/bezier-curve-edit?view=preview)

注意这个曲线是两段，`P1,P2,P3,P4` 和 `P4,P5,P6,P7`。只有在 P3，P5 与 P4 的连线方向相反时曲线在这一点才会连续。大多数应用可以让你断开连接，并获得一个锐利的拐点。取消选中复选框然后拖拽 P3 或 P5 就会清晰看到独立的曲线。

接下来我们需要获得生成曲线上的点，通过给上方的公式提供 t 就可以生成一个点。

```js
function getPointOnBezierCurve(points, offset, t) {
  const invT = 1 - t;
  return v2.add(
    v2.mult(points[offset + 0], invT * invT * invT),
    v2.mult(points[offset + 1], 3 * t * invT * invT),
    v2.mult(points[offset + 2], 3 * invT * t * t),
    v2.mult(points[offset + 3], t * t * t)
  );
}
```

然后可以计算一系列点。

```js
function getPointsOnBezierCurve(points, offset, numPoints) {
  const points = [];
  for (let i = 0; i < numPoints; ++i) {
    const t = i / (numPoints - 1);
    points.push(getPointOnBezierCurve(points, offset, t));
  }
  return points;
}
```

注意：`v2.mult` 和 `v2.add` 是我加入的二维点运算辅助方法。

<iframe src="https://codesandbox.io/embed/sz315s?codemirror=1&hidenavigation=1&theme=light&view=preview&initialpath=?maxDepth=0%26showCurve=true%26showPoints=true" class="embedded-codesandbox" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

<!-- [bezier-curve-diagram](embedded-codesandbox://webgl-fundamental-geometry/bezier-curve-diagram?view=preview&initialpath=?maxDepth=0%26showCurve=true%26showPoints=true) -->

在图示中你可以选择点的个数，如果曲线比较锐利就可以多差值一些点，如果曲线比较平缓就可以少插值一些点。一个解决办法是检查曲线的锐利程度，如果过于锐利就拆分成两个曲线。

拆分的部分比较简单，如果我们再看看不同级别的拆分，对于任意值的 `t, P1, Q1, R1`, 红点构成一个曲线，终点是红点。`红点, R2, Q3, P4` 构成一个曲线。换句话说我们可以将曲线从任意位置分成两段，并且和原曲线相同。

<iframe src="https://codesandbox.io/embed/sz315s?codemirror=1&hidenavigation=1&theme=light&view=preview&initialpath=?maxDepth=4%26show2Curves=true" class="embedded-codesandbox" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

<!-- [bezier-curve-diagram](embedded-codesandbox://webgl-fundamental-geometry/bezier-curve-diagram?view=preview&initialpath=?maxDepth=4%26show2Curves=true) -->

第二个部分是如何决定曲线是否需要拆分，从网上查找后我发现了[这个方法](https://seant23.wordpress.com/2010/11/12/offset-bezier-curves/)，对于给定的曲线可以求出平滑程度。

```js
function flatness(points, offset) {
  const p1 = points[offset + 0];
  const p2 = points[offset + 1];
  const p3 = points[offset + 2];
  const p4 = points[offset + 3];

  let ux = 3 * p2[0] - 2 * p1[0] - p4[0];
  ux *= ux;
  let uy = 3 * p2[1] - 2 * p1[1] - p4[1];
  uy *= uy;
  let vx = 3 * p3[0] - 2 * p4[0] - p1[0];
  vx *= vx;
  let vy = 3 * p3[1] - 2 * p4[1] - p1[1];
  vy *= vy;

  if (ux < vx) {
    ux = vx;
  }

  if (uy < vy) {
    uy = vy;
  }

  return ux + uy;
}
```

我们可以用它获取曲线上的点，首先检查曲线是否太锐利，如果是就拆分，不是就将点加入列表。

```js
function getPointsOnBezierCurveWithSplitting(points, offset, tolerance, newPoints) {
  const outPoints = newPoints || [];
  if (flatness(points, offset) < tolerance) {
    // 将它加入点队列中
    outPoints.push(points[offset + 0]);
    outPoints.push(points[offset + 3]);
  } else {
    // 拆分
    const t = 0.5;
    const p1 = points[offset + 0];
    const p2 = points[offset + 1];
    const p3 = points[offset + 2];
    const p4 = points[offset + 3];

    const q1 = v2.lerp(p1, p2, t);
    const q2 = v2.lerp(p2, p3, t);
    const q3 = v2.lerp(p3, p4, t);

    const r1 = v2.lerp(q1, q2, t);
    const r2 = v2.lerp(q2, q3, t);

    const red = v2.lerp(r1, r2, t);

    // 求前半段的点
    getPointsOnBezierCurveWithSplitting([p1, q1, r1, red], 0, tolerance, outPoints);
    // 求后半段的点
    getPointsOnBezierCurveWithSplitting([red, r2, q3, p4], 0, tolerance, outPoints);
  }
  return outPoints;
}
```

<iframe src="https://codesandbox.io/embed/sz315s?codemirror=1&hidenavigation=1&theme=light&view=preview&initialpath=?maxDepth=0%26showCurve=true%26showTolerance=true" class="embedded-codesandbox" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

<!-- [bezier-curve-diagram](embedded-codesandbox://webgl-fundamental-geometry/bezier-curve-diagram?view=preview&initialpath=?maxDepth=0%26showCurve=true%26showTolerance=true) -->

这个算法在获取曲线点的过程中确保了点的数量比较充足，但是不能很好的排除不必要的点。

由于这个原因我们将使用我在网上找到的 [Ramer Douglas Peucker 算法](https://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm)。

在这个算法中我们提供一系列点，找到离最后两点构成的直线距离最远的点，然后将这个距离和一个定值进行比较，如果小于那个值就保留最后两个点然后丢弃其他的点，大于则将曲线沿那个最远点分成两份，分别对每一份再做一次这个运算。

```js
function simplifyPoints(points, start, end, epsilon, newPoints) {
  const outPoints = newPoints || [];

  // 找到离最后两点距离最远的点
  const s = points[start];
  const e = points[end - 1];
  let maxDistSq = 0;
  let maxNdx = 1;
  for (let i = start + 1; i < end - 1; ++i) {
    const distSq = v2.distanceToSegmentSq(points[i], s, e);
    if (distSq > maxDistSq) {
      maxDistSq = distSq;
      maxNdx = i;
    }
  }

  // 如果距离太远
  if (Math.sqrt(maxDistSq) > epsilon) {
    // 拆分
    simplifyPoints(points, start, maxNdx + 1, epsilon, outPoints);
    simplifyPoints(points, maxNdx, end, epsilon, outPoints);
  } else {
    // 添加最后两个点
    outPoints.push(s, e);
  }

  return outPoints;
}
```

`v2.distanceToSegmentSq` 是计算点到线段距离平方的一个方法，使用距离平方的原因是比使用实际距离要快一些，因为我们值管线最远距离所以和实际距离的效果相同。

这是结果，调整距离查看添加或删除的点。

<iframe src="https://codesandbox.io/embed/sz315s?codemirror=1&hidenavigation=1&theme=light&view=preview&initialpath=?maxDepth=0%26showCurve=true%26showDistance=true" class="embedded-codesandbox" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

<!-- [bezier-curve-diagram](embedded-codesandbox://webgl-fundamental-geometry/bezier-curve-diagram?view=preview&initialpath=?maxDepth=0%26showCurve=true%26showDistance=true) -->

// TODO https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-3d-geometry-lathe.html
