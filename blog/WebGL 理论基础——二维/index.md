---
title: WebGL 理论基础——二维
date: 2022-05-07 11:37:58
categories:
  - 前端
tags: 前端, 可视化, WebGL, 读书笔记
path: /webgl-fundamental-2d/
---

# WebGL 二维平移

平移就是普通意义的“移动”物体。这里有个例子基于前一个例子。首先我们来定义一些变量存储矩形的平移，宽，高和颜色。

```js
var translation = [0, 0];
var width = 100;
var height = 30;
var color = [Math.random(), Math.random(), Math.random(), 1];
```

然后定义一个方法重绘所有东西，我们可以在更新变换之后调用这个方法。

```js
// 绘制场景
function drawScene() {
  webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  // 告诉 WebGL 如何从裁剪空间对应到像素
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // 清空画布
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 使用我们的程序
  gl.useProgram(program);

  // 启用属性
  gl.enableVertexAttribArray(positionLocation);

  // 绑定位置缓冲
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // 设置矩形参数
  setRectangle(gl, translation[0], translation[1], width, height);

  // 告诉属性怎么从 positionBuffer 中读取数据 (ARRAY_BUFFER)
  var size = 2; // 每次迭代运行提取两个单位数据
  var type = gl.FLOAT; // 每个单位的数据类型是 32 位浮点型
  var normalize = false; // 不需要归一化数据
  var stride = 0; // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
  var offset = 0; // 从缓冲起始位置开始读取
  gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

  // 设置分辨率
  gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

  // 设置颜色
  gl.uniform4fv(colorLocation, color);

  // 绘制矩形
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 6;
  gl.drawArrays(primitiveType, offset, count);
}
```

在下方的例子中，我添加了一对滑块，当它们值改变时会更新 `translation[0]` 和 `translation[1]` 并且调用 drawScene 方法。拖动滑块来平移矩形。

[webgl-2d-rectangle-translate](embedded-codesandbox://webgl-fundamental-2d/webgl-2d-rectangle-translate?view=preview)

到目前为止还不错！但是想象一下如果对一个更复杂的图形做类似操作怎么办。

假设我们想绘制一个由六个三角形组成的 ‘F’ ，像这样

![](res/2022-05-10-00-00-30.png)

接着当前的代码我们需要修改 setRectangle，像这样

```js
// 在缓冲存储构成 'F' 的值
function setGeometry(gl, x, y) {
  var width = 100;
  var height = 150;
  var thickness = 30;
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      // 左竖
      x,
      y,
      x + thickness,
      y,
      x,
      y + height,
      x,
      y + height,
      x + thickness,
      y,
      x + thickness,
      y + height,

      // 上横
      x + thickness,
      y,
      x + width,
      y,
      x + thickness,
      y + thickness,
      x + thickness,
      y + thickness,
      x + width,
      y,
      x + width,
      y + thickness,

      // 中横
      x + thickness,
      y + thickness * 2,
      x + (width * 2) / 3,
      y + thickness * 2,
      x + thickness,
      y + thickness * 3,
      x + thickness,
      y + thickness * 3,
      x + (width * 2) / 3,
      y + thickness * 2,
      x + (width * 2) / 3,
      y + thickness * 3
    ]),
    gl.STATIC_DRAW
  );
}
```

你可能发现这样做可能并不好，如果我们想绘制一个含有成百上千个线条的几何图形，将会有很复杂的代码。最重要的是，每次绘制 JavaScript 都要更新所有点。

这里有个简单的方式，上传几何体然后在着色器中进行平移，以下是新的着色器

```js
<script id="vertex-shader-2d" type="x-shader/x-vertex">
   attribute vec2 a_position;

   uniform vec2 u_resolution;
   uniform vec2 u_translation;

   void main() {
      // 加上平移量
      vec2 position = a_position + u_translation;

      // 从像素坐标转换到 0.0 到 1.0
      vec2 zeroToOne = position / u_resolution;
      // ...
   }
</script>
```

重构一下代码，首先我们只需要设置一次几何体。

```js
// 在缓冲存储构成 'F' 的值
function setGeometry(gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      // 左竖
      0,
      0,
      30,
      0,
      0,
      150,
      0,
      150,
      30,
      0,
      30,
      150,

      // 上横
      30,
      0,
      100,
      0,
      30,
      30,
      30,
      30,
      100,
      0,
      100,
      30,

      // 中横
      30,
      60,
      67,
      60,
      30,
      90,
      30,
      90,
      67,
      60,
      67,
      90
    ]),
    gl.STATIC_DRAW
  );
}
```

然后我们只需要在绘制前更新 `u_translation` 为期望的平移量。

```js
// ...

var translationLocation = gl.getUniformLocation(program, 'u_translation');
// ...

// 创建一个存放位置信息的缓冲
var positionBuffer = gl.createBuffer();
// 绑定到 ARRAY_BUFFER (简单的理解为 ARRAY_BUFFER = positionBuffer)
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
// 将几何数据存到缓冲
setGeometry(gl);

// ...

// 绘制场景
function drawScene() {
  // ...

  // 设置平移
  gl.uniform2fv(translationLocation, translation);

  // 绘制矩形
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 18;
  gl.drawArrays(primitiveType, offset, count);
}
```

注意到 setGeometry 只调用了一次，它不在 drawScene 内部了。

这里是那个例子，同样的，拖动滑块来更新平移量。

[webgl-2d-geometry-translate-better](embedded-codesandbox://webgl-fundamental-2d/webgl-2d-geometry-translate-better?view=preview)

现在当我们绘制时，WebGL 几乎做了所有事情，我们做的仅仅是设置平移然后让它绘制，即使我们的几何体有成千上万个点，主要的代码还是保持不变。

你可以对比上方例子中使用 JavaScript 更新所有点的情况。

# WebGL 二维旋转

首先我想向你介绍一个叫做 `单位圆` 的东西，一个圆有一个半径，圆的半径是圆心到圆边缘的距离，单位圆是半径为 1.0 的圆。

![](res/2022-05-10-10-43-30.png)

当你拖拽蓝色圆点的时候 X 和 Y 会改变，它们是那一点在圆上的坐标，在最上方时 Y 是 1 并且 X 是 0，在最右边的时候 X 是 1 并且 Y 是 0。

如果你还记得三年级的数学知识，数字和 1 相乘结果不变。例如 `123 * 1 = 123`，那么，单位圆半径为 1.0 的圆也是 1 的一种形式，它是旋转的 1。所以你可以把一些东西和单位圆相乘，除了发生一些魔法和旋转之外，某种程度上和乘以 1 相似。

我们将从单位元上任取一点，并将该点的 X 和 Y 与之前例子中的几何体相乘，以下是新的着色器。

```js
<script id="vertex-shader-2d" type="x-shader/x-vertex">
   attribute vec2 a_position;

   uniform vec2 u_resolution;
   uniform vec2 u_translation;
   uniform vec2 u_rotation;

   void main() {
      // 旋转位置
      vec2 rotatedPosition = vec2(
         a_position.x * u_rotation.y + a_position.y * u_rotation.x,
         a_position.y * u_rotation.y - a_position.x * u_rotation.x
      );

      // 加上平移
      vec2 position = rotatedPosition + u_translation;
   }
</script>
```

更新 JavaScript，传递两个值进去。

```js
// ...

var rotationLocation = gl.getUniformLocation(program, 'u_rotation');

// ...

var rotation = [0, 1];

// ...

// 绘制场景
function drawScene() {
  // ...

  // 设置平移
  gl.uniform2fv(translationLocation, translation);

  // 设置旋转
  gl.uniform2fv(rotationLocation, rotation);

  // 绘制几何体
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 18; // 6 个三角形组成 'F', 每个三角形 3 个点
  gl.drawArrays(primitiveType, offset, count);
}
```

这是结果，拖动圆形手柄来旋转或拖动滑块来平移。

<iframe src="https://codesandbox.io/embed/6g8g2i?codemirror=1&hidenavigation=1&theme=light&view=preview" class="embedded-codesandbox" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

<!-- [webgl-2d-geometry-rotation](embedded-codesandbox://webgl-fundamental-2d/webgl-2d-geometry-rotation?view=preview) -->

为什么会这样？来看看数学公式。

```cpp
rotatedX = a_position.x * u_rotation.y + a_position.y * u_rotation.x;
rotatedY = a_position.y * u_rotation.y - a_position.x * u_rotation.x;
```

假如你想旋转一个矩形，在开始旋转之前矩形右上角坐标是 3.0, 9.0，让我们在单位圆上以十二点方向为起点顺时针旋转 30 度后取一个点。

![](res/2022-05-10-11-21-43.png)

圆上该点的位置是 0.50 和 0.87

```
3.0 * 0.87 + 9.0 * 0.50 = 7.1
9.0 * 0.87 - 3.0 * 0.50 = 6.3
```

这个结果正好是我们需要的结果

![](res/2022-05-10-11-22-51.png)

顺时针 60 度也一样

![](res/2022-05-10-11-23-18.png)

圆上该点的位置是 0.87 和 0.50。

```
3.0 * 0.50 + 9.0 * 0.87 = 9.3
9.0 * 0.50 - 3.0 * 0.87 = 1.9
```

你会发现在我们顺时针旋转到右边的过程中，X 变大 Y 变小。如果我们继续旋转超过 90 度后，X 变小 Y 变大，这种形式形成了旋转。

单位圆上的点还有一个名字，叫做正弦和余弦。所以对于任意给定角，我们只需要求出正弦和余弦，像这样

```js
function printSineAndCosineForAnAngle(angleInDegrees) {
  var angleInRadians = (angleInDegrees * Math.PI) / 180;
  var s = Math.sin(angleInRadians);
  var c = Math.cos(angleInRadians);
  console.log('s = ' + s + ' c = ' + c);
}
```

如果把代码复制到 JavaScript 控制台，然后输入 `printSineAndCosignForAngle(30)`，会打印出 `s = 0.49 c = 0.87`(注意：我对结果四舍五入了)。

如果你把这些组合起来，就可以对几何体旋转任意角度，使用时只需要设置旋转的角度。

```js
// ...
var angleInRadians = (angleInDegrees * Math.PI) / 180;
rotation[0] = Math.sin(angleInRadians);
rotation[1] = Math.cos(angleInRadians);
```

这里有一个设置角度的版本，拖动滑块来旋转或平移。

[webgl-2d-geometry-rotation-angle](embedded-codesandbox://webgl-fundamental-2d/webgl-2d-geometry-rotation-angle?view=preview)

这并不是旋转常用的方式，请继续阅读

# WebGL 二维缩放

缩放和平移一样简单，让我们将位置乘以期望的缩放值，这是前例中的变化部分。

```js{7,10-11,15-16}
<script id="vertex-shader-2d" type="x-shader/x-vertex">
   attribute vec2 a_position;

   uniform vec2 u_resolution;
   uniform vec2 u_translation;
   uniform vec2 u_rotation;
   uniform vec2 u_scale;

   void main() {
      // 缩放
      vec2 scaledPosition = a_position * u_scale;

      // 旋转
      vec2 rotatedPosition = vec2(
         scaledPosition.x * u_rotation.y + scaledPosition.y * u_rotation.x,
         scaledPosition.y * u_rotation.y - scaledPosition.x * u_rotation.x);

      // 平移
      vec2 position = rotatedPosition + u_translation;
   }
</script>
```

然后需要在 JavaScript 中绘制的地方设置缩放量。

```js{3,7,21-22}
// ...

var scaleLocation = gl.getUniformLocation(program, 'u_scale');

// ...

var scale = [1, 1];

// ...

// 绘制场景
function drawScene() {
  // ...

  // 设置平移
  gl.uniform2fv(translationLocation, translation);

  // 设置旋转
  gl.uniform2fv(rotationLocation, rotation);

  // 设置缩放
  gl.uniform2fv(scaleLocation, scale);

  // 绘制几何体
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 18; // 6 个三角形组成 'F', 每个三角形 3 个点
  gl.drawArrays(primitiveType, offset, count);
}
```

现在我们有了缩放，拖动滑块试试。

[webgl-2d-geometry-scale](embedded-codesandbox://webgl-fundamental-2d/webgl-2d-geometry-scale?view=preview)

值得一提的是，缩放值为负数的时候会翻转几何体。

接下来我们将复习神奇的矩阵，这三种操作将包含在一个矩阵中，并表现为一种常用形式。

// TODO https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-2d-matrices.html
