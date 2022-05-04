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

// TODO https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-image-processing-continued.html
