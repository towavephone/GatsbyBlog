---
title: WebGL 理论基础——光照
date: 2022-06-07 14:38:03
categories:
  - 前端
tags: 前端, 可视化, WebGL, 读书笔记
path: /webgl-fundamental-light/
---

# WebGL 三维方向光源

实施光照的方式有很多种，最简单的可能就是方向光源了。

方向光是指光照均匀地来自某一个方向，晴朗天气下的太阳经常被当作方向光源，它距离太远所以光线被看作是平行的照到地面上。

计算方向光非常简单，将方向光的方向和面的朝向点乘就可以得到两个方向的余弦值。

这有个例子

[dot-product](embedded-codesandbox://webgl-fundamental-light/dot-product?view=preview)

随意拖动其中的点，如果两点方向刚好相反，点乘结果则为 -1，如果方向相同结果为 1。

这有什么用呢？如果将三维物体的朝向和光的方向点乘，结果为 1 则物体朝向和光照方向相同，为 -1 则物体朝向和光照方向相反。

[directional-lighting](embedded-codesandbox://webgl-fundamental-light/directional-lighting?view=preview)

我们可以将颜色值和点乘结果相乘，有光了！

还有一个问题，我们如何知道三维物体的朝向？

## 法向量

我不知道为什么叫法向量，但是在三维图形学中法向量就是描述面的朝向的单位向量。

这是正方体和球体的一些法向量。

[normals](embedded-codesandbox://webgl-fundamental-light/normals?view=preview)

这些插在物体上的线就是对应顶点的法向量。

注意到正方体在每个顶角有 3 个法向量。这是因为需要 3 个法向量去描述相邻的每个面的朝向。

这里的法向量是基于他们的方向着色的，正 x 方向为红色，上方向为绿色，正 z 方向为蓝色。

让我们来给上节中的 F 添加法向量。由于 F 非常规则并且朝向都是 `x, y, z` 轴，所以非常简单。正面的的部分法向量为 `0, 0, 1`，背面的部分法向量为 `0, 0, -1`，左面为 `-1, 0, 0`，右面为 `1, 0, 0`，上面为 `0, 1, 0`，然后底面为 `0, -1, 0`。

```js
function setNormals(gl) {
  var normals = new Float32Array([
    // 正面左竖
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,

    // 正面上横
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,

    // 正面中横
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,

    // 背面左竖
    0,
    0,
    -1,
    0,
    0,
    -1,
    0,
    0,
    -1,
    0,
    0,
    -1,
    0,
    0,
    -1,
    0,
    0,
    -1,

    // 背面上横
    0,
    0,
    -1,
    0,
    0,
    -1,
    0,
    0,
    -1,
    0,
    0,
    -1,
    0,
    0,
    -1,
    0,
    0,
    -1,

    // 背面中横
    0,
    0,
    -1,
    0,
    0,
    -1,
    0,
    0,
    -1,
    0,
    0,
    -1,
    0,
    0,
    -1,
    0,
    0,
    -1,

    // 顶部
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,

    // 上横右面
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,

    // 上横下面
    0,
    -1,
    0,
    0,
    -1,
    0,
    0,
    -1,
    0,
    0,
    -1,
    0,
    0,
    -1,
    0,
    0,
    -1,
    0,

    // 上横和中横之间
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,

    // 中横上面
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,

    // 中横右面
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,

    // 中横底面
    0,
    -1,
    0,
    0,
    -1,
    0,
    0,
    -1,
    0,
    0,
    -1,
    0,
    0,
    -1,
    0,
    0,
    -1,
    0,

    // 底部右侧
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,

    // 底面
    0,
    -1,
    0,
    0,
    -1,
    0,
    0,
    -1,
    0,
    0,
    -1,
    0,
    0,
    -1,
    0,
    0,
    -1,
    0,

    // 左面
    -1,
    0,
    0,
    -1,
    0,
    0,
    -1,
    0,
    0,
    -1,
    0,
    0,
    -1,
    0,
    0,
    -1,
    0,
    0
  ]);
  gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
}
```

在代码中使用它们，先移除顶点颜色以便观察光照效果。

```js
// 找顶点着色器中的属性
var positionLocation = gl.getAttribLocation(program, 'a_position');
// var colorLocation = gl.getAttribLocation(program, "a_color");
var normalLocation = gl.getAttribLocation(program, 'a_normal');

// ...

// // 创建一个缓冲存储颜色
// var colorBuffer = gl.createBuffer();
// // 绑定到 ARRAY_BUFFER
// gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
// // 将几何数据放入缓冲
// setColors(gl);

// 创建缓冲存储法向量
var normalBuffer = gl.createBuffer();
// 绑定到 ARRAY_BUFFER (可以看作 ARRAY_BUFFER = normalBuffer)
gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
// 将法向量存入缓冲
setNormals(gl);
```

在渲染的时候

```js
// // 启用颜色属性
// gl.enableVertexAttribArray(colorLocation);

// // 绑定颜色缓冲
// gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

// // 告诉颜色属性怎么从 colorBuffer(ARRAY_BUFFER) 中读取颜色值
// var size = 3;                 // 每次迭代使用 3 个单位的数据
// var type = gl.UNSIGNED_BYTE;  // 单位数据类型是无符号 8 位整数
// var normalize = true;         // 标准化数据 (从 0-255 转换到 0.0-1.0)
// var stride = 0;               // 0 = 移动距离 * 单位距离长度 sizeof(type)，每次迭代跳多少距离到下一个数据
// var offset = 0;               // 从绑定缓冲的起始处开始
// gl.vertexAttribPointer(
//     colorLocation, size, type, normalize, stride, offset)

// 启用法向量属性
gl.enableVertexAttribArray(normalLocation);

// 绑定法向量缓冲
gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

// 告诉法向量属性怎么从 normalBuffer (ARRAY_BUFFER) 中读取值
var size = 3; // 每次迭代使用 3 个单位的数据
var type = gl.FLOAT; // 单位数据类型是 32 位浮点型
var normalize = false; // 单位化 (从 0-255 转换到 0-1)
var stride = 0; // 0 = 移动距离 * 单位距离长度 sizeof(type)，每次迭代跳多少距离到下一个数据
var offset = 0; // 从绑定缓冲的起始处开始
gl.vertexAttribPointer(normalLocation, size, type, normalize, stride, offset);
```

现在让着色器使用它

首先在顶点着色器中只将法向量传递给片断着色器

// TODO https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-3d-lighting-directional.html
