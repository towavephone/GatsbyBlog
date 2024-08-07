---
title: Redux入门学习
path: /redux-introduce-learn/
date: 2018-06-12 14:09:04
tags: 前端, React, Redux
---

# 简介

Redux 是 JavaScript 状态容器，提供可预测化的状态管理

可以让你构建一致化的应用，运行于不同的环境（客户端、服务器、原生应用），并且易于测试。不仅于此，它还提供超爽的开发体验，比如有一个时间旅行调试器可以编辑后实时预览

Redux 由 Flux 演变而来，但受 Elm 的启发，避开了 Flux 的复杂性。不管你有没有使用过它们，只需几分钟就能上手 Redux

# 三大原则

## 单一数据源

整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 store 中

## State 是只读的

唯一改变 state 的方法就是触发 action，action 是一个用于描述已发生事件的普通对象

## 使用纯函数来执行修改

为了描述 action 如何改变 state tree，你需要编写 reducers

# Action

action 是把数据从应用传到 store 的有效载荷，它是 store 数据的唯一来源，通过 store.dispatch() 将 action 传到 store。

添加新 todo 任务的 action 是这样的

```js
const ADD_TODO='ADD_TODO'
{
    type:ADD_TODO,
    text:'Build my first Redux app'
}
```

多数情况下，type 会被定义成字符串常量。当应用规模越来越大时，建议使用单独的模块或文件来存放 action

```js
import { ADD_TODO, REMOVE_TODO } from '../actionTypes';
```

要尽量减少在 action 中传递的数据，比如以下例子就比把整个任务对象传过去要好

```js
{
  type: TOGGLE_TODO,
  index: 5
}
```

最后，再添加一个 action type 来表示当前的任务展示选项

```js
{
  type: SET_VISIBILITY_FILTER,
  filter: SHOW_COMPLETED
}
```

## Action 创建函数

action 创建函数就是生成 action 的方法，注意区别 `action` 和 `action 创建函数`

在 redux 的 action 创建函数只是简单返回一个 action

```js
function addTodo(text) {
   return {
      type: ADD_TODO,
      text
   };
}
```

这样将会使 action 创建函数更容易被移植和测试

在 flux 中，当调用 action 创建函数时，一般会触发一个 dispatch，像这样

```js
function addTodoWithDispatch(text) {
   const action = {
      type: ADD_TODO,
      text
   };
   dispatch(action);
}
```

不同的是，Redux 中只需把 action 创建函数的结果传给 dispatch() 方法即可发起一次 dispatch 过程

```js
dispatch(addTodo(text));
dispatch(completeTodo(index));
```

或者创建一个被绑定的 action 创建函数来自动 dispatch

```js
const boundAddTodo = (text) => dispatch(addTodo(text));
const boundCompleteTodo = (index) => dispatch(completeTodo(index));
```

然后直接调用

```js
boundAddTodo(text);
boundCompleteTodo(index);
```

store 里能直接通过 store.dispatch() 调用 dispatch() 方法，但是多数情况下你会使用 react-redux 提供的 connect() 帮助器来调用。bindActionCreators() 可以自动把多个 action 创建函数绑定到 dispatch() 方法上

Action 创建函数也可以是异步非纯函数

完整代码

```js
/*
 * action 类型
 */

export const ADD_TODO = 'ADD_TODO';
export const TOGGLE_TODO = 'TOGGLE_TODO';
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER';

/*
 * 其它的常量
 */

export const VisibilityFilters = {
   SHOW_ALL: 'SHOW_ALL',
   SHOW_COMPLETED: 'SHOW_COMPLETED',
   SHOW_ACTIVE: 'SHOW_ACTIVE'
};

/*
 * action 创建函数
 */

export function addTodo(text) {
   return { type: ADD_TODO, text };
}

export function toggleTodo(index) {
   return { type: TOGGLE_TODO, index };
}

export function setVisibilityFilter(filter) {
   return { type: SET_VISIBILITY_FILTER, filter };
}
```

# Reducer

reducer 指定了应用状态的变化如何响应 actions 并发送到 store 的

## 设计 State 结构

在 redux 应用中，所有的 state 都被保存在一个单一对象中。

以 todo 应用为例，需要保存两种不同的数据

- 当前选中的任务过滤条件
- 完整的任务列表

通常，还需要存放一些其他的数据，以及一些 UI 相关的 state，尽量分开数据与 UI 的 state

```js
{
  visibilityFilter: 'SHOW_ALL',
  todos: [
    {
      text: 'Consider using Redux',
      completed: true,
    },
    {
      text: 'Keep all state in a single tree',
      completed: false
    }
  ]
}
```

> 开发复杂的应用时，不可避免会有一些数据相互引用。建议你尽可能地把 state 范式化，不存在嵌套。把所有数据放到一个对象里，每个数据以 ID 为主键，不同实体或列表间通过 ID 相互引用数据。把应用的 state 想像成数据库。这种方法在 normalizr 文档里有详细阐述。例如，实际开发中，在 state 里同时存放 `todosById: { id -> todo }` 和 `todos: array<id>` 是比较好的方式，本文中为了保持示例简单没有这样处理

## Action 处理

redux 是一个纯函数，接收旧的 state 和 action，返回新的 state

```js
(previousState, action) => newState;
```

注意，永远不要在 reducer 里做以下操作

- 修改传入参数
- 执行有副作用的操作，如 API 请求与路由跳转
- 调用非纯函数，如 `Date.now()` 或 `Math.random()`

在以后的章节会介绍如何执行有副作用的操作，只要传入参数相同，返回计算得到的下一个 state 就一定相同。没有特殊情况、没有副作用，没有 API 请求、没有变量修改，单纯执行计算

以指定 state 的初始状态作为开始。Redux 首次执行时，state 为 undefined，此时我们可借机设置并返回应用的初始 state

```js
import { VisibilityFilters } from './actions';

const initialState = {
   visibilityFilter: VisibilityFilters.SHOW_ALL,
   todos: []
};

function todoApp(state, action) {
   if (typeof state === 'undefined') {
      return initialState;
   }

   // 这里暂不处理任何 action，
   // 仅返回传入的 state。
   return state;
}
```

这里的一个技巧是使用 ES6 参数默认值来精简语法

```js
function todoApp(state = initialState, action) {
   // 这里暂不处理任何 action，
   // 仅返回传入的 state。
   return state;
}
```

现在可以处理 `SET_VISIBILITY_FILTER`，需要做的只是改变 state 中的 visibilityFilter

```js
function todoApp(state = initialState, action) {
   switch (action.type) {
      case SET_VISIBILITY_FILTER:
         return Object.assign({}, state, {
            visibilityFilter: action.filter
         });
      default:
         return state;
   }
}
```

注意

1. 不要修改 state。 使用 Object.assign() 新建了一个副本。不能这样使用 `Object.assign(state, { visibilityFilter: action.filter })`，因为它会改变第一个参数的值。你必须把第一个参数设置为空对象。你也可以开启对 ES7 提案对象展开运算符的支持, 从而使用 `{ ...state, ...newState }` 达到相同的目的
2. 在 default 情况下返回旧的 state。遇到未知的 action 时，一定要返回旧的 state

**Object.assign 须知**

Object.assign() 是 ES6 特性，但多数浏览器并不支持。你要么使用 polyfill，Babel 插件，或者使用其它库如 `_.assign()` 提供的帮助方法

**switch 和样板代码须知**

switch 语句并不是严格意义上的样板代码。Flux 中真实的样板代码是概念性的：更新必须要发送、Store 必须要注册到 Dispatcher、Store 必须是对象（开发同构应用时变得非常复杂）。为了解决这些问题，Redux 放弃了 event emitters（事件发送器），转而使用纯 reducer

很不幸到现在为止，还有很多人存在一个误区：根据文档中是否使用 switch 来决定是否使用它。如果你不喜欢 switch，完全可以自定义一个 createReducer 函数来接收一个事件处理函数列表，参照 "减少样板代码"

## 处理多个 action

还有两个 action 要处理。就像我们处理 `SET_VISIBILITY_FILTER` 一样，我们引入 `ADD_TODO` 和 `TOGGLE_TODO` 两个 actions 并且扩展我们的 reducer 去处理 `ADD_TODO`

```js
import { ADD_TODO, TOGGLE_TODO, SET_VISIBILITY_FILTER, VisibilityFilters } from './actions';

// ...

function todoApp(state = initialState, action) {
   switch (action.type) {
      case SET_VISIBILITY_FILTER:
         return Object.assign({}, state, {
            visibilityFilter: action.filter
         });
      case ADD_TODO:
         return Object.assign({}, state, {
            todos: [
               ...state.todos,
               {
                  text: action.text,
                  completed: false
               }
            ]
         });
      default:
         return state;
   }
}
```

如上，不直接修改 state 中的字段，而是返回新对象。新的 todos 对象就相当于旧的 todos 在末尾加上新建的 todo。而这个新的 todo 又是基于 action 中的数据创建的。

最后，`TOGGLE_TODO` 的实现也很好理解：

```js
case TOGGLE_TODO:
  return Object.assign({}, state, {
    todos: state.todos.map((todo, index) => {
      if (index === action.index) {
        return Object.assign({}, todo, {
          completed: !todo.completed
        })
      }
      return todo
    })
  })
```

我们需要修改数组中指定的数据项而又不希望导致突变, 因此我们的做法是在创建一个新的数组后, 将那些无需修改的项原封不动移入, 接着对需修改的项用新生成的对象替换。（译者注：Javascript 中的对象存储时均是由值和指向值的引用两个部分构成。此处突变指直接修改引用所指向的值, 而引用本身保持不变。）如果经常需要这类的操作，可以选择使用帮助类 React-addons-update，updeep，或者使用原生支持深度更新的库 Immutable。最后，时刻谨记永远不要在克隆 state 前修改它。

## 拆分 reducer

上面代码能否变得更通俗易懂？这里的 todos 和 visibilityFilter 的更新看起来是相互独立的。有时 state 中的字段是相互依赖的，需要认真考虑，但在这个案例中我们可以把 todos 更新的业务逻辑拆分到一个单独的函数里：

```js
function todos(state = [], action) {
   switch (action.type) {
      case ADD_TODO:
         return [
            ...state,
            {
               text: action.text,
               completed: false
            }
         ];
      case TOGGLE_TODO:
         return state.map((todo, index) => {
            if (index === action.index) {
               return Object.assign({}, todo, {
                  completed: !todo.completed
               });
            }
            return todo;
         });
      default:
         return state;
   }
}

function todoApp(state = initialState, action) {
   switch (action.type) {
      case SET_VISIBILITY_FILTER:
         return Object.assign({}, state, {
            visibilityFilter: action.filter
         });
      case ADD_TODO:
         return Object.assign({}, state, {
            todos: todos(state.todos, action)
         });
      case TOGGLE_TODO:
         return Object.assign({}, state, {
            todos: todos(state.todos, action)
         });
      default:
         return state;
   }
}
```

注意 todos 依旧接受 state，但它变成了一个数组，现在 todoApp 只把需要更新的一部分 state 传给 todos 函数，todos 函数自己确定如何更新这部分数据，这就是所谓的 reducer 合成，它是开发 redux 应用最基础的模式

下面深入一下如何做 reducer 合成，能否抽出一个 reducer 专门管理 visibilityFilter？当然可以

首先引用，让我们使用 ES6 对象结构去声明 `SHOW_ALL`

```js
const { SHOW_ALL } = VisibilityFilters;
```

接下来

```js
function visibilityFilter(state = SHOW_ALL, action) {
   switch (action.type) {
      case SET_VISIBILITY_FILTER:
         return action.filter;
      default:
         return state;
   }
}
```

现在我们可以开发一个函数来做为主 reducer，它调用多个子 reducer 分别处理 state 中的一部分数据，然后再把这些数据合成一个大的单一对象。主 reducer 并不需要设置初始化时完整的 state。初始时，如果传入 undefined, 子 reducer 将负责返回它们的默认值

```js
function todos(state = [], action) {
   switch (action.type) {
      case ADD_TODO:
         return [
            ...state,
            {
               text: action.text,
               completed: false
            }
         ];
      case TOGGLE_TODO:
         return state.map((todo, index) => {
            if (index === action.index) {
               return Object.assign({}, todo, {
                  completed: !todo.completed
               });
            }
            return todo;
         });
      default:
         return state;
   }
}

function visibilityFilter(state = SHOW_ALL, action) {
   switch (action.type) {
      case SET_VISIBILITY_FILTER:
         return action.filter;
      default:
         return state;
   }
}

function todoApp(state = {}, action) {
   return {
      visibilityFilter: visibilityFilter(state.visibilityFilter, action),
      todos: todos(state.todos, action)
   };
}
```

注意每个 reducer 只负责管理全局 state 中它负责的一部分，每个 reducer 的 state 参数都不同，分别对应它管理的那部分的数据

最后，redux 提供了 combineReducers() 工具类来做上面 todoApp 做的事情，这样就能消灭一些样板代码，有了它，可以这样重构 todoAPP

```js
import { combineReducers } from 'redux';

const todoApp = combineReducers({
   visibilityFilter,
   todos
});

export default todoApp;
```

也可以给他们设置不同的 key，或者调用不同的函数，下面两种合成 reducer 方法完全等价

```js
const reducer = combineReducers({
   a: doSomethingWithA,
   b: processB,
   c: c
});
```

```js
function reducer(state = {}, action) {
   return {
      a: doSomethingWithA(state.a, action),
      b: processB(state.b, action),
      c: c(state.c, action)
   };
}
```

combineReducers() 所做的只是生成一个函数，这个函数来调用你的一系列 reducer，每个 reducer 根据它们的 key 来筛选出 state 中的一部分数据并处理，然后这个生成的函数再将所有 reducer 的结果合并成一个大的对象，没有任何魔法。正如其他 reducers，如果 combineReducers() 中包含的所有 reducers 都没有更改 state，那么也就不会创建一个新的对象

> combineReducers 接收一个对象，可以把所有顶级的 reducer 放到一个独立的文件中，通过 export 暴露出每个 reducer 函数，然后使用 `import * as reducers` 得到一个以它们名字作为 key 的 object

```js
import { combineReducers } from 'redux';
import * as reducers from './reducers';

const todoApp = combineReducers(reducers);
```

完整代码

```js
import { combineReducers } from 'redux';
import { ADD_TODO, TOGGLE_TODO, SET_VISIBILITY_FILTER, VisibilityFilters } from './actions';
const { SHOW_ALL } = VisibilityFilters;

function visibilityFilter(state = SHOW_ALL, action) {
   switch (action.type) {
      case SET_VISIBILITY_FILTER:
         return action.filter;
      default:
         return state;
   }
}

function todos(state = [], action) {
   switch (action.type) {
      case ADD_TODO:
         return [
            ...state,
            {
               text: action.text,
               completed: false
            }
         ];
      case TOGGLE_TODO:
         return state.map((todo, index) => {
            if (index === action.index) {
               return Object.assign({}, todo, {
                  completed: !todo.completed
               });
            }
            return todo;
         });
      default:
         return state;
   }
}

const todoApp = combineReducers({
   visibilityFilter,
   todos
});

export default todoApp;
```

# Store

在前面的章节中，学习了使用 action 来描述发生了什么和使用 reducer 来根据 action 根据 state 的用法

Store 就是把他们联系到一起的对象，store 有以下职责

- 维持应用的 state
- 提供 getState() 方法获取 state
- 提供 dispatch(action) 方法更新 state
- 通过 subscribe(listener) 注册监听器
- 通过 subscribe(listener) 返回的函数注销监听器

Redux 应用只有一个单一的 store，但需要拆分数据处理逻辑时，要使用 reducer 组合而不是创建多个 store

根据已有的 reducer 来创建 store 是非常容易的，在前一个章节中，我们使用 combineReducers() 将多个 reducer 合并成一个，现在我们将其导入，并传递 createStore()

```js
import { createStore } from 'redux';
import todoApp from './reducers';
let store = createStore(todoApp);
```

createStore() 的第二个参数是可选的, 用于设置 state 初始状态。这对开发同构应用时非常有用，服务器端 redux 应用的 state 结构可以与客户端保持一致, 那么客户端可以将从网络接收到的服务端 state 直接用于本地数据初始化

```js
let store = createStore(todoApp, window.STATE_FROM_SERVER);
```

## 发起 Actions

现在我们已经创建好了 store，让我们来验证一下！虽然还没有界面，我们已经可以测试数据处理逻辑了

```js
import { addTodo, toggleTodo, setVisibilityFilter, VisibilityFilters } from './actions';

// 打印初始状态
console.log(store.getState());

// 每次 state 更新时，打印日志
// 注意 subscribe() 返回一个函数用来注销监听器
const unsubscribe = store.subscribe(() => console.log(store.getState()));

// 发起一系列 action
store.dispatch(addTodo('Learn about actions'));
store.dispatch(addTodo('Learn about reducers'));
store.dispatch(addTodo('Learn about store'));
store.dispatch(toggleTodo(0));
store.dispatch(toggleTodo(1));
store.dispatch(setVisibilityFilter(VisibilityFilters.SHOW_COMPLETED));

// 停止监听 state 更新
unsubscribe();
```

可以看到 store 里的 state 是如何变化的

![](./zMMtoMz.png)

可以看到，在还没有开发界面的时候，我们就可以定义程序的行为。而且这时候已经可以写 reducer 和 action 创建函数的测试。不需要模拟任何东西，因为它们都是纯函数。只需调用一下，对返回值做断言，写测试就是这么简单

# 数据流

严格的单向数据流是 redux 架构的设计核心

这意味着应用中所有的数据都遵守相同的生命周期，这样可以让应用变得更加可预测且容易理解，同时也鼓励做数据规范化，这样可以避免使用多个且独立的无法相互引用的重复数据

如果这些理由还不足以令你信服，读一下 `动机` 和 `Flux 案例`，这里面有更加详细的单向数据流优势分析。虽然 Redux 并不是严格意义上的 Flux，但它们有共同的设计思想

## Redux 的生命周期

### 调用 store.dispatch(action)

Action 就是一个描述发生了什么的普通对象，比如

```js
{ type: 'LIKE_ARTICLE', articleId: 42 }
{ type: 'FETCH_USER_SUCCESS', response: { id: 3, name: 'Mary' } }
{ type: 'ADD_TODO', text: 'Read the Redux docs.' }
```

可以把 action 理解成新闻的摘要。如 “玛丽喜欢 42 号文章。” 或者 “任务列表里添加了'学习 Redux 文档'”

你可以在任何地方调用 store.dispatch(action)，包括组件中、XHR 回调中、甚至定时器中

### redux store 调用传入的 redux 函数

store 会把两个参数传入 reducer，当前的 state 和 action，例如在这个 todo 应用中，reducer 可能接收这样的数据

```js
// 当前应用的 state（todos 列表和选中的过滤器）
let previousState = {
   visibleTodoFilter: 'SHOW_ALL',
   todos: [
      {
         text: 'Read the docs.',
         complete: false
      }
   ]
};

// 将要执行的 action（添加一个 todo）
let action = {
   type: 'ADD_TODO',
   text: 'Understand the flow.'
};

// reducer 返回处理后的应用状态
let nextState = todoApp(previousState, action);
```

注意 reducer 是纯函数。它仅仅用于计算下一个 state。它应该是完全可预测的：多次传入相同的输入必须产生相同的输出。它不应做有副作用的操作，如 API 调用或路由跳转。这些应该在 dispatch action 前发生

### 根 reducer 应该把多个子 reducer 输出合并成一个单一的 state 树

根 reducer 的结构完全由你决定。Redux 原生提供 combineReducers() 辅助函数，来把根 reducer 拆分成多个函数，用于分别处理 state 树的一个分支

下面演示 combineReducers() 如何使用。假如你有两个 reducer：一个是 todo 列表，另一个是当前选择的过滤器设置

```js
function todos(state = [], action) {
   // 省略处理逻辑...
   return nextState;
}

function visibleTodoFilter(state = 'SHOW_ALL', action) {
   // 省略处理逻辑...
   return nextState;
}

let todoApp = combineReducers({
   todos,
   visibleTodoFilter
});
```

当你触发 action 后，combineReducers 返回的 todoApp 会负责调用两个 reducer

```js
let nextTodos = todos(state.todos, action);
let nextVisibleTodoFilter = visibleTodoFilter(state.visibleTodoFilter, action);
```

然后会把两个结果集合并成一个 state 树

```js
return {
   todos: nextTodos,
   visibleTodoFilter: nextVisibleTodoFilter
};
```

虽然 combineReducers() 是一个很方便的辅助工具，你也可以选择不用；你可以自行实现自己的根 reducer

### Redux store 保存了根 reducer 返回的完整 state 树

这个新的树就是应用的下一个 state！所有订阅 store.subscribe(listener) 的监听器都将被调用；监听器里可以调用 store.getState() 获得当前 state

现在，可以应用新的 state 来更新 UI。如果你使用了 React Redux 这类的绑定库，这时就应该调用 component.setState(newState) 来更新

# 搭配 React

redux 和 react 之间没有关系，它可以用在 React、Angular、Ember、jQuery 甚至纯的 JS

但是还是用在 React 和 Deku 里面比较好，因为它们允许你以 state 函数的形式来描述界面，redux 通过 action 的形式来发起 state 变化

下面使用 react 开发一个 todo 管理应用

## 安装 React Redux

Redux 默认并不包含 React 绑定库，需要单独安装。

```bash
npm install --save react-redux
```

如果你不使用 npm，你也可以从 unpkg 获取最新的 UMD 包（包括开发环境包和生产环境包）。如果你用 `<script>` 标签的方式引入 UMD 包，那么它会在全局抛出 window.ReactRedux 对象。

## 容器组件（Smart/Container Components）和展示组件（Dumb/Presentational Components）

Redux 的 React 绑定库是基于容器组件和展示组件相分离的开发思想。所以建议先读完这篇文章再回来继续学习，这个思想非常重要

总结一下不同点

|           项目 | 展示组件                   | 容器组件                           |
| -------------: | -------------------------- | ---------------------------------- |
|           作用 | 描述如何展现（骨架、样式） | 描述如何运行（数据获取、状态更新） |
| 直接使用 Redux | 否                         | 是                                 |
|       数据来源 | props 监听                 | Redux state                        |
|       数据修改 | 从 props 调用回调函数      | 向 Redux 派发 actions              |
|       调用方式 | 手动                       | 通常由 React Redux 生成            |

大部分的组件都应该是展示型的，但一般需要少数的几个容器组件把它们和 Redux store 连接起来。这和下面的设计简介并不意味着容器组件必须位于组件树的最顶层。如果一个容器组件变得太复杂（例如，它有大量的嵌套组件以及传递数不尽的回调函数），那么在组件树中引入另一个容器，就像 FAQ 中提到的那样

技术上讲你可以直接使用 store.subscribe() 来编写容器组件。但不建议这么做的原因是无法使用 React Redux 带来的性能优化。也因此，不要手写容器组件，而使用 React Redux 的 connect() 方法来生成，后面会详细介绍

## 设计组件层次结构

还记得当初如何设计 state 根对象的结构吗？现在就要定义与它匹配的界面的层次结构。其实这不是 Redux 相关的工作，React 开发思想在这方面解释的非常棒

我们的概要设计很简单。我们想要显示一个 todo 项的列表。一个 todo 项被点击后，会增加一条删除线并标记 completed。我们会显示用户新增一个 todo 字段。在 footer 里显示一个可切换的显示全部 / 只显示 completed 的 / 只显示 incompleted 的 todos

### 展示组件

以下的这些组件（和它们的 props ）就是从这个设计里来的

- TodoList 用于显示 todos 列表
- todos: Array 以 `{ text, completed }` 形式显示的 todo 项数组
- `onTodoClick(index: number)` 当 todo 项被点击时调用的回调函数
- Todo 一个 todo 项
- text: string 显示的文本内容
- completed: boolean todo 项是否显示删除线
- onClick() 当 todo 项被点击时调用的回调函数
- Link 带有 callback 回调功能的链接
- onClick() 当点击链接时会触发
- Footer 一个允许用户改变可见 todo 过滤器的组件
- App 根组件，渲染余下的所有内容

这些组件只定义外观并不关心数据来源和如何改变。传入什么就渲染什么。如果你把代码从 Redux 迁移到别的架构，这些组件可以不做任何改动直接使用。它们并不依赖于 Redux

### 容器组件

还需要一些容器组件来把展示组件连接到 Redux。例如，展示型的 TodoList 组件需要一个类似 VisibleTodoList 的容器来监听 Redux store 变化并处理如何过滤出要显示的数据。为了实现状态过滤，需要实现 FilterLink 的容器组件来渲染 Link 并在点击时触发对应的 action

- VisibleTodoList 根据当前显示的状态来对 todo 列表进行过滤，并渲染 TodoList
- FilterLink 得到当前过滤器并渲染 Link
- filter: string 就是当前过滤的状态

### 其他组件

有时很难分清到底该使用容器组件还是展示组件。例如，有时表单和函数严重耦合在一起，如这个小的组件

- AddTodo 含有 “Add” 按钮的输入框

技术上讲可以把它分成两个组件，但一开始就这么做有点早。在一些非常小的组件里混用容器和展示是可以的。当业务变复杂后，如何拆分就很明显了。所以现在就使用混合型的吧

## 组件编码

先做展示组件，这样可以先不考虑 Redux

### 实现展示组件

它们只是普通的 React 组件，所以不会详细解释。我们会使用函数式无状态组件除非需要本地 state 或生命周期函数的场景。这并不是说展示组件必须是函数 -- 只是因为这样做容易些。如果你需要使用本地 state，生命周期方法，或者性能优化，可以将它们转成 class

`components/Todo.js`

```js
import React from 'react';
import PropTypes from 'prop-types';

const Todo = ({ onClick, completed, text }) => (
   <li
      onClick={onClick}
      style={{
         textDecoration: completed ? 'line-through' : 'none'
      }}
   >
      {text}
   </li>
);

Todo.propTypes = {
   onClick: PropTypes.func.isRequired,
   completed: PropTypes.bool.isRequired,
   text: PropTypes.string.isRequired
};

export default Todo;
```

`components/TodoList.js`

```js
import React from 'react';
import PropTypes from 'prop-types';
import Todo from './Todo';

const TodoList = ({ todos, onTodoClick }) => (
   <ul>
      {todos.map((todo, index) => (
         <Todo key={index} {...todo} onClick={() => onTodoClick(index)} />
      ))}
   </ul>
);

TodoList.propTypes = {
   todos: PropTypes.arrayOf(
      PropTypes.shape({
         id: PropTypes.number.isRequired,
         completed: PropTypes.bool.isRequired,
         text: PropTypes.string.isRequired
      }).isRequired
   ).isRequired,
   onTodoClick: PropTypes.func.isRequired
};

export default TodoList;
```

`components/Link.js`

```js
import React from 'react';
import PropTypes from 'prop-types';

const Link = ({ active, children, onClick }) => {
   if (active) {
      return <span>{children}</span>;
   }

   return (
      <a
         href=''
         onClick={(e) => {
            e.preventDefault();
            onClick();
         }}
      >
         {children}
      </a>
   );
};

Link.propTypes = {
   active: PropTypes.bool.isRequired,
   children: PropTypes.node.isRequired,
   onClick: PropTypes.func.isRequired
};

export default Link;
```

`components/Footer.js`

```js
import React from 'react';
import FilterLink from '../containers/FilterLink';

const Footer = () => (
   <p>
      Show: <FilterLink filter='SHOW_ALL'>All</FilterLink>
      {', '}
      <FilterLink filter='SHOW_ACTIVE'>Active</FilterLink>
      {', '}
      <FilterLink filter='SHOW_COMPLETED'>Completed</FilterLink>
   </p>
);

export default Footer;
```

### 实现容器组件

现在来创建一些容器组件把这些展示组件和 Redux 关联起来。技术上讲，容器组件就是使用 store.subscribe() 从 Redux state 树中读取部分数据，并通过 props 来把这些数据提供给要渲染的组件。你可以手工来开发容器组件，但建议使用 React Redux 库的 connect() 方法来生成，这个方法做了性能优化来避免很多不必要的重复渲染。（这样你就不必为了性能而手动实现 React 性能优化建议 中的 shouldComponentUpdate 方法。）

使用 connect() 前，需要先定义 mapStateToProps 这个函数来指定如何把当前 Redux store state 映射到展示组件的 props 中。例如，VisibleTodoList 需要计算传到 TodoList 中的 todos，所以定义了根据 state.visibilityFilter 来过滤 state.todos 的方法，并在 mapStateToProps 中使用

```js
const getVisibleTodos = (todos, filter) => {
   switch (filter) {
      case 'SHOW_COMPLETED':
         return todos.filter((t) => t.completed);
      case 'SHOW_ACTIVE':
         return todos.filter((t) => !t.completed);
      case 'SHOW_ALL':
      default:
         return todos;
   }
};

const mapStateToProps = (state) => {
   return {
      todos: getVisibleTodos(state.todos, state.visibilityFilter)
   };
};
```

除了读取 state，容器组件还能分发 action。类似的方式，可以定义 mapDispatchToProps() 方法接收 dispatch() 方法并返回期望注入到展示组件的 props 中的回调方法。例如，我们希望 VisibleTodoList 向 TodoList 组件中注入一个叫 onTodoClick 的 props ，还希望 onTodoClick 能分发 `TOGGLE_TODO` 这个 action

```js
const mapDispatchToProps = (dispatch) => {
   return {
      onTodoClick: (id) => {
         dispatch(toggleTodo(id));
      }
   };
};
```

最后，使用 connect() 创建 VisibleTodoList，并传入这两个函数

```js
import { connect } from 'react-redux';

const VisibleTodoList = connect(
   mapStateToProps,
   mapDispatchToProps
)(TodoList);

export default VisibleTodoList;
```

这就是 React Redux API 的基础，但还漏了一些快捷技巧和强大的配置，建议你仔细学习它的文档。如果你担心 mapStateToProps 创建新对象太过频繁，可以学习如何使用 reselect 来计算衍生数据

其他容器组件定义如下

`containers/FilterLink.js`

```js
import { connect } from 'react-redux';
import { setVisibilityFilter } from '../actions';
import Link from '../components/Link';

const mapStateToProps = (state, ownProps) => {
   return {
      active: ownProps.filter === state.visibilityFilter
   };
};

const mapDispatchToProps = (dispatch, ownProps) => {
   return {
      onClick: () => {
         dispatch(setVisibilityFilter(ownProps.filter));
      }
   };
};

const FilterLink = connect(
   mapStateToProps,
   mapDispatchToProps
)(Link);

export default FilterLink;
```

`containers/VisibleTodoList.js`

```js
import { connect } from 'react-redux';
import { toggleTodo } from '../actions';
import TodoList from '../components/TodoList';

const getVisibleTodos = (todos, filter) => {
   switch (filter) {
      case 'SHOW_ALL':
         return todos;
      case 'SHOW_COMPLETED':
         return todos.filter((t) => t.completed);
      case 'SHOW_ACTIVE':
         return todos.filter((t) => !t.completed);
   }
};

const mapStateToProps = (state) => {
   return {
      todos: getVisibleTodos(state.todos, state.visibilityFilter)
   };
};

const mapDispatchToProps = (dispatch) => {
   return {
      onTodoClick: (id) => {
         dispatch(toggleTodo(id));
      }
   };
};

const VisibleTodoList = connect(
   mapStateToProps,
   mapDispatchToProps
)(TodoList);

export default VisibleTodoList;
```

### 其他组件

`containers/AddTodo.js`

回想一下前面提到的，AddTodo 组件的视图和逻辑混合在一个单独的定义之中

```js
import React from 'react';
import { connect } from 'react-redux';
import { addTodo } from '../actions';

let AddTodo = ({ dispatch }) => {
   let input;

   return (
      <div>
         <form
            onSubmit={(e) => {
               e.preventDefault();
               if (!input.value.trim()) {
                  return;
               }
               dispatch(addTodo(input.value));
               input.value = '';
            }}
         >
            <input
               ref={(node) => {
                  input = node;
               }}
            />
            <button type='submit'>Add Todo</button>
         </form>
      </div>
   );
};
AddTodo = connect()(AddTodo);

export default AddTodo;
```

### 将容器放到一个组件

`components/App.js`

```js
import React from 'react';
import Footer from './Footer';
import AddTodo from '../containers/AddTodo';
import VisibleTodoList from '../containers/VisibleTodoList';

const App = () => (
   <div>
      <AddTodo />
      <VisibleTodoList />
      <Footer />
   </div>
);

export default App;
```

## 传入 Store

所有容器组件都可以访问 Redux store，所以可以手动监听它。一种方式是把它以 props 的形式传入到所有容器组件中。但这太麻烦了，因为必须要用 store 把展示组件包裹一层，仅仅是因为恰好在组件树中渲染了一个容器组件

建议的方式是使用指定的 React Redux 组件 `<Provider>` 来魔法般的让所有容器组件都可以访问 store，而不必显示地传递它。只需要在渲染根组件时使用即可

`index.js`

```js
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import todoApp from './reducers';
import App from './components/App';

let store = createStore(todoApp);

render(
   <Provider store={store}>
      <App />
   </Provider>,
   document.getElementById('root')
);
```

# 完整实例

```js
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';

// React component
class Counter extends Component {
   render() {
      const { value, onIncreaseClick } = this.props;
      return (
         <div>
            <span>{value}</span>
            <button onClick={onIncreaseClick}>Increase</button>
         </div>
      );
   }
}

Counter.propTypes = {
   value: PropTypes.number.isRequired,
   onIncreaseClick: PropTypes.func.isRequired
};

// 这是一个 reducer，形式为 (state, action) => state 的纯函数。
// 描述了 action 如何把 state 转变成下一个 state。
function counter(state = { count: 0 }, action) {
   const count = state.count;
   switch (action.type) {
      case 'increase':
         return { count: count + 1 };
      default:
         return state;
   }
}

// Redux store存放应用状态
const store = createStore(counter);

// Map Redux state to component props
// 可以手动订阅更新，也可以事件绑定到视图层
function mapStateToProps(state) {
   return {
      value: state.count
   };
}

// Action
const increaseAction = { type: 'increase' };

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
   return {
      // 改变内部 state 惟一方法是 dispatch 一个 action
      onIncreaseClick: () => dispatch(increaseAction)
   };
}

// Connected Component
const App = connect(
   mapStateToProps,
   mapDispatchToProps
)(Counter);

ReactDOM.render(
   <Provider store={store}>
      <App />
   </Provider>,
   document.getElementById('root')
);
```
