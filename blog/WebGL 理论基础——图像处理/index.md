---
title: WebGL 理论基础——图像处理
date: 2022-04-29 11:05:21
categories:
  - 前端
tags: 前端, 可视化, WebGL, 读书笔记
path: /webgl-fundamental-image-processing/
---

# WebGL 图像处理

在 WebGL 中绘制图片需要使用纹理。和 WebGL 渲染时需要裁剪空间坐标相似，渲染纹理时需要纹理坐标，而不是像素坐标。无论纹理是什么尺寸，纹理坐标范围始终是 0.0 到 1.0 。

因为我们只用画一个矩形（其实是两个三角形），所以需要告诉 WebGL 矩形中每个顶点对应的纹理坐标。我们将使用一种特殊的叫做 varying 的变量将纹理坐标从顶点着色器传到片断着色器，它叫做“可变量” 是因为它的值有很多个，WebGL 会用顶点着色器中值的进行插值，然后传给对应像素执行的片断着色器。

接着用顶点着色器，我们需要添加一个属性，用它接收纹理坐标然后传给片断着色器。

```cpp
attribute vec2 a_texCoord;
// ...
varying vec2 v_texCoord;

void main() {
   // ...
   // 将纹理坐标传给片断着色器
   // GPU 会在点之间进行插值
   v_texCoord = a_texCoord;
}
```

然后用片断着色器寻找纹理上对应的颜色

```js
<script id="fragment-shader-2d" type="x-shader/x-fragment">
   precision mediump float;

   // 纹理
   uniform sampler2D u_image;

   // 从顶点着色器传入的纹理坐标
   varying vec2 v_texCoord;

   void main() {
      // 在纹理上寻找对应颜色值
      gl_FragColor = texture2D(u_image, v_texCoord);
   }
</script>
```

最后我们需要加载一个图像，创建一个纹理然后将图像复制到纹理中。由于浏览器中的图片是异步加载的，所以我们需要重新组织一下代码，等待纹理加载，一旦加载完成就开始绘制。

```js
function main() {
  var image = new Image();
  image.src = 'http://someimage/on/our/server'; // 必须在同一域名下
  image.onload = function() {
    render(image);
  };
}

function render(image) {
  // ...
  // 之前的代码
  // ...
  // 找到纹理的地址
  var texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');

  // 给矩形提供纹理坐标
  var texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]),
    gl.STATIC_DRAW
  );
  gl.enableVertexAttribArray(texCoordLocation);
  gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

  // 创建纹理
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // 设置参数，让我们可以绘制任何尺寸的图像
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  // 将图像上传到纹理
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  // ...
}
```

这是 WebGL 绘制的图像。注意：如果你想在本地运行，需要使用一个简单的 web 服务，使得 WebGL 可以加载本地图片。

[webgl-2d-image](embedded-codesandbox://webgl-fundamental-image-processing/webgl-2d-image?view=preview)

这个图片没什么特别的，让我们来对它进行一些操作。把红和蓝调换位置如何？

```cpp
// ...
gl_FragColor = texture2D(u_image, v_texCoord).bgra;
// ...
```

现在红色和蓝色调换位置了。

[webgl-2d-image-red2blue](embedded-codesandbox://webgl-fundamental-image-processing/webgl-2d-image-red2blue?view=preview)

如果我们的图像处理需要其他像素的颜色值怎么办？由于 WebGL 的纹理坐标范围是 0.0 到 1.0，那我们可以简单计算出移动一个像素对应的距离，onePixel = 1.0 / textureSize。

这个片断着色器将每个像素的值设置为与左右像素的均值。

```js
<script id="fragment-shader-2d" type="x-shader/x-fragment">
   precision mediump float;

   // 纹理
   uniform sampler2D u_image;
   uniform vec2 u_textureSize;

   // 从顶点着色器传入的像素坐标
   varying vec2 v_texCoord;

   void main() {
      // 计算 1 像素对应的纹理坐标
      vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;

      // 对左中右像素求均值
      gl_FragColor = (
         texture2D(u_image, v_texCoord) +
         texture2D(u_image, v_texCoord + vec2(onePixel.x, 0.0)) +
         texture2D(u_image, v_texCoord + vec2(-onePixel.x, 0.0))
      ) / 3.0;
   }
</script>
```

我们需要在 JavaScript 中传入纹理的大小。

```js
// ...

var textureSizeLocation = gl.getUniformLocation(program, 'u_textureSize');

// ...

// 设置图像的大小
gl.uniform2f(textureSizeLocation, image.width, image.height);

// ...
```

可以和上方没有模糊处理的图片对比一下。

[webgl-2d-image-blend](embedded-codesandbox://webgl-fundamental-image-processing/webgl-2d-image-blend?view=preview)

知道了怎么获取像素值，现在我们来做一些图片处理常用的卷积内核。在这个例子中我们将使用 3×3 的内核，卷积内核就是一个 3×3 的矩阵，矩阵中的每一项代表当前处理的像素和周围 8 个像素的乘法因子，相乘后将结果加起来除以内核权重（内核中所有值的和或 1.0，取二者中较大者），这有一个不错的[相关文章](https://docs.gimp.org/2.6/en/plug-in-convmatrix.html)，这里是 C++ 实现的一些[具体代码](https://www.codeproject.com/KB/graphics/ImageConvolution.aspx)。

我们将在片断着色器中计算卷积，所以创建一个新的片断着色器。

```js
<script id="fragment-shader-2d" type="x-shader/x-fragment">
   precision mediump float;

   // 纹理
   uniform sampler2D u_image;
   uniform vec2 u_textureSize;
   uniform float u_kernel[9];
   uniform float u_kernelWeight;

   // 从顶点着色器传入的纹理坐标
   varying vec2 v_texCoord;

   void main() {
      vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;
      vec4 colorSum =
         texture2D(u_image, v_texCoord + onePixel * vec2(-1, -1)) * u_kernel[0] +
         texture2D(u_image, v_texCoord + onePixel * vec2(0, -1)) * u_kernel[1] +
         texture2D(u_image, v_texCoord + onePixel * vec2(1, -1)) * u_kernel[2] +
         texture2D(u_image, v_texCoord + onePixel * vec2(-1, 0)) * u_kernel[3] +
         texture2D(u_image, v_texCoord + onePixel * vec2(0, 0)) * u_kernel[4] +
         texture2D(u_image, v_texCoord + onePixel * vec2(1, 0)) * u_kernel[5] +
         texture2D(u_image, v_texCoord + onePixel * vec2(-1, 1)) * u_kernel[6] +
         texture2D(u_image, v_texCoord + onePixel * vec2(0, 1)) * u_kernel[7] +
         texture2D(u_image, v_texCoord + onePixel * vec2(1, 1)) * u_kernel[8];

      // 只把 rgb 值求和除以权重
      // 将阿尔法值设为 1.0
      gl_FragColor = vec4((colorSum / u_kernelWeight).rgb, 1.0);
   }
</script>
```

在 JavaScript 中我们需要提供卷积内核和它的权重

```js
function computeKernelWeight(kernel) {
  var weight = kernel.reduce(function(prev, curr) {
    return prev + curr;
  });
  return weight <= 0 ? 1 : weight;
}

// ...
var kernelLocation = gl.getUniformLocation(program, 'u_kernel[0]');
var kernelWeightLocation = gl.getUniformLocation(program, 'u_kernelWeight');
// ...
var edgeDetectKernel = [-1, -1, -1, -1, 8, -1, -1, -1, -1];

gl.uniform1fv(kernelLocation, edgeDetectKernel);
gl.uniform1f(kernelWeightLocation, computeKernelWeight(edgeDetectKernel));
// ...
```

看！可以用下拉菜单选择不同的卷积内核。

[webgl-2d-image-3x3-convolution](embedded-codesandbox://webgl-fundamental-image-processing/webgl-2d-image-3x3-convolution?view=preview)

## 为什么 u_image 没有设置还能正常运行？

全局变量默认为 0 所以 `u_image` 默认使用纹理单元 0。纹理单元 0 默认为当前活跃纹理，所以调用 bindTexture 会将纹理绑定到单元 0。

WebGL 有一个纹理单元队列，每个 sampler 全局变量的值对应着一个纹理单元，它会从对应的单元寻找纹理数据，你可以将纹理设置到你想用的纹理单元。

例如：

```js
var textureUnitIndex = 6; // 用单元 6
var u_imageLoc = gl.getUniformLocation(program, 'u_image');
gl.uniform1i(u_imageLoc, textureUnitIndex);
```

为了将纹理设置在不同的单元你可以调用 gl.activeTexture。 例如

```js
// 绑定纹理到单元 6
gl.activeTexture(gl.TEXTURE6);
gl.bindTexture(gl.TEXTURE_2D, someTexture);
```

这样也可以

```js
var textureUnitIndex = 6; // 使用纹理单元 6
// 绑定纹理到单元 6
gl.activeTexture(gl.TEXTURE0 + textureUnitIndex);
gl.bindTexture(gl.TEXTURE_2D, someTexture);
```

所有支持 WebGL 的环境，在片断着色器中至少有 8 个纹理单元，顶点着色器中可以是 0 个。所以如果你使用超过 8 个纹理单元就应该调用 `gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)` 查看单元个数，或者调用 `gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS)` 查看顶点着色器中可以用几个纹理单元。超过 99% 的机器在顶点着色器中至少有 4 个纹理单元。

## 在 GLSL 中为什么变量的前缀都是 `a_`, `u_` 或 `v_`？

那只是一个命名约定，不是强制要求的。但是对我来说可以轻松通过名字知道值从哪里来，`a_` 代表属性，值从缓冲中提供；`u_` 代表全局变量，直接对着色器设置；`v_` 代表可变量，是从顶点着色器的顶点中插值来出来的

# WebGL 进一步处理图像

图像处理的下一个问题是如何同时施加多种效果？

当然，你可以试着在运行时创建着色器，根据用户从交互界面选择的一些效果，创建一个可以全部实现的着色器。尽管有人用过[在运行时创建渲染效果](https://www.youtube.com/watch?v=cQUn0Zeh-0Q)，但是大部分情况下是不适合的。

一个更灵活的方式是使用 2 个或以上的纹理，然后交替渲染它们，像乒乓球一样每次渲染一种效果，传给另一个渲染下一个效果，如下所示。

```
原始图像    -> [模糊]     -> 纹理 1
纹理 1      -> [锐化]     -> 纹理 2
纹理 2      -> [边缘检测] -> 纹理 1
纹理 1      -> [模糊]     -> 纹理 2
纹理 2      -> [平滑]     -> 画布
```

这个操作需要使用帧缓冲来实现。在 WebGL 和 OpenGL 中，帧缓冲事实上是一个糟糕的名字。WebGL/OpenGL 中的帧缓冲只是一系列状态（一列附加物）不是任何形式的缓冲。但是当我们给帧缓冲绑定一个纹理后，可以将渲染结果写入那个纹理。

首先让我们把以前创建纹理的代码写到一个方法里

```js
function createAndSetupTexture(gl) {
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // 设置材质，这样我们可以对任意大小的图像进行像素操作
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  return texture;
}

// 创建一个纹理并写入图像
var originalImageTexture = createAndSetupTexture(gl);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
```

现在让我们用这个方法生成两个纹理并绑定到两个帧缓冲。

```js
// 创建两个纹理绑定到帧缓冲
var textures = [];
var framebuffers = [];
for (var ii = 0; ii < 2; ++ii) {
  var texture = createAndSetupTexture(gl);
  textures.push(texture);

  // 设置纹理大小和图像大小一致
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

  // 创建一个帧缓冲
  var fbo = gl.createFramebuffer();
  framebuffers.push(fbo);
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

  // 绑定纹理到帧缓冲
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
}
```

现在让我们做一些卷积核并按使用顺序存入列表中

```js
// 定义一些卷积核
var kernels = {
  normal: [0, 0, 0, 0, 1, 0, 0, 0, 0],
  gaussianBlur: [0.045, 0.122, 0.045, 0.122, 0.332, 0.122, 0.045, 0.122, 0.045],
  unsharpen: [-1, -1, -1, -1, 9, -1, -1, -1, -1],
  emboss: [-2, -1, 0, -1, 1, 1, 0, 1, 2]
};

// 将要使用的效果列表
var effectsToApply = ['gaussianBlur', 'emboss', 'gaussianBlur', 'unsharpen'];
```

最后让我们使用所有渲染效果，像乒乓一样来回渲染

```js
// 从原始图像开始
gl.bindTexture(gl.TEXTURE_2D, originalImageTexture);

// 在渲染效果时不翻转 y 轴
gl.uniform1f(flipYLocation, 1);

// 循环施加每一种渲染效果
for (var ii = 0; ii < effectsToApply.length; ++ii) {
  // 使用两个帧缓冲中的一个
  setFramebuffer(framebuffers[ii % 2], image.width, image.height);

  drawWithKernel(effectsToApply[ii]);

  // 下次绘制时使用刚才的渲染结果
  gl.bindTexture(gl.TEXTURE_2D, textures[ii % 2]);
}

// 最后将结果绘制到画布
gl.uniform1f(flipYLocation, -1); // 需要绕 y 轴翻转
setFramebuffer(null, canvas.width, canvas.height);
drawWithKernel('normal');

function setFramebuffer(fbo, width, height) {
  // 设定当前使用帧缓冲
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

  // 告诉着色器分辨率是多少
  gl.uniform2f(resolutionLocation, width, height);

  // 告诉 WebGL 帧缓冲需要的视图大小
  gl.viewport(0, 0, width, height);
}

function drawWithKernel(name) {
  // 设置卷积核
  gl.uniform1fv(kernelLocation, kernels[name]);

  // 画出矩形
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}
```

下面是一个可交互示例，用了稍微灵活一点的用户交互。勾选表示开启对应效果，拖拽改变渲染顺序。

[webgl-2d-image-processing](embedded-codesandbox://webgl-fundamental-image-processing/webgl-2d-image-processing?view=preview)

有些东西需要回顾一下。

调用 gl.bindFramebuffer 设置为 null 是告诉 WebGL 你想在画布上绘制，而不是在帧缓冲上。

WebGL 需要从裁剪空间对应到屏幕像素，设置 gl.viewport 就是为了实现这个。因为我们的帧缓冲的大小和画布的大小不同，所以我们需要给帧缓冲设置一个合适的视图大小让它渲染到对应的纹理上，最后再渲染到画布上。

原例中，我们在渲染时绕 y 轴翻转是因为 WebGL 的 0, 0 点在左下角而不是常见二维屏幕坐标的左上角。而在帧缓冲中绘制的时候不需要翻转，因为帧缓冲不用显示，谁上谁下无所谓，最重要的是我们计算中的 0, 0 也对应帧缓冲中的 0, 0 像素。为了解决这个问题，通过在着色器中添加一个输入来决定是否翻转。

```js
<script id="vertex-shader-2d" type="x-shader/x-vertex">
   // ...
   uniform float u_flipY;
   // ...

   void main() {
      // ...

      gl_Position = vec4(clipSpace * vec2(1, u_flipY), 0, 1);

      // ...
   }
</script>
```

然后在渲染的时候可以这样设置

```js
// ...

var flipYLocation = gl.getUniformLocation(program, 'u_flipY');

// ...

// 不翻转
gl.uniform1f(flipYLocation, 1);

// ...

// 翻转
gl.uniform1f(flipYLocation, -1);
```

为了让这个例子简单化，我只用了一个 GLSL 实现了多种渲染效果。如果专做图像处理可能需要多个 GLSL 程序，一个调节色彩、饱和度和明度，一个调节亮度和对比度，一个做反色，一个做色彩平衡，等等。你需要用代码更换 GLSL 程序，并更新程序对应的参数。我想过写一个类似的例子，但最好留给读者自己实现，因为多个 GLSL 程序和参数需要良好的重构，不然代码会一团糟，所以它是一个很好的练习机会。

希望这个和之前的例子让你更了解 WebGL，从二维开始讲解是希望你更有利于对 WebGL 的理解。如果有时间我会试着写一些关于如何实现三维效果的文章，讲一些一些关于 WebGL 的底层原理和细节。
