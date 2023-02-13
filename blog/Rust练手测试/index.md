---
title: Rust练手测试
date: 2022-08-02 17:24:05
categories:
   - 后端
tags: 后端, Rust, 练手测试
path: /rust-practice-test/
---

# 背景知识

[Rust 语言圣经](https://course.rs/about-book.html)

# 变量绑定与解构

## 绑定和可变性

### 变量只有在初始化后才能被使用

```rust
// 修复下面代码的错误并尽可能少的修改
fn main() {
    let x: i32; // 未初始化，但被使用
    let y: i32; // 未初始化，也未被使用
    println!("x is equal to {}", x);
}
```

#### 我的解答

```rust
// 修复下面代码的错误并尽可能少的修改
fn main() {
    let x: i32 = 0; // 未初始化，但被使用
    let _y: i32; // 未初始化，也未被使用
    println!("x is equal to {}", x);
}
```

### 可以使用 mut 将变量标记为可变

```rust
// 完形填空，让代码编译
fn main() {
    let __ =  1;
    __ += 2;

    println!("x = {}", x);
}
```

#### 我的解答

```rust
// 完形填空，让代码编译
fn main() {
    let mut x = 1;
    x += 2;

    println!("x = {}", x);
}
```

## 变量作用域

### 作用域是一个变量在程序中能够保持合法的范围

#### 问题一

```rust
// 修复下面代码的错误并使用尽可能少的改变
fn main() {
    let x: i32 = 10;
    {
        let y: i32 = 5;
        println!("x 的值是 {}, y 的值是 {}", x, y);
    }
    println!("x 的值是 {}, y 的值是 {}", x, y);
}
```

##### 我的解答

```rust
// 修复下面代码的错误并使用尽可能少的改变
fn main() {
    let x: i32 = 10;
    let y: i32 = 5;
    {
        println!("x 的值是 {}, y 的值是 {}", x, y);
    }
    println!("x 的值是 {}, y 的值是 {}", x, y);
}
```

##### 最佳解答

```rust
fn main() {
    let x: i32 = 10;
    {
        let y: i32 = 5;
        println!("The value of x is {} and value of y is {}", x, y);
    }
    println!("The value of x is {}", x);
}
```

#### 问题二

```rust
// 修复错误
fn main() {
    println!("{}, world", x);
}

fn define_x() {
    let x = "hello";
}
```

##### 我的解答

```rust
// 修复错误
fn main() {
    let x = define_x();
    println!("{}, world", x);
}

fn define_x() -> &'static str {
    let x = "hello";
    x
}
```

##### 最佳解答

```rust
fn main() {
    let x = define_x();
    println!("{}, world", x);
}

fn define_x() -> String {
    let x = "hello".to_string();
    x
}
```

## 变量遮蔽（Shadowing）

### 若后面的变量声明的名称和之前的变量相同，则我们说：第一个变量被第二个同名变量遮蔽了（shadowing）

```rust
// 只允许修改 `assert_eq!` 来让 `println!` 工作(在终端输出 `42`)
fn main() {
    let x: i32 = 5;
    {
        let x = 12;
        assert_eq!(x, 5);
    }

    assert_eq!(x, 12);

    let x = 42;
    println!("{}", x); // 输出 "42".
}
```

#### 我的解答

```rust
// 只允许修改 `assert_eq!` 来让 `println!` 工作(在终端输出 `42`)
fn main() {
    let x: i32 = 5;
    {
        let x = 12;
        assert_eq!(x, 12);
    }

    assert_eq!(x, 5);

    let x = 42;
    println!("{}", x); // 输出 "42".
}
```

### 删除一行代码以通过编译

```rust
fn main() {
    let mut x: i32 = 1;
    x = 7;
    // 遮蔽且再次绑定
    let x = x;
    x += 3;


    let y = 4;
    // 遮蔽
    let y = "I can also be bound to text!";
}
```

#### 我的解答

```rust
fn main() {
    let mut x: i32 = 1;
    x = 7;
    // 遮蔽且再次绑定
    let x = x;

    let y = 4;
    // 遮蔽
    let y = "I can also be bound to text!";
}
```

## 未使用的变量

### 使用以下方法来修复编译器输出的 warning:

- 一种方法
- 两种方法

> 注意: 你可以使用两种方法解决，但是它们没有一种是移除 `let x = 1` 所在的代码行

```rust
fn main() {
    let x = 1;
}

// compiler warning: unused variable: `x`
```

#### 我的解答

```rust
fn main() {
    let _x = 1;
}

// compiler warning: unused variable: `x`
```

```rust
#[allow(unused_variables)]
fn main() {
    let x = 1;
}

// compiler warning: unused variable: `x`
```

## 变量解构

### 我们可以将 let 跟一个模式一起使用来解构一个元组，最终将它解构为多个独立的变量

```rust
// 修复下面代码的错误并尽可能少的修改
fn main() {
    let (x, y) = (1, 2);
    x += 2;

    assert_eq!(x, 3);
    assert_eq!(y, 2);
}
```

#### 我的解答

```rust
// 修复下面代码的错误并尽可能少的修改
fn main() {
    let (mut x, y) = (1, 2);
    x += 2;

    assert_eq!(x, 3);
    assert_eq!(y, 2);
}
```

```rust
// 修复下面代码的错误并尽可能少的修改
fn main() {
    let (x, y) = (1, 2);
    let x = 3;

    assert_eq!(x, 3);
    assert_eq!(y, 2);
}
```

## 解构式赋值

### 在赋值语句的左式中使用元组、切片或结构体进行匹配赋值。

```rust
fn main() {
    let (x, y);
    (x, ..) = (3, 4);
    [.., y] = [1, 2];
    // 填空，让代码工作
    assert_eq!([x, y], __);
}
```

#### 我的解答

```rust
fn main() {
    let (x, y);
    (x, ..) = (3, 4);
    [.., y] = [1, 2];
    // 填空，让代码工作
    assert_eq!([x, y], [3, 2]);
}
```

# 基本类型

## 数值类型

### 整数

#### 如果我们没有显式的给予变量一个类型，那编译器会自动帮我们推导一个类型

##### 问题一

```rust
// 移除某个部分让代码工作
fn main() {
    let x: i32 = 5;
    let mut y: u32 = 5;

    y = x;

    let z = 10; // 这里 z 的类型是?
}
```

###### 我的解答

```rust
// 移除某个部分让代码工作
fn main() {
    let x: i32 = 5;
    let mut y: u32 = 5;

    // y = x;

    let z = 10; // 这里 z 的类型是?
}
```

###### 最佳解答

```rust
fn main() {
    let x: i32 = 5;
    let mut y = 5;

    y = x;

    let z = 10; // type of z : i32
}
```

##### 问题二

```rust
// 填空
fn main() {
    let v: u16 = 38_u8 as __;
}
```

###### 我的解答

```rust
// 填空
fn main() {
    let v: u16 = 38_u8 as u16;
}
```

##### 问题三

```rust
//  修改 `assert_eq!` 让代码工作
fn main() {
    let x = 5;
    assert_eq!("u32".to_string(), type_of(&x));
}

// 以下函数可以获取传入参数的类型，并返回类型的字符串形式，例如  "i8", "u8", "i32", "u32"
fn type_of<T>(_: &T) -> String {
    format!("{}", std::any::type_name::<T>())
}
```

###### 我的解答

```rust
//  修改 `assert_eq!` 让代码工作
fn main() {
    let x = 5;
    assert_eq!("i32".to_string(), type_of(&x));
}

// 以下函数可以获取传入参数的类型，并返回类型的字符串形式，例如  "i8", "u8", "i32", "u32"
fn type_of<T>(_: &T) -> String {
    format!("{}", std::any::type_name::<T>())
}
```

##### 问题四

```rust
// 填空，让代码工作
fn main() {
    assert_eq!(i8::MAX, __);
    assert_eq!(u8::MAX, __);
}
```

###### 我的解答

```rust
// 填空，让代码工作
fn main() {
    assert_eq!(i8::MAX, 127);
    assert_eq!(u8::MAX, 255);
}
```

##### 问题五

```rust
// 解决代码中的错误和 `panic`
fn main() {
   let v1 = 251_u8 + 8;
   let v2 = i8::checked_add(251, 8).unwrap();
   println!("{},{}",v1,v2);
}
```

###### 我的解答

```rust
// 解决代码中的错误和 `panic`
fn main() {
    let v1 = 251_u16 + 8;
    let v2 = i16::checked_add(251, 8).unwrap();
    println!("{},{}", v1, v2);
}
```

###### 最佳解答

```rust
fn main() {
    let v1 = 247_u8 + 8;
    let v2 = i8::checked_add(119, 8).unwrap();
    println!("{},{}", v1, v2);
}
```

##### 问题六

```rust
// 修改 `assert!` 让代码工作
fn main() {
    let v = 1_024 + 0xff + 0o77 + 0b1111_1111;
    assert!(v == 1579);
}
```

###### 我的解答

```rust
// 修改 `assert!` 让代码工作
fn main() {
    let v = 1_024 + 0xff + 0o77 + 0b1111_1111;
    assert!(v == 1597);
}
```

### 浮点数

#### 问题一

```rust
// 将 ? 替换成你的答案
fn main() {
    let x = 1_000.000_1; // ?
    let y: f32 = 0.12; // f32
    let z = 0.01_f64; // f64
}
```

##### 我的解答

```rust
// 将 ? 替换成你的答案
fn main() {
    let x = 1_000.000_1; // f64
    let y: f32 = 0.12; // f32
    let z = 0.01_f64; // f64
}
```

#### 问题二

使用两种方法来让下面代码工作

```rust
fn main() {
    assert!(0.1 + 0.2 == 0.3);
}
```

##### 我的解答

```rust
fn main() {
    assert!((0.1_f64 + 0.2 - 0.3).abs() < 0.00001);
}
```

```rust
fn main() {
    assert!(0.1_f32 + 0.2_f32 == 0.3_f32);
}
```

### 序列 Range

#### 问题一

两个目标:

1. 修改 assert! 让它工作
2. 让 println! 输出: 97 - 122

```rust
fn main() {
    let mut sum = 0;
    for i in -3..2 {
        sum += i
    }

    assert!(sum == -3);

    for c in 'a'..='z' {
        println!("{}", c);
    }
}
```

##### 我的解答

```rust
fn main() {
    let mut sum = 0;
    for i in -3..2 {
        sum += i
    }

    assert!(sum == -5);

    for c in 'a'..='z' {
        println!("{}", c);
    }
}
```

##### 最佳解答

```rust
fn main() {
    let mut sum = 0;
    for i in -3..2 {
        sum += i
    }

    assert!(sum == -5);

    for c in 'a'..='z' {
        println!("{}", c as u8);
    }
}
```

#### 问题二

```rust
// 填空
use std::ops::{Range, RangeInclusive};
fn main() {
    assert_eq!((1..__), Range{ start: 1, end: 5 });
    assert_eq!((1..__), RangeInclusive::new(1, 5));
}
```

##### 我的解答

```rust
// 填空
use std::ops::{Range, RangeInclusive};
fn main() {
    assert_eq!((1..5), Range { start: 1, end: 5 });
    assert_eq!((1..=5), RangeInclusive::new(1, 5));
}
```

### 计算

```rust
// 填空，并解决错误
fn main() {
    // 整数加法
    assert!(1u32 + 2 == __);

    // 整数减法
    assert!(1i32 - 2 == __);
    assert!(1u8 - 2 == -1);

    assert!(3 * 50 == __);

    assert!(9.6 / 3.2 == 3.0); // error ! 修改它让代码工作

    assert!(24 % 5 == __);

    // 逻辑与或非操作
    assert!(true && false == __);
    assert!(true || false == __);
    assert!(!true == __);

    // 位操作
    println!("0011 AND 0101 is {:04b}", 0b0011u32 & 0b0101);
    println!("0011 OR 0101 is {:04b}", 0b0011u32 | 0b0101);
    println!("0011 XOR 0101 is {:04b}", 0b0011u32 ^ 0b0101);
    println!("1 << 5 is {}", 1u32 << 5);
    println!("0x80 >> 2 is 0x{:x}", 0x80u32 >> 2);
}
```

#### 我的解答

```rust
// 填空，并解决错误
fn main() {
    // 整数加法
    assert!(1u32 + 2 == 3);

    // 整数减法
    assert!(1i32 - 2 == -1);
    assert!(1i8 - 2 == -1);

    assert!(3 * 50 == 150);

    assert!(9.6_f32 / 3.2_f32 == 3.0_f32); // error ! 修改它让代码工作

    assert!(24 % 5 == 4);

    // 逻辑与或非操作
    assert!(true && false == false);
    assert!(true || false == true);
    assert!(!true == false);

    // 位操作
    println!("0011 AND 0101 is {:04b}", 0b0011u32 & 0b0101);
    println!("0011 OR 0101 is {:04b}", 0b0011u32 | 0b0101);
    println!("0011 XOR 0101 is {:04b}", 0b0011u32 ^ 0b0101);
    println!("1 << 5 is {}", 1u32 << 5);
    println!("0x80 >> 2 is 0x{:x}", 0x80u32 >> 2);
}
```

## 字符、布尔、单元类型

### 字符

#### 问题一

```rust
//  修改 2 处 `assert_eq!` 让代码工作

use std::mem::size_of_val;
fn main() {
    let c1 = 'a';
    assert_eq!(size_of_val(&c1), 1);

    let c2 = '中';
    assert_eq!(size_of_val(&c2), 3);

    println!("Success!")
}
```

##### 我的解答

```rust
// 修改 2 处 `assert_eq!` 让代码工作

use std::mem::size_of_val;
fn main() {
    let c1 = 'a';
    assert_eq!(size_of_val(&c1), 4);

    let c2 = '中';
    assert_eq!(size_of_val(&c2), 4);

    println!("Success!")
}
```

#### 问题二

```rust
// 修改一行让代码正常打印
fn main() {
    let c1 = "中";
    print_char(c1);
}

fn print_char(c : char) {
    println!("{}", c);
}
```

##### 我的解答

```rust
// 修改一行让代码正常打印
fn main() {
    let c1 = '中';
    print_char(c1);
}

fn print_char(c: char) {
    println!("{}", c);
}
```

### 布尔

#### 问题一

```rust
// 使成功打印
fn main() {
    let _f: bool = false;

    let t = true;
    if !t {
        println!("Success!")
    }
}
```

##### 我的解答

```rust
// 使成功打印
fn main() {
    let _f: bool = false;

    let t = true;
    if t {
        println!("Success!")
    }
}
```

#### 问题二

```rust
fn main() {
    let f = true;
    let t = true && false;
    assert_eq!(t, f);

    println!("Success!")
}
```

##### 我的解答

```rust
fn main() {
    let f = true;
    let t = true && false;
    assert_eq!(t, !f);

    println!("Success!")
}
```

### 单元类型

#### 问题一

```rust
// 让代码工作，但不要修改 `implicitly_ret_unit` !
fn main() {
    let _v: () = ();

    let v = (2, 3);
    assert_eq!(v, implicitly_ret_unit());

    println!("Success!")
}

fn implicitly_ret_unit() {
    println!("I will return a ()")
}

// 不要使用下面的函数，它只用于演示！
fn explicitly_ret_unit() -> () {
    println!("I will return a ()")
}
```

##### 我的解答

```rust
// 让代码工作，但不要修改 `implicitly_ret_unit` !
fn main() {
    let _v: () = ();

    let v = ();
    assert_eq!(v, implicitly_ret_unit());

    println!("Success!")
}

fn implicitly_ret_unit() {
    println!("I will return a ()")
}

// 不要使用下面的函数，它只用于演示！
fn explicitly_ret_unit() -> () {
    println!("I will return a ()")
}
```

#### 问题二

单元类型占用的内存大小是多少？

```rust
// 让代码工作：修改 `assert!` 中的 `4`
use std::mem::size_of_val;
fn main() {
    let unit: () = ();
    assert!(size_of_val(&unit) == 4);

    println!("Success!")
}
```

##### 我的解答

```rust
// 让代码工作：修改 `assert!` 中的 `4`
use std::mem::size_of_val;
fn main() {
    let unit: () = ();
    assert!(size_of_val(&unit) == 0);

    println!("Success!")
}
```

## 语句与表达式

### 问题一

```rust
// 使用两种方法让代码工作起来
fn main() {
    let v = {
        let mut x = 1;
        x += 2
    };

    assert_eq!(v, 3);
}
```

#### 我的解答

```rust
fn main() {
    let v = {
        let mut x = 1;
        x += 2
    };

    assert_eq!(v, ());
}
```

```rust
fn main() {
    let v = {
        let mut x = 1;
        x += 2;
        x
    };

    assert_eq!(v, 3);
}
```

### 问题二

```rust
fn main() {
    let v = (let x = 3);

    assert!(v == 3);
}
```

#### 我的解答

```rust
fn main() {
    let v = {
        let x = 3;
        x
    };

    assert!(v == 3);
}
```

### 问题三

```rust
fn main() {
    let s = sum(1, 2);
    assert_eq!(s, 3);
}

fn sum(x: i32, y: i32) -> i32 {
    x + y;
}
```

#### 我的解答

```rust
fn main() {
    let s = sum(1, 2);
    assert_eq!(s, 3);
}

fn sum(x: i32, y: i32) -> i32 {
    x + y
}
```

// TODO https://zh.practice.rs/basic-types/statements-expressions.html
