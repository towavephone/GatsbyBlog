---
title: TypeScript 练手测试
date: 2021-11-24 16:36:17
path: /typescript-practice-test/
tags: 前端, TypeScript, ts, 练手测试
---

# 测试一

代码为什么会提示错误，应该如何解决这个问题？

```ts
type User = {
   id: number;
   kind: string;
};

function makeCustomer<T extends User>(u: T): T {
   // Error（TS 编译器版本：v4.4.2）
   // Type '{ id: number; kind: string; }' is not assignable to type 'T'.
   // '{ id: number; kind: string; }' is assignable to the constraint of type 'T',
   // but 'T' could be instantiated with a different subtype of constraint 'User'.
   return {
      id: u.id,
      kind: 'customer'
   };
}
```

## 我的解答

直接利用自动推导

```ts
type User = {
   id: number;
   kind: string;
};

function makeCustomer<T extends User>(u: T) {
   // Error（TS 编译器版本：v4.4.2）
   // Type '{ id: number; kind: string; }' is not assignable to type 'T'.
   // '{ id: number; kind: string; }' is assignable to the constraint of type 'T',
   // but 'T' could be instantiated with a different subtype of constraint 'User'.
   return {
      id: u.id,
      kind: 'customer'
   };
}
```

## 最佳解答一

T 类型兼容 User 类型

```ts
type User = {
   id: number;
   kind: string;
};

function makeCustomer<T extends User>(u: T): T {
   // Error（TS 编译器版本：v4.4.2）
   // Type '{ id: number; kind: string; }' is not assignable to type 'T'.
   // '{ id: number; kind: string; }' is assignable to the constraint of type 'T',
   // but 'T' could be instantiated with a different subtype of constraint 'User'.
   return {
      ...u, // 返回的类型是 User，而非 T，T 是 User 的子类型，约束条件更多，子类可以赋值给父类，反过来不行
      id: u.id,
      kind: 'customer'
   };
}
```

## 最佳解答二

返回值限制为 User 类型

```ts
type User = {
  id: number;
  kind: string;
};

function makeCustomer<T extends User>(u: T): ReturnMake<T, User> {
  // Error（TS 编译器版本：v4.4.2）
  // Type '{ id: number; kind: string; }' is not assignable to type 'T'.
  // '{ id: number; kind: string; }' is assignable to the constraint of type 'T',
  // but 'T' could be instantiated with a different subtype of constraint 'User'.
  return {
    id: u.id,
    kind: "customer",
  };
}

type ReturnMake<T extends User, U> = {
  [K in keyof U as K extends keyof T ? K : never]: U[K];
};
```

## 最佳解答三

断言处理

```ts
type User = {
   id: number;
   kind: string;
};

function makeCustomer<T extends User>(u: T): T {
   // Error（TS 编译器版本：v4.4.2）
   // Type '{ id: number; kind: string; }' is not assignable to type 'T'.
   // '{ id: number; kind: string; }' is assignable to the constraint of type 'T',
   // but 'T' could be instantiated with a different subtype of constraint 'User'.
   return {
      id: u.id,
      kind: 'customer'
   } as T;
}
```

## 最佳解答四

重定义类型

```ts
type User = {
   id: number;
   kind: string;
};

function makeCustomer<T extends User>(u: T): User {
   // Error（TS 编译器版本：v4.4.2）
   // Type '{ id: number; kind: string; }' is not assignable to type 'T'.
   // '{ id: number; kind: string; }' is assignable to the constraint of type 'T',
   // but 'T' could be instantiated with a different subtype of constraint 'User'.
   return {
      id: u.id,
      kind: 'customer'
   };
}
```

## 实现要点

T 只是约束于 User 类型，而不局限于 User 类型，所以返回为 T 类型不仅仅只有 id 和 kind，所以需要限制类型

# 测试二

本道题我们希望参数 a 和 b 的类型都是一致的，即 a 和 b 同时为 number 或 string 类型。当它们的类型不一致的值，TS 类型检查器能自动提示对应的错误信息。

```ts
function f(a: string | number, b: string | number) {
   if (typeof a === 'string') {
      return a + ':' + b; // no error but b can be number!
   } else {
      return a + b; // error as b can be number | string
   }
}

f(2, 3); // Ok
f(1, 'a'); // Error
f('a', 2); // Error
f('a', 'b'); // Ok
```

## 我的解答

函数重载

```ts
function f(a: string, b: string): string;
function f(a: number, b: number): number;

function f(a, b) {
   if (typeof a === 'string') {
      return a + ':' + b; // no error but b can be number!
   } else {
      return a + b; // error as b can be number | string
   }
}

f(2, 3); // Ok
f(1, 'a'); // Error
f('a', 2); // Error
f('a', 'b'); // Ok
```

## 最佳解答一

泛型实现

```ts
function f<T extends string | number>(a: T, b: T) {
   if (typeof a === 'string') {
      return a + ':' + b; // no error but b can be number!
   } else {
      return +a + +b; // error as b can be number | string
   }
}

f(2, 3); // Ok
f(1, 'a'); // Error
f('a', 2); // Error
f('a', 'b'); // Ok
```

## 最佳解答二

元祖固定类型

```ts
type F = <T extends string | number>(...args: [T, T]) => string | number;

const f: F = (a, b) => {
   if (typeof a === 'string') {
      return a + ':' + b; // no error but b can be number!
   } else {
      return +a + +b; // error as b can be number | string
   }
};

f(2, 3); // Ok
f(1, 'a'); // Error
f('a', 2); // Error
f('a', 'b'); // Ok
```

## 最佳解答三

```ts
type F = (...args: [string, string] | [number, number]) => string | number;

const f: F = (a, b) => {
   if (typeof a === 'string') {
      return a + ':' + b; // no error but b can be number!
   } else {
      return +a + +b; // error as b can be number | string
   }
};

f(2, 3); // Ok
f(1, 'a'); // Error
f('a', 2); // Error
f('a', 'b'); // Ok
```

# 测试三

如何定义一个 SetOptional 工具类型，支持把给定的 keys 对应的属性变成可选的？对应的使用示例如下所示：

```ts
type Foo = {
   a: number;
   b?: string;
   c: boolean;
};

// 测试用例
type SomeOptional = SetOptional<Foo, 'a' | 'b'>;

// type SomeOptional = {
//   a?: number; // 该属性已变成可选的
//   b?: string; // 保持不变
//   c: boolean;
// }
```

在实现 SetOptional 工具类型之后，如果你感兴趣，可以继续实现 SetRequired 工具类型，利用它可以把指定的 keys 对应的属性变成必填的。对应的使用示例如下所示：

```ts
type Foo = {
   a?: number;
   b: string;
   c?: boolean;
};

// 测试用例
type SomeRequired = SetRequired<Foo, 'b' | 'c'>;
// type SomeRequired = {
//   a?: number;
//   b: string; // 保持不变
//   c: boolean; // 该属性已变成必填
// }
```

## 最佳解答

```ts
type Simplify<T> = {
   [P in keyof T]: T[P];
};

type SetOptional<T extends object, K extends keyof T = keyof T> = Simplify<Omit<T, K> & Partial<Pick<T, K>>>;

type SetRequired<T extends object, K extends keyof T = keyof T> = Simplify<Omit<T, K> & Required<Pick<T, K>>>;
```

# 测试四

`Pick<T, K extends keyof T>` 的作用是将某个类型中的子属性挑出来，变成包含这个类型部分属性的子类型。

```ts
interface Todo {
   title: string;
   description: string;
   completed: boolean;
}

type TodoPreview = Pick<Todo, 'title' | 'completed'>;

const todo: TodoPreview = {
   title: 'Clean room',
   completed: false
};
```

那么如何定义一个 ConditionalPick 工具类型，支持根据指定的 Condition 条件来生成新的类型，对应的使用示例如下：

```ts
interface Example {
   a: string;
   b: string | number;
   c: () => void;
   d: {};
}

// 测试用例：
type StringKeysOnly = ConditionalPick<Example, string>;
//=> {a: string}
```

## 我的解答

```ts
interface Example {
   a: string;
   b: string | number;
   c: () => void;
   d: {};
}

type ConditionalPick<T, U> = {
   [K in keyof T]: T[K] extends U ? Pick<T, K> : never;
}[keyof T];

// 测试用例：
type StringKeysOnly = ConditionalPick<Example, string>;
//=> {a: string}
```

## 最佳解答

```ts
interface Example {
  a: string;
  b: string | number;
  c: () => void;
  d: {};
}

type ConditionalPick<T, U> = {
    [K in keyof T as (T[K] extends U ? K : never)]: T[K]
}

// 测试用例：
type StringKeysOnly = ConditionalPick<Example, string>;
//=> {a: string}
```

# 测试五

定义一个工具类型 AppendArgument，为已有的函数类型增加指定类型的参数，新增的参数名是 x，将作为新函数类型的第一个参数。具体的使用示例如下所示：

```ts
type Fn = (a: number, b: string) => number
type AppendArgument<F, A> = // 你的实现代码

type FinalFn = AppendArgument<Fn, boolean>
// (x: boolean, a: number, b: string) => number
```

## 我的解答

工具类型

```ts
type Fn = (a: number, b: string) => number;
type AppendArgument<F extends (...args: any) => any, A> = (x: A, ...args: Parameters<F>) => ReturnType<F>;

type FinalFn = AppendArgument<Fn, boolean>;
// (x: boolean, a: number, b: string) => number
```

## 最佳解答

infer 推断

```ts
type Fn = (a: number, b: string) => number;
type AppendArgument<F extends (...args: any) => any, A> = F extends (...args: infer T) => infer U
   ? (x: A, ...args: T) => U
   : never;

type FinalFn = AppendArgument<Fn, boolean>;
// (x: boolean, a: number, b: string) => number
```

# 测试六

定义一个 NativeFlat 工具类型，支持把数组类型拍平（扁平化）。具体的使用示例如下所示：

```ts
type NaiveFlat<T extends any[]> = // 你的实现代码

// 测试用例：
type NaiveResult = NaiveFlat<[['a'], ['b', 'c'], ['d']]>
// NaiveResult 的结果： "a" | "b" | "c" | "d"
```

在完成 NaiveFlat 工具类型之后，在继续实现 DeepFlat 工具类型，以支持多维数组类型：

```ts
type DeepFlat<T extends any[]> = unknown; // 你的实现代码

// 测试用例
type Deep = [['a'], ['b', 'c'], [['d']], [[[['e']]]]];
type DeepTestResult = DeepFlat<Deep>;
// DeepTestResult: "a" | "b" | "c" | "d" | "e"
```

## 最佳解答一

递归 + number 循环

```ts{3,13}
// T[P][number] 对数组里每个 index 进行循环，将 index 转换成key
type NaiveFlat<T extends any[]> = {
   [P in keyof T]: T[P] extends any[] ? T[P][number] : T[P];
}[number];

// 测试用例：
type NaiveResult = NaiveFlat<[['a'], ['b', 'c'], ['d']]>;
// NaiveResult 的结果： "a" | "b" | "c" | "d"

type Deep = [['a'], ['b', 'c'], [['d']], [[[['e']]]]];

type DeepFlat<T extends any[]> = {
   [K in keyof T]: T[K] extends any[] ? DeepFlat<T[K]> : T[K];
}[number];

type DeepTestResult = DeepFlat<Deep>;
// DeepTestResult: "a" | "b" | "c" | "d" | "e"
```

## 最佳解答二

infer 推断，这里的 `T[number] extends infer U` 可等价替换为 `T extends (infer U)[]`

```ts
type NaiveFlat<T extends any[]> = T[number] extends infer U // 你的实现代码
   ? U extends any[]
      ? U[number]
      : U
   : never;

// 测试用例：
type NaiveResult = NaiveFlat<[['a'], ['b', 'c'], ['d']]>;
// NaiveResult 的结果： "a" | "b" | "c" | "d"

type DeepFlat<T extends any[]> = T[number] extends infer U // 你的实现代码
   ? U extends any[]
      ? DeepFlat<U>
      : U
   : never;

// 测试用例
type Deep = [['a'], ['b', 'c'], [['d']], [[[['e']]]]];
type DeepTestResult = DeepFlat<Deep>;
// DeepTestResult: "a" | "b" | "c" | "d" | "e"
```

# 测试七

使用类型别名定义一个 EmptyObject 类型，使得该类型只允许空对象赋值：

```ts
type EmptyObject = {};

// 测试用例
const shouldPass: EmptyObject = {}; // 可以正常赋值
const shouldFail: EmptyObject = {
   // 将出现编译错误
   prop: 'TS'
};
```

在通过 EmptyObject 类型的测试用例检测后，我们来更改以下 takeSomeTypeOnly 函数的类型定义，让它的参数只允许严格 SomeType 类型的值。具体的使用示例如下所示：

```ts
type SomeType = {
   prop: string;
};

// 更改以下函数的类型定义，让它的参数只允许严格SomeType类型的值
function takeSomeTypeOnly(x: SomeType) {
   return x;
}

// 测试用例：
const x = { prop: 'a' };
takeSomeTypeOnly(x); // 可以正常调用

const y = { prop: 'a', addditionalProp: 'x' };
takeSomeTypeOnly(y); // 将出现编译错误
```

## 最佳解答

```ts
type EmptyObject = {
   [P in PropertyKey]: never;
};

// 测试用例
const shouldPass: EmptyObject = {}; // 可以正常赋值
const shouldFail: EmptyObject = {
   // 将出现编译错误
   prop: 'TS'
};

type SomeType = {
   prop: string;
};

// T2 的 key 必须存在于 T1 里面，且 T2 是 T1 的一部分
type StrictType<T1 extends T2, T2> = {
   [P in keyof T1]: P extends keyof T2 ? T1[P] : never;
};

// 更改以下函数的类型定义，让它的参数只允许严格 SomeType 类型的值
function takeSomeTypeOnly<T extends SomeType>(x: StrictType<T, SomeType>) {
   return x;
}

// 测试用例：
const x = { prop: 'a' };
takeSomeTypeOnly(x); // 可以正常调用

const y = { prop: 'a', addditionalProp: 'x' };
takeSomeTypeOnly(y); // 将出现编译错误
```

# 测试八

定义 NonEmptyArray 工具类型，用于确保数据非空数组。

```ts
type NonEmptyArray<T> = // 你的实现代码

const a: NonEmptyArray<string> = [] // 将出现编译错误
const b: NonEmptyArray<string> = ['Hello TS'] // 非空数据，正常使用
```

## 最佳解答一

```ts
type NonEmptyArray<T> = [T, ...T[]];
```

## 最佳解答二

```ts
type NonEmptyArray<T> = T[] & { 0: T };
```

# 测试九

定义一个 JoinStrArray 工具类型，用于根据指定的 Separator 分隔符，对字符串数组类型进行拼接。具体的使用示例如下所示：

```ts
type JoinStrArray<Arr extends string[], Separator extends string, Result extends string = ""> = // 你的实现代码

// 测试用例
type Names = ["Sem", "Lolo", "Kaquko"]
type NamesComma = JoinStrArray<Names, ","> // "Sem,Lolo,Kaquko"
type NamesSpace = JoinStrArray<Names, " "> // "Sem Lolo Kaquko"
type NamesStars = JoinStrArray<Names, "⭐️"> // "Sem⭐️Lolo⭐️Kaquko"
```

## 最佳解答

```ts
type JoinStrArray<
  Arr extends string[],
  Separator extends string
> = Arr extends [infer A, ...infer B]
  ? `${A extends string ? A : ''}${B extends [string, ...string[]]
      ? `${Separator}${JoinStrArray<B, Separator>}`
      : ''}`
  : '';

// 测试用例
type Names = ["Sem", "Lolo", "Kaquko"];
type NamesComma = JoinStrArray<Names, ",">; // "Sem,Lolo,Kaquko"
type NamesSpace = JoinStrArray<Names, " ">; // "Sem Lolo Kaquko"
type NamesStars = JoinStrArray<Names, "⭐️">; // "Sem⭐️Lolo⭐️Kaquko"
```

# 测试十

实现一个 Trim 工具类型，用于对字符串字面量类型进行去空格处理。具体的使用示例如下所示：

```ts
type Trim<V extends string> = // 你的实现代码
   // 测试用例
   Trim<' semlinker '>;
//=> 'semlinker'
```

提示：可以考虑先定义 TrimLeft 和 TrimRight 工具类型，再组合成 Trim 工具类型。

## 最佳解答

infer + 递归

```ts
// 实现一个 Trim 工具类型，用于对字符串字面量类型进行去空格处理。具体的使用示例如下所示：
type TrimLeft<V extends string> = V extends ` ${infer U}` ? TrimLeft<U> : V;
type TrimRight<V extends string> = V extends `${infer U} ` ? TrimRight<U> : V;
type Trim<V extends string> = TrimLeft<TrimRight<V>>

// 测试用例
type T3 = Trim<'             semlinker              '>
//=> 'semlinker'
```

// TODO https://github.com/semlinker/awesome-typescript/issues?page=1&q=is%3Aissue+is%3Aopen+sort%3Acreated-asc
