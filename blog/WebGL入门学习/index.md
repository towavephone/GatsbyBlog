---
title: WebGL 入门学习
date: 2021-9-3 17:01:39
categories:
  - 前端
tags: 前端, 可视化, WebGL
path: /webgl-practice-learn/
---

# 前言

对于 WebGL 百度百科给出的解释是 WebGL 是一种 3D 绘图协议，而对此维基百科给出的解释却是一种 JavaScript API。由于 WebGL 技术旨在帮助我们在不使用插件的情况下在任何兼容的网页浏览器中开发交互式 2D 和 3D 网页效果，我们可以将其理解为一种帮助我们开发 3D 网页的绘图技术，当然底层还是 JavaScript API。

# 发展史

WebGL 的发展最早要追溯到 2006 年，WebGL 起源于 Mozilla 员工弗拉基米尔·弗基西维奇的一项 Canvas 3D 实验项目，并于 2006 年首次展示了 Canvas 3D 的原型。这一技术在 2007 年底在 FireFox 和 Opera 浏览器中实现。

2009 年初 Khronos Group 联盟创建了 WebGL 的工作组最初的工作成员包括 Apple、Google、Mozilla、Opera 等。2011 年 3 月 WebGL 1.0 规范发布，WebGL 2 规范的发展始于 2013 年，并于 2017 年 1 月最终完成，WebGL 2 的规范，首度在 Firefox 51、Chrome 56 和 Opera 43 中被支持。

# 基本概念

WebGL 运行在电脑的 GPU 中，因此需要使用能在 GPU 上运行的代码，这样的代码需要提供成对的方法，每对方法中的一个叫顶点着色器而另外一个叫做片元着色器，并且使用 GLSL 语言。将顶点着色器和片元着色器连接起来的方法叫做着色程序。

## 顶点着色器

顶点着色器的作用是计算顶点的位置，即提供顶点在裁剪空间中的坐标值

![](./res/webgl-shaders.gif)

## 片元着色器

片元着色器的作用是计算图元的颜色值，我们可以将片元着色器大致理解成网页中的像素

## 数据获取方式

前面我们提到了顶点着色器和片元着色器的概念，而顶点着色器和片元着色器这两个方法的运行都需要有对应的数据，接下来我们一起来了解一下着色器获取数据的四种方式：

### 属性和缓冲

缓冲是发送到 GPU 的一些二进制数据序列，通常情况下缓冲数据包括位置、方向、纹理坐标、顶点颜色值等。当然你可以根据自己的需要存储任何你想要的数据。属性用于说明如何从缓冲中获取所需数据并将它提供给顶点着色器。

### 全局变量

全局变量在着色程序运行前赋值，在运行过程中全局有效。全局变量在一次绘制过程中传递给着色器的值都一样。

### 纹理

纹理是一个数据序列，可以在着色程序运行中随意读取其中的数据。一般情况下我们在纹理中存储的大都是图像数据，但你也可以根据自己喜欢存放除了颜色数据以外的其它数据

### 可变量

可变量是一种顶点着色器给片元着色器传值的方式

## 小结

WebGL 只关心两件事：裁剪空间中的坐标值和颜色值。使用 WebGL 只需要给它提供这两个东西。因此我们通过提供两个着色器来做这两件事，一个顶点着色器提供裁剪空间坐标值，一个片元着色器提供颜色值。

# 工作原理

了解完 WebGL 的一些基本概念，我们可以一起来看看 WebGL 在 GPU 上的工作都做了些什么。正如我们之前了解到的 WebGL 在 GPU 上的工作主要分为两个部分，即顶点着色器所做的工作（将顶点转换为裁剪空间坐标）和片元着色器所做的工作（基于顶点着色器的计算结果绘制像素点）。

假如我们需要绘制一个三角形，此时 GPU 上进行的工作便是先调用三次顶点着色器计算出三角形的 3 个顶点在裁剪空间坐标系中的对应位置，并通过变量 `gl_Position` 保存在 GPU 中，然后调用片元着色器完成每个顶点颜色值的计算，并通过变量 `gl_FragColor` 将对应的颜色值存储在 GPU 中。完成这些工作后我们已经得到了绘制三角形所需的像素点，最后便是光栅化三角形了。

# 绘制三角形

接下来我们就该实践出真知了，所以我们来看看如何通过 WebGL 在网页中绘制一个简单的三角形。我们知道 WebGL 作为一种 3D 绘图技术本身就是依托于 HTML5 中的 canvas 元素而存在的，所以正式开始绘制之前我们需要进行一系列的准备工作：

## 创建 canvas

首先我们需要创建一个 canvas 元素作为绘制三角形所需的画布，并完成浏览器对 canvas 元素兼容性的测试。

```js
function webglInit() {
  const canvasEl = document.createElement('canvas'); // canvas 元素创建
  canvasEl.width = document.body.clientWidth; // 设置 canvas 画布的宽度
  canvasEl.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight; // 设置 canvas 画布的高度
  document.body.append(canvasEl); // 将创建好的 canvas 画布添加至页面中的 body 元素下
  // 接下来我们需要判断浏览器对于 WebGL 的兼容性，如果浏览器不支持 WebGL 那么我们就不需要再进行下去了
  if (!canvasEl.getContext('webgl') && !canvasEl.getContext('experimental-webgl ')) {
    alert("Your Browser Doesn't Support WebGL");
    return;
  }
  // 如果浏览器支持 WebGL，那么我们就获取 WebGL 的上下文对象并复制给变量 gl
  const context = canvasEl.getContext('webgl') ? canvasEl.getContext('webgl') : getContext('experimental-webgl');
  /*
      设置视口 context.viewport(x, y, width, height);
      x: 用来设定视口的左下角水平坐标。默认值：0
      y: 用来设定视口的左下角垂直坐标。默认值：0
      width: 用来设定视口的宽度。默认值：canvas 的宽度
      height: 用来设定视口的高度。默认值：canvas 的高度
      当你第一次创建 WebGL 上下文的时候，视口的大小和 canvas 的大小是匹配的。然而，如果你重新改变了canvas的大小，你需要告诉 WebGL 上下文设定新的视口，因此这里作为初次创建这行代码可以省略
    */
  context.viewport(0, 0, context.canvas.width, context.canvas.height);
  return context;
}
```

## 绘制顶点着色器、片元着色器

准备好了 canvas 画布下一步就可以开始画三角形了，正如我们平常画画一般，我们需要准备画三角形所需的顶点即顶点着色器，以及三角形对应的填充色即片元着色器

```js
const gl = webglInit();
// 创建顶点着色器 语法 gl.createShader(type) 此处 type 为枚举型值为 gl.VERTEX_SHADER 或 gl.FRAGMENT_SHADER 两者中的一个
const vShader = gl.createShader(gl.VERTEX_SHADER);
// 编写顶点着色器的 GLSL 代码 语法 gl.shaderSource(shader, source); shader - 用于设置程序代码的 webglShader（着色器对象) source - 包含 GLSL 程序代码的字符串
gl.shaderSource(
  vShader,
  `
    attribute vec4 v_position;

    void main() {
      gl_Position = v_position; // 设置顶点位置
    }
  `
);
gl.compileShader(vShader); // 编译着色器代码

const fShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(
  fShader,
  `
    precision mediump float;
    uniform vec4 f_color;
    void main() {
      gl_FragColor = f_color; // 设置片元颜色
    }
  `
); // 编写片元着色器代码
gl.compileShader(fShader); // 编译着色器代码
```

## 连接顶点着色器、片元着色器

```js
// 创建一个程序用于连接顶点着色器和片元着色器
const program = gl.createProgram();
gl.attachShader(program, vShader); // 添加顶点着色器
gl.attachShader(program, fShader); // 添加片元着色器
gl.linkProgram(program); // 连接 program 中的着色器
gl.useProgram(program); // 告诉 WebGL 用这个 program 进行渲染
const color = gl.getUniformLocation(program, 'f_color'); // 获取 f_color 变量位置
gl.uniform4f(color, 0.93, 0, 0.56, 1); // 设置它的值
const position = gl.getAttribLocation(program, 'v_position'); // 获取 v_position 位置
const pBuffer = gl.createBuffer(); // 创建一个顶点缓冲对象，返回其 id，用来放三角形顶点数据，
gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer); // 将这个顶点缓冲对象绑定到 gl.ARRAY_BUFFER 后续对 gl.ARRAY_BUFFER 的操作都会映射到这个缓存
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([0, 0.5, 0.5, 0, -0.5, -0.5]), // 三角形的三个顶点  因为会将数据发送到 GPU，为了省去数据解析，这里使用 Float32Array 直接传送数据
  gl.STATIC_DRAW
); // 表示缓冲区的内容不会经常更改
// 将顶点数据加入的刚刚创建的缓存对象
gl.vertexAttribPointer(
  // 告诉 OpenGL 如何从 Buffer 中获取数据
  position, // 顶点属性的索引
  2, // 组成数量，必须是 1，2，3 或 4。我们只提供了 x 和 y
  gl.FLOAT, // 每个元素的数据类型
  false, // 是否归一化到特定的范围，对 FLOAT 类型数据设置无效
  0, // stride 步长 数组中一行长度，0 表示数据是紧密的没有空隙，让 OpenGL 决定具体步长
  0 // offset 字节偏移量，必须是类型的字节长度的倍数。
);
gl.enableVertexAttribArray(position); // 开启 attribute 变量，使顶点着色器能够访问缓冲区数据
gl.clearColor(0, 1, 1, 1); // 设置清空颜色缓冲时的颜色值
gl.clear(gl.COLOR_BUFFER_BIT); // 清空颜色缓冲区，也就是清空画布
// 语法 gl.drawArrays(mode, first, count); mode - 指定绘制图元的方式 first - 指定从哪个点开始绘制 count - 指定绘制需要使用到多少个点
gl.drawArrays(gl.TRIANGLES, 0, 3);
```

配合 HTML 文件运行上述代码后我们可以在网页中看到如图所示的三角形，且三角形大小根据浏览器窗口大小自适应。

<iframe src="/examples/webgl-practice-learn/draw-triangle.html" width="400" height="100"></iframe>

`embed:webgl-practice-learn/draw-triangle.html`

可以看到仅仅是绘制一个简单的三角形我们就已经写了一大长串的 JS 代码，如果真的用原生 WebGL API 编写一个动态的 3D 交互式网页，那么开发成本可见是极其昂贵的。

# 缺点

上面原生 WebGL API 绘制三角形的例子，充分向我们展示了使用原生 WebGL API 开发 3D 交互式网页存在的问题。

尽管从功能上而言原生 WebGL API 可以满足我们任意场景的开发需要，但是其开发和学习的成本极其昂贵。对于 WebGL 的初学者而言是极度不友好的，我们需要配置顶点着色器用于计算绘制顶点所在的位置，而这对于开发者而言需要一定的数学基础熟悉矩阵的运算，同时也要有空间几何的概念熟悉 3D 物体的空间分布。

而场景的光照，纹理等的设计也都需要对颜色的配置有自己的见解。所以为了给初学者降低难度，下面我将介绍一些 WebGL 开发的常用框架。

# 开发框架

## Three.js

Three.js 是 WebGL 的综合库，其应用范围比较广泛，美中不足的一点是，Three.js 库没有比较全面详细的官方文档，对于使用者而言不是特别友好

## Cesium.js

Cesium.js 是专用于 3D 地图开发的 WebGL 库，其拥有较为全面的 3D 地图开发 API，对于需要开发 3D 地图的开发者而言是一个不错的选择，但针对其他场景的应用开发覆盖的就不是很全面了

## Babylon.js

Babylon.js 是一款国外应用较广泛的 WebGL 库，感兴趣的小伙伴可以自己去了解一下，这里就不做详细介绍了

# 基于 Three.js 绘制旋转立方体

## 初始化环境

```js
// 创建 renderer 变量用于存储渲染器对象
var renderer;
// initThree 函数用来初始化 Three.js 运行所需的环境
function initThree() {
  // 同原生 WebGL 环境搭建过程一样，Three.js 也需要先设置画布 canvas 元素的大小
  width = document.getElementById('canvas-frame').clientWidth; // 设置宽度属性为浏览器窗口宽度
  height = document.getElementById('canvas-frame').clientHeight; // 设置高度属性为浏览器窗口高度
  // 新建一个 WebGL 渲染器并赋值给 renderer 变量
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  // 设置画布大小为浏览器窗口大小
  renderer.setSize(width, height);
  // 将画布元素挂载到页面
  document.getElementById('canvas-frame').appendChild(renderer.domElement);
  // 设置清空画布的颜色为白色
  renderer.setClearColor(0xffffff, 1.0);
}
```

## 绘制相机

接下来不同于原生 WebGL 需要准备顶点着色器和片元着色器，Three.js 需要准备的是相机。Three.js 绘制 3D 网页所需的 3 大基本要素便是相机、场景和物体，当然如果有需要设置明暗效果我们还需要加入第 4 要素光源，光源并不一定需要设置，但是相机、场景和物体是一定有的。

```js
// 创建 camera 变量用于存储相机对象
var camera;
// 初始化相机函数 Three.js 中相机的类型有好几种可以根据具体需要进行选择这里我们要创建的是一个旋转的立方体所以采用的是透视相机，而如果需要创建 3D 阴影效果的场景则需要使用正交相机
function initCamera() {
  /*
    创建透视相机的实例语法 PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )
    fov - 视角
    aspect - 物体的长宽比
    near - 相机近点截图
    far - 相机远点截图
  */
  camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
  camera.position.x = 0; // 设置相机在三维空间坐标中 x 轴的位置
  camera.position.y = 10; // 设置相机在三维空间坐标中 y 轴的位置
  camera.position.z = 5; // 设置相机在三维空间坐标中 z 轴的位置
  camera.up.x = 0;
  camera.up.y = 0;
  camera.up.z = 1;
  camera.lookAt(new THREE.Vector3(0, 0, 0)); // 设置相机的观察点
}
```

## 绘制场景

上一步我们完成了相机的设置，下面我们来准备 Three.js 绘制 3D 网页所需的第二要素场景。

```js
// 创建 scene 变量用于存储场景对象
var scene;
// initScene 函数创建一个场景并赋值给 scene 变量
function initScene() {
  scene = new THREE.Scene();
}
```

## 绘制物体

准备好了相机和场景下面我们就需要设置拍摄的物体了，完成物体的绘制后将其添加到场景中。

```js
// 创建一个 cube 变量用于存放几何立方体
var cube;

// initObject 函数就是我们创建场景的核心了
function initObject() {
  // 首先创建一个一个几何类的实例并赋值给 geometry 变量
  var geometry = new THREE.BoxGeometry(1, 1, 1);
  // 然后创建一种材质的实例 MeshBasicMaterial 材质的构造函数能够创建一种简单的不受场景灯光效果影响的材质
  var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  // Mesh 是一种三角形网格基本单元的构造函数，类似于我们原生 WebGL 中的片元着色器它用于连接几何体和材质
  cube = new THREE.Mesh(geometry, material);
  // 最后将创建好的几何立方体添加到场景中
  scene.add(cube);
}
```

## 场景渲染

到这里我们已经完成了 Three.js 绘制 3D 网页所需的基本配置，当然如果有需要对 3D 网页的明暗效果，灯光颜色做处理的我们还可以在场景中加入灯光的配置，这里由于我们的旋转立方体对于灯光并未有什么特殊的要求，所以我们便直接进入最后一步场景的渲染。

```js
// render 函数提供了浏览器的循环渲染功能
function render() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
// 最后将 Threee.js 环境初始化，场景创建，相机创建渲染器创建以及渲染初始化等函数合成到一起执行我们就完成了一个旋转立方体的绘制
function threeStart() {
  initThree();
  initCamera();
  initScene();
  initObject();
  render();
}
document.addEventListener('DOMContentLoaded', function() {
  threeStart();
});
```

## 配合 html

Three.js 的旋转立方体的绘制还需要配合 HTML 文件使用才能看到效果

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script type="text/javascript" src="./utils/three.js"></script>
    <style type="text/css">
      div#canvas-frame {
        border: none;
        cursor: pointer;
        width: 100%;
        height: 600px;
        background-color: #eeeeee;
      }
    </style>
  </head>
  <body>
    <div id="canvas-frame"></div>
  </body>
</html>
```

配合 HTML 文件运行上述代码后我们可以在网页中看到，一个旋转的绿色立方体

<iframe src="/examples/webgl-practice-learn/draw-cube.html" width="400" height="100"></iframe>

`embed:webgl-practice-learn/draw-cube.html`

## 小结

通过对比我们发现尽管我们通过 Three.js 创建了更为复杂的场景，但是代码量相对 WebGL 原生 API 绘制三角形时反而要少了。由此可见对于初学者而言，直接使用 WebGL 原生 API 进行 3D 网页的开发，显然是不合适的。这时候我们就可以借助像 Three.js 这样的 WebGL 封装库进行开发。

相较之原生 API 的开发，这类第三方封装好的 WebGL 库大大降低了我们的开发成本，同时也能帮助我们开发出更加炫酷的页面效果。当然也不是说原生 API 不好，毕竟如果有能力学透 WebGL 原生 API 的开发还是能够帮助我们在开发 3D 网页的时候实现更加随心所欲的功能，且 Three.js 本身的文档并不是特别完善所以想要顺利的使用同样需要摸透 WebGL 原生 API。
