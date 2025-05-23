---
title: 编写有弹性的组件
date: 2019-6-6 14:35:51
path: /write-resilient-components/
tags: 前端, 组件
---

# 概述

相比代码的 Lint 或者 Prettier，或许我们更应该关注代码是否具有弹性。

[Dan](https://mobile.twitter.com/dan_abramov) 总结了弹性组件具有的四个特征：

1. **不要阻塞数据流。**
2. **时刻准备好渲染。**
3. **不要有单例组件。**
4. **隔离本地状态。**

以上规则不仅适用于 React，它适用于所有 UI 组件。

## 不要阻塞渲染的数据流

不阻塞数据流的意思，就是 **不要将接收到的参数本地化，** 或者 **使组件完全受控**。

在 Class Component 语法下，**由于有生命周期的概念，在某个生命周期将 `props` 存储到 `state` 的方式屡见不鲜。** 然而一旦将 `props` 固化到 `state`，组件就不受控了：

```jsx
class Button extends React.Component {
  state = {
    color: this.props.color
  };
  render() {
    const { color } = this.state; // 🔴 `color` is stale!
    return <button className={'Button-' + color}>{this.props.children}</button>;
  }
}
```

当组件再次刷新时，`props.color` 变化了，但 `state.color` 不会变，这种情况就阻塞了数据流，小伙伴们可能会吐槽组件有 BUG。这时候如果你尝试通过其他生命周期（`componentWillReceiveProps` 或 `componentDidUpdate`）去修复，代码会变得难以管理。

然而 Function Component 没有生命周期的概念，**所以没有必须要将 `props` 存储到 `state`**，直接渲染即可：

```jsx
function Button({ color, children }) {
  return (
    // ✅ `color` is always fresh!
    <button className={'Button-' + color}>{children}</button>
  );
}
```

如果需要对 `props` 进行加工，可以利用 `useMemo` 对加工过程进行缓存，仅当依赖变化时才重新执行：

```jsx
const textColor = useMemo(
  () => slowlyCalculateTextColor(color),
  [color] // ✅ Don’t recalculate until `color` changes
);
```

## 不要阻塞副作用的数据流

发请求就是一种副作用，如果在一个组件内发请求，那么在取数参数变化时，最好能重新取数。

```jsx
class SearchResults extends React.Component {
  state = {
    data: null
  };
  componentDidMount() {
    this.fetchResults();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.query !== this.props.query) {
      // ✅ Refetch on change
      this.fetchResults();
    }
  }
  fetchResults() {
    const url = this.getFetchUrl();
    // Do the fetching...
  }
  getFetchUrl() {
    return 'http://myapi/results?query' + this.props.query; // ✅ Updates are handled
  }
  render() {
    // ...
  }
}
```

如果用 Class Component 的方式实现，我们需要将请求函数 `getFetchUrl` 抽出来，并且在 `componentDidMount` 与 `componentDidUpdate` 时同时调用它，还要注意 `componentDidUpdate` 时如果取数参数 `state.query` 没有变化则不执行 `getFetchUrl`。

这样的维护体验很糟糕，如果取数参数增加了 `state.currentPage`，你很可能在 `componentDidUpdate` 中漏掉对 `state.currentPage` 的判断。

如果使用 Function Component，可以通过 `useCallback` 将整个取数过程作为一个整体：

> 原文没有使用 `useCallback`，笔者进行了加工。

```jsx
function SearchResults({ query }) {
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const getFetchUrl = useCallback(() => {
    return 'http://myapi/results?query=' + query + '&page=' + currentPage;
  }, [currentPage, query]);

  useEffect(() => {
    const url = getFetchUrl();
    // Do the fetching...
  }, [getFetchUrl]); // ✅ Refetch on change

  // ...
}
```

Function Component 对 `props` 与 `state` 的数据都一视同仁，且可以将取数逻辑与 “更新判断” 通过 `useCallback` 完全封装在一个函数内，再将这个函数作为整体依赖项添加到 `useEffect`，如果未来再新增一个参数，只要修改 `getFetchUrl` 这个函数即可，而且还可以通过 `eslint-plugin-react-hooks` 插件静态分析是否遗漏了依赖项。

Function Component 不但将依赖项聚合起来，还解决了 Class Component 分散在多处生命周期的函数判断，引发的无法静态分析依赖的问题。

## 不要因为性能优化而阻塞数据流

相比 `PureComponent` 与 `React.memo`，手动进行比较优化是不太安全的，比如你可能会忘记对函数进行对比：

```jsx
class Button extends React.Component {
  shouldComponentUpdate(prevProps) {
    // 🔴 Doesn't compare this.props.onClick
    return this.props.color !== prevProps.color;
  }
  render() {
    const onClick = this.props.onClick; // 🔴 Doesn't reflect updates
    const textColor = slowlyCalculateTextColor(this.props.color);
    return (
      <button onClick={onClick} className={'Button-' + this.props.color + ' Button-text-' + textColor}>
        {this.props.children}
      </button>
    );
  }
}
```

上面的代码手动进行了 `shouldComponentUpdate` 对比优化，但是忽略了对函数参数 `onClick` 的对比，因此虽然大部分时间 `onClick` 确实没有变化，因此代码也不会有什么 bug：

```jsx
class MyForm extends React.Component {
  handleClick = () => {
    // ✅ Always the same function
    // Do something
  };
  render() {
    return (
      <>
        <h1>Hello!</h1>
        <Button color='green' onClick={this.handleClick}>
          Press me
        </Button>
      </>
    );
  }
}
```

但是一旦换一种方式实现 `onClick`，情况就不一样了，比如下面两种情况：

```jsx
class MyForm extends React.Component {
  state = {
    isEnabled: true
  };
  handleClick = () => {
    this.setState({ isEnabled: false });
    // Do something
  };
  render() {
    return (
      <>
        <h1>Hello!</h1>
        <Button
          color='green'
          onClick={
            // 🔴 Button ignores updates to the onClick prop
            this.state.isEnabled ? this.handleClick : null
          }
        >
          Press me
        </Button>
      </>
    );
  }
}
```

`onClick` 随机在 `null` 与 `this.handleClick` 之间切换。

```jsx
drafts.map((draft) => (
  <Button
    color='blue'
    key={draft.id}
    onClick={
      // 🔴 Button ignores updates to the onClick prop
      this.handlePublish.bind(this, draft.content)
    }
  >
    Publish
  </Button>
));
```

如果 `draft.content` 变化了，则 `onClick` 函数变化。

也就是如果子组件进行手动优化时，如果漏了对函数的对比，很有可能执行到旧的函数导致错误的逻辑。

所以尽量不要自己进行优化，同时在 Function Component 环境下，在内部申明的函数每次都有不同的引用，因此便于发现逻辑 BUG，同时利用 `useCallback` 与 `useContext` 有助于解决这个问题。

## 时刻准备渲染

确保你的组件可以随时重渲染，且不会导致内部状态管理出现 BUG。

要做到这一点其实挺难的，比如一个复杂组件，如果接收了一个状态作为起点，之后的代码基于这个起点派生了许多内部状态，某个时刻改变了这个起始值，组件还能正常运行吗？

比如下面的代码：

```jsx
// 🤔 Should prevent unnecessary re-renders... right?
class TextInput extends React.PureComponent {
  state = {
    value: ''
  };
  // 🔴 Resets local state on every parent render
  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.value });
  }
  handleChange = (e) => {
    this.setState({ value: e.target.value });
  };
  render() {
    return <input value={this.state.value} onChange={this.handleChange} />;
  }
}
```

`componentWillReceiveProps` 标识了每次组件接收到新的 `props`，都会将 `props.value` 同步到 `state.value`。这就是一种派生 `state`，虽然看上去可以做到优雅承接 `props` 的变化，但 **父元素因为其他原因的 rerender 就会导致 `state.value` 非正常重置，比如父元素的 `forceUpdate`。**

当然可以通过 **不要阻塞渲染的数据流** 一节所说的方式，比如 `PureComponent`, `shouldComponentUpdate`, `React.memo` 来做性能优化（当 `props.value` 没有变化时就不会重置 `state.value`），但这样的代码依然是脆弱的。

健壮的代码不会因为删除了某项优化就出现 BUG，不要使用派生 `state` 就能避免此问题。

> 解决这个问题的方式是
>
> 1. 如果组件依赖了 `props.value`，就不需要使用 `state.value`，完全做成 **受控组件**。
> 2. 如果必须有 `state.value`，那就做成内部状态，也就是不要从外部接收 `props.value`。总之避免写 “介于受控与非受控之间的组件”。

补充一下，如果做成了非受控组件，却想重置初始值，那么在父级调用处加上 `key` 来解决：

```jsx
<EmailInput defaultEmail={this.props.user.email} key={this.props.user.id} />
```

另外也可以通过 `ref` 解决，让子元素提供一个 `reset` 函数，不过不推荐使用 `ref`。

## 不要有单例组件

一个有弹性的应用，应该能通过下面考验：

```jsx
ReactDOM.render(
  <>
    <MyApp />
    <MyApp />
  </>,
  document.getElementById('root')
);
```

将整个应用渲染两遍，看看是否能各自正确运作？

除了组件本地状态由本地维护外，具有弹性的组件不应该因为其他实例调用了某些函数，而 “永远错过了某些状态或功能”。

笔者补充：一个危险的组件一般是这么思考的：没有人会随意破坏数据流，因此只要在 `didMount` 与 `unMount` 时做好数据初始化和销毁就行了。

那么当另一个实例进行销毁操作时，可能会破坏这个实例的中间状态。一个具有弹性的组件应该能 **随时响应** 状态的变化，没有生命周期概念的 Function Component 处理起来显然更得心应手。

## 隔离本地状态

**很多时候难以判断数据属于组件的本地状态还是全局状态。**

文章提供了一个判断方法：**“想象这个组件同时渲染了两个实例，这个数据会同时影响这两个实例吗？如果答案是 不会，那这个数据就适合作为本地状态”。**

尤其在写业务组件时，容易将业务数据与组件本身状态数据混淆。

根据笔者的经验，**从上层业务到底层通用组件之间，本地状态数量是递增的：**

```
业务
  -> 全局数据流
    -> 页面（完全依赖全局数据流，几乎没有自己的状态）
      -> 业务组件（从页面或全局数据流继承数据，很少有自己状态）
        -> 通用组件（完全受控，比如 input；或大量内聚状态的复杂通用逻辑，比如 monaco-editor）
```

# 精读

再次强调，一个有弹性的组件需要同时满足下面 4 个原则：

1. **不要阻塞数据流。**
2. **时刻准备好渲染。**
3. **不要有单例组件。**
4. **隔离本地状态。**

想要遵循这些规则看上去也不难，但实践过程中会遇到不少问题，笔者举几个例子。

## 频繁传递回调函数

Function Component 会导致组件粒度拆分的比较细，在提高可维护性同时，也会导致全局 `state` 成为过去，下面的代码可能让你觉得别扭：

```jsx
const App = memo(function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("nick");

  return (
    <>
      <Count count={count} setCount={setCount}/>
      <Name name={name} setName={setName}/>
    </>
  );
});

const Count = memo(function Count(props) {
  return (
      <input value={props.count} onChange={pipeEvent(props.setCount)}>
  );
});

const Name = memo(function Name(props) {
  return (
  <input value={props.name} onChange={pipeEvent(props.setName)}>
  );
});
```

虽然将子组件 `Count` 与 `Name` 拆分出来，逻辑更加解耦，但子组件需要更新父组件的状态就变得麻烦，我们不希望将函数作为参数透传给子组件。

一种办法是将函数通过 `Context` 传给子组件：

```jsx
const SetCount = createContext(null)
const SetName = createContext(null)

const App = memo(function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("nick");

  return (
    <SetCount.Provider value={setCount}>
      <SetName.Provider value={setName}>
        <Count count={count}/>
        <Name name={name}/>
      </SetName.Provider>
    </SetCount.Provider>
  );
});

const Count = memo(function Count(props) {
  const setCount = useContext(SetCount)
  return (
      <input value={props.count} onChange={pipeEvent(setCount)}>
  );
});

const Name = memo(function Name(props) {
  const setName = useContext(SetName)
  return (
  <input value={props.name} onChange={pipeEvent(setName)}>
  );
});
```

但这样会导致 `Provider` 过于臃肿，因此建议部分组件使用 `useReducer` 替代 `useState`，将函数合并到 `dispatch`：

```jsx
const AppDispatch = createContext(null)

class State = {
  count = 0
  name = 'nick'
}

function appReducer(state, action) {
  switch(action.type) {
    case 'setCount':
      return {
        ...state,
        count: action.value
      }
    case 'setName':
      return {
        ...state,
        name: action.value
      }
    default:
      return state
  }
}

const App = memo(function App() {
  const [state, dispatch] = useReducer(appReducer, new State())

  return (
    <AppDispatch.Provider value={dispatch}>
      <Count count={count}/>
      <Name name={name}/>
    </AppDispatch.Provider>
  );
});

const Count = memo(function Count(props) {
  const dispatch = useContext(AppDispatch)
  return (
      <input value={props.count} onChange={pipeEvent(value => dispatch({type: 'setCount', value}))}>
  );
});

const Name = memo(function Name(props) {
  const dispatch = useContext(AppDispatch)
  return (
  <input value={props.name} onChange={pipeEvent(pipeEvent(value => dispatch({type: 'setName', value})))}>
  );
});
```

将状态聚合到 `reducer` 中，这样一个 `ContextProvider` 就能解决所有数据处理问题了。

> memo 包裹的组件类似 PureComponent 效果。

## useCallback 参数变化频繁

在 [精读《useEffect 完全指南》](https://github.com/dt-fe/weekly/blob/master/96.%E7%B2%BE%E8%AF%BB%E3%80%8AuseEffect%20%E5%AE%8C%E5%85%A8%E6%8C%87%E5%8D%97%E3%80%8B.md#%E5%A6%82%E6%9E%9C%E9%9D%9E%E8%A6%81%E6%8A%8A-function-%E5%86%99%E5%9C%A8-effect-%E5%A4%96%E9%9D%A2%E5%91%A2) 我们介绍了利用 `useCallback` 创建一个 Immutable 的函数：

```jsx
function Form() {
  const [text, updateText] = useState('');

  const handleSubmit = useCallback(() => {
    const currentText = text;
    alert(currentText);
  }, [text]);

  return (
    <>
      <input value={text} onChange={(e) => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}
```

但这个函数的依赖 `[text]` 变化过于频繁，以至于在每个 `render` 都会重新生成 `handleSubmit` 函数，对性能有一定影响。一种解决办法是利用 `Ref` 规避这个问题：

```jsx
function Form() {
  const [text, updateText] = useState('');
  const textRef = useRef();

  useEffect(() => {
    textRef.current = text; // Write it to the ref
  });

  const handleSubmit = useCallback(() => {
    const currentText = textRef.current; // Read it from the ref
    alert(currentText);
  }, [textRef]); // Don't recreate handleSubmit like [text] would do

  return (
    <>
      <input value={text} onChange={(e) => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}
```

当然，也可以将这个过程封装为一个自定义 Hooks，让代码稍微好看些：

```jsx
function Form() {
  const [text, updateText] = useState('');
  // Will be memoized even if `text` changes:
  const handleSubmit = useEventCallback(() => {
    alert(text);
  }, [text]);

  return (
    <>
      <input value={text} onChange={(e) => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}

function useEventCallback(fn, dependencies) {
  const ref = useRef(() => {
    throw new Error('Cannot call an event handler while rendering.');
  });

  useEffect(() => {
    ref.current = fn;
  }, [fn, ...dependencies]);

  return useCallback(() => {
    const fn = ref.current;
    return fn();
  }, [ref]);
}
```

> 不过这种方案并不优雅，[React 考虑提供一个更优雅的方案](https://reactjs.org/docs/hooks-faq.html#how-to-read-an-often-changing-value-from-usecallback)。

## 有可能被滥用的 useReducer

在 [精读《useEffect 完全指南》](https://github.com/dt-fe/weekly/blob/master/96.%E7%B2%BE%E8%AF%BB%E3%80%8AuseEffect%20%E5%AE%8C%E5%85%A8%E6%8C%87%E5%8D%97%E3%80%8B.md#%E5%B0%86%E6%9B%B4%E6%96%B0%E4%B8%8E%E5%8A%A8%E4%BD%9C%E8%A7%A3%E8%80%A6) “将更新与动作解耦” 一节里提到了，利用 `useReducer` 解决 “函数同时依赖多个外部变量的问题”。

一般情况下，我们会这么使用 `useReducer`:

```tsx
const reducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return { value: state.value + 1 };
    case 'decrement':
      return { value: state.value - 1 };
    case 'incrementAmount':
      return { value: state.value + action.amount };
    default:
      throw new Error();
  }
};

const [state, dispatch] = useReducer(reducer, { value: 0 });
```

但其实 `useReducer` 对 `state` 与 `action` 的定义可以很随意，因此我们可以利用 `useReducer` 打造一个 `useState`。

比如我们创建一个拥有复数 key 的 `useState`:

```jsx
const [state, setState] = useState({ count: 0, name: 'nick' });

// 修改 count
setState((state) => ({ ...state, count: 1 }));

// 修改 name
setState((state) => ({ ...state, name: 'jack' }));
```

利用 `useReducer` 实现相似的功能：

```jsx
function reducer(state, action) {
  return action(state);
}

const [state, dispatch] = useReducer(reducer, { count: 0, name: 'nick' });

// 修改 count
dispatch((state) => ({ ...state, count: 1 }));

// 修改 name
dispatch((state) => ({ ...state, name: 'jack' }));
```

因此针对如上情况，我们可能滥用了 `useReducer`，建议直接用 `useState` 代替。

# 总结

本文总结了具有弹性的组件的四个特性：不要阻塞数据流、时刻准备好渲染、不要有单例组件、隔离本地状态。

这个约定对代码质量很重要，而且难以通过 lint 规则或简单肉眼观察加以识别，因此推广起来还是有不小难度。

总的来说，Function Component 带来了更优雅的代码体验，但是对团队协作的要求也更高了。
