---
title: Rust练手测试
date: 2023-3-17 23:05:48
categories:
   - 后端
tags: 后端, Rust, 练手测试
path: /rust-practice-test/
---

# 背景知识

[Rust 语言圣经](https://course.rs/about-book.html)

# 变量绑定与解构

## 问题一

变量只有在初始化后才能被使用

```rust
// 修复下面代码的错误并尽可能少的修改
fn main() {
    let x: i32; // 未初始化，但被使用
    let y: i32; // 未初始化，也未被使用
    println!("x is equal to {}", x);
}
```

### 我的解答

```rust
// 修复下面代码的错误并尽可能少的修改
fn main() {
    let x: i32 = 0; // 未初始化，但被使用
    let _y: i32; // 未初始化，也未被使用
    println!("x is equal to {}", x);
}
```

## 问题二

可以使用 mut 将变量标记为可变

```rust
// 完形填空，让代码编译
fn main() {
    let __ =  1;
    __ += 2;

    println!("x = {}", x);
}
```

### 我的解答

```rust
// 完形填空，让代码编译
fn main() {
    let mut x = 1;
    x += 2;

    println!("x = {}", x);
}
```

## 问题三

作用域是一个变量在程序中能够保持合法的范围

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

### 我的解答

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

### 最佳解答

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

## 问题四

```rust
// 修复错误
fn main() {
    println!("{}, world", x);
}

fn define_x() {
    let x = "hello";
}
```

### 我的解答

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

### 最佳解答

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

## 问题五

若后面的变量声明的名称和之前的变量相同，则我们说：第一个变量被第二个同名变量遮蔽了（shadowing）

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

### 我的解答

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

## 问题六

删除一行代码以通过编译

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

### 我的解答

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

## 问题七

使用以下方法来修复编译器输出的 warning:

- 一种方法
- 两种方法

> 注意: 你可以使用两种方法解决，但是它们没有一种是移除 `let x = 1` 所在的代码行

```rust
fn main() {
    let x = 1;
}

// compiler warning: unused variable: `x`
```

### 我的解答

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

## 问题八

我们可以将 let 跟一个模式一起使用来解构一个元组，最终将它解构为多个独立的变量

```rust
// 修复下面代码的错误并尽可能少的修改
fn main() {
    let (x, y) = (1, 2);
    x += 2;

    assert_eq!(x, 3);
    assert_eq!(y, 2);
}
```

### 我的解答

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

## 问题九

在赋值语句的左式中使用元组、切片或结构体进行匹配赋值。

```rust
fn main() {
    let (x, y);
    (x, ..) = (3, 4);
    [.., y] = [1, 2];
    // 填空，让代码工作
    assert_eq!([x, y], __);
}
```

### 我的解答

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

### 问题一

如果我们没有显式的给予变量一个类型，那编译器会自动帮我们推导一个类型

```rust
// 移除某个部分让代码工作
fn main() {
    let x: i32 = 5;
    let mut y: u32 = 5;

    y = x;

    let z = 10; // 这里 z 的类型是?
}
```

#### 我的解答

```rust
// 移除某个部分让代码工作
fn main() {
    let x: i32 = 5;
    let mut y: u32 = 5;

    // y = x;

    let z = 10; // 这里 z 的类型是?
}
```

#### 最佳解答

```rust
fn main() {
    let x: i32 = 5;
    let mut y = 5;

    y = x;

    let z = 10; // type of z : i32
}
```

### 问题二

```rust
// 填空
fn main() {
    let v: u16 = 38_u8 as __;
}
```

#### 我的解答

```rust
// 填空
fn main() {
    let v: u16 = 38_u8 as u16;
}
```

### 问题三

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

#### 我的解答

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

### 问题四

```rust
// 填空，让代码工作
fn main() {
    assert_eq!(i8::MAX, __);
    assert_eq!(u8::MAX, __);
}
```

#### 我的解答

```rust
// 填空，让代码工作
fn main() {
    assert_eq!(i8::MAX, 127);
    assert_eq!(u8::MAX, 255);
}
```

### 问题五

```rust
// 解决代码中的错误和 `panic`
fn main() {
   let v1 = 251_u8 + 8;
   let v2 = i8::checked_add(251, 8).unwrap();
   println!("{},{}",v1,v2);
}
```

#### 我的解答

```rust
// 解决代码中的错误和 `panic`
fn main() {
    let v1 = 251_u16 + 8;
    let v2 = i16::checked_add(251, 8).unwrap();
    println!("{},{}", v1, v2);
}
```

#### 最佳解答

```rust
fn main() {
    let v1 = 247_u8 + 8;
    let v2 = i8::checked_add(119, 8).unwrap();
    println!("{},{}", v1, v2);
}
```

### 问题六

```rust
// 修改 `assert!` 让代码工作
fn main() {
    let v = 1_024 + 0xff + 0o77 + 0b1111_1111;
    assert!(v == 1579);
}
```

#### 我的解答

```rust
// 修改 `assert!` 让代码工作
fn main() {
    let v = 1_024 + 0xff + 0o77 + 0b1111_1111;
    assert!(v == 1597);
}
```

### 问题七

```rust
// 将 ? 替换成你的答案
fn main() {
    let x = 1_000.000_1; // ?
    let y: f32 = 0.12; // f32
    let z = 0.01_f64; // f64
}
```

#### 我的解答

```rust
// 将 ? 替换成你的答案
fn main() {
    let x = 1_000.000_1; // f64
    let y: f32 = 0.12; // f32
    let z = 0.01_f64; // f64
}
```

### 问题八

使用两种方法来让下面代码工作

```rust
fn main() {
    assert!(0.1 + 0.2 == 0.3);
}
```

#### 我的解答

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

### 问题九

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

#### 我的解答

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

#### 最佳解答

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

### 问题十

```rust
// 填空
use std::ops::{Range, RangeInclusive};
fn main() {
    assert_eq!((1..__), Range{ start: 1, end: 5 });
    assert_eq!((1..__), RangeInclusive::new(1, 5));
}
```

#### 我的解答

```rust
// 填空
use std::ops::{Range, RangeInclusive};
fn main() {
    assert_eq!((1..5), Range { start: 1, end: 5 });
    assert_eq!((1..=5), RangeInclusive::new(1, 5));
}
```

### 问题十一

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

### 问题一

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

#### 我的解答

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

### 问题二

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

#### 我的解答

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

### 问题三

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

#### 我的解答

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

### 问题四

```rust
fn main() {
    let f = true;
    let t = true && false;
    assert_eq!(t, f);

    println!("Success!")
}
```

#### 我的解答

```rust
fn main() {
    let f = true;
    let t = true && false;
    assert_eq!(t, !f);

    println!("Success!")
}
```

### 问题五

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

#### 我的解答

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

### 问题六

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

#### 我的解答

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

## 函数

### 问题一

```rust
fn main() {
    // 不要修改下面两行代码!
    let (x, y) = (1, 2);
    let s = sum(x, y);

    assert_eq!(s, 3);
}

fn sum(x, y: i32) {
    x + y;
}
```

#### 我的解答

```rust
fn main() {
    let (x, y) = (1, 2);
    let s = sum(x, y);

    assert_eq!(s, 3);
}

fn sum(x: i32, y: i32) -> i32 {
    x + y
}
```

### 问题二

```rust
fn main() {
    print();
}

// 使用另一个类型来替代 i32
fn print() -> i32 {
    println!("hello,world");
}
```

#### 我的解答

```rust
fn main() {
    print();
}

fn print() -> () {
    println!("hello,world");
}
```

### 问题三

```rust
// 用两种方法求解
fn main() {
    never_return();
}

fn never_return() -> ! {
    // 实现这个函数，不要修改函数签名!
}
```

#### 我的解答

```rust
fn main() {
    never_return();
}

fn never_return() -> ! {
    loop {}
}
```

```rust
fn main() {
    never_return();
}

fn never_return() -> ! {
    panic!("error")
}
```

### 问题四

发散函数(Diverging function)不会返回任何值，因此它们可以用于替代需要返回任何值的地方

```rust
fn main() {
    println!("Success!");
}

fn get_option(tp: u8) -> Option<i32> {
    match tp {
        1 => {
        }
        _ => {
        }
    };

    // 这里与其返回一个 None，不如使用发散函数替代
    never_return_fn()
}

// 使用三种方法实现以下发散函数
fn never_return_fn() -> ! {}
```

#### 我的解答

```rust
fn never_return_fn() -> ! {
    panic!()
}
```

```rust
fn never_return_fn() -> ! {
    todo!();
}
```

```rust
fn never_return_fn() -> ! {
    loop {
        std::thread::sleep(std::time::Duration::from_secs(1))
    }
}
```

### 问题五

```rust
fn main() {
    // 填空
    let b = __;

    let _v = match b {
        true => 1,
        // 发散函数也可以用于 `match` 表达式，用于替代任何类型的值
        false => {
            println!("Success!");
            panic!("we have no value for `false`, but we can panic")
        }
    };

    println!("Exercise Failed if printing out this line!");
}
```

#### 我的解答

```rust
fn main() {
    let b = false;

    let _v = match b {
        true => 1,
        // 发散函数也可以用于 `match` 表达式，用于替代任何类型的值
        false => {
            println!("Success!");
            panic!("we have no value for `false`, but we can panic")
        }
    };

    println!("Exercise Failed if printing out this line!");
}
```

# 所有权与借用

## 所有权

### 问题一

```rust
fn main() {
    // 使用尽可能多的方法来通过编译
    let x = String::from("hello, world");
    let y = x;
    println!("{},{}", x, y);
}
```

#### 我的解答

```rust
fn main() {
    let x = String::from("hello, world");
    let y = x.clone();
    println!("{},{}", x, y);
}
```

```rust
fn main() {
    let x = String::from("hello, world");
    let y = &x;
    println!("{},{}", x, y);
}
```

```rust
fn main() {
    let x = "hello, world";
    let y = x;
    println!("{},{}", x, y);
}
```

```rust
fn main() {
    let x = String::from("hello, world");
    let y = x.as_str();
    println!("{},{}", x, y);
}
```

### 问题二

```rust
// 不要修改 main 中的代码
fn main() {
    let s1 = String::from("hello, world");
    let s2 = take_ownership(s1);

    println!("{}", s2);
}

// 只能修改下面的代码!
fn take_ownership(s: String) {
    println!("{}", s);
}
```

#### 我的解答

```rust
fn main() {
    let s1 = String::from("hello, world");
    let s2 = take_ownership(s1);

    println!("{}", s2);
}

fn take_ownership(s: String) -> String {
    println!("{}", s);
    s
}
```

### 问题三

```rust
fn main() {
    let s = give_ownership();
    println!("{}", s);
}

// 只能修改下面的代码!
fn give_ownership() -> String {
    let s = String::from("hello, world");
    // convert String to Vec
    // 将 String 转换成 Vec 类型
    let _s = s.into_bytes();
    s
}
```

#### 我的解答

```rust
fn main() {
    let s = give_ownership();
    println!("{}", s);
}

fn give_ownership() -> String {
    let s = String::from("hello, world");
    // convert String to Vec
    // 将 String 转换成 Vec 类型
    let _s = s.as_bytes();
    s
}
```

```rust
fn main() {
    let s = give_ownership();
    println!("{}", s);
}

// Only modify the code below!
fn give_ownership() -> String {
    let s = String::from("hello, world");
    s
}
```

### 问题四

```rust
// 修复错误，不要删除任何代码行
fn main() {
    let s = String::from("hello, world");

    print_str(s);

    println!("{}", s);
}

fn print_str(s: String)  {
    println!("{}",s)
}
```

#### 我的解答

```rust
fn main() {
    let s = String::from("hello, world");

    print_str(&s);

    println!("{}", s);
}

fn print_str(s: &String) {
    println!("{}", s)
}
```

```rust
fn main() {
    let s = String::from("hello, world");

    print_str(s.clone());

    println!("{}", s);
}

fn print_str(s: String)  {
    println!("{}",s)
}
```

### 问题五

```rust
// 不要使用 clone，使用 copy 的方式替代
fn main() {
    let x = (1, 2, (), "hello".to_string());
    let y = x.clone();
    println!("{:?}, {:?}", x, y);
}
```

#### 我的解答

```rust
fn main() {
    let x = (1, 2, (), "hello");
    let y = x;
    println!("{:?}, {:?}", x, y);
}
```

### 问题六

当所有权转移时，可变性也可以随之改变

```rust
fn main() {
    let s = String::from("hello, ");

    // 只修改下面这行代码 !
    let s1 = s;

    s1.push_str("world")
}
```

#### 我的解答

```rust
fn main() {
    let s = String::from("hello, ");

    let mut s1 = s;

    s1.push_str("world")
}
```

### 问题七

```rust
fn main() {
    let x = Box::new(5);

    let ...      // 完成该行代码，不要修改其它行！

    *y = 4;

    assert_eq!(*x, 5);
}
```

#### 我的解答

```rust
fn main() {
    let x = Box::new(5);

    let mut y = Box::new(1);

    *y = 4;

    assert_eq!(*x, 5);
}
```

### 问题八

当解构一个变量时，可以同时使用 move 和引用模式绑定的方式。当这么做时，部分 move 就会发生：变量中一部分的所有权被转移给其它变量，而另一部分我们获取了它的引用。

在这种情况下，原变量将无法再被使用，但是它没有转移所有权的那一部分依然可以使用，也就是之前被引用的那部分。

```rust
fn main() {
   let t = (String::from("hello"), String::from("world"));

   let _s = t.0;

   // 仅修改下面这行代码，且不要使用 `_s`
   println!("{:?}", t);
}
```

#### 我的解答

```rust
fn main() {
    let t = (String::from("hello"), String::from("world"));

    let _s = t.0;

    println!("{:?}", t.1);
}
```

### 问题九

```rust
fn main() {
   let t = (String::from("hello"), String::from("world"));

   // 填空，不要修改其它代码
   let (__, __) = __;

   println!("{:?}, {:?}, {:?}", s1, s2, t); // -> "hello", "world", ("hello", "world")
}
```

#### 我的解答

```rust
fn main() {
    let t = (String::from("hello"), String::from("world"));

    let (ref s1, ref s2) = t;

    println!("{:?}, {:?}, {:?}", s1, s2, t); // -> "hello", "world", ("hello", "world")
}
```

```rust
fn main() {
    let t = (String::from("hello"), String::from("world"));

    let (ref s1, ref s2) = t.clone();

    println!("{:?}, {:?}, {:?}", s1, s2, t); // -> "hello", "world", ("hello", "world")
}
```

## 引用与借用

### 问题一

引用

```rust
fn main() {
   let x = 5;
   // 填写空白处
   let p = __;

   println!("x 的内存地址是 {:p}", p); // output: 0x16fa3ac84
}
```

#### 我的解答

```rust
fn main() {
    let x = 5;
    // 填写空白处
    let p = &x;

    println!("x 的内存地址是 {:p}", p); // output: 0x16fa3ac84
}
```

### 问题二

```rust
fn main() {
    let x = 5;
    let y = &x;

    // 只能修改以下行
    assert_eq!(5, y);
}
```

#### 我的解答

```rust
fn main() {
    let x = 5;
    let y = &x;

    // 只能修改以下行
    assert_eq!(5, *y);
}
```

### 问题三

```rust
// 修复错误
fn main() {
    let mut s = String::from("hello, ");

    borrow_object(s)
}

fn borrow_object(s: &String) {}
```

#### 我的解答

```rust
// 修复错误
fn main() {
    let mut s = String::from("hello, ");

    borrow_object(&s)
}

fn borrow_object(s: &String) {}
```

### 问题四

```rust
// 修复错误
fn main() {
    let mut s = String::from("hello, ");

    push_str(s)
}

fn push_str(s: &mut String) {
    s.push_str("world")
}
```

#### 我的解答

```rust
// 修复错误
fn main() {
    let mut s = String::from("hello, ");

    push_str(&mut s)
}

fn push_str(s: &mut String) {
    s.push_str("world")
}
```

### 问题五

```rust
fn main() {
    let mut s = String::from("hello, ");

    // 填写空白处，让代码工作
    let p = __;

    p.push_str("world");
}
```

#### 我的解答

```rust
fn main() {
    let mut s = String::from("hello, ");

    // 填写空白处，让代码工作
    let p = &mut s;

    p.push_str("world");
}
```

### 问题六

ref 与 & 类似，可以用来获取一个值的引用，但是它们的用法有所不同。

```rust
fn main() {
    let c = '中';

    let r1 = &c;
    // 填写空白处，但是不要修改其它行的代码
    let __ r2 = c;

    assert_eq!(*r1, *r2);

    // 判断两个内存地址的字符串是否相等
    assert_eq!(get_addr(r1),get_addr(r2));
}

// 获取传入引用的内存地址的字符串形式
fn get_addr(r: &char) -> String {
    format!("{:p}", r)
}
```

#### 我的解答

```rust
fn main() {
    let c = '中';

    let r1 = &c;
    let ref r2 = c;

    assert_eq!(*r1, *r2);

    assert_eq!(get_addr(r1), get_addr(r2));
}

fn get_addr(r: &char) -> String {
    format!("{:p}", r)
}
```

### 问题七

借用规则

```rust
// 移除代码某个部分，让它工作
// 你不能移除整行的代码！
fn main() {
    let mut s = String::from("hello");

    let r1 = &mut s;
    let r2 = &mut s;

    println!("{}, {}", r1, r2);
}
```

#### 我的解答

```rust
// 移除代码某个部分，让它工作
// 你不能移除整行的代码！
fn main() {
    let mut s = String::from("hello");

    let r1 = &s;
    let r2 = &s;

    println!("{}, {}", r1, r2);
}
```

### 问题八

错误: 从不可变对象借用可变

```rust
fn main() {
    // 通过修改下面一行代码来修复错误
    let s = String::from("hello, ");

    borrow_object(&mut s)
}

fn borrow_object(s: &mut String) {}
```

#### 我的解答

```rust
fn main() {
    let mut s = String::from("hello, ");

    borrow_object(&mut s)
}

fn borrow_object(s: &mut String) {}
```

```rust
fn main() {
    let mut s = String::from("hello, ");

    borrow_object(&s);

    s.push_str("world");
}

fn borrow_object(s: &String) {}
```

### 问题九

NLL

```rust
// 注释掉一行代码让它工作
fn main() {
    let mut s = String::from("hello, ");

    let r1 = &mut s;
    r1.push_str("world");
    let r2 = &mut s;
    r2.push_str("!");

    println!("{}",r1);
}
```

#### 我的解答

```rust
fn main() {
    let mut s = String::from("hello, ");

    let r1 = &mut s;
    r1.push_str("world");
    let r2 = &mut s;
    r2.push_str("!");

    // println!("{}",r1);
}
```

### 问题十

```rust
fn main() {
    let mut s = String::from("hello, ");

    let r1 = &mut s;
    let r2 = &mut s;

    // 在下面增加一行代码人为制造编译错误：cannot borrow `s` as mutable more than once at a time
    // 你不能同时使用 r1 和 r2
}
```

#### 我的解答

```rust
fn main() {
    let mut s = String::from("hello, ");

    let r1 = &mut s;
    let r2 = &mut s;

    println!("{}", r1)
}
```

# 复合类型

## 字符串

### 问题一

正常情况下我们无法使用 str 类型，但是可以使用 &str 来替代

```rust
// 修复错误，不要新增代码行
fn main() {
    let s: str = "hello, world";
}
```

#### 我的解答

```rust
fn main() {
    let s: &str = "hello, world";
}
```

### 问题二

如果要使用 str 类型，只能配合 Box。 & 可以用来将 `Box<str>` 转换为 &str 类型

```rust
// 使用至少两种方法来修复错误
fn main() {
    let s: Box<str> = "hello, world".into();
    greetings(s)
}

fn greetings(s: &str) {
    println!("{}",s)
}
```

#### 我的解答

```rust
fn main() {
    let s: Box<str> = "hello, world".into();
    greetings(&s)
}

fn greetings(s: &str) {
    println!("{}", s)
}
```

```rust
fn main() {
    let s: Box<&str> = "hello, world".into();
    greetings(*s)
}

fn greetings(s: &str) {
    println!("{}", s);
}
```

### 问题三

String 是定义在标准库中的类型，分配在堆上，可以动态的增长。它的底层存储是动态字节数组的方式(`Vec<u8>`)，但是与字节数组不同，String 是 UTF-8 编码。

```rust
// 填空
fn main() {
    let mut s = __;
    s.push_str("hello, world");
    s.push('!');

    assert_eq!(s, "hello, world!");
}
```

#### 我的解答

```rust
fn main() {
    let mut s = String::from("");
    s.push_str("hello, world");
    s.push('!');

    assert_eq!(s, "hello, world!");
}
```

```rust
fn main() {
    let mut s = String::new();
    s.push_str("hello, world");
    s.push('!');

    assert_eq!(s, "hello, world!");
}
```

### 问题四

```rust
// 修复所有错误，并且不要新增代码行
fn main() {
    let  s = String::from("hello");
    s.push(',');
    s.push(" world");
    s += "!".to_string();

    println!("{}", s)
}
```

#### 我的解答

```rust
fn main() {
    let mut s = String::from("hello");
    s.push(',');
    s.push_str(" world");
    s += "!";

    println!("{}", s)
}
```

### 问题五

我们可以用 replace 方法来替换指定的子字符串

```rust
// 填空
fn main() {
    let s = String::from("I like dogs");
    // 以下方法会重新分配一块内存空间，然后将修改后的字符串存在这里
    let s1 = s.__("dogs", "cats");

    assert_eq!(s1, "I like cats")
}
```

#### 我的解答

```rust
fn main() {
    let s = String::from("I like dogs");
    let s1 = s.replace("dogs", "cats");

    assert_eq!(s1, "I like cats")
}
```

### 问题六

你只能将 String 跟 &str 类型进行拼接，并且 String 的所有权在此过程中会被 move

```rust
// 修复所有错误，不要删除任何一行代码
fn main() {
    let s1 = String::from("hello,");
    let s2 = String::from("world!");
    let s3 = s1 + s2;
    assert_eq!(s3,"hello,world!");
    println!("{}",s1);
}
```

#### 我的解答

```rust
fn main() {
    let s1 = String::from("hello,");
    let s2 = String::from("world!");
    let s3 = s1.clone() + &s2;
    assert_eq!(s3, "hello,world!");
    println!("{}", s1);
}
```

### 问题七

我们可以使用两种方法将 &str 转换成 String 类型

```rust
// 使用至少两种方法来修复错误
fn main() {
    let s = "hello, world";
    greetings(s)
}

fn greetings(s: String) {
    println!("{}",s)
}
```

#### 我的解答

```rust
fn main() {
    let s = "hello, world";
    greetings(s)
}

fn greetings(s: &str) {
    println!("{}", s)
}
```

```rust
fn main() {
    let s = "hello, world".to_string();
    greetings(s)
}

fn greetings(s: String) {
    println!("{}", s)
}
```

```rust
fn main() {
    let s = String::from("hello, world");
    greetings(s)
}

fn greetings(s: String) {
    println!("{}", s)
}
```

### 问题八

我们可以使用 String::from 或 `to_string` 将 &str 转换成 String 类型

```rust
// 使用两种方法来解决错误，不要新增代码行
fn main() {
    let s = "hello, world".to_string();
    let s1: &str = s;
}
```

#### 我的解答

```rust
fn main() {
    let s = "hello, world".to_string();
    let s1: &str = &s;
}
```

```rust
fn main() {
    let s = "hello, world";
    let s1: &str = &s;
}
```

```rust
fn main() {
    let s = "hello, world".to_string();
    let s1: &str = &s[..];
}
```

```rust
fn main() {
    let s = "hello, world".to_string();
    let s1: &str = s.as_str();
}
```

### 问题九

```rust
fn main() {
    // 你可以使用转义的方式来输出想要的字符，这里我们使用十六进制的值，例如 \x73 会被转义成小写字母 's'
    // 填空以输出 "I'm writing Rust"
    let byte_escape = "I'm writing Ru\x73__!";
    println!("What are you doing\x3F (\\x3F means ?) {}", byte_escape);

    // 也可以使用 Unicode 形式的转义字符
    let unicode_codepoint = "\u{211D}";
    let character_name = "\"DOUBLE-STRUCK CAPITAL R\"";

    println!("Unicode character {} (U+211D) is called {}",
                unicode_codepoint, character_name );

    // 还能使用 \ 来连接多行字符串
    let long_string = "String literals
                        can span multiple lines.
                        The linebreak and indentation here \
                         can be escaped too!";
    println!("{}", long_string);
}
```

#### 我的解答

```rust
fn main() {
    let byte_escape = "I'm writing Ru\x73\x74!";
    println!("What are you doing\x3F (\\x3F means ?) {}", byte_escape);

    let unicode_codepoint = "\u{211D}";
    let character_name = "\"DOUBLE-STRUCK CAPITAL R\"";

    println!("Unicode character {} (U+211D) is called {}",
                unicode_codepoint, character_name );

   let long_string = "String literals
                        can span multiple lines.
                        The linebreak and indentation here \
                         can be escaped too!";
    println!("{}", long_string);
}
```

### 问题十

有时候需要转义的字符很多，我们会希望使用更方便的方式来书写字符串: raw string.

```rust
/* 填空并修复所有错误 */
fn main() {
    let raw_str = r"Escapes don't work here: \x3F \u{211D}";
    // 修改上面的行让代码工作
    assert_eq!(raw_str, "Escapes don't work here: ? ℝ");

    // 如果你希望在字符串中使用双引号，可以使用以下形式
    let quotes = r#"And then I said: "There is no escape!""#;
    println!("{}", quotes);

    // 如果希望在字符串中使用 # 号，可以如下使用：
    let  delimiter = r###"A string with "# in it. And even "##!"###;
    println!("{}", delimiter);

    // 填空
    let long_delimiter = __;
    assert_eq!(long_delimiter, "Hello, \"##\"")
}
```

#### 我的解答

```rust
fn main() {
    let raw_str = "Escapes don't work here: \x3F \u{211D}";
    assert_eq!(raw_str, "Escapes don't work here: ? ℝ");

    let quotes = r#"And then I said: "There is no escape!""#;
    println!("{}", quotes);

    let delimiter = r###"A string with "# in it. And even "##!"###;
    println!("{}", delimiter);

    let long_delimiter = r###"Hello, "##""###;
    assert_eq!(long_delimiter, "Hello, \"##\"")
}
```

### 问题十一

你无法通过索引的方式去访问字符串中的某个字符，但是可以使用切片的方式 `&s1[start..end]`，但是 start 和 end 必须准确落在字符的边界处

```rust
fn main() {
    let s1 = String::from("hi,中国");
    let h = s1[0]; // 修改当前行来修复错误，提示: `h` 字符在 UTF-8 格式中只需要 1 个字节来表示
    assert_eq!(h, "h");

    let h1 = &s1[3..5];// 修改当前行来修复错误，提示: `中` 字符在 UTF-8 格式中需要 3 个字节来表示
    assert_eq!(h1, "中");
}
```

#### 我的解答

```rust
fn main() {
    let s1 = String::from("hi,中国");
    let h = &s1[0..1];
    assert_eq!(h, "h");

    let h1 = &s1[3..6];
    assert_eq!(h1, "中");
}
```

### 问题十二

```rust
fn main() {
    // 填空，打印出 "你好，世界" 中的每一个字符
    for c in "你好，世界".__ {
        println!("{}", c)
    }
}
```

#### 我的解答

```rust
fn main() {
    for c in "你好，世界".chars() {
        println!("{}", c)
    }
}
```

### 问题十三

我们可以使用三方库 `utf8_slice` 来访问 UTF-8 字符串的某个子串，但是与之前不同的是，该库索引的是字符，而不是字节

```rust
use utf8_slice;
fn main() {
    let s = "The 🚀 goes to the 🌑!";

    let rocket = utf8_slice::slice(s, 4, 5);
    // 结果是 "🚀"，索引的是字符
}
```

## 数组

### 问题一

数组的类型是 [T; Length]，就如你所看到的，数组的长度是类型签名的一部分，因此数组的长度必须在编译期就已知

```rust
fn main() {
    // 使用合适的类型填空
    let arr: __ = [1, 2, 3, 4, 5];

    // 修改以下代码，让它顺利运行
    assert!(arr.len() == 4);
}
```

#### 我的解答

```rust
fn main() {
    let arr: [i32; 5] = [1, 2, 3, 4, 5];

    assert!(arr.len() == 5);
}
```

### 问题二

```rust
fn main() {
    // 很多时候，我们可以忽略数组的部分类型，也可以忽略全部类型，让编译器帮助我们推导
    let arr0 = [1, 2, 3];
    let arr: [_; 3] = ['a', 'b', 'c'];

    // 填空
    // 数组分配在栈上， `std::mem::size_of_val` 函数会返回整个数组占用的内存空间
    // 数组中的每个 char 元素占用 4 字节的内存空间，因为在 Rust 中， char 是 Unicode 字符
    assert!(std::mem::size_of_val(&arr) == __);
}
```

#### 我的解答

```rust
fn main() {
    let arr0 = [1, 2, 3];
    let arr: [_; 3] = ['a', 'b', 'c'];

    assert!(std::mem::size_of_val(&arr) == 12);
}
```

### 问题三

数组中的所有元素可以一起初始化为同一个值

```rust
fn main() {
    // 填空
    let list: [i32; 100] = __ ;

    assert!(list[0] == 1);
    assert!(list.len() == 100);
}
```

#### 我的解答

```rust
fn main() {
    let list: [i32; 100] = [1; 100];

    assert!(list[0] == 1);
    assert!(list.len() == 100);
}
```

### 问题四

数组中的所有元素必须是同一类型

```rust
fn main() {
    // 修复错误
    let _arr = [1, 2, '3'];
}
```

#### 我的解答

```rust
fn main() {
    let _arr = [1, 2, 3];
}
```

### 问题五

数组的下标索引从 0 开始

```rust
fn main() {
    let arr = ['a', 'b', 'c'];

    let ele = arr[1]; // 只修改此行来让代码工作

    assert!(ele == 'a');
}
```

#### 我的解答

```rust
fn main() {
    let arr = ['a', 'b', 'c'];

    let ele = arr[0];

    assert!(ele == 'a');
}
```

### 问题六

越界索引会导致代码的 panic

```rust
// 修复代码中的错误
fn main() {
    let names = [String::from("Sunfei"), "Sunface".to_string()];

    // `get` 返回 `Option<T>` 类型，因此它的使用非常安全
    let name0 = names.get(0).unwrap();

    // 但是下标索引就存在越界的风险了
    let _name1 = &names[2];
}
```

#### 我的解答

```rust
fn main() {
    let names = [String::from("Sunfei"), "Sunface".to_string()];

    let name0 = names.get(0).unwrap();

    let _name1 = &names[1];
}
```

## 切片

### 问题一

这里 `[i32]` 和 str 都是切片类型，但是直接使用它们会造成编译错误，如下代码所示。为了解决，你需要使用切片的引用： `&[i32]`，&str

```rust
// 修复代码中的错误，不要新增代码行!
fn main() {
    let arr = [1, 2, 3];
    let s1: [i32] = arr[0..2];

    let s2: str = "hello, world" as str;
}
```

#### 我的解答

```rust
fn main() {
    let arr = [1, 2, 3];
    let s1: &[i32] = &arr[0..2];

    let s2: &str = "hello, world";
}
```

### 问题二

一个切片引用占用了 2 个字大小的内存空间(从现在开始，为了简洁性考虑，如无特殊原因，我们统一使用切片来特指切片引用)。该切片的第一个字是指向数据的指针，第二个字是切片的长度。字的大小取决于处理器架构，例如在 x86-64 上，字的大小是 64 位也就是 8 个字节，那么一个切片引用就是 16 个字节大小。

切片(引用)可以用来借用数组的某个连续的部分，对应的签名是 `&[T]`，大家可以与数组的签名对比下 `[T; Length]`。

```rust
fn main() {
    let arr: [char; 3] = ['中', '国', '人'];

    let slice = &arr[..2];

    // 修改数字 `8` 让代码工作
    // 小提示: 切片和数组不一样，它是引用。如果是数组的话，那下面的 `assert!` 将会通过： '中'和'国'是 char 类型，char 类型是 Unicode 编码，大小固定为 4 字节，两个字符为 8 字节。
    assert!(std::mem::size_of_val(&slice) == 8);
}
```

#### 我的解答

```rust
fn main() {
    let arr: [char; 3] = ['中', '国', '人'];

    let slice = &arr[..2];

    // 16 是切片大小
    assert!(std::mem::size_of_val(&slice) == 16);
    // 8 是数组大小
    assert!(std::mem::size_of_val(slice) == 8);
}
```

### 问题三

```rust
fn main() {
   let arr: [i32; 5] = [1, 2, 3, 4, 5];
  // 填空让代码工作起来
  let slice: __ = __;
  assert_eq!(slice, &[2, 3, 4]);
}
```

#### 我的解答

```rust
fn main() {
    let arr: [i32; 5] = [1, 2, 3, 4, 5];
    // let slice: &[i32] = &arr[1..=3];
    let slice: &[i32] = &arr[1..4];
    assert_eq!(slice, &[2, 3, 4]);
}
```

### 问题四

```rust
fn main() {
    let s = String::from("hello");

    let slice1 = &s[0..2];
    // 填空，不要再使用 0..2
    let slice2 = &s[__];

    assert_eq!(slice1, slice2);
}
```

#### 我的解答

```rust
fn main() {
    let s = String::from("hello");

    let slice1 = &s[0..2];
    // let slice2 = &s[..=1];
    let slice2 = &s[..2];

    assert_eq!(slice1, slice2);
}
```

### 问题五

```rust
fn main() {
    let s = "你好，世界";
    // 修改以下代码行，让代码工作起来
    let slice = &s[0..2];

    assert!(slice == "你");
}
```

#### 我的解答

```rust
fn main() {
    let s = "你好，世界";
    let slice = &s[0..3];

    assert!(slice == "你");
}
```

### 问题六

&String 可以被隐式地转换成 &str 类型

```rust
// 修复所有错误
fn main() {
    let mut s = String::from("hello world");

    // 这里, &s 是 `&String` 类型，但是 `first_character` 函数需要的是 `&str` 类型。
    // 尽管两个类型不一样，但是代码仍然可以工作，原因是 `&String` 会被隐式地转换成 `&str` 类型，如果大家想要知道更多，可以看看 Deref 章节: https://course.rs/advance/smart-pointer/deref.html
    let ch = first_character(&s);

    s.clear(); // error!

    println!("the first character is: {}", ch);
}
fn first_character(s: &str) -> &str {
    &s[..1]
}
```

#### 我的解答

```rust
fn main() {
    let mut s = String::from("hello world");

    let ch = first_character(&s);

    println!("the first character is: {}", ch);

    s.clear(); // error!
}

fn first_character(s: &str) -> &str {
    &s[..1]
}
```

## 元组

### 问题一

元组中的元素可以是不同的类型。元组的类型签名是(T1, T2, ...), 这里 T1, T2 是相对应的元组成员的类型

```rust
fn main() {
    let _t0: (u8,i16) = (0, -1);
    // 元组的成员还可以是一个元组
    let _t1: (u8, (i16, u32)) = (0, (-1, 1));
    // 填空让代码工作
    let t: (u8, __, i64, __, __) = (1u8, 2u16, 3i64, "hello", String::from(", world"));
}
```

#### 我的解答

```rust
fn main() {
    let _t0: (u8,i16) = (0, -1);
    let _t1: (u8, (i16, u32)) = (0, (-1, 1));
    let t: (u8, u16, i64, &str, String) = (1u8, 2u16, 3i64, "hello", String::from(", world"));
}
```

### 问题二

可以使用索引来获取元组的成员

```rust
// 修改合适的地方，让代码工作
fn main() {
    let t = ("i", "am", "sunface");
    assert_eq!(t.1, "sunface");
}
```

#### 我的解答

```rust
fn main() {
    let t = ("i", "am", "sunface");
    assert_eq!(t.2, "sunface");
}
```

### 问题三

过长的元组无法被打印输出

```rust
// 修复代码错误
fn main() {
    let too_long_tuple = (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13);
    println!("too long tuple: {:?}", too_long_tuple);
}
```

#### 我的解答

```rust
fn main() {
    let too_long_tuple = (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12);
    println!("too long tuple: {:?}", too_long_tuple);
}
```

### 问题四

使用模式匹配来解构元组

```rust
fn main() {
    let tup = (1, 6.4, "hello");

    // 填空
    let __ = tup;

    assert_eq!(x, 1);
    assert_eq!(y, "hello");
    assert_eq!(z, 6.4);
}
```

#### 我的解答

```rust
fn main() {
    let tup = (1, 6.4, "hello");

    let (x, z, y) = tup;

    assert_eq!(x, 1);
    assert_eq!(y, "hello");
    assert_eq!(z, 6.4);
}
```

### 问题五

解构式赋值

```rust
fn main() {
    let (x, y, z);

    // 填空
    __ = (1, 2, 3);

    assert_eq!(x, 3);
    assert_eq!(y, 1);
    assert_eq!(z, 2);
}
```

#### 我的解答

```rust
fn main() {
    let (x, y, z);

    (y, z, x) = (1, 2, 3);

    assert_eq!(x, 3);
    assert_eq!(y, 1);
    assert_eq!(z, 2);
}
```

### 问题六

元组可以用于函数的参数和返回值

```rust
fn main() {
    // 填空，需要稍微计算下
    let (x, y) = sum_multiply(__);

    assert_eq!(x, 5);
    assert_eq!(y, 6);
}

fn sum_multiply(nums: (i32, i32)) -> (i32, i32) {
    (nums.0 + nums.1, nums.0 * nums.1)
}
```

#### 我的解答

```rust
fn main() {
    let (x, y) = sum_multiply((2, 3));

    assert_eq!(x, 5);
    assert_eq!(y, 6);
}

fn sum_multiply(nums: (i32, i32)) -> (i32, i32) {
    (nums.0 + nums.1, nums.0 * nums.1)
}
```

## 结构体

### 问题一

对于结构体，我们必须为其中的每一个字段都指定具体的值

```rust
// fix the error
struct Person {
    name: String,
    age: u8,
    hobby: String
}
fn main() {
    let age = 30;
    let p = Person {
        name: String::from("sunface"),
        age,
    };
}
```

#### 我的解答

```rust
struct Person {
    name: String,
    age: u8,
    hobby: String,
}
fn main() {
    let age = 30;
    let p = Person {
        name: String::from("sunface"),
        age,
        hobby: String::from("dsa"),
    };
}
```

### 问题二

单元结构体没有任何字段

```rust
struct Unit;
trait SomeTrait {
    // ...定义一些行为
}

// 我们并不关心结构体中有什么数据( 字段 )，但我们关心它的行为。
// 因此这里我们使用没有任何字段的单元结构体，然后为它实现一些行为
impl SomeTrait for Unit {  }
fn main() {
    let u = Unit;
    do_something_with_unit(u);
}

// 填空，让代码工作
fn do_something_with_unit(u: __) {   }
```

#### 我的解答

```rust
struct Unit;
trait SomeTrait {
}

impl SomeTrait for Unit {}
fn main() {
    let u = Unit;
    do_something_with_unit(u);
}

fn do_something_with_unit(u: Unit) {}
```

### 问题三

元组结构体看起来跟元组很像，但是它拥有一个结构体的名称，该名称可以赋予它一定的意义。由于它并不关心内部数据到底是什么名称，因此此时元组结构体就非常适合

```rust
// 填空并修复错误
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);
fn main() {
    let v = Point(__, __, __);
    check_color(v);
}

fn check_color(p: Color) {
   let (x, _, _) = p;
   assert_eq!(x, 0);
   assert_eq!(p.1, 127);
   assert_eq!(__, 255);
}
```

#### 我的解答

```rust
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);
fn main() {
    let v = Point(0, 127, 255);
    check_color(v);
}

fn check_color(p: Point) {
    let Point(x, y, z) = p;
    assert_eq!(x, 0);
    assert_eq!(p.1, 127);
    assert_eq!(z, 255);
}
```

### 问题四

你可以在实例化一个结构体时将它整体标记为可变的，但是 Rust 不允许我们将结构体的某个字段专门指定为可变的

```rust
// 填空并修复错误，不要增加或移除代码行
struct Person {
    name: String,
    age: u8,
}
fn main() {
    let age = 18;
    let p = Person {
        name: String::from("sunface"),
        age,
    };

    // how can you believe sunface is only 18?
    p.age = 30;

    // 填空
    __ = String::from("sunfei");
}
```

#### 我的解答

```rust
struct Person {
    name: String,
    age: u8,
}
fn main() {
    let age = 18;
    let mut p = Person {
        name: String::from("sunface"),
        age,
    };

    p.age = 30;

    p.name = String::from("sunfei");
}
```

### 问题五

使用结构体字段初始化缩略语法可以减少一些重复代码

```rust
// 填空
struct Person {
    name: String,
    age: u8,
}
fn main() {}

fn build_person(name: String, age: u8) -> Person {
    Person {
        age,
        __
    }
}
```

#### 我的解答

```rust
struct Person {
    name: String,
    age: u8,
}
fn main() {}

fn build_person(name: String, age: u8) -> Person {
    Person {
        age,
        name
    }
}
```

### 问题六

你可以使用结构体更新语法基于一个结构体实例来构造另一个

```rust
// 填空，让代码工作
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}
fn main() {
    let u1 = User {
        email: String::from("someone@example.com"),
        username: String::from("sunface"),
        active: true,
        sign_in_count: 1,
    };

    let u2 = set_email(u1);
}

fn set_email(u: User) -> User {
    User {
        email: String::from("contact@im.dev"),
        __
    }
}
```

#### 我的解答

```rust
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}
fn main() {
    let u1 = User {
        email: String::from("someone@example.com"),
        username: String::from("sunface"),
        active: true,
        sign_in_count: 1,
    };

    let u2 = set_email(u1);
}

fn set_email(u: User) -> User {
    User {
        email: String::from("contact@im.dev"),
        ..u
    }
}
```

### 问题七

我们可以使用 `#[derive(Debug)]` 让结构体变成可打印的.

```rust
// 填空，让代码工作
#[__]
struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    let scale = 2;
    let rect1 = Rectangle {
        width: dbg!(30 * scale), // 打印 debug 信息到标准错误输出 stderr,并将 `30 * scale` 的值赋给 `width`
        height: 50,
    };

    dbg!(&rect1); // 打印 debug 信息到标准错误输出 stderr

    println!(__, rect1); // 打印 debug 信息到标准输出 stdout
}
```

#### 我的解答

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    let scale = 2;
    let rect1 = Rectangle {
        width: dbg!(30 * scale),
        height: 50,
    };

    dbg!(&rect1);

    println!("{:#?}", rect1);
}
```

### 问题八

当解构一个变量时，可以同时使用 move 和引用模式绑定的方式。当这么做时，部分 move 就会发生：变量中一部分的所有权被转移给其它变量，而另一部分我们获取了它的引用。

在这种情况下，原变量将无法再被使用，但是它没有转移所有权的那一部分依然可以使用，也就是之前被引用的那部分。

```rust
fn main() {
    #[derive(Debug)]
    struct Person {
        name: String,
        age: Box<u8>,
    }

    let person = Person {
        name: String::from("Alice"),
        age: Box::new(20),
    };

    // 通过这种解构式模式匹配，person.name 的所有权被转移给新的变量 `name`
    // 但是，这里 `age` 变量确是对 person.age 的引用, 这里 ref 的使用相当于: let age = &person.age
    let Person { name, ref age } = person;

    println!("The person's age is {}", age);

    println!("The person's name is {}", name);

    // Error! 原因是 person 的一部分已经被转移了所有权，因此我们无法再使用它
    //println!("The person struct is {:?}", person);

    // 虽然 `person` 作为一个整体无法再被使用，但是 `person.age` 依然可以使用
    println!("The person's age from person struct is {}", person.age);
}
```

### 问题九

```rust
// 修复错误
#[derive(Debug)]
struct File {
    name: String,
    data: String,
}
fn main() {
    let f = File {
        name: String::from("readme.md"),
        data: "Rust By Practice".to_string()
    };

    let _name = f.name;

    // 只能修改这一行
    println!("{}, {}, {:?}",f.name, f.data, f);
}
```

#### 我的解答

```rust
#[derive(Debug)]
struct File {
    name: String,
    data: String,
}
fn main() {
    let f = File {
        name: String::from("readme.md"),
        data: "Rust By Practice".to_string(),
    };

    let _name = f.name;

    println!("{}, {}", _name, f.data);
}
```

## 枚举

### 问题一

在创建枚举时，你可以使用显式的整数设定枚举成员的值

```rust
// 修复错误
enum Number {
    Zero,
    One,
    Two,
}

enum Number1 {
    Zero = 0,
    One,
    Two,
}

// C语言风格的枚举定义
enum Number2 {
    Zero = 0.0,
    One = 1.0,
    Two = 2.0,
}


fn main() {
    // 通过 `as` 可以将枚举值强转为整数类型
    assert_eq!(Number::One, Number1::One);
    assert_eq!(Number1::One, Number2::One);
}
```

#### 我的解答

```rust
enum Number {
    Zero,
    One,
    Two,
}

enum Number1 {
    Zero = 0,
    One,
    Two,
}

enum Number2 {
    Zero = 0,
    One = 1,
    Two = 2,
}


fn main() {
    assert_eq!(Number::One as u8, Number1::One as u8);
    assert_eq!(Number1::One as u8, Number2::One as u8);
}
```

### 问题二

枚举成员可以持有各种类型的值

```rust
// 填空
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

fn main() {
    let msg1 = Message::Move{__}; // 使用x = 1, y = 2 来初始化
    let msg2 = Message::Write(__); // 使用 "hello, world!" 来初始化
}
```

#### 我的解答

```rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

fn main() {
    let msg1 = Message::Move { x: 1, y: 2 };
    let msg2 = Message::Write(String::from("hello, world!"));
}
```

### 问题三

枚举成员中的值可以使用模式匹配来获取

```rust
// 仅填空并修复错误
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

fn main() {
    let msg = Message::Move{x: 1, y: 2};

    if let Message::Move{__} = msg {
        assert_eq!(a, b);
    } else {
        panic!("不要让这行代码运行！");
    }
}
```

#### 我的解答

```rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

fn main() {
    let msg = Message::Move { x: 1, y: 1 };

    if let Message::Move { x: a, y: b } = msg {
        assert_eq!(a, b);
    } else {
        panic!("不要让这行代码运行！");
    }
}
```

### 问题四

使用枚举对类型进行同一化

```rust
// 填空，并修复错误
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

fn main() {
    let msgs: __ = [
        Message::Quit,
        Message::Move{x:1, y:3},
        Message::ChangeColor(255,255,0)
    ];

    for msg in msgs {
        show_message(msg)
    }
}

fn show_message(msg: Message) {
    println!("{}", msg);
}
```

#### 我的解答

```rust
#[derive(Debug)]
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

fn main() {
    let msgs = [
        Message::Quit,
        Message::Move { x: 1, y: 3 },
        Message::ChangeColor(255, 255, 0),
    ];

    for msg in msgs {
        show_message(msg)
    }
}

fn show_message(msg: Message) {
    println!("{:#?}", msg);
}
```

### 问题五

Rust 中没有 null，我们通过 `Option<T>` 枚举来处理值为空的情况

```rust
// 填空让 `println` 输出，同时添加一些代码不要让最后一行的 `panic` 执行到
fn main() {
    let five = Some(5);
    let six = plus_one(five);
    let none = plus_one(None);

    if let __ = six {
        println!("{}", n)
    }

    panic!("不要让这行代码运行！");
}

fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        __ => None,
        __ => Some(i + 1),
    }
}
```

#### 我的解答

```rust
fn main() {
    let five = Some(5);
    let six = plus_one(five);
    let none = plus_one(None);

    if let Some(n) = six {
        println!("{}", n);
        return
    }

    panic!("不要让这行代码运行！");
}

fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        None => None,
        Some(i) => Some(i + 1),
    }
}
```

### 问题六

使用枚举来实现链表

```rust
// 填空，让代码运行
use crate::List::*;

enum List {
    // Cons: 链表中包含有值的节点，节点是元组类型，第一个元素是节点的值，第二个元素是指向下一个节点的指针
    Cons(u32, Box<List>),
    // Nil: 链表中的最后一个节点，用于说明链表的结束
    Nil,
}

// 为枚举实现一些方法
impl List {
    // 创建空的链表
    fn new() -> List {
        // 因为没有节点，所以直接返回 Nil 节点
        // 枚举成员 Nil 的类型是 List
        Nil
    }

    // 在老的链表前面新增一个节点，并返回新的链表
    fn prepend(self, elem: u32) -> __ {
        Cons(elem, Box::new(self))
    }

    // 返回链表的长度
    fn len(&self) -> u32 {
        match *self {
            // 这里我们不能拿走 tail 的所有权，因此需要获取它的引用
            Cons(_, __ tail) => 1 + tail.len(),
            // 空链表的长度为 0
            Nil => 0
        }
    }

    // 返回链表的字符串表现形式，用于打印输出
    fn stringify(&self) -> String {
        match *self {
            Cons(head, ref tail) => {
                // 递归生成字符串
                format!("{}, {}", head, tail.__())
            },
            Nil => {
                format!("Nil")
            },
        }
    }
}

fn main() {
    // 创建一个新的链表(也是空的)
    let mut list = List::new();

    // 添加一些元素
    list = list.prepend(1);
    list = list.prepend(2);
    list = list.prepend(3);

    // 打印列表的当前状态
    println!("链表的长度是: {}", list.len());
    println!("{}", list.stringify());
}
```

#### 我的解答

```rust
use crate::List::*;

enum List {
    Cons(u32, Box<List>),
    Nil,
}

impl List {
    fn new() -> List {
        Nil
    }

    fn prepend(self, elem: u32) -> List {
        Cons(elem, Box::new(self))
    }

    fn len(&self) -> u32 {
        match *self {
            Cons(_, ref tail) => 1 + tail.len(),
            Nil => 0
        }
    }

    fn stringify(&self) -> String {
        match *self {
            Cons(head, ref tail) => {
                format!("{}, {}", head, tail.stringify())
            },
            Nil => {
                format!("Nil")
            },
        }
    }
}

fn main() {
    let mut list = List::new();

    list = list.prepend(1);
    list = list.prepend(2);
    list = list.prepend(3);

    println!("链表的长度是: {}", list.len());
    println!("{}", list.stringify());
}
```

// TODO 练习到这里

# 流程控制

## 问题一

```rust
// 填空
fn main() {
    let n = 5;

    if n < 0 {
        println!("{} is negative", n);
    } __ n > 0 {
        println!("{} is positive", n);
    } __ {
        println!("{} is zero", n);
    }
}
```

### 我的解答

```rust
// 填空
fn main() {
    let n = 0;

    if n < 0 {
        println!("{} is negative", n);
    } else if n > 0 {
        println!("{} is positive", n);
    } else {
        println!("{} is zero", n);
    }
}
```

## 问题二

if / else 可以用作表达式来进行赋值

```rust
// 修复错误
fn main() {
    let n = 5;

    let big_n =
        if n < 10 && n > -10 {
            println!(" 数字太小，先增加 10 倍再说");

            10 * n
        } else {
            println!("数字太大，我们得让它减半");

            n / 2.0 ;
        }

    println!("{} -> {}", n, big_n);
}
```

### 我的解答

```rust
// 修复错误
fn main() {
    let n = 11;

    let big_n = if n < 10 && n > -10 {
        println!(" 数字太小，先增加 10 倍再说");

        10 * n
    } else {
        println!("数字太大，我们得让它减半");

        n / 2
    };

    println!("{} -> {}", n, big_n);
}
```

## 问题三

for in 可以用于迭代一个迭代器，例如序列 a..b

```rust
fn main() {
    for n in 1..=100 { // 修改此行，让代码工作
        if n == 100 {
            panic!("NEVER LET THIS RUN")
        }
    }
}
```

### 我的解答

```rust
fn main() {
    for n in 1..100 { // 修改此行，让代码工作
        if n == 100 {
            panic!("NEVER LET THIS RUN")
        }
    }
}
```

## 问题四

```rust
// 修复错误，不要新增或删除代码行
fn main() {
    let names = [String::from("liming"),String::from("hanmeimei")];
    for name in names {
        // do something with name...
    }

    println!("{:?}", names);

    let numbers = [1, 2, 3];
    // numbers中的元素实现了 Copy，因此无需转移所有权
    for n in numbers {
        // do something with name...
    }

    println!("{:?}", numbers);
}
```

### 我的解答

```rust
// 修复错误，不要新增或删除代码行
fn main() {
    let names = [String::from("liming"), String::from("hanmeimei")];
    for name in &names {
        // do something with name...
    }

    println!("{:?}", names);

    let numbers = [1, 2, 3];
    // numbers 中的元素实现了 Copy，因此无需转移所有权
    for n in numbers {
        // do something with name...
    }

    println!("{:?}", numbers);
}
```

## 问题五

```rust
fn main() {
    let a = [4,3,2,1];

    // 通过索引和值的方式迭代数组 `a`
    for (i,v) in a.__ {
        println!("第{}个元素是{}",i+1,v);
    }
}
```

### 我的解答

```rust
fn main() {
    let a = [4, 3, 2, 1];

    // 通过索引和值的方式迭代数组 `a`
    for (i, v) in a.iter().enumerate() {
        println!("第{}个元素是{}", i + 1, v);
    }
}
```

## 问题六

当条件为 true 时，while 将一直循环

```rust
// 填空，让最后一行的 println! 工作 !
fn main() {
    // 一个计数值
    let mut n = 1;

    // 当条件为真时，不停的循环
    while n __ 10 {
        if n % 15 == 0 {
            println!("fizzbuzz");
        } else if n % 3 == 0 {
            println!("fizz");
        } else if n % 5 == 0 {
            println!("buzz");
        } else {
            println!("{}", n);
        }


        __;
    }

    println!("n 的值是 {}, 循环结束",n);
}
```

### 我的解答

```rust
// 填空，让最后一行的  println! 工作 !
fn main() {
    // 一个计数值
    let mut n = 1;

    // 当条件为真时，不停的循环
    while n < 10 {
        if n % 15 == 0 {
            println!("fizzbuzz");
        } else if n % 3 == 0 {
            println!("fizz");
        } else if n % 5 == 0 {
            println!("buzz");
        } else {
            println!("{}", n);
        }

        n = n + 1;
    }

    println!("n 的值是 {}, 循环结束", n);
}
```

## 问题七

使用 break 可以跳出循环

```rust
// 填空，不要修改其它代码
fn main() {
    let mut n = 0;
    for i in 0..=100 {
       if n == 66 {
           __
       }
       n += 1;
    }

    assert_eq!(n, 66);
}
```

### 我的解答

```rust
// 填空，不要修改其它代码
fn main() {
    let mut n = 0;
    for i in 0..=100 {
        if n == 66 {
            break;
        }
        n += 1;
    }

    assert_eq!(n, 66);
}
```

## 问题八

continue 会结束当次循环并立即开始下一次循环

```rust
// 填空，不要修改其它代码
fn main() {
    let mut n = 0;
    for i in 0..=100 {
       if n != 66 {
           n+=1;
           __;
       }

       __
    }

    assert_eq!(n, 66);
}
```

### 我的解答

```rust
// 填空，不要修改其它代码
fn main() {
    let mut n = 0;
    for i in 0..=100 {
        if n != 66 {
            n += 1;
            continue;
        }
    }

    assert_eq!(n, 66);
}
```

## 问题九

loop 一般都需要配合 break 或 continue 一起使用

```rust
// 填空，不要修改其它代码
fn main() {
    let mut count = 0u32;

    println!("Let's count until infinity!");

    // 无限循环
    loop {
        count += 1;

        if count == 3 {
            println!("three");

            // 跳过当此循环的剩余代码
            __;
        }

        println!("{}", count);

        if count == 5 {
            println!("OK, that's enough");

            __;
        }
    }

    assert_eq!(count, 5);
}
```

### 我的解答

```rust
// 填空，不要修改其它代码
fn main() {
    let mut count = 0u32;

    println!("Let's count until infinity!");

    // 无限循环
    loop {
        count += 1;

        if count == 3 {
            println!("three");

            // 跳过当此循环的剩余代码
            continue;
        }

        println!("{}", count);

        if count == 5 {
            println!("OK, that's enough");

            break;
        }
    }

    assert_eq!(count, 5);
}
```

## 问题十

loop 是一个表达式，因此我们可以配合 break 来返回一个值

```rust
// 填空
fn main() {
    let mut counter = 0;

    let result = loop {
        counter += 1;

        if counter == 10 {
            __;
        }
    };

    assert_eq!(result, 20);
}
```

### 我的解答

```rust
// 填空
fn main() {
    let mut counter = 0;

    let result = loop {
        counter += 1;

        if counter == 10 {
            break counter * 2;
        }
    };

    assert_eq!(result, 20);
}
```

## 问题十一

当有多层循环时，你可以使用 continue 或 break 来控制外层的循环。要实现这一点，外部的循环必须拥有一个标签 `'label`, 然后在 break 或 continue 时指定该标签

```rust
// 填空
fn main() {
    let mut count = 0;
    'outer: loop {
        'inner1: loop {
            if count >= 20 {
                // 这只会跳出 inner1 循环
                break 'inner1; // 这里使用 `break` 也是一样的
            }
            count += 2;
        }

        count += 5;

        'inner2: loop {
            if count >= 30 {
                break 'outer;
            }

            continue 'outer;
        }
    }

    assert!(count == __)
}
```

### 我的解答

```rust
// 填空
fn main() {
    let mut count = 0;
    'outer: loop {
        'inner1: loop {
            if count >= 20 {
                // 这只会跳出 inner1 循环
                break 'inner1; // 这里使用 `break` 也是一样的
            }
            count += 2;
        }

        count += 5;

        'inner2: loop {
            if count >= 30 {
                break 'outer;
            }

            continue 'outer;
        }
    }

    assert!(count == 30)
}
```

# 模式匹配

## match 和 if let

### 问题一

```rust
// 填空
enum Direction {
    East,
    West,
    North,
    South,
}

fn main() {
    let dire = Direction::South;
    match dire {
        Direction::East => println!("East"),
        __  => { // 在这里匹配 South 或 North
            println!("South or North");
        },
        _ => println!(__),
    };
}
```

#### 我的解答

```rust
// 填空
enum Direction {
    East,
    West,
    North,
    South,
}

fn main() {
    let dire = Direction::South;
    match dire {
        Direction::East => println!("East"),
        Direction::South | Direction::North => {
            // 在这里匹配 South 或 North
            println!("South or North");
        }
        _ => println!("West"),
    };
}
```

### 问题二

match 是一个表达式，因此可以用在赋值语句中

```rust
fn main() {
    let boolean = true;

    // 使用 match 表达式填空，并满足以下条件
    //
    // boolean = true => binary = 1
    // boolean = false => binary = 0
    let binary = __;

    assert_eq!(binary, 1);
}
```

#### 我的解答

```rust
fn main() {
    let boolean = true;

    // 使用 match 表达式填空，并满足以下条件
    //
    // boolean = true => binary = 1
    // boolean = false => binary = 0
    let binary = match boolean {
        true => 1,
        false => 0,
    };

    assert_eq!(binary, 1);
}
```

### 问题三

使用 match 匹配出枚举成员持有的值

```rust
// 填空
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

fn main() {
    let msgs = [
        Message::Quit,
        Message::Move{x:1, y:3},
        Message::ChangeColor(255,255,0)
    ];

    for msg in msgs {
        show_message(msg)
    }
}

fn show_message(msg: Message) {
    match msg {
        __ => { // 这里匹配 Message::Move
            assert_eq!(a, 1);
            assert_eq!(b, 3);
        },
        Message::ChangeColor(_, g, b) => {
            assert_eq!(g, __);
            assert_eq!(b, __);
        }
        __ => println!("no data in these variants")
    }
}
```

#### 我的解答

```rust
// 填空
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

fn main() {
    let msgs = [
        Message::Quit,
        Message::Move { x: 1, y: 3 },
        Message::ChangeColor(255, 255, 0),
    ];

    for msg in msgs {
        show_message(msg)
    }
}

fn show_message(msg: Message) {
    match msg {
        Message::Move { x: a, y: b } => {
            // 这里匹配 Message::Move
            assert_eq!(a, 1);
            assert_eq!(b, 3);
        }
        Message::ChangeColor(_, g, b) => {
            assert_eq!(g, 255);
            assert_eq!(b, 0);
        }
        __ => println!("no data in these variants"),
    }
}
```

### 问题四

matches! 看起来像 match, 但是它可以做一些特别的事情

```rust
fn main() {
    let alphabets = ['a', 'E', 'Z', '0', 'x', '9' , 'Y'];

    // 使用 `matches` 填空
    for ab in alphabets {
        assert!(__)
    }
}
```

#### 我的解答

```rust
fn main() {
    let alphabets = ['a', 'E', 'Z', '0', 'x', '9', 'Y'];

    // 使用 `matches` 填空
    for ab in alphabets {
        assert!(matches!(ab, 'a'..='z' | 'A'..='Z' | '0'..='9'))
    }
}
```

### 问题五

```rust
enum MyEnum {
    Foo,
    Bar
}

fn main() {
    let mut count = 0;

    let v = vec![MyEnum::Foo,MyEnum::Bar,MyEnum::Foo];
    for e in v {
        if e == MyEnum::Foo { // 修复错误，只能修改本行代码
            count += 1;
        }
    }

    assert_eq!(count, 2);
}
```

#### 我的解答

```rust
enum MyEnum {
    Foo,
    Bar
}

fn main() {
    let mut count = 0;

    let v = vec![MyEnum::Foo,MyEnum::Bar,MyEnum::Foo];
    for e in v {
        if matches!(e, MyEnum::Foo) { // 修复错误，只能修改本行代码
            count += 1;
        }
    }

    assert_eq!(count, 2);
}
```

```rust
enum MyEnum {
    Foo,
    Bar
}

fn main() {
    let mut count = 0;

    let v = vec![MyEnum::Foo,MyEnum::Bar,MyEnum::Foo];
    for e in v {
        if let MyEnum::Foo = e { // 修复错误，只能修改本行代码
            count += 1;
        }
    }

    assert_eq!(count, 2);
}
```

### 问题六

在有些时候, 使用 match 匹配枚举有些太重了，此时 if let 就非常适合

```rust
fn main() {
    let o = Some(7);

    // 移除整个 `match` 语句块，使用 `if let` 替代
    match o {
        Some(i) => {
            println!("This is a really long string and `{:?}`", i);
        }
        _ => {}
    };
}
```

#### 我的解答

```rust
fn main() {
    let o = Some(7);

    if let Some(i) = o {
        println!("This is a really long string and `{:?}`", i);
    }
}
```

### 问题七

```rust
// 填空
enum Foo {
    Bar(u8)
}

fn main() {
    let a = Foo::Bar(1);

    __ {
        println!("foobar 持有的值是: {}", i);
    }
}
```

#### 我的解答

```rust
// 填空
enum Foo {
    Bar(u8),
}

fn main() {
    let a = Foo::Bar(1);

    if let Foo::Bar(i) = a {
        println!("foobar 持有的值是: {}", i);
    }
}
```

### 问题八

```rust
enum Foo {
    Bar,
    Baz,
    Qux(u32)
}

fn main() {
    let a = Foo::Qux(10);

    // 移除以下代码，使用 `match` 代替
    if let Foo::Bar = a {
        println!("match foo::bar")
    } else if let Foo::Baz = a {
        println!("match foo::baz")
    } else {
        println!("match others")
    }
}
```

#### 我的解答

```rust
enum Foo {
    Bar,
    Baz,
    Qux(u32),
}

fn main() {
    let a = Foo::Qux(10);

    match a {
        Foo::Bar => println!("match foo::bar"),
        Foo::Baz => println!("match foo::baz"),
        _ => println!("match others"),
    }
}
```

### 问题九

```rust
// 就地修复错误
fn main() {
    let age = Some(30);
    if let Some(age) = age { // 创建一个新的变量，该变量与之前的 `age` 变量同名
       assert_eq!(age, Some(30));
    } // 新的 `age` 变量在这里超出作用域

    match age {
        // `match` 也能实现变量遮蔽
        Some(age) =>  println!("age 是一个新的变量，它的值是 {}",age),
        _ => ()
    }
 }
```

#### 我的解答

```rust
// 就地修复错误
fn main() {
    let age = Some(30);
    if let Some(age) = age { // 创建一个新的变量，该变量与之前的 `age` 变量同名
        assert_eq!(age, 30);
    } // 新的 `age` 变量在这里超出作用域

    match age {
        // `match` 也能实现变量遮蔽
        Some(age) => println!("age 是一个新的变量，它的值是 {}", age),
        _ => (),
    }
}
```

## 模式

### 问题一

使用 | 可以匹配多个值, 而使用 ..= 可以匹配一个闭区间的数值序列

```rust
fn main() {}
fn match_number(n: i32) {
    match n {
        // 匹配一个单独的值
        1 => println!("One!"),
        // 使用 `|` 填空，不要使用 `..` 或 `..=`
        __ => println!("match 2 -> 5"),
        // 匹配一个闭区间的数值序列
        6..=10 => {
            println!("match 6 -> 10")
        },
        _ => {
            println!("match 11 -> +infinite")
        }
    }
}
```

#### 我的解答

```rust
fn main() {}
fn match_number(n: i32) {
    match n {
        // 匹配一个单独的值
        1 => println!("One!"),
        // 使用 `|` 填空，不要使用 `..` 或 `..=`
        2 | 3 | 4 | 5 => println!("match 2 -> 5"),
        // 匹配一个闭区间的数值序列
        6..=10 => {
            println!("match 6 -> 10")
        }
        _ => {
            println!("match 11 -> +infinite")
        }
    }
}
```

### 问题二

@ 操作符可以让我们将一个与模式相匹配的值绑定到新的变量上

```rust
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    // 填空，让 p 匹配第二个分支
    let p = Point { x: __, y: __ };

    match p {
        Point { x, y: 0 } => println!("On the x axis at {}", x),
        // 第二个分支
        Point { x: 0..=5, y: y@ (10 | 20 | 30) } => println!("On the y axis at {}", y),
        Point { x, y } => println!("On neither axis: ({}, {})", x, y),
    }
}
```

#### 我的解答

```rust
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    // 填空，让 p 匹配第二个分支
    let p = Point { x: 0, y: 10 };

    match p {
        Point { x, y: 0 } => println!("On the x axis at {}", x),
        // 第二个分支
        Point { x: 0..=5, y: y@ (10 | 20 | 30) } => println!("On the y axis at {}", y),
        Point { x, y } => println!("On neither axis: ({}, {})", x, y),
    }
}
```

### 问题三

```rust
// 修复错误
enum Message {
    Hello { id: i32 },
}

fn main() {
    let msg = Message::Hello { id: 5 };

    match msg {
        Message::Hello {
            id:  3..=7,
        } => println!("id 值的范围在 [3, 7] 之间: {}", id),
        Message::Hello { id: newid@10 | 11 | 12 } => {
            println!("id 值的范围在 [10, 12] 之间: {}", newid)
        }
        Message::Hello { id } => println!("Found some other id: {}", id),
    }
}
```

#### 我的解答

```rust
// 修复错误
enum Message {
    Hello { id: i32 },
}

fn main() {
    let msg = Message::Hello { id: 5 };

    match msg {
        Message::Hello { id: id @ 3..=7 } => println!("id 值的范围在 [3, 7] 之间: {}", id),
        Message::Hello {
            id: newid @ (10 | 11 | 12),
        } => {
            println!("id 值的范围在 [10, 12] 之间: {}", newid)
        }
        Message::Hello { id } => println!("Found some other id: {}", id),
    }
}
```

### 问题四

匹配守卫（match guard）是一个位于 match 分支模式之后的额外 if 条件，它能为分支模式提供更进一步的匹配条件。

```rust
// 填空让代码工作，必须使用 `split`
fn main() {
    let num = Some(4);
    let split = 5;
    match num {
        Some(x) __ => assert!(x < split),
        Some(x) => assert!(x >= split),
        None => (),
    }
}
```

#### 我的解答

```rust
// 填空让代码工作，必须使用 `split`
fn main() {
    let num = Some(4);
    let split = 5;
    match num {
        Some(x) if (x < split) => assert!(x < split),
        Some(x) => assert!(x >= split),
        None => (),
    }
}
```

### 问题五

使用 .. 忽略一部分值

```rust
// 填空，让代码工作
fn main() {
    let numbers = (2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048);

    match numbers {
        __ => {
           assert_eq!(first, 2);
           assert_eq!(last, 2048);
        }
    }
}
```

#### 我的解答

```rust
// 填空，让代码工作
fn main() {
    let numbers = (2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048);

    match numbers {
        (first, .., last) => {
            assert_eq!(first, 2);
            assert_eq!(last, 2048);
        }
    }
}
```

### 问题六

使用模式 &mut V 去匹配一个可变引用时，你需要格外小心，因为匹配出来的 V 是一个值，而不是可变引用

```rust
// 修复错误，尽量少地修改代码
// 不要移除任何代码行
fn main() {
    let mut v = String::from("hello,");
    let r = &mut v;

    match r {
       &mut value => value.push_str(" world!")
    }
}
```

#### 我的解答

```rust
// 修复错误，尽量少地修改代码
// 不要移除任何代码行
fn main() {
    let mut v = String::from("hello,");
    let r = &mut v;

    match r {
        value => value.push_str(" world!"),
    }
}
```

# 方法

## 问题一

方法跟函数类似：都是使用 fn 声明，有参数和返回值。但是与函数不同的是，方法定义在结构体的上下文中(枚举、特征对象也可以定义方法)，而且方法的第一个参数一定是 self 或其变体 &self、&mut self，self 代表了当前调用的结构体实例。

```rust
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    // 完成 area 方法，返回矩形 Rectangle 的面积
    fn area
}

fn main() {
    let rect1 = Rectangle { width: 30, height: 50 };

    assert_eq!(rect1.area(), 1500);
}
```

### 我的解答

```rust
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    // 完成 area 方法，返回矩形 Rectangle 的面积
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };

    assert_eq!(rect1.area(), 1500);
}
```

## 问题二

self 会拿走当前结构体实例(调用对象)的所有权，而 &self 却只会借用一个不可变引用，&mut self 会借用一个可变引用

```rust
// 只填空，不要删除任何代码行!
#[derive(Debug)]
struct TrafficLight {
    color: String,
}

impl TrafficLight {
    pub fn show_state(__)  {
        println!("the current state is {}", __.color);
    }
}
fn main() {
    let light = TrafficLight{
        color: "red".to_owned(),
    };
    // 不要拿走 `light` 的所有权
    light.show_state();
    // 否则下面代码会报错
    println!("{:?}", light);
}
```

### 我的解答

```rust
// 只填空，不要删除任何代码行!
#[derive(Debug)]
struct TrafficLight {
    color: String,
}

impl TrafficLight {
    pub fn show_state(&self) {
        println!("the current state is {}", self.color);
    }
}
fn main() {
    let light = TrafficLight {
        color: "red".to_owned(),
    };
    // 不要拿走 `light` 的所有权
    light.show_state();
    // 否则下面代码会报错
    println!("{:?}", light);
}
```

## 问题三

&self 实际上是 self: &Self 的缩写或者说语法糖

```rust
struct TrafficLight {
    color: String,
}

impl TrafficLight {
    // 使用 `Self` 填空
    pub fn show_state(__)  {
        println!("the current state is {}", self.color);
    }

    // 填空，不要使用 `Self` 或其变体
    pub fn change_state(__) {
        self.color = "green".to_string()
    }
}
fn main() {}
```

### 我的解答

```rust
struct TrafficLight {
    color: String,
}

impl TrafficLight {
    // 使用 `Self` 填空
    pub fn show_state(self: &Self) {
        println!("the current state is {}", self.color);
    }

    // 填空，不要使用 `Self` 或其变体
    pub fn change_state(&mut self) {
        self.color = "green".to_string()
    }
}
fn main() {}
```

## 问题四

定义在 impl 语句块中的函数被称为关联函数，因为它们跟当前类型关联在一起。关联函数与方法最大的区别就是它第一个参数不是 self，原因是它们不需要使用当前的实例，因此关联函数往往可以用于构造函数：初始化一个实例对象

```rust
#[derive(Debug)]
struct TrafficLight {
    color: String,
}

impl TrafficLight {
    // 1. 实现下面的关联函数 `new`,
    // 2. 该函数返回一个 TrafficLight 实例，包含 `color` "red"
    // 3. 该函数必须使用 `Self` 作为类型，不能在签名或者函数体中使用 `TrafficLight`
    pub fn new()

    pub fn get_state(&self) -> &str {
        &self.color
    }
}

fn main() {
    let light = TrafficLight::new();
    assert_eq!(light.get_state(), "red");
}
```

### 我的解答

```rust
#[derive(Debug)]
struct TrafficLight {
    color: String,
}

impl TrafficLight {
    // 1. 实现下面的关联函数 `new`,
    // 2. 该函数返回一个 TrafficLight 实例，包含 `color` "red"
    // 3. 该函数必须使用 `Self` 作为类型，不能在签名或者函数体中使用 `TrafficLight`
    pub fn new() -> Self {
        TrafficLight {
            color: "red".to_string(),
        }
    }

    pub fn get_state(&self) -> &str {
        &self.color
    }
}

fn main() {
    let light = TrafficLight::new();
    assert_eq!(light.get_state(), "red");
}
```

## 问题五

每一个结构体允许拥有多个 impl 语句块

```rust
struct Rectangle {
    width: u32,
    height: u32,
}

// 使用多个 `impl` 语句块重写下面的代码
impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }

    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }
}

fn main() {}
```

### 我的解答

```rust
struct Rectangle {
    width: u32,
    height: u32,
}

// 使用多个 `impl` 语句块重写下面的代码
impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

// 使用多个 `impl` 语句块重写下面的代码
impl Rectangle {
    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }
}

fn main() {}
```

## 问题六

我们还可以为枚举类型定义方法

```rust
#[derive(Debug)]
enum TrafficLightColor {
    Red,
    Yellow,
    Green,
}

// 为 TrafficLightColor 实现所需的方法
impl TrafficLightColor {

}

fn main() {
    let c = TrafficLightColor::Yellow;

    assert_eq!(c.color(), "yellow");

    println!("{:?}",c);
}
```

### 我的解答

```rust
#[derive(Debug)]
enum TrafficLightColor {
    Red,
    Yellow,
    Green,
}

// 为 TrafficLightColor 实现所需的方法
impl TrafficLightColor {
    fn color(&self) -> &str {
        match self {
            TrafficLightColor::Yellow => "yellow",
            _ => "None",
        }
    }
}

fn main() {
    let c = TrafficLightColor::Yellow;

    assert_eq!(c.color(), "yellow");

    println!("{:?}", c);
}
```

# 泛型和特征

## 泛型

### 问题一

```rust
// 填空
struct A;          // 具体的类型 `A`.
struct S(A);       // 具体的类型 `S`.
struct SGen<T>(T); // 泛型 `SGen`.

fn reg_fn(_s: S) {}

fn gen_spec_t(_s: SGen<A>) {}

fn gen_spec_i32(_s: SGen<i32>) {}

fn generic<T>(_s: SGen<T>) {}

fn main() {
    // 使用非泛型函数
    reg_fn(__);          // 具体的类型
    gen_spec_t(__);   // 隐式地指定类型参数  `A`.
    gen_spec_i32(__); // 隐式地指定类型参数`i32`.

    // 显式地指定类型参数 `char`
    generic::<char>(__);

    // 隐式地指定类型参数 `char`.
    generic(__);
}
```

#### 我的解答

```rust
// 填空
struct A;          // 具体的类型 `A`.
struct S(A);       // 具体的类型 `S`.
struct SGen<T>(T); // 泛型 `SGen`.

fn reg_fn(_s: S) {}

fn gen_spec_t(_s: SGen<A>) {}

fn gen_spec_i32(_s: SGen<i32>) {}

fn generic<T>(_s: SGen<T>) {}

fn main() {
    // 使用非泛型函数
    reg_fn(S(A));          // 具体的类型
    gen_spec_t(SGen(A));   // 隐式地指定类型参数  `A`.
    gen_spec_i32(SGen(1)); // 隐式地指定类型参数`i32`.

    // 显式地指定类型参数 `char`
    generic::<char>(SGen('1'));

    // 隐式地指定类型参数 `char`.
    generic(SGen('1'));
}
```

### 问题二

```rust
// 实现下面的泛型函数 sum
fn sum

fn main() {
    assert_eq!(5, sum(2i8, 3i8));
    assert_eq!(50, sum(20, 30));
    assert_eq!(2.46, sum(1.23, 1.23));
}
```

#### 我的解答

```rust
// 实现下面的泛型函数 sum
fn sum<T: std::ops::Add<Output = T>>(a: T, b: T) -> T {
    a + b
}

fn main() {
    assert_eq!(5, sum(2i8, 3i8));
    assert_eq!(50, sum(20, 30));
    assert_eq!(2.46, sum(1.23, 1.23));
}
```

### 问题三

```rust
// 实现一个结构体 Point 让代码工作

fn main() {
    let integer = Point { x: 5, y: 10 };
    let float = Point { x: 1.0, y: 4.0 };
}
```

#### 我的解答

```rust
// 实现一个结构体 Point 让代码工作
struct Point<T> {
    x: T,
    y: T,
}

fn main() {
    let integer = Point { x: 5, y: 10 };
    let float = Point { x: 1.0, y: 4.0 };
}
```

### 问题四

```rust
// 修改以下结构体让代码工作
struct Point<T> {
    x: T,
    y: T,
}

fn main() {
    // 不要修改这行代码！
    let p = Point{x: 5, y : "hello".to_string()};
}
```

#### 我的解答

```rust
// 修改以下结构体让代码工作
struct Point<T, U> {
    x: T,
    y: U,
}

fn main() {
    // 不要修改这行代码！
    let p = Point{x: 5, y : "hello".to_string()};
}
```

### 问题五

```rust
// 为 Val 增加泛型参数，不要修改 `main` 中的代码
struct Val {
    val: f64,
}

impl Val {
    fn value(&self) -> &f64 {
        &self.val
    }
}

fn main() {
    let x = Val{ val: 3.0 };
    let y = Val{ val: "hello".to_string()};
    println!("{}, {}", x.value(), y.value());
}
```

#### 我的解答

```rust
// 为 Val 增加泛型参数，不要修改 `main` 中的代码
struct Val<T> {
    val: T,
}

impl<T> Val<T> {
    fn value(&self) -> &T {
        &self.val
    }
}

fn main() {
    let x = Val { val: 3.0 };
    let y = Val {
        val: "hello".to_string(),
    };
    println!("{}, {}", x.value(), y.value());
}
```

### 问题六

```rust
struct Point<T, U> {
    x: T,
    y: U,
}

impl<T, U> Point<T, U> {
    // 实现 mixup，不要修改其它代码！
    fn mixup
}

fn main() {
    let p1 = Point { x: 5, y: 10 };
    let p2 = Point { x: "Hello", y: '中'};

    let p3 = p1.mixup(p2);

    assert_eq!(p3.x, 5);
    assert_eq!(p3.y, '中');
}
```

#### 我的解答

```rust
struct Point<T, U> {
    x: T,
    y: U,
}

impl<T, U> Point<T, U> {
    // 实现 mixup，不要修改其它代码！
    fn mixup<V, W>(self, other: Point<V, W>) -> Point<T, W> {
        Point {
            x: self.x,
            y: other.y,
        }
    }
}

fn main() {
    let p1 = Point { x: 5, y: 10 };
    let p2 = Point {
        x: "Hello",
        y: '中',
    };

    let p3 = p1.mixup(p2);

    assert_eq!(p3.x, 5);
    assert_eq!(p3.y, '中');
}
```

### 问题七

```rust
// 修复错误，让代码工作
struct Point<T> {
    x: T,
    y: T,
}

impl Point<f32> {
    fn distance_from_origin(&self) -> f32 {
        (self.x.powi(2) + self.y.powi(2)).sqrt()
    }
}

fn main() {
    let p = Point{x: 5, y: 10};
    println!("{}",p.distance_from_origin())
}
```

#### 我的解答

```rust
// 修复错误，让代码工作
struct Point<T> {
    x: T,
    y: T,
}

impl Point<f32> {
    fn distance_from_origin(&self) -> f32 {
        (self.x.powi(2) + self.y.powi(2)).sqrt()
    }
}

fn main() {
    let p = Point{x: 5.0, y: 10.0};
    println!("{}",p.distance_from_origin())
}
```

## Const 泛型

### 问题一

下面的例子同时使用泛型和 const 泛型来实现一个结构体，该结构体的字段中的数组长度是可变的

```rust
struct ArrayPair<T, const N: usize> {
    left: [T; N],
    right: [T; N],
}

impl<T: Debug, const N: usize> Debug for ArrayPair<T, N> {
    // ...
}
```

### 问题二

目前，const 泛型参数只能使用以下形式的实参:

- 一个单独的 const 泛型参数
- 一个字面量（i.e. 整数, 布尔值或字符）
- 一个具体的 const 表达式（表达式中不能包含任何泛型参数）

```rust
fn foo<const N: usize>() {}

fn bar<T, const M: usize>() {
    foo::<M>(); // ok: 符合第一种
    foo::<2021>(); // ok: 符合第二种
    foo::<{20 * 100 + 20 * 10 + 1}>(); // ok: 符合第三种

    foo::<{ M + 1 }>(); // error: 违背第三种，const 表达式中不能有泛型参数 M
    foo::<{ std::mem::size_of::<T>() }>(); // error: 泛型表达式包含了泛型参数 T

    let _: [u8; M]; // ok: 符合第一种
    let _: [u8; std::mem::size_of::<T>()]; // error: 泛型表达式包含了泛型参数 T
}

fn main() {}
```

### 问题三

const 泛型还能帮我们避免一些运行时检查，提升性能

```rust
pub struct MinSlice<T, const N: usize> {
    pub head: [T; N],
    pub tail: [T],
}

fn main() {
    let slice: &[u8] = b"Hello, world";
    let reference: Option<&u8> = slice.get(6);
    // 我们知道 `.get` 返回的是 `Some(b' ')`
    // 但编译器不知道
    assert!(reference.is_some());

    let slice: &[u8] = b"Hello, world";

    // 当编译构建 MinSlice 时会进行长度检查，也就是在编译期我们就知道它的长度是 12
    // 在运行期，一旦 `unwrap` 成功，在 `MinSlice` 的作用域内，就再无需任何检查
    let minslice = MinSlice::<u8, 12>::from_slice(slice).unwrap();
    let value: u8 = minslice.head[6];
    assert_eq!(value, b' ')
}
```

### 问题四

`<T, const N: usize>` 是结构体类型的一部分，和数组类型一样，这意味着长度不同会导致类型不同： `Array<i32, 3>` 和 `Array<i32, 4>` 是不同的类型

```rust
// 修复错误
struct Array<T, const N: usize> {
    data : [T; N]
}

fn main() {
    let arrays = [
        Array{
            data: [1, 2, 3],
        },
        Array {
            data: [1.0, 2.0, 3.0],
        },
        Array {
            data: [1, 2]
        }
    ];
}
```

#### 我的解答

```rust
// 修复错误
struct Array<T, const N: usize> {
    data : [T; N]
}

fn main() {
    let arrays = [
        Array{
            data: [1, 2, 3],
        },
        Array {
            data: [1, 2, 3],
        },
        Array {
            data: [1, 2, 3]
        }
    ];
}
```

### 问题五

```rust
// 填空
fn print_array<__>(__) {
    println!("{:?}", arr);
}
fn main() {
    let arr = [1, 2, 3];
    print_array(arr);

    let arr = ["hello", "world"];
    print_array(arr);
}
```

#### 我的解答

```rust
// 填空
fn print_array<T: std::fmt::Debug, const N: usize>(arr: [T; N]) {
    println!("{:?}", arr);
}

fn main() {
    let arr = [1, 2, 3];
    print_array(arr);

    let arr = ["hello", "world"];
    print_array(arr);
}
```

### 问题六

有时我们希望能限制一个变量占用内存的大小，例如在嵌入式环境中，此时 const 泛型参数的第三种形式 const 表达式 就非常适合

```rust
#![allow(incomplete_features)]
#![feature(generic_const_exprs)]

fn check_size<T>(val: T)
where
    Assert<{ core::mem::size_of::<T>() < 768 }>: IsTrue,
{
    //...
}

// 修复 main 函数中的错误
fn main() {
    check_size([0u8; 767]);
    check_size([0i32; 191]);
    check_size(["hello你好"; __]); // size of &str ?
    check_size([(); __].map(|_| "hello你好".to_string()));  // size of String?
    check_size(['中'; __]); // size of char ?
}



pub enum Assert<const CHECK: bool> {}

pub trait IsTrue {}

impl IsTrue for Assert<true> {}
```

#### 我的解答

```rust
#![allow(incomplete_features)]
#![feature(generic_const_exprs)]

fn check_size<T>(val: T)
where
    Assert<{ core::mem::size_of::<T>() < 768 }>: IsTrue,
{
    //...
}

// 修复 main 函数中的错误
fn main() {
    check_size([0u8; 767]); // 1 * 768 = 768
    check_size([0i32; 191]); // 4 * 192 = 768
    check_size(["hello你好"; 47]); // 16 * 48 = 768，&str is a string reference, containing a pointer and string length in it, so it takes two word long, in x86-64, 1 word = 8 bytes
    check_size([(); 31].map(|_| "hello你好".to_string())); // 24 * 32 = 768，String is a smart pointer struct, it has three fields: pointer, length and capacity, each takes 8 bytes
    check_size(['中'; 191]); // 192 * 4 = 768
}

pub enum Assert<const CHECK: bool> {}

pub trait IsTrue {}

impl IsTrue for Assert<true> {}
```

## 特征

特征 Trait 可以告诉编译器一个特定的类型所具有的、且能跟其它类型共享的特性。我们可以使用特征通过抽象的方式来定义这种共享行为，还可以使用特征约束来限定一个泛型类型必须要具有某个特定的行为。

> 特征跟其它语言的接口较为类似，但是仍然有一些区别

### 问题一

```rust
struct Sheep { naked: bool, name: String }

impl Sheep {
    fn is_naked(&self) -> bool {
        self.naked
    }

    fn shear(&mut self) {
        if self.is_naked() {
            // Sheep 结构体上定义的方法可以调用 Sheep 所实现的特征的方法
            println!("{} is already naked...", self.name());
        } else {
            println!("{} gets a haircut!", self.name);

            self.naked = true;
        }
    }
}

trait Animal {
    // 关联函数签名；Self 指代实现者的类型
    // 例如我们在为 Pig 类型实现特征时，那 new 函数就会返回一个 Pig 类型的实例，这里的 Self 指代的就是 Pig 类型
    fn new(name: String) -> Self;

    // 方法签名
    fn name(&self) -> String;

    fn noise(&self) -> String;

    // 方法还能提供默认的定义实现
    fn talk(&self) {
        println!("{} says {}", self.name(), self.noise());
    }
}

impl Animal for Sheep {
    // Self 被替换成具体的实现者类型：Sheep
    fn new(name: String) -> Sheep {
        Sheep { name: name, naked: false }
    }

    fn name(&self) -> String {
        self.name.clone()
    }

    fn noise(&self) -> String {
        if self.is_naked() {
            "baaaaah?".to_string()
        } else {
            "baaaaah!".to_string()
        }
    }

    // 默认的特征方法可以被重写
    fn talk(&self) {
        println!("{} pauses briefly... {}", self.name, self.noise());
    }
}

fn main() {
    // 这里的类型注释时必须的
    let mut dolly: Sheep = Animal::new("Dolly".to_string());
    // 尝试去除类型注释，看看会发生什么

    dolly.talk();
    dolly.shear();
    dolly.talk();
}
```

### 问题二

```rust
// 完成两个 `impl` 语句块
// 不要修改 `main` 中的代码
trait Hello {
    fn say_hi(&self) -> String {
        String::from("hi")
    }

    fn say_something(&self) -> String;
}

struct Student {}
impl Hello for Student {
}
struct Teacher {}
impl Hello for Teacher {
}

fn main() {
    let s = Student {};
    assert_eq!(s.say_hi(), "hi");
    assert_eq!(s.say_something(), "I'm a good student");

    let t = Teacher {};
    assert_eq!(t.say_hi(), "Hi, I'm your new teacher");
    assert_eq!(t.say_something(), "I'm not a bad teacher");

    println!("Success!")
}
```

#### 我的解答

```rust
// 完成两个 `impl` 语句块
// 不要修改 `main` 中的代码
trait Hello {
    fn say_hi(&self) -> String {
        String::from("hi")
    }

    fn say_something(&self) -> String;
}

struct Student {}
impl Hello for Student {
    fn say_something(&self) -> String {
        String::from("I'm a good student")
    }
}
struct Teacher {}
impl Hello for Teacher {
    fn say_hi(&self) -> String {
        String::from("Hi, I'm your new teacher")
    }

    fn say_something(&self) -> String {
        String::from("I'm not a bad teacher")
    }
}

fn main() {
    let s = Student {};
    assert_eq!(s.say_hi(), "hi");
    assert_eq!(s.say_something(), "I'm a good student");

    let t = Teacher {};
    assert_eq!(t.say_hi(), "Hi, I'm your new teacher");
    assert_eq!(t.say_something(), "I'm not a bad teacher");

    println!("Success!")
}
```

### 问题三

我们可以使用 `#[derive]` 属性来派生一些特征，对于这些特征编译器会自动进行默认实现，对于日常代码开发而言，这是非常方便的，例如大家经常用到的 Debug 特征，就是直接通过派生来获取默认实现，而无需我们手动去完成这个工作

想要查看更多信息，可以访问[这里](https://course.rs/appendix/derive.html)

```rust
// `Centimeters`, 一个元组结构体，可以被比较大小
#[derive(PartialEq, PartialOrd)]
struct Centimeters(f64);

// `Inches`, 一个元组结构体可以被打印
#[derive(Debug)]
struct Inches(i32);

impl Inches {
    fn to_centimeters(&self) -> Centimeters {
        let &Inches(inches) = self;

        Centimeters(inches as f64 * 2.54)
    }
}

// 添加一些属性让代码工作
// 不要修改其它代码！
struct Seconds(i32);

fn main() {
    let _one_second = Seconds(1);

    println!("One second looks like: {:?}", _one_second);
    let _this_is_true = _one_second == _one_second;
    let _this_is_true = _one_second > _one_second;

    let foot = Inches(12);

    println!("One foot equals {:?}", foot);

    let meter = Centimeters(100.0);

    let cmp =
        if foot.to_centimeters() < meter {
            "smaller"
        } else {
            "bigger"
        };

    println!("One foot is {} than one meter.", cmp);
}
```

#### 我的解答

```rust
// `Centimeters`, 一个元组结构体，可以被比较大小
#[derive(PartialEq, PartialOrd)]
struct Centimeters(f64);

// `Inches`, 一个元组结构体可以被打印
#[derive(Debug)]
struct Inches(i32);

impl Inches {
    fn to_centimeters(&self) -> Centimeters {
        let &Inches(inches) = self;

        Centimeters(inches as f64 * 2.54)
    }
}

// 添加一些属性让代码工作
// 不要修改其它代码！
#[derive(PartialEq, PartialOrd, Debug)]
struct Seconds(i32);

fn main() {
    let _one_second = Seconds(1);

    println!("One second looks like: {:?}", _one_second);
    let _this_is_true = _one_second == _one_second;
    let _this_is_true = _one_second > _one_second;

    let foot = Inches(12);

    println!("One foot equals {:?}", foot);

    let meter = Centimeters(100.0);

    let cmp = if foot.to_centimeters() < meter {
        "smaller"
    } else {
        "bigger"
    };

    println!("One foot is {} than one meter.", cmp);
}
```

### 问题四

在 Rust 中，许多运算符都可以被重载，事实上，运算符仅仅是特征方法调用的语法糖。例如 a + b 中的 + 是 std::ops::Add 特征的 add 方法调用，因此我们可以为自定义类型实现该特征来支持该类型的加法运算。

```rust
use std::ops;

// 实现 fn multiply 方法
// 如上所述，`+` 需要 `T` 类型实现 `std::ops::Add` 特征
// 那么, `*` 运算符需要实现什么特征呢? 你可以在这里找到答案: https://doc.rust-lang.org/core/ops/
fn multiply

fn main() {
    assert_eq!(6, multiply(2u8, 3u8));
    assert_eq!(5.0, multiply(1.0, 5.0));

    println!("Success!")
}
```

#### 我的解答

```rust
use std::ops;

// 实现 fn multiply 方法
// 如上所述，`+` 需要 `T` 类型实现 `std::ops::Add` 特征
// 那么, `*` 运算符需要实现什么特征呢? 你可以在这里找到答案: https://doc.rust-lang.org/core/ops/
fn multiply<T: ops::Mul<Output = T>>(a: T, b: T) -> T {
    a * b
}

fn main() {
    assert_eq!(6, multiply(2u8, 3u8));
    assert_eq!(5.0, multiply(1.0, 5.0));

    println!("Success!")
}
```

### 问题五

```rust
// 修复错误，不要修改 `main` 中的代码!
use std::ops;

struct Foo;
struct Bar;

struct FooBar;

struct BarFoo;

// 下面的代码实现了自定义类型的相加： Foo + Bar = FooBar
impl ops::Add<Bar> for Foo {
    type Output = FooBar;

    fn add(self, _rhs: Bar) -> FooBar {
        FooBar
    }
}

impl ops::Sub<Foo> for Bar {
    type Output = BarFoo;

    fn sub(self, _rhs: Foo) -> BarFoo {
        BarFoo
    }
}

fn main() {
    // 不要修改下面代码
    // 你需要为 FooBar 派生一些特征来让代码工作
    assert_eq!(Foo + Bar, FooBar);
    assert_eq!(Foo - Bar, BarFoo);

    println!("Success!")
}
```

#### 我的解答

```rust
// 修复错误，不要修改 `main` 中的代码!
use std::ops;

struct Foo;
struct Bar;

#[derive(PartialEq, Debug)]
struct FooBar;

#[derive(PartialEq, Debug)]
struct BarFoo;

// 下面的代码实现了自定义类型的相加： Foo + Bar = FooBar
impl ops::Add<Bar> for Foo {
    type Output = FooBar;

    fn add(self, _rhs: Bar) -> FooBar {
        FooBar
    }
}

impl ops::Sub<Bar> for Foo {
    type Output = BarFoo;

    fn sub(self, _rhs: Bar) -> BarFoo {
        BarFoo
    }
}

fn main() {
    // 不要修改下面代码
    // 你需要为 FooBar 派生一些特征来让代码工作
    assert_eq!(Foo + Bar, FooBar);
    assert_eq!(Foo - Bar, BarFoo);

    println!("Success!")
}
```

### 问题六

除了使用具体类型来作为函数参数，我们还能通过 impl Trait 的方式来指定实现了该特征的参数：该参数能接受的类型必须要实现指定的特征。

```rust
// 实现 `fn summary`
// 修复错误且不要移除任何代码行
trait Summary {
    fn summarize(&self) -> String;
}

#[derive(Debug)]
struct Post {
    title: String,
    author: String,
    content: String,
}

impl Summary for Post {
    fn summarize(&self) -> String {
        format!("The author of post {} is {}", self.title, self.author)
    }
}

#[derive(Debug)]
struct Weibo {
    username: String,
    content: String,
}

impl Summary for Weibo {
    fn summarize(&self) -> String {
        format!("{} published a weibo {}", self.username, self.content)
    }
}

fn main() {
    let post = Post {
        title: "Popular Rust".to_string(),
        author: "Sunface".to_string(),
        content: "Rust is awesome!".to_string(),
    };
    let weibo = Weibo {
        username: "sunface".to_string(),
        content: "Weibo seems to be worse than Tweet".to_string(),
    };

    summary(post);
    summary(weibo);

    println!("{:?}", post);
    println!("{:?}", weibo);
}

// 在下面实现 `fn summary` 函数
```

#### 我的解答

```rust
// 实现 `fn summary`
// 修复错误且不要移除任何代码行
trait Summary {
    fn summarize(&self) -> String;
}

#[derive(Debug)]
struct Post {
    title: String,
    author: String,
    content: String,
}

impl Summary for Post {
    fn summarize(&self) -> String {
        format!("The author of post {} is {}", self.title, self.author)
    }
}

#[derive(Debug)]
struct Weibo {
    username: String,
    content: String,
}

impl Summary for Weibo {
    fn summarize(&self) -> String {
        format!("{} published a weibo {}", self.username, self.content)
    }
}

fn summary(item: &impl Summary) {
    item.summarize();
}

fn main() {
    let post = Post {
        title: "Popular Rust".to_string(),
        author: "Sunface".to_string(),
        content: "Rust is awesome!".to_string(),
    };
    let weibo = Weibo {
        username: "sunface".to_string(),
        content: "Weibo seems to be worse than Tweet".to_string(),
    };

    summary(&post);
    summary(&weibo);

    println!("{:?}", post);
    println!("{:?}", weibo);
}

// 在下面实现 `fn summary` 函数
```

### 问题七

我们还可以在函数的返回值中使用 impl Trait 语法。然后只有在返回值是同一个类型时，才能这么使用，如果返回值是不同的类型，你可能更需要特征对象。

```rust
struct Sheep {}
struct Cow {}

trait Animal {
    fn noise(&self) -> String;
}

impl Animal for Sheep {
    fn noise(&self) -> String {
        "baaaaah!".to_string()
    }
}

impl Animal for Cow {
    fn noise(&self) -> String {
        "moooooo!".to_string()
    }
}

// 返回一个类型，该类型实现了 Animal 特征，但是我们并不能在编译期获知具体返回了哪个类型
// 修复这里的错误，你可以使用虚假的随机，也可以使用特征对象
fn random_animal(random_number: f64) -> impl Animal {
    if random_number < 0.5 {
        Sheep {}
    } else {
        Cow {}
    }
}

fn main() {
    let random_number = 0.234;
    let animal = random_animal(random_number);
    println!("You've randomly chosen an animal, and it says {}", animal.noise());
}
```

#### 我的解答

```rust
struct Sheep {}
struct Cow {}

trait Animal {
    fn noise(&self) -> String;
}

impl Animal for Sheep {
    fn noise(&self) -> String {
        "baaaaah!".to_string()
    }
}

impl Animal for Cow {
    fn noise(&self) -> String {
        "moooooo!".to_string()
    }
}

// 返回一个类型，该类型实现了 Animal 特征，但是我们并不能在编译期获知具体返回了哪个类型
// 修复这里的错误，你可以使用虚假的随机，也可以使用特征对象
fn random_animal(random_number: f64) -> Box<dyn Animal> {
    if random_number < 0.5 {
        Box::new(Sheep {})
    } else {
        Box::new(Cow {})
    }
}

fn main() {
    let random_number = 0.234;
    let animal = random_animal(random_number);
    println!(
        "You've randomly chosen an animal, and it says {}",
        animal.noise()
    );
}
```

### 问题八

impl Trait 语法非常直观简洁，但它实际上是特征约束的语法糖。

当使用泛型参数时，我们往往需要为该参数指定特定的行为，这种指定方式就是通过特征约束来实现的。

```rust
fn main() {
    assert_eq!(sum(1, 2), 3);
}

// 通过两种方法使用特征约束来实现 `fn sum`
fn sum<T>(x: T, y: T) -> T {
    x + y
}
```

#### 我的解答

```rust
use std::ops::Add;

fn main() {
    assert_eq!(sum(1, 2), 3);
}

// 通过两种方法使用特征约束来实现 `fn sum`
fn sum<T: Add<Output = T>>(x: T, y: T) -> T {
    x + y
}
```

```rust
use std::ops::Add;

fn main() {
    assert_eq!(sum(1, 2), 3);
}

// 通过两种方法使用特征约束来实现 `fn sum`
fn sum<T>(x: T, y: T) -> T
where
    T: Add<Output = T>,
{
    x + y
}
```

### 问题九

```rust
// 修复代码中的错误
struct Pair<T> {
    x: T,
    y: T,
}

impl<T> Pair<T> {
    fn new(x: T, y: T) -> Self {
        Self {
            x,
            y,
        }
    }
}

impl<T: std::fmt::Debug + PartialOrd> Pair<T> {
    fn cmp_display(&self) {
        if self.x >= self.y {
            println!("The largest member is x = {:?}", self.x);
        } else {
            println!("The largest member is y = {:?}", self.y);
        }
    }
}

struct Unit(i32);

fn main() {
    let pair = Pair{
        x: Unit(1),
        y: Unit(3)
    };

    pair.cmp_display();
}
```

#### 我的解答

```rust
// 修复代码中的错误
struct Pair<T> {
    x: T,
    y: T,
}

impl<T> Pair<T> {
    fn new(x: T, y: T) -> Self {
        Self { x, y }
    }
}

impl<T: std::fmt::Debug + PartialOrd> Pair<T> {
    fn cmp_display(&self) {
        if self.x >= self.y {
            println!("The largest member is x = {:?}", self.x);
        } else {
            println!("The largest member is y = {:?}", self.y);
        }
    }
}

#[derive(Debug, PartialOrd, PartialEq)]
struct Unit(i32);

fn main() {
    let pair = Pair {
        x: Unit(1),
        y: Unit(3),
    };

    pair.cmp_display();
}
```

### 问题十

```rust
// 填空
fn example1() {
    // `T: Trait` 是最常使用的方式
    // `T: Fn(u32) -> u32` 说明 `T` 只能接收闭包类型的参数
    struct Cacher<T: Fn(u32) -> u32> {
        calculation: T,
        value: Option<u32>,
    }

    impl<T: Fn(u32) -> u32> Cacher<T> {
        fn new(calculation: T) -> Cacher<T> {
            Cacher {
                calculation,
                value: None,
            }
        }

        fn value(&mut self, arg: u32) -> u32 {
            match self.value {
                Some(v) => v,
                None => {
                    let v = (self.calculation)(arg);
                    self.value = Some(v);
                    v
                },
            }
        }
    }

    let mut cacher = Cacher::new(|x| x+1);
    assert_eq!(cacher.value(10), __);
    assert_eq!(cacher.value(15), __);
}

fn example2() {
    // 还可以使用 `where` 来约束 T
    struct Cacher<T>
        where T: Fn(u32) -> u32,
    {
        calculation: T,
        value: Option<u32>,
    }

    impl<T> Cacher<T>
        where T: Fn(u32) -> u32,
    {
        fn new(calculation: T) -> Cacher<T> {
            Cacher {
                calculation,
                value: None,
            }
        }

        fn value(&mut self, arg: u32) -> u32 {
            match self.value {
                Some(v) => v,
                None => {
                    let v = (self.calculation)(arg);
                    self.value = Some(v);
                    v
                },
            }
        }
    }

    let mut cacher = Cacher::new(|x| x+1);
    assert_eq!(cacher.value(20), __);
    assert_eq!(cacher.value(25), __);
}



fn main() {
    example1();
    example2();

    println!("Success!")
}
```

#### 我的解答

```rust
// 填空
fn example1() {
    // `T: Trait` 是最常使用的方式
    // `T: Fn(u32) -> u32` 说明 `T` 只能接收闭包类型的参数
    struct Cacher<T: Fn(u32) -> u32> {
        calculation: T,
        value: Option<u32>,
    }

    impl<T: Fn(u32) -> u32> Cacher<T> {
        fn new(calculation: T) -> Cacher<T> {
            Cacher {
                calculation,
                value: None,
            }
        }

        fn value(&mut self, arg: u32) -> u32 {
            match self.value {
                Some(v) => v,
                None => {
                    let v = (self.calculation)(arg);
                    self.value = Some(v);
                    v
                }
            }
        }
    }

    let mut cacher = Cacher::new(|x| x + 1);
    assert_eq!(cacher.value(10), 11);
    assert_eq!(cacher.value(15), 11);
}

fn example2() {
    // 还可以使用 `where` 来约束 T
    struct Cacher<T>
    where
        T: Fn(u32) -> u32,
    {
        calculation: T,
        value: Option<u32>,
    }

    impl<T> Cacher<T>
    where
        T: Fn(u32) -> u32,
    {
        fn new(calculation: T) -> Cacher<T> {
            Cacher {
                calculation,
                value: None,
            }
        }

        fn value(&mut self, arg: u32) -> u32 {
            match self.value {
                Some(v) => v,
                None => {
                    let v = (self.calculation)(arg);
                    self.value = Some(v);
                    v
                }
            }
        }
    }

    let mut cacher = Cacher::new(|x| x + 1);
    assert_eq!(cacher.value(20), 21);
    assert_eq!(cacher.value(25), 21);
}

fn main() {
    example1();
    example2();

    println!("Success!")
}
```

## 特征对象

在特征练习中，我们已经知道当函数返回多个类型时，impl Trait 是无法使用的

对于数组而言，其中一个限制就是无法存储不同类型的元素，但是通过之前的学习，大家应该知道枚举可以在部分场景解决这种问题，但是这种方法局限性较大。此时就需要我们的主角登场了

### 问题一

Rust 编译器需要知道一个函数的返回类型占用多少内存空间。由于特征的不同实现类型可能会占用不同的内存，因此通过 impl Trait 返回多个类型是不被允许的，但是我们可以返回一个 dyn 特征对象来解决问题

```rust
trait Bird {
    fn quack(&self) -> String;
}

struct Duck;
impl Duck {
    fn swim(&self) {
        println!("Look, the duck is swimming")
    }
}
struct Swan;
impl Swan {
    fn fly(&self) {
        println!("Look, the duck.. oh sorry, the swan is flying")
    }
}

impl Bird for Duck {
    fn quack(&self) -> String{
        "duck duck".to_string()
    }
}

impl Bird for Swan {
    fn quack(&self) -> String{
        "swan swan".to_string()
    }
}

fn main() {
    // 填空
    let duck = __;
    duck.swim();

    let bird = hatch_a_bird(2);
    // 变成鸟儿后，它忘记了如何游，因此以下代码会报错
    // bird.swim();
    // 但它依然可以叫唤
    assert_eq!(bird.quack(), "duck duck");

    let bird = hatch_a_bird(1);
    // 这只鸟儿忘了如何飞翔，因此以下代码会报错
    // bird.fly();
    // 但它也可以叫唤
    assert_eq!(bird.quack(), "swan swan");

    println!("Success!")
}

// 实现以下函数
fn hatch_a_bird...
```

#### 我的解答

```rust
trait Bird {
    fn quack(&self) -> String;
}

struct Duck;
impl Duck {
    fn swim(&self) {
        println!("Look, the duck is swimming")
    }
}
struct Swan;
impl Swan {
    fn fly(&self) {
        println!("Look, the duck.. oh sorry, the swan is flying")
    }
}

impl Bird for Duck {
    fn quack(&self) -> String{
        "duck duck".to_string()
    }
}

impl Bird for Swan {
    fn quack(&self) -> String{
        "swan swan".to_string()
    }
}

fn main() {
    // 填空
    let duck = Duck{};
    duck.swim();

    let bird = hatch_a_bird(2);
    // 变成鸟儿后，它忘记了如何游，因此以下代码会报错
    // bird.swim();
    // 但它依然可以叫唤
    assert_eq!(bird.quack(), "duck duck");

    let bird = hatch_a_bird(1);
    // 这只鸟儿忘了如何飞翔，因此以下代码会报错
    // bird.fly();
    // 但它也可以叫唤
    assert_eq!(bird.quack(), "swan swan");

    println!("Success!")
}

// 实现以下函数
fn hatch_a_bird(bird: u8) -> Box<dyn Bird> {
    match bird {
        1 => Box::new(Swan{}),
        _ => Box::new(Duck{}),
    }
}
```

### 问题二

在数组中使用特征对象

```rust
trait Bird {
    fn quack(&self);
}

struct Duck;
impl Duck {
    fn fly(&self) {
        println!("Look, the duck is flying")
    }
}
struct Swan;
impl Swan {
    fn fly(&self) {
        println!("Look, the duck.. oh sorry, the swan is flying")
    }
}

impl Bird for Duck {
    fn quack(&self) {
        println!("{}", "duck duck");
    }
}

impl Bird for Swan {
    fn quack(&self) {
        println!("{}", "swan swan");
    }
}

fn main() {
    // 填空
    let birds __;

    for bird in birds {
        bird.quack();
        // 当 duck 和 swan 变成 bird 后，它们都忘了如何翱翔于天际，只记得该怎么叫唤了。。
        // 因此，以下代码会报错
        // bird.fly();
    }
}
```

#### 我的解答

```rust
use std::ops::BitXor;

trait Bird {
    fn quack(&self);
}

struct Duck;
impl Duck {
    fn fly(&self) {
        println!("Look, the duck is flying")
    }
}
struct Swan;
impl Swan {
    fn fly(&self) {
        println!("Look, the duck.. oh sorry, the swan is flying")
    }
}

impl Bird for Duck {
    fn quack(&self) {
        println!("{}", "duck duck");
    }
}

impl Bird for Swan {
    fn quack(&self) {
        println!("{}", "swan swan");
    }
}

fn main() {
    // 填空
    let birds: [Box<dyn Bird>; 2] = [Box::new(Duck {}), Box::new(Swan {})];

    for bird in birds {
        bird.quack();
        // 当 duck 和 swan 变成 bird 后，它们都忘了如何翱翔于天际，只记得该怎么叫唤了。。
        // 因此，以下代码会报错
        // bird.fly();
    }
}
```

### 问题三

`&dyn and Box<dyn>`

```rust
// 填空
trait Draw {
    fn draw(&self) -> String;
}

impl Draw for u8 {
    fn draw(&self) -> String {
        format!("u8: {}", *self)
    }
}

impl Draw for f64 {
    fn draw(&self) -> String {
        format!("f64: {}", *self)
    }
}

fn main() {
    let x = 1.1f64;
    let y = 8u8;

    // draw x
    draw_with_box(__);

    // draw y
    draw_with_ref(&y);

    println!("Success!")
}

fn draw_with_box(x: Box<dyn Draw>) {
    x.draw();
}

fn draw_with_ref(x: __) {
    x.draw();
}
```

#### 我的解答

```rust
// 填空
trait Draw {
    fn draw(&self) -> String;
}

impl Draw for u8 {
    fn draw(&self) -> String {
        format!("u8: {}", *self)
    }
}

impl Draw for f64 {
    fn draw(&self) -> String {
        format!("f64: {}", *self)
    }
}

fn main() {
    let x = 1.1f64;
    let y = 8u8;

    // draw x
    draw_with_box(Box::new(x));

    // draw y
    draw_with_ref(&y);

    println!("Success!")
}

fn draw_with_box(x: Box<dyn Draw>) {
    x.draw();
}

fn draw_with_ref(x: &dyn Draw) {
    x.draw();
}
```

### 问题四

静态分发和动态分发 [Static and Dynamic dispatch](https://course.rs/basic/trait/trait-object.html#%E7%89%B9%E5%BE%81%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%8A%A8%E6%80%81%E5%88%86%E5%8F%91)

```rust
trait Foo {
    fn method(&self) -> String;
}

impl Foo for u8 {
    fn method(&self) -> String { format!("u8: {}", *self) }
}

impl Foo for String {
    fn method(&self) -> String { format!("string: {}", *self) }
}

// 通过泛型实现以下函数
fn static_dispatch...

// 通过特征对象实现以下函数
fn dynamic_dispatch...

fn main() {
    let x = 5u8;
    let y = "Hello".to_string();

    static_dispatch(x);
    dynamic_dispatch(&y);

    println!("Success!")
}
```

#### 我的解答

```rust
trait Foo {
    fn method(&self) -> String;
}

impl Foo for u8 {
    fn method(&self) -> String { format!("u8: {}", *self) }
}

impl Foo for String {
    fn method(&self) -> String { format!("string: {}", *self) }
}

// 通过泛型实现以下函数
fn static_dispatch<T: Foo>(a: T) {
    a.method();
}

// 通过特征对象实现以下函数
fn dynamic_dispatch(a: &dyn Foo) {
    a.method();
}

fn main() {
    let x = 5u8;
    let y = "Hello".to_string();

    static_dispatch(x);
    dynamic_dispatch(&y);

    println!("Success!")
}
```

### 问题五

一个特征能变成特征对象，首先该特征必须是对象安全的，即该特征的所有方法都必须拥有以下特点：

- 返回类型不能是 Self
- 不能使用泛型参数

```rust
// 使用至少两种方法让代码工作
// 不要添加/删除任何代码行
trait MyTrait {
    fn f(&self) -> Self;
}

impl MyTrait for u32 {
    fn f(&self) -> Self { 42 }
}

impl MyTrait for String {
    fn f(&self) -> Self { self.clone() }
}

fn my_function(x: Box<dyn MyTrait>)  {
    x.f()
}

fn main() {
    my_function(Box::new(13_u32));
    my_function(Box::new(String::from("abc")));

    println!("Success!")
}
```

#### 我的解答

```rust
// 使用至少两种方法让代码工作
// 不要添加/删除任何代码行
trait MyTrait {
    fn f(&self) -> Box<dyn MyTrait>;
}

impl MyTrait for u32 {
    fn f(&self) -> Box<dyn MyTrait> {
        Box::new(42)
    }
}

impl MyTrait for String {
    fn f(&self) -> Box<dyn MyTrait> {
        Box::new(self.clone())
    }
}

fn my_function(x: Box<dyn MyTrait>) -> Box<dyn MyTrait> {
    x.f()
}

fn main() {
    my_function(Box::new(13_u32));
    my_function(Box::new(String::from("abc")));

    println!("Success!")
}
```

// TODO https://zh.practice.rs/generics-traits/intro.html
