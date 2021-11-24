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
// 这里必须要加，因为
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

// TODO https://github.com/semlinker/awesome-typescript/issues?page=1&q=is%3Aissue+is%3Aopen+sort%3Acreated-asc
