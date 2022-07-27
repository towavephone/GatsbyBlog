---
title: WebGL 理论基础——基础概念
date: 2022-04-26 11:03:10
categories:
  - 前端
tags: 前端, 可视化, WebGL, 读书笔记
path: /webgl-fundamental-base-concept/
---

# 基础概念

## 背景

WebGL 经常被当成 3D API，人们总想“我可以使用 WebGL 和一些神奇的东西做出炫酷的 3D 作品”。事实上 WebGL 仅仅是一个光栅化引擎，它可以根据你的代码绘制出点，线和三角形。想要利用 WebGL 完成更复杂任务，取决于你能否提供合适的代码，组合使用点，线和三角形代替实现。

WebGL 在电脑的 GPU 中运行。因此你需要使用能够在 GPU 上运行的代码。这样的代码需要提供成对的方法。每对方法中一个叫顶点着色器，另一个叫片断着色器，并且使用一种和 C 或 C++ 类似的强类型的语言 GLSL（GL 着色语言），每一对组合起来称作一个 program（着色程序）。

顶点着色器的作用是计算顶点的位置。根据计算出的一系列顶点位置，WebGL 可以对点，线和三角形在内的一些图元进行光栅化处理。当对这些图元进行光栅化处理时需要使用片断着色器方法。片断着色器的作用是计算出当前绘制图元中每个像素的颜色值。

几乎整个 WebGL API 都是关于如何设置这些成对方法的状态值以及运行它们。对于想要绘制的每一个对象，都需要先设置一系列状态值，然后通过调用 gl.drawArrays 或 gl.drawElements 运行一个着色方法对，使得你的着色器对能够在 GPU 上运行。

这些方法对所需的任何数据都需要发送到 GPU，这里有着色器获取数据的 4 种方法。

### 属性（Attributes）和缓冲

缓冲是发送到 GPU 的一些二进制数据序列，通常情况下缓冲数据包括位置，法向量，纹理坐标，顶点颜色值等。你可以存储任何数据。

属性用来指明怎么从缓冲中获取所需数据并将它提供给顶点着色器。例如你可能在缓冲中用三个 32 位的浮点型数据存储一个位置值。对于一个确切的属性你需要告诉它从哪个缓冲中获取数据，获取什么类型的数据（三个 32 位的浮点数据），起始偏移值是多少，到下一个位置的字节数是多少。

缓冲不是随意读取的。事实上顶点着色器运行的次数是一个指定的确切数字，每一次运行属性会从指定的缓冲中按照指定规则依次获取下一个值。

### 全局变量（Uniforms）

全局变量在着色程序运行前赋值，在运行过程中全局有效。

### 纹理（Textures）

纹理是一个数据序列，可以在着色程序运行中随意读取其中的数据。大多数情况存放的是图像数据，但是纹理仅仅是数据序列，你也可以随意存放除了颜色数据以外的其它数据。

### 可变量（Varyings）

可变量是一种顶点着色器给片断着色器传值的方式，依照渲染的图元是点，线还是三角形，顶点着色器中设置的可变量会在片断着色器运行中获取不同的插值。

## Hello World

WebGL 只关心两件事：裁剪空间中的坐标值和颜色值。使用 WebGL 只需要给它提供这两个东西。你需要提供两个着色器来做这两件事，一个顶点着色器提供裁剪空间坐标值，一个片断着色器提供颜色值。

无论你的画布有多大，裁剪空间的坐标范围永远是 -1 到 1。这里有一个简单的 WebGL 例子展示 WebGL 的简单用法。

让我们从顶点着色器开始

```glsl
// 一个属性值，将会从缓冲中获取数据
attribute vec4 a_position;

// 所有着色器都有一个 main 方法
void main() {

  // gl_Position 是一个顶点着色器主要设置的变量
  gl_Position = a_position;
}
```

如果用 JavaScript 代替 GLSL，当它运行的时候，你可以想象它做了类似以下的事情

```js
// 伪代码
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

```glsl
// 片断着色器没有默认精度，所以我们需要设置一个精度
// mediump 是一个不错的默认值，代表 medium precision（中等精度）
precision mediump float;

void main() {
  // gl_FragColor 是一个片断着色器主要设置的变量
  gl_FragColor = vec4(1, 0, 0.5, 1); // 返回“红紫色”
}
```

上方我们设置 gl_FragColor 为 `1, 0, 0.5, 1`，其中 1 代表红色值，0 代表绿色值，0.5 代表蓝色值，最后一个 1 表示阿尔法通道值。WebGL 中的颜色值范围从 0 到 1 。

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

  // 所有着色器都有一个 main 方法
  void main() {

    // gl_Position 是一个顶点着色器主要设置的变量
    gl_Position = a_position;
  }
</script>

<script id="fragment-shader-2d" type="notjs">

  // 片断着色器没有默认精度，所以我们需要设置一个精度
  // mediump 是一个不错的默认值，代表 medium precision（中等精度）
  precision mediump float;

  void main() {
    // gl_FragColor 是一个片断着色器主要设置的变量
    gl_FragColor = vec4(1, 0, 0.5, 1); // 返回“红紫色”
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
  gl.attachShader(program, vertexShader); // 添加顶点着色器
  gl.attachShader(program, fragmentShader); // 添加片元着色器
  gl.linkProgram(program); // 连接 program 中的着色器
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

现在我们已经在 GPU 上创建了一个 GLSL 着色程序，我们还需要给它提供数据。WebGL 的主要任务就是设置好状态并为 GLSL 着色程序提供数据。在这个例子中 GLSL 着色程序的唯一输入是一个属性值 a_position。我们要做的第一件事就是从刚才创建的 GLSL 着色程序中找到这个属性值所在的位置。

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

这里完成了一系列事情，第一件事是我们有了一个 JavaScript 序列 positions。然而 WebGL 需要强类型数据，所以 `new Float32Array(positions)` 创建了 32 位浮点型数据序列，并从 positions 中复制数据到序列中，然后 gl.bufferData 复制这些数据到 GPU 的 positionBuffer 对象上。它最终传递到 positionBuffer 上是因为在前一步中我们我们将它绑定到了 ARRAY_BUFFER（也就是绑定点）上。

最后一个参数 `gl.STATIC_DRAW` 是提示 WebGL 我们将怎么使用这些数据。WebGL 会根据提示做出一些优化。`gl.STATIC_DRAW` 提示 WebGL 我们不会经常改变这些数据。

在此之上的代码是初始化代码。这些代码在页面加载时只会运行一次。接下来的代码是渲染代码，而这些代码将在我们每次要渲染或者绘制时执行。

## 渲染

在绘制之前我们应该调整画布（canvas）的尺寸以匹配它的显示尺寸。画布就像图片一样有两个尺寸。一个是它拥有的实际像素个数，另一个是它显示的大小。CSS 决定画布显示的大小。你应该尽可能用 CSS 设置所需画布大小，因为它比其它方式灵活的多。

这里的例子中，有独立窗口显示的示例大多使用 400x300 像素大小的画布。但是如果像稍后展示的示例那样嵌在页面中，它就会被拉伸以填满可用空间。通过使用 CSS 调整画布尺寸可以轻松处理这些情况。

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
var type = gl.FLOAT; // 每个单位的数据类型是 32 位浮点型
var normalize = false; // 不需要归一化数据
var stride = 0; // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
// 每次迭代运行运动多少内存到下一个数据开始点
var offset = 0; // 从缓冲起始位置开始读取
gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
```

一个隐藏信息是 `gl.vertexAttribPointer` 是将属性绑定到当前的 `ARRAY_BUFFER`。换句话说就是属性绑定到了 positionBuffer 上。这也意味着现在利用绑定点随意将 `ARRAY_BUFFER` 绑定到其它数据上后，该属性依然从 positionBuffer 上读取数据。

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

因为 count = 3，所以顶点着色器将运行三次。第一次运行将会从位置缓冲中读取前两个值赋给属性值 `a_position.x` 和 `a_position.y`。第二次运行 `a_position.x` 和 `a_position.y` 将会被赋予后两个值，最后一次运行将被赋予最后两个值。

因为我们设置 primitiveType（图元类型）为 `gl.TRIANGLES`（三角形），顶点着色器每运行三次 WebGL 将会根据三个 gl_Position 值绘制一个三角形，不论我们的画布大小是多少，在裁剪空间中每个方向的坐标范围都是 -1 到 1。

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

<iframe src="/examples/webgl-fundamental-base-concept/draw-triangle.html" width="400" height="100"></iframe>

`embed:webgl-fundamental-base-concept/draw-triangle.html`

在上例中可以发现顶点着色器只是简单的传递了位置信息。由于位置数据坐标就是裁剪空间中的坐标，所以顶点着色器没有做什么特别的事。如果你想做三维渲染，你需要提供合适的着色器将三维坐标转换到裁剪空间坐标，因为 WebGL 只是一个光栅化 API。

你可能会好奇为什么这个三角形从中间开始然后朝向右上方。裁剪空间的 x 坐标范围是 -1 到 +1. 这就意味着 0 在中间并且正值在它右边。

至于它为什么在上方，是因为裁剪空间中 -1 是最底端 +1 是最顶端，这也意味值 0 在中间，正值在上方。

对于描述二维空间中的物体，比起裁剪空间坐标你可能更希望使用屏幕像素坐标。所以我们来改造一下顶点着色器，让我们提供给它像素坐标而不是裁剪空间坐标。这是我们新的顶点着色器

```html
<script id="vertex-shader-2d" type="notjs">
  // attribute vec4 a_position;
  attribute vec2 a_position;

  uniform vec2 u_resolution;

  void main() {
    // 从像素坐标转换到 0.0 到 1.0
    vec2 zeroToOne = a_position / u_resolution;

    // 再把 0->1 转换 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;

    // 把 0->2 转换到 -1->+1 (裁剪空间)
    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace, 0, 1);
  }
</script>
```

这里有些变化需要注意，我们将 a_position 改成 vec2 类型是因为我们只需要用 x 和 y 值。vec2 和 vec4 有些类似但是仅有 x 和 y 值。

接着我们添加了一个 uniform（全局变量）叫做 u_resolution，为了设置它的值我们需要找到它的位置。

```js
var resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
```

其余变化的应该能从注释中理解。通过设置 u_resolution 为画布的分辨率，着色器将会从 positionBuffer 中获取像素坐标将之转换为对应的裁剪空间坐标。

现在我们可以将位置信息转换为像素坐标。这次我们将通过绘制两个三角形来绘制一个矩形，每个三角形有三个点。

```js
var positions = [10, 20, 80, 20, 10, 30, 10, 30, 80, 20, 80, 30];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
```

在我们设置好使用这个着色程序后，可以设置刚才创建的全局变量的值。gl.useProgram 就与之前讲到的 gl.bindBuffer 相似，设置当前使用的着色程序。之后所有类似 gl.uniformXXX 格式的方法都是设置当前着色程序的全局变量。

```js
gl.useProgram(program);

// ...

// 设置全局变量分辨率
gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
```

显然我们需要告诉 WebGL 要运行六次顶点着色器来画两个三角形。所以我们将 count 改成 6。

```js
// 绘制
var primitiveType = gl.TRIANGLES;
var offset = 0;
var count = 6;
gl.drawArrays(primitiveType, offset, count);
```

<iframe src="/examples/webgl-fundamental-base-concept/draw-two-triangle.html" width="400" height="100"></iframe>

`embed:webgl-fundamental-base-concept/draw-two-triangle.html`

你可能注意到矩形在区域左下角，WebGL 认为左下角是 0，0。想要像传统二维 API 那样起点在左上角，我们只需翻转 y 轴即可。

```glsl
gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
```

现在矩形在我们期望的位置了

<iframe src="/examples/webgl-fundamental-base-concept/draw-two-triangle-revert.html" width="400" height="100"></iframe>

`embed:webgl-fundamental-base-concept/draw-two-triangle-revert.html`

让我们来定义一个可以生成矩形的方法，这样我们就可以调用它定义形状不一的多个矩形。同时我们需要矩形的颜色是可设置的。

首先我们定义一个片断着色器，可以通过全局变量接收自定义颜色。

```html
<script id="fragment-shader-2d" type="notjs">
  precision mediump float;

  uniform vec4 u_color;

  void main() {
    gl_FragColor = u_color;
  }
</script>
```

这里是一段新代码，可以随机绘制 50 个随机位置，随机大小，随机颜色的矩形。

```js
var colorUniformLocation = gl.getUniformLocation(program, 'u_color');
{
  // ...
  // 绘制 50 个随机颜色矩形
  for (var ii = 0; ii < 50; ++ii) {
    // 创建一个随机矩形并将写入位置缓冲
    // 因为位置缓冲是我们绑定在 ARRAY_BUFFER 绑定点上的最后一个缓冲
    setRectangle(gl, randomInt(300), randomInt(300), randomInt(300), randomInt(300));

    // 设置一个随机颜色
    gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);

    // 绘制矩形
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}

// 返回 0 到 range 范围内的随机整数
function randomInt(range) {
  return Math.floor(Math.random() * range);
}

// 用参数生成矩形顶点并写进缓冲
function setRectangle(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;

  // 注意: gl.bufferData(gl.ARRAY_BUFFER, ...) 将会影响到当前绑定点 ARRAY_BUFFER 的绑定缓冲
  // 目前我们只有一个缓冲，如果我们有多个缓冲，我们需要先将所需缓冲绑定到 ARRAY_BUFFER
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]), gl.STATIC_DRAW);
}
```

这里是 50 个矩形。

<iframe src="/examples/webgl-fundamental-base-concept/draw-many-triangle.html" width="400" height="100"></iframe>

`embed:webgl-fundamental-base-concept/draw-many-triangle.html`

WebGL 其实是一个非常简单的 API。好吧，“简单”可能是一个不恰当的描述。它做的是一件简单的事，它仅仅运行用户提供的两个方法，一个顶点着色器和一个片断着色器，去绘制点，线和三角形。虽然做三维可以变得很复杂，但是这种复杂只是作为程序员的你，是一种复杂形式的“着色器”。WebGL API 只做光栅化处理并且在概念上十分容易理解。

我们简单的示例向你展示了怎么给属性和两个全局变量提供数据。它和多个属性以及多个全局变量的原理一致。在这篇文章的开始部分，我们还提到了 varyings（可变量）和 textures（纹理），这些将会在随后的课程中出现。

上例中用 setRectangle 更新缓冲数据的方式在大多数程序中并不常见。我这么用只是因为在这个例子中，为了解释 GLSL 接收像素坐标并通过少量数学运算得到期望结果，这可能是最简单的方式，不是常规做法。

# 工作原理

在继续学习之前，我们需要探讨一下 WebGL 在 GPU 上究竟做了什么。WebGL 在 GPU 上的工作基本上分为两部分，第一部分是将顶点（或数据流）转换到裁剪空间坐标，第二部分是基于第一部分的结果绘制像素点。

```js
var primitiveType = gl.TRIANGLES;
var offset = 0;
var count = 9;
gl.drawArrays(primitiveType, offset, count);
```

这里的 9 表示“处理 9 个顶点”，所以将会有 9 个顶点被转换。

![](res/vertex-shader-anim.gif)

左侧是你提供的数据。顶点着色器（Vertex Shader）是你写进 GLSL 中的一个方法，每个顶点调用一次，在这个方法中做一些数学运算后设置了一个特殊的 gl_Position 变量，这个变量就是该顶点转换到裁剪空间中的坐标值，GPU 接收该值并将其保存起来。

假设你正在画三角形，顶点着色器每完成三次顶点处理，WebGL 就会用这三个顶点画一个三角形。它计算出这三个顶点对应的像素后，就会光栅化这个三角形，“光栅化”其实就是“用像素画出来”的花哨叫法。对于每一个像素，它会调用你的片断着色器询问你使用什么颜色。你通过给片断着色器的一个特殊变量 gl_FragColor 设置一个颜色值，实现自定义像素颜色。

使用它们可以做出非常有趣的东西，但如你所见，到目前为止的例子中，处理每个像素时片断着色器可用信息很少，幸运的是我们可以给它传递更多信息。想要从顶点着色器传值到片断着色器，我们可以定义“可变量（varyings）”。

一个简单的例子，将顶点着色器计算出的裁剪空间坐标从顶点着色器传递到片断着色器。

我们来画一个简单的三角形，从之前的例子继续，让我们把矩形改成三角形。

```js
// 定义一个三角形填充到缓冲里
function setGeometry(gl) {
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, -100, 150, 125, -175, 100]), gl.STATIC_DRAW);
}
```

我们只需要画三个顶点

```js
// 绘制场景
function drawScene() {
  // ...
  // 绘制几何体
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 3;
  gl.drawArrays(primitiveType, offset, count);
}
```

然后在我们的顶点着色器中定义一个 varying（可变量）用来给片断着色器传值。

```glsl{10}
varying vec4 v_color;
// ...
void main() {
  // 将位置和矩阵相乘
  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);

  // 从裁减空间转换到颜色空间
  // 裁减空间范围 -1.0 到 +1.0
  // 颜色空间范围 0.0 到 1.0
  v_color = gl_Position * 0.5 + 0.5;
}
```

在片断着色器中定义同名 varying 变量。

```glsl{3,6}
precision mediump float;

varying vec4 v_color;

void main() {
  gl_FragColor = v_color;
}
```

WebGL 会将同名的可变量从顶点着色器输入到片断着色器中。

下面是运行结果

<iframe src="https://codesandbox.io/embed/7xbtl?codemirror=1&hidenavigation=1&theme=light&view=split" class="embedded-codesandbox" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

<!-- [draw-colorful-triangle](embedded-codesandbox://webgl-fundamental-base-concept/draw-colorful-triangle) -->

当你移动、缩放、旋转三角形时，发现颜色随位置变化，不跟着三角形移动。

回想一下，我们只计算了三个顶点，调用了三次顶点着色器，所以也只计算出了三个颜色值，但是我们的三角形却有很多颜色，这就是称之为可变量的 varying 的原因啦！

WebGL 先获得顶点着色器中计算的三个颜色值，在光栅化三角形时将会根据这三个值进行插值。 每一个像素在调用片断着色器时，可变量的值是与之对应的插值。

让我们从上例的三个顶点开始分析

<table>
   <tbody>
      <tr>
         <th colspan="2">顶点</th>
      </tr>
      <tr>
         <td>0</td>
         <td>-100</td>
      </tr>
      <tr>
         <td>150</td>
         <td>125</td>
      </tr>
      <tr>
         <td>-175</td>
         <td>100</td>
      </tr>
   </tbody>
</table>

我们的给顶点着色器施加了一个包含平移，旋转和缩放的的矩阵，并将结果转换到裁剪空间。默认平移，旋转和缩放值为：平移 = 200, 150，旋转 = 0，缩放 = 1，所以这里只进行了平移。画布大小（背景缓冲）为 400×300，所以三个顶点在裁剪空间中为以下坐标值。

<table>
   <tbody>
      <tr>
         <th colspan="2">写入 gl_Position 的值</th>
      </tr>
      <tr>
         <td>0.000</td>
         <td>0.660</td>
      </tr>
      <tr>
         <td>0.750</td>
         <td>-0.830</td>
      </tr>
      <tr>
         <td>-0.875</td>
         <td>-0.660</td>
      </tr>
   </tbody>
</table>

同时将这些值转换到颜色空间中赋给我们定义的可变量 v_color。

<table>
   <tbody>
      <tr>
         <th colspan="3">写入 v_color 的值</th>
      </tr>
      <tr>
         <td>0.5000</td>
         <td>0.830</td>
         <td>0.5</td>
      </tr>
      <tr>
         <td>0.8750</td>
         <td>0.086</td>
         <td>0.5</td>
      </tr>
      <tr>
         <td>0.0625</td>
         <td>0.170</td>
         <td>0.5</td>
      </tr>
   </tbody>
</table>

利用这三个值进行插值后传进每个像素运行的片断着色器中。

<iframe src="https://codesandbox.io/embed/zi15x?codemirror=1&hidenavigation=1&theme=light&view=preview" class="embedded-codesandbox" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

<!-- [fragment-shader-anim](embedded-codesandbox://webgl-fundamental-base-concept/fragment-shader-anim?view=preview) -->

想要给片断着色器传值，我们可以先把值传递给顶点着色器然后再传给片断着色器。让我们来画一个由两个不同颜色三角形组成的矩形。我们需要给顶点着色器添加一个属性值，把值通过属性传递给它后它再直接传递给片断着色器。

```glsl{2,8}
attribute vec2 a_position;
attribute vec4 a_color;
// ...
varying vec4 v_color;

void main() {
  // 直接把属性值中的数据赋给可变量
  v_color = a_color;
}
```

现在要给 WebGL 提供要用的颜色。

```js{3,5-9,12-29}
// 寻找顶点着色器中需要的数据
var positionLocation = gl.getAttribLocation(program, 'a_position');
var colorLocation = gl.getAttribLocation(program, 'a_color');
// ..
// 给颜色数据创建一个缓冲
var colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
// 设置颜色
setColors(gl);
// ..

// 给矩形的两个三角形
// 设置颜色值并发到缓冲
function setColors(gl) {
  // 生成两个随机颜色
  var r1 = Math.random();
  var b1 = Math.random();
  var g1 = Math.random();

  var r2 = Math.random();
  var b2 = Math.random();
  var g2 = Math.random();

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([r1, b1, g1, 1, r1, b1, g1, 1, r1, b1, g1, 1, r2, b2, g2, 1, r2, b2, g2, 1, r2, b2, g2, 1]),
    gl.STATIC_DRAW
  );
}
```

在渲染的时候设置颜色属性

```js
gl.enableVertexAttribArray(colorLocation);

// 绑定颜色缓冲
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

// 告诉颜色属性怎么从 colorBuffer (ARRAY_BUFFER) 中读取颜色值
var size = 4; // 每次迭代使用4个单位的数据
var type = gl.FLOAT; // 单位数据类型是32位的浮点型
var normalize = false; // 不需要归一化数据
var stride = 0; // 0 = 移动距离 * 单位距离长度sizeof(type)

// 每次迭代跳多少距离到下一个数据
var offset = 0; // 从绑定缓冲的起始处开始
gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset);
```

调整顶点的数量为 6 用来画两个三角形

```js{4}
// 画几何体
var primitiveType = gl.TRIANGLES;
var offset = 0;
var count = 6;
gl.drawArrays(primitiveType, offset, count);
```

<iframe src="https://codesandbox.io/embed/fi4uh?codemirror=1&hidenavigation=1&theme=light&view=split" class="embedded-codesandbox" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

<!-- [webgl-2d-rectangle-with-2-colors](embedded-codesandbox://webgl-fundamental-base-concept/webgl-2d-rectangle-with-2-colors) -->

你可能注意到这两个三角形是纯色的。我们传递给每个三角形的顶点的颜色值是相同的，所以我们传递的 varying 会被插值成相同的颜色，如果我们传递不同的颜色，就会看到插值的颜色。

```js{8-31}
// 给矩形的两个三角形
// 设置颜色值并发到缓冲
function setColors(gl) {
  // 给每个顶点定义不同的颜色
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      Math.random(),
      Math.random(),
      Math.random(),
      1,
      Math.random(),
      Math.random(),
      Math.random(),
      1,
      Math.random(),
      Math.random(),
      Math.random(),
      1,
      Math.random(),
      Math.random(),
      Math.random(),
      1,
      Math.random(),
      Math.random(),
      Math.random(),
      1,
      Math.random(),
      Math.random(),
      Math.random(),
      1
    ]),
    gl.STATIC_DRAW
  );
}
```

现在看到的是插值的 varying

<iframe src="https://codesandbox.io/embed/5ohcj?codemirror=1&hidenavigation=1&theme=light&view=split" class="embedded-codesandbox" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

<!--
[webgl-2d-rectangle-with-random-colors](embedded-codesandbox://webgl-fundamental-base-concept/webgl-2d-rectangle-with-random-colors) -->

上例还演示了使用多个属性并且通过顶点着色器向片断着色器传值。如果你看了处理图片的例子，那里面还用了另外一个属性传递纹理坐标。

## 关于 buffer 和 attribute 的代码是干什么的？

缓冲操作是在 GPU 上获取顶点和其他顶点数据的一种方式。gl.createBuffer 创建一个缓冲；gl.bindBuffer 是设置缓冲为当前使用缓冲；gl.bufferData 将数据拷贝到缓冲，这个操作一般在初始化完成。

一旦数据存到缓冲中，还需要告诉 WebGL 怎么从缓冲中提取数据传给顶点着色器的属性。

要做这些，首先需要获取 WebGL 给属性分配的地址，如下方代码所示

```js
// 询问顶点数据应该放在哪里
var positionLocation = gl.getAttribLocation(program, 'a_position');
var colorLocation = gl.getAttribLocation(program, 'a_color');
```

这一步一般也是在初始化部分完成。

一旦知道了属性的地址，在绘制前还需要发出三个命令。

```js
gl.enableVertexAttribArray(location); // 这个命令是告诉 WebGL 我们想从缓冲中提供数据。
gl.bindBuffer(gl.ARRAY_BUFFER, someBuffer); // 这个命令是将缓冲绑定到 ARRAY_BUFFER 绑定点，它是 WebGL 内部的一个全局变量。
gl.vertexAttribPointer(location, numComponents, typeOfData, normalizeFlag, strideToNextPieceOfData, offsetIntoBuffer);
```

最后一条命令告诉 WebGL 从 `ARRAY_BUFFER` 绑定点当前绑定的缓冲获取数据。每个顶点有几个单位的数据(1 - 4)，单位数据类型是什么(BYTE, FLOAT, INT, `UNSIGNED_SHORT`, 等等...)，stride 是从一个数据到下一个数据要跳过多少位，最后是数据在缓冲的什么位置。

单位个数永远是 1 到 4 之间。

如果每个类型的数据都用一个缓冲存储，stride 和 offset 都是 0。对 stride 来说 0 表示 “用符合单位类型和单位个数的大小”。对 offset 来说 0 表示从缓冲起始位置开始读取。它们使用 0 以外的值时会复杂得多，虽然这样会取得一些性能能上的优势，但是一般情况下并不值得，除非你想充分压榨 WebGL 的性能。

## vertexAttribPointer 中的 normalizeFlag 参数是什么意思？

标准化标记（normalizeFlag）适用于所有非浮点型数据。如果传递 false 就解读原数据类型。 BYTE 类型的范围是从 -128 到 127，UNSIGNED_BYTE 类型的范围是从 0 到 255， SHORT 类型的范围是从 -32768 到 32767，等等...

如果标准化标记设为 true，BYTE 数据的值(-128 to 127)将会转换到 -1.0 到 +1.0 之间， UNSIGNED_BYTE (0 to 255) 变为 0.0 到 +1.0 之间，SHORT 也是转换到 -1.0 到 +1.0 之间， 但比 BYTE 精确度高。

最常用的是标准化颜色数据。大多数情况颜色值范围为 0.0 到 +1.0。 使用 4 个浮点型数据存储红，绿，蓝和阿尔法通道数据时，每个顶点的颜色将会占用 16 字节空间， 如果你有复杂的几何体将会占用很多内存。代替的做法是将颜色数据转换为四个 UNSIGNED_BYTE ， 其中 0 表示 0.0，255 表示 1.0。现在每个顶点只需要四个字节存储颜色值，省了 75% 空间。

我们来修改之前代码实现。当我们告诉 WebGL 如何获取颜色数据时将这样

```js{3-4}
// 告诉颜色属性如何从 colorBuffer 中提取数据 (ARRAY_BUFFER)
var size = 4; // 每次迭代使用四个单位数据
var type = gl.UNSIGNED_BYTE; // 数据类型是 8 位的 UNSIGNED_BYTE 类型。
var normalize = true; // 标准化数据
var stride = 0; // 0 = 移动距离 * 单位距离长度 sizeof(type)
// 每次迭代跳多少距离到下一个数据
var offset = 0; // 从缓冲的起始处开始
gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset);
```

如下向缓冲添加数据

```js
// 给矩形的两个三角形
// 设置颜色值并发到缓冲
function setColors(gl) {
  // 设置两个随机颜色
  var r1 = Math.random() * 256; // 0 到 255.99999 之间
  var b1 = Math.random() * 256; // 这些数据
  var g1 = Math.random() * 256; // 在存入缓冲时
  var r2 = Math.random() * 256; // 将被截取成
  var b2 = Math.random() * 256; // Uint8Array 类型
  var g2 = Math.random() * 256;

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Uint8Array([
      // Uint8Array
      r1,
      b1,
      g1,
      255,
      r1,
      b1,
      g1,
      255,
      r1,
      b1,
      g1,
      255,
      r2,
      b2,
      g2,
      255,
      r2,
      b2,
      g2,
      255,
      r2,
      b2,
      g2,
      255
    ]),
    gl.STATIC_DRAW
  );
}
```

<iframe src="https://codesandbox.io/embed/x51g6?codemirror=1&hidenavigation=1&theme=light&view=split" class="embedded-codesandbox" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

<!-- [webgl-2d-rectangle-with-2-byte-colors](embedded-codesandbox://webgl-fundamental-base-concept/webgl-2d-rectangle-with-2-byte-colors) -->

# WebGL 着色器和 GLSL

我们之前提到过着色器和 GLSL，但是没有涉及细节，你可能已经对此有所了解，但以防万一，这里将详细讲解着色器和 GLSL。

在工作原理中我们提到，WebGL 每次绘制需要两个着色器，一个顶点着色器和一个片断着色器，每一个着色器都是一个方法。一个顶点着色器和一个片断着色器链接在一起放入一个着色程序中（或者只叫程序）。一个典型的 WebGL 应用会有多个着色程序。

## 顶点着色器

一个顶点着色器的工作是生成裁剪空间坐标值，通常是以下的形式

```glsl
void main() {
   gl_Position = doMathToMakeClipspaceCoordinates
}
```

每个顶点调用一次（顶点）着色器，每次调用都需要设置一个特殊的全局变量 gl_Position， 该变量的值就是裁减空间坐标值。

顶点着色器需要的数据，可以通过以下三种方式获得

1. Attributes 属性 (从缓冲中获取的数据)
2. Uniforms 全局变量 (在一次绘制中对所有顶点保持一致值)
3. Textures 纹理 (从像素或纹理元素中获取的数据)

### Attributes 属性

最常用的方法是缓冲和属性，在工作原理中讲到了缓冲和属性，你可以创建缓冲

```js
var buf = gl.createBuffer();
```

将数据存入缓冲

```js
gl.bindBuffer(gl.ARRAY_BUFFER, buf);
gl.bufferData(gl.ARRAY_BUFFER, someData, gl.STATIC_DRAW);
```

然后初始化的时候，在你制作的（着色）程序中找到属性所在地址

```js
var positionLoc = gl.getAttribLocation(someShaderProgram, 'a_position');
```

在渲染的时候告诉 WebGL 怎么从缓冲中获取数据传递给属性

```js
// 开启从缓冲中获取数据
gl.enableVertexAttribArray(positionLoc);

var numComponents = 3; // (x, y, z)
var type = gl.FLOAT; // 32 位浮点数据
var normalize = false; // 不标准化
var offset = 0; // 从缓冲起始位置开始获取
var stride = 0; // 到下一个数据跳多少位内存
// 0 = 使用当前的单位个数和单位长度（3 * Float32Array.BYTES_PER_ELEMENT）

gl.vertexAttribPointer(positionLoc, numComponents, type, false, stride, offset);
```

在 `WebGL 基础概念` 中示范了不做任何运算直接将数据传递给 `gl_Position`。

```glsl
attribute vec4 a_position;

void main() {
   gl_Position = a_position;
}
```

如果缓冲中存的是裁剪空间坐标就没什么问题。

属性可以用 float, vec2, vec3, vec4, mat2, mat3 和 mat4 数据类型。

### Uniforms 全局变量

全局变量在一次绘制过程中传递给着色器的值都一样，在下面的一个简单的例子中，用全局变量给顶点着色器添加了一个偏移量

```glsl
attribute vec4 a_position;
uniform vec4 u_offset;

void main() {
   gl_Position = a_position + u_offset;
}
```

现在可以把所有顶点偏移一个固定值，首先在初始化时找到全局变量的地址

```js
var offsetLoc = gl.getUniformLocation(someProgram, 'u_offset');
```

然后在绘制前设置全局变量

```js
gl.uniform4fv(offsetLoc, [1, 0, 0, 0]); // 向右偏移一半屏幕宽度
```

要注意的是全局变量属于单个着色程序，如果多个着色程序有同名全局变量，需要找到每个全局变量并设置自己的值。 我们调用 `gl.uniform???` 的时候只是设置了当前程序的全局变量，当前程序是传递给 `gl.useProgram` 的最后一个程序。

全局变量有很多类型，对应的类型有对应的设置方法。

```js
gl.uniform1f(floatUniformLoc, v);                 // float
gl.uniform1fv(floatUniformLoc, [v]);              // float 或 float array
gl.uniform2f(vec2UniformLoc, v0, v1);             // vec2
gl.uniform2fv(vec2UniformLoc, [v0, v1]);          // vec2 或 vec2 array
gl.uniform3f(vec3UniformLoc, v0, v1, v2);         // vec3
gl.uniform3fv(vec3UniformLoc, [v0, v1, v2]);      // vec3 或 vec3 array
gl.uniform4f(vec4UniformLoc, v0, v1, v2, v4);     // vec4
gl.uniform4fv(vec4UniformLoc, [v0, v1, v2, v4]);  // vec4 或 vec4 array

gl.uniformMatrix2fv(mat2UniformLoc, false, [4x element array])    // mat2 或 mat2 array
gl.uniformMatrix3fv(mat3UniformLoc, false, [9x element array])    // mat3 或 mat3 array
gl.uniformMatrix4fv(mat4UniformLoc, false, [16x element array])   // mat4 或 mat4 array

gl.uniform1i(intUniformLoc, v);                   // int
gl.uniform1iv(intUniformLoc, [v]);                // int 或 int array
gl.uniform2i(ivec2UniformLoc, v0, v1);            // ivec2
gl.uniform2iv(ivec2UniformLoc, [v0, v1]);         // ivec2 或 ivec2 array
gl.uniform3i(ivec3UniformLoc, v0, v1, v2);        // ivec3
gl.uniform3iv(ivec3UniformLoc, [v0, v1, v2]);     // ivec3 or ivec3 array
gl.uniform4i(ivec4UniformLoc, v0, v1, v2, v4);    // ivec4
gl.uniform4iv(ivec4UniformLoc, [v0, v1, v2, v4]); // ivec4 或 ivec4 array

gl.uniform1i(sampler2DUniformLoc, v);             // sampler2D (textures)
gl.uniform1iv(sampler2DUniformLoc, [v]);          // sampler2D 或 sampler2D array

gl.uniform1i(samplerCubeUniformLoc, v);           // samplerCube (textures)
gl.uniform1iv(samplerCubeUniformLoc, [v]);        // samplerCube 或 samplerCube array
```

还有一些类型 bool, bvec2, bvec3, bvec4。它们可用 `gl.uniform?f?` 或 `gl.uniform?i?`。

一个数组可以一次设置所有的全局变量，例如

```js
// 着色器里
uniform vec2 u_someVec2[3];

// JavaScript 初始化时
var someVec2Loc = gl.getUniformLocation(someProgram, "u_someVec2");

// 渲染的时候
gl.uniform2fv(someVec2Loc, [1, 2, 3, 4, 5, 6]);  // 设置数组 u_someVec2
```

如果你想单独设置数组中的某个值，就要单独找到该值的地址。

```js
// JavaScript 初始化时
var someVec2Element0Loc = gl.getUniformLocation(someProgram, 'u_someVec2[0]');
var someVec2Element1Loc = gl.getUniformLocation(someProgram, 'u_someVec2[1]');
var someVec2Element2Loc = gl.getUniformLocation(someProgram, 'u_someVec2[2]');

// 渲染的时候
gl.uniform2fv(someVec2Element0Loc, [1, 2]); // set element 0
gl.uniform2fv(someVec2Element1Loc, [3, 4]); // set element 1
gl.uniform2fv(someVec2Element2Loc, [5, 6]); // set element 2
```

同样的，如果你创建了一个结构体

```glsl
struct SomeStruct {
  bool active;
  vec2 someVec2;
};

uniform SomeStruct u_someThing;
```

你需要找到每个元素的地址

```js
var someThingActiveLoc = gl.getUniformLocation(someProgram, 'u_someThing.active');
var someThingSomeVec2Loc = gl.getUniformLocation(someProgram, 'u_someThing.someVec2');
```

### 纹理（顶点着色器中）

同 Textures 纹理（在片断着色器中）。

## 片断着色器

一个片断着色器的工作是为当前光栅化的像素提供颜色值，通常是以下的形式

```glsl
precision mediump float;

void main() {
   gl_FragColor = doMathToMakeAColor;
}
```

每个像素都将调用一次片断着色器，每次调用需要从你设置的特殊全局变量 gl_FragColor 中获取颜色信息。

片断着色器所需的数据，可以通过以下三种方式获取

1. Uniforms 全局变量 (values that stay the same for every pixel of a single draw call)
2. Textures 纹理 (data from pixels/texels)
3. Varyings 可变量 (data passed from the vertex shader and interpolated)

### Uniform 全局变量（片断着色器中）

同 Uniforms 全局变量

### Textures 纹理（片断着色器中）

在着色器中获取纹理信息，可以先创建一个 sampler2D 类型全局变量，然后用 GLSL 方法 texture2D 从纹理中提取信息。

```glsl
precision mediump float;

uniform sampler2D u_texture;

void main() {
   vec2 texcoord = vec2(0.5, 0.5)  // 获取纹理中心的值
   gl_FragColor = texture2D(u_texture, texcoord);
}
```

从纹理中获取的数据取决于很多设置，至少要创建并给纹理填充数据，例如

```js
var tex = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, tex);
var level = 0;
var width = 2;
var height = 1;
var data = new Uint8Array([
  255,
  0,
  0,
  255, // 一个红色的像素
  0,
  255,
  0,
  255 // 一个绿色的像素
]);
gl.texImage2D(gl.TEXTURE_2D, level, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
```

在初始化时找到全局变量的地址

```js
var someSamplerLoc = gl.getUniformLocation(someProgram, 'u_texture');
```

在渲染的时候 WebGL 要求纹理必须绑定到一个纹理单元上

```js
var unit = 5; // 挑选一个纹理单元
gl.activeTexture(gl.TEXTURE0 + unit);
gl.bindTexture(gl.TEXTURE_2D, tex);
```

然后告诉着色器你要使用的纹理在那个纹理单元

```js
gl.uniform1i(someSamplerLoc, unit);
```

### Varyings 可变量

在工作原理提到过，可变量是一种顶点着色器给片断着色器传值的方式。

为了使用可变量，要在两个着色器中定义同名的可变量。给顶点着色器中可变量设置的值，会作为参考值进行内插，在绘制像素时传给片断着色器的可变量。

顶点着色器

```glsl
attribute vec4 a_position;

uniform vec4 u_offset;

varying vec4 v_positionWithOffset;

void main() {
  gl_Position = a_position + u_offset;
  v_positionWithOffset = a_position + u_offset;
}
```

片断着色器

```glsl
precision mediump float;

varying vec4 v_positionWithOffset;

void main() {
  // 从裁剪空间 (-1 <-> +1) 转换到颜色空间 (0 -> 1).
  vec4 color = v_positionWithOffset * 0.5 + 0.5
  gl_FragColor = color;
}
```

上方的示例几乎没有意义，通常情况下直接将裁剪空间的值传给片断着色器当作颜色值是没有意义的，虽然它可以运行并且可以生成颜色值。

## GLSL

GLSL 全称是 Graphics Library Shader Language（图形库着色器语言），是着色器使用的语言。它有一些不同于 JavaScript 的特性，主要目的是为栅格化图形提供常用的计算功能。所以它内建的数据类型例如 vec2, vec3 和 vec4 分别代表两个值，三个值和四个值，类似的还有 mat2, mat3 和 mat4 分别代表 2x2, 3x3 和 4x4 矩阵。你可以做一些运算例如常量和矢量的乘法。

```glsl
vec4 a = vec4(1, 2, 3, 4);
vec4 b = a * 2.0;
// b 现在是 vec4(2, 4, 6, 8);
```

它同样可以做矩阵乘法以及矢量和矩阵的乘法

```glsl
mat4 a = ???
mat4 b = ???
mat4 c = a * b;

vec4 v = ???
vec4 y = c * v;
```

他还为矢量数据提供多种分量选择器，例如 vec4

```glsl
vec4 v;
```

- v.x 和 v.s 以及 v.r ， `v[0]` 表达的是同一个分量。
- v.y 和 v.t 以及 v.g ， `v[1]` 表达的是同一个分量。
- v.z 和 v.p 以及 v.b ， `v[2]` 表达的是同一个分量。
- v.w 和 v.q 以及 v.a ， `v[3]` 表达的是同一个分量。

它还支持矢量调制，意味者你可以交换或重复分量。

```glsl
v.yyyy
```

和

```glsl
vec4(v.y, v.y, v.y, v.y)
```

是一样的。同样的

```glsl
v.bgra
```

和

```glsl
vec4(v.b, v.g, v.r, v.a)
```

等价。当构造一个矢量或矩阵时可以一次提供多个分量，例如

```glsl
vec4(v.rgb, 1)
```

和

```glsl
vec4(v.r, v.g, v.b, 1)
```

是一样的。同样

```glsl
vec4(1)
```

和

```glsl
vec4(1, 1, 1, 1)
```

相同。值得注意的是 GLSL 是一个强类型的语言。

```glsl
float f = 1;  // 错误，1 是 int 类型，不能将 int 型赋值给 float
```

正确的方式是

```glsl
float f = 1.0;      // 使用 float
float f = float(1)  // 转换 integer 为 float
```

上例中 `vec4(v.rgb, 1)` 不会因为 1 报错，因为 vec4 内部进行了转换类似 `float(1)` 。

GLSL 有一系列内置方法，其中大多数运算支持多种数据类型，并且一次可以运算多个分量，例如

```glsl
T sin(T angle)
```

T 可以是 float, vec2, vec3 或 vec4。如果你传的是 vec4 返回的也是 vec4, 返回结果对应每个分量的正弦值。换句话说如果 v 是 vec4 类型。那么

```glsl
vec4 s = sin(v);
```

和

```glsl
vec4 s = vec4(sin(v.x), sin(v.y), sin(v.z), sin(v.w));
```

是一样的。有时一个参数是浮点型而剩下的都是 T，意思是那个浮点数据会作为所有其他参数的一个新分量。例如如果 v1 和 v2 是 vec4 同时 f 是浮点型，那么

```glsl
vec4 m = mix(v1, v2, f);
```

和

```glsl
vec4 m = vec4(
  mix(v1.x, v2.x, f),
  mix(v1.y, v2.y, f),
  mix(v1.z, v2.z, f),
  mix(v1.w, v2.w, f));
```

等价。你可以在 [WebGL 引用表](https://www.khronos.org/files/webgl/webgl-reference-card-1_0.pdf) 最后一页看到所有 GLSL 方法的列表。如果你喜欢干货以更详细的东西你可以看看 [GLSL 规范](https://www.khronos.org/files/opengles_shading_language.pdf)。

## 总结

这是当前系列文章的重点。WebGL 的全部内容就是创建不同的着色器，向着色器提供数据然后调用 gl.drawArrays 或 gl.drawElements 让 WebGL 调用当前顶点着色器处理每个顶点，调用当前片断着色器渲染每个像素。

实际上创建着色器需要为数不多的几行代码，并且在大多数 WebGL 应用程序中都相似， 因此一旦写完几乎可以不再关心它们了。

# WebGL State Diagram

<iframe src="https://codesandbox.io/embed/8gqf5w?codemirror=1&hidenavigation=1&theme=light&view=preview" class="embedded-codesandbox" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

<!-- [webgl-state-diagram](embedded-codesandbox://webgl-fundamental-base-concept/webgl-state-diagram) -->
