---
title: WebGL 理论基础——纹理
date: 2022-07-05 15:15:57
categories:
  - 前端
tags: 前端, 可视化, WebGL, 读书笔记
path: /webgl-fundamental-textures/
---

# WebGL 三维纹理

在 WebGL 中如何使用纹理？你可能会从二维图像处理的文章中得到启发，如果我们讲的再深入一点可能更好理解。

首先需要调整着色器以便使用纹理，这里是顶点着色器的修改部分，我们需要传递纹理坐标，在这个例子中直接将它们传到片断着色器中。

```glsl{2,6,12-13}
attribute vec4 a_position;
attribute vec2 a_texcoord;

uniform mat4 u_matrix;

varying vec2 v_texcoord;

void main() {
  // 将位置和矩阵相乘
  gl_Position = u_matrix * a_position;

  // 传递纹理坐标到片断着色器
  v_texcoord = a_texcoord;
}
```

在片断着色器中声明一个 sampler2D 类型的全局变量，可以让我们引用一个纹理，然后使用从顶点着色器传入的纹理坐标调用 texture2D 方法，在纹理上找到对应的颜色。

```glsl{4,6-7,10}
precision mediump float;

// 从顶点着色器中传入的值
varying vec2 v_texcoord;

// 纹理
uniform sampler2D u_texture;

void main() {
   gl_FragColor = texture2D(u_texture, v_texcoord);
}
```

我们需要设置纹理坐标

```js{3,7,10-16}
// 找到顶点坐标中的属性
var positionLocation = gl.getAttribLocation(program, 'a_position');
var texcoordLocation = gl.getAttribLocation(program, 'a_texcoord');

// ...

// 为纹理坐标创建一个缓冲
var buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.enableVertexAttribArray(texcoordLocation);

// 以浮点型格式传递纹理坐标
gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

// 设置纹理坐标
setTexcoords(gl);
```

如你所见，我们将图像映射到 F 中的每个矩形面上。

```js
// 为 F 设置纹理坐标缓冲
function setTexcoords(gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      // 正面左竖
      0,
      0,
      0,
      1,
      1,
      0,
      0,
      1,
      1,
      1,
      1,
      0,

      // 正面上横
      0,
      0,
      0,
      1,
      1,
      0,
      0,
      1,
      1,
      1,
      1,
      0

      //  ...
    ]),
    gl.STATIC_DRAW
  );
}
```

事实上使用一个带有 F 的图像能够在结果中清楚的分辨出纹理的方向。

我们还需要一个纹理，我们可以从头做一个但在这个例子中就直接加载一个图像，因为那可能是常用的做法。

这是我们将要使用的图像

![](res/2022-07-06-11-32-56.png)

加载图像的过程是异步的，我们请求图像资源后浏览器需要一段时间去下载。通常有两种处理方法，一种是等纹理下载完成后再开始绘制，另一种是在图像加载前使用生成的纹理，这种方式可以立即启动渲染，一旦图像下载完成就拷贝到纹理。我们将使用下方的方法。

```js
// 创建一个纹理
var texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);

// 用 1x1 个蓝色像素填充纹理
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));

// 异步加载图像
var image = new Image();
image.src = 'resources/f-texture.png';
image.addEventListener('load', function () {
  // 现在图像加载完成，拷贝到纹理中
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.generateMipmap(gl.TEXTURE_2D);
});
```

[webgl-3d-textures](embedded-codesandbox://webgl-fundamental-textures/webgl-3d-textures?view=preview)

// TODO https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-3d-textures.html
