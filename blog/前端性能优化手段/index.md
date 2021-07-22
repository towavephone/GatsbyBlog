---
title: 前端性能优化手段
date: 2021-7-20 23:24:22
categories:
  - 前端
tags: 面试, 前端, 前端性能优化
path: /front-end-performance-optimization-2021/
---

# RAIL 模型

RAIL 是一个以用户为中心的性能模型，它把用户的体验拆分成几个关键点（例如，tap，scroll，load），并且帮你定义好了每一个的性能指标。

有以下四个方面：

- Response
- Animation
- Idle
- Load

![](res/2021-07-20-23-26-26.png)

## 聚焦用户

以下是用户对性能延迟的感知：

| 延迟时间        | 用户感知                   |
| :-------------- | :------------------------- |
| 0-16ms          | 很流畅                     |
| 0-100ms         | 基本流畅                   |
| 100-1000ms      | 感觉到网站上有一些加载任务 |
| 1000ms or more  | 失去耐心了                 |
| 10000ms or more | 直接离开，不会再访问了     |

## Response: 事件处理最好在 50ms 内完成

### 目标

用户的输入到响应的时间不超过 100ms，给用户的感受是瞬间就完成了。

### 优化方案

- 事件处理函数在 50ms 内完成，考虑到 idle task 的情况，事件会排队，等待时间大概在 50ms。适用于 click，toggle，starting animations 等，不适用于 drag 和 scroll。
- 复杂的 js 计算尽可能放在后台，如 web worker，避免对用户输入造成阻塞
- 超过 50ms 的响应，一定要提供反馈，比如倒计时，进度百分比等。

> idle task：除了要处理输入事件，浏览器还有其它任务要做，这些任务会占用部分时间，一般情况会花费 50ms 的时间，输入事件的响应则排在其后。

下图是 idle task 对 input response 的影响：

![](res/2021-07-20-23-32-38.png)

## Animation: 在 10ms 内产生一帧

### 目标

- 产生每一帧的时间不要超过 10ms，为了保证浏览器 60 帧，每一帧的时间在 16ms 左右，但浏览器需要用 6ms 来渲染每一帧。
- 旨在视觉上的平滑。用户对帧率变化感知很敏感。

### 优化方案

- 在一些高压点上，比如动画，不要去挑战 cpu，尽可能地少做事，如：取 offset，设置 style 等操作。尽可能地保证 60 帧的体验。
- 在渲染性能上，针对不同的动画做一些特定优化

> 动画不只是 UI 的视觉效果，以下行为都属于
>
> - 视觉动画，如渐隐渐显，tweens，loading 等
> - 滚动，包含弹性滚动，松开手指后，滚动会持续一段距离
> - 拖拽，缩放，经常伴随着用户行为

## Idle: 最大化空闲时间

### 目标

最大化空闲时间，以增大 50ms 内响应用户输入的几率

### 优化方案

- 用空闲时间来完成一些延后的工作，如先加载页面可见的部分，然后利用空闲时间加载剩余部分，此处可以使用 requestIdleCallback API
- 在空闲时间内执行的任务尽量控制在 50ms 以内，如果更长的话，会影响 input handle 的 pending 时间
- 如果用户在空闲时间任务进行时进行交互，必须以此为最高优先级，并暂停空闲时间的任务

## Load: 传输内容到页面可交互的时间不超过 5 秒

如果页面加载比较慢，用户的焦点可能会离开。加载很快的页面，用户平均停留时间会变长，跳出率会更低，也就有更高的广告查看率

### 目标

- 优化加载速度，可以根据设备、网络等条件。目前，比较好的一个方式是，让你的页面在一个中配的 3G 网络手机上打开时间不超过 5 秒
- 对于第二次打开，尽量不超过 2 秒

### 优化方案

- 在手机设备上测试加载性能，选用中配的 3G 网络（400kb/s，400ms RTT），可以使用 [WebPageTest](https://www.webpagetest.org/easy) 来测试
- 要注意的是，即使用户的网络是 4G，但因为丢包或者网络波动，可能会比预期的更慢禁用渲染阻塞的资源
- [禁用渲染阻塞的资源，延后加载](https://web.dev/render-blocking-resources/)
- 可以采用 lazy load，code-splitting 等其他优化手段，让第一次加载的资源更少

## 总结

为了提升用户在网站的交互体验而不断探索。你需要去理解用户如何感知你的站点，这样才能设置最佳的性能目标

- 聚焦用户
- 100ms 内响应用户的输入
- 10ms 内产生 1 帧，在滚动或者动画执行时
- 最大化主线程的空闲时间
- 5s 内让网页变得可交互

# 性能优化

## 背景

性能优化一直以来都是前端工程领域中的一个重要部分。很多资料表明，网站应用的性能（加载速度、交互流畅度）优化对于提高用户留存、转化率等都有积极影响。可以理解为，提升你的网站性能，就是提升你的业务数据（甚至是业务收入）。

性能优化广义上会包含前端优化和后端优化。后端优化的关注点更多的时候是在增加资源利用率、降低资源成本以及提高稳定性上。相较于后端，前端的性能优化会更直接与用户的体验挂钩。从用户体验侧来说，前端服务 5s 的加载时间优化缩减 80%(1s) 与后端服务 50ms 的响应优化缩减 80%(10ms) 相比，用户的体验提升会更大。因此很多时候，与体验相关的性能的瓶颈会出现在前端。

> 当然后端性能优化非常重要，正如上面所说，它们的关注点可能不同。前端类似于最后一公里，由于和用户最近，所以性能问题会直接影响到用户体验。

![](res/2021-07-21-00-10-40.png)

## 缓存

[深入理解浏览器的缓存机制](/deep-learn-browser-cache/)

## 发送请求

在前一部分，我们介绍了浏览器缓存。当一个请求走过了各级前端缓存后，就会需要实际发送一个请求了。

> 在 HTTP 缓存中，我们其实也有发送请求；或者是在 HTTP/2 Push 下，使用了之前连接中推送的资源。不过为了保证思路的连贯，我还是把「发送请求」这个章节整体放在「缓存」之后了。

介绍网络请求其实可以包含复杂的网络知识。不过，今天咱们的旅程主要聚焦于“前端性能优化”。因此，主要会介绍一些在这个环节中，前端性能优化可能会做的事儿。

### 避免多余重定向

重定向是一个比较常用的技术手段。在一些情况下，你可能进行了服务迁移，修改了原有的 uri。这时候就可以使用重定向，把访问原网址的用户重定向到新的 uri。还有是在一些登录场景下，会使用到重定向技术。

重定向分为 301 的永久重定向和 302 的临时重定向。建议贴合语义，例如服务迁移的情况下，使用 301 重定向。对 SEO 也会更友好。

同时也不要滥用重定向。曾今也见过有业务在访问后重定向 3 次的情况，其实里面有些是不必要的。每次重定向都是有请求耗时的，建议避免过多的重定向。

### DNS 预解析

基本我们访问远程服务的时候，不会直接使用服务的 IP，而是使用域名。所以请求的一个重要环节就是域名解析。

DNS 服务本身是一个树状层级结构，其解析是一个递归与迭代的过程。例如 github.com 的大致解析流程如下：

1. 先检查本地 hosts 文件中是否有映射，有则使用；
2. 查找本地 DNS 缓存，有则返回；
3. 根据配置在 TCP/IP 参数中设置 DNS 查询服务器，并向其进行查询，这里先称为本地 DNS；
4. 如果该服务器无法解析域名（没有缓存），且不需要转发，则会向根服务器请求；
5. 根服务器根据域名类型判断对应的顶级域名服务器（.com），返回给本地 DNS，然后重复该过程，直到找到该域名；
6. 当然，如果设置了转发，本地 DNS 会将请求逐级转发，直到转发服务器返回或者也不能解析。

这里我们需要了解的是：

- 首先，DNS 解析流程可能会很长，耗时很高，所以整个 DNS 服务，包括客户端都会有缓存机制，这个作为前端不好涉入；
- 其次，在 DNS 解析上，前端还是可以通过浏览器提供的其他手段来“加速”的。

DNS Prefetch 就是浏览器提供给我们的一个 API。它是 Resource Hint 的一部分。它可以告诉浏览器：过会我就可能要去 yourwebsite.com 上下载一个资源啦，帮我先解析一下域名吧。这样之后用户点击某个按钮，触发了 yourwebsite.com 域名下的远程请求时，就略去了 DNS 解析的步骤。使用方式很简单：

```html
<link rel="dns-prefetch" href="//yourwebsite.com" />
```

当然，浏览器并不保证一定会去解析域名，可能会根据当前的网络、负载等状况做决定。标准里也明确写了

> user agent SHOULD resolve as early as possible

### 预先建立连接

我们知道，建立连接不仅需要 DNS 查询，还需要进行 TCP 协议握手，有些还会有 TLS/SSL 协议，这些都会导致连接的耗时。使用 Preconnect 可以帮助你告诉浏览器：“我有一些资源会用到某个源（origin），你可以帮我预先建立连接。”

根据规范，当你使用 Preconnect 时，浏览器大致做了如下处理：

- 首先，解析 Preconnect 的 url；
- 其次，根据当前 link 元素中的属性进行 cors 的设置；
- 然后，默认先将 credential 设为 true，如果 cors 为 Anonymous 并且存在跨域，则将 credential 置为 false；
- 最后，进行连接。

使用 Preconnect 只需要将 rel 属性设为 preconnect 即可：

```html
<link rel="preconnect" href="//sample.com" />
```

当然，你也可以设置 CORS：

```html
<link rel="preconnect" href="//sample.com" crossorigin />
```

需要注意的是，标准并没有硬性规定浏览器一定要（而是 SHOULD）完成整个连接过程，与 DNS Prefetch 类似，浏览器可以视情况完成部分工作。

### 使用 CDN

当我们实际把网络包发向我们的目标地址时，肯定希望越快到达目的地越好（对应的，也会希望越快获得响应）。而网络传输是有极限的，同样一个北京的用户，访问北京的服务器显然要比广州快很多。同时，服务的负载也会影响响应的速度。

对于静态资源，我们可以考虑通过 CDN 来降低时延。

对于使用 CDN 的资源，DNS 解析会将 CDN 资源的域名解析到 CDN 服务的负载均衡器上，负载均衡器可以通过请求的信息获取用户对应的地理区域，从而通过负载均衡算法，在背后的诸多服务器中，综合选择一台地理位置近、负载低的机器来提供服务。例如为北京联通用户解析北京的服务器 IP。这样，用户在之后访问 CDN 资源时都是访问北京服务器，距离近，速度快。

下图是请求声明周期中各个阶段的示意图，可以帮助我们理解发送请求（以及接收响应）的流程。

![](res/2021-07-21-00-30-04.png)

在缓存没法满足我们的情况下，就要开始真正发送请求了。从前端性能优化视角，我们会关注重定向、DNS 解析等问题，从而加速请求。但这块还预留了一小部分 —— 服务端的处理与响应。

过去，我们会将前端局限在浏览器中，但是随着 NodeJS 的兴起，很多业务都引入了基于 NodeJS 的 BFF 来为前端（客户端端）提供服务。所以咱们这次的旅程也会简单聊一下，在这一阶段可以做的一些优化。

## 服务端响应

把这一部分放进前端性能优化并不是很严谨：

- 服务端有着服务端的通用技术手段，这块深入去研究，会是一个不一样的领域；
- 我们既然在讨论前端性能优化，这部分主要还是指 NodeJS，但不是所有业务都使用 NodeJS。

所以这里只会提一些实践中碰到的小点，辅以一些拓展阅读，希望能帮助大家抛砖引玉，开拓思维。

### 使用流进行响应

目前，现代浏览器都支持根据流的返回形式来逐步进行页面内容的解析、处理。这就意味着，即使请求的响应没有完全结束，浏览器也可以从手里已有的响应结果中进行页面的解析与渲染。

例如 [css-only-chat-node](https://github.com/kkuchta/css-only-chat) 就利用了这个特点来实现无刷新、无 JavaScript 的页面更新。

### 业务聚合

BFF 非常合适做的一件事就是后端服务的聚合。

如果你有一个两个接口服务：第一个服务是先获取产品信息，再根据产品信息中的上架时间通过第二个服务获取该时间后的产品列表。这个业务逻辑如果放在前端（浏览器）处理将会串行发送两个请求。假设每个请求 200ms，那么就需要等待 400ms。如果引入 NodeJS，这一层可以放在 NodeJS 中实现。NodeJS 部署的位置一般离其他后端服务“更近”，例如同一个局域网。这类服务间的请求耗时显然更低，可能只需要 200(浏览器) + 30(NodeJS) \* 2 = 260ms。

此外，如果一个业务需要在前端并发三、四个请求来获取完整数据，那么放在 NodeJS 的 BFF 层也是一个不错的选择。

### 避免代码问题

代码问题其实就非常细节了。简单列举一些常见的问题：

- async await 的不当使用导致并行请求被串行化了；
- 频繁地 JSON.parse 和 JSON.stringify 大对象；
- 正则表达式的灾难性回溯；
- 闭包导致的内存泄漏；
- CPU 密集型任务导致事件循环 delay 严重；
- 未捕获的异常导致进程频繁退出，守护进程（pm2/supervisor）又将进程重启，这种频繁的启停也会比较消耗资源；

## 页面解析与处理

这一阶段浏览器需要处理的东西很多，为了更好地理解性能优化，我们主要将其分为几个部分：

- 页面 DOM 的解析；
- 页面静态资源的加载，包括了页面引用的 JavaScript/CSS/图片/字体等；
- 静态资源的解析与处理，像是 JavaScript 的执行、CSSOM 的构建与样式合成等；

大致过程就是解析页面 DOM 结构，遇到外部资源就加载，加载好了就使用。但是由于这部分的内容比较多，所以在这一节里我们重点关注页面的解析（其他部分在写一节中介绍）。

### 注意资源在页面文档中的位置

我们的目标是收到内容就尽快解析处理，页面有依赖的资源就尽快发送请求，收到响应则尽快处理。然而，这个美好的目标也有可能会被我们不小心破坏。

JavaScript 脚本和 CSS 样式表在关于 DOM 元素的属性，尤其是样式属性上都有操作的权利。这就像是一个多线程问题。服务端多线程编程中经常通过锁来保证线程间的互斥。回到咱们的前端，现在也是两方在竞争同一个资源，显然也是会有互斥的问题。这就带来了 DOM 解析、JavaScript 加载与执行、CSS 加载与使用之间的一些互斥关系。

仅仅看 DOM 与 CSS 的关系，则如下图所示：

![](res/2021-07-21-15-16-43.png)

HTML 解析为 DOM Tree，CSS 解析为 CSSOM，两者再合成 Render Tree，并行执行，非常完美。然而，当 JavaScript 入场之后，局面就变了：

![](res/2021-07-21-15-16-52.png)

根据标准规范，在 JavaScript 中可以访问 DOM。因此当遇到 JavaScript 后会阻塞 DOM 的解析。于此同时，为避免 CSS 与 JavaScript 之间的竞态，CSSOM 的构建会阻塞 JavaScript 的脚本执行。总结起来就是

> JavaScript 会阻塞 DOM 构建，而 CSSOM 的构建又会阻塞 JavaScript 的执行。

所以这就是为什么在优化的最佳实践中，我们基本都推荐把 CSS 样式表放在 `<head>` 之中（即页面的头部），把 JavaScript 脚本放在 `<body>` 的最后（即页面的尾部）。

### 使用 defer 和 async

上面提到了，当 DOM 解析遇到 JavaScript 脚本时，会停止解析，开始下载脚本并执行，再恢复解析，相当于是阻塞了 DOM 构建。

那除了将脚本放在 body 的最后，还有什么优化方法么？是有的。

可以使用 defer 或 async 属性。两者都会防止 JavaScript 脚本的下载阻塞 DOM 构建。但是两者也有区别，最直观的表现如下：

![](res/2021-07-21-15-19-34.png)

defer 会在 HTML 解析完成后，按照脚本出现的次序再顺序执行；而 async 则是下载完成就立即开始执行，同时阻塞页面解析，不保证脚本间的执行顺序。

根据它们的特点，推荐在一些与主业务无关的 JavaScript 脚本上使用 async。例如统计脚本、监控脚本、广告脚本等。这些脚本一般都是一份独立的文件，没有外部依赖，不需要访问 DOM，也不需要有严格的执行时机限制。在这些脚本上使用 async 可以有效避免这些非核心功能的加载影响页面解析速度。

### 页面文档压缩

HTML 的文档大小也会极大影响响应体下载的时间。一般会进行 HTML 内容压缩（uglify）的同时，使用文本压缩算法（例如 gzip）进行文本的压缩。关于资源压缩这一块，在下一节的内容中还会再详细进行介绍。

## 页面静态资源

在上一节中，我们介绍了基本的页面解析机制，通过对资源加载顺序和脚本加载的控制，避免了无谓的阻塞，优化了解析性能。

也正如上一站中所说，这时浏览器除了解析页面 DOM 外，还会对页面包含的静态资源发起请求，请求回来后会执行或使用资源。

首先从宏观上来了解一下：

### 总体原则

这一部分会涉及到各类常见的静态资源：JavaScript 脚本、CSS 样式表、图片、字体等。不同资源的优化措施既有联系又有差别，后续会以各类资源为维度，针对性介绍其优化的关注点和手段。

但咱们还是要先从整体维度上进行一些分析。其实在总体原则上，各类资源的优化思路都是大体类似的，包括但不限于：

- 减少不必要的请求
- 减少包体大小
- 降低应用资源时的消耗
- 利用缓存

为了大家能更好理解各类优化实施策略从何而来，先初步扩展一下以上的思路。

#### 减少不必要的请求

核心是希望能够减少请求的数量，因为浏览器对同源请求有并发上限的限制（例如 Chrome 是 6），所以在 HTTP/1.1 下，请求过多可能会导致请求被排队了。一个典型场景就是一些图库类型的网站，页面加载后可能需要请求十数张图片。

同时，TCP/IP 的拥塞控制也使其传输有慢启动（slow start）的特点，连接刚建立时包体传输速率较低，后续会渐渐提速。因此，发送过多的“小”请求可能也不是一个很好的做法。

减少不必要的请求主要分为几个维度：

- 对于不需要使用的内容，其实不需要请求，否则相当于做了无用功；
- 对于可以延迟加载的内容，不必要现在就立刻加载，最好就在需要使用之前再加载；
- 对于可以合并的资源，进行资源合并也是一种方法。

#### 减少包体大小

包体大小对性能也是有直接影响的。显然同样速率下，包体越小，传输耗时越低，整体页面加载与渲染的性能也会更好。

减少包体大小常用的方式包括了：

- 使用适合当前资源的压缩技术；
- 避免在响应包体里“塞入”一些不需要的内容。

#### 降低应用资源时的消耗

以上主要的关注点都在页面资源加载的效率，其实有些时候，浏览器去执行或使用资源的也是有消耗的。例如在 JavaScript 执行了一段 CPU 密集的计算，或者进行频繁的 DOM 操作，这些都会让 JavaScript 的执行变成影响性能的一大问题。虽然今天的像 V8 这样的引擎已经很快了，但是一些不当的操作仍然会带来性能的损耗。

此外，像是 CSS 选择器匹配、图片的解析与处理等，都是要消耗 CPU 和内存的。也许这些不太常成为性能杀手，但是某些特性场合下，了解它们也许会对你有所帮助。

#### 利用缓存

还记得咱们这趟旅程从哪出发的么？没错，缓存。

在旅程的第一站，我们介绍了浏览器访问一个 url 时的多级缓存策略。千万不要忘了，这些静态子资源也是网络请求，它们仍然可以利用之前介绍的完整缓存流程。缓存在很多时候会是一个帮你解决性能问题的非常有效的手段。

由于第一站已经对缓存进行了详细介绍，所以缓存这部分，在这一站里只会在针对资源类型再补充一些内容。

### 针对各类资源的性能优化

以上的原则可以指导我们针对性地优化各类资源。下面我就以资源类型为维度，详细介绍其中涉及到的优化点与优化措施。

### JavaScript

随着 Web 的发展，JavaScript 从以前只承担简单的脚本功能，到现在被用于构建大型、复杂的前端应用，经历了很大的发展。这也让它在当下的前端应用中扮演了一个非常重要的角色，因此在这一节首先来看看的我们熟悉的 JavaScript。

#### 减少不必要的请求

在进行 JavaScript 优化时，我们还是秉承总体思路，首先就是减少不必要的请求。

##### 代码拆分（code split）与按需加载

相信熟练使用 webpack 的同学对这一特性都不陌生。

虽然整体应用的代码非常多，但是很多时候，我们在访问一个页面时，并不需要把其他页面的组件也全部加载过来，完全可以等到访问其他页面时，再按需去动态加载。核心思路如下所示：

```js
document.getElementById('btn').addEventListener('click', (e) => {
  // 在这里加载 chat 组件相关资源 chat.js
  const script = document.createElement('script');
  script.src = '/static/js/chat.js';
  document.getElementsByTagName('head')[0].appendChild(script);
});
```

在按钮点击的监听函数中，我动态添加了 `<script>` 元素。这样就可以实现在点击按钮时，才加载对应的 JavaScript 脚本。

代码拆分一般会配合构建工具一起使用。以 webpack 为例，在日常使用时，最常见的方式就是通过 dynamic import 来告诉 webpack 去做代码拆分。webpack 编译时会进行语法分析，之后遇到 dynamic import 就会认为这个模块是需要动态加载的。相应的，其子资源也会被如此处理（除非被其他非动态模块也引用了）。

在 webpack 中使用代码拆分最常见的一个场景是基于路由的代码拆分。目前很多前端应用都在使用 SPA（单页面应用）形式，或者 SPA 与 MPA（多页面应用）的结合体，这就会涉及到前端路由。而页面间的业务差异也让基于路由的代码拆分成为一个最佳实践。

当然，如果你不使用 webpack 之类的构建工具，你也可以选择一个 AMD 模块加载器（例如 RequireJS）来实现前端运行时上的异步依赖加载。

##### 代码合并

我们在总体思路里有提到，减少请求的一个方法就是合并资源。试想一个极端情况：我们现在不对 node_modules 中的代码进行打包合并，那么当我们请求一个脚本之前将可能会并发请求数十甚至上百个依赖的脚本库。同域名下的并发请求数过高会导致请求排队，同时还可能受到 TCP/IP 慢启动的影响。

当然，在很多流行的构建工具中（webpack/Rollup/Parcel），是默认会帮你把依赖打包到一起的。不过当你使用其他一些工具时，就要注意了。例如使用 FIS3 时，就需要通过配置声明，将一些 common 库或 npm 依赖进行打包合并。又或者使用 Gulp 这样的工具，也需要注意进行打包。

总之，千万不要让你的碎文件散落一地。

#### 减少包体大小

##### 代码压缩

JavaScript 代码压缩比较常见的做法就是使用 UglifyJS 做源码级别的压缩。它会通过将变量替换为短命名、去掉多余的换行符等方式，在尽量不改变源码逻辑的情况下，做到代码体积的压缩。基本已经成为了前端开发的标配。在 webpack 的 production 模式下是默认开启的；而在 Gulp 这样的任务流管理工具上也有 gulp-uglify 这样的功能插件。

另一个代码压缩的常用手段是使用一些文本压缩算法，gzip 就是常用的一种方式。

![](res/2021-07-22-09-40-34.png)

上图中响应头的 Content-Encoding 表示其使用了 gzip。

![](res/2021-07-22-09-52-07.png)

深色的数字表示压缩后的大小为 22.0KB，浅色部分表示压缩前的大小为 91.9KB，压缩比还是挺大的，很有效果。一般服务器都会内置相应模块来进行 gzip 处理，不需要我们单独编写压缩算法模块。例如在 Nginx 中就包含了 ngx_http_gzip_module 模块，通过简单的配置就可以开启。

```
gzip            on;
gzip_min_length 1000;
gzip_comp_level 6;
gzip_types      application/javascript application/x-javascript text/javascript;
```

##### Tree Shaking

Tree Shaking 最早进入到前端的视线主要是因为 Rollup。后来在 webpack 中也被实现了。其本质是通过检测源码中不会被使用到的部分，将其删除，从而减小代码的体积。例如：

```js
// 模块 A
export function add(a, b) {
  return a + b;
}

export function minus(a, b) {
  return a - b;
}

// 模块 B
import { add } from 'module.A.js';
console.log(add(1, 2));
```

可以看到，模块 B 引用了模块 A，但是只使用了 add 方法。因此 minus 方法相当于成为了 Dead Code，将它打包进去没有意义，该方法是永远不会被使用到的。

注意，我在上面的代码中使用了 ESM 规范的模块语法，而没有使用 CommonJS。这主要是由于 Tree Shaking 算是一种静态分析，而 ESM 本身是一种的静态的模块化规范，所有依赖可以在编译期确定。

注意，刚才说了 Tree Shaking 非常依赖于 ESM。像是前端流行的工具库 lodash 一般直接安装的版本是非 ESM 的，为了支持 Tree Shaking，我们需要去安装它的 ESM 版本 —— lodash-es 来实现 Tree Shaking。

此外，Chrome DevTools 也可以帮助你查看加载的 JavaScript 代码的使用覆盖率。

##### 优化 polyfill 的使用

前端技术的一大特点就是需要考虑兼容性。为了让大家能顺畅地使用浏览器的新特性，一些程序员们开发了新特性对应的 polyfill，用于在非兼容浏览器上也能使用新特性的 API。后续升级不用改动业务代码，只需要删除相应的 polyfill 即可。

这种舒适的开发体验也让 polyfill 成为了很多项目中不可或缺的一份子。然而 polyfill 也是有代价的，它增加了代码的体积。毕竟 polyfill 也是 JavaScript 写的，不是内置在浏览器中，引入的越多，代码体积也越大。所以，只加载真正所需的 polyfill 将会帮助你减小代码体积。

首先，不是每个业务的兼容性要求都一样。因此，按你业务的场景来确定引入哪些 polyfill 是最合适的。然而，特性千千万，手动 import 或者添加 Babel Transformer 显然是一件成本极高的事。针对这点，我们可以通过 browserslist 来帮忙，许多前端工具（babel-preset-env/autoprefixer/eslint-plugin-compat）都依赖于它。使用方式可以看这里。

其次，在 Chrome Dev Summit 2018 上还介绍了一种 Differential Serving 的技术，通过浏览器原生模块化 API 来尽量避免加载无用 polyfill。

```html
<script type="module" src="main.mjs"></script>
<script nomodule src="legacy.js"></script>
```

这样，在能够处理 module 属性的浏览器（具有很多新特性）上就只需加载 main.mjs（不包含 polyfill），而在老式浏览器下，则会加载 legacy.js（包含 polyfill）。

最后，其实在理想上，polyfill 最优的使用方式应该是根据浏览器特性来分发，同一个项目在不同的浏览器，会加载不同的 polyfill 文件。例如 Polyfill.io 就会根据请求头中的客户端特性与所需的 API 特性来按实际情况返回必须的 polyfill 集合。

##### webpack

webpack 现在已经成为很多前端应用的构建工具，因此这里单独将其列了出来。我们可以通过 webpack-bundle-analyzer 这个工具来查看打包代码里面各个模块的占用大小。

很多时候，打包体积过大主要是因为引入了不合适的包，对于如何优化依赖包的引入，这里有一些[建议](https://github.com/GoogleChromeLabs/webpack-libs-optimizations)可以帮助你减小 bundle 的体积。

![](res/webpack-bundle-analyzer.gif)

#### 解析与执行

除了 JavaScript 下载需要耗时外，脚本的解析与执行也是会消耗时间的。

##### JavaScript 的解析耗时

很多情况下，我们会忽略 JavaScript 文件的解析。一个 JavaScript 文件，即使内部没有所谓的“立即执行函数”，JavaScript 引擎也是需要对其进行解析和编译的。

![](res/2021-07-22-10-02-31.png)

从上图可以看出，解析与编译消耗了好几百毫秒。所以换一个角度来说，删除不必要的代码，对于降低 Parse 与 Compile 的负载也是很有帮助的。

同时，我们从前一节已经知道，JavaScript 的解析、编译和执行会阻塞页面解析，延迟用户交互。所以有时候，加载同样字节数的 JavaScript 对性能的影响可能会高于图片，因为图片的处理可以放在其他线程中并行执行。

##### 避免 Long Task

对于一些单页应用，在加载完核心的 JavaScript 资源后，可能会需要执行大量的逻辑。如果处理不好，可能会出现 JavaScript 线程长时间执行而阻塞主线程的情况。

![](res/2021-07-22-10-08-35.png)

例如在上图中，帧率下降明显的地方出现了 Long Task，伴随着的是有一段超过 700 ms 的脚本执行时间。而性能指标 FCP 与 DCL 处于其后，一定程度上可以认为，这个 Long Task 阻塞了主线程并拖慢了页面的加载时间，严重影响了前端性能与体验。

想要了解更多关于 Long Task 的内容，可以看看 Long Task 相关的[标准](https://w3c.github.io/longtasks/)。

##### 是否真的需要框架

相信如果现在问大家，我们是否需要 React、Vue、Angular 或其他前端框架（库），大概率是肯定的。

但是我们可以换个角度来思考这个问题。类库/框架帮我们解决的问题之一是快速开发与后续维护代码，很多时候，类库/框架的开发者是需要在可维护性、易用性和性能上做取舍的。对于一个复杂的整站应用，使用框架给你的既定编程范式将会在各个层面提升你工作的质量。但是，对于某些页面，我们是否可以反其道行之呢？

例如产品经理反馈，咱们的落地页加载太慢了，用户容易流失。这时候你会开始优化性能，用上这次「性能之旅」里的各种措施。但你有没有考虑过，对于像落地页这样的、类似静态页的页面，是不是可以“返璞归真”？

也许你使用了 React 技术栈 —— 你加载了 React、Redux、React-Redux、一堆 Reducers…… 好吧，整个 JavaScript 可能快 1MB 了。更重要的是，这个页面如果是用于拉新的，这也代表着访问者并没有缓存可以用。好吧，为了一个静态页（或者还有一些非常简单的表单交互），用户付出了高额的成本，而原本这只需要 50 行不到的代码。所以有时候考虑使用原生 JavaScript 来实现它也是一种策略。Netflix 有一篇[文章](https://medium.com/dev-channel/a-netflix-web-performance-case-study-c0bcde26a9d9)介绍了他们是如何通过这种方式大幅缩减加载与操作响应时间的。

当然，还是强调一下，并不是说不要使用框架/类库，只是希望大家不要拘泥于某个思维定式。做工具的主人，而不是工具的“奴隶”。

##### 针对代码的优化

> 请注意，截止目前（2019.08）以下内容不建议在生产环境中使用。

还有一种优化思路是把代码变为最优状态。它其实算是一种编译优化。在一些编译型的静态语言上（例如 C++），通过编译器进行一些优化非常常见。

这里要提到的就是 facebook 推出的 Prepack。例如下面一段代码：

```js
(function() {
  function hello() {
    return 'hello';
  }
  function world() {
    return 'world';
  }
  global.s = hello() + ' ' + world();
})();
```

可以优化为：

```js
s = 'hello world';
```

不过很多时候，代码体积和运行性能是会有矛盾的。同时 Prepack 也还不够成熟，所以不建议在生产环境中使用。

#### 缓存

JavaScript 部分的缓存与我们在第一部分里提到的缓存基本一致，如果你记不太清了，可以回到咱们的第一站。

##### 发布与部署

这里简单提一下：大多数情况下，我们对于 JavaScript 与 CSS 这样的静态资源，都会启动 HTTP 缓存。当然，可能使用强缓存，也可能使用协商缓存。当我们在强缓存机制上发布了更新的时候，如何让浏览器弃用缓存，请求新的资源呢？

一般会有一套配合的方式：首先在文件名中包含文件内容的 Hash，内容修改后，文件名就会变化；同时，设置不对页面进行强缓存，这样对于内容更新的静态资源，由于 uri 变了，肯定不会再走缓存，而没有变动的资源则仍然可以使用缓存。

上面说的主要涉及前端资源的发布和部署，详细可以看[这篇内容](https://www.zhihu.com/question/20790576/answer/32602154)，这里就不展开了。

##### 将基础库代码打包合并

为了更好利用缓存，我们一般会把不容易变化的部分单独抽取出来。例如一个 React 技术栈的项目，可能会将 React、Redux、React-Router 这类基础库单独打包出一个文件。

这样做的优点在于，由于基础库被单独打包在一起了，即使业务代码经常变动，也不会导致整个缓存失效。基础框架/库、项目中的 common、util 仍然可以利用缓存，不会每次发布新版都会让用户花费不必要的带宽重新下载基础库。

所以一种常见的策略就是将基础库这种 Cache 周期较长的内容单独打包在一起，利用缓存减少新版本发布后用户的访问速度。这种方法本质上是将缓存周期不同的内容分离了，隔离了变化。

webpack 在 v3.x 以及之前，可以通过 CommonChunkPlugin 来分离一些公共库。而升级到 v4.x 之后有了一个新的配置项 `optimization.splitChunks`:

```js
// webpack.config.js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks: 'all',
      minChunks: 1,
      cacheGroups: {
        commons: {
          minChunks: 1,
          automaticNamePrefix: 'commons',
          test: /[\\/]node_modules[\\/]react|redux|react-redux/,
          chunks: 'all'
        }
      }
    }
  }
};
```

##### 减少 webpack 编译不当带来的缓存失效

由于 webpack 已经成为前端主流的构建工具，因此这里再特别提一下使用 webpack 时的一些注意点，减少一些不必要的缓存失效。

我们知道，对于每个模块 webpack 都会分配一个唯一的模块 ID，一般情况下 webpack 会使用自增 ID。这就可能导致一个问题：一些模块虽然它们的代码没有变化，但由于增/删了新的其他模块，导致后续所有的模块 ID 都变更了，文件 MD5 也就变化了。另一个问题在于，webpack 的入口文件除了包含它的 runtime、业务模块代码，同时还有一个用于异步加载的小型 manifest，任何一个模块的变化，最后必然会传导到入口文件。这些都会使得网站发布后，没有改动源码的资源也会缓存失效。

规避这些问题有一些常用的方式。

###### 使用 Hash 来替代自增 ID

你可以使用 HashedModuleIdsPlugin 插件，它会根据模块的相对路径来计算 Hash 值。当然，你也可以使用 webpack 提供的 optimization.moduleIds，将其设置为 hash，或者选择其他合适的方式。

###### 将 runtime chunk 单独拆分出来

通过 `optimization.runtimeChunk` 配置可以让 webpack 把包含 manifest 的 runtime 部分单独分离出来，这样就可以尽可能限制变动影响的文件范围。

```js
// webpack.config.js
module.exports = {
  //...
  optimization: {
    runtimeChunk: {
      name: 'runtime'
    }
  }
};
```

###### 使用 records

你可以通过 recordsPath 配置来让 webpack 产出一个包含模块信息记录的 JSON 文件，其中包含了一些模块标识的信息，可以用于之后的编译。这样在后续的打包编译时，对于被拆分出来的 Bundle，webpack 就可以根据 records 中的信息来尽量避免破坏缓存。

```js
// webpack.config.js
module.exports = {
  //...
  recordsPath: path.join(__dirname, 'records.json')
};
```

### CSS

#### 关键 CSS

在性能优化上，其实我们会更关注关键渲染路径（Critical Rendering Path，即 CRP），而不一定是最快加载完整个页面。

CRP 是指优先显示与当前用户操作有关的内容。由于 CSS 会“间接”阻塞页面的解析，所以在这个过程中的 CSS 也被称为关键 CSS。识别出当前业务中的关键 CSS，优先下载与解析它，将会帮助我们更好降低延迟。

所以我们首先还是需要先建立好概念：很多时候，我们并不是在追求整体页面的最快加载，而是最核心最关键的那部分。例如在视频网站上可能是播放器，在文档站点可能是阅读器。

由于很多时候，关键 CSS 不会太大，因此有一种常见的优化措施是，将关键 CSS 的内容通过 `<style>` 标签内联到 `<head>` 中，然后异步加载其他非关键 CSS。这样对于关键路径的渲染可以减少一次 RTT (Round-Trip Time)。用户可以更快看到一些页面初始的渲染结果。

经典的骨架屏可以算是这种思路的一个延展。我们会生成一个不包含实际功能的静态页面，将必要的脚本、样式、甚至图片（base64）资源都内联到其中，当用户访问时直接先返回该页面，就可以很快让用户看到页面结果，之后在异步渐进加载预渲染，就会让用户感觉“很快”。

![](res/2021-07-22-10-36-46.png)

骨架屏可以手动编写，当然也可以通过编译插件来帮助你自动生成骨架屏

#### 优化资源请求

##### 按需加载

与 JavaScript 类似，我们的 CSS 也是可以按需加载的。尤其在当下组件化盛行的潮流里，组件的按需加载就可能会包括了 JavaScript 脚本、CSS 样式表、图标图片。在上一部分介绍的 webpack code split 也会包含这一部分。

除了使用一些构建工具以及对应的插件外，你也可以使用 loadCSS 这样的库来实现 CSS 文件的按需异步加载。

##### 合并文件

同样的，参照 JavaScript，我们也可以把一些 CSS 文件进行合并来减少请求数。

##### 请求的优先级排序

浏览器中的各类请求是有优先级排序的。低优请求会被排在高优之后再发送。

![](res/2021-07-22-10-41-37.png)

不过可惜的是，浏览器没有将优先级排序的能力给我们直接开放出来。但在一些场景下，我们可以通过更合理的使用媒体类型和媒体查询来实现资源加载的优先级。下面会介绍一下这种方法。

一些网站为了达到不同屏幕之间的兼容，可能会使用媒体查询的方式来构建它的样式系统。一般而言，我们都会把样式代码写在一起，例如导航的在各类屏幕下的样式都会放在 navigator.css 下，列表都会放在 list.css 下。

```html
<link rel="stylesheet" href="navigator.css" /> <link rel="stylesheet" href="list.css" />
```

这里带来的一个问题就是，在宽度小于 400px 的场景下，其实并不需要应用宽度 400px 以上的 CSS 样式。针对这个问题，link 标签上其实有一个 media 属性来处理媒体查询下的加载优先级。浏览器会优先下载匹配当前环境的样式资源，相对的，其他非匹配的优先级会下降。

```html
<link rel="stylesheet" href="navigator.css" media="all" />
<link rel="stylesheet" href="list.css" media="all" />
<link rel="stylesheet" href="navigator.small.css" media="(max-width: 500px)" />
<link rel="stylesheet" href="list.small.css" media="(max-width: 500px)" />
```

这样拆分后，当页面大于 500 px 时，navigator.small.css 和 list.small.css 的优先级会降低，同时，它们也不再会阻塞页面的渲染。需要注意的是，优先级降低代表可能会后加载，并非不加载。

![](res/2021-07-22-10-45-09.png)

##### 慎用 @import

CSS 提供了一个 @import 语法来加载外部的样式文件。然而，这会把你的请求变得串行化。

考虑 index.css 这个资源，页面上是这么引用的：

```html
<link rel="stylesheet" href="index.css" />
```

而在 index.css 中引用了 other.css

```css
/* index.css */
@import url(other.css);
```

这样浏览器只有当下载了 index.css 并解析到其中 @import 时，才会再去请求 other.css。这是一个串行过程。

而如果我们把它改造为

```html
<link rel="stylesheet" href="index.css" /> <link rel="stylesheet" href="other.css" />
```

那就不需要等待 index.css 下载，几乎是并行执行了。

##### 谨慎对待 JavaScript 脚本的位置

将 “JavaScript 脚本放到页面尾部、CSS 放到页面头部”的模式。这只是大多数情况的处理方式。对于一些特殊情况，我们还是需要特殊处理的。

还记得之前提到的一些统计类、监控类的第三方脚本么？一般而言，第三方会提供你如下一段脚本，然后推荐你内联到页面中：

```html
<script>
  var script = document.createElement('script');
  script.src = 'vendor.lib.js';
  document.getElementsByTagName('head')[0].appendChild(script);
</script>
```

我们希望通过这样的方式来尽快异步加载脚本。然而，如果我们一不小心出现了下面这样的操作，可能会事与愿违：

```html
<link rel="stylesheet" href="navigator.css" />
<script>
  var script = document.createElement('script');
  script.src = 'vendor.lib.js';
  document.getElementsByTagName('head')[0].appendChild(script);
</script>
```

这时，navigator.css 的加载会阻塞后面的 JavaScript 执行，这是为了防止后续脚本对样式的查询出现不确定性。所以，这两个资源就变成了串行加载。

要优化这个问题很简单，调换一下顺序即可：

```html
<script>
  var script = document.createElement('script');
  script.src = 'vendor.lib.js';
  document.getElementsByTagName('head')[0].appendChild(script);
</script>
<link rel="stylesheet" href="navigator.css" />
```

这时，vendor.lib.js 和 navigator.css 就会并行加载了。当然，你需要确保不需要查询 navigator.css 样式应用后的信息。

#### 减少包体大小

##### 压缩

CSS 同样可以进行压缩，与 JavaScript 类似，也有相应的 CSS uglify 工具，例如 clean-css，可以优化代码、删除多余的换行与空格。

同时，由于 CSS 同样是文本内容，因此针对文本的各类压缩算法同样适用，最常用到的就是 gzip。如何在 Nginx 上开启它之前也介绍过，这里就不赘述了。

##### 选择合适的兼容性

对于 CSS 的 polyfill，同样可以配合 browserslist 来实现你的业务场景下的兼容性支持。比较常见的是配合 Autoprefixer 和 PostCSS Preset Env 来使用。可以根据指定的浏览器范围，决定使用哪些 CSS polyfill 来帮助你将新的 CSS 代码转换为旧的浏览器能识别的内容。

#### 解析与渲染树构建

##### 简化选择器

在 [浏览器的工作原理：新式网络浏览器幕后揭秘](https://www.html5rocks.com/zh/tutorials/internals/howbrowserswork/) 一文中，作者介绍了样式计算的原理。虽然文章发布时间比较早了，但其中部分内容还是具有参考价值的。

其中指出了，样式数据是一个超大的结构，为每一个元素查找匹配的规则会造成性能问题，同时，复杂的层叠规则也会带来很高的复杂度。针对这些问题浏览器也做了很多优化。

正是由于这些问题，我们应该尽量避免不必要的选择器复杂度。例如下面这个复杂选择器：

```css
body > main.container > section.intro h2:nth-of-type(odd) + p::first-line a[href$='.pdf'] {
  /* …… */
}
```

不过一般情况下我们是不会写出如此复杂的选择器的。但有一个情况还是需要注意一下，就是使用 SASS、LESS 这样的工具时，避免过多的嵌套。以 LESS 为例：

```less
.list {
  .item {
    .product {
      .intro {
        .pic {
          height: 200px;
        }
      }
    }
  }
}
```

由于过多的嵌套，编译后会产生如下选择器：

```css
.list .item .product .intro .pic {
  height: 200px;
}
```

当然，你也可以考虑使用类似 BEM 这样的方式来进行 CSS className 的组织与命名，避免过多的嵌套层级。这里有一篇[文章](https://www.sitepoint.com/optimizing-css-id-selectors-and-other-myths/)介绍了选择器的匹配成本。

不过千万要注意了，代码的可维护性还是最重要的，不要为了过分简化选择器而放弃了代码语义和可维护性。我们仅仅是要尽量避免像上面那样的一些过分复杂的、或者不必要的繁琐的选择器。

##### 避免使用昂贵的属性

有一些 CSS 的属性在渲染上是有比较高的成本的，渲染速度相较而言也会慢些。在不同的浏览器上，具体的表现不太一致，但总体来说，下面一些属性是比较昂贵的：

- border-radius
- box-shadow
- opacity
- transform
- filter
- position: fixed

##### 使用先进的布局方式

对于页面布局，我们有很多方法，例如 float、positioning、flex、grid 等。float 本身设计出来并非是为了处理复杂的布局，但是通过大家的发掘和研究，已经可以通过它来实现很多种布局形式了。基于兼容性考虑，float 也成为了流行的布局方式。

不过，一些资料也指出，使用新版的 flex 进行布局比我们用的一些“老式”方法性能更好（例如基于 float 的浮动布局）。flex 在移动端具有不错的兼容性，很多移动场景下已经大规模使用 flex 进行页面布局。同时，虽然 flex 有兼容性要求，但由于很多 PC 站都不再兼容低版本 IE，因此也可以开始尝试使用它。

#### 利用缓存

与其他静态资源类似，我们仍然可以使用各类缓存策略来加速资源的加载。

此外，如果使用 webpack 作为构建工具，我们一般会使用 css-loader 和 style-loader，这样可以直接在 JavaScript 代码中 import 样式文件。不过这样带来的一个问题就是样式代码其实是耦合在 JavaScript 代码中的，通过运行时添加 style 标签注入页面。

一个更好的做法是在生产环境中将样式信息单独抽离成 CSS 文件，这样也可以更好地利用缓存。在 webpack v4.x 之前的版本中，我们习惯于用 ExtractTextWebpackPlugin 插件。不过在 v4.x 之后，对于 CSS 的抽取，推荐使用 MiniCssExtractPlugin 插件。它可以将样式信息单独抽离出 CSS 文件来。基础的使用方式如下：

```js
// webpack.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[contenthash:8].css',
      chunkFilename: '[contenthash:8].css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  }
};
```

相较于 JavaScript，用户对 CSS 的可控性可能会稍弱一些，基础的优化点也许没有那么多。但随着 CSS 特性（例如 [Houdini/CSS Paint API](https://codersblock.com/blog/say-hello-to-houdini-and-the-css-paint-api/)）的不断发展，相信也会有更多我们需要关注的优化点。

### 图片

优质的图片可以有效吸引用户，给用户良好的体验，所以随着互联网的发展，越来越多的产品开始使用图片来提升产品体验。相较于页面其他元素，图片的体积不容忽视。下图是截止 2019 年 6 月 HTTP Archive 上统计的网站上各类资源加载的体积：

![](res/2021-07-22-11-18-47.png)

可以看到，图片占据了半壁江山。同样，在一篇 2018 年的文章中，也提到了图片在网站中体量的平均占比已经超过了 50%。然而，随着平均加载图片总字节数的增加，图片的请求数却再减少，这也说明网站使用的图片质量和大小正在不断提高。

所以，如果单纯从加载的字节数这个维度来看性能优化，那么很多时候，优化图片带来的流量收益要远高于优化 JavaScript 脚本和 CSS 样式文件。下面我们就来看看，如何优化图片资源。

#### 优化请求数

##### 雪碧图

图片可以合并么？当然。最为常用的图片合并场景就是雪碧图（Sprite）。

在网站上通常会有很多小的图标，不经优化的话，最直接的方式就是将这些小图标保存为一个个独立的图片文件，然后通过 CSS 将对应元素的背景图片设置为对应的图标图片。这么做的一个重要问题在于，页面加载时可能会同时请求非常多的小图标图片，这就会受到浏览器并发 HTTP 请求数的限制。我见过一个没有使用雪碧图的页面，首页加载时需要发送 20+ 请求来加载图标。将图标合并为一张大图可以实现「20+ → 1」的巨大缩减。

雪碧图的核心原理在于设置不同的背景偏移量，大致包含两点：

- 不同的图标元素都会将 background-url 设置为合并后的雪碧图的 uri；
- 不同的图标通过设置对应的 background-position 来展示大图中对应的图标部分。

你可以用 Photoshop 这类工具自己制作雪碧图。当然比较推荐的还是将雪碧图的生成集成到前端自动化构建工具中，例如在 webpack 中使用 webpack-spritesmith，或者在 gulp 中使用 gulp.spritesmith。它们两者都是基于 spritesmith 这个库，你也可以自己将这个库集成到你喜欢的构建工具中。

##### 懒加载

我们知道，一般来说我们访问一个页面，浏览器加载的整个页面其实是要比可视区域大很多的，也是什么我们会提出“首屏”的概念。这就导致其实很多图片是不在首屏中的，如果我们都加载的话，相当于是加载了用户不一定会看到图片。而图片体积一般都不小，这显然是一种流量的浪费。这种场景在一些带图片的长列表或者配图的博客中经常会遇到。

解决的核心思路就是图片懒加载，尽量只加载用户正在浏览或者即将会浏览到的图片。实现上来说最简单的就是通过监听页面滚动，判断图片是否进入视野，从而真正去加载图片：

```js
// 方法一：el.offsetTop - document.documentElement.scrollTop <= viewPortHeight
function loadIfNeeded($img) {
  // viewPortHeight 兼容所有浏览器写法
  const viewPortHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  const offsetTop = $img.offsetTop;
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const top = offsetTop - scrollTop;
  if (top <= viewPortHeight) {
    $img.src = $img.dataset.src;
    $img.classList.remove('lazy');
  }
}

// 方法二：el.getBoundingClientReact().top <= viewPortHeight
function loadIfNeeded($img) {
  const viewPortHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  const top = $img.getBoundingClientRect() && $img.getBoundingClientRect().top;
  if (top <= viewPortHeight) {
    $img.src = $img.dataset.src;
    $img.classList.remove('lazy');
  }
}

// 方法三：intersectionRatio > 0 && intersectionRatio <= 1
function loadIfNeeded($img) {
  const io = new IntersectionObserver((ioes) => {
    ioes.forEach((ioe) => {
      const el = ioe.target;
      const intersectionRatio = ioe.intersectionRatio;
      if (intersectionRatio > 0 && intersectionRatio <= 1) {
        $img.src = $img.dataset.src;
        $img.classList.remove('lazy');
        io.unobserve(el);
      }
      el.onload = el.onerror = () => io.unobserve(el);
    });
  });
  io.observe($img);
}

// 这里使用了 throttle，你可以实现自己的 throttle，也可以使用 lodash
const lazy = throttle(function() {
  const $imgList = document.querySelectorAll('.lazy');
  if ($imgList.length === 0) {
    document.removeEventListener('scroll', lazy);
    window.removeEventListener('resize', lazy);
    window.removeEventListener('orientationchange', lazy);
    return;
  }
  $imgList.forEach(loadIfNeeded);
}, 200);

document.addEventListener('scroll', lazy);
window.addEventListener('resize', lazy);
window.addEventListener('orientationchange', lazy);
```

对于页面上的元素只需要将原本的 src 值设置到 data-src 中即可，而 src 可以设置为一个统一的占位图。注意，由于页面滚动、缩放和横竖方向（移动端）都可能会改变可视区域，因此添加了三个监听。

当然，这是最传统的方法，现代浏览器还提供了一个更先进的 Intersection Observer API 来做这个事，它可以通过更高效的方式来监听元素是否进入视口。考虑兼容性问题，在生产环境中建议使用对应的 polyfill。

如果想使用懒加载，还可以借助一些已有的工具库，例如 aFarkas/lazysizes、verlok/lazyload、tuupola/lazyload 等。

在使用懒加载时也有一些注意点：

- 首屏可以不需要懒加载，对首屏图片也使用懒加载会延迟图片的展示。
- 设置合理的占位图，避免图片加载后的页面“抖动”。
- 虽然目前基本所有用户都不会禁用 JavaScript，但还是建议做一些 JavaScript 不可用时的 backup。

对于占位图这块可以再补充一点。为了更好的用户体验，我们可以使用一个基于原图生成的体积小、清晰度低的图片作为占位图。这样一来不会增加太大的体积，二来会有很好的用户体验。LQIP (Low Quality Image Placeholders) 就是这种技术。目前也已经有了 LQIP 和 SQIP(SVG-based LQIP) 的自动化工具可以直接使用。

##### CSS 中的图片懒加载

除了对于 `<img>` 元素的图片进行来加载，在 CSS 中使用的图片一样可以懒加载，最常见的场景就是 background-url。

```css
.login {
  background-url: url('/static/img/login.png');
}
```

对于上面这个样式规则，如果不应用到具体的元素，浏览器不会去下载该图片。所以你可以通过切换 className 的方式，放心得进行 CSS 中图片的懒加载。

##### 内联 base64

还有一种方式是将图片转为 base64 字符串，并将其内联到页面中返回，即将原 url 的值替换为 base64。这样，当浏览器解析到这个的图片 url 时，就不会去请求并下载图片，直接解析 base64 字符串即可。

但是这种方式的一个缺点在于相同的图片，相比使用二进制，变成 base64 后体积会增大 33%。而全部内联进页面后，也意味着原本可能并行加载的图片信息，都会被放在页面请求中（像当于是串行了）。同时这种方式也不利于复用独立的文件缓存。所以，使用 base64 需要权衡，常用于首屏加载 CRP 或者骨架图上的一些小图标。

#### 减小图片大小

##### 使用合适的图片格式

使用合适的图片格式不仅能帮助你减少不必要的请求流量，同时还可能提供更好的图片体验。

图片格式是一个比较大的话题，选择合适的格式有利于性能优化。这里我们简单总结一些。

1. 使用 WebP：

   考虑在网站上使用 WebP 格式。在有损与无损压缩上，它的表现都会优于传统（JPEG/PNG）格式。WebP 无损压缩比 PNG 的体积小 26%，webP 的有损压缩比同质量的 JPEG 格式体积小 25-34%。同时 WebP 也支持透明度。下面提供了一种兼容性较好的写法。

   ```html
   <picture>
     <source type="image/webp" srcset="/static/img/perf.webp" />
     <source type="image/jpeg" srcset="/static/img/perf.jpg" />
     <img src="/static/img/perf.jpg" />
   </picture>
   ```

2. 使用 SVG 应对矢量图场景：

   在一些需要缩放与高保真的情况，或者用作图标的场景下，使用 SVG 这种矢量图非常不错。有时使用 SVG 格式会比相同的 PNG 或 JPEG 更小。

3. 使用 video 替代 GIF：

   在兼容性允许的情况下考虑，可以在想要动图效果时使用视频，通过静音（muted）的 video 来代替 GIF。相同的效果下，GIF 比视频（MPEG-4）大 5 ～ 20 倍。Smashing Magazine 上有篇文章[9]详细介绍使用方式。

4. 渐进式 JPEG：

   基线 JPEG (baseline JPEG) 会从上往下逐步呈现，类似下面这种：

   ![](res/2021-07-22-13-42-05.png)

   而另一种渐进式 JPEG (progressive JPEG) 则会从模糊到逐渐清晰，使人的感受上会更加平滑。

   ![](res/2021-07-22-13-42-25.png)

   不过渐进式 JPEG 的解码速度会慢于基线 JPEG，所以还是需要综合考虑 CPU、网络等情况，在实际的用户体验之上做权衡。

##### 图片质量的权衡

图片的压缩一般可以分为有损压缩（lossy compression）和无损压缩（lossless compression）。顾名思义，有损压缩下，会损失一定的图片质量，无损压缩则能够在保证图片质量的前提下压缩数据大小。不过，无损压缩一般可以带来更可观的体积缩减。在使用有损压缩时，一般我们可以指定一个 0-100 的压缩质量。在大多数情况下，相较于 100 质量系数的压缩，80 ～ 85 的质量系数可以带来 30 ～ 40% 的大小缩减，同时对图片效果影响较小，即人眼不易分辨出质量效果的差异。

![](res/2021-07-22-13-43-06.png)

处理图片压缩可以使用 imagemin 这样的工具，也可以进一步将它集成至 webpack、Gulp、Grunt 这样的自动化工具中。

##### 使用合适的大小和分辨率

由于移动端的发展，屏幕尺寸更加多样化了。同一套设计在不同尺寸、像素比的屏幕上可能需要不同像素大小的图片来保证良好的展示效果；此外，响应式设计也会对不同屏幕上最佳的图片尺寸有不同的要求。

以往我们可能会在 1280px 宽度的屏幕上和 640px 宽度的屏幕上都使用一张 400px 的图，但很可能在 640px 上我们只需要 200px 大小的图片。另一方面，对于如今盛行的“2 倍屏”、“3 倍屏”也需要使用不同像素大小的资源。

好在 HTML5 在 `<img>` 元素上为我们提供了 srcset 和 sizes 属性，可以让浏览器根据屏幕信息选择需要展示的图片。

```html
<img srcset="small.jpg 480w, large.jpg 1080w" sizes="50w" src="large.jpg" />
```

##### 删除冗余的图片信息

你也许不知道，很多图片含有一些非“视觉化”的元信息（metadata），带上它们可会导致体积增大与安全风险。元信息包括图片的 DPI、相机品牌、拍摄时的 GPS 等，可能导致 JPEG 图片大小增加 15%。同时，其中的一些隐私信息也可能会带来安全风险。

所以如果不需要的情况下，可以使用像 imageOptim 这样的工具来移除隐私与非关键的元信息。

##### SVG 压缩

合适的场景下可以使用 SVG。针对 SVG 我们也可以进行一些压缩。压缩包括了两个方面：

首先，与图片不同，图片是二进制形式的文件，而 SVG 作为一种 XML 文本，同样是适合使用 gzip 压缩的。

其次，SVG 本身的信息、数据是可以压缩的，例如用相比用 `<path>` 画一个椭圆，直接使用 `<ellipse>` 可以节省文本长度。关于信息的“压缩”还有更多可以优化的点。SVGGO 是一个可以集成到我们构建流中的 NodeJS 工具，它能帮助我们进行 SVG 的优化。当然你也可以使用它提供的 Web 服务。

#### 缓存

与其他静态资源类似，我们仍然可以使用各类缓存策略来加速资源的加载。

图片作为现代 Web 应用的重要部分，在资源占用上同样也不可忽视。可以发现，在上面提及的各类优化措施中，同时附带了相应的工具或类库。平时我们主要的精力会放在 CSS 与 JavaScript 的优化上，因此在图片优化上可能概念较为薄弱，自动化程度较低。如果你希望更好得去贯彻图片的相关优化，非常建议将自动化工具引入到构建流程中。

除了上述的一些工具，这里再介绍两个非常好用的图片处理的自动化工具：Sharp 和 Jimp。
