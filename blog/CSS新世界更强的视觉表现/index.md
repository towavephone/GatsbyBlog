---
title: CSS新世界更强的视觉表现
date: 2022-2-13 00:55:25
path: /css-new-world-stronger-visual-performance/
tags: 前端, CSS, CSS新世界
---

本章介绍 CSS 渐变、CSS 3D 变换、CSS 过渡和 CSS 动画这 4 部分内容，如果没有专门说明，相关 CSS 属性均是被 IE10+ 浏览器支持的。本章介绍的这些 CSS 属性都非常实用，且细节众多，读者需要反复阅读才能理解。

# CSS 渐变

CSS 渐变是 CSS 世界中第一次真正意义上使用纯 CSS 代码创建的图像。它可以应用在任何需要使用图像的场景，因此非常常用，读者一定要牢记相关语法。如果 CSS 的学习有期末考试的话，那么 CSS 渐变一定是必考内容。我们先从最简单的线性渐变学起。

## 深入了解 linear-gradient() 线性渐变

我们从最简单的表示自上而下、从白色到天蓝色的渐变的语法开始：

```css
linear-gradient(white, skyblue);
```

如果渐变方向是自上而下的，就无须专门指定角度，所以在所有线性渐变语法中，to bottom 一定是多余的，代码如下：

```css
/* to bottom 是多余的 */
linear-gradient(to bottom, white, skyblue);
```

如果是其他渐变方向，则需要专门指定。渐变的方向共有两种表示方法，一种是使用关键字 to 加方位值，另一种是直接使用角度值，示意如下：

```css
/* 使用关键字 to 表示渐变方向 */
linear-gradient(to right, white, skyblue);
linear-gradient(to right bottom, white, skyblue);
/* 使用角度值表示渐变方向 */
linear-gradient(45deg, white, skyblue);
linear-gradient(0.25turn, white, skyblue);
```

日常开发更多使用 `to 方位值` 表示法，一方面是因为语义清晰，容易理解与记忆；另一方面是因为项目中的渐变效果要么是对角渐变，要么就是水平或垂直渐变，更适合使用 `to 方位值` 表示法，这种方法实现的渐变不会受到元素的尺寸限制，适用性更广，也无须专门计算角度。例如，使用 CSS 渐变绘制两条对角线来表示没有数据的时候的占位效果，此时只有使用 `to 方位值` 表示法才能适配任意尺寸，CSS 代码示意如下：

```css
img:not([src]) {
   background-color: #eee;
   background-image: linear-gradient(
         to right bottom,
         transparent calc(50% - 1px),
         #ccc calc(50% - 1px),
         #ccc,
         transparent calc(50% + 1px)
      ), linear-gradient(to top right, transparent calc(50% - 1px), #ccc calc(50% - 1px), #ccc, transparent calc(50% +
                  1px));
}
```

此时，无论元素的尺寸是多少，对角线都有符合预期的表现，如图 5-1 所示。

![](res/2022-02-14-09-41-19.png)

[linear-gradient-diagonal](embedded-codesandbox://css-new-world-stronger-visual-performance/linear-gradient-diagonal)

下面着重讲一讲不少人会比较困惑的角度值表示法。先看代码：

```css
.example {
   width: 300px;
   height: 150px;
   border: solid deepskyblue;
   background-image: linear-gradient(45deg, skyblue, white);
}
```

请问这段代码中的 45deg 表示的渐变起始方向是左上角、右上角、左下角还是右下角呢？正确答案是：45deg 表示的渐变的起始方向是左下角。上面代码对应的效果如图 5-2 所示。

![](res/2022-02-14-09-56-39.png)

这个问题回答错了不怪大家，因为 CSS 渐变中的角度值表示的方向和常见的各种设计软件中的渐变的角度值表示的方向不一样。

假设有一个圆盘，圆盘有一个中心点，以这个中心点为起点创建一个指针，在各类设计软件（如 Adobe Photoshop 或者 Keynote）中，指针水平向右表示渐变角度是 0 度，逆时针旋转表示角度值递增，因此指针垂直朝上表示 90 度。图 5-3 所示的是 Adobe Photoshop 软件中渐变方位值和角度值之间的关系，可以看到垂直朝上是 90 度，朝右上方是 45 度，朝右下方是 −45 度。

![](res/2022-02-14-09-59-06.png)

CSS 中有着截然不同的渐变角度和渐变方位关系，规范中对此有专门的描述：

using angles

For the purpose of this argument, “0deg” points upward, andpositive angles represent clockwise rotation, so “90deg” pointtoward the right.（在这个参数中，0deg 表示向上，顺时针旋转是正角度，所以 90deg 表示向右。）

为了便于读者理解，我整理了一个常规渐变和 CSS 渐变角度方位关系对比表，参见表 5-1。

| 角度   | 常规渐变 | css 渐变 |
| :----- | :------- | :------- |
| 0 度   | 向右     | 向上     |
| 正角度 | 逆时针   | 顺时针   |

借助图 5-2 所示的效果，我们可以把 CSS 渐变角度和方位关系标注一下，图 5-4 所示的箭头指向的位置就是 CSS 渐变中 45deg 渐变和 −45deg 渐变角度示意。

![](res/2022-02-14-10-49-50.png)

从图 5-4 中可以明显看出，45deg 渐变的方向是自左下方而来、往右上方而去的，图 5-2 所示的渐变角度也就一目了然了。

另外，如果渐变角度是 0deg，不建议简写成 0。例如，linear-gradient(0, skyblue, white) 这样的写法是不推荐的，因为 IE 浏览器和 Edge 浏览器会认为这是不合法的。

### 渐变的起点和终点

明白了 CSS 线性渐变的角度值对应的方位，再弄清楚线性渐变的起点和终点的位置，理解线性渐变渲染表现就不成问题了。下面举例说明。例如，想一下下面的 CSS 渐变中 skyblue 100px 200px 对应的起止位置在哪里：

```css
.example {
   width: 300px;
   height: 150px;
   border: solid deepskyblue;
   background-image: linear-gradient(45deg, white 100px, skyblue 100px 200px, white 200px);
}
```

这个 100px 的起点位置不是从端点开始的，也不是从元素的某一条边开始的，而是沿着渐变角度所在直线的垂直线开始的，该垂直线就是图 5-5 所示的虚线。因此，最终的线性渐变效果如图 5-6 所示。

![](res/2022-02-14-10-56-15.png)

如果渐变断点中出现了百分比值，那么这个百分比值就是相对渐变的起点到终点的这段距离计算的。

### 关于渐变断点

`<color-stop-list>` 数据类型也就是我们常说的渐变断点，包括众多你可能不知道的细节知识，这些细节知识对所有渐变类型均适用。

1. 渐变断点至少有 2 个颜色值，因此下面这种写法是不合法的：

   ```css
   /* 不合法 */
   linear-gradient(white);
   ```

2. 断点语法中的颜色值和位置值的前后顺序是有要求的，位置值必须在颜色值的后面，因此下面这种写法是不合法的：

   ```css
   /* 不合法 */
   linear-gradient(white, 50% skyblue);
   ```

   需要使用下面这种写法才可以：

   ```css
   /* 合法 */
   linear-gradient(white, skyblue 50%);
   ```

3. 没有指定具体断点位置的时候，各个渐变颜色所形成的色块大小是自动等分的。例如：

   ```css
   linear-gradient(red, orange, yellow, green);
   ```

   其中，red、orange、yellow、green 这 4 种颜色形成了 3 个渐变色块，因此等同于下面的写法：

   ```css
   linear-gradient(red 0%, orange 33.33%, yellow 66.66%, green 100%);
   ```

4. 如果起点和终点的颜色与相邻断点的颜色值一样，则起点色值和终点色值是可以省略的。例如 25% ～ 75% 的渐变效果，不少人是这么写的：

   ```css
   linear-gradient(white, white 25%, skyblue 75%, skyblue);
   ```

   其实前后两个色值可以不用写，直接用下面的 CSS 代码即可：

   ```css
   linear-gradient(white 25%, skyblue 75%);
   ```

5. 渐变的断点位置可以是负数，也可以大于 100%。例如：

   ```css
   linear-gradient(white -50%, skyblue, white 110%)
   ```

6. 在同一个渐变中，不同类型的断点位置值是可以同时使用的。例如：

   ```css
   linear-gradient(white 100px, skyblue 50%);
   ```

   此时，如果渐变范围小于 200px，假设是 160px，则白色的位置（100px）反而会比天蓝色的位置（50% × 160px）靠后，不符合渐变逻辑，那么究竟该如何渲染呢？继续往下看。

7. 当存在多个渐变断点的时候，前面的渐变断点设置的位置值有时候比后面的渐变断点设置的位置值要大，这时后面的渐变断点位置值会按照前面的断点位置值计算。例如：

   ```css
   linear-gradient(skyblue 20px, white 0px, skyblue 40px);
   ```

   会按照下面的语法渲染：

   ```css
   linear-gradient(skyblue 20px, white 20px, skyblue 40px);
   ```

8. 渐变断点还支持一次性设置两个位置值。例如：

   ```css
   linear-gradient(white 40%, skyblue 40% 60%, white 50%);
   ```

   表示 40%～ 60% 这个范围内的颜色都是天蓝色。需要注意的是，这个语法是新语法，IE 浏览器和 Edge 浏览器是不支持的，其他现代浏览器也刚支持没多久，因此，建议大家在生产环境中还是使用传统语法：

   ```css
   linear-gradient(white 40%, skyblue 40%, skyblue 60%, white 50%);
   ```

9. 除渐变断点之外，我们还可以设置颜色的转换点位置，例如：

   ```css
   linear-gradient(white, 70%, skyblue);
   ```

   表示白色和天蓝色渐变的中心转换点位置在 70% 这里，上面代码的效果如图 5-7 所示。该方法可以用来模拟更符合真实世界的立体效果。

   ![](res/2022-02-14-11-29-57.png)

   需要注意的是，IE 浏览器是不支持这个语法的，因此，在生产环境中要谨慎使用。

10. 如果不是高清显示器，则在 Chrome 浏览器中，不同颜色位于同一断点位置的时候，两个颜色连接处可能会有明显的锯齿。例如：

      ```css
      linear-gradient(30deg, red 50%, skyblue 50%);
      ```

      锯齿效果如图 5-8 所示。

      ![](res/2022-02-14-11-37-08.png)

      此时，可以在颜色连接处留 1px 的过渡区间，优化视觉表现：

      ```css
      linear-gradient(30deg, red 50%, skyblue calc(50% + lpx));
      ```

      优化后的效果如图 5-9 所示。

      ![](res/2022-02-14-11-55-20.png)

### 渐变与动画

CSS 渐变中虽然有很多数值，例如角度值、断点位置值等，但是很遗憾，CSS 渐变本质上是一个 `<image>` 图像，因此无法使用 transition 属性实现过渡效果，也无法使用 animation 属性实现动画效果。虽然我们无法直接让渐变背景不停地旋转，但是有间接的方法可以实现 CSS 渐变的动画效果，这个在最后有介绍，这里就不展开了。

## 深入了解 radial-gradient() 径向渐变

径向渐变指的是从一个中心点向四周扩散的渐变效果，光的扩散、波的扩散等都有径向渐变的特性。

在 CSS 中，使用 radial-gradient() 函数表示径向渐变，其语法比较复杂，所以我就琢磨如何让大家比较容易地学习径向渐变的语法。最后我决定通过一个接一个的案例带领大家深入径向渐变的语法，因为每个案例都有对应的效果示意，更加直观，自然更加轻松易懂。

学习这些案例还有一个好处，那就是非常实用。因为本节的径向渐变案例覆盖了几乎所有常见的径向渐变应用场景，所以如果大家在项目中需要使用径向渐变，但又记不清径向渐变的语法细节，就可以翻到本节，找个案例套用一下，就可以实现了。

接下来介绍的这些案例，如果没有专门说明，径向渐变效果就都是作为 background-image 的属性值呈现的。

### 最简单的径向渐变语法

先从最简单的径向渐变说起，CSS 代码如下：

```css
.example {
   width: 300px;
   height: 150px;
   background-image: radial-gradient(white, deepskyblue);
}
```

效果如图 5-10 所示，是一个椭圆渐变效果。

![](res/2022-02-16-11-19-56.png)

从图 5-10 可以看出，径向渐变的方向是由中心往外部的，默认终止于元素的边框内边缘，如图 5-11 所示。

![](res/2022-02-16-11-21-55.png)

所有径向渐变语法都是围绕改变径向渐变的半径值、中心点坐标，以及渐变颜色的起点和终点位置展开的。

### 设置渐变半径的大小

如果希望图 5-10 所示的径向渐变的水平半径只有 50px，垂直半径还是默认大小，则可以设置 50px 50% 作为第一个参数，渐变代码如下：

```css
radial-gradient(50px 50%, white, deepskyblue);
```

效果如图 5-12 所示。

![](res/2022-02-16-11-32-40.png)

如果希望径向渐变的水平半径和垂直半径都是 50px，则无须设置为 50px 50px，直接设置为 50px，当作圆形径向渐变处理即可，代码如下：

```css
radial-gradient(50px, white, deepskyblue);
```

效果如图 5-13 所示。

![](res/2022-02-16-11-34-24.png)

但是要注意，水平半径和垂直半径合写的时候，只能是长度值，不能是百分比值，也就是说下面的语法是不合法的：

```css
/* 不合法 */
radial-gradient(50%, white, deepskyblue);
```

如果想要使用百分比值，就必须给出两个值。例如，下面的语法就是合法的：

```css
/* 合法 */
radial-gradient(50% 50%, white, deepskyblue);
```

### 设置渐变中心点的位置

如果想要改变中心点的位置，我们可以使用 `at <position>` 语法。`<position>` 这个数据类型在 background-position 那里已经详细介绍过了，已经忘记的读者可以翻回去再看看。

例如，如果想让渐变的中心点在左上角，则下面两种写法都是可以的：

```css
radial-gradient(100px at 0 0, white, deepskyblue);
radial-gradient(100px at left top, white, deepskyblue);
```

效果如图 5-14 所示。

![](res/2022-02-16-11-41-50.png)

如果想让渐变的中心点在距离右边缘和下边缘 100px 的位置，则可以使用下面的 CSS 代码：

```css
radial-gradient(100px at right 100px bottom 100px, white, deepskyblue);
```

![](res/2022-02-16-11-45-04.png)

### 设置渐变终止点的位置

如果渐变的中心点不在元素的中心位置，又希望渐变的结束位置在元素的某一侧边缘或某一个边角，那么渐变终止点该怎么设置呢？

CSS 径向渐变语法中提供了专门的数据类型 `<extent-keyword>`，该数据类型包含 4 个关键字，可以指定渐变终止点的位置，如表 5-2 所示。

| 关键字          | 描述                                         |
| :-------------- | :------------------------------------------- |
| closest-side    | 渐变中心距离容器最近的边作为终止位置         |
| closest-corner  | 渐变中心距离容器最近的角作为终止位置         |
| farthest-side   | 渐变中心距离容器最远的边作为终止位置         |
| farthest-corner | 默认值，渐变中心距离容器最远的角作为终止位置 |

各个关键字对应的位置如图 5-16 所示。

![](res/2022-02-16-11-59-01.png)

我们试一下，看看使用关键字 farthest-corner 的渲染效果：

```css
radial-gradient(farthest-corner circle at right 100px bottom 100px, white, deepskyblue);
```

效果如图 5-17 所示，可以看到白色到深天蓝色的渐变一直过渡到左下角。

![](res/2022-02-16-12-01-04.png)

如果图 5-17 看得不是很清晰，我们可以稍微改变下，将渐变转换点位置调整到接近渐变结束点的位置，代码如下：

```css
radial-gradient(farthest-corner circle at right 100px bottom 100px, white, 99%, deepskyblue);
```

此时效果如图 5-18 所示，可以明显看到白色一直延伸到元素左下角位置，表明在这个例子中，farthest-corner 对应的位置就是左下角。

![](res/2022-02-16-12-04-07.png)

上面的例子中出现了一个关键字 circle，它表示一个圆。与之对应的还有一个关键字 ellipse，它表示椭圆。由于径向渐变的默认形状就是椭圆，因此，没有任何一个场景必须要使用 ellipse 关键字。

circle 关键字必须要出现的场景也不多，多用在需要使用 closest-side、closest-corner、farthest-side 或者 farthest-corner 关键字的场景。

### 径向渐变中的语法细节

上面这些示例已经覆盖了常见的径向渐变的语法，是时候给出径向渐变的正式语法了，再看看是否还有遗漏的细节：

```
radial-gradient(
   [
      [ circle || <length> ] [ at <position> ]?, | [ ellipse || [ <length> | <percentage> ]{2} ] [ at <position> ]?, | [ [circle | ellipse ] || [ extent-keyword ] ] [ at <position> ]?, | at <position>,
   ]?
   <color-stop-list> [ , <color-stop-list> ]+
)
```

下面说明一下具体细节。

1. 从 `[ circle || <length> ]` 可以看出，如果只有 1 个值，或者出现了 circle 关键字，后面的值只能是长度值，不能是百分比值，因此下面的语法是不合法的：

   ```css
   /* 不合法 */
   radial-gradient(circle 50%, white, deepskyblue);
   ```

2. circle 关键字和 ellipse 关键字在与半径值或者 `<extent-keyword>` 一起使用的时候，前后顺序是没有要求的，也就是下面的语法都是合法的：

   ```css
   /* 合法 */
   radial-gradient(50px circle, white, deepskyblue);
   radial-gradient(circle farthest-side, white, deepskyblue);
   ```

   但是 `at <position>` 的位置是固定的，其一定是在半径值的后面、渐变断点的前面，否则语法就不合法。例如下面的语法都是不合法的：

   ```css
   /* 不合法 */
   radial-gradient(circle, white, deepskyblue, at center);
   radial-gradient(at 50%, farthest-side, white, deepskyblue);
   ```

最后，如果能一眼就看出下面这些径向渐变代码的效果都是一样的，说明对径向渐变语法的学习合格了：

```css
radial-gradient(white, deepskyblue);
radial-gradient(ellipse, white, deepskyblue);
radial-gradient(farthest-corner, white, deepskyblue);
radial-gradient(ellipse farthest-corner, white, deepskyblue);
radial-gradient(at center, white, deepskyblue);
radial-gradient(ellipse at center, white, deepskyblue);
radial-gradient(farthest-corner at center, white, deepskyblue);
radial-gradient(ellipse farthest-corner at center, white, deepskyblue);
```

### 径向渐变在实际开发中的应用举例

在实际项目中，径向渐变除了用来实现元素本身的渐变效果，还被用来绘制各类圆形图案。例如，给按钮增加白色高光：

```css
button {
   color: #fff;
   background-color: #2a80eb;
   background-image: radial-gradient(160% 100% at 50% 0%, hsla(0, 0%, 100%, 0.3) 50%, hsla(0, 0%, 100%, 0) 52%);
}
```

效果如图 5-19 所示。

![](res/2022-02-18-11-31-31.png)

径向渐变也可以让按钮背景呈现多彩的颜色融合效果：

```css
button {
   color: #fff;
   background-color: #2a80eb;
   background-image: radial-gradient(farthest-side at bottom left, rgba(255, 0, 255, 0.5), transparent), radial-gradient(farthest-corner
            at bottom right, rgba(255, 255, 50, 0.5), transparent);
}
```

效果如图 5-20 所示。

![](res/2022-02-18-11-43-35.png)

径向渐变还可以实现点击按钮的时候，出现一个圆形扩散的效果：

```css
button {
   color: #fff;
   background-color: #2a80eb no-repeat center;
   background-image: radial-gradient(
      closest-side circle,
      rgba(255, 70, 70, 0.9),
      rgba(255, 70, 70, 0.9) 99%,
      rgba(255, 70, 70, 0) 100%
   );
   background-size: 0% 0%;
   transition: background-size 0.2s;
}

button:active {
   background-size: 250% 250%;
}
```

效果如图 5-21 所示，这里为了方便示意，扩散的圆形使用了红色。

![](res/2022-02-18-11-46-57.png)

[radial-gradient-button](embedded-codesandbox://css-new-world-stronger-visual-performance/radial-gradient-button)

径向渐变还可以用来绘制各种波形效果，例如绘制优惠券边缘的波形效果：

```html
<div class="radial-wave"></div>
<style>
   .radial-wave {
      width: 200px;
      height: 100px;
      background: linear-gradient(to top, transparent 10px, red 10px) no-repeat, radial-gradient(
            20px 15px at left 50% bottom 10px,
            red 10px,
            transparent 11px
         );
      background-size: auto, 20px 10px;
   }
</style>
```

效果如图 5-22 所示。

![](res/2022-02-18-11-51-10.png)

[radial-gradient-wave](embedded-codesandbox://css-new-world-stronger-visual-performance/radial-gradient-wave)

径向渐变可以实现的图形效果非常多，就不一一举例了。总而言之，要想将径向渐变用得出神入化，一定要牢牢掌握其语法。

## 了解 conic-gradient() 锥形渐变

锥形渐变是 CSS Images Module Level 4 规范中新定义的一种渐变，也很实用，但其兼容性不太好，IE 浏览器和 Edge 浏览器并不支持，因此只适合在移动端项目和中后台项目中使用。

锥形渐变的语法比径向渐变要简单不少，正式语法如下：

```css
conic-gradient([ from <angle> ]? [ at <position> ]?, <angular-color-stop-list>)
```

可以看出锥形渐变由以下 3 部分组成：

- 起始角度；
- 中心位置；
- 角渐变断点。

其中起始角度和中心位置都是可以省略的，因此，最简单的锥形渐变用法如下：

```css
.example {
   width: 300px;
   height: 150px;
   background-image: conic-gradient(white, deepskyblue);
}
```

效果如图 5-23 所示。

![](res/2022-02-19-11-15-53.png)

图 5-23 所示的锥形渐变渲染的关键要素如图 5-24 所示。

![](res/2022-02-19-11-16-27.png)

我们可以改变起始角度和中心位置，让图 5-23 所示的锥形渐变效果发生变化，例如：

```css
conic-gradient(from 45deg at 25% 25%, white, deepskyblue);
```

渐变起始角度改成 45 度，中心点位置移动到了相对元素左上角 25% 的位置，效果如图 5-25 所示。

![](res/2022-02-19-11-18-45.png)

最后说一下角渐变断点，它的数据类型是 `<angular-color-stop-list>`。角渐变断点与线性渐变和径向渐变的区别在于角渐变断点不支持长度值，支持的是角度值。例如：

```css
conic-gradient(white, deepskyblue 45deg, white)
```

效果如图 5-26 所示，可以明显看到 1 点钟方向的颜色最深。

![](res/2022-02-19-11-33-25.png)

需要注意的是，角渐变断点中设置的角度值是一个相对角度值，最终渲染的角度值是设置的角度值和起始角度累加的值，例如：

```css
conic-gradient(from 45deg, white, deepskyblue 45deg, white);
```

此时 deepskyblue 实际渲染的坐标角度是 90deg（45deg + 45deg），效果如图 5-27 所示，可以明显看到 3 点钟方向的颜色最深。

![](res/2022-02-19-11-36-35.png)

由此可见，锥形渐变中颜色断点角度值和百分比值没有什么区别，两者可以互相转换。一个完整的旋转总共 360 度， 45deg 就等同于 12.5%，因此，下面两段 CSS 代码的效果是一模一样的：

```css
/* 下面两段语句效果一样 */
conic-gradient(white, deepskyblue 45deg, white);
conic-gradient(white, deepskyblue 12.5%, white);
```

如果作为渐变转换点，角度值和百分比值也可以互相转换。例如，下面的两条语句都是合法的：

```css
/* 合法 */
conic-gradient(white, 12.5%, deepskyblue);
/* 合法 */
conic-gradient(white, 45deg, deepskyblue);
```

效果如图 5-28 所示。由于把渐变转换点移动到了 12.5% 的位置（原来是在 50% 位置处），因此渐变的后半部分颜色就比较深。

![](res/2022-02-19-11-47-07.png)

### 锥形渐变的应用举例

用锥形渐变可以非常方便地实现饼状图效果，例如：

```css
.pie {
   width: 150px;
   height: 150px;
   border-radius: 50%;
   background: conic-gradient(yellowgreen 40%, gold 0deg 75%, deepskyblue 0deg);
}
```

效果如图 5-29 所示。

![](res/2022-02-19-11-50-20.png)

[conic-gradient-pie](embedded-codesandbox://css-new-world-stronger-visual-performance/conic-gradient-pie)

其中，可能有人会以为代码部分的 `gold 0deg 75%` 是什么新语法，其实不是的，这个语法在线性渐变那里介绍过（渐变断点第八个细节点），就是颜色值后面紧跟着的两个值表示颜色范围，另外这里 0deg 换成 0% 也是一样的效果，并非必须使用角度值。

注意，重点来了！理论上，这里设置的数值应该是 40%，或者 144deg，而不是 0deg，那为何这里设置 0deg 效果也是正常的呢？至于原因，同样在线性渐变那里介绍过（渐变断点第七个细节点），后面的渐变断点位置值比前面的渐变断点位置值小的时候，后面的渐变断点的位置值会按照前面较大的渐变断点位置值渲染。于是 `gold 0deg 75%` 这里的 0deg 就会使用 `yellowgreen 40%` 中的 40% 位置值进行渲染，同理，`deepskyblue 0deg` 实际是按照 `deepskyblue 75%` 渲染的。也就是说，如果我们想要 A、B 两种渐变颜色界限分明，只要设置 B 颜色的起始位置值为 0% 就可以了，无须动脑子去计算，这算是一个 CSS 实用小技巧。

图 5-30 所示是使用锥形渐变实现的基于色相和饱和度的取色盘，CSS 代码如下：

```css
.hs-wheel {
   width: 150px;
   height: 150px;
   border-radius: 50%;
   background: radial-gradient(closest-side, gray, transparent), conic-gradient(red, magenta, blue, aqua, lime, yellow, red);
}
```

![](res/2022-02-19-11-58-01.png)

[conic-gradient-color-disc](embedded-codesandbox://css-new-world-stronger-visual-performance/conic-gradient-color-disc)

之前演示过使用 CSS 多背景实现灰白网格效果（棋盘效果），如果使用锥形渐变来实现，只需要一行 CSS 代码就足够了：

```css
.checkerboard {
   width: 200px;
   height: 160px;
   background: conic-gradient(#eee 25%, white 0deg 50%, #eee 0deg 75%, white 0deg) 0 / 20px 20px;
}
```

效果如图 5-31 所示。

![](res/2022-02-19-13-42-29.png)

[conic-gradient-grid](embedded-codesandbox://css-new-world-stronger-visual-performance/conic-gradient-grid)

最后一个例子，演示如何借助锥形渐变实现很实用的加载效果，代码如下：

```css
.loading {
   width: 100px;
   height: 100px;
   border-radius: 50%;
   background: conic-gradient(deepskyblue, 30%, white);
   --mask: radial-gradient(closest-side, transparent 75%, black 76%);
   -webkit-mask-image: var(--mask);
   mask-image: var(--mask);
   animation: spin 1s linear infinite reverse;
}

@keyframes spin {
   from {
      transform: rotate(0deg);
   }

   to {
      transform: rotate(360deg);
   }
}
```

效果如图 5-32 所示。

![](res/2022-02-23-09-54-56.png)

原理很简单，图 5-32 所示的其实就是一个锥形渐变，使用 CSS 遮罩属性只让外圈 25% 的范围显示，于是 loading 的圆环效果就出现了。如果想要小尺寸的 loading 效果，直接修改上述 CSS 代码中的 width 属性值和 height 属性值即可。

[conic-gradient-loading](embedded-codesandbox://css-new-world-stronger-visual-performance/conic-gradient-loading)

本例 CSS 代码中出现了 CSS 自定义属性（指 --mask）、CSS 遮罩属性 mask-image 和 CSS 动画属性 animation，它们都是非常实用的 CSS 属性，均会在本书的后面着重介绍，敬请期待。

## 重复渐变

线性渐变、径向渐变和锥形渐变都有对应的重复渐变函数，就是在各自的函数名前面添加 repeating- 前缀，示意如下：

```css
repeating-linear-gradient(transparent, deepskyblue 40px);
repeating-radial-gradient(transparent, deepskyblue 40px);
repeating-conic-gradient(transparent, deepskyblue 40deg);
```

假设上面的语句是作为 background-image 应用在尺寸为 200px×100px 的元素上的，则最终的效果如图 5-33 所示。

![](res/2022-02-23-13-37-26.png)

无论是重复线性渐变、重复径向渐变还是重复锥形渐变，其语法和对应的非重复渐变语法是一模一样的，区别在渲染表现上，非重复渐变的起止颜色位置如果是 0% 和 100%，则可以省略，但是对于重复渐变，起止颜色位置需要明确定义。

重复渐变就这么点内容，很多人会觉得重复渐变复杂难懂，这只是因为对基本的渐变特性了解还不够深入而已。

重复渐变非常适合实现条纹效果。例如，使用 border-image 属性和重复线性渐变实现条纹边框效果，代码如下：

```css
.stripe-border {
   width: 150px;
   height: 200px;
   border: 20px solid;
   /* IE 旧语法 */
   border-image: repeating-linear-gradient(135deg, deepskyblue, deepskyblue 6px, white 7px, white 12px) 20;
   /* 新语法 */
   border-image: repeating-linear-gradient(135deg, deepskyblue 0 6px, white 7px 12px) 20;
}
```

效果如图 5-34 所示。

![](res/2022-02-23-13-40-53.png)

[repeating-gradient-stripe-border](embedded-codesandbox://css-new-world-stronger-visual-performance/repeating-gradient-stripe-border)

# CSS 3D 变换

在所有 3D 成像技术中，最容易学习且最容易上手的技术一定是 CSS 3D 变换技术，即使你不懂 JavaScript 也能实现 3D 效果。因此，不少优秀的设计师能使用 CSS 3D 变换实现很多酷酷的 3D 效果。

## 从常用的 3D 变换函数说起

CSS 位移变换函数包括 translateX()、translateY() 和 translateZ()，其中 translateX() 和 translateY() 属于 2D 变换，translateZ() 属于 3D 变换。此外，CSS 缩放变换函数包括 scaleX()、scaleY() 和 scaleZ()，其中 scaleX() 和 scaleY() 属于 2D 变换，scaleZ() 属于 3D 变换。

于是，就有不少人想当然地认为 CSS 斜切变换函数也包括 skewX()、skewY() 和 skewZ()，其中 skewZ() 属于 3D 函数。这种想法是不正确的，事实上，CSS 斜切变换没有 3D 函数，也就是说 skewZ() 函数是不存在的，自然也不存在 skew3d() 函数，因此下面的写法是不合法的：

```css
/* 不合法 */
transform: skewZ(45deg);
transform: skew3d(0deg, 0deg, 45deg);
```

也有不少人想当然地认为 CSS 旋转变换函数包括 rotateX()、rotateY() 和 rotateZ()，其中 rotateX() 和 rotateY() 属于 2D 变换，rotateZ() 则属于 3D 变换。这种想法也是不正确的，这回倒不是不存在上面 3 种函数，而是 rotateX()、rotateY() 和 rotateZ() 均属于 3D 变换。

加上各种变换的 3D 合法语法，可以得到下面这些属于 3D 变换的 CSS 函数（这些函数不区分大小写）：

```css
translateZ(0);
translate3d(0, 0, 0);
rotateX(0deg)
rotateY(0deg)
rotateZ(0deg);
rotate3d(1, 1, 1, 45deg);
scaleZ(1);
scale3d(1, 1, 1);
matrix3d(
   1, 0, 0, 0,
   0, 1, 0, 0,
   0, 0, 1, 0,
   0, 0, 0, 1
);
```

其中，matrix3d() 函数表示使用 3D 矩阵表示 3D 变换效果，共需要 16 个参数，由于过于复杂且使用概率较小，因此本书不做介绍。rotate3d() 函数的语法比较特别，这里专门讲一下。

在展开介绍 rotate3d() 函数之前，我们有必要先了解一下 CSS 中的 3D 坐标。CSS 中的 3D 坐标如图 5-35 所示，横向为 x 轴，垂直为 y 轴，纵向为 z 轴，箭头所指的方向为偏移正值对应的方向。

![](res/2022-02-25-14-31-51.png)

下面正式开始介绍 rotate3d() 函数，rotate3d() 函数的语法如下：

```css
rotate3d(x, y, z, angle);
```

其中，参数 x、y、z 分别表示旋转向量的 x 轴、y 轴、z 轴的坐标。参数 angle 表示围绕该旋转向量旋转的角度值，如果为正，则顺时针方向旋转；如果为负，则逆时针方向旋转。有不少人看到“向量”就想起了大学时候被数学支配的恐惧，不过这里 3D 旋转的向量很简单，就是一条以坐标原点为起点，以坐标 (x, y, z) 为终点的直线，所谓 3D 旋转就是元素绕着这条直线旋转而已，例如：

```css
transform: rotate3d(1, 1, 1, 45deg);
```

表示元素绕着坐标 (0, 0, 0) 和坐标 (1, 1, 1) 连成的向量线旋转 45 度，图 5-36 中蓝色箭头所示即向量。

![](res/2022-02-25-14-39-50.png)

如果此时有一个正面印有数字 1、上下分别印有数字 5 和 6、左右分别印有数字 4 和 3 的立方体应用 rotate3d(1, 1, 1, 45deg)，那么它的 3D 旋转效果如图 5-37 所示。

![](res/2022-02-25-14-42-28.png)

按照我多年实践的经验，rotate3d() 函数很少会被用到，因为大多数的 3D 效果都是很简单的旋转效果，开发者往往使用更简单的 rotateX()、rotateY() 和 rotateZ() 函数。其中 rotateY() 函数是所有 3D 变换函数中最高频使用的函数之一，因此，本书就以 3D 旋转为切入点，带领大家快速进入 3D 变换的世界。

3D 旋转变换有下面 3 个函数：

- rotateX(angle)；
- rotateY(angle)；
- rotateZ(angle)。

它们分别表示绕着三维坐标的 x 轴、y 轴和 z 轴旋转。其中，rotateX() 函数的表现反映在现实世界中，就如体操运动员的单杠旋转；rotateY() 函数的表现反映在现实世界中，就如旋转木马围绕中心柱旋转；rotateZ() 函数的表现反映在现实世界中，就如正面观察摩天轮的旋转。

使用简单的图形演示以上 3 个旋转函数，就有图 5-38 所示的效果。

![](res/2022-02-25-14-44-10.png)

## 必不可少的 perspective 属性

perspective 的中文意思是透视、视角。perspective 属性的存在与否决定了你所看到的画面是二维的还是三维的，这不难理解，即没有透视，不成 3D。学美术或者学建筑的读者肯定接触过透视的一些东西。例如，图 5-39 所示的透视效果。

![](res/2022-02-25-14-46-31.png)

不过，CSS 3D 变换的透视点与图 5-39 所示的有所不同，CSS 3D 变换的透视点在显示器的前方。例如，显示器宽度是 1680px，浏览器中有一个 `<img>` 元素设置了下面的 CSS 代码：

```css
img {
   perspective: 2000px;
}
```

这就意味着这张图片的 3D 视觉效果和本人在距离 1.2 个显示器宽度远的地方（1680×1.2≈2000）所看到的真实效果是一致的，如图 5-40 所示。

![](res/2022-02-25-14-48-02.png)

## 用 translateZ() 函数寻找透视位置

如果说 rotateX()、rotateY() 和 rotateZ() 可以帮你理解三维坐标，那么 translateZ() 则可以帮你理解透视位置。我们都知道“近大远小”的道理，translateZ() 函数的功能就是控制元素在视觉上的远近距离。例如，如果我们设置容器元素的 perspective 属性值为 201px：

```css
.container {
   perspective: 201px;
}
```

那么就会有以下几种情况。

- 子元素设置的 translateZ() 函数值越小，则子元素的视觉大小越小，因为子元素在视觉上远去，我们眼睛看到的子元素的视觉尺寸就会变小。
- 子元素设置的 translateZ() 函数值越大，该元素的视觉大小也会越大，因为元素在视觉上越近，看上去也就越大。
- 当子元素设置的 translateZ() 函数值非常接近 201 像素，但是不超过 201 像素的时候（如 200 像素），该元素就会撑满整个屏幕（如果父元素没有类似 overflow: hidden 的限制的话）。因为这个时候，子元素正好移到了你的眼睛前面，看起来非常大，所谓“一叶障目，不见泰山”，就是这么回事。
- 当子元素设置的 translateZ() 函数值再变大，即超过 201 像素的时候，就看不见该元素了——这很好理解，我们是看不见眼睛后面的东西的！

[translateZ-perspective](embedded-codesandbox://css-new-world-stronger-visual-performance/translateZ-perspective)

拖动滑杆控制子元素的 translateZ() 函数值，大家会发现当值为 −100 的时候视觉尺寸最小；随着值慢慢变大（例如值为 40 的时候），子元素的视觉尺寸明显变大；等到值继续增加到 200 的时候，会发现子元素充满了整个屏幕；而值是 250 的时候，由于子元素已经在透视点之外，因此是看不见子元素的，子元素如消失一般。整个视觉变化过程如图 5-41 所示。

![](res/2022-02-28-14-03-10.png)

此时，我们再换一个视角，从侧面观察 translateZ() 函数的作用原理，如图 5-42 所示，可以更清楚地明白为什么 translateZ() 函数值会影响元素的视觉尺寸。

![](res/2022-02-28-14-04-15.png)

## 指定 perspective 透视点的两种写法

有两种书写形式可以指定元素的透视点，一种设置在舞台元素上，也就是设置在 3D 渲染元素的共同父元素上；第二种是设置在当前 3D 渲染元素上，与 transform 其他变换属性值写在一起，代码示例如下：

```css
.stage {
   perspective: 600px;
}

.box {
   transform: rotateY(45deg);
}
```

第二种：

```css
.stage .box {
   transform: perspective(600px) rotateY(45deg);
}
```

[perspective-two-way-writing](embedded-codesandbox://css-new-world-stronger-visual-performance/perspective-two-way-writing)

看到的效果如图 5-43 所示，其中左侧的是 perspective 属性写法，右侧的是 perspective() 函数写法。

![](res/2022-02-28-14-10-21.png)

仔细对比图 5-43 左右两侧图形的效果，会发现虽然透视点设置的方法不一样，但是效果貌似是一样的。果真是这样吗？其实不然，图 5-43 左右两侧图形的效果之所以会一样，是因为舞台上只有一个元素，因此，两种书写形式的表现正好一样。如果舞台上有多个元素，那么两种书写形式的表现差异就会立刻显示出来，如图 5-44 所示。

![](res/2022-02-28-14-11-13.png)

图 5-44 所示的效果其实不难理解。图 5-44 上面一排元素把整个舞台作为透视元素，也就是我们看到的每个子元素都共用同一个透视点，因此每一个子元素的视觉形状都不一样，这个效果比较符合现实世界的 3D 透视效果。例如视线前方有一排人，远处的人只能被看到侧脸，近处的人可以被看到正脸。而图 5-44 下面一排元素中的每个子元素都有一个自己独立的透视点，加上旋转的角度又是一样的，因此每个元素看上去也就一模一样了。

[perspective-two-way-writing-diff](embedded-codesandbox://css-new-world-stronger-visual-performance/perspective-two-way-writing-diff)

## 理解 perspective-origin 属性

perspective-origin 属性很好理解，表示我们的眼睛相对 3D 变换元素的位置，你可以通过改变眼睛的位置来改变元素的 3D 渲染效果，原理如图 5-45 所示。

![](res/2022-02-28-14-13-19.png)

正式语法如下：

```css
perspective-origin: <position>;
```

一看到 `<position>` 数据类型，就应该赶快回想起 background-position 属性支持哪些值，也就知道了 perspective-origin 属性支持哪些值。例如，下面这些语句都是合法的：

```css
perspective-origin: top left;
perspective-origin: right 20px bottom 40%;
perspective-origin: 50% 50%;
perspective-origin: -200% 200%;
perspective-origin: 20cm 100ch;
```

perspective-origin 属性初始值是 50% 50%，表示默认的透视点是舞台或元素的中心。但是有时候，需要让变换的元素不在舞台的中心，或让透视角度偏上或者偏下，此时就可以通过设置 perspective-origin 属性值实现。

图 5-46 所示的就是一个立方体应用 perspective-origin: 25% 75% 声明后的透视效果图。

![](res/2022-02-28-14-18-33.png)

## transform-style: preserve-3d 声明的含义

transform-style 支持两个关键字属性值，分别是 preserve-3d 和 flat，语法如下：

```css
transform-style: preserve-3d;
transform-style: flat;
```

先讲一下这一语法中的几个关键点。

- preserve-3d 表示应用 3D 变换的元素位于三维空间中，preserve-3d 属性值的渲染表现更符合真实世界的 3D 表现。
- flat 是默认值，表示应用 3D 变换的元素位于舞台或元素的平面中，其渲染表现类似“二向箔”，把三维空间压缩在舞台元素的二维空间中。

我们通过一个例子直观地了解一下 preserve-3d 和 flat 这两个属性值的区别，HTML 和 CSS 代码如下：

```html
<section class="stage preserve-3d">
   <div class="box"></div>
</section>

<section class="stage">
   <div class="box"></div>
</section>

<style>
   .stage {
      width: 150px;
      height: 150px;
      background-color: rgba(0, 191, 255, 0.75);
      perspective: 600px;
   }

   .box {
      height: 100%;
      opacity: 0.75;
      background-color: darkred;
      transform: rotateY(45deg);
   }

   .preserve-3d {
      transform-style: preserve-3d;
   }
</style>
```

应用了 transform-style: preserve-3d 声明的 3D 变换元素有部分区域藏到了舞台元素的后面，因为此时整个舞台按照真实的三维空间渲染，自然看不到旋转到后面的图形区域，如图 5-47 左侧图形所示。默认情况下，元素无论怎么变换，其 3D 效果都会被渲染在舞台元素所在的二维平面之上，因此没有视觉上的穿透效果，如图 5-47 右侧图形所示。

![](res/2022-02-28-14-24-42.png)

[transform-style](embedded-codesandbox://css-new-world-stronger-visual-performance/transform-style)

需要注意的是，transform-style 属性需要用在 3D 变换元素的父元素上，也就是舞台元素上才有效果。

## backface-visibility 属性的作用

在 CSS 世界中，一个元素的背面表现为其正面图像的镜像，因此，当我们使用翻转效果使其背面展示在用户面前的时候，显示的是该元素正面图像的镜像。

这一特性和现实中的 3D 效果并不一致，例如我们要实现扑克牌翻转的 3D 效果，很显然，扑克牌的背面一定是花纹，不可能是正面的牌号。因此，当我们对扑克牌进行翻转使其背面展示在用户面前的时候，显示扑克牌的正面镜像显然是不合理的。我们需要隐藏扑克牌元素的背面，至于扑克牌背面花纹的效果，我们可以使用其他元素进行模拟，然后让前后两个元素互相配合来实现 3D 扑克牌翻转效果。这个控制扑克牌的背面不显示的 CSS 属性就是 backface-visibility。

backface-visibility 属性语法如下：

```css
backface-visibility: hidden;
backface-visibility: visible;
```

其中，visible 是默认值，也就是元素翻转时背面是可见的；如果 backface-visibility 的属性值是 hidden，则表示元素翻转时背面是不可见的。

我们通过一个例子直观地了解一下 hidden 和 visible 这两个属性值的区别，HTML 和 CSS 代码如下：

```html
<section class="stage backface-hidden">
   <div class="box"></div>
   <div class="box"></div>
</section>

<section class="stage">
   <div class="box"></div>
   <div class="box"></div>
</section>

<style>
   .stage {
      width: 150px;
      height: 150px;
      border: 1px solid darkgray;
      perspective: 600px;
      transform-style: preserve-3d;
   }

   .box {
      width: inherit;
      height: inherit;
      opacity: 0.75;
      background-color: darkred;
      transform: rotateY(225deg);
   }

   .box:first-child {
      transform: rotateY(-45deg);
      background-color: darkblue;
      position: absolute;
   }

   .backface-hidden .box {
      backface-visibility: hidden;
   }
</style>
```

设置了 backface-visibility: hidden 后，绕 y 轴旋转 225 度后元素被隐藏了，因为 rotateY 值在大于 180 度、小于 360 度的时候，我们看到的就是元素的背面了，如图 5-48 左侧所示；而 backface-visibility 属性值是 visible 的元素绕 y 轴旋转 225 度后依然清晰可见，效果如图 5-48 右侧所示。

![](res/2022-03-02-14-02-45.png)

[backface-visibility](embedded-codesandbox://css-new-world-stronger-visual-performance/backface-visibility)

## 值得学习的旋转木马案例

这里举一个图片列表旋转木马效果案例，它可以用来替换常见的 2D 轮播效果，如果读者能弄明白这个例子，那么对 CSS 3D 变换的学习就算是合格了。

[3d-marquee](embedded-codesandbox://css-new-world-stronger-visual-performance/3d-marquee)

实现的效果如图 5-49 所示，点击任意图片可以看到图片列表的旋转木马效果。

![](res/2022-03-02-14-12-33.png)

### 实现原理

这个案例用到的 CSS 属性就是前面提到的几个常用 CSS 属性，包括透视、3D 变换和三维空间设置。

首先，HTML 代码结构如下：

```
舞台
   容器
      图片
      图片
      图片
      ......
```

相关 HTML 代码是：

```html
<div class="stage">
   <div id="container" class="container">
      <img class="piece" src="1.jpg" style="--index:0;" />
      <img class="piece" src="2.jpg" style="--index:1;" />
      <img class="piece" src="3.jpg" style="--index:2;" />
      <img class="piece" src="4.jpg" style="--index:3;" />
      <img class="piece" src="5.jpg" style="--index:4;" />
      <img class="piece" src="6.jpg" style="--index:5;" />
      <img class="piece" src="7.jpg" style="--index:6;" />
      <img class="piece" src="8.jpg" style="--index:7;" />
      <img class="piece" src="9.jpg" style="--index:8;" />
   </div>
</div>
```

对于舞台，需要为其设置视距，例如设置为 800px：

```css
.stage {
   perspective: 800px;
}
```

对于容器，需要为其添加 3D 视图声明：

```css
.container {
   transform-style: preserve-3d;
}
```

然后就是图片元素了，为了方便定位，我们让所有图片应用 position: absolute 声明，共用一个 3D 变换中心点。

显然，图片旋转木马的运动方式需要应用的 3D 变换函数是 rotateY() 函数。因此，图片元素需要设置的 rotateY() 函数值就是 360 度除以图片数量后的计算值，这里有 9 张图片，则每张图片的旋转角度比前一张图片多 40 度（360 / 9 = 40）。如果需要兼容 IE 浏览器，我们可以这样书写：

```css
img:nth-child(1) {
   transform: rotateY(0deg);
}

img:nth-child(2) {
   transform: rotateY(40deg);
}

img:nth-child(3) {
   transform: rotateY(80deg);
}

img:nth-child(4) {
   transform: rotateY(120deg);
}

img:nth-child(5) {
   transform: rotateY(160deg);
}

img:nth-child(6) {
   transform: rotateY(200deg);
}

img:nth-child(7) {
   transform: rotateY(240deg);
}

img:nth-child(8) {
   transform: rotateY(280deg);
}

img:nth-child(9) {
   transform: rotateY(320deg);
}
```

如果无须兼容 IE 浏览器，我们可以使用 CSS 自定义属性实现：

```css
img {
   transform: rotateY(calc(var(--index) * 40deg));
}
```

虽然 9 张图片的方位都不一样，但由于它们共用一个 3D 变换中心点，因此一定会挤成一团，如图 5-50 所示，图片挤成一团的效果显然不是我们需要的，我们需要拉开图片之间的距离。

![](res/2022-03-02-14-29-42.png)

如何拉开距离呢？其实很简单。我们可以把 9 张图片想象成 9 个人，现在这 9 个人站在一起分别面朝不同的方位，这 9 个人是不是只要每个人向前走 4 ～ 5 步，彼此之间的距离就拉开了？不妨想象一下夜空中礼花绽开的场景。这里的向前走 4 ～ 5 步的行为，就相当于应用 translateZ() 函数的行为，当 translateZ() 函数值为正值的时候，元素会向其面对的方向走去。

现在只剩下一个问题了：要向前走多远呢？这个距离是有计算公式的！这 9 张图片宽度均是 128px，因此就有图 5-51 所示的理想方位效果。

![](res/2022-03-02-14-33-56.png)

图 5-51 中使用红色标注的 r 就是图片需要设置的 translateZ() 函数的理想值，使用该值可以让所有图片无缝围在一起。

r 的计算比较简单：$ r = 64 / tan(20 ^ \circ) \approx 175.8 $

为了好看，图片左右两边可以留点间距，例如 20px，最终得到需要使用的 translateZ() 函数值为 175.8 + 20 = 195.8。于是，最终图片元素设置的 transform 属性值是：

```css
transform: rotateY(calc(var(--index) * 40deg)) translateZ(195.839px);
```

最后，要让图片旋转起来，只要让容器每次旋转 40 度就可以了，这个可以使用 CSS 动画完成，或者使用 JavaScript 设置也是可以的。理解了旋转木马 3D 效果实现原理，其他 3D 效果基本上就都可以轻松驾驭了。

## 3D 变换与 GPU 加速

3D 变换除了用来实现 3D 效果，还经常被用来开启 GPU 加速，例如实现左位移 100px，下面两种写法都是有效的：

```css
transform: translate(-100px, 0);
transform: translate3d(-100px, 0, 0);
```

但是，使用 translate3d() 函数的变换效果性能要更高，因为使用该函数会开启 GPU 加速。然后问题就来了，很多开发者一看到“性能更好”就激动了，遇到了元素变换效果就使用 3D 变换，甚至实现其他简单的图形表现时也会添加一段无关紧要的 CSS 3D 变换代码，例如：

```css
transform: translateZ(0);
```

这是一个很糟糕的做法，Web 网页是如此简单，2D 变换原本的性能就很高，根本就没有任何必要去开启 GPU 加速，没有遇到任何一个场景非得使用 3D 变换才不卡顿的。要知道，不必要的 GPU 加速会增加内存的使用，这会影响移动设备的电池寿命。因此，我直接就下结论了：单纯的 2D 变换请一定使用 2D 变换函数，没有任何理由需要使用 3D 变换函数，此时让 GPU 加速是一种糟糕的做法。

# CSS 过渡

使用 transition 属性可以实现元素 A 状态到 B 状态的过渡效果，经常使用 :hover 伪类或者 :active 伪类触发。

目前，我们已经无须给 transition 属性增加私有前缀了，无论是什么项目都不需要。IE 浏览器从 IE10 版本开始，就从未支持过 -ms- 私有前缀，完全没有任何需要添加 -ms- 私有前缀的理由。

至于添加 -moz- 和 -webkit- 私有前缀也是很多年以前的事情了，目前已经无须再添加。即使有个别用户使用的是非常古老的浏览器也没有关系，因为 transition 是一个体验增强的 CSS 属性，即使浏览器不支持，也只会导致一些交互效果生硬一点，对页面功能没有任何影响。

transition 是一个常用属性，相信基础的知识大家都比较了解，因此，接下来我只会介绍一些我认为读者可能不知道的关于 transition 属性的知识。

## 你可能不知道的 transition 属性知识

transition 属性是一个缩写属性，它是 transition-duration、transition-delay、transition-property、transition-timing-function 这 4 个 CSS 属性的缩写，每一个 CSS 属性的背后都有大家所不知道的细节。

### transition-duration 属性

transition-duration 属性表示过渡时间，它的值可以是 0，但是不能是负值，其他就没什么好说的……真的是这样吗？请看下面这段 CSS 声明：

```css
transition: 1s 0.5s;
```

很多开发者都知道，第一个时间值 1s 表示过渡时间，第二个时间值表示延时时间（transition-delay），这两个时间值的顺序是固定的，绝对不能调换，否则含义会颠倒过来。久而久之大家容易陷入一个误区，认为 transition 属性如果设置了两个时间值，其顺序必须是固定的，其实不然！有一种场景下 transition 属性的两个时间值的顺序是可以任意调换的。什么场景呢？就是其中一个时间值是负值的时候。例如，下面两句 CSS 声明都是合法的，且含义一模一样：

```css
/* 效果一样 */
transition: 2s -1s;
transition: -1s 2s;
```

原因就在于不起眼的“transition-duration 不能是负值”的特性，所以上面代码中的 −1s 只能是 transition-delay 的属性值，两个值就可以无序排列。

### transition-delay 属性

transition-delay 属性用来指定延时过渡效果执行的时间，单位是 s（秒）或者 ms（毫秒），其值可以是负值，例如：

```css
transition-delay: 200ms;
transition-delay: 2s;
transition-delay: -0.5s;
```

当 transition-delay 属性值为负值的时候，会带来一个很有意思的现象，那就是可以省略部分动画进程，例如：

```css
.example {
   transform: translateX(0);
   transition-duration: 1s;
   transition-delay: -0.5s;
}

.example:hover {
   transform: translateX(100px);
}
```

此时当鼠标经过 .example 元素的时候，元素的 transform 位移位置不是从 0 开始，而是从靠近 50px 的位置开始的，且过渡效果执行的时间不是 1s，而是 0.5s，因为最终过渡执行的时间等于动画过程时间加动画延时时间，也就是 `1s + (−0.5s) = 0.5s`。

transition-delay 属性有一个隐蔽的但却很实在的作用，那就是可以提高用户的交互体验。例如，使用 :hover 伪类实现的浮层是一种很常见的交互效果，传统的效果都是鼠标指针一旦经过元素，浮层立即出现。这其实是有问题的，因为鼠标非常容易误触该交互效果。优秀的交互体验是会增加一定的延时判断的，也就是如果鼠标指针快速经过元素，会被认为是不小心经过，浮层就不会出现。

想要实现这个交互效果，目前只能使用 transition-delay 属性，请看下面这个具体的案例：

```html
<a href class="target">显示图片</a> <img src="1.jpg" />
```

当鼠标指针经过“显示图片”这个链接的时候，浮层图片在鼠标指针停留在元素上一定的时间后才会显示，使用的 CSS 代码如下：

```css
.target + img {
   transition-delay: 0.2s;
   visibility: hidden;
}

.target:hover + img {
   visibility: visible;
}
```

此时鼠标指针悬停在 `显示图片` 上 200ms 之后浮层图片才会显示，效果如图 5-52 所示。

![](res/2022-03-03-15-29-22.png)

[transition-delay](embedded-codesandbox://css-new-world-stronger-visual-performance/transition-delay)

### transition-property 属性

transition-property 属性用来设置应用过渡效果的 CSS 属性，其初始值是 all，表示默认所有 CSS 属性都应用过渡效果。

不知道“初始值是 all”有没有让你意识到什么。我已经记不清有多少次见到过下面的 CSS 代码了：

```css
transition: all 0.2s;
```

上面这段 CSS 代码的语法和功能都没有问题，表示所有 CSS 属性都执行 0.2s 的过渡效果，那问题在哪里呢？问题就在于其中的 all 完全是多余的，直接写成下面的 CSS 代码就可以了：

```css
transition: 0.2s;
```

也就是我们只需要指定过渡时间就可以了。

不过不是所有 CSS 属性都支持过渡效果，例如 display 属性就不支持过渡效果，而且，不支持也就罢了，有时候还会“搞破坏”。例如设置了 transition 过渡效果的元素应用 display: none 时，过渡效果会被瞬间中断，导致 transitionend 事件不会被触发。

因此，如果希望元素有过渡效果，同时可以隐藏，请使用 visibility 属性，visibility 属性在 CSS Transition 过渡效果中很实用，后面会专门对此进行介绍。

transition-property 支持任意 `<custom-ident>` 数据类型值，不需要是合法的 CSS 属性名称，例如下面语句也是合法的：

```css
/* 合法 */
transition-property: 笑脸-©;
```

但是该属性不支持以数字或引号开头的数据类型，关于 `<custom-ident>` 数据类型的深入介绍参见之后章节。

最后，我们可以同时设置多个参与过渡效果的 CSS 属性，使用逗号分隔，例如：

```css
transition-property: color, background-color, opacity, transform;
```

下面讲一下属性值列表的长度不同时的样式计算规则。用一句话概括就是“有缺则补，多之则除”。例如：

```css
div {
   transition-property: opacity, left, top;
   transition-duration: 3s, 5s;
}

div {
   transition-property: opacity, left, top, height;
   transition-duration: 3s, 5s;
}
```

等同于：

```css
div {
   transition-property: opacity, left, top;
   transition-duration: 3s, 5s, 3s;
}

div {
   transition-property: opacity, left, top, height;
   transition-duration: 3s, 5s, 3s, 5s;
}
```

如果 transition-property 的属性值列表长度过短，则其他过渡属性多余的列表值会被忽略。例如：

```css
div {
   transition-property: opacity, left;
   transition-duration: 3s, 5s, 2s, 1s;
}
```

等同于：

```css
div {
   transition-property: opacity, left;
   transition-duration: 3s, 5s;
}
```

子属性支持逗号分隔，自然 transition 缩写属性也支持逗号分隔多个独立的过渡效果设置。例如：

```css
.example {
   transition: opacity 0.2s, transform 0.5s;
}
```

### transition-timing-function 属性

transition-timing-function 属性通过设置过渡时间函数来影响过渡效果的过渡速率，transition-timing-function 属性和 animation-timing-function 支持的属性值类型一致，总共分为三大类。

- 线性运动类型：使用 linear 表示。
- 三次贝塞尔时间函数类型：ease、ease-in、ease-out、ease-in-out 等关键字和 cubic-bezier() 函数。
- 步进时间函数类型：step-start、step-start 等关键字和 steps() 函数。

transition-timing-function 属性平常用得很少，因为默认值 ease 就可以应付几乎所有场景了。

例如我写了 10 多年 CSS 代码，在 CSS Transition 过渡效果中从未使用过线性运动类型和步进时间函数类型（对天发誓一次都没有用过），不过我倒是在 CSS 动画效果中经常用到它们，因此这部分内容会在 5.4 节深入介绍。至于贝塞尔时间函数类型，则偶尔会在 CSS Transition 过渡效果中用到，因此，可以在这里详细介绍一下。

## 了解三次贝塞尔时间函数类型

“贝塞尔”源于著名的法国工程师 Pierre Bézier 的名字，Pierre Bézier 最杰出的贡献是发明了贝塞尔曲线，奠定了计算机矢量图形学的基础，因为有了贝塞尔曲线之后，无论是直线或曲线都能在数学上予以描述。

三次贝塞尔时间函数类型写作 `<cubic-bezier-timing-function>`，其正式语法如下：

```css
<cubic-bezier-timing-function> = ease | ease-in | ease-out | ease-in-out | cubic-bezier(<number>, <number>, <number>, <number>)
```

其中，ease、ease-in、ease-out、ease-in-out 这几个关键字是计算机领域通用的运动函数关键字，其贝塞尔函数值是固定的，在其他图形语言中也是适用的，具体分析如下。

- ease：等同于 cubic-bezier(0.25, 0.1, 0.25, 1.0)，是 transition-timing-function 属性的默认值，表示过渡的时候先加速再减速。该时间函数曲线如图 5-53 所示，横坐标是时间，纵坐标是进程，曲线越陡速率越快，曲线越缓速率越慢。

   ![](res/2022-03-03-16-13-36.png)

- ease-in：等同于 cubic-bezier(0.42, 0, 1.0, 1.0)，表示过渡速度刚开始慢，然后过渡速度逐渐加快。单词 in 表示进入的意思，非常符合先慢后快，例如剑插入剑鞘，线穿进针里，都是先慢慢瞄准，再快速进入的。该时间函数曲线如图 5-54 所示。

   ![](res/2022-03-03-16-18-42.png)

- ease-out：等同于 cubic-bezier(0, 0, 0.58, 1.0)，表示过渡刚开始速度快，然后速度逐渐变慢。单词 out 表示移出的意思，非常符合先快后慢，例如拔剑是先快后慢。该时间函数曲线如图 5-55 所示。

   ![](res/2022-03-03-16-19-34.png)

- ease-in-out：等同于 cubic-bezier(0.42, 0, 0.58, 1.0)，表示过渡刚开始速度慢，然后速度逐渐加快，最后再变慢。该时间函数曲线如图 5-56 所示。ease-in-out 是一个对称曲线，因此非常适合用在钟摆运动中。

   ![](res/2022-03-03-16-20-28.png)

### cubic-bezier() 函数

贝塞尔曲线种类很多，包括线性贝塞尔曲线、二次方贝塞尔曲线、三次方贝塞尔曲线、四次方贝塞尔曲线、五次方贝塞尔曲线等。cubic-bezier() 函数是三次方贝塞尔曲线函数。所有三次方贝塞尔曲线都是由起点、终点和两个控制点组成，在 SVG 或者 Canvas 中，三次方贝塞尔曲线的所有控制点都是不固定的。但是在 CSS 的 cubic-bezier() 函数中，起点和终点的坐标是固定的，分别是 (0, 0) 和 (1, 1)，因此，cubic-bezier() 函数支持的参数值只有 4 个，代表了两个控制点的坐标，语法如下：

```css
cubic-bezier(x1, y1, x2, y2);
```

其中坐标 (x1, y1) 表示控制点 1 的坐标，坐标 (x2, y2) 表示控制点 2 的坐标。

例如 ease 关键字对应的贝塞尔曲线函数 cubic-bezier(0.25, 0.1, 0.25, 1.0) 的曲线图就是根据 (0.25, 0.1) 和 (0.25, 1.0) 这两个控制点坐标生成的，如图 5-57 所示。

有一个网站（cubic-bezier）专门用来调试 CSS 的贝塞尔曲线函数值，图 5-57 所示的曲线图就是使用这个网站生成的。

![](res/2022-03-03-16-30-38.png)

在初期的时候，cubic-bezier() 函数值的取值范围是 0 ～ 1，如果超过 1 会被认为是不合法的，不过现在浏览器早已放开了这个限制，因此，我们可以使用 cubic-bezier() 函数实现回弹效果。例如：

```css
.target {
   transition: 1s cubic-bezier(0.16, 0.67, 0.28, 1.46);
}

.target.run {
   transform: translateX(200px);
}
```

.target 元素的运动轨迹如图 5-58 所示，元素会运动到超出 200px 的位置，然后回到 200px 的位置，形成回弹效果。

![](res/2022-03-03-16-33-28.png)

最后，附上其他一些非 CSS 标准，但也属于常用缓动类型的贝塞尔曲线值，为了方便调用，这里使用了 CSS 自定义属性表示，具体如下：

```css
:root {
   --ease-in-quad: cubic-bezier(0.55, 0.085, 0.68, 0.53);
   --ease-in-cubic: cubic-bezier(0.55, 0.055, 0.675, 0.19);
   --ease-in-quart: cubic-bezier(0.895, 0.03, 0.685, 0.22);
   --ease-in-quint: cubic-bezier(0.755, 0.05, 0.855, 0.06);
   --ease-in-expo: cubic-bezier(0.95, 0.05, 0.795, 0.035);
   --ease-in-circ: cubic-bezier(0.6, 0.04, 0.98, 0.335);
   --ease-out-quad: cubic-bezier(0.25, 0.46, 0.45, 0.94);
   --ease-out-cubic: cubic-bezier(0.215, 0.61, 0.355, 1);
   --ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1);
   --ease-out-quint: cubic-bezier(0.23, 1, 0.32, 1);
   --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
   --ease-out-circ: cubic-bezier(0.075, 0.82, 0.165, 1);
   --ease-in-out-quad: cubic-bezier(0.455, 0.03, 0.515, 0.955);
   --ease-in-out-cubic: cubic-bezier(0.645, 0.045, 0.355, 1);
   --ease-in-out-quart: cubic-bezier(0.77, 0, 0.175, 1);
   --ease-in-out-quint: cubic-bezier(0.86, 0, 0.07, 1);
   --ease-in-out-expo: cubic-bezier(1, 0, 0, 1);
   --ease-in-out-circ: cubic-bezier(0.785, 0.135, 0.15, 0.86);
}
```

## transition 与 visibility 属性的应用指南

如果希望元素在出现和隐藏时有淡入淡出或者移入移出效果，则建议使用 visibility 属性对元素进行隐藏与控制。原因很简单，因为 visibility 属性是支持 CSS 过渡效果和 CSS 动画效果的。

这里举一个移动端经常使用的底部 Popup 浮层的案例，实现遮罩层淡入淡出，底部内容移入移出的效果，HTML 代码结构如下：

```html
<div class="popup">
   <div class="content">底部浮层</div>
</div>
```

淡入淡出效果是使用 opacity 属性实现的，但是 opacity: 0 仅仅是在视觉上让浮层元素不可见，浮层元素依然覆盖在页面上，影响正常的交互，因此，需要使用其他方法来真正隐藏浮层元素。由于 display: none 不支持过渡效果，因此只能使用 visibility: hidden 声明来实现，核心 CSS 代码如下：

```css
.popup {
   position: fixed;
   left: 0;
   right: 0;
   bottom: 0;
   top: 0;
   background: rgba(0, 0, 0, 0.5);
   overflow: hidden;
   /* 显隐控制关键 css 代码 */
   opacity: 0;
   visibility: hidden;
   transition: opacity 0.2s, visibility 0.2s;
}

.content {
   /* 底部浮层移入移出控制关键 css 代码 */
   transform: translateY(100%);
   transition: transform 0.2s;
}

/* 通过切换 “active” 类名实现交互效果 */
.popup.active {
   transition-property: opacity;
   opacity: 1;
   visibility: visible;
}

.active > .content {
   transform: translateY(0%);
}
```

淡入淡出和移入移出没什么好讲的，就是属性的变化，这里比较有意思的是 visibility 对元素显隐的控制。根据定义，当过渡时间函数的值在 0 ～ 1 的时候，visibility 的计算值是 visible，也就是显示；如果时间函数大于 1 或者小于 0，则 visibility 属性的计算值由设置的起止点值决定，例如：

```css
.popup {
   visibility: hidden;
   transition: visibility 2s cubic-bezier(0.25, 0.5, 0, -1);
}

.popup.active {
   visibility: visible;
}
```

此时，.popup 元素会出现先显示，再隐藏，再显示的过渡效果。因为 `cubic-bezier(0.25, 0.5, 0, -1)` 时间函数曲线的一部分在时间轴的下方，这段时间内会按照设置的过渡效果的起始状态，也就是 visibility: hidden 渲染，如图 5-59 所示。

![](res/2022-03-03-17-47-20.png)

由于在实际开发中时间函数的值小于 0 的情况很罕见，因此，我们可以认定 visibility 属性的过渡效果是显示的时候立即显示，隐藏的时候遵循 transition-duration 设置的时间延时隐藏。于是理论上，我们只需要一行 transition 属性代码就可以实现想要的效果，例如：

```css
.popup {
   opacity: 0;
   visibility: hidden;
   /* transition 如下设置即可 */
   transition: opacity 0.2s, visibility 0.2s;
}

.popup.active {
   opacity: 1;
   visibility: visible;
}
```

但是，不知道是浏览器故意为之还是其他什么原因，在过去的 Chrome 浏览器和现在的 Firefox 浏览器中，通过类名增减触发 transition 过渡效果的时候，元素是在 transition-duration 设置的时间结束的时候才突然显示，而通过 :hover 伪类触发的过渡行为则没有此问题。

因此，在实际开发的时候，为了安全考虑，需要在触发结束状态的 CSS 代码那里重置下 transition-property 值，例如：

```css
.popup.active {
   /* visibility 属性不参与过渡效果，因此元素会立即显示 */
   transition-property: opacity;
   opacity: 1;
   visibility: visible;
}
```

点击演示页面中心的按钮即可体验，效果如图 5-60 所示。

![](res/2022-03-03-17-54-04.png)

[transition-visibility](embedded-codesandbox://css-new-world-stronger-visual-performance/transition-visibility)

# CSS 动画

本节深入介绍 CSS 动画相关知识，知识量较大，但都很重要，相信大家一定可以学到很多东西。

先从常用的淡出动画效果说起：

```css
.fade-in {
   animation: fadeIn 0.25s;
}

@keyframes fadeIn {
   from {
      opacity: 0;
   }

   to {
      opacity: 1;
   }
}
```

下面逐一分析上述代码中的项。

- fadeIn 是开发者自己定义的动画名称，命名限制不多，具体命名规则在下面有介绍。
- .25s 是 0.25s 的简写，表示动画执行的时间。
- animation 是调用自定义动画规则的 CSS 属性。
- @keyframes 规则用来定义动画的关键帧。

一个 CSS 动画效果要想出现，动画名称、动画时间、animation 属性和 @keyframes 规则是必不可少的基本单元。CSS 动画自然还包括其他特性，例如动画次数、动画顺序的控制等，但是这些特性不是必需的，因此，单从入门和上手这个角度看，CSS 动画算是简单的。但是，上手简单并不代表 CSS 动画是简单的，随着本节学习内容的逐渐深入，你一定会发现 CSS 动画可以做的事情远远超出了你的想象。下面就先从最基本的 animation 属性说起。

## 初识 animation 属性

animation 属性是多个 CSS 属性的缩写，这些属性包括 animation-name、animation-duration、animation-timing-function、animation-delay、animation-iteration-count、animation-direction、animation-fill-mode 和 animation-play-state。例如：

```css
/* animation: name | duration | timing-function | delay | iteration-count | direction | fill-mode | play-state */
animation: fadeIn 3s ease-in 1s 2 reverse both paused;
```

animation 属性支持同时应用多个动画规则，例如实现元素淡出和右侧划入同时进行的动画效果。正确做法是分隔设置，而不是设置在一个动画规则中，也就是不推荐使用下面的 CSS 代码：

```css
.element {
   animation: fadeInSlideInRight 0.2s;
}

@keyframes fadeInSlideInRight {
   from {
      opacity: 0;
      transform: translateX(100%);
   }

   to {
      opacity: 1;
      transform: translateX(0%);
   }
}
```

而是推荐将代码分隔成多个独立的动画规则，CSS 代码如下：

```css
.element {
   animation: fadeIn 0.2s, slideInRight 0.2s;
}

@keyframes fadeIn {
   from {
      opacity: 0;
   }

   to {
      opacity: 1;
   }
}

@keyframes slideInRight {
   from {
      transform: translateX(100%);
   }

   to {
      transform: translateX(0%);
   }
}
```

这样做的好处在于我们自定义的动画规则可以在其他场合重复利用，例如希望弹框在出现的时候有淡出动画效果，并且我们无须再额外定义淡出动画规则，直接复用即可：

```css
dialog {
   animation: fadeIn 0.2s;
}
```

## @keyframes 规则的语法和特性

首先 @keyframes 的后面有个“s”，因为动画效果不可能只有 1 个关键帧。@keyframes 规则的语法如下：

```css
@keyframes <keyframes-name> {
   <keyframe-block-list>
}
```

其中 `<keyframe-block-list>` 指的是定义的关键帧列表，每个关键帧由关键帧选择器和对应的 CSS 样式组成。

关键帧选择器用来指定当前关键帧在整个动画过程中的位置，其支持 from、to 这两个关键字和百分比值。from 关键字等同于 0%，to 关键字等同于 100%。

也就是说，下面两段 CSS 代码的作用是一样的：

```css
@keyframes fadeIn {
   from {
      opacity: 0;
   }

   to {
      opacity: 1;
   }
}

@keyframes fadeIn {
   0% {
      opacity: 0;
   }

   100% {
      opacity: 1;
   }
}
```

下面讲一下 @keyframes 规则中你可能不知道的一些特性。

### 起止关键帧可以不设置

例如定义淡出效果，可以这样设置：

```css
@keyframes fadeInBy {
   100% {
      opacity: 1;
   }
}
```

此时动画初始状态的透明度就是当前元素的透明度，例如：

```css
.element {
   opacity: 0.5;
}

.element.active {
   animation: fadeInBy 0.2s;
}
```

.element 元素在匹配 .active 类名之后会有透明度从 0.5（初始状态的透明度）变化到透明度 1 的效果。

但是，这种做法在实际开发的时候并不常见，因为通常会使用更加方便快捷的 transition 属性实现类似的效果。

### 关键帧列表可以合并

如果关键帧对应的 CSS 样式是一样的，则可以合并在一起书写，例如：

```css
@keyframes blink {
   0%,
   50%,
   100% {
      opacity: 0;
   }

   25%,
   75% {
      opacity: 1;
   }
}
```

### 不同的关键帧选择器是无序的

虽然动画的执行是有顺序的，从 0% 到 100%，但是在代码层面，不同的关键帧选择器是不分先后顺序的。例如，下面两段 CSS 的效果是一样的：

```css
@keyframes fadeIn {
   0% {
      opacity: 0;
   }

   100% {
      opacity: 1;
   }
}

@keyframes fadeIn {
   100% {
      opacity: 1;
   }

   0% {
      opacity: 0;
   }
}
```

### 重复定义的关键帧不是完全被覆盖的

例如：

```css
@keyframes identifier {
   50% {
      top: 30px;
      left: 20px;
   }

   50% {
      top: 10px;
   }
}
```

最终在 50% 这一帧用来动画的 CSS 样式是 top: 10px 和 left: 20px。也就是说，如果关键帧重复定义，则不同的 CSS 样式是累加的，而相同的 CSS 样式是后面的样式覆盖前面的样式，和普通的 CSS 选择器的样式计算规则一致。

### 关键帧中的样式可以不连续

前后关键帧的 CSS 属性无须保持一致，例如：

```css
@keyframes identifier {
   0% {
      top: 0;
      left: 0;
   }

   30% {
      top: 50px;
   }

   60%,
   90% {
      left: 50px;
   }

   100% {
      top: 100px;
      left: 100%;
   }
}
```

这里，top 属性应用动画的帧是 0%、30% 和 100%，left 属性应用动画的帧是 0%、60%、90% 和 100%。

### !important 无效

例如：

```css
@keyframes identifier {
   0% {
      top: 30px;
      /* 无效 */
      left: 20px !important;
   }

   100% {
      top: 10px;
   }
}
```

其中 left: 20px 这句 CSS 声明是没有任何效果的。其实，根本就没有必要在 @keyframes 规则语句中使用 !important 提高权重，因为当 CSS 动画执行的时候，关键帧中定义的 CSS 优先级就是最高的。

### 优先级最高

请看下面这个例子：

```html
<img src="1.jpg" style="opacity: 0.5;" />
<style>
   img {
      animation: fadeIn 1s;
   }

   @keyframes fadeIn {
      0% {
         opacity: 0;
      }

      100% {
         opacity: 1;
      }
   }
</style>
```

`<img>` 元素出现了透明度从 0 到 1 的动画效果，这就表明 @keyframes 规则中的 CSS 优先级要比 style 属性设置的 CSS 属性的优先级要高。接下来我们更进一步，使用 CSS 世界中优先级最高的 !important 语法：

```html
<img src="1.jpg" style="opacity: 0.5!important" />
```

结果是 Chrome 浏览器、IE 浏览器、Edge 浏览器和 Safari 浏览器均出现了透明度动画效果，只有 Firefox 浏览器中的 `<img>` 元素一直保持 0.5 的透明度。这表明在 Firefox 浏览器中，@keyframes 规则中的 CSS 优先级大于 style 设置的 CSS 属性，小于 !important 语法中的 CSS 属性，而其他所有浏览器 @keyframes 规则中的 CSS 优先级最高。

[keyframes-css-priority](embedded-codesandbox://css-new-world-stronger-visual-performance/keyframes-css-priority)

根据以往的经验，规范中没有定义到的特性会随着浏览器版本的升级而进行调整，因此说不定过几年 Firefox 浏览器也会把 @keyframes 规则中的 CSS 优先级调至最高。

@keyframes 规则优先级最高的这个特性为重置页面中第三方 JavaScript 设置的内联样式提供了一种新的思路。不过，此方法也有局限，就是不支持动画的 CSS 属性是无法重置的，例如我们无法在 @keyframes 规则中设置 display: block 去重置 display: none，因此对于 Adblock 这类去广告插件还是无解。

## 动画命名与 `<custom-ident>` 数据类型

按照规范，动画的名称可以是下面两种数据类型：

```css
<custom-ident> | <string>
```

其中，`<string>` 数据类型表示需要带引号的字符串，例如，下面 CSS 代码中的 `'...'` 和 `'Microsoft Yahei'` 就是 `<string>` 数据类型：

```css
content: '...';
font-family: 'Microsoft Yahei';
```

因此，理论上 CSS 动画也是支持使用引号命名的动画效果的，例如：

```css
.element {
   animation: 'hello world' 2s;
}

@keyframes 'hello world' {
   0% {
      opacity: 0;
   }

   100% {
      opacity: 1;
   }
}
```

实际测试下来，仅 Firefox 浏览器支持 `<string>` 数据类型的 CSS 动画名称，Chrome 浏览器和 IE 浏览器均认为这是不合法的语法。

[string-animation-name](embedded-codesandbox://css-new-world-stronger-visual-performance/string-animation-name)

因此，我们的注意力还是放在兼容性更好的 `<custom-ident>` 数据类型上。CSS 中可以自定义的名称均是 `<custom-ident>` 数据类型，例如 counter-reset 和 counter-increment 属性中自定义的计数器，CSS 网格布局中对行和列的命名等。故 `<custom-ident>` 数据类型是一学百用的。

### `<custom-ident>` 数据类型语法

`<custom-ident>` 数据类型的语法和 CSS 的标识符（例如，CSS 属性就属于 CSS 标识符）很相似，区别就在于 `<custom-ident>` 数据类型是区分大小写的。`<custom-ident>` 数据类型可以由下面这些字符进行组合：

- 任意字母（a ～ z 或 A ～ Z）；
- 数字（0 ～ 9）；
- 短横线（-）；
- 下划线（\_）；
- 转义字符（使用反斜杠 \ 转义）；
- Unicode 字符（反斜杠 \ 后面跟十六进制数字）。

由于 `<custom-ident>` 数据类型区分大小写，因此 id1、Id1、ID1 和 iD1 是不同的名称。而一些看起来差异很大的名称却是相同的，例如，☺ 和 \263a 其实是相同的，因此，下面 CSS 代码中的 CSS 动画是可以执行的：

```css
.element {
   animation: ☺ 2s;
}

@keyframes \263a {
   0% {
      opacity: 0;
   }

   100% {
      opacity: 1;
   }
}
```

下面通过案例说一说 `<custom-ident>` 数据类型的合法性。

1. 不能是 CSS 属性本身支持的关键字，例如 animation 属性支持关键字 none，也支持全局关键字 unset、initial 和 inherit。因此，在 CSS 动画中，不能把动画名称定义为 none、unset、initial 或 inherit。

2. 不能以十进制数字开头。例如，下面的名称就是不合法的：

   ```js
   /* 不合法 */
   2333fadeIn
   ```

3. 可以使用短横线作为开头，但是短横线后面不能是十进制数字，也就是说，下面的名称是合法的：

   ```js
   /* 合法 */
   -fadeIn;
   ```

   而下面这个名称就不合法：

   ```js
   /* 不合法 */
   -2333fadeIn
   ```

4. 除短横线和下划线之外的英文标点字符（包括空格）都需要转义。例如，下面的名称是合法的：

   ```js
   /* 合法 */
   example\.png
   hello\ world
   ```

   而下面这个名称就不合法：

   ```js
   /* 不合法 */
   example.png
   hello world
   ```

5. 连续短横线开头的名称在 MDN 文档中被认为是不合法的，但是根据我的测试，除了 IE 浏览器不支持，其他浏览器都认为连续短横线的动画名称是合法的，例如：

   ```css
   /* 除 IE 浏览器外均合法，即使和 CSS 自定义属性名称一致 */
   .element {
      --fadeIn: 2;
      animation: --fadeIn 2s;
   }

   @keyframes --fadeIn {
      0% {
         opacity: 0;
      }

      100% {
         opacity: 1;
      }
   }
   ```

   因此，我认为连续短横线开头的名称是合法的。

6. 如果是 Unicode 编码转义字符，记得在后面添加一个空格，例如：

   ```css
   /* 合法 */
   \233 haha
   ```

## 负延时与即时播放效果

animation-delay 可以让动画延时播放，例如：

```css
animation-delay: 300ms;
```

表示动画延时 300ms 播放。

需要注意的是，如果动画是无限循环的，设置的延时不会跟着循环，例如：

```css
.loading {
   animation: spin 1s infinite;
   animation-delay: 300ms;
}

@keyframes spin {
   0% {
      transform: rotate(0deg);
   }

   100% {
      transform: rotate(360deg);
   }
}
```

此时 .loading 元素会在延时 300ms 后不断旋转，而不是在延时 300ms 后旋转一圈，再在延时 300ms 后旋转一圈，不断循环。

想要实现每次动画循环都有延时效果，常用的方法是在自定义动画关键帧处进行设置，例如：

```css
.loading {
   animation: spin 1s infinite;
}

@keyframes spin {
   0%,
   30% {
      transform: rotate(0deg);
   }

   100% {
      transform: rotate(360deg);
   }
}
```

animation-delay 属性比较经典的应用就是通过设置负值让动画即时播放，播放的位置为动画中间的某一阶段。

举一个音频波形动画的案例，实现图 5-61 所示的效果，可以用来表示音频文件处于加载态或者播放态。

![](res/2022-03-12-00-29-19.png)

音频波形由一个一个的矩形组成，每一个矩形都会有垂直缩放的动画效果。想要形成此起彼伏的波形运动效果，最好的方法就是给每一个矩形的动画设置延时，例如（这里使用 4 个矩形示意）：

```html
<div class="loading">
   <i></i>
   <i></i>
   <i></i>
   <i></i>
</div>
<style>
   .loading i {
      display: inline-block;
      border-left: 2px solid deepskyblue;
      height: 2px;
      animation: scaleUp 4s linear infinite alternate;
      margin: 0 1px;
   }

   .loading i:nth-child(2) {
      animation-delay: 1s;
   }

   .loading i:nth-child(3) {
      animation-delay: 2s;
   }

   .loading i:nth-child(4) {
      animation-delay: 3s;
   }

   @keyframes scaleUp {
      to {
         transform: scaleY(10);
      }
   }
</style>
```

然而，真正运行的时候却发现一个比较严重的问题，由于设置了延时，动画开始执行的时候，后面的矩形都是默认的高度，如图 5-62 所示。这显然不符合预期，矩形的初始高度应该参差不齐才对。

![](res/2022-03-12-00-35-12.png)

要解决这个问题其实很简单，只要把延时的时间全部换成负数即可，代码如下：

```css
.negative i:nth-child(2) {
   animation-delay: -1s;
}

.negative i:nth-child(3) {
   animation-delay: -2s;
}

.negative i:nth-child(4) {
   animation-delay: -3s;
}
```

这样既保留了各个元素动画的时间差，又实现了动画效果的立即播放，且不会带来各个矩形初始状态尺寸相同的问题。

[animation-delay-loading](embedded-codesandbox://css-new-world-stronger-visual-performance/animation-delay-loading)

### 准确理解 animation-delay 负值

提个问题，下面代码的透明度变化是 0.75→1 还是 0.25→1？

```css
element {
   animation: fadeIn 1s linear -0.25s;
}

@keyframes fadeIn {
   0% {
      opacity: 0;
   }

   100% {
      opacity: 1;
   }
}
```

相信很多人都会搞错，因为容易受 JavaScript 中 splice() 或者 slice() 函数负值的作用误导。

在很多语言中，负值表示序列的序号前移，或者时间线往前，于是，很多人就认为 animation-delay: -.25s 就是在整个播放时间线上往前移动 0.25s，因此透明度变化应该是 0.75→1。但实际上并不是这样，其实透明度变化是 0.25→1。

以上变化其实不难理解，关键点就是理解何为“延时”，例如 animation-delay: 0.25s 表示动画在 0.25s 之后从 0% 开始播放，那 animation-delay: -0.25s 显然就表示在 0.25s 之前就已经从 0% 开始播放，即动画真正播放的时候动画已经执行了 0.25s，因此，我们可见的变化就是 0.25→1 这段过程。

## reverse 和 alternate 关键字的区别和应用

animation-direction 属性可以用来控制动画的方向，其本质上是通过控制 @keyframes 规则中定义的动画关键帧执行的方向来实现的。该属性语法如下：

```css
animation-direction: normal; /* 初始值 */
animation-direction: reverse;
animation-direction: alternate;
animation-direction: alternate-reverse;
```

其中，reverse 和 alternate 这两个关键字都有“相反”的意思，不同之处在于，reverse 关键字是让每一轮动画执行的方向相反，而 alternate 关键字是让下一轮动画的执行方向和上一轮动画的执行方向相反。

举个例子，实现一个常见的淡入淡出动画效果，这里设置动画播放 2 次：

```css
.element {
   /* fadeIn 动画执行 2 次 */
   animation: fadeIn 1s 2;
}

@keyframes fadeIn {
   0% {
      opacity: 0;
   }

   100% {
      opacity: 1;
   }
}
```

先讲一下这一语法中的几个关键点。

- animation-direction 属性值如果是 normal，那么动画执行的方向是 0%→100%、0%→100%，每一轮的动画方向都是正常的。
- animation-direction 属性值如果是 reverse，那么动画执行的方向是 100%→0%、100%→0%，每一轮的动画方向都是相反的。
- animation-direction 属性值如果是 alternate，那么动画执行的方向是 0%→100%、100%→0%，每 2n + 1 轮的动画方向是相反的。
- animation-direction 属性值如果是 alternate-reverse，那么动画执行的方向是 100%→0%，0%→100%，每 2n 轮的动画方向是相反的。

由此可见，reverse 和 alternate 关键字的区别是让动画反向播放的轮数不同。从效果表现来看，alternate 关键字的动画效果表现为来回交替播放，这也是为什么 alternate 关键字要被命名为 “alternate”（交替的、来回的）。

### reverse 关键字的应用场景

我有个朋友以前做过一件很傻的事情，就是在一个项目中，有的图形需要顺时针旋转，有的图形需要逆时针旋转（类似图 5-32 所示使用锥形渐变实现的加载图形），于是，我这个朋友就定义了两个旋转动画：

```css
@keyframes spin {
   from {
      transform: rotate(0deg);
   }

   to {
      transform: rotate(360deg);
   }
}

@keyframes spin2 {
   from {
      transform: rotate(360deg);
   }

   to {
      transform: rotate(0deg);
   }
}
```

然后：

```css
.turntable {
   animation: spin 5s 5;
}

.loading {
   animation: spin2 1s infinite;
}
```

这就是 CSS 动画相关知识不扎实的体现，虽然效果是正常的，但代码实在烦琐。其实无须再额外定义一个逆时针动画，直接使用 reverse 关键字即可，代码如下：

```css
.turntable {
   animation: spin 5s 5;
}

.loading {
   animation: spin 1s reverse infinite;
}

@keyframes spin {
   from {
      transform: rotate(0deg);
   }

   to {
      transform: rotate(360deg);
   }
}
```

### alternate 关键字的应用场景

先看反例，实现一个钟摆运动。有一些对 CSS 动画不太熟悉的开发者会通过自定义动画关键帧来实现：

```css
.clock-pendulum {
   transform-origin: top;
   animation: pendulum 2s infinite;
}

@keyframes pendulum {
   0%,
   100% {
      transform: rotate(10deg);
   }

   50% {
      transform: rotate(-10deg);
   }
}
```

乍一看好像效果还行，其实是有问题的，除了代码烦琐且需要额外计算之外，最大的问题在于运动效果并不准确，因为此时一个动画周期是 10deg→−10deg→10deg。对于钟摆运动，元素两次到达 0deg 的位置时运动速度最快，但是目前的 CSS 时间函数是无法同时指定两处加速点的，因此，上面这种自以为是的用法是无论如何也不可能实现真实的钟摆运动的。

唯一且最佳的实现方法就是使用 alternate 关键字，同时使用 ease-in-out 作为时间函数，要知道钟摆运动是使用 ease-in-out 时间函数最具代表性的案例。代码示意如下：

```css
.clock-pendulum {
   transform-origin: top;
   animation: pendulum 1s infinite alternate ease-in-out;
}

@keyframes pendulum {
   0% {
      transform: rotate(-10deg);
   }

   100% {
      transform: rotate(10deg);
   }
}
```

[animation-alternate-clock](embedded-codesandbox://css-new-world-stronger-visual-performance/animation-alternate-clock)

不过，凡事无绝对，有些动画需要通过在动画帧中自定义实现，而无法通过 alternate 关键字实现。那么，什么类型的动画无法通过 alternate 关键字实现呢？就是那种来回时间不一致的动画，典型代表就是“呼吸动画”，人的呼吸是吸气快，呼气慢，时间为 3 ～ 7s。这一类模拟人体呼吸节奏的动画都是通过调整 @keyframes 自定义关键帧中间状态的时间来实现的。例如，下面 opacity: 1 的状态就不在 50% 的位置，而是在 70% 的位置：

```css
.breath {
   animation: breath 7s infinite;
}

@keyframes breath {
   0%,
   100% {
      opacity: 0;
   }

   70% {
      opacity: 1;
   }
}
```

### 关于 alternate-reverse

alternate-reverse 关键字的作用是让动画第一次反向播放，然后不断来回播放。

alternate-reverse 关键字不能写作 reverse-alternate，这样写是不合法的。至于为何将“alternate”写在“reverse”的前面，可能是按照首字母排序的吧。

## 动画播放次数可以是小数

动画播放的次数是可以任意指定的，很多人并不知道。我们可以使用 animation-iteration-count 属性任意指定动画播放的次数，甚至是小数。例如：

```css
.element {
   animation: fadeIn 1s linear both;
   animation-iteration-count: 1.5;
}

@keyframes fadeIn {
   0% {
      opacity: 0;
   }

   100% {
      opacity: 1;
   }
}
```

动画播放的进度为 0%→100%、0%→50%，也就是在第二轮播放的时候，播放到一半就会停止，此时元素的透明度是 0.5。

大家千万不要误认为 animation-iteration-count 的属性值不能为小数，该属性对小数也是可以精确解析的，这一点和 z-index 属性不一样。对比两个属性的正式语法就可以看出差别了：

```css
animation-iteration-count: infinite | <number>
z-index: auto | <integer>
```

animation-iteration-count 支持的是 `<number>` 数值类型，而 z-index 支持的是 `<integer>` 整数类型。animation-iteration-count 的中文意思是“动画—迭代—数目”，初始值是 1，表示动画播放 1 次就结束了。

### 小数值的作用

小数值的应用场景虽然不多，但是一旦用起来，会让人非常愉悦，因为这非常体现 CSS 技术。例如，淡出效果的 CSS 关键帧代码如下：

```css
@keyframes fadeIn {
   0% {
      opacity: 0;
   }

   100% {
      opacity: 1;
   }
}
```

页面中有些元素处于禁用态，透明度只有 40%，此时，使用完整的 fadeIn 动画就不合适（因为动画帧中的样式优先级太高，会覆盖 40% 透明度）。于是不少人会重新定义一个禁用元素的淡出动画：

```css
@keyframes disableFadeIn {
   0% {
      opacity: 0;
   }

   100% {
      opacity: 0.4;
   }
}
```

其实大可不必，还是使用 fadeIn 动画，只要把播放次数调整为小数即可。对于 ease 时间函数，透明度提高到 40% 只需要 25% 的完整动画时间，因此，我们只需要播放 0.25 次即可，CSS 代码如下：

```css
.visible {
   animation: fadeIn 0.25s both;
}

.visible:disabled {
   animation: fadeIn 1s 0.25 both;
}
```

HTML 代码如下：

```html
<input value="可用" /> <input value="禁用" disabled />
```

效果如图 5-63 所示，可以看到禁用态输入框的透明度只有 40%。

![](res/2022-03-12-01-20-27.png)

[animation-iteration-count](embedded-codesandbox://css-new-world-stronger-visual-performance/animation-iteration-count)

如果只希望使用淡出动画的后半截，则使用 animation-iteration-count 小数值的方法就不管用了。

此时可以使用 animation-delay 负属性值实现我们想要的效果：

```css
.visible-second-half {
   animation: fadeIn 1s -0.25s;
}
```

如果只希望使用淡出动画的中间部分，可以同时使用 animation-iteration-count 小数值和 animation-delay 负时间值。例如，选取中间 50% 的时间区域：

```css
.visible-middle-part {
   animation: fadeIn 1s -0.25s 0.75;
}
```

### 关于 infinite

关键字属性值 infinite 表示无限，作用是让动画一刻不停地无限播放，钟摆运动或者 loading 旋转就属于这样的动画。

### 关于值范围

animation-iteration-count 的属性值不能是负数，否则会被认为不合法，但是可以是 0，表示动画一次也不播放。因此，如果想要重置 animation 属性，可以使用 animation: 0，比使用 animation: none 的代码少。

## forwards 和 backwards 属性值究竟是什么意思

animation-fill-mode 属性的字面意思是“动画填充模式”，主要用来定义动画在执行时间之外应用的值。

animation-fill-mode 属性的语法如下：

```css
animation-fill-mode: none; /* 默认值 */
animation-fill-mode: forwards;
animation-fill-mode: backwards;
animation-fill-mode: both;
```

其中 none 是默认值，表示动画开始之前和动画结束之后不会对元素应用 @keyframes 规则中定义的任何样式。例如：

```css
.element {
   opacity: 0.5;
   animation: fadeIn 2s 1s;
}

@keyframes fadeIn {
   0% {
      opacity: 0;
   }

   100% {
      opacity: 1;
   }
}
```

此时的 .element 元素的透明度变化过程如下。

1. 透明度 0.5 保持 1s。
2. 透明度从 0.5 突变到 0，然后透明度从 0 逐渐过渡到 1，过程持续 2s。
3. 透明度从 1 突变到 0.5，并保持不变。

实际上，这里的 .element 元素的透明度无论设置为多少，都会有透明度突变的糟糕体验，这显然不是我们想要的，因此需要使用 animation-fill-mode 属性优化动画效果。但 forwards 和 backwards 这两个关键字属性值不太好理解，下面详细讲解一下。

### forwards 和 backwards 的含义

forwards 是“前进”的意思，表示动画结束后（什么时候结束由 animation-iteration-count 属性决定），元素将应用当前动画结束时的属性值。例如：

```css
.element {
   opacity: 0.5;
   animation: fadeIn 2s 1s forwards;
}

@keyframes fadeIn {
   0% {
      opacity: 0;
   }

   100% {
      opacity: 1;
   }
}
```

此时的 .element 元素在动画结束之后会使用 100% 这一帧的透明度属性值，因此透明度变化过程如下。

1. 透明度 0.5 保持 1s。
2. 透明度从 0.5 突变到 0，然后透明度从 0 逐渐过渡到 1，过程持续 2s。
3. 透明度一直保持为 1（forwards 的作用）。

backwards 是“后退”的意思，表示在动画开始之前，元素将应用当前动画第一轮播放的第一帧的属性值。例如：

```css
.element {
   opacity: 0.5;
   animation: fadeIn 2s 1s backwards;
}

@keyframes fadeIn {
   0% {
      opacity: 0;
   }

   100% {
      opacity: 1;
   }
}
```

此时的 .element 元素在动画开始执行之前会使用 0% 这一帧的透明度属性值，因此透明度变化过程如下。

1. 透明度为 0 并保持 1s 不变（backwards 的作用）。
2. 透明度由 0 逐渐过渡到 1，过程持续 2s。
3. 透明度从 1 突变到 0.5，并保持不变。

有人可能会奇怪，forwards 语义包含“前”，为什么应用的却是最后一帧样式？而 backwards 语义包含“后”，为什么应用的却是第一帧样式？

这是因为这里的 forwards 指动画向前，backwards 指动画向后。如果把时间画在一把尺子上，则动画所经过的时间就是这把尺子的一部分，如图 5-64 红色部分所示，可以看到，动画向前的方向是动画的结束位置；动画向后的方向是动画的开始位置。也就是说 forwards 表示动画的结束，backwards 表示动画的开始。

![](res/2022-03-12-01-37-50.png)

因此，forwards 的“前进”指的是最后一帧继续前进的样式，backwards 的“后退”指的是第一帧还要后退的样式。

### forwards 和 backwards 的细节

由于动画的最后一帧是由 animation-direction 和 animation-iteration-count 属性共同决定的，因此 forwards 有时候对应的是 @keyframes 规则中的 to 或 100% 对应的帧，有时候对应的是 @keyframes 规则中的 from 或 0% 对应的帧，具体对应细节如下表。

| animation-direction          | animation-iteration-count | 最后一个关键帧 |
| :--------------------------- | :------------------------ | :------------- |
| normal                       | 奇数或偶数（不包括 0）    | 100% 或 to     |
| reverse                      | 奇数或偶数（不包括 0）    | 0% 或 from     |
| alternate                    | 正偶数                    | 0% 或 from     |
| alternate                    | 奇数                      | 100% 或 to     |
| alternate-reverse            | 正偶数                    | 100% 或 to     |
| alternate-reverse            | 奇数                      | 0% 或 from     |
| normal 或 alternate          | 0                         | 0% 或 from     |
| reverse 或 alternate-reverse | 0                         | 100% 或 to     |

而 backwards 只取决于 animation-direction 的属性值，因为 backwards 设置的是动画第一次播放的第一帧的状态，与 animation-iteration-count 次数没有任何关系，具体对应细节如下表所示。

| animation-direction          | 第一个关键帧 |
| :--------------------------- | :----------- |
| normal 或 alternate          | 0% 或 from   |
| reverse 或 alternate-reverse | 100% 或 to   |

可以看出，其实 animation-iteration-count 的属性值为 0 的时候，forwards 等同于 backwards。

### 记不住 forwards 和 backwards 怎么办

一个知识点往往需要反复阅读与实践才能记忆深刻，所以如果不常写 CSS 代码，则一段时间后记不清应该使用 forwards 还是 backwards 是很正常的，这个时候干脆就使用 both 关键字代替。

animation-fill-mode: both 可以让元素的动画在延时等待时保持第一帧的样式，在动画结束后保持最后一帧的样式，适用于绝大多数的开发场景。例如：

```css
.element {
   opacity: 0.5;
   animation: fadeIn 2s 1s both;
}

@keyframes fadeIn {
   0% {
      opacity: 0;
   }

   100% {
      opacity: 1;
   }
}
```

此时的 .element 元素的透明度变化过程如下。

1. 透明度为 0 并保持 1s 不变（等同于 backwards 的作用）。
2. 透明度从 0 逐渐过渡到 1，时间持续 2s。
3. 透明度保持为 1 不变（等同于 forwards 的作用）。

可以看到元素的透明度变化过程很流畅、很自然。

还有一点小小的建议，依赖 CSS 动画保持元素的显隐状态有功能上的风险，例如动画如果没执行，元素就永远显示不出来。因此，常规的 CSS 语句里的元素样式也要同步变化，例如下面的元素显示是通过添加类名 .active 触发的，此时需要同时设置 opacity: 1，代码如下：

```css
.element {
   opacity: 0;
}

.element.active {
   opacity: 1;
   animation: fadeIn 2s 1s both;
}

@keyframes fadeIn {
   0% {
      opacity: 0;
   }

   100% {
      opacity: 1;
   }
}
```

## 如何暂停和重启 CSS 动画

CSS 动画是可以暂停的。

使用 animation-play-state 属性可以控制 CSS 动画的播放和暂停，语法如下：

```css
/* 播放 */
animation-play-state: running;
/* 暂停 */
animation-play-state: paused;
```

只要设置 animation-play-state 的属性值为 paused 就可以让一个正在播放的 CSS 动画暂停。举个例子，使用 CSS Sprites 背景图和 animation 属性实现一个可暂停的动图效果，CSS 代码如下：

```css
.love {
   width: 100px;
   height: 100px;
   background: url(heart-animation.png) no-repeat;
   background-size: 2900%;
   animation: heart-burst steps(28) 0.8s infinite both;
}

.stop {
   animation-play-state: paused;
}

@keyframes heart-burst {
   0% {
      background-position: 0%;
   }

   100% {
      background-position: 100%;
   }
}
```

[animation-play-state](embedded-codesandbox://css-new-world-stronger-visual-performance/animation-play-state)

点击演示页面中间区域的按钮，会给 .love 元素添加类名 .stop，此时就会看到类似 GIF 动图的“心花怒放”效果动画瞬间被暂停了，如图 5-65 所示。

![](res/2022-03-12-15-07-20.png)

相比传统的 GIF 动图，这种使用 animation 实现的动图效果，支持无损 PNG，图像质量更高，而且可以随时播放和暂停。

配合 animation-delay 负值，动画暂停可以让元素停留在动画的任一时段，我们可以利用这一特性解决一些 CSS 难题。例如，希望设置 50% 透明度的 deepskyblue 色值就可以这样处理：

```css
p {
   animation: opacityColor 1s -0.5s linear paused;
}

@keyframes opacityColor {
   0% {
      color: transparent;
   }

   100% {
      color: deepskyblue;
   }
}
```

此时 `<p>` 元素的 color 色值就是 50% 透明度的 deepskyblue。

### CSS 动画重启

这里顺便讲一下如何重启 CSS 动画，例如：

```html
<div class="element active"></div>
<style>
   .element.active {
      animation: fadeIn 2s 1s both;
   }

   @keyframes fadeIn {
      0% {
         opacity: 0;
      }

      100% {
         opacity: 1;
      }
   }
</style>
```

想要 CSS 动画重新执行一遍，可以使用下面的 JavaScript 代码（假设 .element 元素的 DOM 对象是 ele）：

```js
ele.classList.remove('active');
ele.offsetWidth; // 触发重绘
ele.classlist.add('active');
```

如果不是重新执行动画，而是让已经暂停的动画继续播放，则设置 animation-play-state 属性值为 running 即可。

## 深入理解 steps() 函数

animation-timing-function 的属性值由 cubic-bezier() 函数和 steps() 函数组成。steps() 函数可以让动画效果不连续，就像楼梯，与之相对应的 cubic-bezier() 函数则更像是平滑的无障碍坡道，如图 5-66 所示。

![](res/2022-03-12-15-18-09.png)

cubic-bezier() 函数在 5.3.2 节已经详细介绍过，这里专门深入介绍 steps() 函数及其相对应的关键字。

学习 steps() 函数有一定的难度，主要是容易分不清楚 start 和 end。

常见的 steps() 函数用法示例如下：

```css
steps(5, end);
steps(2, start);
```

语法表示就是：

```css
steps(number, position);
```

先讲一下这一语法中的几个关键点。

- number 指数值，且是整数值，这个很好理解，表示把动画分成了多少段。假设有如下 @keyframes 规则，定义了一段从 0 ～ 100px 的位移：

   ```css
   @keyframes move {
      0% {
         left: 0;
      }

      100% {
         left: 100px;
      }
   }
   ```

   同时 number 参数的值是 5，则相当于把这段移动的距离分成了 5 段，如图 5-67 所示。

   ![](res/2022-03-12-15-25-07.png)

- position 指关键字属性值，是可选参数，表示动画跳跃执行是在时间段的开始还是结束。其支持众多关键字值，这里先了解一下传统的 start 和 end 关键字。
- start 表示在时间段的开头处跳跃。
- end 表示在时间段的结束处跳跃，是默认值。

### 深入理解 start 和 end 关键字

steps() 函数本质上是一个阶跃函数，阶跃函数是一种特殊的连续时间函数，可以实现从 0 突变到 1 的过程。图 5-68 所示的 steps(1, start)、steps(1, end)、steps(3, start)、steps(3, end) 就是阶跃函数。

通过分析图 5-68 所示内容，我们可以得到对 start 和 end 关键字的进一步解释。

![](res/2022-03-12-15-38-46.png)

- start：表示直接开始，也就是时间段才开始，就已经执行了一个距离段。动画执行的 5 个分段点是下面这 5 个，起始点被忽略，因为时间一开始直接就到了第二个点，如图 5-69 所示。

   ![](res/2022-03-12-15-43-15.png)

- end：表示戛然而止，也就是时间段一结束，当前动画执行就停止。于是，动画执行的 5 个分段点是下面这 5 个，结束点被忽略，因为在要执行结束点的时候已经没时间了，如图 5-70 所示。

   ![](res/2022-03-12-15-44-26.png)

然而，上述的分析是站在函数的角度和时间的角度进行的，虽然仔细琢磨一下也能理解，但是由于这并不符合人的主观视角和实际感知，一段时间后，认知就会发生混乱。

混乱的原因在于认知失调。steps(5) 是把动画时间段分成 5 段，对这个点的认识应该都没有问题，关键是对 steps(5, start) 的认识，看到这里是 start，几乎所有人的第一反应就是动画应用的样式是对应时间段开始的样式，不然怎么叫作“start”呢？可现实真是残酷，steps(5, start) 应用的样式不是 5 个时间段的 start 样式，而是 5 个时间段的 end 样式，例如 left: 0 到 left: 100px 的位移，最终元素表现出来的位移是 20px、40px、60px、80px 和 100px。

steps(5, end) 也是反直觉的表现，其应用的是 5 个时间段的 start 样式，而不是字面上的 end 样式，例如 left: 0 到 left: 100px 的位移，最终元素表现出来的位移是 0px、20px、40px、60px 和 80px。

[animation-timing-function-start-end](embedded-codesandbox://css-new-world-stronger-visual-performance/animation-timing-function-start-end)

大家可以看到，以 20px 为一个分段，start 的位置在分段的结束处，而 end 的位置在分段的开始处，图 5-71 所示的就是执行 5 次 step() 的位置示意图。

因此，为了避免认知混乱，当需要用到 steps() 函数的时候，无须思考过于抽象的阶跃函数及其准确含义，只需要记住符合直觉认知的这么一句话：“一切都是反的。start 不是开始，而是结束；end 不是结束，而是开始。”

![](res/2022-03-12-15-53-41.png)

这样，至少使用 start 和 end 关键字的时候不会犯错，至于相反的原因，可以参考图 5-68 所示的 steps() 阶跃函数慢慢理解。

## animation-fill-mode 属性与 steps() 函数同时设置会怎样

animation-fill-mode 属性和 steps() 函数同时使用，可能会影响元素的断点表现。例如，下面这个语句：

```css
animation: move 5s forwards steps(5, end);
```

forwards 关键字会使动画停留在动画关键帧最后一帧的状态。于是，图 5-72 所示的 6 个分段点都会执行，整个动画停止在第六个分段点上，也就是由于设置了 animation-fill-mode，因此虽然将时间分成了 5 段，但是视觉表现上却是元素总共移动了 6 个位置。

![](res/2022-03-12-15-57-11.png)

这显然不是我们想要的，怎么处理呢？可以减少分段个数和减小动画运动的跨度，调整如下：

```css
@keyframes move {
   0% {
      left: 0;
   }

   100% {
      left: 80px;
   }
}
```

也就是将终点从 100px 改成 80px，同时将 CSS 调用改成：

```css
animation: move 5s forwards steps(4, end);
```

也就是将原来的 steps(5, end) 改成 steps(4, end)，最后将 100% 这一帧交给 forwards。

### step-start 和 step-end 关键字

step-start 和 step-end 是 steps() 函数的简化关键字，注意，是 step-\*，step 后面没有 s。step-start 等同于 steps(1, start)，表示“一步到位”；step-end 等同于 steps(1, end) 或者 steps(1)，表示“延时到位”。

之所以专门设置两个关键字 step-start 和 step-end，不是因为这两个关键字常用，而是因为这两个关键字实用。它们可以让动画按照设定的关键帧步进变化，特别适合非等分的步进场景。例如实现一个打点动画，CSS 代码如下：

```html
正在加载中<dot>...</dot>
<style>
   dot {
      display: inline-block;
      height: 1em;
      line-height: 1;
      vertical-align: -0.25em;
      overflow: hidden;
   }

   dot::before {
      display: block;
      content: '...\A..\A.';
      white-space: pre-wrap;
      animation: dot 3s infinite step-start both;
   }

   @keyframes dot {
      33% {
         transform: translateY(-2em);
      }

      66% {
         transform: translateY(-1em);
      }
   }
</style>
```

效果如图 5-73 所示。

![](res/2022-03-12-16-05-40.png)

[animation-step-start-loading](embedded-codesandbox://css-new-world-stronger-visual-performance/animation-step-start-loading)

在这个例子中，如果你想通过在 @keyframes 规则中设置好 0% 和 100% 的位置，再使用 steps(2) 或 steps(3) 进行位置划分实现这个效果，你会发现位置总是对不上。其实完全不用这么麻烦的，手动设置好断点的位置，然后使用一个 step-start 关键字就搞定了，无须计算，无须微调，就算把 33% 改成 50% 功能也是正常的，只是打点速度不均匀而已，定位字符点绝对没问题。

这就是 step-start 和 step-end 关键字的精妙作用，可以让任意自定义的 CSS 关键帧步进呈现，很实用。

### 新的 jump-start、jump-end、jump-none 和 jump-both 关键字

从 2019 年开始，Chrome 浏览器和 Firefox 浏览器开始陆续支持 jump- 开头的用在 steps() 函数中的关键字。下面先介绍一下 jump-start、jump-end、jump-none 和 jump-both 关键字的含义。

- jump-start：动画开始时就发生跳跃，和 start 关键字的表现一样。
- jump-end：动画结束时发生跳跃，和 end 关键字的表现一样。
- jump-none：动画开始时和结束时都不发生跳跃，然后中间部分等分跳跃。
- jump-both：动画开始时和结束时都发生跳跃。

假设时间函数分为 3 段，则 jump-start、jump-end、jump-none 和 jump-both 关键字对应的阶跃函数如图 5-74 所示。

![](res/2022-03-12-16-12-40.png)

目前 jump-开头的这几个关键字的兼容性还不太好，在生产环境中还无法使用，就不进一步展开讲解了。

### 标签嵌套与动画实现的小技巧

遇到某些属性被占用，或者动画场景复杂的情况，可以试试使用标签嵌套来实现。例如，某个悬浮提示框的居中定位是使用 transform 属性实现的：

```css
.toast {
   position: absolute;
   left: 50%;
   top: 50%;
   transform: translate(-50%, -50%);
}
```

同时希望提示框出现的时候有放大的动画效果，也就是应用下面的 CSS 动画：

```css
@keyframes scaleUp {
   from {
      transform: scale(0);
   }

   to {
      transform: scale(1);
   }
}
```

很显然，此时 transform 属性冲突了，怎么办？很简单，使用标签进行嵌套就好了：

```html
<div class="toast">
   <div class-="content">提示内容</div>
</div>
<style>
   .toast {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
   }

   .content {
      color: #fff;
      background-color: rgba(0, 0, 0, 0.75);
      animation: scaleUp 300ms;
   }
</style>
```

同样，我们还可以通过元素嵌套，分别应用动画实现更复杂的动画效果，典型的例子就是动画时间函数分解实现抛物线运动效果。

在页面中点击“加入购物车”按钮，就会看到有商品以抛物线运动的方式飞向购物车，效果如图 5-75 所示。

![](res/2022-03-12-16-19-46.png)

[animation-nested-tag](embedded-codesandbox://css-new-world-stronger-visual-performance/animation-nested-tag)

假设飞出去的元素的 HTML 代码结构如下：

```html
<div class="fly-item">
   <img src="./book.jpg" />
</div>
```

实现抛物线效果的关键 CSS 代码如下：

```css
.fly-item,
.fly-item > img {
   position: absolute;
   transition: transform 0.5s;
}

.fly-item {
   transition-timing-function: linear;
}

.fly-item > img {
   transition-timing-function: cubic-bezier(0.55, 0, 0.85, 0.36);
}
```

其中，父元素 .fly-item 只负责横向线性运动，子元素 `<img>` 只负责纵向运动，只不过纵向运动是先慢后快的。

将纵向运动和横向运动合并，就产生了抛物线运动的视觉效果。大家可以想象一下扔铅球，铅球水平飞行的速度其实近似匀速，但是受到重力的影响，铅球下落的速度是越来越快的，于是抛物线效果就产生了。

类似的通过标签嵌套实现动画效果的例子还有很多，在这里就不一一列举了，重要的是思路和意识，希望大家遇到类似场景时能够想到这样的小技巧。
