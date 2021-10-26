---
title: TypeScript 入门学习
date: 2021-10-22 13:47:44
path: /typescript-introduce-learn/
tags: 前端, TypeScript, ts
---

# 背景知识

- [TypeScript Handbook 入门教程](https://zhongsp.gitbooks.io/typescript-handbook/content/)
- [深入理解 TypeScript](https://jkchao.github.io/typescript-book-chinese/)

# React 中的用法

## 组件声明

### 类组件

类组件的定义形式有两种：`React.Component<P, S={}>` 和 `React.PureComponent<P, S={} SS={}>`，它们都是泛型接口，接收两个参数，第一个是 props 类型的定义，第二个是 state 类型的定义，这两个参数都不是必须的，没有时可以省略：

```tsx
interface IProps {
   name: string;
}

interface IState {
   count: number;
}

class App extends React.Component<IProps, IState> {
   state = {
      count: 0
   };

   render() {
      return (
         <div>
            {this.state.count}
            {this.props.name}
         </div>
      );
   }
}

export default App;
```

`React.PureComponent<P, S={} SS={}>` 也是差不多的：

```tsx
class App extends React.PureComponent<IProps, IState> {}
```

如果定义时候我们不知道组件的 props 的类型，只有在调用时才知道组件类型，该怎么办呢？这时泛型就发挥作用了：

```tsx
// 定义组件
class MyComponent<P> extends React.Component<P> {
   internalProp: P;
   constructor(props: P) {
      super(props);
      this.internalProp = props;
   }
   render() {
      return <span>hello world</span>;
   }
}

// 使用组件
type IProps = { name: string; age: number };

<MyComponent<IProps> name='React' age={18} />; // Success
<MyComponent<IProps> name='TypeScript' age='hello' />; // Error
```

### 函数组件

```tsx
interface IProps {
   name: string;
}

const App = (props: IProps) => {
   const { name } = props;

   return (
      <div className='App'>
         <h1>hello world</h1>
         <h2>{name}</h2>
      </div>
   );
};

export default App;
```

除此之外，函数类型还可以使用 `React.FunctionComponent<P={}>` 来定义，也可以使用其简写`React.FC<P={}>`，两者效果是一样的。它是一个泛型接口，可以接收一个参数，参数表示 props 的类型，这个参数不是必须的。它们就相当于这样：

```tsx
type React.FC<P = {}> = React.FunctionComponent<P>
```

最终的定义形式如下：

```tsx
interface IProps {
   name: string;
}

const App: React.FC<IProps> = (props) => {
   const { name } = props;
   return (
      <div className='App'>
         <h1>hello world</h1>
         <h2>{name}</h2>
      </div>
   );
};

export default App;
```

当使用这种形式来定义函数组件时，props 中默认会带有 children 属性，它表示该组件在调用时，其内部的元素

使用 React.FC 声明函数组件和普通声明的区别如下：

- React.FC 显式地定义了返回类型，其他方式是隐式推导的；
- React.FC 对静态属性：displayName、propTypes、defaultProps 提供了类型检查和自动补全；
- React.FC 为 children 提供了隐式的类型（ReactElement | null）。

那如果我们在定义组件时不知道 props 的类型，只有调用时才知道，那就还是用泛型来定义 props 的类型。对于使用 function 定义的函数组件：

```tsx
// 定义组件
function MyComponent<P>(props: P) {
   return <span>{props}</span>;
}

// 使用组件
type IProps = { name: string; age: number };

<MyComponent<IProps> name='React' age={18} />; // Success
<MyComponent<IProps> name='TypeScript' age='hello' />; // Error
```

如果使用箭头函数定义的函数组件，直接这样调用时错误的：

```tsx
const MyComponent = <P>(props: P) {
  return (
   <span>
     {props}
    </span>
  );
}
```

必须使用 extends 关键字来定义泛型参数才能被成功解析：

```tsx
const MyComponent = <P extends any>(props: P) {
  return (
   <span>
     {props}
    </span>
  );
}
```

## React 内置类型

### JSX.Element

先来看看 JSX.Element 类型的声明：

```ts
declare global {
   namespace JSX {
      interface Element extends React.ReactElement<any, any> {}
   }
}
```

可以看到，JSX.Element 是 ReactElement 的子类型，它没有增加属性，两者是等价的。也就是说两种类型的变量可以相互赋值。​

JSX.Element 可以通过执行 React.createElement 或是转译 JSX 获得：

```tsx
const jsx = <div>hello</div>;
const ele = React.createElement('div', null, 'hello');
```

### React.ReactElement

React 的类型声明文件中提供了 `React.ReactElement<T>`，它可以让我们通过传入 `<T>` 来注解类组件的实例化，它在声明文件中的定义如下：

```ts
interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
   type: T;
   props: P;
   key: Key | null;
}
```

ReactElement 是一个接口，包含 type,props,key 三个属性值。该类型的变量值只能是两种： null 和 ReactElement 实例。​

通常情况下，函数组件返回 ReactElement（JSX.Element）的值。

### React.ReactNode

ReactNode 类型的声明如下：

```ts
type ReactText = string | number;
type ReactChild = ReactElement | ReactText;

interface ReactNodeArray extends Array<ReactNode> {}
type ReactFragment = {} | ReactNodeArray;
type ReactNode = ReactChild | ReactFragment | ReactPortal | boolean | null | undefined;
```

可以看到，ReactNode 是一个联合类型，它可以是 string、number、ReactElement、null、boolean、ReactNodeArray。由此可知。ReactElement 类型的变量可以直接赋值给 ReactNode 类型的变量，但反过来是不行的。

类组件的 render 成员函数会返回 ReactNode 类型的值：

```tsx
class MyComponent extends React.Component {
   render() {
      return <div>hello world</div>;
   }
}
// 正确
const component: React.ReactNode<MyComponent> = <MyComponent />;
// 错误
const component: React.ReactNode<MyComponent> = <OtherComponent />;
```

上面的代码中，给 component 变量设置了类型是 Mycomponent 类型的 react 实例，这时只能给其赋值其为 MyComponent 的实例组件。​

通常情况下，类组件通过 render() 返回 ReactNode 的值。

### CSSProperties

先来看看 React 的声明文件中对 CSSProperties 的定义：

```ts
export interface CSSProperties extends CSS.Properties<string | number> {
   /**
    * The index signature was removed to enable closed typing for style
    * using CSSType. You're able to use type assertion or module augmentation
    * to add properties or an index signature of your own.
    *
    * For examples and more information, visit:
    * https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors
    */
}
```

React.CSSProperties 是 React 基于 TypeScript 定义的 CSS 属性类型，可以将一个方法的返回值设置为该类型：

```tsx
import * as React from 'react';

const classNames = require('./sidebar.css');

interface Props {
   isVisible: boolean;
}

const divStyle = (props: Props): React.CSSProperties => ({
   width: props.isVisible ? '23rem' : '0rem'
});

export const SidebarComponent: React.StatelessComponent<Props> = (props) => (
   <div id='mySidenav' className={classNames.sidenav} style={divStyle(props)}>
      {props.children}
   </div>
);
```

这里 divStyle 组件的返回值就是 React.CSSProperties 类型。

我们还可以定义一个 CSSProperties 类型的变量：

```tsx
const divStyle: React.CSSProperties = {
   width: '11rem',
   height: '7rem',
   backgroundColor: `rgb(${props.color.red},${props.color.green}, ${props.color.blue})`
};
```

这个变量可以在 HTML 标签的 style 属性上使用：

```tsx
<div style={divStyle} />
```

在 React 的类型声明文件中，style 属性的类型如下：

```ts
style?: CSSProperties | undefined;
```

## React Hooks

### useState

默认情况下，React 会为根据设置的 state 的初始值来自动推导 state 以及更新函数的类型

如果已知 state 的类型，可以通过以下形式来自定义 state 的类型：

```tsx
const [count, setCount] = useState<number>(1);
```

如果初始值为 null，需要显式地声明 state 的类型：

```tsx
const [count, setCount] = useState<number | null>(null);
```

如果 state 是一个对象，想要初始化一个空对象，可以使用断言来处理：

```tsx
const [user, setUser] = React.useState<IUser>({} as IUser);
```

实际上，这里将空对象 `{}` 断言为 IUser 接口就是欺骗了 TypeScript 的编译器，由于后面的代码可能会依赖这个对象，所以应该在使用前及时初始化 user 的值，否则就会报错。

下面是声明文件中 useState 的定义：

```ts
function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
// convenience overload when first argument is omitted
/**
 * Returns a stateful value, and a function to update it.
 *
 * @version 16.8.0
 * @see https://reactjs.org/docs/hooks-reference.html#usestate
 */

function useState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
/**
 * An alternative to `useState`.
 *
 * `useReducer` is usually preferable to `useState` when you have complex state logic that involves
 * multiple sub-values. It also lets you optimize performance for components that trigger deep
 * updates because you can pass `dispatch` down instead of callbacks.
 *
 * @version 16.8.0
 * @see https://reactjs.org/docs/hooks-reference.html#usereducer
 */
```

可以看到，这里定义两种形式，分别是有初始值和没有初始值的形式。

### useEffect

```tsx
useEffect(() => {
   const subscription = props.source.subscribe();
   return () => {
      subscription.unsubscribe();
   };
}, [props.source]);
```

当函数的返回值不是函数或者 effect 函数中未定义的内容时，如下：

```tsx
useEffect(() => {
   subscribe();
   return null; // Type 'null' is not assignable to type 'void | Destructor'
});
```

来看看 useEffect 在类型声明文件中的定义：

```ts
// Destructors are only allowed to return void.
type Destructor = () => void | { [UNDEFINED_VOID_ONLY]: never };

// NOTE: callbacks are _only_ allowed to return either void, or a destructor.
type EffectCallback = () => void | Destructor;

// (TypeScript 3.0): ReadonlyArray<unknown>
type DependencyList = ReadonlyArray<any>;

function useEffect(effect: EffectCallback, deps?: DependencyList): void;
// NOTE: this does not accept strings, but this will have to be fixed by removing strings from type Ref<T>
/**
 * `useImperativeHandle` customizes the instance value that is exposed to parent components when using
 * `ref`. As always, imperative code using refs should be avoided in most cases.
 *
 * `useImperativeHandle` should be used with `React.forwardRef`.
 *
 * @version 16.8.0
 * @see https://reactjs.org/docs/hooks-reference.html#useimperativehandle
 */
```

可以看到，useEffect 的第一个参数只允许返回一个函数。

### useRef

当使用 useRef 时，我们可以访问一个可变的引用对象。可以将初始值传递给 useRef，它用于初始化可变 ref 对象公开的当前属性。当我们使用 useRef 时，需要给其指定类型：

```tsx
const nameInput = React.useRef<HTMLInputElement>(null);
```

这里给实例的类型指定为了 input 输入框类型。​

当 useRef 的初始值为 null 时，有两种创建的形式，第一种：

```tsx
const nameInput = React.useRef<HTMLInputElement>(null);
nameInput.current.innerText = 'hello world';
```

这种形式下，ref1.current 是只读的（read-only），所以当我们将它的 innerText 属性重新赋值时会报以下错误：

```
Cannot assign to 'current' because it is a read-only property.
```

那该怎么将 current 属性变为动态可变得的，先来看看类型声明文件中 useRef 是如何定义的：

```ts
function useRef<T>(initialValue: T): MutableRefObject<T>;
// convenience overload for refs given as a ref prop as they typically start with a null value
/**
 * `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument
 * (`initialValue`). The returned object will persist for the full lifetime of the component.
 *
 * Note that `useRef()` is useful for more than the `ref` attribute. It’s handy for keeping any mutable
 * value around similar to how you’d use instance fields in classes.
 *
 * Usage note: if you need the result of useRef to be directly mutable, include `| null` in the type
 * of the generic argument.
 *
 * @version 16.8.0
 * @see https://reactjs.org/docs/hooks-reference.html#useref
 */
```

这段代码告诉我们，如果需要 useRef 的直接可变，就需要在泛型参数中包含 `| null`，所以这就是当初始值为 null 的第二种定义形式：

```tsx
const nameInput = React.useRef<HTMLInputElement | null>(null);
```

这种形式下，nameInput.current 就是可写的。不过两种类型在使用时都需要做类型检查：

```tsx
nameInput.current?.innerText = "hello world";
```

那么问题来了，为什么第一种写法在没有操作 current 时没有报错呢？因为 useRef 在类型定义式具有多个重载声明，第一种方式就是执行的以下函数重载：

```ts
function useRef<T>(initialValue: T | null): RefObject<T>;
// convenience overload for potentially undefined initialValue / call with 0 arguments
// has a default to stop it from defaulting to {} instead
/**
 * `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument
 * (`initialValue`). The returned object will persist for the full lifetime of the component.
 *
 * Note that `useRef()` is useful for more than the `ref` attribute. It’s handy for keeping any mutable
 * value around similar to how you’d use instance fields in classes.
 *
 * @version 16.8.0
 * @see https://reactjs.org/docs/hooks-reference.html#useref
 */
```

从 useRef 的声明中可以看到，function useRef 的返回值类型化是 MutableRefObject，这里面的 T 就是参数的类型 T，所以最终 nameInput 的类型就是 React.MutableRefObject。

注意，上面用到了 HTMLInputElement 类型，这是一个标签类型，这个操作就是用来访问 DOM 元素的。

### useCallback

先来看看类型声明文件中对 useCallback 的定义：

````ts
function useCallback<T extends (...args: any[]) => any>(callback: T, deps: DependencyList): T;
/**
 * `useMemo` will only recompute the memoized value when one of the `deps` has changed.
 *
 * Usage note: if calling `useMemo` with a referentially stable function, also give it as the input in
 * the second argument.
 *
 * ```ts
 * function expensive () { ... }
 *
 * function Component () {
 *   const expensiveResult = useMemo(expensive, [expensive])
 *   return ...
 * }
 * ```
 *
 * @version 16.8.0
 * @see https://reactjs.org/docs/hooks-reference.html#usememo
 */
````

useCallback 接收一个回调函数和一个依赖数组，只有当依赖数组中的值发生变化时才会重新执行回调函数。来看一个例子：

```tsx
const add = (a: number, b: number) => a + b;

const memoizedCallback = useCallback(
   (a) => {
      add(a, b);
   },
   [b]
);
```

这里我们没有给回调函数中的参数 a 定义类型，所以下面的调用方式都不会报错：

```tsx
memoizedCallback('hello');
memoizedCallback(5);
```

尽管 add 方法的两个参数都是 number 类型，但是上述调用都能够用执行。所以为了更加严谨，我们需要给回调函数定义具体的类型：

```tsx
const memoizedCallback = useCallback(
   (a: number) => {
      add(a, b);
   },
   [b]
);
```

这时候如果再给回调函数传入字符串就会报错了，需要注意在使用 useCallback 时需要给回调函数的参数指定类型。

### useMemo

先来看看类型声明文件中对 useMemo 的定义：

```ts
function useMemo<T>(factory: () => T, deps: DependencyList | undefined): T;
/**
 * `useDebugValue` can be used to display a label for custom hooks in React DevTools.
 *
 * NOTE: We don’t recommend adding debug values to every custom hook.
 * It’s most valuable for custom hooks that are part of shared libraries.
 *
 * @version 16.8.0
 * @see https://reactjs.org/docs/hooks-reference.html#usedebugvalue
 */
```

useMemo 和 useCallback 是非常类似的，但是它返回的是一个值，而不是函数。所以在定义 useMemo 时需要定义返回值的类型：

```ts
let a = 1;
setTimeout(() => {
   a += 1;
}, 1000);

const calculatedValue = useMemo<number>(() => a ** 2, [a]);
```

如果返回值不一致，就会报错

```tsx
const calculatedValue = useMemo<number>(() => a + 'hello', [a]);
// 类型“() => string”的参数不能赋给类型“() => number”的参数
```

### useContext

useContext 需要提供一个上下文对象，并返回所提供的上下文的值，当提供者更新上下文对象时，引用这些上下文对象的组件就会重新渲染：

```tsx
const ColorContext = React.createContext({ color: 'green' });

const Welcome = () => {
   const { color } = useContext(ColorContext);
   return <div style={{ color }}>hello world</div>;
};
```

在使用 useContext 时，会自动推断出提供的上下文对象的类型，所以并不需要我们手动设置 context 的类型。当前，我们也可以使用泛型来设置 context 的类型：

```tsx
interface IColor {
   color: string;
}

const ColorContext = React.createContext<IColor>({ color: 'green' });
```

下面是 useContext 在类型声明文件中的定义：

```ts
function useContext<T>(context: Context<T> /*, (not public API) observedBits?: number|boolean */): T;
/**
 * Returns a stateful value, and a function to update it.
 *
 * @version 16.8.0
 * @see https://reactjs.org/docs/hooks-reference.html#usestate
 */
```

### useReducer

有时我们需要处理一些复杂的状态，并且可能取决于之前的状态。这时候就可以使用 useReducer，它接收一个函数，这个函数会根据之前的状态来计算一个新的 state。其语法如下：

```tsx
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

来看下面的例子：

```tsx
const reducer = (state, action) => {
   switch (action.type) {
      case 'increment':
         return { count: state.count + 1 };
      case 'decrement':
         return { count: state.count - 1 };
      default:
         throw new Error();
   }
};

const Counter = () => {
   const initialState = { count: 0 };
   const [state, dispatch] = useReducer(reducer, initialState);

   return (
      <>
         Count: {state.count}
         <button onClick={() => dispatch({ type: 'increment' })}>+</button>
         <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      </>
   );
};
```

当前的状态是无法推断出来的，可以给 reducer 函数添加类型，通过给 reducer 函数定义 state 和 action 来推断 useReducer 的类型，下面来修改上面的例子：

```tsx
type ActionType = {
   type: 'increment' | 'decrement';
};

type State = { count: number };

const initialState: State = { count: 0 };
const reducer = (state: State, action: ActionType) => {
   // ...
};
```

这样，在 Counter 函数中就可以推断出类型。当我们视图使用一个不存在的类型时，就会报错：

```ts
dispatch({ type: 'reset' });
// Error! type '"reset"' is not assignable to type '"increment" | "decrement"'
```

除此之外，还可以使用泛型的形式来实现 reducer 函数的类型定义：

```ts
type ActionType = {
   type: 'increment' | 'decrement';
};

type State = { count: number };

const reducer: React.Reducer<State, ActionType> = (state, action) => {
   // ...
};
```

## 事件处理

### Event 事件类型

常见的 Event 事件对象如下：

- 剪切板事件对象：`ClipboardEvent<T = Element>`
- 拖拽事件对象：`DragEvent<T = Element>`
- 焦点事件对象：`FocusEvent<T = Element>`
- 表单事件对象：`FormEvent<T = Element>`
- Change 事件对象：`ChangeEvent<T = Element>`
- 键盘事件对象：`KeyboardEvent<T = Element>`
- 鼠标事件对象：`MouseEvent<T = Element, E = NativeMouseEvent>`
- 触摸事件对象：`TouchEvent<T = Element>`
- 滚轮事件对象：`WheelEvent<T = Element>`
- 动画事件对象：`AnimationEvent<T = Element>`
- 过渡事件对象：`TransitionEvent<T = Element>`

```tsx
type State = {
   text: string;
};

const App: React.FC = () => {
   const [text, setText] = useState<string>('');

   const onChange = (e: React.FormEvent<HTMLInputElement>): void => {
      setText(e.currentTarget.value);
   };

   return (
      <div>
         <input type='text' value={text} onChange={this.onChange} />
      </div>
   );
};
```

这里就给 onChange 方法的事件对象定义为了 FormEvent 类型，并且作用的对象时一个 HTMLInputElement 类型的标签（input 标签） ​ 可以来看下 MouseEvent 事件对象和 ChangeEvent 事件对象的类型声明，其他事件对象的声明形似也类似：

```ts
interface MouseEvent<T = Element, E = NativeMouseEvent> extends UIEvent<T, E> {
   altKey: boolean;
   button: number;
   buttons: number;
   clientX: number;
   clientY: number;
   ctrlKey: boolean;
   /**
    * See [DOM Level 3 Events spec](https://www.w3.org/TR/uievents-key/#keys-modifier). for a list of valid (case-sensitive) arguments to this method.
    */
   getModifierState(key: string): boolean;
   metaKey: boolean;
   movementX: number;
   movementY: number;
   pageX: number;
   pageY: number;
   relatedTarget: EventTarget | null;
   screenX: number;
   screenY: number;
   shiftKey: boolean;
}

interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
   target: EventTarget & T;
}
```

在很多事件对象的声明文件中都可以看到 EventTarget 的身影。这是因为 DOM 的事件操作（监听和触发）都定义在 EventTarget 接口上。EventTarget 的类型声明如下：

```ts
interface EventTarget {
   addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject | null,
      options?: boolean | AddEventListenerOptions
   ): void;
   dispatchEvent(evt: Event): boolean;
   removeEventListener(
      type: string,
      listener?: EventListenerOrEventListenerObject | null,
      options?: EventListenerOptions | boolean
   ): void;
}
```

比如在 change 事件中，会使用的 e.target 来获取当前的值，它的的类型就是 EventTarget。来看下面的例子：

```tsx
<input onChange={(e) => onSourceChange(e)} placeholder='最多30个字' />;

const onSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   if (e.target.value.length > 30) {
      message.error('请长度不能超过30个字，请重新输入');
      return;
   }
   setSourceInput(e.target.value);
};
```

### 事件处理函数类型

React 也为我们提供了贴心的提供了事件处理函数的类型声明，来看看所有的事件处理函数的类型声明：

```ts
type EventHandler<E extends SyntheticEvent<any>> = { bivarianceHack(event: E): void }['bivarianceHack'];

type ReactEventHandler<T = Element> = EventHandler<SyntheticEvent<T>>;
// 剪切板事件处理函数
type ClipboardEventHandler<T = Element> = EventHandler<ClipboardEvent<T>>;
// 复合事件处理函数
type CompositionEventHandler<T = Element> = EventHandler<CompositionEvent<T>>;
// 拖拽事件处理函数
type DragEventHandler<T = Element> = EventHandler<DragEvent<T>>;
// 焦点事件处理函数
type FocusEventHandler<T = Element> = EventHandler<FocusEvent<T>>;
// 表单事件处理函数
type FormEventHandler<T = Element> = EventHandler<FormEvent<T>>;
// Change事件处理函数
type ChangeEventHandler<T = Element> = EventHandler<ChangeEvent<T>>;
// 键盘事件处理函数
type KeyboardEventHandler<T = Element> = EventHandler<KeyboardEvent<T>>;
// 鼠标事件处理函数
type MouseEventHandler<T = Element> = EventHandler<MouseEvent<T>>;
// 触屏事件处理函数
type TouchEventHandler<T = Element> = EventHandler<TouchEvent<T>>;
// 指针事件处理函数
type PointerEventHandler<T = Element> = EventHandler<PointerEvent<T>>;
// 界面事件处理函数
type UIEventHandler<T = Element> = EventHandler<UIEvent<T>>;
// 滚轮事件处理函数
type WheelEventHandler<T = Element> = EventHandler<WheelEvent<T>>;
// 动画事件处理函数
type AnimationEventHandler<T = Element> = EventHandler<AnimationEvent<T>>;
// 过渡事件处理函数
type TransitionEventHandler<T = Element> = EventHandler<TransitionEvent<T>>;
```

这里面的 T 的类型也都是 Element，指的是触发该事件的 HTML 标签元素的类型

EventHandler 会接收一个 E，它表示事件处理函数中 Event 对象的类型。bivarianceHack 是事件处理函数的类型定义，函数接收一个 Event 对象，并且其类型为接收到的泛型变量 E 的类型，返回值为 void。

还看上面的那个例子：

```tsx
type State = {
   text: string;
};

const App: React.FC = () => {
   const [text, setText] = useState<string>('');

   const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      setText(e.currentTarget.value);
   };

   return (
      <div>
         <input type='text' value={text} onChange={this.onChange} />
      </div>
   );
};
```

这里给 onChange 方法定义了方法的类型，它是一个 ChangeEventHandler 的类型，并且作用的对象时一个 HTMLImnputElement 类型的标签（input 标签）。

## HTML 标签类型

### 常见标签类型

所有的 HTML 标签的类型都被定义在 intrinsicElements 接口中，常见的标签及其类型如下：

```ts
a: HTMLAnchorElement;
body: HTMLBodyElement;
br: HTMLBRElement;
button: HTMLButtonElement;
div: HTMLDivElement;
h1: HTMLHeadingElement;
h2: HTMLHeadingElement;
h3: HTMLHeadingElement;
html: HTMLHtmlElement;
img: HTMLImageElement;
input: HTMLInputElement;
ul: HTMLUListElement;
li: HTMLLIElement;
link: HTMLLinkElement;
p: HTMLParagraphElement;
span: HTMLSpanElement;
style: HTMLStyleElement;
table: HTMLTableElement;
tbody: HTMLTableSectionElement;
video: HTMLVideoElement;
audio: HTMLAudioElement;
meta: HTMLMetaElement;
form: HTMLFormElement;
```

那什么时候会使用到标签类型呢，上面 Event 事件类型和事件处理函数类型中都使用到了标签的类型。上面的很多的类型都需要传入一个 ELement 类型的泛型参数，这个泛型参数就是对应的标签类型值，可以根据标签来选择对应的标签类型。这些类型都继承自 HTMLElement 类型，如果使用时对类型类型要求不高，可以直接写 HTMLELement。

比如下面的例子：

```tsx
<Button
   type='text'
   onClick={(e: React.MouseEvent<HTMLElement>) => {
      handleOperate();
      e.stopPropagation();
   }}
>
   <img src={cancelChangeIcon} alt='' />
   取消修改
</Button>
```

其实，在直接操作 DOM 时也会用到标签类型，虽然我们现在通常会使用框架来开发，但是有时候也避免不了直接操作 DOM。比如项目中的某一部分组件是通过 npm 来引入的其他组的组件，而在很多时候，需要动态的去个性化这个组件的样式，最直接的办法就是通过原生 JavaScript 获取到 DOM 元素，来进行样式的修改，这时候就会用到标签类型。 ​ 来看下面的例子：

```ts
document.querySelectorAll('.paper').forEach((item) => {
   const firstPageHasAddEle = (item.firstChild as HTMLDivElement).classList.contains('add-ele');

   if (firstPageHasAddEle) {
      item.removeChild(item.firstChild as ChildNode);
   }
});
```

在第一页有个 add-ele 元素的时候就删除它。这里我们将 item.firstChild 断言成了 HTMLDivElement 类型，如果不断言，item.firstChild 的类型就是 ChildNode，而 ChildNode 类型中是不存在 classList 属性的，所以就就会报错，当我们把他断言成 HTMLDivElement 类型时，就不会报错了。很多时候，标签类型可以和断言（as）一起使用。

后面在 removeChild 时又使用了 as 断言，为什么呢？item.firstChild 不是已经自动识别为 ChildNode 类型了吗？因为 TS 会认为，我们可能不能获取到类名为 paper 的元素，所以 item.firstChild 的类型就被推断为 ChildNode | null，我们有时候比 TS 更懂我们定义的元素，知道页面一定存在 paper 元素，所以可以直接将 item.firstChild 断言成 ChildNode 类型。

### 标签属性类型

每个 HTML 标签都有自己的属性，比如 Input 框就有 value、width、placeholder、max-length 等属性，下面是 Input 框的属性类型定义：

```ts
interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
   accept?: string | undefined;
   alt?: string | undefined;
   autoComplete?: string | undefined;
   autoFocus?: boolean | undefined;
   capture?: boolean | string | undefined;
   checked?: boolean | undefined;
   crossOrigin?: string | undefined;
   disabled?: boolean | undefined;
   enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send' | undefined;
   form?: string | undefined;
   formAction?: string | undefined;
   formEncType?: string | undefined;
   formMethod?: string | undefined;
   formNoValidate?: boolean | undefined;
   formTarget?: string | undefined;
   height?: number | string | undefined;
   list?: string | undefined;
   max?: number | string | undefined;
   maxLength?: number | undefined;
   min?: number | string | undefined;
   minLength?: number | undefined;
   multiple?: boolean | undefined;
   name?: string | undefined;
   pattern?: string | undefined;
   placeholder?: string | undefined;
   readOnly?: boolean | undefined;
   required?: boolean | undefined;
   size?: number | undefined;
   src?: string | undefined;
   step?: number | string | undefined;
   type?: string | undefined;
   value?: string | ReadonlyArray<string> | number | undefined;
   width?: number | string | undefined;

   onChange?: ChangeEventHandler<T> | undefined;
}
```

如果我们需要直接操作 DOM，就可能会用到元素属性类型，常见的元素属性类型如下：

- HTML 属性类型：HTMLAttributes
- 按钮属性类型：ButtonHTMLAttributes
- 表单属性类型：FormHTMLAttributes
- 图片属性类型：ImgHTMLAttributes
- 输入框属性类型：InputHTMLAttributes
- 链接属性类型：LinkHTMLAttributes
- meta 属性类型：MetaHTMLAttributes
- 选择框属性类型：SelectHTMLAttributes
- 表格属性类型：TableHTMLAttributes
- 输入区属性类型：TextareaHTMLAttributes
- 视频属性类型：VideoHTMLAttributes
- SVG 属性类型：SVGAttributes
- WebView 属性类型：WebViewHTMLAttributes

一般情况下，我们是很少需要在项目中显式的去定义标签属性的类型。如果子级去封装组件库的话，这些属性就能发挥它们的作用了：

```tsx
import React from 'react';
import classNames from 'classnames';

export enum ButtonSize {
   Large = 'lg',
   Small = 'sm'
}

export enum ButtonType {
   Primary = 'primary',
   Default = 'default',
   Danger = 'danger',
   Link = 'link'
}

interface BaseButtonProps {
   className?: string;
   disabled?: boolean;
   size?: ButtonSize;
   btnType?: ButtonType;
   children: React.ReactNode;
   href?: string;
}

// 使用 交叉类型（&）获得我们自己定义的属性和原生 button 的属性
type NativeButtonProps = BaseButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

// 使用 交叉类型（&）获得我们自己定义的属性和原生 a 标签的属性
type AnchorButtonProps = BaseButtonProps & React.AnchorHTMLAttributes<HTMLAnchorElement>;

// 使用 Partial<> 使两种属性可选
export type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps>;

const Button: React.FC<ButtonProps> = (props) => {
   const { disabled, className, size, btnType, children, href, ...restProps } = props;

   const classes = classNames('btn', className, {
      [`btn-${btnType}`]: btnType,
      [`btn-${size}`]: size,
      disabled: btnType === ButtonType.Link && disabled // 只有 a 标签才有 disabled 类名，button 没有
   });

   if (btnType === ButtonType.Link && href) {
      return (
         <a className={classes} href={href} {...restProps}>
            {children}
         </a>
      );
   } else {
      return (
         <button
            className={classes}
            disabled={disabled} // button 元素默认有 disabled 属性，所以即便没给他设置样式也会和普通 button 有一定区别
            {...restProps}
         >
            {children}
         </button>
      );
   }
};

Button.defaultProps = {
   disabled: false,
   btnType: ButtonType.Default
};

export default Button;
```

# 工具泛型的实现

## Partial

Partial 作用是将传入的属性变为可选项

### 前置知识

首先我们需要理解两个关键字 keyof 和 in，keyof 可以用来取得一个对象接口的所有 key 值，比如

```ts
interface Foo {
   name: string;
   age: number;
}
type T = keyof Foo; // -> "name" | "age"
```

而 in 则可以遍历枚举类型， 例如

```ts
type Keys = 'a' | 'b';
type Obj = {
   [p in Keys]: any;
}; // -> { a: any， b: any }
```

### 源码解析

keyof 产生联合类型，in 则可以遍历枚举类型，所以他们经常一起使用，看下 Partial 源码

```ts
type Partial<T> = {
   [P in keyof T]?: T[P];
};
```

上面语句的意思是 keyof T 拿到 T 所有属性名，然后 in 进行遍历，将值赋给 P，最后 `T[P]` 取得相应属性的值

结合中间的 ? 我们就明白了 Partial 的含义了

### 使用场景

假设我们有一个定义 user 的接口，如下

```ts
interface IUser {
   name: string;
   age: number;
   department: string;
}
```

经过 Partial 类型转化后得到

```ts
type optional = Partial<IUser>;

// optional的结果如下
type optional = {
   name?: string | undefined;
   age?: number | undefined;
   department?: string | undefined;
};
```

## Required

Required 的作用是将传入的属性变为必选项，源码如下

```ts
type Required<T> = {
   [P in keyof T]-?: T[P];
};
```

我们发现一个有意思的用法 -?，这里很好理解就是将可选项代表的 ? 去掉，从而让这个类型变成必选项。

与之对应的还有个+? ，这个含义自然与-?之前相反，它是用来把属性变成可选项的

```ts
interface IPerson {
   name?: string;
   age?: number;
   height?: number;
}

const person: Required<IPerson> = {
   name: 'zhangsan',
   age: 18,
   height: 180
};
```

## Mutable (未包含)

类似地，其实还有对 + 和 -，这里要说的不是变量的之间的进行加减而是对 readonly 进行加减。

以下代码的作用就是将 T 的所有属性的 readonly 移除，你也可以写一个相反的出来.

```ts
type Mutable<T> = {
   -readonly [P in keyof T]: T[P];
};
```

## Readonly

将传入的属性变为只读选项, 源码如下

```ts
type Readonly<T> = {
   readonly [P in keyof T]: T[P];
};
```

```ts
interface IPerson {
   name: string;
   age: number;
}

const person: Readonly<IPerson> = {
   name: 'zhangsan',
   age: 18
};

person.age = 20; //  Error: cannot reassign a readonly property
```

## Record

### 前置知识

此处注意 K extends keyof T 和直接使用 K in keyof T 的区别，keyof T 仅仅代表键的字符串文字类型，而 extends keyof T 将返回该属性相同的类型

```ts
function prop<T, K extends keyof T>(obj: T, key: K) {
   return obj[key];
}

function prop2<T>(obj: T, key: keyof T) {
   return obj[key];
}

let o = {
   p1: 0,
   p2: ''
};

let v = prop(o, 'p1'); // is number, K is of type 'p1'
let v2 = prop2(o, 'p1'); // is number | string, no extra info is captured
```

### 源码解析

将 K 中所有的属性的值转化为 T 类型

```ts
type Record<K extends keyof any, T> = {
   [P in K]: T;
};
```

### 使用场景

```ts
interface IPageinfo {
   name: string;
}

type IPage = 'home' | 'about' | 'contact';

const page: Record<IPage, IPageinfo> = {
   about: { name: 'about' },
   contact: { name: 'contact' },
   home: { name: 'home' }
};
```

## Pick

从 T 中取出一系列 K 的属性

```ts
type Pick<T, K extends keyof T> = {
   [P in K]: T[P];
};
```

```ts
interface IPerson {
   name: string;
   age: number;
   height: number;
}

const person: Pick<IPerson, 'name' | 'age'> = {
   name: 'zhangsan',
   age: 18
};
```

## Exclude

### 前置知识

在 ts 2.8 中引入了一个条件类型，示例如下

```ts
T extends U ? X : Y
```

以上语句的意思就是如果 T 是 U 的子类型的话，那么就会返回 X，否则返回 Y，甚至可以组合多个

```ts
type TypeName<T> = T extends string
   ? 'string'
   : T extends number
   ? 'number'
   : T extends boolean
   ? 'boolean'
   : T extends undefined
   ? 'undefined'
   : T extends Function
   ? 'function'
   : 'object';
```

对于联合类型来说会自动分发条件，例如 T extends U ? X : Y，T 可能是 A | B 的联合类型，那实际情况就变成(A extends U ? X : Y) | (B extends U ? X : Y)

### 源码解析

```ts
type Exclude<T, U> = T extends U ? never : T;
```

### 使用场景

```ts
type T = Exclude<1 | 2, 1 | 3>; // -> 2
```

很轻松地得出结果 2，据代码和示例我们可以推断出 Exclude 的作用是从 T 中找出 U 中没有的元素，换种更加贴近语义的说法其实就是从 T 中排除 U

## Extract

根据源码我们推断出 Extract 的作用是提取出 T 包含在 U 中的元素，换种更加贴近语义的说法就是从 T 中提取出 U

源码如下

```ts
type Extract<T, U> = T extends U ? T : never;
```

## Omit

用之前的 Pick 和 Exclude 进行组合，实现忽略对象某些属性功能，源码如下

```ts
type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

// 使用
type Foo = Omit<
   {
      name: string;
      age: number;
   },
   'name'
>; // -> { age: number }

interface IPerson {
   name: string;
   age: number;
   height: number;
}

const person: Omit<IPerson, 'age' | 'sex'> = {
   name: 'zhangsan',
   height: 180
};
```

## ReturnType

在阅读源码之前我们需要了解一下 infer 这个关键字，在条件类型语句中，我们可以用 infer 声明一个类型变量并且对它进行使用，我们可以用它获取函数的返回类型，源码如下

```ts
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
```

其实这里的 infer R 就是声明一个变量来承载传入函数签名的返回值类型，简单说就是用它取到函数返回值的类型方便之后使用

```ts
function foo(x: number): Array<number> {
   return [x];
}
type fn = ReturnType<typeof foo>;
```

## AxiosReturnType (未包含)

开发经常使用 axios 进行封装 API 层请求，通常是一个函数返回一个 `AxiosPromise<Resp>`，现在我想取到它的 Resp 类型，根据上一个工具泛型的知识我们可以这样写

```ts
import { AxiosPromise } from 'axios'; // 导入接口
type AxiosReturnType<T> = T extends (...args: any[]) => AxiosPromise<infer R> ? R : any;

// 使用
type Resp = AxiosReturnType<Api>; // 泛型参数中传入你的 Api 请求函数
```

# 巧用 TypeScript

## 函数重载

TypeScript 提供函数重载的功能，用来处理因函数参数不同而返回类型不同的使用场景，使用时只需为同一个函数定义多个类型即可，简单使用如下所示：

```ts
declare function test(a: number): number;
declare function test(a: string): string;

const resS = test('Hello World'); // resS 被推断出类型为 string；
const resN = test(1234); // resN 被推断出类型为 number;
```

它也适用于参数不同，返回值类型相同的场景，我们只需要知道在哪种函数类型定义下能使用哪些参数即可。

考虑如下例子：

```ts
interface User {
   name: string;
   age: number;
}

declare function test(para: User | number, flag?: boolean): number;
```

在这个 test 函数里，我们的本意可能是当传入参数 para 是 User 时，不传 flag，当传入 para 是 number 时，传入 flag。TypeScript 并不知道这些，当你传入 para 为 User 时，flag 同样允许你传入：

```ts
const user = {
   name: 'Jack',
   age: 666
};

// 没有报错，但是与想法违背
const res = test(user, false);
```

使用函数重载能帮助我们实现：

```ts
interface User {
   name: string;
   age: number;
}

declare function test(para: User): number;
declare function test(para: number, flag: boolean): number;

const user = {
   name: 'Jack',
   age: 666
};

// bingo
// Error: 参数不匹配
const res = test(user, false);
```

实际项目中，你可能要多写几步，如在 class 中：

```ts
interface User {
   name: string;
   age: number;
}

const user = {
   name: 'Jack',
   age: 123
};

class SomeClass {
   /**
    * 注释 1
    */
   public test(para: User): number;
   /**
    * 注释 2
    */
   public test(para: number, flag: boolean): number;
   public test(para: User | number, flag?: boolean): number {
      // 具体实现
      return 11;
   }
}

const someClass = new SomeClass();

// ok
someClass.test(user);
someClass.test(123, false);

// Error，涉及到具体实现时，这个地方报错
someClass.test(123);
someClass.test(user, false);
```

## 映射类型

自从 TypeScript 2.1 版本推出映射类型以来，它便不断被完善与增强。在 2.1 版本中，可以通过 keyof 拿到对象 key 类型，内置 Partial、Readonly、Record、Pick 映射类型；2.3 版本增加 ThisType；2.8 版本增加 Exclude、Extract、NonNullable、ReturnType、InstanceType；同时在此版本中增加条件类型与增强 keyof 的能力；3.1 版本支持对元组与数组的映射。这些无不意味着映射类型在 TypeScript 有着举足轻重的地位。

其中 ThisType 并没有出现在官方文档中，它主要用来在对象字面量中键入 this：

```ts
// Compile with --noImplicitThis

type ObjectDescriptor<D, M> = {
   data?: D;
   methods?: M & ThisType<D & M>; // Type of 'this' in methods is D & M
};

function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
   let data: object = desc.data || {};
   let methods: object = desc.methods || {};
   return { ...data, ...methods } as D & M;
}

let obj = makeObject({
   data: { x: 0, y: 0 },
   methods: {
      moveBy(dx: number, dy: number) {
         this.x += dx; // Strongly typed this
         this.y += dy; // Strongly typed this
      }
   }
});

obj.x = 10;
obj.y = 20;
obj.moveBy(5, 5);
```

> 正是由于 ThisType 的出现，Vue 2.5 才得以增强对 TypeScript 的支持。

虽已内置了很多映射类型，但在很多时候，我们需要根据自己的项目自定义映射类型：

比如你可能想取出接口类型中的函数类型：

```ts
type FunctionPropertyNames<T> = {
   [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];
type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

interface Part {
   id: number;
   name: string;
   subparts: Part[];
   updatePart(newName: string): void;
}

type T40 = FunctionPropertyNames<Part>; // "updatePart"
type T42 = FunctionProperties<Part>; // { updatePart(newName: string): void }
```

比如你可能为了便捷，把本属于某个属性下的方法，通过一些方式 alias 到其他地方

举个例子：SomeClass 下有个属性 value = [1, 2, 3]，你可能在 Decorators 给类添加了此种功能：在 SomeClass 里调用 this.find() 时，实际上是调用 this.value.find()，但是此时 TypeScript 并不知道这些：

```ts
class SomeClass {
   value = [1, 2, 3];

   someMethod() {
      this.value.find(/* ... */); // ok
      this.find(/* ... */); // Error：SomeClass 没有 find 方法。
   }
}
```

借助于映射类型和 interface + class 的声明方式，可以实现我们的目的：

```ts
type ArrayMethodName = 'filter' | 'forEach' | 'find';

type SelectArrayMethod<T> = {
   [K in ArrayMethodName]: Array<T>[K];
};

interface SomeClass extends SelectArrayMethod<number> {}

class SomeClass {
   value = [1, 2, 3];

   someMethod() {
      this.forEach(/* ... */); // ok
      this.find(/* ... */); // ok
      this.filter(/* ... */); // ok
      this.value; // ok
      this.someMethod(); // ok
   }
}

const someClass = new SomeClass();
someClass.forEach(/* ... */); // ok
someClass.find(/* ... */); // ok
someClass.filter(/* ... */); // ok
someClass.value; // ok
someClass.someMethod(); // ok
```

> 导出 SomeClass 类时，也能使用。

可能有点不足的地方，在这段代码里 `interface SomeClass extends SelectArrayMethod<number> {}` 你需要手动添加范型的具体类型（暂时没想到更好方式）。

## 类型断言

类型断言用来明确的告诉 TypeScript 值的详细类型，合理使用能减少我们的工作量。

比如一个变量并没有初始值，但是我们知道它的类型信息（它可能是从后端返回）有什么办法既能正确推导类型信息，又能正常运行了？有一种网上的推荐方式是设置初始值，然后使用 typeof 拿到类型（可能会给其他地方用）。然而我可能比较懒，不喜欢设置初始值，这时候使用类型断言可以解决这类问题：

```ts
interface User {
   name: string;
   age: number;
}

export default class NewRoom extends Vue {
   private user = {} as User;
}
```

在设置初始化时，添加断言，我们就无须添加初始值，编辑器也能正常的给予代码提示了。如果 user 属性很多，这样就能解决大量不必要的工作了，定义的 interface 也能给其他地方使用。

## 枚举类型

枚举类型分为数字类型与字符串类型，其中数字类型的枚举可以当标志使用：

```ts
// https://github.com/Microsoft/TypeScript/blob/master/src/compiler/types.ts#L3859
export const enum ObjectFlags {
   Class = 1 << 0, // Class
   Interface = 1 << 1, // Interface
   Reference = 1 << 2, // Generic type reference
   Tuple = 1 << 3, // Synthesized generic tuple type
   Anonymous = 1 << 4, // Anonymous
   Mapped = 1 << 5, // Mapped
   Instantiated = 1 << 6, // Instantiated anonymous or mapped type
   ObjectLiteral = 1 << 7, // Originates in an object literal
   EvolvingArray = 1 << 8, // Evolving array type
   ObjectLiteralPatternWithComputedProperties = 1 << 9, // Object literal pattern with computed properties
   ContainsSpread = 1 << 10, // Object literal contains spread operation
   ReverseMapped = 1 << 11, // Object contains a property from a reverse-mapped type
   JsxAttributes = 1 << 12, // Jsx attributes type
   MarkerType = 1 << 13, // Marker type used for variance probing
   JSLiteral = 1 << 14, // Object type declared in JS - disables errors on read/write of nonexisting members
   ClassOrInterface = Class | Interface
}
```

在 TypeScript src/compiler/types 源码里，定义了大量如上所示的基于数字类型的常量枚举。它们是一种有效存储和表示布尔值集合的方法。

在 《深入理解 TypeScript》 中有一个使用例子：

```ts
enum AnimalFlags {
   None = 0,
   HasClaws = 1 << 0,
   CanFly = 1 << 1,
   HasClawsOrCanFly = HasClaws | CanFly
}

interface Animal {
   flags: AnimalFlags;
   [key: string]: any;
}

function printAnimalAbilities(animal: Animal) {
   var animalFlags = animal.flags;
   if (animalFlags & AnimalFlags.HasClaws) {
      console.log('animal has claws');
   }
   if (animalFlags & AnimalFlags.CanFly) {
      console.log('animal can fly');
   }
   if (animalFlags == AnimalFlags.None) {
      console.log('nothing');
   }
}

var animal = { flags: AnimalFlags.None };
printAnimalAbilities(animal); // nothing
animal.flags |= AnimalFlags.HasClaws;
printAnimalAbilities(animal); // animal has claws
animal.flags &= ~AnimalFlags.HasClaws;
printAnimalAbilities(animal); // nothing
animal.flags |= AnimalFlags.HasClaws | AnimalFlags.CanFly;
printAnimalAbilities(animal); // animal has claws, animal can fly
```

上例代码中 |= 用来添加一个标志，&= 和 ~ 用来删除标志，| 用来合并标志。

## Decorator

Decorator 早已不是什么新鲜事物，在 TypeScript 1.5 + 的版本中，我们可以利用内置类型 ClassDecorator、PropertyDecorator、MethodDecorator 与 ParameterDecorator 更快书写 Decorator，如 MethodDecorator：

```ts
declare type MethodDecorator = <T>(
   target: Object,
   propertyKey: string | symbol,
   descriptor: TypedPropertyDescriptor<T>
) => TypedPropertyDescriptor<T> | void;
```

使用时，只需在相应地方加上类型注解，匿名函数的参数类型也就会被自动推导出来了。

```ts
function methodDecorator(): MethodDecorator {
   return (target, key, descriptor) => {
      // ...
   };
}
```

值得一提的是，如果你在 Decorator 给目标类的 prototype 添加属性时，TypeScript 并不知道这些：

```ts
function testAble(): ClassDecorator {
   return (target) => {
      target.prototype.someValue = true;
   };
}

@testAble()
class SomeClass {}

const someClass = new SomeClass();

someClass.someValue(); // Error: Property 'someValue' does not exist on type 'SomeClass'.
```

这很常见，特别是当你想用 Decorator 来扩展一个类时。

GitHub 上有一个关于此问题的 issues，直至目前，也没有一个合适的方案实现它。其主要问题在于 TypeScript 并不知道目标类是否使用了 Decorator 以及 Decorator 的名称。从这个 issues 来看，建议的解决办法是使用 Mixin：

```ts
type Constructor<T> = new (...args: any[]) => T;

// mixin 函数的声明，需要实现
declare function mixin<T1, T2>(...MixIns: [Constructor<T1>, Constructor<T2>]): Constructor<T1 & T2>;

class MixInClass1 {
   mixinMethod1() {}
}

class MixInClass2 {
   mixinMethod2() {}
}

class Base extends mixin(MixInClass1, MixInClass2) {
   baseMethod() {}
}

const x = new Base();

x.baseMethod(); // OK
x.mixinMethod1(); // OK
x.mixinMethod2(); // OK
x.mixinMethod3(); // Error
```

当把大量的 JavaScript Decorator 重构为 Mixin 时，这无疑是一件让人头大的事情。

这有一些偏方，能让你顺利从 JavaScript 迁移至 TypeScript：

- 显式赋值断言修饰符，即是在类里，明确说明某些属性存在于类上：

   ```ts
   function testAble(): ClassDecorator {
      return (target) => {
         target.prototype.someValue = true;
      };
   }

   @testAble()
   class SomeClass {
      public someValue!: boolean;
   }

   const someClass = new SomeClass();
   someClass.someValue; // true
   ```

- 采用声明合并形式，单独定义一个 interface，把用 Decorator 扩展的属性的类型，放入 interface 中：

   ```ts
   interface SomeClass {
      someValue: boolean;
   }

   function testAble(): ClassDecorator {
      return (target) => {
         target.prototype.someValue = true;
      };
   }

   @testAble()
   class SomeClass {}

   const someClass = new SomeClass();
   someClass.someValue; // true
   ```

## Reflect Metadata

Reflect Metadata 是 ES7 的一个提案，它主要用来在声明的时候添加和读取元数据。TypeScript 在 1.5+ 的版本已经支持它，你只需要：

- npm i reflect-metadata --save。
- 在 tsconfig.json 里配置 emitDecoratorMetadata 选项。

它具有诸多使用场景。

### 获取类型信息

譬如在 vue-property-decorator 6.1 及其以下版本中，通过使用 Reflect.getMetadata API，Prop Decorator 能获取属性类型传至 Vue，简要代码如下：

```ts
function Prop(): PropertyDecorator {
   return (target, key: string) => {
      const type = Reflect.getMetadata('design:type', target, key);
      console.log(`${key} type: ${type.name}`);
      // other...
   };
}

class SomeClass {
   @Prop()
   public Aprop!: string;
}
```

运行代码可在控制台看到 Aprop type: string。除能获取属性类型外，通过 Reflect.getMetadata("design:paramtypes", target, key) 和 Reflect.getMetadata("design:returntype", target, key) 可以分别获取函数参数类型和返回值类型。

### 自定义 metadataKey

除能获取类型信息外，常用于自定义 metadataKey，并在合适的时机获取它的值，示例如下：

```ts
function classDecorator(): ClassDecorator {
   return (target) => {
      // 在类上定义元数据，key 为 `classMetaData`，value 为 `a`
      Reflect.defineMetadata('classMetaData', 'a', target);
   };
}

function methodDecorator(): MethodDecorator {
   return (target, key, descriptor) => {
      // 在类的原型属性 'someMethod' 上定义元数据，key 为 `methodMetaData`，value 为 `b`
      Reflect.defineMetadata('methodMetaData', 'b', target, key);
   };
}

@classDecorator()
class SomeClass {
   @methodDecorator()
   someMethod() {}
}

Reflect.getMetadata('classMetaData', SomeClass); // 'a'
Reflect.getMetadata('methodMetaData', new SomeClass(), 'someMethod'); // 'b'
```

### 用例

#### 控制反转和依赖注入

在 Angular 2+ 的版本中，控制反转与依赖注入便是基于此实现，现在，我们来实现一个简单版：

```ts
type Constructor<T = any> = new (...args: any[]) => T;

const Injectable = (): ClassDecorator => (target) => {};

class OtherService {
   a = 1;
}

@Injectable()
class TestService {
   constructor(public readonly otherService: OtherService) {}

   testMethod() {
      console.log(this.otherService.a);
   }
}

const Factory = <T>(target: Constructor<T>): T => {
   // 获取所有注入的服务
   const providers = Reflect.getMetadata('design:paramtypes', target); // [OtherService]
   const args = providers.map((provider: Constructor) => new provider());
   return new target(...args);
};

Factory(TestService).testMethod(); // 1
```

#### Controller 与 Get 的实现

如果你在使用 TypeScript 开发 Node 应用，相信你对 Controller、Get、POST 这些 Decorator，并不陌生：

```ts
@Controller('/test')
class SomeClass {
   @Get('/a')
   someGetMethod() {
      return 'hello world';
   }

   @Post('/b')
   somePostMethod() {}
}
```

它们也是基于 Reflect Metadata 实现，不同的是，这次我们将 metadataKey 定义在 descriptor 的 value 上（稍后解释），简单实现如下：

```ts
const METHOD_METADATA = 'method'；
const PATH_METADATA = 'path'；

const Controller = (path: string): ClassDecorator => {
  return target => {
    Reflect.defineMetadata(PATH_METADATA, path, target);
  }
}

const createMappingDecorator = (method: string) => (path: string): MethodDecorator => {
  return (target, key, descriptor) => {
    Reflect.defineMetadata(PATH_METADATA, path, descriptor.value);
    Reflect.defineMetadata(METHOD_METADATA, method, descriptor.value);
  }
}

const Get = createMappingDecorator('GET');
const Post = createMappingDecorator('POST');
```

接着，创建一个函数，映射出 route：

```ts
function mapRoute(instance: Object) {
   const prototype = Object.getPrototypeOf(instance);

   // 筛选出类的 methodName
   const methodsNames = Object.getOwnPropertyNames(prototype).filter(
      (item) => !isConstructor(item) && isFunction(prototype[item])
   );
   return methodsNames.map((methodName) => {
      const fn = prototype[methodName];

      // 取出定义的 metadata
      const route = Reflect.getMetadata(PATH_METADATA, fn);
      const method = Reflect.getMetadata(METHOD_METADATA, fn);
      return {
         route,
         method,
         fn,
         methodName
      };
   });
}
```

我们可以得到一些有用的信息：

```ts
Reflect.getMetadata(PATH_METADATA, SomeClass); // '/test'

mapRoute(new SomeClass());

/**
 * [{
 *    route: '/a',
 *    method: 'GET',
 *    fn: someGetMethod() { ... },
 *    methodName: 'someGetMethod'
 *  },{
 *    route: '/b',
 *    method: 'POST',
 *    fn: somePostMethod() { ... },
 *    methodName: 'somePostMethod'
 * }]
 *
 */
```

最后，只需把 route 相关信息绑在 express 或者 koa 上就 ok 了。

至于为什么要定义在 descriptor 的 value 上，我们希望 mapRoute 函数的参数是一个实例，而非 class 本身（控制反转）。

## 数组与元组

创建一个数组很简单：

```ts
const arr = [1];
```

此时 TypeScript 将会推断 arr 类型为 number[]：

```ts
arr.push('1'); // Error
```

当数组元素具有其它类型时，可以通过类型注解的方式：

```ts
const arr: Array<string | number> = [1];

arr.push('1'); // OK
arr.push(true); // Error
```

或者你也可以通过可选元组的方式：

```ts
const arr: [number, string?] = [1]; // arr 的成员类型可以是: number, string, undefined
arr.push('1'); // OK
arr.push(true); // Error
```

使用元组形式，还能提供指定位置的类型检查：

```ts
arr[0] = '1'; // Error
arr[1] = 1; // Error
```

### 使用

通常，我们使用 Promise.all 并行发出多个请求：

```ts
interface A {
   name: string;
}

interface B {
   age: number;
}

const [{ data: a }, { data: b }] = await Promise.all([axios.get<A>('http://some.1'), axios.get<B>('http://some.2')]);
```

此时，TypeScript 能推出 a 的类型是 A, b 的类型是 B。

现在，稍作改变：当满足特定条件时，才发出第二个请求：

```ts
// 使用类型注解
const requestList: [Promise<AxiosResponse<A>>, Promise<AxiosResponse<B>>?] = [axios.get<A>('http://some.1')];
if (flag) {
   requestList[1] = axios.get<B>('http://some.2');
}
const [{ data: a }, response] = await Promise.all(requestList);
```

我们期望它会如预想时那样工作，可是事与愿违 Promise.all(requestList) 会出现类型兼容性的报错，在这个 Issues 里，描述了相同的问题。

现在，你可以通过断言的方式，来让程序正常运作：

```ts
const requestList: any[] = [axios.get<A>('http://some.1')]; // 设置为 any[] 类型
if (flag) {
   requestList[1] = axios.get<B>('http://some.2');
}
const [{ data: a }, response] = (await Promise.all(requestList)) as [AxiosResponse<A>, AxiosResponse<B>?]; // 类型安全
```

## 字面量类型

在 JavaScript 基础上，TypeScript 扩展了一系列字面量类型，用来确保类型的准确性。

如创建一个字符串字面量：

```ts
const a = 'hello'; // a 的类型是 'hello'
a = 'world'; // Error
```

或者你也可以：

```ts
let a: 'hello' = 'hello'; // a 的类型是 'hello'
a = 'world'; // Error
```

其它数据类型与此相似。

你也可以定义交叉类型与联合类型的字面量：

```ts
interface A {
   name: string;
}

interface B {
   name: string;
   age: number;
}

type C = A | B;
type D = A & B;
```

### 对象字面量类型

对于对象字面量的类型，TypeScript 有一个被称之为 `Freshness` 的概念，它也被称为更严格的对象字面量检查，如下例子：

```ts
let someThing: { name: string };
someThing = { name: 'hello' }; // ok
someThing = { name: 'hello', age: 123 }; // Error, 对象字面量只能指定已知属性, { name: string } 类型中不存在 age 属性

let otherThing = { name: 'hello', age: 123 };
someThing = otherThing; // ok
```

TypeScript 认为创建的每个对象字面量都是 `fresh` 状态；当一个 `fresh` 对象字面量赋值给一个变量时，如果对象的类型与变量类型不兼容时，会出现报错（如上例子中 `someThine = { name: 'hello', age: 123 };` 的错误）；当对象字面量的类型变宽，对象字面量的 `fresh` 状态会消失（如上例子中 `someThing = otherThing;` 赋值以后 someThing 的类型变宽）。

一个更实际的用例如下：

```ts
function logName(something: { name: string }) {
   console.log(something.name);
}

const obj = {
   name: 'matt',
   job: 'being awesome'
};

logName(obj); // ok
logName({ name: 'matt' }); // ok
logName({ nama: 'matt' }); // Error: nama 属性在 { name: string } 属性中不存在。
logName({ name: 'matt', job: 'being awesome' }); // Error: 对象字面量只能指定已知属性，`job` 属性在这里并不存在。
```

基本原理与上文中相似，当想用更严格的类型检查时，可以传一个具有 fresh 状态的对象字面量（如 `logName({ name: 'matt', job: 'being awesome' });`）。当你想多传一些属性至函数，可以将对象字面量赋值至一个新变量，然后再传至函数（如 `logName(obj)`）。或者你也可以通过给函数形参添加多余类型的方式 `function logName(someThing: { name: string; [key: string]: string })`。

## 用 Decorator 限制类型

Decorator 可用于限制类方法的返回类型，如下所示：

```ts
const TestDecorator = () => {
   return (
      target: Object,
      key: string | symbol,
      descriptor: TypedPropertyDescriptor<() => number> // 函数返回值必须是 number
   ) => {
      // 其他代码
   };
};

class Test {
   @TestDecorator()
   testMethod() {
      return '123'; // Error: Type 'string' is not assignable to type 'number'
   }
}
```

你也可以用泛型让 TestDecorator 的传入参数类型与 testMethod 的返回参数类型兼容：

```ts
const TestDecorator = <T>(para: T) => {
   return (target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<() => T>) => {
      // 其他代码
   };
};

class Test {
   @TestDecorator('hello')
   testMethod() {
      return 123; // Error: Type 'number' is not assignable to type 'string'
   }
}
```

## 泛型的类型推断

在定义泛型后，有两种方式使用，一种是传入泛型类型，另一种使用类型推断，即编译器根据其他参数类型来推断泛型类型。简单示例如下：

```ts
declare function fn<T>(arg: T): T; // 定义一个泛型函数

const fn1 = fn<string>('hello'); // 第一种方式，传入泛型类型 string
const fn2 = fn(1); // 第二种方式，从参数 arg 传入的类型 number，来推断出泛型 T 的类型是 number
```

它通常与映射类型一起使用，用来实现一些比较复杂的功能。

### Vue Type 简单实现

如下一个例子：

```ts
type Options<T> = {
   [P in keyof T]: T[P];
};

declare function test<T>(o: Options<T>): T;

test({ name: 'Hello' }).name; // string
```

test 函数将传入参数的所有属性取出来，现在我们来一步一步加工，实现想要的功能。

首先，更改传入参数的形式，由 `{ name: 'Hello' }` 的形式变更为 `{ data: { name: 'Hello' } }`，调用函数的返回值类型不变，即 `test({ data: { name: 'Hello' } }).name` 的值也是 string 类型。

这并不复杂，这只需要把传入参数的 data 类型设置为 T 即可：

```ts
declare function test<T>(o: { data: Options<T> }): T;

test({ data: { name: 'Hello' } }).name; // string
```

当 data 对象里，含有函数时，它也能运作：

```ts
const param = {
   data: {
      name: 'Hello',
      someMethod() {
         return 'hello world';
      }
   }
};

test(param).someMethod(); // string
```

接着，考虑一种特殊的函数情景，像 Vue 中 Computed 一样，不调用函数，也能取出函数的返回值类型。现在传入参数的形式变更为：

```ts
const param = {
   data: {
      name: 'Hello'
   },
   computed: {
      age() {
         return 20;
      }
   }
};
```

一个函数的类型可以简单的看成是 `() => T` 的形式，对象中的方法类型，可以看成 `a: () => T` 的形式，在反向推导时（由函数返回值，来推断类型 a 的类型）可以利用它，需要添加一个映射类型 `Computed<T>`，用来处理 computed 里的函数：

```ts
type Options<T> = {
   [P in keyof T]: T[P];
};

type Computed<T> = {
   [P in keyof T]: () => T[P];
};

interface Params<T, M> {
   data: Options<T>;
   computed: Computed<M>;
}

declare function test<T, M>(o: Params<T, M>): T & M;

const param = {
   data: {
      name: 'Hello'
   },
   computed: {
      age() {
         return 20;
      }
   }
};

test(param).name; // string
test(param).age; // number
```

最后，结合巧用 ThisType 映射类型，可以轻松的实现在 computed age 方法下访问 data 中的数据：

```ts
type Options<T> = {
   [P in keyof T]: T[P];
};

type Computed<T> = {
   [P in keyof T]: () => T[P];
};

interface Params<T, M> {
   data: Options<T>;
   computed: Computed<M>;
}

declare function test<T, M>(o: Params<T, M>): T & M;

const param = {
   data: {
      name: 'Hello'
   },
   computed: {
      age() {
         return 20;
      }
   }
};

test(param).name; // string
test(param).age; // number
```

### 扁平数组构建树形结构

扁平数组构建树形结构即是将一组扁平数组，根据 parent_id（或者是其他）转换成树形结构：

```ts
// 转换前数据
const arr = [
   { id: 1, parentId: 0, name: 'test1' },
   { id: 2, parentId: 1, name: 'test2' },
   { id: 3, parentId: 0, name: 'test3' }
];

// 转化后
[
   {
      id: 1,
      parentId: 0,
      name: 'test1',
      children: [
         {
            id: 2,
            parentId: 1,
            name: 'test2',
            children: []
         }
      ]
   },
   {
      id: 3,
      parentId: 0,
      name: 'test3',
      children: []
   }
];
```

如果 children 字段名字不变，函数的类型并不难写，它大概是如下样子：

```ts
interface Item {
   id: number;
   parentId: number;
   name: string;
}

type TreeItem = Item & { children: TreeItem[] | [] };

declare function listToTree(list: Item[]): TreeItem[];

listToTree(arr).forEach((i) => i.children); // ok
```

但是在很多时候，children 字段的名字并不固定，而是从参数中传进来：

```ts
const options = {
   childrenKey: 'childrenList'
};

listToTree(arr, options);
```

此时 children 字段名称应该为 childrenList：

```ts
[
   {
      id: 1,
      parentId: 0,
      name: 'test1',
      childrenList: [{ id: 2, parentId: 1, name: 'test2', childrenList: [] }]
   },
   {
      id: 3,
      parentId: 0,
      name: 'test3',
      childrenList: []
   }
];
```

实现的思路大致是前文所说的利用泛型的类型推断，从传入的 options 参数中，得到 childrenKey 的类型，然后再传给 TreeItem，如下：

```ts
interface Options<T extends string> {
   // 限制为 string 类型
   childrenKey: T;
}

declare function listToTree<T extends string = 'children'>(list: Item[], options: Options<T>): TreeItem<T>[];
```

当 options 为 `{ childrenKey: 'childrenList' }` 时，T 能被正确推导出为 childrenList，接着只需要在 TreeItem 中，把 children 修改为传入的 T 即可：

```ts
interface Item {
   id: number;
   parentId: number;
   name: string;
}

interface Options<T extends string> {
   childrenKey: T;
}

type TreeItem<T extends string> = Item & { [key in T]: TreeItem<T>[] | [] };

declare function listToTree<T extends string = 'children'>(list: Item[], options: Options<T>): TreeItem<T>[];

listToTree(arr, { childrenKey: 'childrenList' }).forEach((i) => i.childrenList); // ok
```

有一点局限性，由于对象字面量的 Fresh 的影响，当 options 不是以对象字面量的形式传入时，需要给它断言：

```ts
const options = {
   childrenKey: 'childrenList' as 'childrenList'
};

listToTree(arr, options).forEach((i) => i.childrenList); // ok
```

## infer

infer 最早出现在此 PR 中，表示在 extends 条件语句中待推断的类型变量。

简单示例如下：

```ts
type ParamType<T> = T extends (param: infer P) => any ? P : T;
```

在这个条件语句 `T extends (param: infer P) => any ? P : T` 中，`infer P` 表示待推断的函数参数。

整句表示为：如果 T 能赋值给 `(param: infer P) => any`，则结果是 `(param: infer P) => any` 类型中的参数 P，否则返回为 T。

```ts
interface User {
   name: string;
   age: number;
}

type Func = (user: User) => void;

type Param = ParamType<Func>; // Param = User
type AA = ParamType<string>; // string
```

### 内置类型

在 2.8 版本中，TypeScript 内置了一些与 infer 有关的映射类型：

- 用于提取函数类型的返回值类型：

```ts
type ReturnType<T> = T extends (...args: any[]) => infer P ? P : any;
```

相比于文章开始给出的示例，`ReturnType<T>` 只是将 infer P 从参数位置移动到返回值位置，因此此时 P 即是表示待推断的返回值类型。

```ts
type Func = () => User;
type Test = ReturnType<Func>; // Test = User
```

- 用于提取构造函数中参数（实例）类型：

一个构造函数可以使用 new 来实例化，因此它的类型通常表示如下：

```ts
type Constructor = new (...args: any[]) => any;
```

当 infer 用于构造函数类型中，可用于参数位置 `new (...args: infer P) => any;` 和返回值位置 `new (...args: any[]) => infer P;`。

因此就内置如下两个映射类型：

```ts
// 获取参数类型
type ConstructorParameters<T extends new (...args: any[]) => any> = T extends new (...args: infer P) => any ? P : never;

// 获取实例类型
type InstanceType<T extends new (...args: any[]) => any> = T extends new (...args: any[]) => infer R ? R : any;

class TestClass {
   constructor(public name: string, public string: number) {}
}

type Params = ConstructorParameters<typeof TestClass>; // [string, number]

type Instance = InstanceType<typeof TestClass>; // TestClass
```

### 一些用例

至此，相信你已经对 infer 已有基本了解，我们来看看一些使用它的「骚操作」：

- tuple 转 union ，如：`[string, number] -> string | number`

解答之前，我们需要了解 tuple 类型在一定条件下，是可以赋值给数组类型：

```ts
type TTuple = [string, number];
type TArray = Array<string | number>;

type Res = TTuple extends TArray ? true : false; // true
type ResO = TArray extends TTuple ? true : false; // false
```

因此，在配合 infer 时，很容易做到：

```ts
type ElementOf<T> = T extends Array<infer E> ? E : never;

type TTuple = [string, number];

type ToUnion = ElementOf<TTuple>; // string | number
```

在 stackoverflow 上看到另一种解法，比较简（牛）单（逼）：

```ts
type TTuple = [string, number];
type Res = TTuple[number]; // string | number
```

- union 转 intersection，如：`string | number -> string & number`

这个可能要稍微麻烦一点，需要 infer 配合 `Distributive conditional types` 使用。

`Distributive conditional types` 是由 `naked type parameter` 构成的条件类型。而 `naked type parameter` 表示没有被 Wrapped 的类型（如：`Array<T>`、`[T]`、`Promise<T>` 等都是不是 `naked type parameter`）。`Distributive conditional types` 主要用于拆分 extends 左边部分的联合类型，举个例子：在条件类型 `T extends U ? X : Y` 中，当 T 是 `A | B` 时，会拆分成 `A extends U ? X : Y | B extends U ? X : Y`；

有了这个前提，再利用在逆变位置上，同一类型变量的多个候选类型将会被推断为交叉类型的特性，即

```ts
type Bar<T> = T extends { a: (x: infer U) => void; b: (x: infer U) => void } ? U : never;
type T20 = Bar<{ a: (x: string) => void; b: (x: string) => void }>; // string
type T21 = Bar<{ a: (x: string) => void; b: (x: number) => void }>; // string & number
```

因此，综合以上几点，我们可以得到在 stackoverflow 上的一个答案：

```ts
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

type Result = UnionToIntersection<string | number>; // string & number
```

当传入 `string | number` 时：

- 第一步：`(U extends any ? (k: U) => void : never)` 会把 union 拆分成 `(string extends any ? (k: string) => void : never) | (number extends any ? (k: number)=> void : never)`，即是得到 `(k: string) => void | (k: number) => void`；

- 第二步：`(k: string) => void | (k: number) => void extends ((k: infer I) => void) ? I : never`，根据上文可以推断出 I 为 string & number。

### LeetCode 的一道 TypeScript 面试题

前段时间在 GitHub 上发现一道来自 LeetCode TypeScript 的面试题，比较有意思，题目的大致意思是：

假设有一个这样的类型（原题中给出的是类，这里简化为 interface）：

```ts
interface Module {
   count: number;
   message: string;
   asyncMethod<T, U>(input: Promise<T>): Promise<Action<U>>;
   syncMethod<T, U>(action: Action<T>): Action<U>;
}
```

在经过 Connect 函数之后，返回值类型为

```ts
type Result {
  asyncMethod<T, U>(input: T): Action<U>;
  syncMethod<T, U>(action: T): Action<U>;
}
```

其中 `Action<T>` 的定义为：

```ts
interface Action<T> {
   payload?: T;
   type: string;
}
```

这里主要考察两点

- 挑选出函数
- 条件类型 + 此篇文章所提及的 infer

接下来就比较简单了，主要是利用条件类型 + infer，如果函数可以赋值给 `asyncMethod<T, U>(input: Promise<T>): Promise<Action<U>>`，则取值为 `asyncMethod<T, U>(input: T): Action<U>`

```ts
interface Action<T> {
   payload?: T;
   type: string;
}

interface Module {
   count: number;
   message: string;
   asyncMethod<T, U>(input: Promise<T>): Promise<Action<U>>;
   syncMethod<T, U>(action: Action<T>): Action<U>;
}

type asyncMethod<T, U> = (input: Promise<T>) => Promise<Action<U>>; // 转换前
type asyncMethodConnect<T, U> = (input: T) => Action<U>; // 转换后
type syncMethod<T, U> = (action: Action<T>) => Action<U>; // 转换前
type syncMethodConnect<T, U> = (action: T) => Action<U>; // 转换后

type methodsPick<T> = {
   [P in keyof T]: T[P] extends Function ? P : never;
}[keyof T];

type ModuleMethodsConnect<T> = T extends asyncMethod<infer U, infer V>
   ? asyncMethodConnect<U, V>
   : T extends syncMethod<infer U, infer V>
   ? syncMethodConnect<U, V>
   : never;

type ModuleMethods = methodsPick<Module>;

type Connect = (
   module: Module
) => {
   [T in ModuleMethods]: ModuleMethodsConnect<Module[T]>;
};
```

# 实战

## 参数简化

通过一个简单的功能把

```ts
distribute({
   type: 'LOGIN',
   email: string
});
```

这样的函数调用方式给简化为：

```ts
distribute('LOGIN', {
   email: string
});
```

### 分布条件类型的真实用例

举一个类似 redux 中的 dispatch 的例子。

首先，我们有一个联合类型 Action，用来表示所有可以被 dispatch 接受的参数类型：

```ts
type Action =
   | {
        type: 'INIT';
     }
   | {
        type: 'SYNC';
     }
   | {
        type: 'LOG_IN';
        emailAddress: string;
     }
   | {
        type: 'LOG_IN_SUCCESS';
        accessToken: string;
     };
```

然后我们定义这个 dispatch 方法：

```ts
declare function dispatch(action: Action): void;

// ok
dispatch({
   type: 'INIT'
});

// ok
dispatch({
   type: 'LOG_IN',
   emailAddress: 'david.sheldrick@artsy.net'
});

// ok
dispatch({
   type: 'LOG_IN_SUCCESS',
   accessToken: '038fh239h923908h'
});
```

这个 API 是类型安全的，当 TS 识别到 type 为 LOG_IN 的时候，它会要求你在参数中传入 emailAddress 这个参数，这样才能完全满足联合类型中的其中一项。

等等，我们好像可以让这个 api 变得更简单一点：

```ts
dispatch('LOG_IN_SUCCESS', {
   accessToken: '038fh239h923908h'
});
```

### 参数简化实现

首先，利用方括号选择出 Action 中的所有 type，这个技巧很有用。

```ts
type ActionType = Action['type'];
// => "INIT" | "SYNC" | "LOG_IN" | "LOG_IN_SUCCESS"
```

但是第二个参数的类型取决于第一个参数，我们可以使用类型变量来对该依赖关系建模。

```ts
declare function dispatch<T extends ActionType>(type: T, args: ExtractActionParameters<Action, T>): void;
```

注意，这里就用到了 extends 语法，规定了我们的入参 type 必须是 ActionType 中一部分。

注意这里的第二个参数 args 用 `ExtractActionParameters<Action, T>` 这个类型来把 type 和 args 做了关联

来看看 ExtractActionParameters 是如何实现的：

```ts
type ExtractActionParameters<A, T> = A extends { type: T } ? A : never;
```

在这次实战中，我们第一次运用到了条件类型，`ExtractActionParameters<Action, T>` 会按照我们上文提到的分布条件类型，把 Action 中的 4 项依次去和 `{ type: T }` 进行比对，找出符合的那一项。

来看看如何使用它：

```ts
type Test = ExtractActionParameters<Action, 'LOG_IN'>;
// => { type: "LOG_IN", emailAddress: string }
```

这样就筛选出了 type 匹配的一项。

接下来我们要把 type 去掉，第一个参数已经是 type 了，因此我们不想再额外声明 type 了。

```ts
// 把类型中key为"type"去掉
type ExcludeTypeField<A> = { [K in Exclude<keyof A, 'type'>]: A[K] };
```

这里利用了 keyof 语法，并且利用内置类型 Exclude 把 type 这个 key 去掉，因此只会留下额外的参数。

```ts
type Test = ExcludeTypeField<{ type: 'LOG_IN'; emailAddress: string }>;
// { emailAddress: string }
```

然后用它来剔除参数中的 type

```ts
// 把参数对象中的type去掉
type ExtractActionParametersWithoutType<A, T> = ExcludeTypeField<ExtractActionParameters<A, T>>;
```

```ts
declare function dispatch<T extends ActionType>(type: T, args: ExtractActionParametersWithoutType<Action, T>): void;
```

到此为止，我们就可以实现上文中提到的参数简化功能：

```ts
// ok
dispatch({
   type: 'LOG_IN',
   emailAddress: 'david.sheldrick@artsy.net'
});
```

### 利用重载进一步优化

到了这一步为止，虽然带参数的 Action 可以完美支持了，但是对于 "INIT" 这种不需要传参的 Action，我们依然要写下面这样代码：

```ts
dispatch('INIT', {});
```

这肯定是不能接受的！所以我们要利用 TypeScript 的函数重载功能。

```ts
// 简单参数类型
function dispatch<T extends SimpleActionType>(type: T): void;

// 复杂参数类型
function dispatch<T extends ComplexActionType>(type: T, args: ExtractActionParametersWithoutType<Action, T>): void;

// 实现
function dispatch(arg: any, payload?: any) {}
```

那么关键点就在于 SimpleActionType 和 ComplexActionType 要如何实现了

SimpleActionType 顾名思义就是除了 type 以外不需要额外参数的 Action 类型

```ts
type SimpleAction = ExtractSimpleAction<Action>;
```

我们如何定义这个 ExtractSimpleAction 条件类型？如果我们从这个 Action 中删除 type 字段，并且结果是一个空的接口，那么这就是一个 SimpleAction，所以我们可能会凭直觉写出这样的代码：

```ts
type ExtractSimpleAction<A> = ExcludeTypeField<A> extends {} ? A : never;
```

但这样是行不通的，几乎所有的类型都可以 `extends {}`，因为 `{}` 太宽泛了。

我们应该反过来写：

```ts
type ExtractSimpleAction<A> = {} extends ExcludeTypeField<A> ? A : never;
```

现在如果 `ExcludeTypeField <A>` 为空，则 extends 表达式为 true，否则为 false。

但这仍然行不通！因为分布条件类型仅在 extends 关键字的前面是类型变量时发生。

分布条件类型仅发生在如下场景：

```ts
type Blah<Var> = Var extends Whatever ? A : B;
```

而不是：

```ts
type Blah<Var> = Foo<Var> extends Whatever ? A : B;
type Blah<Var> = Whatever extends Var ? A : B;
```

但是我们可以通过一些小技巧绕过这个限制：

```ts
type ExtractSimpleAction<A> = A extends any ? ({} extends ExcludeTypeField<A> ? A : never) : never;
```

`A extends any` 是一定成立的，这只是用来绕过 ts 对于分布条件类型的限制，没错啊，我们的 A 确实是在 extends 的前面了，就是骗你 TS，这里是分布条件类型。

而我们真正想要做的条件判断被放在了中间，因此 Action 联合类型中的每一项又能够分布的去匹配了。

那么我们就可以简单的筛选出所有不需要额外参数的 type

```ts
type SimpleAction = ExtractSimpleAction<Action>;
type SimpleActionType = SimpleAction['type'];
```

再利用 Exclude 取反，找到复杂类型：

type ComplexActionType = Exclude<ActionType, SimpleActionType>

到此为止，我们所需要的功能就完美实现了：

```ts
// 简单参数类型
function dispatch<T extends SimpleActionType>(type: T): void;
// 复杂参数类型
function dispatch<T extends ComplexActionType>(type: T, args: ExtractActionParameters<Action, T>): void;
// 实现
function dispatch(arg: any, payload?: any) {}

// ok
dispatch('SYNC');

// ok
dispatch({
   type: 'LOG_IN',
   emailAddress: 'david.sheldrick@artsy.net'
});
```

### 完整代码

```ts
type Action =
   | {
        type: 'INIT';
     }
   | {
        type: 'SYNC';
     }
   | {
        type: 'LOG_IN';
        emailAddress: string;
     }
   | {
        type: 'LOG_IN_SUCCESS';
        accessToken: string;
     };

// 用类型查询查出 Action 中所有 type 的联合类型
type ActionType = Action['type'];

// 把类型中 key 为 type 去掉
type ExcludeTypeField<A> = { [K in Exclude<keyof A, 'type'>]: A[K] };

type ExtractActionParameters<A, T> = A extends { type: T } ? A : never;

// 把参数对象中的 type 去掉
// Extract<A, { type: T } 会挑选出能 extend { type: T } 这个结构的 Action 中的类型
type ExtractActionParametersWithoutType<A, T> = ExcludeTypeField<ExtractActionParameters<A, T>>;

type ExtractSimpleAction<A> = A extends any ? ({} extends ExcludeTypeField<A> ? A : never) : never;

type SimpleActionType = ExtractSimpleAction<Action>['type'];
type ComplexActionType = Exclude<ActionType, SimpleActionType>;

// 简单参数类型
function dispatch<T extends SimpleActionType>(type: T): void;
// 复杂参数类型
function dispatch<T extends ComplexActionType>(type: T, args: ExtractActionParametersWithoutType<Action, T>): void;
// 实现
function dispatch(arg: any, payload?: any) {}

dispatch('SYNC');

dispatch('LOG_IN', {
   emailAddress: 'ssh@qq.com'
});
```

## Ref 类型从零实现

```ts
const count = ref(ref(ref(ref(2))));
```

需要支持嵌套后解包，最后只会剩下 { value: number } 这个类型。

### 泛型的反向推导

泛型的正向用法很多人都知道了。

```ts
type Value<T> = T;

type NumberValue = Value<number>;
```

这样，NumberValue 解析出的类型就是 number，其实就类似于类型系统里的传参。

那么反向推导呢？

```ts
function create<T>(val: T): T;

let num: number;

const c = create(num);
```

这里泛型没有传入，居然也能推断出 value 的类型是 number。

因为 `create<T>` 这里的泛型 T 被分配给了传入的参数 `value: T`，然后又用这个 T 直接作为返回的类型，

简单来说，这里的三个 T 被关联起来了，并且在传入 create(2) 的那一刻，这个 T 被统一推断成了 number。

```ts
function create<2>(value: 2): 2
```

### 索引签名

假设我们有一个这样的类型：

```ts
type Test = {
   foo: number;
   bar: string;
};

type N = Test['foo']; // number
```

可以通过类似 JavaScript 中的对象属性查找的语法来找出对应的类型。

### 条件类型

假设我们有一个这样的类型：

```ts
type IsNumber<T> = T extends number ? 'yes' : 'no';

type A = IsNumber<2>; // yes
type B = isNumber<'3'>; // no
```

这就是一个典型的条件类型，用 extends 关键字配合三元运算符来判断传入的泛型是否可分配给 extends 后面的类型。

同时也支持多层的三元运算符（后面会用到）：

```ts
type TypeName<T> = T extends string ? 'string' : T extends boolean ? 'boolean' : 'object';

type T0 = TypeName<string>; // "string"
type T1 = TypeName<'a'>; // "string"
type T2 = TypeName<true>; // "boolean"
```

### keyof

keyof 操作符是 TS 中用来获取对象的 key 值集合的，比如：

```ts
type Obj = {
   foo: number;
   bar: string;
};

type Keys = keyof Obj; // "foo" | "bar"
```

这样就轻松获取到了对象 key 值的联合类型："foo" | "bar"。

它也可以用在遍历中：

```ts
type Obj = {
   foo: number;
   bar: string;
};

type Copy = {
   [K in keyof Obj]: Obj[K];
};

// Copy 得到和 Obj 一模一样的类型
```

可以看出，遍历的过程中右侧也可以通过索引直接访问到原类型 Obj 中对应 key 的类型。

### infer

这是一个比较难的点，文档中对它的描述是条件类型中的类型推断。

它的出现使得 ReturnType、 Parameters 等一众工具类型的支持都成为可能，是 TypeScript 进阶必须掌握的一个知识点了。

注意前置条件，它一定是出现在条件类型中的。

```ts
type Get<T> = T extends infer R ? R : never;
```

注意，infer R 的位置代表了一个未知的类型，可以理解为在条件类型中给了它一个占位符，然后就可以在后面的三元运算符中使用它。

```ts
type T = Get<number>;

// 经过计算
type Get<number> = number extends infer number ? number : never;

// 得到
number;
```

它的使用非常灵活，它也可以出现在泛型位置：

```ts
type Unpack<T> = T extends Array<infer R> ? R : T;
```

```ts
type NumArr = Array<number>
type U = Unpack<NumArr>

// 经过计算
type Unpack<Array<number>> = Array<number> extends Array<infer R> ? R : T

// 得到
number
```

仔细看看，是不是有那么点感觉了，它就是对于 extends 后面未知的某些类型进行一个占位 infer R，后续就可以使用推断出来的 R 这个类型。
