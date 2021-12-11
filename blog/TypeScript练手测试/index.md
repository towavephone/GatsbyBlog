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

## 拓展

类似的实现 PushArgument

```ts
type Fn = (a: number, b?: string) => number;
type PushArgument<F, A> =

type FinalFn = PushArgument<Fn, boolean>;
// (a: number, b?: string, x?: boolean) => number
```

## 最佳解答

```ts
type Fn = (a: number, b?: string) => number;
type PushArgument<F extends Function, A, S extends any[] = [x?: A]> = F extends (...args: infer R) => infer R2 ? (...args: [...R, ...S]) => R2 : never

type FinalFn = PushArgument<Fn, boolean>;
// (a: number, b?: string, x?: boolean) => number
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

# 测试十一

实现一个 IsEqual 工具类型，用于比较两个类型是否相等。具体的使用示例如下所示：

```ts
type IsEqual<A, B> = // 你的实现代码

// 测试用例
type E0 = IsEqual<1, 2>; // false
type E1 = IsEqual<{ a: 1 }, { a: 1 }> // true
type E2 = IsEqual<[1], []>; // false
```

## 我的解答

```ts
type IsEqual<A, B> = A extends B ? (B extends A ? true : false) : false;

// 测试用例
type E0 = IsEqual<1, 2>; // false
type E1 = IsEqual<{ a: 1 }, { a: 1 }>; // true
type E2 = IsEqual<[1], []>; // false
```

## 最佳解答

```ts
type IsEqual<A, B> = A extends B ? (B extends A ? true : false) : false;

// 测试用例
type A6 = IsEqual<true, boolean>; // boolean
type A7 = IsEqual<1 | 2, 1>; // boolean
```

对于这 2 个例子，以上我的解答是不对的，这是由于 泛型和 extends 两者结合产生的 `distributive conditional types（分布式条件类型）` 导致的，这里的 `boolean` 和 `true | false` 等价，即 2 个条件都走了

给泛型套上一个 `[]`，就可以解决这个问题

```ts
type IsEqual<A, B> = [A, B] extends [B, A] ? true : false;

// 测试用例
type A6 = IsEqual<true, boolean>; // boolean
type A7 = IsEqual<1 | 2, 1>; // boolean
```

但是针对 any 还是不行，以下是最终解决方案，具体可参考 [issue](https://github.com/microsoft/TypeScript/issues/27024#issuecomment-510924206)

// TODO IsEqual 具体原理

```ts
type IsEqual<T, U> = (<G>() => G extends T ? 1 : 2) extends (<G>() => G extends U ? 1 : 2) ? true : false;

// 测试用例
type E0 = IsEqual<1, 2>; // false
type E1 = IsEqual<{ a: 1 }, { a: 1 }>; // true
type E2 = IsEqual<[1], []>; // false

// 这里考虑了边缘情况
type X = IsEqual<{ x: any }, { x: number }>; // false
type A6 = IsEqual<true, boolean>; // false
type A7 = IsEqual<1 | 2, 1>; // false
```

# 测试十二

实现一个 Head 工具类型，用于获取数组类型的第一个类型。具体的使用示例如下所示：

```ts
type Head<T extends Array<any>> = // 你的实现代码

// 测试用例
type H0 = Head<[]> // never
type H1 = Head<[1]> // 1
type H2 = Head<[3, 2]> // 3
```

## 我的解答

```ts
type Head<T extends Array<any>> = T[0];

// 测试用例
type H0 = Head<[]>; // never
type H1 = Head<[1]>; // 1
type H2 = Head<[3, 2]>; // 3
```

## 最佳解答

```ts
type Head<T extends Array<any>> = T extends [] ? never : T[0];

// 测试用例
type H0 = Head<[]>; // never
type H1 = Head<[1]>; // 1
type H2 = Head<[3, 2]>; // 3
```

# 测试十三

实现一个 Tail 工具类型，用于获取数组类型除了第一个类型外，剩余的类型。具体的使用示例如下所示：

```ts
type Tail<T extends Array<any>> =  // 你的实现代码

// 测试用例
type T0 = Tail<[]> // []
type T1 = Tail<[1, 2]> // [2]
type T2 = Tail<[1, 2, 3, 4, 5]> // [2, 3, 4, 5]
```

## 我的解答

```ts
type Tail<T extends Array<any>> = T extends [a: any, ...rest: infer K] ? K : never

// 测试用例
type T0 = Tail<[]> // []
type T1 = Tail<[1, 2]> // [2]
type T2 = Tail<[1, 2, 3, 4, 5]> // [2, 3, 4, 5]
```

## 最佳解答

```ts
type Tail<T extends Array<any>> = T extends [] ? [] : (T extends [any, ...infer K] ? K : never);

// 测试用例
type T0 = Tail<[]>; // []
type T1 = Tail<[1, 2]>; // [2]
type T2 = Tail<[1, 2, 3, 4, 5]>; // [2, 3, 4, 5]
```

# 测试十四

实现一个 Unshift 工具类型，用于把指定类型 E 作为第一个元素添加到 T 数组类型中。具体的使用示例如下所示：

```ts
type Unshift<T extends any[], E> =  // 你的实现代码

// 测试用例
type Arr0 = Unshift<[], 1>; // [1]
type Arr1 = Unshift<[1, 2, 3], 0>; // [0, 1, 2, 3]
```

## 我的解答

```ts
type Unshift<T extends any[], E> = [E, ...T] extends infer K ? K : never;

// 测试用例
type Arr0 = Unshift<[], 1>; // [1]
type Arr1 = Unshift<[1, 2, 3], 0>; // [0, 1, 2, 3]
```

```ts
type Unshift<T extends any[], E> = [E, ...T];

// 测试用例
type Arr0 = Unshift<[], 1>; // [1]
type Arr1 = Unshift<[1, 2, 3], 0>; // [0, 1, 2, 3]
```

# 测试十五

实现一个 Shift 工具类型，用于移除 T 数组类型中的第一个类型。具体的使用示例如下所示：

```ts
type Shift<T extends any[]> = // 你的实现代码

// 测试用例
type S0 = Shift<[1, 2, 3]>
type S1 = Shift<[string,number,boolean]>
```

## 我的解答

```ts
type Shift<T extends any[]> = T extends [any, ...(infer R)] ? R : [];

// 测试用例
type S0 = Shift<[1, 2, 3]>;
type S1 = Shift<[string, number, boolean]>;
```

# 测试十六

实现一个 Push 工具类型，用于把指定类型 E 作为最后一个元素添加到 T 数组类型中。具体的使用示例如下所示：

```ts
type Push<T extends any[], V> = // 你的实现代码

// 测试用例
type Arr0 = Push<[], 1> // [1]
type Arr1 = Push<[1, 2, 3], 4> // [1, 2, 3, 4]
```

## 我的解答

```ts
type Push<T extends any[], V> = [...T, V];

// 测试用例
type Arr0 = Push<[], 1>; // [1]
type Arr1 = Push<[1, 2, 3], 4>; // [1, 2, 3, 4]
```

# 测试十七

实现一个 Includes 工具类型，用于判断指定的类型 E 是否包含在 T 数组类型中。具体的使用示例如下所示：

```ts
type Includes<T extends Array<any>, E> = // 你的实现代码

type I0 = Includes<[], 1> // false
type I1 = Includes<[2, 2, 3, 1], 2> // true
type I2 = Includes<[2, 3, 3, 1], 1> // true
```

## 我的解答

```ts
type Includes<T extends Array<any>, E> = E extends T[keyof T] ? true : false;
// 或 type Includes<T extends Array<any>, E> = E extends T[number] ? true : false

type I0 = Includes<[], 1>; // false
type I1 = Includes<[2, 2, 3, 1], 2>; // true
type I2 = Includes<[2, 3, 3, 1], 1>; // true
```

## 最佳解答

需结合 isEqual 方法

```ts
// 实现一个 Includes 工具类型，用于判断指定的类型 E 是否包含在 T 数组类型中。具体的使用示例如下所示：
type IsEqual<T, U> = (<G>() => G extends T ? 1 : 2) extends <G>() => G extends U ? 1 : 2 ? true : false;

type Includes<T extends Array<any>, E> = T extends [infer A, ...infer B]
   ? (IsEqual<A, E> extends true ? true : Includes<B, E>)
   : false;

type I0 = Includes<[], 1>; // false
type I1 = Includes<[2, 2, 3, 1], 2>; // true
type I2 = Includes<[2, 3, 3, 1], 1>; // true
type I3 = Includes<[2 | 3, 3, 3, 1], 2 | 3 | 4>; // false
type I4 = Includes<[2 | 3, 3, 3, 1], 2 | 3>; // true
type I5 = Includes<[never, 3, 3, 1], never>; // true
type I6 = Includes<[never, 3, 3, 1], any>; // false
```

# 测试十八

实现一个 UnionToIntersection 工具类型，用于把联合类型转换为交叉类型。具体的使用示例如下所示：

```ts
type UnionToIntersection<U> = // 你的实现代码

// 测试用例
type U0 = UnionToIntersection<string | number> // never
type U1 = UnionToIntersection<{ name: string } | { age: number }> // { name: string; } & { age: number; }
```

## 我的解答

分布式条件类型 + 条件类型推断

```ts
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer K) => void ? K : never;

// 测试用例
type U0 = UnionToIntersection<string | number>; // never
type U1 = UnionToIntersection<{ name: string } | { age: number }>; // { name: string; } & { age: number; }
```

# 测试十九

实现一个 OptionalKeys 工具类型，用来获取对象类型中声明的可选属性。具体的使用示例如下所示：

```ts
type Person = {
  id: string;
  name: string;
  age: number;
  from?: string;
  speak?: string;
};

type OptionalKeys<T> = // 你的实现代码
type PersonOptionalKeys = OptionalKeys<Person> // "from" | "speak"
```

## 我的解答

```ts
type Person = {
   id: string;
   name: string;
   age: number;
   from?: string;
   speak?: string;
};

type OptionalKeys<T> = {
   [K in keyof T]: {} extends Pick<T, K> ? K : never;
}[keyof T];

type PersonOptionalKeys = OptionalKeys<Person>; // "from" | "speak"
```

# 测试二十

实现一个 Curry 工具类型，用来实现函数类型的柯里化处理。具体的使用示例如下所示：

```ts
type Curry<
  F extends (...args: any[]) => any,
  P extends any[] = Parameters<F>,
  R = ReturnType<F>
> = // 你的实现代码

type F0 = Curry<() => Date>; // () => Date
type F1 = Curry<(a: number) => Date>; // (arg: number) => Date
type F2 = Curry<(a: number, b: string) => Date>; //  (arg_0: number) => (b: string) => Date
```

## 最佳解答

```ts
type FirstAsArray<T extends any[]> = T extends [...infer A, infer B, infer C]
   ? A extends []
      ? T extends [...infer A, infer B]
         ? A
         : never
      : T extends [...infer A, infer B]
      ? FirstAsArray<A>
      : never
   : T;

type Curry<F extends (...args: any[]) => any, P extends any[] = Parameters<F>, R = ReturnType<F>> = P extends [
   infer A,
   infer B,
   ...infer C
]
   ? P extends [infer A, ...infer B]
      ? Curry<F, FirstAsArray<P>, Curry<F, B, R>>
      : never
   : (...args: P) => R;

type F0 = Curry<() => Date>; // () => Date
type F1 = Curry<(a: number) => Date>; // (a: number) => Date
type F2 = Curry<(a: number, b: string) => Date>; // (a: number) => (b: string) => Date
type F3 = Curry<(a: number, b: string, c: boolean) => Date>; // (a: number) => (b: string) => (c: boolean) => Date
```

# 测试二十一

实现一个 Merge 工具类型，用于把两个类型合并成一个新的类型。第二种类型（SecondType）的 Keys 将会覆盖第一种类型（FirstType）的 Keys。具体的使用示例如下所示：

```ts
type Foo = {
   a: number;
   b: string;
};

type Bar = {
   b: number;
};

type Merge<FirstType, SecondType> = // 你的实现代码

const ab: Merge<Foo, Bar> = { a: 1, b: 2 };
```

## 我的解答

```ts
type ExtractKeys<T> = {
   [K in keyof T]: K;
}[keyof T];

type Merge<FirstType, SecondType> = {
   [K in keyof FirstType]: K extends ExtractKeys<SecondType> ? SecondType[K] : FirstType[K];
} &
   SecondType;
```

## 最佳解答一

```ts
type Merge<FirstType, SecondType> = Omit<FirstType, keyof SecondType> & SecondType;
```

## 最佳解答二

```ts
type Merge<FirstType, SecondType> = {
   [K in keyof (FirstType & SecondType)]: K extends keyof SecondType
      ? SecondType[K]
      : K extends keyof FirstType
      ? FirstType[K]
      : never;
};
```

# 测试二十二

实现一个 RequireAtLeastOne 工具类型，它将创建至少含有一个给定 Keys 的类型，其余的 Keys 保持原样。具体的使用示例如下所示：

```ts
type Responder = {
   text?: () => string;
   json?: () => string;
   secure?: boolean;
};

type RequireAtLeastOne<
    ObjectType,
    KeysType extends keyof ObjectType = keyof ObjectType,
> = // 你的实现代码

// 表示当前类型至少包含 'text' 或 'json' 键
const responder: RequireAtLeastOne<Responder, 'text' | 'json'> = {
    json: () => '{"message": "ok"}',
    secure: true
};
```

## 最佳解答一

```ts
// 这里利用了联合类型作为泛型是 extends 会分发处理的特性，之后将去掉某个属性的类型与只有某个属性，且必填的类型做交叉合并
type RequireAtLeastOne<ObjectType, KeysType extends keyof ObjectType = keyof ObjectType> = KeysType extends string
   ? Omit<ObjectType, KeysType> & Required<Pick<ObjectType, KeysType>>
   : never;
```

## 最佳解答二

`{[k in KeysType]: ...}[KeysType]` 具体的作用是取出具体的键值，也就是 `Required<Pick<ObjectType, k>>` 部分

```ts
type RequireAtLeastOne<ObjectType, KeysType extends keyof ObjectType = keyof ObjectType> = Omit<ObjectType, KeysType> &
   {
      [K in KeysType]: Required<Pick<ObjectType, K>>;
   }[KeysType];
```

# 测试二十三

实现一个 RemoveIndexSignature 工具类型，用于移除已有类型中的索引签名。具体的使用示例如下所示：

```ts
interface Foo {
  [key: string]: any;
  [key: number]: any;
  bar(): void;
}

type RemoveIndexSignature<T> = // 你的实现代码

type FooWithOnlyBar = RemoveIndexSignature<Foo>; //{ bar: () => void; }
```

## 最佳解答

这里利用的是 `[k in as]` 的用法。as 过的语法可以直接实现对 k 的判断过滤，基于`'a' extends string` 但 string 没有 `extends 'a'`。

```ts
type b = "a" extends string ? true : false; // true
type c = string extends "a" ? true : false; // false
type d = string extends string ? true : false; // true

interface Foo {
  [key: string]: any;
  [key: number]: any;
  [key: symbol]: any;
  bar(): void;
}

type RemoveIndexSignature<T> = {
  [K in keyof T as string extends K
    ? never
    : number extends K
    ? never
    : symbol extends K
    ? never
    : K]: T[K];
};

type FooWithOnlyBar = RemoveIndexSignature<Foo>; //{ bar: () => void; }
```

# 测试二十四

实现一个 Mutable 工具类型，用于移除对象类型上所有属性或部分属性的 readonly 修饰符。具体的使用示例如下所示：

```ts
type Foo = {
  readonly a: number;
  readonly b: string;
  readonly c: boolean;
};

type Mutable<T, Keys extends keyof T = keyof T> = // 你的实现代码

const mutableFoo: Mutable<Foo, 'a'> = { a: 1, b: '2', c: true };

mutableFoo.a = 3; // OK
mutableFoo.b = '6'; // Cannot assign to 'b' because it is a read-only property.
```

## 最佳解答

```ts
type Foo = {
   readonly a: number;
   readonly b: string;
   readonly c: boolean;
};

type Mutable<T, Keys extends keyof T = keyof T> = {
   -readonly [K in Keys]: T[K];
} &
   Omit<T, Keys>;

const mutableFoo: Mutable<Foo, 'a'> = { a: 1, b: '2', c: true };

mutableFoo.a = 3; // OK
mutableFoo.b = '6'; // Cannot assign to 'b' because it is a read-only property.
```

# 测试二十五

实现一个 IsUnion 工具类型，判断指定的类型是否为联合类型。具体的使用示例如下所示：

```ts
type IsUnion<T, U = T> = // 你的实现代码

type I0 = IsUnion<string|number> // true
type I1 = IsUnion<string|never> // false
type I2 = IsUnion<string|unknown> // false
```

## 最佳解答

1. 联合类型作为泛型的时候 extends 会触发分发执行
2. 联合类型 T 写成 `[T]` 就变成了普通类型，extends 的时候不会分发执行

这里第一步的 T extends any 肯定为真，这个其实就是利用其分发的特性，后面的 `[T]` 就是一个联合类型拆开后的某一个，因此如果是联合类型的话 `[U] extends [T]` 一定为否

```ts
type a = string | number extends string ? true : false; // false

type IsUnion<T, U = T> = T extends any ? ([U] extends [T] ? false : true) : never;

type I0 = IsUnion<string | number>; // true
type I1 = IsUnion<string | never>; // false
type I2 = IsUnion<string | unknown>; // false
```

# 测试二十六

实现一个 IsNever 工具类型，判断指定的类型是否为 never 类型。具体的使用示例如下所示：

```ts
type I0 = IsNever<never>; // true
type I1 = IsNever<never | string>; // false
type I2 = IsNever<null>; // false
```

## 我的解答

```ts
type IsNever<T> = [T] extends [never] ? true : false;
type I0 = IsNever<never>; // true
type I1 = IsNever<never | string>; // false
type I2 = IsNever<null>; // false
```

## 最佳解答

利用 isEqual

```ts
type IsEqual<T, U> = (<G>() => G extends T ? 1 : 2) extends (<G>() => G extends U ? 1 : 2) ? true : false;
type IsNever<T> = IsEqual<T, never>;
type I0 = IsNever<never>; // true
type I1 = IsNever<never | string>; // false
type I2 = IsNever<null>; // false
```

# 测试二十七

实现一个 Reverse 工具类型，用于对元组类型中元素的位置颠倒，并返回该数组。元组的第一个元素会变成最后一个，最后一个元素变成第一个。

```ts
type Reverse<
  T extends Array<any>,
  R extends Array<any> = []
> = // 你的实现代码

type R0 = Reverse<[]> // []
type R1 = Reverse<[1, 2, 3]> // [3, 2, 1]
```

## 最佳解答一

```ts
type Reverse<T extends Array<any>, R extends Array<any> = []> = T extends [infer First, ...infer Rest]
   ? Reverse<Rest, [First, ...R]>
   : R;

type R0 = Reverse<[]>; // []
type R1 = Reverse<[1, 2, 3]>; // [3, 2, 1]
```

## 最佳解答二

```ts
type Reverse<T extends Array<any>, R extends Array<any> = []> = T extends [infer First, ...infer Rest]
   ? [...Reverse<Rest>, First]
   : [];

type R0 = Reverse<[]>; // []
type R1 = Reverse<[1, 2, 3]>; // [3, 2, 1]
```

# 测试二十八

实现一个 Split 工具类型，根据给定的分隔符（Delimiter）对包含分隔符的字符串进行切割。可用于定义 String.prototype.split 方法的返回值类型。具体的使用示例如下所示：

```ts
type Item = 'semlinker,lolo,kakuqo';

type Split<
   S extends string,
   Delimiter extends string,
> = // 你的实现代码

type ElementType = Split<Item, ','>; // ["semlinker", "lolo", "kakuqo"]
```

## 我的解答

```ts
type Item = 'semlinker,lolo,kakuqo';

type Split<
   S extends string,
   Delimiter extends string,
> = S extends `${infer A}${Delimiter}${infer B}` ? [A, ...Split<B, Delimiter>] : [S]

type ElementType = Split<Item, ','>; // ["semlinker", "lolo", "kakuqo"]
```

// TODO https://github.com/semlinker/awesome-typescript/issues?page=1&q=is%3Aissue+is%3Aopen+sort%3Acreated-asc
