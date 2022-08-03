---
title: WebGL 理论基础——纹理
date: 2022-07-27 14:35:19
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

```js{3,7,10,12-13,15-16}
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

## F

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

如果我只想使用一部分图像覆盖 'F' 的正面怎么办，纹理是通过“纹理坐标”来引用的，纹理坐标 0.0 到 1.0 对应纹理从左到右，0.0 到 1.0 对应第一个像素所在行到最后一行。注意我没有使用上或者下，上下在纹理坐标空间中是没有意义的，因为绘制一些东西后再重定向后，是没有上下的概念的，主要是依据传递给 WebGL 的纹理数据，纹理数据的开头对应纹理坐标 0, 0，结尾对应纹理坐标 1, 1

![](res/2022-07-26-17-11-32.png)

我将纹理载入到 Photoshop 中得到一些点的坐标。

![](res/2022-07-26-17-11-52.png)

可以像这样将像素坐标转换到纹理坐标

```js
texcoordX = pixelCoordX / (width - 1);
texcoordY = pixelCoordY / (height - 1);
```

这是正面的纹理坐标

```
// 正面左竖
 38 / 255,  44 / 255,
 38 / 255, 223 / 255,
113 / 255,  44 / 255,
 38 / 255, 223 / 255,
113 / 255, 223 / 255,
113 / 255,  44 / 255,

// 正面上横
113 / 255, 44 / 255,
113 / 255, 85 / 255,
218 / 255, 44 / 255,
113 / 255, 85 / 255,
218 / 255, 85 / 255,
218 / 255, 44 / 255,

// 正面中横
113 / 255, 112 / 255,
113 / 255, 151 / 255,
203 / 255, 112 / 255,
113 / 255, 151 / 255,
203 / 255, 151 / 255,
203 / 255, 112 / 255,
```

对背面也使用相同的纹理坐标，得到这样的结果。

[webgl-3d-textures-texture-coords-mapped](embedded-codesandbox://webgl-fundamental-textures/webgl-3d-textures-texture-coords-mapped?view=preview)

并不是非常好看，但是希望这样能展示出纹理坐标的用法。如果你使用代码生成几何体（立方体，球体，等等），通常情况下计算期望的纹理坐标也是比较容易的。另一方面如果通过软件例如 Blender, Maya, 3D Studio Max 制作几何体，那么你的美术（或者你自己）就会用软件调整纹理坐标。

如果纹理坐标再 0.0 到 1.0 之外会怎样？WebGL 默认会重复纹理，0.0 到 1.0 是一份纹理的“拷贝”，1.0 到 2.0 是另外一份拷贝，-4.0 到 -3.0 也是另外一份拷贝。让我们在一个平面上使用这些纹理坐标。

```
-3, -1,
 2, -1,
-3,  4,
-3,  4,
 2, -1,
 2,  4,
```

这是结果

[webgl-3d-textures-repeat-clamp](embedded-codesandbox://webgl-fundamental-textures/webgl-3d-textures-repeat-clamp?view=preview)

你可以使用 `CLAMP_TO_EDGE` 告诉 WebGL 再某个方向不需要重复，例如

```js
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
```

点击上方示例中的按钮，观察结果。

你可能注意到在加载纹理时调用了 `gl.generateMipmap`，那是干什么的？

假设我们有这样一个 16×16 像素的纹理。

![](res/2022-07-26-18-15-32.png)

假设我们要将它绘制在屏幕的 2×2 个像素上，那么这 4 个像素应该使用什么颜色？这里有 256 个像素可以选择，如果在 Photoshop 中将 16×16 的图像缩放到 2×2，它会将每个角 8×8 的像素的平均值赋给这四个像素。不幸的是绘制 64 个像素再求平均在 GPU 中是非常慢的。假设你有一个 2048x2048 像素的纹理想要绘制成 2x2 个像素，就需要对 1024x1024 或 100 万个像素求平均 4 次，这需要很多运算同时速度要快。

事实上 GPU 使用的是一个纹理贴图（mipmap），纹理贴图是一个逐渐缩小的图像集合，每一个是前一个的四分之一大小，16×16 纹理的纹理贴图看起来像这样。

![](res/2022-07-26-18-24-47.png)

通常每个子图都是前一级的双线性插值，这就是 `gl.generateMipmap` 做的事情，它根据原始图像创建所有的缩小级别，你也可以自己提供缩小级别的图像。

现在如果你想将 16x16 像素的纹理绘制到屏幕的 2×2 个像素上，WebGL 会从创建的贴图中找到从之前级别贴图插值出的 2×2 贴图来使用。

你可以为纹理选择不同的贴图筛选条件来控制 WebGL 的插值，一共有这 6 种模式

1. `NEAREST` 从最大的贴图中选择 1 个像素
2. `LINEAR` 从最大的贴图中选择 4 个像素然后混合
3. `NEAREST_MIPMAP_NEAREST` 选择最合适的贴图，然后从上面找到一个像素
4. `LINEAR_MIPMAP_NEAREST` 选择最合适的贴图，然后取出 4 个像素进行混合
5. `NEAREST_MIPMAP_LINEAR` 选择最合适的两个贴图，从每个上面选择 1 个像素然后混合
6. `LINEAR_MIPMAP_LINEAR` 选择最合适的两个贴图，从每个上选择 4 个像素然后混合

你可以通过这两个例子看到贴图的重要性，第一个显示的是使用 NEAREST 或 LINEAR，只从最大的贴图上选择像素，当物体运动时就会出现抖动。由于每个像素都从最大的图上选择，随着位置和大小的改变，可能会在不同的时间选择不同的像素，从而出现抖动。

[webgl-3d-textures-mips](embedded-codesandbox://webgl-fundamental-textures/webgl-3d-textures-mips?view=preview)

观察发现左边和中间的抖动会多于右边。由于右边的使用多级贴图并且混合颜色，绘制的越小 WebGL 挑选的像素离原图关系越远。相反的中间的小图虽然使用了 LINEAR 混合 4 个像素的颜色，但这 4 个像素是从大图中选出来，不同的选择会有较大的差别，所以还是抖动明显。右下角的图保持颜色一致是从右中图中挑选的像素。

第二个例子显示了一些深入屏幕中的多边形。

[webgl-3d-textures-mips-tri-linear](embedded-codesandbox://webgl-fundamental-textures/webgl-3d-textures-mips-tri-linear?view=preview)

6 个深入屏幕的横梁使用的是之前 6 种不同的筛选模式。

1. 左上使用的是 NEAREST，你会感受到明显的块状感；
2. 中上使用的是 LINEAR 也没有好到哪里去；
3. 右上使用的是 `NEAREST_MIPMAP_NEAREST`，点击图像切换纹理，每个贴图都是不同的颜色，就可以清除的看出它使用的是哪个贴图；
4. 左下使用的是 `LINEAR_MIPMAP_NEAREST`，意思是挑选最合适贴图种的 4 个像素进行混合，你会发现贴图切换的部分非常突兀；
5. 中下使用的是 `NEAREST_MIPMAP_LINEAR`，也就是找到最合适的两个贴图各取一点进行混合，如果仔细看会发现仍然有块状感，尤其是水平方向；
6. 右下使用的是 `LINEAR_MIPMAP_LINEAR`，也就是选出最合适的两个贴图各取 4 个点进行混合。

![](res/2022-07-26-18-34-03.png)

你可能会想既然理论上 `LINEAR_MIPMAP_LINEAR` 是最好的选择为什么还要有其他选择

1. `LINEAR_MIPMAP_LINEAR` 是最慢的，读 8 个像素比读 1 个像素慢一些，在现代的 GPU 上如果一次使用一个贴图可能没什么问题，但是现在的游戏可能一次就需要 2 到 4 个贴图，4 贴图 \* 8 像素每贴图 = 绘制每个像素需要读取 32 个像素，那就会慢很多了。
2. 如果想实现特定的效果，比如做一些复古的东西可能就需要使用 NEAREST。贴图也占用内存，事实上它占用额外 33% 的内存，那是非常多的内存，尤其是使用很大的纹理例如想要在游戏的标题屏幕上绘制的东西。如果你不会绘制比最大的贴图要小的东西，为什么要把内存浪费在贴图上，直接使用 NEAREST 或 LINEAR 就只使用第一个贴图。

设置筛选器可以调用 `gl.texParameter`

```js
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
```

- `TEXTURE_MIN_FILTER` 是当绘制的比最大贴图小的时候。
- `TEXTURE_MAG_FILTER` 是绘制的比最大的贴图大的时候。
- 对于 `TEXTURE_MAG_FILTER` 只有 NEAREST 和 LINEAR 两个可选设置。

假设我们想使用这个纹理。

![](res/2022-07-27-11-18-57.png)

这是结果。

[webgl-3d-textures-bad-npot](embedded-codesandbox://webgl-fundamental-textures/webgl-3d-textures-bad-npot?view=preview)

为什么键盘的纹理没有出现？那是因为 WebGL 限制了纹理的维度必须是 2 的整数次幂，2 的幂有 `1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048` 等等。`F` 纹理是 256 × 256，256 是 2 的幂。键盘纹理是 320x240，都不是 2 的幂，所以显示纹理失败，在着色器中当 texture2D 被调用的时候由于纹理没有正确设置，就会使用颜色 `(0, 0, 0, 1)` 也就是黑色。如果打开 JavaScript 控制台或者浏览器控制台，根据浏览器不同可能会显示不同的错误信息，像这样

```
WebGL: INVALID_OPERATION: generateMipmap: level 0 not power of 2
   or not all the same size
WebGL: drawArrays: texture bound to texture unit 0 is not renderable.
   It maybe non-power-of-2 and have incompatible texture filtering or
   is not 'texture complete'.
```

解决这个问题只需要将包裹模式设置为 `CLAMP_TO_EDGE` 并且通过设置过滤器为 `LINEAR or NEAREST` 来关闭贴图映射。

让我们来更新图像加载的代码解决这个问题，首先需要一个方法判断一个数是不是 2 的幂。

```js
function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}
```

我不准备深入讲解二进制运算，以及它的的原理。有了它后，就可以这样使用。

[webgl-3d-textures-good-npot](embedded-codesandbox://webgl-fundamental-textures/webgl-3d-textures-good-npot?view=preview)

## 6 个面

一个常见的问题是 `如何为立方体的每个面设置不同的图像？`，假设我们有 6 个这样的图片。

![](res/2022-07-27-11-25-05.png)

脑中出现了 3 个答案

1. 制作一个复杂的着色器，引用 6 个纹理，传入一些额外的顶点信息表明使用的纹理是什么。不要这样做！稍微一想就知道你要写一大堆不同的着色器应用于不同面数量的图形之类。

2. 绘制 6 个面代替立方体，这是常用的解决办法，不错但是只能用在简单的图形例如立方体。如果有一个包含 1000 个方形的图形就要绘制 1000 个面，会非常慢。

3. 我敢说，最好的方法就是将图像放在一个纹理中，然后利用纹理坐标映射不同的图像到每个面，这是很多高性能应用（读作游戏）使用的技术。例如我们将所有的图像放入这样一个纹理中

![](res/2022-07-27-11-25-42.png)

然后为立方体的每个面设置不同的纹理坐标。

```
// 选择左下图
0   , 0  ,
0   , 0.5,
0.25, 0  ,
0   , 0.5,
0.25, 0.5,
0.25, 0  ,
// 选择中下图
0.25, 0  ,
0.5 , 0  ,
0.25, 0.5,
0.25, 0.5,
0.5 , 0  ,
0.5 , 0.5,
// 选择中右图
0.5 , 0  ,
0.5 , 0.5,
0.75, 0  ,
0.5 , 0.5,
0.75, 0.5,
0.75, 0  ,
// 选择左上图
0   , 0.5,
0.25, 0.5,
0   , 1  ,
0   , 1  ,
0.25, 0.5,
0.25, 1  ,
// 选择中上图
0.25, 0.5,
0.25, 1  ,
0.5 , 0.5,
0.25, 1  ,
0.5 , 1  ,
0.5 , 0.5,
// 选择右上图
0.5 , 0.5,
0.75, 0.5,
0.5 , 1  ,
0.5 , 1  ,
0.75, 0.5,
0.75, 1  ,
```

[webgl-3d-textures-texture-atlas](embedded-codesandbox://webgl-fundamental-textures/webgl-3d-textures-texture-atlas?view=preview)

这种将多个图像通过一个纹理提供的方法通常被叫做纹理图集，它是最好的方式，因为只需要加载一个贴图，着色器也会因为只用一个贴图而保持简单，不同于多个平面需要多次调用绘制，这样只需要调用一次绘制。

## UVs vs. 纹理坐标

纹理坐标经常被简写为 `texture coords`，`texcoords` 或 UVs(发音为 Ew-Vees)，我不知道术语 UVs 是从哪来的，除了一点那就是顶点位置使用 `x, y, z, w`，所以对于纹理坐标他们决定使用 `s, t, u, v`，好让你清楚使用的两个类型的区别。有了这些你可能会想它应该读作 Es-Tees，因为纹理包裹的设置被叫做 `TEXTURE_WRAP_S` 和 `TEXTURE_WRAP_T`，但是出于某些原因我的图形相关的同事都叫它 Ew-Vees。

所以现在你就知道了如果有人说 UVs 其实就是再说纹理坐标。

# WebGL 数据纹理

上节中讲到了纹理的工作原理以及如何使用，我们用下载的图像创建纹理，在这篇文章中我们将直接用 JavaScript 创建数据。

用 JavaScript 为纹理创建数据是比较直接的，默认情况下 WebGL1 只支持少量数据类型的纹理

| 格式            | 数据类型                 | 通道数 | 单像素字节数 |
| :-------------- | :----------------------- | :----- | :----------- |
| RGBA            | UNSIGNED_BYTE            | 4      | 4            |
| RGB             | UNSIGNED_BYTE            | 3      | 3            |
| RGBA            | `UNSIGNED_SHORT_4_4_4_4` | 4      | 2            |
| RGBA            | `UNSIGNED_SHORT_5_5_5_1` | 4      | 2            |
| RGB             | `UNSIGNED_SHORT_5_6_5`   | 3      | 2            |
| LUMINANCE_ALPHA | UNSIGNED_BYTE            | 2      | 2            |
| LUMINANCE       | UNSIGNED_BYTE            | 1      | 1            |
| ALPHA           | UNSIGNED_BYTE            | 1      | 1            |

让我们创建一个 3×2 像素的 LUMINANCE（亮度/黑白）纹理，由于它是 LUMINANCE 纹理，所以每个像素只有一个值，在 R，G，B 通道是相同的。

我们继续使用上篇文章中的例子，首先修改纹理坐标，每个面使用整个纹理

```js
// 填充立方体纹理坐标的缓冲
function setTexcoords(gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      // 正面
      0,
      0,
      0,
      1,
      1,
      0,
      1,
      0,
      0,
      1,
      1,
      1
      // ...
    ])
  );
}
```

然后修改代码创建一个纹理

```js
// 创建一个纹理
var texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);

// // 用 1x1 的蓝色像素填充纹理
// gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
//               new Uint8Array([0, 0, 255, 255]));

// 用 3x2 的像素填充纹理
const level = 0;
const internalFormat = gl.LUMINANCE;
const width = 3;
const height = 2;
const border = 0;
const format = gl.LUMINANCE;
const type = gl.UNSIGNED_BYTE;
const data = new Uint8Array([128, 64, 128, 0, 192, 0]);
gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, format, type, data);

// 设置筛选器，我们不需要使用贴图所以就不用筛选器了
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

// // 异步加载图像
// ...
```

[webgl-data-texture-3x2-bad](embedded-codesandbox://webgl-fundamental-textures/webgl-data-texture-3x2-bad?view=preview)

发现不生效，查看 JavaScript 控制台看到这样的错误信息

```
WebGL: INVALID_OPERATION: texImage2D: ArrayBufferView not big enough for request
```

结果是 WebGL 中有一种首次创建 OpenGL 后的模糊设定，计算机有时在数据为某些特定大小时速度会快一些，例如一次拷贝 2，4 或 8 个字节比一次拷贝 1 个字节要快，WebGL 默认使用 4 字节长度，所以它期望每一行数据是多个 4 字节数据（最后一行除外）。

我们之前的数据每行只有 3 个字节，总共为 6 字节，但是 WebGL 试图在第一行获取 4 个字节，第二行获取 3 个字节，总共 7 个字节，所以会出现这样的报错。

我们可以告诉 WebGL 一次处理 1 个字节

```js
const alignment = 1;
gl.pixelStorei(gl.UNPACK_ALIGNMENT, alignment);
```

有效参数为 1，2，4 和 8

我觉得你可能无法计算出对齐数据和非对齐数据的速度区别，所以希望默认值是 1 而不是 4，这样这个问题就不会困扰新手，但是为了适配 OpenGL，所以要保留相同的默认设置，这样移植应用就不用改变行数，然后可以为新的应用在需要的地方设置属性为 1。

有了这个设置后就能正常运行了

[webgl-data-texture-3x2](embedded-codesandbox://webgl-fundamental-textures/webgl-data-texture-3x2?view=preview)

# WebGL 渲染到纹理

上篇讲到如何利用 JavaScript 向纹理提供数据，这篇文章我们会使用 WebGL 渲染内容到纹理上，这个话题在图像处理中简单讲到过，但这里将详细介绍。

渲染到纹理非常简单，创建一个确定大小的纹理

```js
// 创建渲染对象
const targetTextureWidth = 256;
const targetTextureHeight = 256;
const targetTexture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, targetTexture);

{
  // 定义 0 级的大小和格式
  const level = 0;
  const internalFormat = gl.RGBA;
  const border = 0;
  const format = gl.RGBA;
  const type = gl.UNSIGNED_BYTE;
  const data = null;
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    targetTextureWidth,
    targetTextureHeight,
    border,
    format,
    type,
    data
  );

  // 设置筛选器，不需要使用贴图
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}
```

注意 data 是 null，我们不需要提供数据，只需要让 WebGL 分配一个纹理。

接下来创建一个帧缓冲（framebuffer），帧缓冲只是一个附件集，附件是纹理或者 renderbuffers，我们之前讲过纹理，Renderbuffers 和纹理很像但是支持纹理不支持的格式和可选项，同时不能像纹理那样直接将 renderbuffer 提供给着色器。

让我们来创建一个帧缓冲并和纹理绑定

```js
// 创建并绑定帧缓冲
const fb = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

// 附加纹理为第一个颜色附件
const attachmentPoint = gl.COLOR_ATTACHMENT0;
gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, targetTexture, level);
```

与纹理和缓冲相似，在创建完帧缓冲后我们需要将它绑定到 FRAMEBUFFER 绑定点，那样所有的方法都会作用到绑定的帧缓冲，无论是哪个帧缓冲。

绑定帧缓冲后，每次调用 `gl.clear`, `gl.drawArrays` 或 `gl.drawElements` WebGL 都会渲染到纹理上而不是画布上。

将原来的渲染代码构造成一个方法，就可以调用两次，一次渲染到纹理，一次渲染到画布。

```js
function drawCube(aspect) {
  // 告诉它使用的程序（着色器对）
  gl.useProgram(program);

  // 启用位置属性
  gl.enableVertexAttribArray(positionLocation);

  // 绑定到位置缓冲
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // 告诉位置属性如何从 positionBuffer (ARRAY_BUFFER) 中读取数据
  var size = 3; // 每次迭代需要三个单位数据
  var type = gl.FLOAT; // 单位数据类型为 32 位浮点型
  var normalize = false; // 不需要单位化
  var stride = 0; // 每次迭代移动的距离
  var offset = 0; // 从缓冲起始处开始
  gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

  // 启用纹理坐标属性
  gl.enableVertexAttribArray(texcoordLocation);

  // 绑定纹理坐标缓冲
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

  // 告诉纹理坐标属性如何从 texcoordBuffer 读取数据
  var size = 2; // 每次迭代两个单位数据
  var type = gl.FLOAT; // 单位数据类型是 32 位浮点型
  var normalize = false; // 不需要单位化数据
  var stride = 0; // 每次迭代移动的数据
  var offset = 0; // 从缓冲起始处开始
  gl.vertexAttribPointer(texcoordLocation, size, type, normalize, stride, offset);

  // 计算投影矩阵

  // var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

  var cameraPosition = [0, 0, 2];
  var up = [0, 1, 0];
  var target = [0, 0, 0];

  // 计算相机矩阵
  var cameraMatrix = m4.lookAt(cameraPosition, target, up);

  // 根据相机矩阵计算视图矩阵
  var viewMatrix = m4.inverse(cameraMatrix);

  var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

  var matrix = m4.xRotate(viewProjectionMatrix, modelXRotationRadians);
  matrix = m4.yRotate(matrix, modelYRotationRadians);

  // 设置矩阵
  gl.uniformMatrix4fv(matrixLocation, false, matrix);

  // 使用纹理单元 0
  gl.uniform1i(textureLocation, 0);

  // 绘制几何体
  gl.drawArrays(gl.TRIANGLES, 0, 6 * 6);
}
```

注意到我们需要传入 aspect 计算投影矩阵，因为目标纹理的比例和画布不同。

然后这样调用

```js
// 绘制场景
function drawScene(time) {
  // ...

  {
    // 通过绑定帧缓冲绘制到纹理
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

    // 使用 3×2 的纹理渲染立方体
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // 告诉 WebGL 如何从裁剪空间映射到像素空间
    gl.viewport(0, 0, targetTextureWidth, targetTextureHeight);

    // 清空画布和深度缓冲
    gl.clearColor(0, 0, 1, 1); // clear to blue
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const aspect = targetTextureWidth / targetTextureHeight;
    drawCube(aspect);
  }

  {
    // 渲染到画布
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    // 立方体使用刚才渲染的纹理
    gl.bindTexture(gl.TEXTURE_2D, targetTexture);

    // 告诉 WebGL 如何从裁剪空间映射到像素空间
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // 清空画布和深度缓冲
    gl.clearColor(1, 1, 1, 1); // clear to white
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    drawCube(aspect);
  }

  requestAnimationFrame(drawScene);
}
```

[webgl-render-to-texture](embedded-codesandbox://webgl-fundamental-textures/webgl-render-to-texture?view=preview)

十分重要的是要记得调用 gl.viewport 设置要绘制的对象的大小，在这个例子中第一次渲染到纹理，所以设置视图大小覆盖纹理，第二次渲染到画布所以设置视图大小覆盖画布。

同样的当我们计算投影矩阵的时候需要使用正确的比例，我花了无数个小时调试，寻找出现搞笑的渲染结果的原因，最后发现是少调用了一个 gl.viewport 或者都忘了，并使用正确的比例，由于在代码中很少直接调用 gl.bindFramebuffer 所以就容易忘掉这些。所以我把这个方法调用放在一个方法里，像这样

```js
function bindFrambufferAndSetViewport(fb, width, height) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.viewport(0, 0, width, height);
}
```

然后使用这个方法改变渲染对象，就不容易忘记了。

还有一个需要注意的事情是我们的帧缓冲没有深度缓冲，只有纹理。这意味着没有深度检测，所以三维就不能正常体现，如果我们绘制三个立方体就会看到这样。

[webgl-render-to-texture-3-cubes-no-depth-buffer](embedded-codesandbox://webgl-fundamental-textures/webgl-render-to-texture-3-cubes-no-depth-buffer?view=preview)

如果仔细看中间的立方体，会看到 3 个垂直绘制的立方体，一个在后面，一个在中间另一个在前面，但是我们绘制的三个立方体是相同深度的，观察画布上水平方向的 3 个立方体就会发现他们是正确相交的。那是因为在帧缓冲中没有深度缓冲，但是画布有。

![](res/2022-07-28-14-10-24.png)

想要加深度缓冲就需要创建一个，然后附加到帧缓冲中

```js
// 创建一个深度缓冲
const depthBuffer = gl.createRenderbuffer();
gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);

// 设置深度缓冲的大小和 targetTexture 相同
gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, targetTextureWidth, targetTextureHeight);
gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);
```

有了这个以后的结果。

[webgl-render-to-texture-3-cubes-with-depth-buffer](embedded-codesandbox://webgl-fundamental-textures/webgl-render-to-texture-3-cubes-with-depth-buffer?view=preview)

现在帧缓冲附加了深度缓冲以后内部的立方体也能正确相交了。

![](res/2022-07-28-14-11-01.png)

需要特别注意的是 WebGL 只允许三种附件组合形式。根据 [规范](https://registry.khronos.org/webgl/specs/latest/1.0/#FBO_ATTACHMENTS) 一定能正确运行的附件组合是：

- `COLOR_ATTACHMENT0` = `RGBA/UNSIGNED_BYTE` texture
- `COLOR_ATTACHMENT0` = `RGBA/UNSIGNED_BYTE` texture + `DEPTH_ATTACHMENT` = `DEPTH_COMPONENT16` renderbuffer
- `COLOR_ATTACHMENT0` = `RGBA/UNSIGNED_BYTE` texture + `DEPTH_STENCIL_ATTACHMENT` = `DEPTH_STENCIL` renderbuffer

对于其他的组合就需要检查用户系统/gpu/驱动/浏览器的支持情况。要检查的话需要创建帧缓冲，附加附件，然后调用

```js
var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
```

如果状态是 `FRAMEBUFFER_COMPLETE` 那这种组合就能使用，反之不能使用。你就需要告诉用户他们不走运或者撤销一些方法。

> **其实 Canvas 本身就是一个纹理**
>
> 只是一点小事，浏览器使用上方的技术实现的画布，在背后它们创建了一个颜色纹理，一个深度缓冲，一个帧缓冲，然后绑定到当前的帧缓冲，当你调用你的渲染方法时就会绘制到那个纹理上，然后再用那个纹理将画布渲染到网页中。

# WebGL 使用多个纹理

现在可能是一个合适的时机去回答“如何使用 2 个或多个纹理？”。

非常简单，回到几节之前绘制一个图像的着色器，将它升级到使用两个纹理。

首先改变代码加载两个图像，这其实不是 WebGL 的事情，是 HTML5 和 JavaScript 的事情，但是我也会涉及到。图像加载是异步的，可能需要适应一下。

基本上有两种方式来处理图像的加载，一种是重构代码，让它在没有纹理的时候运行，当图像加载后，再更新程序。我们会在以后的文章中用到这个方法。

这个例子中就等两个图像都加载完成后再开始绘制。

首先修改加载单个图像的方法，非常简单，先创建一个新的 Image 对象，设置加载的 url，然后设置回调函数在图像加载完成后调用。

```js
function loadImage(url, callback) {
  var image = new Image();
  image.src = url;
  image.onload = callback;
  return image;
}
```

现在来创建一个方法加载一个 URL 序列，并且创建一个图像序列。首先设置 imagesToLoad 为加载图像的个数，然后为每个图像调用 loadImage，当 imagesToLoad 递减到 0 的时候说明所有图像加载完成，调用回调函数。

```js
function loadImages(urls, callback) {
  var images = [];
  var imagesToLoad = urls.length;

  // 每个图像加载完成后调用一次
  var onImageLoad = function () {
    --imagesToLoad;
    // 如果所有图像都加载完成就调用回调函数
    if (imagesToLoad == 0) {
      callback(images);
    }
  };

  for (var ii = 0; ii < imagesToLoad; ++ii) {
    var image = loadImage(urls[ii], onImageLoad);
    images.push(image);
  }
}
```

然后就可以像这样调用 loadImages

```js
function main() {
  loadImages(['resources/leaves.jpg', 'resources/star.jpg'], render);
}
```

接下来修改着色器使用两个纹理，在这个例子中我们将两个纹理相乘。

```html
<script id="fragment-shader-2d" type="x-shader/x-fragment">
  precision mediump float;

  // 纹理
  uniform sampler2D u_image0;
  uniform sampler2D u_image1;

  // 从顶点着色器传入的 texCoords
  varying vec2 v_texCoord;

  void main() {
     vec4 color0 = texture2D(u_image0, v_texCoord);
     vec4 color1 = texture2D(u_image1, v_texCoord);
     gl_FragColor = color0 * color1;
  }
</script>
```

需要创建两个 WebGL 纹理对象。

```js
// 创建两个纹理
var textures = [];
for (var ii = 0; ii < 2; ++ii) {
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // 设置参数以便使用任意尺的影像
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  // 上传图像到纹理
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[ii]);

  // 将纹理添加到纹理序列
  textures.push(texture);
}
```

WebGL 有一个叫做 `texture units` 的对象，你可以把它看成是一个纹理引用的序列，你需要告诉着色器每个 sampler（取样器）使用哪一个 `texture unit`（纹理单元）。

```js
// 寻找取样器的位置
var u_image0Location = gl.getUniformLocation(program, 'u_image0');
var u_image1Location = gl.getUniformLocation(program, 'u_image1');

// ...

// 设置使用的纹理单元
gl.uniform1i(u_image0Location, 0); // 纹理单元 0
gl.uniform1i(u_image1Location, 1); // 纹理单元 1
```

然后将每个纹理单元绑定纹理。

```js
// 设置每个纹理单元对应一个纹理
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, textures[0]);

gl.activeTexture(gl.TEXTURE1);
gl.bindTexture(gl.TEXTURE_2D, textures[1]);
```

使用的两个图像像这样

![](res/2022-07-29-11-32-39.png)

这就是使用 WebGL 将它们相乘的结果。

[webgl-2-textures](embedded-codesandbox://webgl-fundamental-textures/webgl-2-textures?view=preview)

有些需要回顾的部分。

理解纹理单元的简单方式是：所有的纹理方法可以在 `激活的纹理单元` 上使用，`激活的纹理单元` 就是一个全局变量指向你想使用的所有纹理单元，每个纹理单元有两个目标对象，`TEXTURE_2D` 目标和 `TEXTURE_CUBE_MAP` 目标。每个纹理方法针对激活纹理单元上的一个目标，如果用 JavaScript 表示 WebGL 方法可能像这样

```js
var getContext = function() {
  var textureUnits = [
    { TEXTURE_2D: ??, TEXTURE_CUBE_MAP: ?? },
    { TEXTURE_2D: ??, TEXTURE_CUBE_MAP: ?? },
    { TEXTURE_2D: ??, TEXTURE_CUBE_MAP: ?? },
    { TEXTURE_2D: ??, TEXTURE_CUBE_MAP: ?? },
    { TEXTURE_2D: ??, TEXTURE_CUBE_MAP: ?? },
    // ...
   ];
  var activeTextureUnit = 0;

  var activeTexture = function(unit) {
    // 将纹理单元枚举转换成索引
    var index = unit - gl.TEXTURE0;
    // 设置激活纹理单元
    activeTextureUnit = index;
  };

  var bindTexture = function(target, texture) {
    // 设置激活纹理单元的目标对象纹理
    textureUnits[activeTextureUnit][target] = texture;
  };

  var texImage2D = function(target, ... args ...) {
    // 绑定对应纹理单元调用相应的方法
    var texture = textureUnits[activeTextureUnit][target];
    texture.image2D(...args...);
  };

  // 返回 WebGL API
  return {
    activeTexture: activeTexture,
    bindTexture: bindTexture,
    texImage2D: texImage2D,
  }
};
```

着色器获得纹理单元

```js
gl.uniform1i(u_image0Location, 0); // 纹理单元 0
gl.uniform1i(u_image1Location, 1); // 纹理单元 1
```

需要注意的是，设置全局变量的时候使用索引代替纹理单元，但是调用 `gl.activeTexture` 的时候你需要传递特殊的常量 `gl.TEXTURE0`, `gl.TEXTURE1` 之类。幸运的是这些常量是连续的，所以这些代码

```js
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, textures[0]);

gl.activeTexture(gl.TEXTURE1);
gl.bindTexture(gl.TEXTURE_2D, textures[1]);
```

可以写成这样

```js
gl.activeTexture(gl.TEXTURE0 + 0);
gl.bindTexture(gl.TEXTURE_2D, textures[0]);

gl.activeTexture(gl.TEXTURE0 + 1);
gl.bindTexture(gl.TEXTURE_2D, textures[1]);
```

或这样

```js
for (var ii = 0; ii < 2; ++ii) {
  gl.activeTexture(gl.TEXTURE0 + ii);
  gl.bindTexture(gl.TEXTURE_2D, textures[ii]);
}
```

希望这样能够帮助你理解 WebGL 单次绘制中如何使用多个纹理。

# WebGL 纹理映射的透视纠正

这篇文章讲纹理映射的透视纠正，要理解它你可能需要先看看透视投影和纹理，你也需要知道可变量以及它的用处，但是我还会简短的介绍一下。

在工作原理中我们讲过了可变量的工作原理，顶点着色器可以声明可变量并给它赋值，一旦顶点着色器被引用 3 次就会画一个三角形。绘制这个三角形的每个像素都会调用片断着色器获得像素颜色，在三个顶点之间的点会得到差之后的可变量。

<iframe src="https://codesandbox.io/embed/zi15x?codemirror=1&hidenavigation=1&theme=light&view=preview" class="embedded-codesandbox" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

<!-- [fragment-shader-anim](embedded-codesandbox://webgl-fundamental-base-concept/fragment-shader-anim?view=preview) -->

## 矩形

回到我们的第一篇文章，在裁剪空间中绘制一个三角形，没有数学运算，只是传入裁剪空间坐标到一个简单的顶点着色器，像这样

```glsl
// 属性从缓冲中获取数据
attribute vec4 a_position;

// 所有的着色器都有一个 main 函数
void main() {

   // gl_Position 是着色器需要设置的一个特殊的变量
   gl_Position = a_position;
}
```

还有一个简单的片断着色器提供固定的颜色

```glsl
// 片断着色器没有默认的精度，
// 中等精度是个不错的默认值
precision mediump float;

void main() {
   // gl_FragColor 是片断着色器需要设置的一个特殊变量
   gl_FragColor = vec4(1, 0, 0.5, 1); // 返回红紫色
}
```

让我们在裁剪空间绘制两个矩形，为每个顶点传递 X, Y, Z 和 W。

```js
var positions = [
  // 第一个矩形的第一个三角形
  -0.8,
  -0.8,
  0,
  1,
  0.8,
  -0.8,
  0,
  1,
  -0.8,
  -0.2,
  0,
  1,

  // 第一个矩形的第二个三角形
  -0.8,
  -0.2,
  0,
  1,
  0.8,
  -0.8,
  0,
  1,
  0.8,
  -0.2,
  0,
  1,

  // 第二个矩形的第一个三角形
  -0.8,
  0.2,
  0,
  1,
  0.8,
  0.2,
  0,
  1,
  -0.8,
  0.8,
  0,
  1,

  // 第二个矩形的第二个三角形
  -0.8,
  0.8,
  0,
  1,
  0.8,
  0.2,
  0,
  1,
  0.8,
  0.8,
  0,
  1
];
```

这是结果

[webgl-clipspace-rectangles](embedded-codesandbox://webgl-fundamental-textures/webgl-clipspace-rectangles?view=preview)

再添加一个浮点型可变量，并把它从顶点着色器直接传递到片断着色器

```glsl{2,4,9-10}
attribute vec4 a_position;
attribute float a_brightness;

varying float v_brightness;

void main() {
   gl_Position = a_position;

   // 直接传递亮度到片断着色器
   v_brightness = a_brightness;
}
```

在片断着色器中使用可变量设置颜色

```glsl{3-4,7}
precision mediump float;

// 顶点着色器的值插值后传入这里
varying float v_brightness;

void main() {
   gl_FragColor = vec4(v_brightness, 0, 0, 1);  // 红色
}
```

我们需要给可变量提供数据，创建一个缓冲放入一些数据，每个顶点一个值，我们将设置左边亮度为 0，右边亮度为 1。

```js
// 创建缓冲并放入 12 个亮度值
var brightnessBuffer = gl.createBuffer();

// 绑定到 ARRAY_BUFFER
gl.bindBuffer(gl.ARRAY_BUFFER, brightnessBuffer);

var brightness = [
  // 第一个矩形的第一个三角形
  0,
  1,
  0,

  // 第一个矩形的第二个三角形
  0,
  1,
  1,

  // 第二个矩形的第一个三角形
  0,
  1,
  0,

  // 第二个矩形的第二个三角形
  0,
  1,
  1
];

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(brightness), gl.STATIC_DRAW);
```

还需要在初始化阶段找到 `a_brightness` 的位置

```js{3}
// 找到顶点数据的输入位置
var positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
var brightnessAttributeLocation = gl.getAttribLocation(program, 'a_brightness');
```

然后在渲染阶段设置属性

```js
// 启用属性
gl.enableVertexAttribArray(brightnessAttributeLocation);

// 绑定位置缓冲
gl.bindBuffer(gl.ARRAY_BUFFER, brightnessBuffer);

// 告诉属性如何从缓冲中读取数据
var size = 1; // 每次迭代读取一个单位数据
var type = gl.FLOAT; // 数据类型是 32 位浮点型
var normalize = false; // 不用单位化
var stride = 0; // 每次迭代需要移动的距离
var offset = 0; // 从缓冲的起始处开始
gl.vertexAttribPointer(brightnessAttributeLocation, size, type, normalize, stride, offset);
```

现在渲染后得到会得到两个矩形，左边 brightness 是 0 右边是 1，中间的部分是插值（或可变量）。

[webgl-clipspace-rectangles-with-varying](embedded-codesandbox://webgl-fundamental-textures/webgl-clipspace-rectangles-with-varying?view=preview)

在透视投影的文章中我们知道 WebGL 会将放入 `gl_Position` 的值除以 `gl_Position.w`。

在上方的顶点中我们提供的 W 值为 1，但是我们知道 WebGL 会除以 W，所以做如下修改应该结果不变。

```js
var mult = 20;
var positions = [
  // 第一个矩形的第一个三角形
  -0.8,
  0.8,
  0,
  1,
  0.8,
  0.8,
  0,
  1,
  -0.8,
  0.2,
  0,
  1,

  // 第一个矩形的第二个三角形
  -0.8,
  0.2,
  0,
  1,
  0.8,
  0.8,
  0,
  1,
  0.8,
  0.2,
  0,
  1,

  // 第二个矩形的第一个三角形
  -0.8,
  -0.2,
  0,
  1,
  0.8 * mult,
  -0.2 * mult,
  0,
  mult,
  -0.8,
  -0.8,
  0,
  1,

  // 第二个矩形的第二个三角形
  -0.8,
  -0.8,
  0,
  1,
  0.8 * mult,
  -0.2 * mult,
  0,
  mult,
  0.8 * mult,
  -0.8 * mult,
  0,
  mult
];
```

如上所示我们将第二个矩形右边的点的 X 和 Y 都乘以 mult，同时设置 W 为 mult。由于 WebGL 会除以 W 所以我们应该得到相同的结果对么？

这是结果

[webgl-clipspace-rectangles-with-varying-non-1-w](embedded-codesandbox://webgl-fundamental-textures/webgl-clipspace-rectangles-with-varying-non-1-w?view=preview)

注意两个矩形和上一个例子位置相同，事实是 `X * MULT / MULT(W)` 还是 X，Y 也一样，但颜色却不同，为什么？

事实是 WebGL 使用 W 实现纹理映射或者可变量插值的透视投影。

如果将片断着色器改成这样就更容易看出效果

```js
gl_FragColor = vec4(fract(v_brightness * 10), 0, 0, 1); // 红色
```

将 `v_brightness` 乘以 10 就会是值的范围为 0 到 10，fract 会保留小数部分所以结果还是 0 到 1 之间，但是总共是 10 次 0 到 1 了。

[webgl-clipspace-rectangles-with-varying-non-1-w-repeat](embedded-codesandbox://webgl-fundamental-textures/webgl-clipspace-rectangles-with-varying-non-1-w-repeat?view=preview)

现在应该更容易看出透视效果。

线性插值应该是这样的公式

```js
result = (1 - t) * a + t * b;
```

t 的范围是 0 到 1，表示 a 到 b 之间的位置，0 表示在 a 点，1 表示在 b 点。

可变量经过 WebGL 的插值时使用这个公式

$$result=\frac{(1 - t) * a / aW + t * b / bW}{(1 - t) / aW + t / bW}$$

aW 表示 a 点的 W 值，也就是 `gl_Position.w` 的值，而不一定等于缓冲中的值， 同理 bW 是设置在 b 点的 `gl_Position.w`。

## 正方体

为什么这个很重要？这有一个简单的纹理，使用纹理文章的例子，并调整了 UV，每个面使用整张纹理，是一个 4×4 像素的纹理。

[webgl-perspective-correct-cube](embedded-codesandbox://webgl-fundamental-textures/webgl-perspective-correct-cube?view=preview)

现在将例子中的顶点着色器做一些修改，手工除以 W，只增加了一行代码

```glsl
attribute vec4 a_position;
attribute vec2 a_texcoord;

uniform mat4 u_matrix;

varying vec2 v_texcoord;

void main() {
  // 将位置和矩阵相乘
  gl_Position = u_matrix * a_position;

  // 手工除以 W
  gl_Position /= gl_Position.w;

  // 将纹理坐标传到片断着色器
  v_texcoord = a_texcoord;
}
```

除以 W 意味值 `gl_Position.w` 始终为 1，X, Y 和 Z 不会有什么影响，因为 WebGL 也会默认做除法，这是结果。

[webgl-non-perspective-correct-cube](embedded-codesandbox://webgl-fundamental-textures/webgl-non-perspective-correct-cube?view=preview)

我们还是得到了一个立方体，但是纹理变得扭曲了，这是因为没有传入 W WebGL 就不能正确的实现纹理的透视纠正，或者更准确地说，WebGL 就不能正确的对可变量的插值实现透视。

如果你还记得的话 W 就是透视矩阵中的 Z，当 W 始终为 1 时 WebGL 做的就是一个简单的线性插值，事实上如果你拿着上述的等式

$$result=\frac{(1 - t) * a / aW + t * b / bW}{(1 - t) / aW + t / bW}$$

设置所有的 W 为 1 就会得到

$$result=(1 - t) * a + t * b$$

就和上方提到的线性插值一样了。

现在就清楚为什么 WebGL 要使用 4x4 的矩阵和包含 X, Y, Z 和 W 四个值的向量了吧。X 和 Y 除以 W 得到裁剪空间坐标，Z 除以 W 也得到裁剪空间的 Z 坐标，W 同时还为纹理映射的透视纠正提供了帮助。

> **二十世纪中叶的游戏机**
>
> 一点小事，Playstation 1 和其他同一时代的游戏机都没有做纹理映射的透视纠正，根据以上的信息你就能看出为什么路面是这样的了。

![](res/2022-08-02-16-00-44.png)

![](res/2022-08-02-16-00-59.png)

# WebGL 平面的和透视的投影映射

投影映射是投影一张图像的过程，就像一个电影放映机对准一个屏幕，然后将电影投影到屏幕上。电影放映机投影的是一个透视的平面。屏幕离放映机越远，则图像就会越大。如果你将屏幕旋转使其不与电影放映机垂直，那么结果将会是一个梯形或者是任意的四边形。

![](res/2022-08-03-13-45-50.png)

当然，投影映射并不只能投影到平面。还有圆柱型的投影映射、球形的投影映射，等等。

我们先来介绍下平面的投影映射。在这种情况下，你需要将电影放映机想象成和屏幕一样大，这样即使屏幕离电影放映机很远，电影的图像也不会变得很大，它会保持原来的尺寸。

![](res/2022-08-03-15-05-08.png)

首先，让我们创建一个场景，该场景会绘制一个平面和一个球体。我们将用一个简单的 8x8 棋盘纹理对它们进行贴图。

这些着色器和纹理文章中的那些着色器是类似的，只是各个矩阵是分开的，这样我们就不需要在 JavaScript 中把它们乘在一起了。

```glsl
// 顶点着色器
attribute vec4 a_position;
attribute vec2 a_texcoord;

uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_world;

varying vec2 v_texcoord;

void main() {
  gl_Position = u_projection * u_view * u_world * a_position;

  // 把纹理坐标传给片段着色器
  v_texcoord = a_texcoord;
}
```

另外，我还添加了一个 `u_colorMult` uniform 来乘以纹理颜色。这样我们就可以通过制作一个单色纹理（monochrome texture）来改变它的颜色。

```glsl
// 片段着色器
precision mediump float;

// 从顶点着色器传来的
varying vec2 v_texcoord;

uniform vec4 u_colorMult;
uniform sampler2D u_texture;

void main() {
  gl_FragColor = texture2D(u_texture, v_texcoord) * u_colorMult;
}
```

下面是设置程序、球体 buffers 和平面 buffers 的代码

```js
// 设置 GLSL 程序
// 编译着色器、链接程序、查找 locations
const textureProgramInfo = webglUtils.createProgramInfo(gl, ['vertex-shader-3d', 'fragment-shader-3d']);

const sphereBufferInfo = primitives.createSphereBufferInfo(
  gl,
  1, // 半径
  12, // 横轴细分数
  6 // 纵轴细分数
);

const planeBufferInfo = primitives.createPlaneBufferInfo(
  gl,
  20, // 宽
  20, // 高
  1, // 横轴细分数
  1 // 纵轴细分数
);
```

和创建一个 8x8 棋盘纹理的代码，使用了我们在数据纹理文章中介绍过的技术。

```js
// 创建一个 8x8 棋盘纹理
const checkerboardTexture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, checkerboardTexture);
gl.texImage2D(
  gl.TEXTURE_2D,
  0, // mip level
  gl.LUMINANCE, // internal format
  8, // width
  8, // height
  0, // border
  gl.LUMINANCE, // format
  gl.UNSIGNED_BYTE, // type
  new Uint8Array([
    // data
    0xff,
    0xcc,
    0xff,
    0xcc,
    0xff,
    0xcc,
    0xff,
    0xcc,
    0xcc,
    0xff,
    0xcc,
    0xff,
    0xcc,
    0xff,
    0xcc,
    0xff,
    0xff,
    0xcc,
    0xff,
    0xcc,
    0xff,
    0xcc,
    0xff,
    0xcc,
    0xcc,
    0xff,
    0xcc,
    0xff,
    0xcc,
    0xff,
    0xcc,
    0xff,
    0xff,
    0xcc,
    0xff,
    0xcc,
    0xff,
    0xcc,
    0xff,
    0xcc,
    0xcc,
    0xff,
    0xcc,
    0xff,
    0xcc,
    0xff,
    0xcc,
    0xff,
    0xff,
    0xcc,
    0xff,
    0xcc,
    0xff,
    0xcc,
    0xff,
    0xcc,
    0xcc,
    0xff,
    0xcc,
    0xff,
    0xcc,
    0xff,
    0xcc,
    0xff
  ])
);
gl.generateMipmap(gl.TEXTURE_2D);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
```

为了绘制，我们将会创建一个函数，该函数需要一个投影矩阵和一个相机矩阵作为参数，以便从相机矩阵中计算出视图矩阵，然后绘制球体和立方体

```js
// 每个物体的 uniforms
const planeUniforms = {
  u_colorMult: [0.5, 0.5, 1, 1], // 浅蓝色
  u_texture: checkerboardTexture,
  u_world: m4.translation(0, 0, 0)
};

const sphereUniforms = {
  u_colorMult: [1, 0.5, 0.5, 1], // 粉红色
  u_texture: checkerboardTexture,
  u_world: m4.translation(2, 3, 4)
};

function drawScene(projectionMatrix, cameraMatrix) {
  // 从相机矩阵中计算出视图矩阵
  const viewMatrix = m4.inverse(cameraMatrix);

  gl.useProgram(textureProgramInfo.program);

  // 设置球体和平面共享的 uniforms
  webglUtils.setUniforms(textureProgramInfo, {
    u_view: viewMatrix,
    u_projection: projectionMatrix
  });

  // ------ 绘制球体 --------

  // 设置所有需要的 attributes
  webglUtils.setBuffersAndAttributes(gl, textureProgramInfo, sphereBufferInfo);

  // 设置球体特有的 uniforms
  webglUtils.setUniforms(textureProgramInfo, sphereUniforms);

  // 调用 gl.drawArrays 或 gl.drawElements
  webglUtils.drawBufferInfo(gl, sphereBufferInfo);

  // ------ 绘制平面 --------

  // 设置所有需要的 attributes
  webglUtils.setBuffersAndAttributes(gl, textureProgramInfo, planeBufferInfo);

  // 设置平面特有的 uniforms
  webglUtils.setUniforms(textureProgramInfo, planeUniforms);

  // 调用 gl.drawArrays 或 gl.drawElements
  webglUtils.drawBufferInfo(gl, planeBufferInfo);
}
```

我们可以在一个 render 函数中使用这份代码，就像这样

```js
const settings = {
  cameraX: 2.75,
  cameraY: 5
};

const fieldOfViewRadians = degToRad(60);

function render() {
  webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  // 告诉 WebGL 如何从裁剪空间转换为像素
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  // 清除 canvas 和深度缓冲区
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // 计算投影矩阵
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

  // 使用 look at 计算相机的矩阵
  const cameraPosition = [settings.cameraX, settings.cameraY, 7];
  const target = [0, 0, 0];
  const up = [0, 1, 0];
  const cameraMatrix = m4.lookAt(cameraPosition, target, up);

  drawScene(projectionMatrix, cameraMatrix);
}

render();
```

所以，现在我们有了一个简单的场景，场景内有一个平面和一个球体。我添加了一对滑块来让你改变相机的位置，以便你理解该场景。

[webgl-planar-projection-setup](embedded-codesandbox://webgl-fundamental-textures/webgl-planar-projection-setup?view=preview)

现在，让我们使用平面投影的方式将一个纹理投影到该球体和平面上。

首先要做的是，加载一个纹理。

```js
function loadImageTexture(url) {
  // 创建一个纹理
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // 用一个 1x1 蓝色像素填充该纹理
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
  // 异步加载一张图片
  const image = new Image();
  image.src = url;
  image.addEventListener('load', function () {
    // 现在图片加载完了，把它拷贝到纹理中
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    // 假设该纹理的宽高是 2 的整次幂
    gl.generateMipmap(gl.TEXTURE_2D);
    render();
  });
  return texture;
}

const imageTexture = loadImageTexture('resources/f-texture.png');
```

回想一下可视化相机的文章。我们创建了一个 -1 到 +1 的立方体，然后把它绘制出来表示相机的视椎体。我们的矩阵使得视椎体内的空间表示的是世界空间中一些锥体形状的区域，这些区域从世界空间中被转换到了 -1 到 +1 的裁剪空间。我们可以在这里做类似的事。

让我们来试试吧。首先，在我们的片段着色器中，我们会在 0.0 到 1.0 之间的纹理坐标上绘制投影的纹理。而在这个范围外的纹理坐标，我们将会使用棋盘纹理。

```glsl{5,9}
precision mediump float;

// 从顶点着色器传来的
varying vec2 v_texcoord;
varying vec4 v_projectedTexcoord;

uniform vec4 u_colorMult;
uniform sampler2D u_texture;
uniform sampler2D u_projectedTexture;

void main() {
  // gl_FragColor = texture2D(u_texture, v_texcoord) * u_colorMult;
  // 除以 w 得到正确的值，详见透视投影的文章
  vec3 projectedTexcoord = v_projectedTexcoord.xyz / v_projectedTexcoord.w;

  bool inRange =
      projectedTexcoord.x >= 0.0 &&
      projectedTexcoord.x <= 1.0 &&
      projectedTexcoord.y >= 0.0 &&
      projectedTexcoord.y <= 1.0;

  vec4 projectedTexColor = texture2D(u_projectedTexture, projectedTexcoord.xy);
  vec4 texColor = texture2D(u_texture, v_texcoord) * u_colorMult;

  float projectedAmount = inRange ? 1.0 : 0.0;
  gl_FragColor = mix(texColor, projectedTexColor, projectedAmount);
}
```

为了计算投影的纹理坐标，我们会创建一个矩阵，该矩阵表示 3D 空间中一个确切方向的方位和位置，就像可视化相机文章中的相机那样。然后我们会通过那个 3D 空间投影球体顶点和平面顶点的世界坐标。使用我们刚刚写的代码，那些位于 0 到 1 的投影纹理坐标就会显示该投影纹理。

让我们添加代码到顶点着色器，通过该空间投影球体和平面的世界坐标

```glsl{7,10,13,15-16,21}
attribute vec4 a_position;
attribute vec2 a_texcoord;

uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_world;
uniform mat4 u_textureMatrix;

varying vec2 v_texcoord;
varying vec4 v_projectedTexcoord;

void main() {
  vec4 worldPosition = u_world * a_position;

  // gl_Position = u_projection * u_view * u_world * a_position;
  gl_Position = u_projection * u_view * worldPosition;

  // 将纹理坐标传给片段着色器
  v_texcoord = a_texcoord;

  v_projectedTexcoord = u_textureMatrix * worldPosition;
}
```

现在，剩下要做的就是计算定义了该方位空间的矩阵。我们要做的就是计算出一个世界矩阵，就像我们对其他物体做的那样，然后取它的逆矩阵。这样我们就得到了一个矩阵，该矩阵可以让我们将其他物体的世界坐标转换为相对于该空间的坐标。这和相机文章中的视图矩阵做的事情是完全一样的。

我们会使用创建的 lookAt 函数

```js{4-9,31-32}
const settings = {
  cameraX: 2.75,
  cameraY: 5,
  posX: 3.5,
  posY: 4.4,
  posZ: 4.7,
  targetX: 0.8,
  targetY: 0,
  targetZ: 4.7
};

function drawScene(projectionMatrix, cameraMatrix) {
  // 从相机矩阵中创建一个视图矩阵
  const viewMatrix = m4.inverse(cameraMatrix);

  let textureWorldMatrix = m4.lookAt(
    [settings.posX, settings.posY, settings.posZ], // position
    [settings.targetX, settings.targetY, settings.targetZ], // target
    [0, 1, 0] // up
  );

  // 使用这个世界矩阵的逆矩阵来创建
  // 一个矩阵，该矩阵会变换其他世界坐标
  // 为相对于这个空间的坐标。
  const textureMatrix = m4.inverse(textureWorldMatrix);

  // 设置对球体和平面都一样的 uniforms
  webglUtils.setUniforms(textureProgramInfo, {
    u_view: viewMatrix,
    u_projection: projectionMatrix,
    u_textureMatrix: textureMatrix,
    u_projectedTexture: imageTexture
  });

  // ...
}
```

当然，你不一定要用 lookAt。你可以任选一种方法来创建一个世界矩阵，例如使用一个场景图或矩阵栈。

在我们运行之前，让我们添加一些缩放比例

```js{10-11,23}
const settings = {
  cameraX: 2.75,
  cameraY: 5,
  posX: 3.5,
  posY: 4.4,
  posZ: 4.7,
  targetX: 0.8,
  targetY: 0,
  targetZ: 4.7,
  projWidth: 2,
  projHeight: 2
};

function drawScene(projectionMatrix, cameraMatrix) {
  // 从相机矩阵中创建一个视图矩阵
  const viewMatrix = m4.inverse(cameraMatrix);

  let textureWorldMatrix = m4.lookAt(
    [settings.posX, settings.posY, settings.posZ], // position
    [settings.targetX, settings.targetY, settings.targetZ], // target
    [0, 1, 0] // up
  );
  textureWorldMatrix = m4.scale(textureWorldMatrix, settings.projWidth, settings.projHeight, 1);

  // 使用这个世界矩阵的逆矩阵来创建
  // 一个矩阵，该矩阵会变换其他世界坐标
  // 为相对于这个空间的坐标。
  const textureMatrix = m4.inverse(textureWorldMatrix);

  // ...
}
```

这样我们就得到了一个投影的纹理。

[webgl-planar-projection](embedded-codesandbox://webgl-fundamental-textures/webgl-planar-projection?view=preview)

但我觉得这样很难看到该纹理所处的空间。让我们添加一个线框立方体来帮助可视化。

首先，我们需要一个单独的着色器集合。这些着色器只能绘制纯色，没有纹理。

```html
<script id="color-vertex-shader" type="x-shader/x-vertex">
  attribute vec4 a_position;

  uniform mat4 u_projection;
  uniform mat4 u_view;
  uniform mat4 u_world;

  void main() {
    // 将 position 乘以矩阵
    gl_Position = u_projection * u_view * u_world * a_position;
  }
</script>

<script id="color-fragment-shader" type="x-shader/x-fragment">
  precision mediump float;

  uniform vec4 u_color;
  void main() {
    gl_FragColor = u_color;
  }
</script>
```

然后我们还需要编译和链接这些着色器

```js{3}
// 设置 GLSL 程序
const textureProgramInfo = webglUtils.createProgramInfo(gl, ['vertex-shader-3d', 'fragment-shader-3d']);
const colorProgramInfo = webglUtils.createProgramInfo(gl, ['color-vertex-shader', 'color-fragment-shader']);
```

然后我们需要一些数据来绘制线框立方体

```js{16-19}
const sphereBufferInfo = primitives.createSphereBufferInfo(
  gl,
  1, // 半径
  12, // 横轴细分数
  6 // 纵轴细分数
);

const planeBufferInfo = primitives.createPlaneBufferInfo(
  gl,
  20, // 宽度
  20, // 高度
  1, // 横轴细分数
  1 // 纵轴细分数
);

const cubeLinesBufferInfo = webglUtils.createBufferInfoFromArrays(gl, {
  position: [0, 0, -1, 1, 0, -1, 0, 1, -1, 1, 1, -1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1],
  indices: [0, 1, 1, 3, 3, 2, 2, 0, 4, 5, 5, 7, 7, 6, 6, 4, 0, 4, 1, 5, 3, 7, 2, 6]
});
```

注意，为了匹配纹理坐标，该立方体在 X 轴和 Y 轴上的范围是 0 到 1。而在 Z 轴上，它的范围是 -1 到 1。这样我们缩放它的时候就能使其在两个方向上都拉伸了。

要使用该立方体的话，我们只需要使用之前的 textureWorldMatrix 就可以了，因为我们要做的是绘制表示那个空间的立方体。

```js
function drawScene(projectionMatrix, cameraMatrix) {
  //...
  // ------ 绘制立方体 ------

  gl.useProgram(colorProgramInfo.program);

  // 设置所有需要的 attributes
  webglUtils.setBuffersAndAttributes(gl, colorProgramInfo, cubeLinesBufferInfo);

  // 在 Z 轴上缩放该立方体，
  // 以便表示该纹理是被投影到无限远的。
  const mat = m4.scale(textureWorldMatrix, 1, 1, 1000);

  // 设置我们计算出来的 unifroms
  webglUtils.setUniforms(colorProgramInfo, {
    u_color: [0, 0, 0, 1],
    u_view: viewMatrix,
    u_projection: projectionMatrix,
    u_world: mat
  });

  // 调用 gl.drawArrays 或者 gl.drawElements
  webglUtils.drawBufferInfo(gl, cubeLinesBufferInfo, gl.LINES);
}
```

有了这些，现在我们可以更加容易地看到投影位于哪里了。

[webgl-planar-projection-with-lines](embedded-codesandbox://webgl-fundamental-textures/webgl-planar-projection-with-lines?view=preview)

有一点需要注意的是，我们并没有真正地投影该纹理。我们在做的是相反的事情。即对被渲染物体的每一个像素，我们判断纹理的哪一部分是被投影到该像素上的，然后再查找该部分纹理上的颜色。

既然我们在上面提到了电影放映机，那么我们如何模拟一台电影放映机呢？我们只需要简单地使用一个投影矩阵来乘以它（即上面的纹理矩阵）

```js{12-13,27,29-43,48-49}
const settings = {
  cameraX: 2.75,
  cameraY: 5,
  posX: 2.5,
  posY: 4.8,
  posZ: 4.3,
  targetX: 2.5,
  targetY: 0,
  targetZ: 3.5,
  projWidth: 1,
  projHeight: 1,
  perspective: true,
  fieldOfView: 45
};

// ...

function drawScene(projectionMatrix, cameraMatrix) {
  // 从相机矩阵中创建一个视图矩阵
  const viewMatrix = m4.inverse(cameraMatrix);

  const textureWorldMatrix = m4.lookAt(
    [settings.posX, settings.posY, settings.posZ], // position
    [settings.targetX, settings.targetY, settings.targetZ], // target
    [0, 1, 0] // up
  );
  // textureWorldMatrix = m4.scale(textureWorldMatrix, settings.projWidth, settings.projHeight, 1);

  const textureProjectionMatrix = settings.perspective
    ? m4.perspective(
        degToRad(settings.fieldOfView),
        settings.projWidth / settings.projHeight,
        0.1, // near
        200
      ) // far
    : m4.orthographic(
        -settings.projWidth / 2, // left
        settings.projWidth / 2, // right
        -settings.projHeight / 2, // bottom
        settings.projHeight / 2, // top
        0.1, // near
        200
      ); // far

  // 使用这个世界矩阵的逆矩阵来创建
  // 一个矩阵，该矩阵会变换其他世界坐标
  // 为相对于这个空间的坐标。
  // const textureMatrix = m4.inverse(textureWorldMatrix);
  const textureMatrix = m4.multiply(textureProjectionMatrix, m4.inverse(textureWorldMatrix));
}
```

注意，我添加了一个选项，可以选择是使用透视投影矩阵还是使用正交投影矩阵。

在绘制线框的时候我们也需要使用那个投影矩阵

```js
// ------ 绘制立方体 ------

// ...

// // 在 Z 轴上缩放该立方体，
// // 以便表示该纹理是被投影到无限远的。
// const mat = m4.scale(textureWorldMatrix, 1, 1, 1000);

// 调整立方体使其匹配该投影
const mat = m4.multiply(textureWorldMatrix, m4.inverse(textureProjectionMatrix));
```

有了这些，我们就得到了

[webgl-planar-projection-with-projection-matrix-0-to-1](embedded-codesandbox://webgl-fundamental-textures/webgl-planar-projection-with-projection-matrix-0-to-1?view=preview)

它已经正常工作了，但我们的投影和我们的线框立方体都只是使用了 0 到 1 的空间，所以它只使用到了投影视椎体的 1/4。

要修复这个问题，首先让我们的立方体在所有方向上都是 -1 到 +1

```js{3-34}
const cubeLinesBufferInfo = webglUtils.createBufferInfoFromArrays(gl, {
  position: [
    //   0,  0, -1,
    //   1,  0, -1,
    //   0,  1, -1,
    //   1,  1, -1,
    //   0,  0,  1,
    //   1,  0,  1,
    //   0,  1,  1,
    //   1,  1,  1,
    -1,
    -1,
    -1,
    1,
    -1,
    -1,
    -1,
    1,
    -1,
    1,
    1,
    -1,
    -1,
    -1,
    1,
    1,
    -1,
    1,
    -1,
    1,
    1,
    1,
    1,
    1
  ],
  indices: [0, 1, 1, 3, 3, 2, 2, 0, 4, 5, 5, 7, 7, 6, 6, 4, 0, 4, 1, 5, 3, 7, 2, 6]
});
```

然后当将其用于纹理矩阵时，我们需要使视椎体内的空间范围是 0 到 1。这可以通过使空间偏移 0.5 然后将其缩放 0.5 倍来实现。

```js{23-26,28-35}
const textureWorldMatrix = m4.lookAt(
  [settings.posX, settings.posY, settings.posZ], // position
  [settings.targetX, settings.targetY, settings.targetZ], // target
  [0, 1, 0] // up
);

const textureProjectionMatrix = settings.perspective
  ? m4.perspective(
      degToRad(settings.fieldOfView),
      settings.projWidth / settings.projHeight,
      0.1, // near
      200
    ) // far
  : m4.orthographic(
      -settings.projWidth / 2, // left
      settings.projWidth / 2, // right
      -settings.projHeight / 2, // bottom
      settings.projHeight / 2, // top
      0.1, // near
      200
    ); // far

// // 使用这个世界矩阵的逆矩阵来创建
// // 一个矩阵，该矩阵会变换其他世界坐标
// // 为相对于这个空间的坐标。
// const textureMatrix = m4.multiply(textureProjectionMatrix, m4.inverse(textureWorldMatrix));

let textureMatrix = m4.identity();
textureMatrix = m4.translate(textureMatrix, 0.5, 0.5, 0.5);
textureMatrix = m4.scale(textureMatrix, 0.5, 0.5, 0.5);
textureMatrix = m4.multiply(textureMatrix, textureProjectionMatrix);
// 使用这个世界矩阵的逆矩阵来创建
// 一个矩阵，该矩阵会变换其他世界坐标
// 为相对于这个空间的坐标。
textureMatrix = m4.multiply(textureMatrix, m4.inverse(textureWorldMatrix));
```

现在，它看起来可以正常工作了

[webgl-planar-projection-with-projection-matrix](embedded-codesandbox://webgl-fundamental-textures/webgl-planar-projection-with-projection-matrix?view=preview)

那么，平面投影一个纹理有什么作用呢？

1. 因为你想要这么做，大多数 3D 建模软件都提供了一种将一个纹理进行平面投影的方法。
2. 另一个作用是贴花（decal）。贴花是一种在物体表面上放置溅射的油漆或爆炸痕迹的方式。要实现贴花，通常不会使用上面着色器的那种做法。相反，你需要写一些函数来遍历需要应用贴花的模型的几何。对于每一个三角形，你需要检查该三角形是否位于该贴花的范围内，这与 JavaScript 的着色器例子中的 inRange 检查一样。对于在贴花范围内的每个三角形，你把该三角形和投影的纹理坐标添加到某个新的几何中。然后你把该贴花添加到你的绘制列表中。

   为贴花生成几何是对的，否则你就需要为 2 个贴花、3 个贴、4 个贴花等等提供不同的着色器，然后你的着色器很快就会变得很复杂，并达到 GPUs 着色器的纹理限制。

3. 还有另一个作用是模拟真实世界的投影映射。你对一个物体进行了 3D 建模，你将会把视频投影到该模型上，你使用了类似上面那样的代码来实现投影，除了你的纹理是视频外。然后你可以编辑并完善该视频，使其匹配该模型，而不用在实际现场中使用一个真正的投影仪。
4. 这种投影的另一个用处就是用阴影映射来计算阴影。

## 在条件语句内的纹理引用

在上面的片段着色器中，在所有的情况下我们都对两个纹理进行了读取

```glsl
  vec4 projectedTexColor = texture2D(u_projectedTexture, projectedTexcoord.xy);
  vec4 texColor = texture2D(u_texture, v_texcoord) * u_colorMult;

  float projectedAmount = inRange ? 1.0 : 0.0;
  gl_FragColor = mix(texColor, projectedTexColor, projectedAmount);
```

为什么我们不像下面这样做呢？

```glsl
if (inRange) {
   gl_FragColor = texture2D(u_projectedTexture, projectedTexcoord.xy);
} else {
   gl_FragColor = texture2D(u_texture, v_texcoord) * u_colorMult;
}
```

摘自 [GLSL ES 1.0 spec Appendix A, Section 6](https://www.khronos.org/files/opengles_shading_language.pdf)

Texture Accesses

Accessing mip-mapped textures within the body of a non-uniform conditional block gives an undefined value. A non-uniform conditional block is a block whose execution cannot be determined at compile time.

换句话说，如果我们要使用 mip-mapped 的纹理，那我们就必须确保总是能够访问到它们。我们可以在条件语句内使用访问纹理的结果。例如我们可以写成这样：

```glsl
vec4 projectedTexColor = texture2D(u_projectedTexture, projectedTexcoord.xy);
vec4 texColor = texture2D(u_texture, v_texcoord) * u_colorMult;

if (inRange) {
   gl_FragColor = projectedTexColor;
} else {
   gl_FragColor = texColor;
}
```

或者这样

```glsl
vec4 projectedTexColor = texture2D(u_projectedTexture, projectedTexcoord.xy);
vec4 texColor = texture2D(u_texture, v_texcoord) * u_colorMult;

gl_FragColor = inRange ? projectedTexColor : texColor;
```

但是我们不能在条件语句内访问 mip-mapped 的纹理本身。这样做在你的 GPU 上可能是可行的，但并不是在所有的 GPUs 上都能行。注意，规范没有说明能否在条件语句内访问 non-mipmapped 的纹理，所以，如果你确定你的纹理是 non-mipmapped 的，那就没什么问题。

无论如何，重要的是你要知道有这么个东西

至于我为什么使用 mix 而不使用基于 inRange 的三元运算符，则只是一个个人喜好。mix 更加灵活，所以我通常这样写。

// TODO https://webglfundamentals.org/webgl/lessons/webgl-ramp-textures.html
