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

var textureSizeLocation = gl.getUniformLocation(program, "u_textureSize");

// ...

// 设置图像的大小
gl.uniform2f(textureSizeLocation, image.width, image.height);

// ...
```

可以和上方没有模糊处理的图片对比一下。

[webgl-2d-image-blend](embedded-codesandbox://webgl-fundamental-image-processing/webgl-2d-image-blend?view=preview)
