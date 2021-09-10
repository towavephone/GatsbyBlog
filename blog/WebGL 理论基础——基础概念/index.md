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

```cpp
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

```cpp
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

```cpp
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

```js
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

```cpp
precision mediump float;

varying vec4 v_color;

void main() {
  gl_FragColor = v_color;
}
```

WebGL 会将同名的可变量从顶点着色器输入到片断着色器中。

下面是运行结果。

// TODO https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-how-it-works.html
