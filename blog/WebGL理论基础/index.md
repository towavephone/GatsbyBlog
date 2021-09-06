---
title: WebGL 理论基础——基础概念
date: 2021-9-6 16:48:17
categories:
  - 前端
tags: 前端, 可视化, WebGL
path: /webgl-fundamental-base-concept/
---

# 基础概念

## 背景

WebGL 经常被当成 3D API，人们总想“我可以使用 WebGL 和一些神奇的东西做出炫酷的 3D 作品”。事实上 WebGL 仅仅是一个光栅化引擎，它可以根据你的代码绘制出点，线和三角形。想要利用 WebGL 完成更复杂任务，取决于你能否提供合适的代码，组合使用点，线和三角形代替实现。

WebGL 在电脑的 GPU 中运行。因此你需要使用能够在 GPU 上运行的代码。这样的代码需要提供成对的方法。每对方法中一个叫顶点着色器，另一个叫片断着色器，并且使用一种和 C 或 C++类似的强类型的语言 GLSL（GL 着色语言），每一对组合起来称作一个 program（着色程序）。

顶点着色器的作用是计算顶点的位置。根据计算出的一系列顶点位置，WebGL 可以对点，线和三角形在内的一些图元进行光栅化处理。当对这些图元进行光栅化处理时需要使用片断着色器方法。片断着色器的作用是计算出当前绘制图元中每个像素的颜色值。

几乎整个 WebGL API 都是关于如何设置这些成对方法的状态值以及运行它们。对于想要绘制的每一个对象，都需要先设置一系列状态值，然后通过调用 gl.drawArrays 或 gl.drawElements 运行一个着色方法对，使得你的着色器对能够在 GPU 上运行。

这些方法对所需的任何数据都需要发送到 GPU，这里有着色器获取数据的 4 种方法。

### 属性（Attributes）和缓冲

缓冲是发送到 GPU 的一些二进制数据序列，通常情况下缓冲数据包括位置，法向量，纹理坐标，顶点颜色值等。 你可以存储任何数据。

属性用来指明怎么从缓冲中获取所需数据并将它提供给顶点着色器。例如你可能在缓冲中用三个 32 位的浮点型数据存储一个位置值。 对于一个确切的属性你需要告诉它从哪个缓冲中获取数据，获取什么类型的数据（三个 32 位的浮点数据），起始偏移值是多少，到下一个位置的字节数是多少。

缓冲不是随意读取的。事实上顶点着色器运行的次数是一个指定的确切数字，每一次运行属性会从指定的缓冲中按照指定规则依次获取下一个值。

### 全局变量（Uniforms）

全局变量在着色程序运行前赋值，在运行过程中全局有效。

### 纹理（Textures）

纹理是一个数据序列，可以在着色程序运行中随意读取其中的数据。大多数情况存放的是图像数据，但是纹理仅仅是数据序列， 你也可以随意存放除了颜色数据以外的其它数据。

### 可变量（Varyings）

可变量是一种顶点着色器给片断着色器传值的方式，依照渲染的图元是点，线还是三角形，顶点着色器中设置的可变量会在片断着色器运行中获取不同的插值。

## Hello World

WebGL 只关心两件事：裁剪空间中的坐标值和颜色值。使用 WebGL 只需要给它提供这两个东西。你需要提供两个着色器来做这两件事，一个顶点着色器提供裁剪空间坐标值，一个片断着色器提供颜色值。

无论你的画布有多大，裁剪空间的坐标范围永远是 -1 到 1。这里有一个简单的 WebGL 例子展示 WebGL 的简单用法。

让我们从顶点着色器开始

```cpp
// 一个属性值，将会从缓冲中获取数据
attribute vec4 a_position;

// 所有着色器都有一个main方法
void main() {

  // gl_Position 是一个顶点着色器主要设置的变量
  gl_Position = a_position;
}
```

如果用 JavaScript 代替 GLSL，当它运行的时候，你可以想象它做了类似以下的事情

```js
// *** 伪代码!! ***
var positionBuffer = [0, 0, 0, 0, 0, 0.5, 0, 0, 0.7, 0, 0, 0];
var attributes = {};
var gl_Position;

function drawArrays(_, offset, count) {
  var stride = 4;
  var size = 4;
  for (var i = 0; i < count; ++i) {
    // 从 positionBuffer 复制接下来 4 个值给 a_position 属性
    const start = offset + i * stride;
    attributes.a_position = positionBuffer.slice(start, start + size);
    runVertexShader(); // 运行顶点着色器
    // ...
    doSomethingWith_gl_Position();
  }
}
```

实际情况没有那么简单，因为 positionBuffer 将会被转换成二进制数据（见下文），所以真实情况下从缓冲中读取数据有些麻烦，但是希望这个例子能够让你想象出顶点着色器是怎么执行的。

接下来我们需要一个片断着色器

```cpp
// 片断着色器没有默认精度，所以我们需要设置一个精度
// mediump是一个不错的默认值，代表“medium precision”（中等精度）
precision mediump float;

void main() {
  // gl_FragColor是一个片断着色器主要设置的变量
  gl_FragColor = vec4(1, 0, 0.5, 1); // 返回“红紫色”
}
```

上方我们设置 gl_FragColor 为 `1, 0, 0.5, 1`，其中 1 代表红色值，0 代表绿色值， 0.5 代表蓝色值，最后一个 1 表示阿尔法通道值。WebGL 中的颜色值范围从 0 到 1 。

现在我们有了两个着色器方法，让我们开始使用 WebGL 吧

首先我们需要一个 HTML 中的 canvas（画布）对象

```html
<canvas id="c"></canvas>
```

然后可以用 JavaScript 获取它

```js
var canvas = document.querySelector('#c');
```

现在我们创建一个 WebGL 渲染上下文（WebGLRenderingContext）

```js
var gl = canvas.getContext('webgl');
if (!gl) {
  // 你不能使用 WebGL！
  // ...
}
```

现在我们需要编译着色器对然后提交到 GPU，先让我们通过字符串获取它们。 你可以利用 JavaScript 中创建字符串的方式创建 GLSL 字符串：用串联的方式（concatenating），用 AJAX 下载，用多行模板数据。或者在这个例子里，将它们放在非 JavaScript 类型的标签中。

```html
<script id="vertex-shader-2d" type="notjs">

  // 一个属性变量，将会从缓冲中获取数据
  attribute vec4 a_position;

  // 所有着色器都有一个main方法
  void main() {

    // gl_Position 是一个顶点着色器主要设置的变量
    gl_Position = a_position;
  }
</script>

<script id="fragment-shader-2d" type="notjs">

  // 片断着色器没有默认精度，所以我们需要设置一个精度
  // mediump是一个不错的默认值，代表“medium precision”（中等精度）
  precision mediump float;

  void main() {
    // gl_FragColor是一个片断着色器主要设置的变量
    gl_FragColor = vec4(1, 0, 0.5, 1); // 返回“瑞迪施紫色”
  }
</script>
```

事实上，大多数三维引擎在运行时利用模板，串联等方式创建 GLSL。对于这个网站上的例子来说，没有复杂到要在运行时创建 GLSL 的程度。

接下来我们使用的方法将会创建一个着色器，只需要上传 GLSL 数据，然后编译成着色器。你可能注意到这段代码没有任何注释，因为可以从方法名很清楚的了解方法的作用（这里作为翻译版本我还是稍微注释一下）。

```js
// 创建着色器方法，输入参数：渲染上下文，着色器类型，数据源
function createShader(gl, type, source) {
  var shader = gl.createShader(type); // 创建着色器对象
  gl.shaderSource(shader, source); // 提供数据源
  gl.compileShader(shader); // 编译 -> 生成着色器
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}
```

现在我们可以使用以上方法创建两个着色器

```js
var vertexShaderSource = document.querySelector('#vertex-shader-2d').text;
var fragmentShaderSource = document.querySelector('#fragment-shader-2d').text;

var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
```

然后我们将这两个着色器 link（链接）到一个 program（着色程序）

```js
function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}
```

然后调用它

```js
var program = createProgram(gl, vertexShader, fragmentShader);
```

现在我们已经在 GPU 上创建了一个 GLSL 着色程序，我们还需要给它提供数据。WebGL 的主要任务就是设置好状态并为 GLSL 着色程序提供数据。 在这个例子中 GLSL 着色程序的唯一输入是一个属性值 a_position。 我们要做的第一件事就是从刚才创建的 GLSL 着色程序中找到这个属性值所在的位置。

```js
var positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
```

寻找属性值位置（和全局属性位置）应该在初始化的时候完成，而不是在渲染循环中。

属性值从缓冲中获取数据，所以我们创建一个缓冲

```js
var positionBuffer = gl.createBuffer();
```

WebGL 可以通过绑定点操控全局范围内的许多数据，你可以把绑定点想象成一个 WebGL 内部的全局变量。首先绑定一个数据源到绑定点，然后可以引用绑定点指向该数据源。所以让我们来绑定位置信息缓冲（下面的绑定点就是 ARRAY_BUFFER）。

```js
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
```

现在我们需要通过绑定点向缓冲中存放数据

```js
// 三个二维点坐标
var positions = [0, 0, 0, 0.5, 0.7, 0];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
```

这里完成了一系列事情，第一件事是我们有了一个 JavaScript 序列 positions。然而 WebGL 需要强类型数据，所以 new Float32Array(positions)创建了 32 位浮点型数据序列，并从 positions 中复制数据到序列中，然后 gl.bufferData 复制这些数据到 GPU 的 positionBuffer 对象上。它最终传递到 positionBuffer 上是因为在前一步中我们我们将它绑定到了 ARRAY_BUFFER（也就是绑定点）上。

最后一个参数 `gl.STATIC_DRAW` 是提示 WebGL 我们将怎么使用这些数据。WebGL 会根据提示做出一些优化。`gl.STATIC_DRAW` 提示 WebGL 我们不会经常改变这些数据。

在此之上的代码是初始化代码。这些代码在页面加载时只会运行一次。接下来的代码是渲染代码，而这些代码将在我们每次要渲染或者绘制时执行。

## 渲染

在绘制之前我们应该调整画布（canvas）的尺寸以匹配它的显示尺寸。画布就像图片一样有两个尺寸。一个是它拥有的实际像素个数，另一个是它显示的大小。CSS 决定画布显示的大小。你应该尽可能用 CSS 设置所需画布大小 ，因为它比其它方式灵活的多。

这里的例子中，有独立窗口显示的示例大多使用 400x300 像素大小的画布。但是如果像稍后展示的示例那样嵌在页面中，它就会被拉伸以填满可用空间（你也可以点击示例下方的“点此在新窗口中浏览”在独立窗口中查看示例）。通过使用 CSS 调整画布尺寸可以轻松处理这些情况。

```js
webglUtils.resizeCanvasToDisplaySize(gl.canvas);
```

我们需要告诉 WebGL 怎样把提供的 gl_Position 裁剪空间坐标对应到画布像素坐标，通常我们也把画布像素坐标叫做屏幕空间。为了实现这个目的，我们只需要调用 gl.viewport 方法并传递画布的当前尺寸。

```js
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
```

这样就告诉 WebGL 裁剪空间的 -1 -> +1 分别对应到 x 轴的 0 -> gl.canvas.width 和 y 轴的 0 -> gl.canvas.height。

我们用 `0, 0, 0, 0` 清空画布，分别对应 r, g, b, alpha（红，绿，蓝，阿尔法）值，所以在这个例子中我们让画布变透明了。

```js
// 清空画布
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);
```

我们需要告诉 WebGL 运行哪个着色程序

```js
// 告诉它用我们之前写好的着色程序（一个着色器对）
gl.useProgram(program);
```

接下来我们需要告诉 WebGL 怎么从我们之前准备的缓冲中获取数据给着色器中的属性。首先我们需要启用对应属性

```js
gl.enableVertexAttribArray(positionAttributeLocation);
```

然后指定从缓冲中读取数据的方式

```js
// 将绑定点绑定到缓冲数据（positionBuffer）
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// 告诉属性怎么从 positionBuffer 中读取数据 (ARRAY_BUFFER)
var size = 2; // 每次迭代运行提取两个单位数据
var type = gl.FLOAT; // 每个单位的数据类型是32位浮点型
var normalize = false; // 不需要归一化数据
var stride = 0; // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
// 每次迭代运行运动多少内存到下一个数据开始点
var offset = 0; // 从缓冲起始位置开始读取
gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
```

一个隐藏信息是 gl.vertexAttribPointer 是将属性绑定到当前的 `ARRAY_BUFFER`。换句话说就是属性绑定到了 positionBuffer 上。这也意味着现在利用绑定点随意将 `ARRAY_BUFFER` 绑定到其它数据上后，该属性依然从 positionBuffer 上读取数据。

从 GLSL 的顶点着色器中注意到 a_position 属性的数据类型是 vec4

```
attribute vec4 a_position;
```

vec4 是一个有四个浮点数据的数据类型。在 JavaScript 中你可以把它想象成 `a_position = {x: 0, y: 0, z: 0, w: 0}`。之前我们设置的 size = 2， 属性默认值是 `0, 0, 0, 1`，然后属性将会从缓冲中获取前两个值（ x 和 y ）。z 和 w 还是默认值 0 和 1 。

我们终于可以让 WebGL 运行我们的 GLSL 着色程序了。

```js
var primitiveType = gl.TRIANGLES;
var offset = 0;
var count = 3;
gl.drawArrays(primitiveType, offset, count);
```

因为 count = 3，所以顶点着色器将运行三次。第一次运行将会从位置缓冲中读取前两个值赋给属性值 `a_position.x` 和 `a_position.y`。第二次运行 `a_position.xy` 将会被赋予后两个值，最后一次运行将被赋予最后两个值。

因为我们设置 primitiveType（图元类型）为 gl.TRIANGLES（三角形），顶点着色器每运行三次 WebGL 将会根据三个 gl_Position 值绘制一个三角形，不论我们的画布大小是多少，在裁剪空间中每个方向的坐标范围都是 -1 到 1。

由于我们的顶点着色器仅仅是传递位置缓冲中的值给 gl_Position，所以三角形在裁剪空间中的坐标如下

```
0, 0,
0, 0.5,
0.7, 0,
```

WebGL 将会把它们从裁剪空间转换到屏幕空间并在屏幕空间绘制一个三角形，如果画布大小是 400×300 我们会得到类似以下的转换

```
 裁剪空间            屏幕空间
   0, 0       ->   200, 150
   0, 0.5     ->   200, 225
 0.7, 0       ->   340, 150
```

现在 WebGL 将渲染出这个三角形。绘制每个像素时 WebGL 都将调用我们的片断着色器。我们的片断着色器只是简单设置 gl_FragColor 为 `1, 0, 0.5, 1`， 由于画布的每个通道宽度为 8 位，这表示 WebGL 最终在画布上绘制`[255, 0, 127, 255]`。

<iframe src="/examples/webgl-fundamental/draw-triangle.html" width="400" height="100"></iframe>

`embed:webgl-fundamental/draw-triangle.html`

// TODO https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-fundamentals.html
