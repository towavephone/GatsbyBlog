---
title: 前端调试技巧
date: 2019-6-5 15:37:02
path: /frontend-debug-skill/
tags: 前端, 调试, 读书笔记
---

编码只是开发过程中的一小部分，为了使我们工作更加高效，我们必须学会调试，并擅长调试。

# 内容概要

文中列举了常用调试技巧，如下：

## Debugger

在代码中插入 `debugger` 可以在其位置触发断点调试。

## Console.dir

使用 `console.dir` 命令，可以打印出对象的结构，而 `console.log` 仅能打印返回值，在打印 `document` 属性时尤为有用。

> ps: 大部分时候，对象返回值就是其结构

## 使用辅助工具，语法高亮、linting

它可以帮助我们快速定位问题，其实 flow 与 typescript 也起到了很好的调试作用。

## 浏览器拓展

使用类似 [ReactDTools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) [VueDTools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 调试对应框架。

## 借助 DevTools

Chrome Dev Tools 非常强大，[dev-tips](https://umaar.com/dev-tips/) 列出了 100 多条它可以做的事。

## 移动端调试工具

最靠谱的应该是 [eruda](http://eruda.liriliri.io/)，可以内嵌在任何 h5 页面，充当 DevTools 控制台的作用。

## 实时调试

不需要预先埋点，比如 `document.activeElement` 可以打印最近 focus 过的元素，因为打开控制台导致失去焦点，但我们可以通过此 api 获取它。

## 结构化打印对象瞬时状态

`JSON.stringify(obj, null, 2)` 可以结构化打印出对象，因为是字符串，不用担心引用问题。

## 数组调试

通过 `Array.prototype.find` 快速寻找某个元素。

# 精读

本精读由 [rccoder](https://github.com/rccoder) [ascoders](https://github.com/ascoders) [NE-SmallTown](https://github.com/NE-SmallTown) [BlackGanglion](https://github.com/BlackGanglion) [jasonslyvia](https://github.com/jasonslyvia) [alcat2008](https://github.com/alcat2008) [DanielWLam](https://github.com/DanielWLam) [HsuanXyz](https://github.com/HsuanXyz) [huxiaoyun](https://github.com/huxiaoyun) [vagusX](https://github.com/vagusX) 讨论而出。

## 移动端真机测试

由于 webview 不一定支持连接 chrome 控制台调试，只有真机测试才能复现真实场景。

[browserstack](https://www.browserstack.com/) [dynatrace](https://www.dynatrace.com/platform/offerings/customer-experience-monitoring/) 都是真机测试平台，公司内部应该也会搭建这种平台。

## 移动端控制台

- [Chrome 远程调试](https://developers.google.com/web/tools/chrome-devtools/remote-debugging/webviews) app 支持后，连接 usb 或者局域网，即可通过 Dev Tools 调试 webview 页面。
- [Weinre](http://people.apache.org/~pmuellr/weinre/docs/latest/Home.html) 通过页面加载脚本，与 pc 端调试器通信。
- 通过内嵌控制台解决，比如 [eruda](http://eruda.liriliri.io/) [VConsole](https://github.com/WechatFE/vConsole)
- [Rosin](http://alloyteam.github.io/Rosin/) fiddler 的一个插件，协助移动页面调试。
- [jsconsole](https://jsconsole.com/) 在本地部署后，手机访问对应 ip，可以测试对应浏览器的控制台。

## 请求代理

[charles](http://www.charlesproxy.com/) [Fiddler](http://www.telerik.com/fiddler) 可以抓包，更重要是可以代理请求。假数据、边界值测试、开发环境代码加载，每一项都非常有用。

## 定制 Chrome 拓展

对于特定业务场景也可以通过开发 chrome 插件来做，比如分析自己网站的结构、版本、代码开发责任人、一键切换开发环境。

## 在用户设备调试

把控制台输出信息打到服务器，本地通过与服务器建立 socket 链接实时查看控制台信息。要知道实时根据用户 id 开启调试信息，并看用户真是环境的控制台打印信息是非常有用的，能解决很多难以复现问题。

代码中可以使用封装过的 `console.log`，当服务端开启调试状态后，对应用户网页会源源不断打出 log。

## DOM 断点、事件断点

- DOM 断点，在 dom 元素右键，选择 （Break on subtree modifications），可以在此 dom 被修改时触发断点，在不确定 dom 被哪段 js 脚本修改时可能有用。
- Event Listener Breakpoints，神器之一，对于任何事件都能进入断点，比如 click，touch，script 事件统统能监听。

## 使用错误追踪平台

对错误信息采集、分析、报警是很必要的，这里有一些对外服务：[sentry](https://sentry.io/welcome/) [trackjs](https://trackjs.com/)

## 黑盒调试

SourceMap 可以精准定位到代码，但有时候报错是由某处代码统一抛出的，比如 [invariant](https://github.com/zertosh/invariant) 让人又爱又恨的库，所有定位全部跑到这个库里了（要你有何用），这时候，可以在 DevTools 源码中右键，选中 `BlackBox Script`，它就变成黑盒了，下次 log 的定位将会是准确的。

[FireFox](https://hacks.mozilla.org/2013/08/new-features-of-firefox-developer-tools-episode-25/)、[Chrome](https://umaar.com/dev-tips/128-blackboxing/)。

## 删除无用的 css

css 不像 js 一样方便分析规则是否存在冗余，Chrome 帮我们做了这件事：[CSS Tracker](https://umaar.com/dev-tips/126-css-tracker/)。

## 在 Chrome 快速查找元素

Chrome 会记录最后插入的 5 个元素，分别以 `$0` ~ `$4` 的方式在控制台直接输出。

![](2019-06-05-15-38-56.png)

## Console.table

以表格形式打印，对于对象数组尤为合适。

## 监听特定函数调用

`monitor` 有点像 `proxy`，用 `monitor` 包裹住的 function，在其调用后，会在控制台输出其调用信息。

```javascript
> function func(num){}
> monitor(func)
> func(3)
// < function func called with arguments: 3
```

## 模拟发送请求利器 PostMan

[PostMan](https://www.getpostman.com/products), FireFox 控制台 Network 也支持此功能。

## 找到控制台最后一个对象

有了 `$_`，我们就不需要定义新的对象来打印值了，比如：

```javascript
> [1, 2, 3, 4]
< [1, 2, 3, 4]
> $_.length
// < 4
```

更多控制台相关技巧可以查看：[command-line-reference](https://developers.google.com/web/tools/chrome-devtools/console/command-line-reference?utm_source=dcc&utm_medium=redirect&utm_campaign=2016q3)。

# 总结

虽然在抛砖引玉，但整理完之后发现仍然是块砖头，调试技巧繁多，里面包含了通用的、不通用的，精读不可能一一列举。希望大家能根据自己的业务场景，掌握相关的调试技巧，让工作更加高效。
