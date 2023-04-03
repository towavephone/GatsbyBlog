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

## 进一步深入特征

### 问题一

关联类型主要用于提升代码的可读性，例如以下代码

```rust
#![allow(unused)]
fn main() {
    pub trait CacheableItem: Clone + Default + fmt::Debug + Decodable + Encodable {
        type Address: AsRef<[u8]> + Clone + fmt::Debug + Eq + Hash;
        fn is_null(&self) -> bool;
    }
}
```

相比 `AsRef<[u8]> + Clone + fmt::Debug + Eq + Hash`，Address 的使用可以极大的减少其它类型在实现该特征时所需的模版代码

```rust
struct Container(i32, i32);

// 使用关联类型实现重新实现以下特征
// trait Contains {
//    type A;
//    type B;

trait Contains<A, B> {
    fn contains(&self, _: &A, _: &B) -> bool;
    fn first(&self) -> i32;
    fn last(&self) -> i32;
}

impl Contains<i32, i32> for Container {
    fn contains(&self, number_1: &i32, number_2: &i32) -> bool {
        (&self.0 == number_1) && (&self.1 == number_2)
    }
    // Grab the first number.
    fn first(&self) -> i32 { self.0 }

    // Grab the last number.
    fn last(&self) -> i32 { self.1 }
}

fn difference<A, B, C: Contains<A, B>>(container: &C) -> i32 {
    container.last() - container.first()
}

fn main() {
    let number_1 = 3;
    let number_2 = 10;

    let container = Container(number_1, number_2);

    println!("Does container contain {} and {}: {}",
        &number_1, &number_2,
        container.contains(&number_1, &number_2));
    println!("First number: {}", container.first());
    println!("Last number: {}", container.last());

    println!("The difference is: {}", difference(&container));
}
```

#### 我的解答

```rust
struct Container(i32, i32);

// 使用关联类型实现重新实现以下特征
trait Contains {
    type A;
    type B;
    fn contains(&self, _: &Self::A, _: &Self::B) -> bool;
    fn first(&self) -> i32;
    fn last(&self) -> i32;
}

// trait Contains<A, B> {
//     fn contains(&self, _: &A, _: &B) -> bool;
//     fn first(&self) -> i32;
//     fn last(&self) -> i32;
// }

impl Contains for Container {
    type A = i32;

    type B = i32;

    fn contains(&self, number_1: &i32, number_2: &i32) -> bool {
        (&self.0 == number_1) && (&self.1 == number_2)
    }

    // Grab the first number.
    fn first(&self) -> i32 {
        self.0
    }

    // Grab the last number.
    fn last(&self) -> i32 {
        self.1
    }
}

fn difference<C: Contains>(container: &C) -> i32 {
    container.last() - container.first()
}

fn main() {
    let number_1 = 3;
    let number_2 = 10;

    let container = Container(number_1, number_2);

    println!(
        "Does container contain {} and {}: {}",
        number_1,
        number_2,
        container.contains(&number_1, &number_2)
    );
    println!("First number: {}", container.first());
    println!("Last number: {}", container.last());

    println!("The difference is: {}", difference(&container));
}
```

### 问题二

当我们使用泛型类型参数时，可以为该泛型参数指定一个具体的默认类型，这样当实现该特征时，如果该默认类型可以使用，那用户再无需手动指定具体的类型。

```rust
use std::ops::Sub;

#[derive(Debug, PartialEq)]
struct Point<T> {
    x: T,
    y: T,
}

// 用三种方法填空: 其中两种使用默认的泛型参数，另外一种不使用
impl __ {
    type Output = Self;

    fn sub(self, other: Self) -> Self::Output {
        Point {
            x: self.x - other.x,
            y: self.y - other.y,
        }
    }
}

fn main() {
    assert_eq!(Point { x: 2, y: 3 } - Point { x: 1, y: 0 },
        Point { x: 1, y: 3 });

    println!("Success!")
}
```

#### 我的解答

```rust
use std::ops::Sub;

#[derive(Debug, PartialEq)]
struct Point<T> {
    x: T,
    y: T,
}

// 用三种方法填空: 其中两种使用默认的泛型参数，另外一种不使用
impl <T: Sub<Output = T>> Sub<Point<T>> for Point<T> {
    type Output = Self;

    fn sub(self, other: Self) -> Self::Output {
        Point {
            x: self.x - other.x,
            y: self.y - other.y,
        }
    }
}

fn main() {
    assert_eq!(Point { x: 2, y: 3 } - Point { x: 1, y: 0 },
        Point { x: 1, y: 3 });

    println!("Success!")
}
```

```rust
use std::ops::Sub;

#[derive(Debug, PartialEq)]
struct Point<T> {
    x: T,
    y: T,
}

// 用三种方法填空: 其中两种使用默认的泛型参数，另外一种不使用
impl <T: Sub<Output = T>> Sub<Self> for Point<T> {
    type Output = Self;

    fn sub(self, other: Self) -> Self::Output {
        Point {
            x: self.x - other.x,
            y: self.y - other.y,
        }
    }
}

fn main() {
    assert_eq!(Point { x: 2, y: 3 } - Point { x: 1, y: 0 },
        Point { x: 1, y: 3 });

    println!("Success!")
}
```

```rust
use std::ops::Sub;

#[derive(Debug, PartialEq)]
struct Point<T> {
    x: T,
    y: T,
}

// 用三种方法填空: 其中两种使用默认的泛型参数，另外一种不使用
impl <T: Sub<Output = T>> Sub for Point<T> {
    type Output = Self;

    fn sub(self, other: Self) -> Self::Output {
        Point {
            x: self.x - other.x,
            y: self.y - other.y,
        }
    }
}

fn main() {
    assert_eq!(Point { x: 2, y: 3 } - Point { x: 1, y: 0 },
        Point { x: 1, y: 3 });

    println!("Success!")
}
```

### 问题三

在 Rust 中，两个不同特征的方法完全可以同名，且你可以为同一个类型同时实现这两个特征。这种情况下，就出现了一个问题：该如何调用这两个特征上定义的同名方法。为了解决这个问题，我们需要使用完全限定语法(Fully Qualified Syntax)。

```rust
trait UsernameWidget {
    fn get(&self) -> String;
}

trait AgeWidget {
    fn get(&self) -> u8;
}

struct Form {
    username: String,
    age: u8,
}

impl UsernameWidget for Form {
    fn get(&self) -> String {
        self.username.clone()
    }
}

impl AgeWidget for Form {
    fn get(&self) -> u8 {
        self.age
    }
}

fn main() {
    let form = Form{
        username: "rustacean".to_owned(),
        age: 28,
    };

    // 如果你反注释下面一行代码，将看到一个错误: Fully Qualified Syntax
    // 毕竟，这里有好几个同名的 `get` 方法
    //
    // println!("{}", form.get());

    let username = UsernameWidget::get(&form);
    assert_eq!("rustacean".to_owned(), username);
    let age = AgeWidget::get(&form); // 你还可以使用以下语法 `<Form as AgeWidget>::get`
    assert_eq!(28, age);

    println!("Success!")
}
```

```rust
trait Pilot {
    fn fly(&self) -> String;
}

trait Wizard {
    fn fly(&self) -> String;
}

struct Human;

impl Pilot for Human {
    fn fly(&self) -> String {
        String::from("This is your captain speaking.")
    }
}

impl Wizard for Human {
    fn fly(&self) -> String {
        String::from("Up!")
    }
}

impl Human {
    fn fly(&self) -> String {
        String::from("*waving arms furiously*")
    }
}

fn main() {
    let person = Human;

    assert_eq!(__, "This is your captain speaking.");
    assert_eq!(__, "Up!");

    assert_eq!(__, "*waving arms furiously*");

    println!("Success!")
}
```

#### 我的解答

```rust
trait Pilot {
    fn fly(&self) -> String;
}

trait Wizard {
    fn fly(&self) -> String;
}

struct Human;

impl Pilot for Human {
    fn fly(&self) -> String {
        String::from("This is your captain speaking.")
    }
}

impl Wizard for Human {
    fn fly(&self) -> String {
        String::from("Up!")
    }
}

impl Human {
    fn fly(&self) -> String {
        String::from("*waving arms furiously*")
    }
}

fn main() {
    let person = Human;

    assert_eq!(Pilot::fly(&person), "This is your captain speaking.");
    assert_eq!(Wizard::fly(&person), "Up!");

    assert_eq!(person.fly(), "*waving arms furiously*");

    println!("Success!")
}
```

### 问题四

有些时候我们希望在特征上实现类似继承的特性，例如让一个特征 A 使用另一个特征 B 的功能。这种情况下，一个类型要实现特征 A 首先要实现特征 B， 特征 B 就被称为 supertrait

```rust
trait Person {
    fn name(&self) -> String;
}

// Person 是 Student 的 supertrait .
// 实现 Student 需要同时实现 Person.
trait Student: Person {
    fn university(&self) -> String;
}

trait Programmer {
    fn fav_language(&self) -> String;
}

// CompSciStudent (computer science student) 是 Programmer
// 和 Student 的 subtrait. 实现 CompSciStudent 需要先实现这两个 supertraits.
trait CompSciStudent: Programmer + Student {
    fn git_username(&self) -> String;
}

fn comp_sci_student_greeting(student: &dyn CompSciStudent) -> String {
    format!(
        "My name is {} and I attend {}. My favorite language is {}. My Git username is {}",
        student.name(),
        student.university(),
        student.fav_language(),
        student.git_username()
    )
}

struct CSStudent {
    name: String,
    university: String,
    fav_language: String,
    git_username: String
}

// 为 CSStudent 实现所需的特征
impl ...

fn main() {
    let student = CSStudent {
        name: "Sunfei".to_string(),
        university: "XXX".to_string(),
        fav_language: "Rust".to_string(),
        git_username: "sunface".to_string()
    };

    // 填空
    println!("{}", comp_sci_student_greeting(__));
}
```

#### 我的解答

```rust
trait Person {
    fn name(&self) -> String;
}

// Person 是 Student 的 supertrait
// 实现 Student 需要同时实现 Person
trait Student: Person {
    fn university(&self) -> String;
}

trait Programmer {
    fn fav_language(&self) -> String;
}

// CompSciStudent (computer science student) 是 Programmer
// 和 Student 的 subtrait 实现 CompSciStudent 需要先实现这两个 supertraits
trait CompSciStudent: Programmer + Student {
    fn git_username(&self) -> String;
}

fn comp_sci_student_greeting(student: &dyn CompSciStudent) -> String {
    format!(
        "My name is {} and I attend {}. My favorite language is {}. My Git username is {}",
        student.name(),
        student.university(),
        student.fav_language(),
        student.git_username()
    )
}

struct CSStudent {
    name: String,
    university: String,
    fav_language: String,
    git_username: String,
}

impl Person for CSStudent {
    fn name(&self) -> String {
        self.name.clone()
    }
}

impl Student for CSStudent {
    fn university(&self) -> String {
        self.university.clone()
    }
}

impl Programmer for CSStudent {
    fn fav_language(&self) -> String {
        self.fav_language.clone()
    }
}

// 为 CSStudent 实现所需的特征
impl CompSciStudent for CSStudent {
    fn git_username(&self) -> String {
        self.git_username.clone()
    }
}

fn main() {
    let student = CSStudent {
        name: "Sunfei".to_string(),
        university: "XXX".to_string(),
        fav_language: "Rust".to_string(),
        git_username: "sunface".to_string(),
    };

    // 填空
    println!("{}", comp_sci_student_greeting(&student));
}
```

### 问题五

关于孤儿原则的详细介绍请参见 [特征定义与实现的位置孤儿规则](https://course.rs/basic/trait/trait#%E7%89%B9%E5%BE%81%E5%AE%9A%E4%B9%89%E4%B8%8E%E5%AE%9E%E7%8E%B0%E7%9A%84%E4%BD%8D%E7%BD%AE%E5%AD%A4%E5%84%BF%E8%A7%84%E5%88%99) 和 [在外部类型上实现外部特征](https://course.rs/basic/trait/advance-trait.html#%E5%9C%A8%E5%A4%96%E9%83%A8%E7%B1%BB%E5%9E%8B%E4%B8%8A%E5%AE%9E%E7%8E%B0%E5%A4%96%E9%83%A8%E7%89%B9%E5%BE%81newtype)。

```rust
use std::fmt;

// 定义一个 newtype `Pretty`


impl fmt::Display for Pretty {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "\"{}\"", self.0.clone() + ", world")
    }
}

fn main() {
    let w = Pretty("hello".to_string());
    println!("w = {}", w);
}
```

#### 我的解答

```rust
use std::fmt;

// 定义一个 newtype `Pretty`

struct Pretty(String);

impl fmt::Display for Pretty {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "\"{}\"", self.0.clone() + ", world")
    }
}

fn main() {
    let w = Pretty("hello".to_string());
    println!("w = {}", w);
}
```

# 集合类型

## 动态字符串 String

### 问题一

std::string::String 是 UTF-8 编码、可增长的动态字符串，它也是我们日常开发中最常用的字符串类型，同时对于它所拥有的内容拥有所有权

```rust
// 填空并修复错误
// 1. 不要使用 `to_string()`
// 2. 不要添加/删除任何代码行
fn main() {
    let mut s: String = "hello, ";
    s.push_str("world".to_string());
    s.push(__);

    move_ownership(s);

    assert_eq!(s, "hello, world!");

    println!("Success!")
}

fn move_ownership(s: String) {
    println!("ownership of \"{}\" is moved here!", s)
}
```

#### 我的解答

```rust
// 填空并修复错误
// 1. 不要使用 `to_string()`
// 2. 不要添加/删除任何代码行
fn main() {
    let mut s: String = String::from("hello, ");
    s.push_str(&"world".to_string());
    s.push('!');

    move_ownership(&s);

    assert_eq!(s, "hello, world!");

    println!("Success!")
}

fn move_ownership(s: &str) {
    println!("ownership of \"{}\" is moved here!", s)
}
```

### 问题二

虽然 String 的底层是 `Vec<u8>` 也就是字节数组的形式存储的，但是它是基于 UTF-8 编码的字符序列。String 分配在堆上、可增长且不是以 null 结尾

而 &str 是切片引用类型 `&[u8]`，指向一个合法的 UTF-8 字符序列，总之 &str 和 String 的关系类似于 `&[T]` 和 `Vec<T>` 。

参考：[易混淆概念解析 - &str 和 String](https://course.rs/difficulties/string.html)。

```rust
// 填空
fn main() {
   let mut s = String::from("hello, world");

   let slice1: &str = __; // 使用两种方法
   assert_eq!(slice1, "hello, world");

   let slice2 = __;
   assert_eq!(slice2, "hello");

   let slice3: __ = __;
   slice3.push('!');
   assert_eq!(slice3, "hello, world!");

   println!("Success!")
}
```

#### 我的解答

```rust
// 填空
fn main() {
    let mut s = String::from("hello, world");

    let slice1: &str = &s; // 使用两种方法
    assert_eq!(slice1, "hello, world");

    let slice2 = &s[0..5];
    assert_eq!(slice2, "hello");

    let mut slice3: String = s;
    slice3.push('!');
    assert_eq!(slice3, "hello, world!");

    println!("Success!")
}
```

### 问题三

```rust
// 问题:  我们的代码中发生了多少次堆内存分配？
// 你的回答:
fn main() {
    // 基于 `&str` 类型创建一个 String,
    // 字符串字面量的类型是 `&str`
   let s: String = String::from("hello, world!");

   // 创建一个切片引用指向 String `s`
   let slice: &str = &s;

   // 基于刚创建的切片来创建一个 String
   let s: String = slice.to_string();

   assert_eq!(s, "hello, world!");

   println!("Success!")
}
```

#### 我的解答

```rust
// 问题:  我们的代码中发生了多少次堆内存分配？
// 你的回答: 2
fn main() {
    // 基于 `&str` 类型创建一个 String,
    // 字符串字面量的类型是 `&str`
   let s: String = String::from("hello, world!");

   // 创建一个切片引用指向 String `s`
   let slice: &str = &s;

   // 基于刚创建的切片来创建一个 String
   let s: String = slice.to_string();

   assert_eq!(s, "hello, world!");

   println!("Success!")
}
```

### 问题四

由于 String 都是 UTF-8 编码的，这会带来几个影响:

- 如果你需要的是非 UTF-8 字符串，可以考虑 [OsString](https://doc.rust-lang.org/stable/std/ffi/struct.OsString.html)
- 无法通过索引的方式访问一个 String

具体请看 [字符串索引](https://course.rs/basic/compound-type/string-slice.html#%E5%AD%97%E7%AC%A6%E4%B8%B2%E7%B4%A2%E5%BC%95)

我们无法通过索引的方式访问字符串中的某个字符，但是可以通过切片的方式来获取字符串的某一部分 `&s1[start..end]`

```rust
// 填空并修复错误
fn main() {
    let s = String::from("hello, 世界");
    let slice1 = s[0]; //提示: `h` 在 UTF-8 编码中只占用 1 个字节
    assert_eq!(slice1, "h");

    let slice2 = &s[3..5];// 提示: `中` 在 UTF-8 编码中占用 3 个字节
    assert_eq!(slice2, "世");

    // 迭代 s 中的所有字符
    for (i, c) in s.__ {
        if i == 7 {
            assert_eq!(c, '世')
        }
    }

    println!("Success!")
}
```

#### 我的解答

```rust
// 填空并修复错误
fn main() {
    let s = String::from("hello, 世界");
    let slice1 = &s[0..1]; //提示: `h` 在 UTF-8 编码中只占用 1 个字节
    assert_eq!(slice1, "h");

    let slice2 = &s[7..10]; // 提示: `中` 在 UTF-8 编码中占用 3 个字节
    assert_eq!(slice2, "世");

    // 迭代 s 中的所有字符
    for (i, c) in s.chars().enumerate() {
        if i == 7 {
            assert_eq!(c, '世')
        }
    }

    println!("Success!")
}
```

### 问题五

我们可以使用 [utf8_slice](https://docs.rs/utf8_slice/1.0.0/utf8_slice/fn.slice.html) 来按照字符的自然索引方式对 UTF-8 字符串进行切片访问，与之前的切片方式相比，它索引的是字符，而之前的方式索引的是字节

```rust
use utf8_slice;
fn main() {
   let s = "The 🚀 goes to the 🌑!";

   let rocket = utf8_slice::slice(s, 4, 5);
   // Will equal "🚀"
}
```

```rust
// 提示: 也许你需要使用 from_utf8 方法
// 填空
fn main() {
    let mut s = String::new();
    __;

    let v = vec![104, 101, 108, 108, 111];

    // 将字节数组转换成 String
    let s1 = __;


    assert_eq!(s, s1);

    println!("Success!")
}
```

#### 我的解答

```rust
// 提示: 也许你需要使用 from_utf8 方法
// 填空
fn main() {
    let mut s = String::new();
    s.push_str("hello");

    let v = vec![104, 101, 108, 108, 111];

    // 将字节数组转换成 String
    let s1 = String::from_utf8(v).unwrap();

    assert_eq!(s, s1);

    println!("Success!")
}
```

### 问题六

事实上 String 是一个智能指针，它作为一个结构体存储在栈上，然后指向存储在堆上的字符串底层数据

存储在栈上的智能指针结构体由三部分组成：一个指针只指向堆上的字节数组，已使用的长度以及已分配的容量 capacity (已使用的长度小于等于已分配的容量，当容量不够时，会重新分配内存空间)

如果 String 的当前容量足够，那么添加字符将不会导致新的内存分配

```rust
// 修改下面的代码以打印如下内容:
// 25
// 25
// 25
// 循环中不会发生任何内存分配
fn main() {
    let mut s = String::new();

    println!("{}", s.capacity());

    for _ in 0..2 {
        s.push_str("hello");
        println!("{}", s.capacity());
    }

    println!("Success!")
}
```

#### 我的解答

```rust
// 修改下面的代码以打印如下内容:
// 25
// 25
// 25
// 循环中不会发生任何内存分配
fn main() {
    let mut s = String::with_capacity(25);

    println!("{}", s.capacity());

    for _ in 0..2 {
        s.push_str("hello");
        println!("{}", s.capacity());
    }

    println!("Success!")
}
```

### 问题七

```rust
// 填空
use std::mem;

fn main() {
    let story = String::from("Rust By Practice");

    // 阻止 String 的数据被自动 drop
    let mut story = mem::ManuallyDrop::new(story);

    let ptr = story.__();
    let len = story.__();
    let capacity = story.__();

    assert_eq!(16, len);

    // 我们可以基于 ptr 指针、长度和容量来重新构建 String.
    // 这种操作必须标记为 unsafe，因为我们需要自己来确保这里的操作是安全的
    let s = unsafe { String::from_raw_parts(ptr, len, capacity) };

    assert_eq!(*story, s);

    println!("Success!")
}
```

#### 我的解答

```rust
// 填空
use std::mem;

fn main() {
    let story = String::from("Rust By Practice");

    // 阻止 String 的数据被自动 drop
    let mut story = mem::ManuallyDrop::new(story);

    let ptr = story.as_mut_ptr();
    let len = story.len();
    let capacity = story.capacity();

    assert_eq!(16, len);

    // 我们可以基于 ptr 指针、长度和容量来重新构建 String.
    // 这种操作必须标记为 unsafe，因为我们需要自己来确保这里的操作是安全的
    let s = unsafe { String::from_raw_parts(ptr, len, capacity) };

    assert_eq!(*story, s);

    println!("Success!")
}
```

## 动态数组 Vector

相比 `[T; N]` 形式的数组，Vector 最大的特点就是可以动态调整长度

### 问题一

```rust
fn main() {
    let arr: [u8; 3] = [1, 2, 3];

    let v = Vec::from(arr);
    is_vec(v);

    let v = vec![1, 2, 3];
    is_vec(v);

    // vec!(..) 和 vec![..] 是同样的宏，宏可以使用 []、()、{}三种形式，因此...
    let v = vec!(1, 2, 3);
    is_vec(v);

    // ...在下面的代码中, v 是 Vec<[u8; 3]> , 而不是 Vec<u8>
    // 使用 Vec::new 和 `for` 来重写下面这段代码
    let v1 = vec!(arr);
    is_vec(v1);

    assert_eq!(v, v1);

    println!("Success!")
}

fn is_vec(v: Vec<u8>) {}
```

#### 我的解答

```rust
fn main() {
    let arr: [u8; 3] = [1, 2, 3];

    let v = Vec::from(arr);
    is_vec(&v);

    let v = vec![1, 2, 3];
    is_vec(&v);

    // vec!(..) 和 vec![..] 是同样的宏，宏可以使用 []、()、{}三种形式，因此...
    let v = vec!(1, 2, 3);
    is_vec(&v);

    // vec!(..) 和 vec![..] 是同样的宏，宏可以使用 []、()、{}三种形式，因此...
    let v = vec!{1, 2, 3};
    is_vec(&v);

    // ...在下面的代码中, v 是 Vec<[u8; 3]> , 而不是 Vec<u8>
    // 使用 Vec::new 和 `for` 来重写下面这段代码
    let mut v1 = Vec::new();
    for i in &v {
        v1.push(*i)
    }
    is_vec(&v1);

    assert_eq!(v, v1);

    println!("Success!")
}

fn is_vec(v: &Vec<u8>) {}
```

### 问题二

Vec 可以使用 extend 方法进行扩展

```rust
// 填空
fn main() {
    let mut v1 = Vec::from([1, 2, 4]);
    v1.pop();
    v1.push(3);

    let mut v2 = Vec::new();
    v2.__;

    assert_eq!(v1, v2);

    println!("Success!")
}
```

#### 我的解答

```rust
// 填空
fn main() {
    let mut v1 = Vec::from([1, 2, 4]);
    v1.pop();
    v1.push(3);

    let mut v2 = Vec::new();
    v2.extend(&v1);

    assert_eq!(v1, v2);

    println!("Success!")
}
```

### 问题三

只要为 Vec 实现了 `From<T>` 特征，那么 T 就可以被转换成 Vec。

```rust
// 填空
fn main() {
   // array -> Vec
   // impl From<[T; N]> for Vec
   let arr = [1, 2, 3];
   let v1 = __(arr);
   let v2: Vec<i32> = arr.__();

   assert_eq!(v1, v2);


   // String -> Vec
   // impl From<String> for Vec
   let s = "hello".to_string();
   let v1: Vec<u8> = s.__();

   let s = "hello".to_string();
   let v2 = s.into_bytes();
   assert_eq!(v1, v2);

   // impl<'_> From<&'_ str> for Vec
   let s = "hello";
   let v3 = Vec::__(s);
   assert_eq!(v2, v3);

   // 迭代器 Iterators 可以通过 collect 变成 Vec
   let v4: Vec<i32> = [0; 10].into_iter().collect();
   assert_eq!(v4, vec![0; 10]);

   println!("Success!")
}
```

#### 我的解答

```rust
// 填空
fn main() {
    // array -> Vec
    // impl From<[T; N]> for Vec
    let arr = [1, 2, 3];
    let v1 = Vec::from(arr);
    let v2: Vec<i32> = arr.into();

    assert_eq!(v1, v2);

    // String -> Vec
    // impl From<String> for Vec
    let s = "hello".to_string();
    let v1: Vec<u8> = s.into();

    let s = "hello".to_string();
    let v2 = s.into_bytes();
    assert_eq!(v1, v2);

    // impl<'_> From<&'_ str> for Vec
    let s = "hello";
    let v3 = Vec::from(s);
    assert_eq!(v2, v3);

    // 迭代器 Iterators 可以通过 collect 变成 Vec
    let v4: Vec<i32> = [0; 10].into_iter().collect();
    assert_eq!(v4, vec![0; 10]);

    println!("Success!")
}
```

### 问题四

```rust
// 修复错误并实现缺失的代码
fn main() {
    let mut v = Vec::from([1, 2, 3]);
    for i in 0..5 {
        println!("{:?}", v[i])
    }

    for i in 0..5 {
       // 实现这里的代码...
    }

    assert_eq!(v, vec![2, 3, 4, 5, 6]);

    println!("Success!")
}
```

#### 我的解答

```rust
// 修复错误并实现缺失的代码
fn main() {
    let mut v = Vec::from([1, 2, 3]);
    for i in 0..5 {
        println!("{:?}", v.get(i))
    }

    for i in 0..5 {
        // match i {
        //     0..=2 => v[i] += 1,
        //     _ => v.push(i + 2)
        // }

        if let Some(x) = v.get(i) {
            v[i] = x + 1
        } else {
            v.push(i + 2)
        }
        // 实现这里的代码...
    }

    assert_eq!(v, vec![2, 3, 4, 5, 6]);

    println!("Success!")
}
```

### 问题五

与 String 的切片类似，Vec 也可以使用切片。如果说 Vec 是可变的，那它的切片就是不可变或者说只读的，我们可以通过 & 来获取切片

在 Rust 中，将切片作为参数进行传递是更常见的使用方式，例如当一个函数只需要可读性时，那传递 Vec 或 String 的切片 `&[T]` / `&str` 会更加适合

```rust
// 修复错误
fn main() {
    let mut v = vec![1, 2, 3];

    let slice1 = &v[..];
    // 越界访问将导致 panic.
    // 修改时必须使用 `v.len`
    let slice2 = &v[0..4];

    assert_eq!(slice1, slice2);

    // 切片是只读的
    // 注意：切片和 `&Vec` 是不同的类型，后者仅仅是 `Vec` 的引用，并可以通过解引用直接获取 `Vec`
    let vec_ref: &mut Vec<i32> = &mut v;
    (*vec_ref).push(4);
    let slice3 = &mut v[0..3];
    slice3.push(4);

    assert_eq!(slice3, &[1, 2, 3, 4]);

    println!("Success!")
}
```

#### 我的解答

```rust
// 修复错误
fn main() {
    let mut v = vec![1, 2, 3];

    let slice1 = &v[..];
    // 越界访问将导致 panic.
    // 修改时必须使用 `v.len`
    let slice2 = &v[0..v.len()];

    assert_eq!(slice1, slice2);

    // 切片是只读的
    // 注意：切片和 `&Vec` 是不同的类型，后者仅仅是 `Vec` 的引用，并可以通过解引用直接获取 `Vec`
    let vec_ref: &mut Vec<i32> = &mut v;
    (*vec_ref).push(4);
    let slice3 = &mut v[0..];
    // slice3.push(4);

    assert_eq!(slice3, &[1, 2, 3, 4]);

    println!("Success!")
}
```

### 问题六

容量 capacity 是已经分配好的内存空间，用于存储未来添加到 Vec 中的元素。而长度 len 则是当前 Vec 中已经存储的元素数量。如果要添加新元素时，长度将要超过已有的容量，那容量会自动进行增长：Rust 会重新分配一块更大的内存空间，然后将之前的 Vec 拷贝过去，因此，这里就会发生新的内存分配（目前 Rust 的容量调整策略是加倍，例如 2 -> 4 -> 8 ..）。

若这段代码会频繁发生，那频繁的内存分配会大幅影响我们系统的性能，最好的办法就是提前分配好足够的容量，尽量减少内存分配。

```rust
// 修复错误
fn main() {
    let mut vec = Vec::with_capacity(10);

    assert_eq!(vec.len(), __);
    assert_eq!(vec.capacity(), 10);

    // 由于提前设置了足够的容量，这里的循环不会造成任何内存分配...
    for i in 0..10 {
        vec.push(i);
    }
    assert_eq!(vec.len(), __);
    assert_eq!(vec.capacity(), __);

    // ...但是下面的代码会造成新的内存分配
    vec.push(11);
    assert_eq!(vec.len(), 11);
    assert!(vec.capacity() >= 11);


    // 填写一个合适的值，在 `for` 循环运行的过程中，不会造成任何内存分配
    let mut vec = Vec::with_capacity(__);
    for i in 0..100 {
        vec.push(i);
    }

    assert_eq!(vec.len(), __);
    assert_eq!(vec.capacity(), __);

    println!("Success!")
}
```

#### 我的解答

```rust
// 修复错误
fn main() {
    let mut vec = Vec::with_capacity(10);

    assert_eq!(vec.len(), 0);
    assert_eq!(vec.capacity(), 10);

    // 由于提前设置了足够的容量，这里的循环不会造成任何内存分配...
    for i in 0..10 {
        vec.push(i);
    }
    assert_eq!(vec.len(), 10);
    assert_eq!(vec.capacity(), 10);

    // ...但是下面的代码会造成新的内存分配
    vec.push(11);
    assert_eq!(vec.len(), 11);
    assert!(vec.capacity() >= 11);


    // 填写一个合适的值，在 `for` 循环运行的过程中，不会造成任何内存分配
    let mut vec = Vec::with_capacity(100);
    for i in 0..100 {
        vec.push(i);
    }

    assert_eq!(vec.len(), 100);
    assert_eq!(vec.capacity(), 100);

    println!("Success!")
}
```

### 问题七

Vec 中的元素必须是相同的类型，例如以下代码会发生错误:

```rust
fn main() {
   let v = vec![1, 2.0, 3];
}
```

但是我们可以使用枚举或特征对象来存储不同的类型

```rust
#[derive(Debug)]
enum IpAddr {
    V4(String),
    V6(String),
}
fn main() {
    // 填空
    let v : Vec<IpAddr>= __;

    // 枚举的比较需要派生 PartialEq 特征
    assert_eq!(v[0], IpAddr::V4("127.0.0.1".to_string()));
    assert_eq!(v[1], IpAddr::V6("::1".to_string()));

    println!("Success!")
}
```

#### 我的解答

```rust
#[derive(Debug, PartialEq)]
enum IpAddr {
    V4(String),
    V6(String),
}
fn main() {
    // 填空
    let v: Vec<IpAddr> = vec![
        IpAddr::V4("127.0.0.1".to_string()),
        IpAddr::V6("::1".to_string()),
    ];

    // 枚举的比较需要派生 PartialEq 特征
    assert_eq!(v[0], IpAddr::V4("127.0.0.1".to_string()));
    assert_eq!(v[1], IpAddr::V6("::1".to_string()));

    println!("Success!")
}
```

### 问题八

```rust
trait IpAddr {
    fn display(&self);
}

struct V4(String);
impl IpAddr for V4 {
    fn display(&self) {
        println!("ipv4: {:?}",self.0)
    }
}
struct V6(String);
impl IpAddr for V6 {
    fn display(&self) {
        println!("ipv6: {:?}",self.0)
    }
}

fn main() {
    // 填空
    let v: __= vec![
        Box::new(V4("127.0.0.1".to_string())),
        Box::new(V6("::1".to_string())),
    ];

    for ip in v {
        ip.display();
    }
}
```

#### 我的解答

```rust
trait IpAddr {
    fn display(&self);
}

struct V4(String);
impl IpAddr for V4 {
    fn display(&self) {
        println!("ipv4: {:?}", self.0)
    }
}
struct V6(String);
impl IpAddr for V6 {
    fn display(&self) {
        println!("ipv6: {:?}", self.0)
    }
}

fn main() {
    // 填空
    let v: Vec<Box<dyn IpAddr>> = vec![
        Box::new(V4("127.0.0.1".to_string())),
        Box::new(V6("::1".to_string())),
    ];

    for ip in v {
        ip.display();
    }
}
```

## KV 存储 HashMap

HashMap 默认使用 `SipHash 1-3` 哈希算法，该算法对于抵抗 HashDos 攻击非常有效。在性能方面，如果你的 key 是中型大小的，那该算法非常不错，但是如果是小型的 key（例如整数）亦或是大型的 key（例如字符串），那你需要采用社区提供的其它算法来提高性能

哈希表的算法是基于 Google 的 [SwissTable](https://abseil.io/blog/20180927-swisstables)，你可以在这里找到 C++ 的实现，同时在 [CppCon talk](https://www.youtube.com/watch?v=ncHmEUmJZf4) 上也有关于算法如何工作的演讲

### 问题一

```rust
// 填空并修复错误
use std::collections::HashMap;
fn main() {
    let mut scores = HashMap::new();
    scores.insert("Sunface", 98);
    scores.insert("Daniel", 95);
    scores.insert("Ashley", 69.0);
    scores.insert("Katie", "58");

    // get 返回一个 Option<&V> 枚举值
    let score = scores.get("Sunface");
    assert_eq!(score, Some(98));

    if scores.contains_key("Daniel") {
        // 索引返回一个值 V
        let score = scores["Daniel"];
        assert_eq!(score, __);
        scores.remove("Daniel");
    }

    assert_eq!(scores.len(), __);

    for (name, score) in scores {
        println!("The score of {} is {}", name, score)
    }
}
```

#### 我的解答

```rust
// 填空并修复错误
use std::collections::HashMap;
fn main() {
    let mut scores = HashMap::new();
    scores.insert("Sunface", 98);
    scores.insert("Daniel", 95);
    scores.insert("Ashley", 69);
    scores.insert("Katie", 58);

    // get 返回一个 Option<&V> 枚举值
    let score = scores.get("Sunface");
    assert_eq!(score, Some(&98));

    if scores.contains_key("Daniel") {
        // 索引返回一个值 V
        let score = scores["Daniel"];
        assert_eq!(score, 95);
        scores.remove("Daniel");
    }

    assert_eq!(scores.len(), 3);

    for (name, score) in scores {
        println!("The score of {} is {}", name, score)
    }
}
```

### 问题二

```rust
use std::collections::HashMap;
fn main() {
    let teams = [
        ("Chinese Team", 100),
        ("American Team", 10),
        ("France Team", 50),
    ];

    let mut teams_map1 = HashMap::new();
    for team in &teams {
        teams_map1.insert(team.0, team.1);
    }

    // 使用两种方法实现 team_map2
    // 提示:其中一种方法是使用 `collect` 方法
    let teams_map2...

    assert_eq!(teams_map1, teams_map2);

    println!("Success!")
}
```

#### 我的解答

```rust
use std::collections::HashMap;
fn main() {
    let teams = [
        ("Chinese Team", 100),
        ("American Team", 10),
        ("France Team", 50),
    ];

    let mut teams_map1 = HashMap::new();
    for team in &teams {
        teams_map1.insert(team.0, team.1);
    }

    // 使用两种方法实现 team_map2
    // 提示:其中一种方法是使用 `collect` 方法
    // let teams_map2 = teams.into_iter().collect();
    let teams_map2 = HashMap::from(teams);

    assert_eq!(teams_map1, teams_map2);

    println!("Success!")
}
```

### 问题三

```rust
// 填空
use std::collections::HashMap;
fn main() {
    // 编译器可以根据后续的使用情况帮我自动推断出 HashMap 的类型，当然你也可以显式地标注类型：HashMap<&str, u8>
    let mut player_stats = HashMap::new();

    // 查询指定的 key, 若不存在时，则插入新的 kv 值
    player_stats.entry("health").or_insert(100);

    assert_eq!(player_stats["health"], __);

    // 通过函数来返回新的值
    player_stats.entry("health").or_insert_with(random_stat_buff);
    assert_eq!(player_stats["health"], __);

    let health = player_stats.entry("health").or_insert(50);
    assert_eq!(health, __);
    *health -= 50;
    assert_eq!(*health, __);

    println!("Success!")
}

fn random_stat_buff() -> u8 {
    // 为了简单，我们没有使用随机，而是返回一个固定的值
    42
}
```

#### 我的解答

```rust
// 填空
use std::collections::HashMap;
fn main() {
    // 编译器可以根据后续的使用情况帮我自动推断出 HashMap 的类型，当然你也可以显式地标注类型：HashMap<&str, u8>
    let mut player_stats = HashMap::new();

    // 查询指定的 key, 若不存在时，则插入新的 kv 值
    player_stats.entry("health").or_insert(100);

    assert_eq!(player_stats["health"], 100);

    // 通过函数来返回新的值
    player_stats.entry("health").or_insert_with(random_stat_buff);
    assert_eq!(player_stats["health"], 100);

    let health = player_stats.entry("health").or_insert(50);
    assert_eq!(health, &100);
    *health -= 50;
    assert_eq!(*health, 50);

    println!("Success!")
}

fn random_stat_buff() -> u8 {
    // 为了简单，我们没有使用随机，而是返回一个固定的值
    42
}
```

### 问题四

任何实现了 Eq 和 Hash 特征的类型都可以用于 HashMap 的 key，包括:

- bool（很少用到，因为它只能表达两种 key）
- int, uint 以及它们的变体，例如 u8、i32 等
- String 和 &str（提示: HashMap 的 key 是 String 类型时，你其实可以使用 &str 配合 get 方法进行查询）

需要注意的是，f32 和 f64 并没有实现 Hash，原因是浮点数精度的问题会导致它们无法进行相等比较。

如果一个集合类型的所有字段都实现了 Eq 和 Hash，那该集合类型会自动实现 Eq 和 Hash。例如 `Vect<T>` 要实现 Hash，那么首先需要 T 实现 Hash

```rust
// 修复错误
// 提示: `derive` 是实现一些常用特征的好办法
use std::collections::HashMap;

struct Viking {
    name: String,
    country: String,
}

impl Viking {
    fn new(name: &str, country: &str) -> Viking {
        Viking {
            name: name.to_string(),
            country: country.to_string(),
        }
    }
}

fn main() {
    // 使用 HashMap 来存储 viking 的生命值
    let vikings = HashMap::from([
        (Viking::new("Einar", "Norway"), 25),
        (Viking::new("Olaf", "Denmark"), 24),
        (Viking::new("Harald", "Iceland"), 12),
    ]);

    // 使用 derive 的方式来打印 viking 的当前状态
    for (viking, health) in &vikings {
        println!("{:?} has {} hp", viking, health);
    }
}
```

关于容量，我们在之前的 Vector 中有详细的介绍，而 HashMap 也可以调整容量：你可以通过 `HashMap::with_capacity(uint)` 使用指定的容量来初始化，或者使用 `HashMap::new()`，后者会提供一个默认的初始化容量

```rust
use std::collections::HashMap;
fn main() {
    let mut map: HashMap<i32, i32> = HashMap::with_capacity(100);
    map.insert(1, 2);
    map.insert(3, 4);
    // 事实上，虽然我们使用了 100 容量来初始化，但是 map 的容量很可能会比 100 更多
    assert!(map.capacity() >= 100);

    // 对容量进行收缩，你提供的值仅仅是一个允许的最小值，实际上，Rust 会根据当前存储的数据量进行自动设置，当然，这个值会尽量靠近你提供的值，同时还可能会预留一些调整空间

    map.shrink_to(50);
    assert!(map.capacity() >= 50);

    // 让 Rust 自行调整到一个合适的值，剩余策略同上
    map.shrink_to_fit();
    assert!(map.capacity() >= 2);
    println!("Success!")
}
```

#### 我的解答

```rust
// 修复错误
// 提示: `derive` 是实现一些常用特征的好办法
use std::collections::HashMap;

#[derive(Eq, Hash, PartialEq, Debug)]
struct Viking {
    name: String,
    country: String,
}

impl Viking {
    fn new(name: &str, country: &str) -> Viking {
        Viking {
            name: name.to_string(),
            country: country.to_string(),
        }
    }
}

fn main() {
    // 使用 HashMap 来存储 viking 的生命值
    let vikings = HashMap::from([
        (Viking::new("Einar", "Norway"), 25),
        (Viking::new("Olaf", "Denmark"), 24),
        (Viking::new("Harald", "Iceland"), 12),
    ]);

    // 使用 derive 的方式来打印 viking 的当前状态
    for (viking, health) in &vikings {
        println!("{:?} has {} hp", viking, health);
    }
}
```

### 问题五

对于实现了 Copy 特征的类型，例如 i32，那类型的值会被拷贝到 HashMap 中。而对于有所有权的类型，例如 String，它们的值的所有权将被转移到 HashMap 中

```rust
// 修复错误，尽可能少的去修改代码
// 不要移除任何代码行！
use std::collections::HashMap;
fn main() {
  let v1 = 10;
  let mut m1 = HashMap::new();
  m1.insert(v1, v1);
  println!("v1 is still usable after inserting to hashmap : {}", v1);

  let v2 = "hello".to_string();
  let mut m2 = HashMap::new();
  // 所有权在这里发生了转移
  m2.insert(v2, v1);

  assert_eq!(v2, "hello");

   println!("Success!")
}
```

在开头，我们提到过如果现有的 `SipHash 1-3` 的性能无法满足你的需求，那么可以使用社区提供的替代算法。

例如其中一个社区库的使用方式如下：

```rust
#![allow(unused)]
fn main() {
   use std::hash::BuildHasherDefault;
   use std::collections::HashMap;
   // 引入第三方的哈希函数
   use twox_hash::XxHash64;

   let mut hash: HashMap<_, _, BuildHasherDefault<XxHash64>> = Default::default();
   hash.insert(42, "the answer");
   assert_eq!(hash.get(&42), Some(&"the answer"));
}
```

#### 我的解答

```rust
// 修复错误，尽可能少的去修改代码
// 不要移除任何代码行！
use std::collections::HashMap;
fn main() {
  let v1 = 10;
  let mut m1 = HashMap::new();
  m1.insert(v1, v1);
  println!("v1 is still usable after inserting to hashmap : {}", v1);

  let v2 = "hello".to_string();
  let mut m2 = HashMap::new();
  // 所有权在这里发生了转移
  m2.insert(&v2, v1);

  assert_eq!(v2, "hello");

   println!("Success!")
}
```

# 生命周期

## 基础

### 问题一

编译器通过生命周期来确保所有的借用都是合法的，典型的，一个变量在创建时生命周期随之开始，销毁时生命周期也随之结束。

```rust
/* 为 `i` 和 `borrow2` 标注合适的生命周期范围 */

// `i` 拥有最长的生命周期，因为它的作用域完整的包含了 `borrow1` 和 `borrow2` 。
// 而 `borrow1` 和 `borrow2` 的生命周期并无关联，因为它们的作用域没有重叠
fn main() {
    let i = 3;
    {
        let borrow1 = &i; // `borrow1` 生命周期开始. ──┐
        //                                           │
        println!("borrow1: {}", borrow1); //         │
    }   // `borrow1` 生命周期结束. ────────────────────┘
    {
        let borrow2 = &i;

        println!("borrow2: {}", borrow2);
    }
}
```

#### 我的解答

```rust
/* 为 `i` 和 `borrow2` 标注合适的生命周期范围 */

// `i` 拥有最长的生命周期，因为它的作用域完整的包含了 `borrow1` 和 `borrow2` 。
// 而 `borrow1` 和 `borrow2` 的生命周期并无关联，因为它们的作用域没有重叠
fn main() {
    let i = 3;
    {
        let borrow1 = &i; // `borrow1` 生命周期开始. ──┐
        //                                           │
        println!("borrow1: {}", borrow1); //         │
    }   // `borrow1` 生命周期结束. ────────────────────┘
    {
        let borrow2 = &i; // `borrow2` 生命周期开始. ──┐
        //                                           │
        println!("borrow2: {}", borrow2); //         │
    }   // `borrow2` 生命周期结束. ────────────────────┘
}
```

### 问题二

示例

```rust
#![allow(unused)]
fn main() {
    {
        let x = 5;            // ----------+-- 'b
                              //           |
        let r = &x;           // --+-- 'a  |
                              //   |       |
        println!("r: {}", r); //   |       |
                              // --+       |
    }                         // ----------+
}
```

```rust
/* 像上面的示例一样，为 `r` 和 `x` 标准生命周期，然后从生命周期的角度解释一下为什么编译错误 */

fn main() {
    {
        let r;                // ---------+-- 'a
                              //          |
        {                     //          |
            let x = 5;        // -+-- 'b  |
            r = &x;           //  |       |
        }                     // -+       |
                              //          |
        println!("r: {}", r); //          |
    }                         // ---------+
}
```

#### 我的解答

r 变量被赋予了生命周期 'a，x 被赋予了生命周期 'b，从图示上可以明显看出生命周期 'b 比 'a 小很多

在编译期，Rust 会比较两个变量的生命周期，结果发现 r 明明拥有生命周期 'a，但是却引用了一个小得多的生命周期 'b，在这种情况下，编译器会认为我们的程序存在风险，因此拒绝运行。

如果想要编译通过，也很简单，只要 'b 比 'a 大就好。总之，x 变量只要比 r 活得久，那么 r 就能随意引用 x 且不会存在危险：

```rust
/* 像上面的示例一样，为 `r` 和 `x` 标准生命周期，然后从生命周期的角度解释一下为什么编译错误 */

fn main() {
    {
        let r;                // ---------+-- 'a
                              //          |
        {                     //          |
            let x = 5;        // -+-- 'b  |
            r = &x;           //  |       |
        }                     // -+       |
                              //          |
        println!("r: {}", r); //          |
    }                         // ---------+
}
```

### 问题三

Rust 的借用检查器使用显式的生命周期标注来确定一个引用的合法范围。但是对于用户来说，我们在大多数场景下，都无需手动去标注生命周期，原因是编译器会在某些情况下自动应用生命周期消除规则。

在了解编译器使用哪些规则帮我们消除生命周期之前，首先还是需要知道该如何手动标记生命周期。

大家先忽略生命周期消除规则，让我们看看，函数签名中的生命周期有哪些限制:

- 需要为每个引用标注上合适的生命周期
- 返回值中的引用，它的生命周期要么跟某个引用参数相同，要么是 `'static`

示例

```rust
// 引用参数中的生命周期 'a 至少要跟函数活得一样久
fn print_one<'a>(x: &'a i32) {
    println!("`print_one`: x is {}", x);
}

// 可变引用依然需要标准生命周期
fn add_one<'a>(x: &'a mut i32) {
    *x += 1;
}

// 下面代码中，每个参数都拥有自己独立的生命周期，事实上，这个例子足够简单，因此它们应该被标记上相同的生命周期 `'a`，但是对于复杂的例子而言，独立的生命周期标注是可能存在的
fn print_multi<'a, 'b>(x: &'a i32, y: &'b i32) {
    println!("`print_multi`: x is {}, y is {}", x, y);
}

// 返回一个通过参数传入的引用是很常见的，但是这种情况下需要标注上正确的生命周期
fn pass_x<'a, 'b>(x: &'a i32, _: &'b i32) -> &'a i32 { x }

fn main() {
    let x = 7;
    let y = 9;

    print_one(&x);
    print_multi(&x, &y);

    let z = pass_x(&x, &y);
    print_one(z);

    let mut t = 3;
    add_one(&mut t);
    print_one(&t);
}
```

```rust
/* 添加合适的生命周期标注，让下面的代码工作 */
fn longest(x: &str, y: &str) -> &str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

fn main() {}
```

#### 我的解答

```rust
/* 添加合适的生命周期标注，让下面的代码工作 */
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

fn main() {}
```

### 问题四

```rust
/* 使用三种方法修复下面的错误  */
fn invalid_output<'a>() -> &'a String {
    &String::from("foo")
}

fn main() {
}
```

#### 我的解答

```rust
/* 使用三种方法修复下面的错误  */
fn invalid_output() -> String {
    String::from("foo")
}

fn main() {
}
```

### 问题五

```rust
// `print_refs` 有两个引用参数，它们的生命周期 `'a` 和 `'b` 至少得跟函数活得一样久
fn print_refs<'a, 'b>(x: &'a i32, y: &'b i32) {
    println!("x is {} and y is {}", x, y);
}

/* 让下面的代码工作 */
fn failed_borrow<'a>() {
    let _x = 12;

    // ERROR: `_x` 活得不够久does not live long enough
    let y: &'a i32 = &_x;

    // 在函数内使用 `'a` 将会报错，原因是 `&_x` 的生命周期显然比 `'a` 要小
    // 你不能将一个小的生命周期强转成大的
}

fn main() {
    let (four, nine) = (4, 9);


    print_refs(&four, &nine);
    // 这里，four 和 nice 的生命周期必须要比函数 print_refs 长

    failed_borrow();
    // `failed_borrow`  没有传入任何引用去限制生命周期 `'a`，因此，此时的 `'a` 生命周期是没有任何限制的，它默认是 `'static`
}
```

#### 我的解答

```rust
// `print_refs` 有两个引用参数，它们的生命周期 `'a` 和 `'b` 至少得跟函数活得一样久
fn print_refs<'a, 'b>(x: &'a i32, y: &'b i32) {
    println!("x is {} and y is {}", x, y);
}

/* 让下面的代码工作 */
fn failed_borrow() {
    let _x = 12;

    // ERROR: `_x` 活得不够久does not live long enough
    let y = &_x;

    // 在函数内使用 `'a` 将会报错，原因是 `&_x` 的生命周期显然比 `'a` 要小
    // 你不能将一个小的生命周期强转成大的
}

fn main() {
    let (four, nine) = (4, 9);

    print_refs(&four, &nine);
    // 这里，four 和 nice 的生命周期必须要比函数 print_refs 长

    failed_borrow();
    // `failed_borrow`  没有传入任何引用去限制生命周期 `'a`，因此，此时的 `'a` 生命周期是没有任何限制的，它默认是 `'static`
}
```

### 问题六

```rust
/* 增加合适的生命周期标准，让代码工作 */

// `i32` 的引用必须比 `Borrowed` 活得更久
#[derive(Debug)]
struct Borrowed(&i32);

// 类似的，下面两个引用也必须比结构体 `NamedBorrowed` 活得更久
#[derive(Debug)]
struct NamedBorrowed {
    x: &i32,
    y: &i32,
}

#[derive(Debug)]
enum Either {
    Num(i32),
    Ref(&i32),
}

fn main() {
    let x = 18;
    let y = 15;

    let single = Borrowed(&x);
    let double = NamedBorrowed { x: &x, y: &y };
    let reference = Either::Ref(&x);
    let number    = Either::Num(y);

    println!("x is borrowed in {:?}", single);
    println!("x and y are borrowed in {:?}", double);
    println!("x is borrowed in {:?}", reference);
    println!("y is *not* borrowed in {:?}", number);
}
```

#### 我的解答

```rust
/* 增加合适的生命周期标准，让代码工作 */

// `i32` 的引用必须比 `Borrowed` 活得更久
#[derive(Debug)]
struct Borrowed<'a>(&'a i32);

// 类似的，下面两个引用也必须比结构体 `NamedBorrowed` 活得更久
#[derive(Debug)]
struct NamedBorrowed<'a, 'b> {
    x: &'a i32,
    y: &'b i32,
}

#[derive(Debug)]
enum Either<'a> {
    Num(i32),
    Ref(&'a i32),
}

fn main() {
    let x = 18;
    let y = 15;

    let single = Borrowed(&x);
    let double = NamedBorrowed { x: &x, y: &y };
    let reference = Either::Ref(&x);
    let number    = Either::Num(y);

    println!("x is borrowed in {:?}", single);
    println!("x and y are borrowed in {:?}", double);
    println!("x is borrowed in {:?}", reference);
    println!("y is *not* borrowed in {:?}", number);
}
```

### 问题七

```rust
/* 让代码工作 */

#[derive(Debug)]
struct NoCopyType {}

#[derive(Debug)]
struct Example<'a, 'b> {
    a: &'a u32,
    b: &'b NoCopyType
}

fn main()
{
  let var_a = 35;
  let example: Example;

  {
    let var_b = NoCopyType {};

    /* 修复错误 */
    example = Example { a: &var_a, b: &var_b };
  }

  println!("(Success!) {:?}", example);
}
```

#### 我的解答

```rust
/* 让代码工作 */

#[derive(Debug)]
struct NoCopyType {}

#[derive(Debug)]
struct Example<'a, 'b> {
    a: &'a u32,
    b: &'b NoCopyType,
}

fn main() {
    let var_a = 35;
    let example: Example;

    let var_b = NoCopyType {};

    /* 修复错误 */
    example = Example {
        a: &var_a,
        b: &var_b,
    };

    println!("(Success!) {:?}", example);
}
```

### 问题八

```rust
#[derive(Debug)]
struct NoCopyType {}

#[derive(Debug)]
#[allow(dead_code)]
struct Example<'a, 'b> {
    a: &'a u32,
    b: &'b NoCopyType
}

/* 修复函数的签名 */
fn fix_me(foo: &Example) -> &NoCopyType
{ foo.b }

fn main()
{
    let no_copy = NoCopyType {};
    let example = Example { a: &1, b: &no_copy };
    fix_me(&example);
    println!("Success!")
}
```

#### 我的解答

```rust
#[derive(Debug)]
struct NoCopyType {}

#[derive(Debug)]
#[allow(dead_code)]
struct Example<'a, 'b> {
    a: &'a u32,
    b: &'b NoCopyType,
}

/* 修复函数的签名 */
fn fix_me<'a>(foo: &'a Example) -> &'a NoCopyType {
    foo.b
}

fn main() {
    let no_copy = NoCopyType {};
    let example = Example { a: &1, b: &no_copy };
    fix_me(&example);
    println!("Success!")
}
```

### 问题九

方法的生命周期标注跟函数类似

示例

```rust
struct Owner(i32);

impl Owner {
    fn add_one<'a>(&'a mut self) { self.0 += 1; }
    fn print<'a>(&'a self) {
        println!("`print`: {}", self.0);
    }
}

fn main() {
    let mut owner = Owner(18);

    owner.add_one();
    owner.print();
}
```

```rust
/* 显式添加生命周期 */

struct ImportantExcerpt<'a> {
    part: &'a str,
}

impl<'a> ImportantExcerpt<'a> {
    fn announce_and_return_part(&self, announcement: &str) -> &str {
        println!("Attention please: {}", announcement);
        self.part
    }
}

fn main() {}
```

#### 我的解答

```rust
/* 显式添加生命周期 */

struct ImportantExcerpt<'a> {
    part: &'a str,
}

impl<'a> ImportantExcerpt<'a> {
    fn announce_and_return_part<'b>(&'a self, announcement: &'b str) -> &'a str {
        println!("Attention please: {}", announcement);
        self.part
    }
}

fn main() {}
```

```rust
/* 显式添加生命周期 */

struct ImportantExcerpt<'a> {
    part: &'a str,
}

impl<'a: 'b, 'b> ImportantExcerpt<'a> {
    fn announce_and_return_part(&'a self, announcement: &'b str) -> &'b str {
        println!("Attention please: {}", announcement);
        self.part
    }
}

fn main() {}
```

```rust
/* 显式添加生命周期 */

struct ImportantExcerpt<'a> {
    part: &'a str,
}

impl<'a> ImportantExcerpt<'a> {
    fn announce_and_return_part<'b>(&'a self, announcement: &'b str) -> &'b str
    where
        'a: 'b,
    {
        println!("Attention please: {}", announcement);
        self.part
    }
}

fn main() {}
```

### 问题十

有一些生命周期的标注方式很常见，因此编译器提供了一些规则，可以让我们在一些场景下无需去标注生命周期，既节省了敲击键盘的繁琐，又能提升可读性。

这种规则被称为生命周期消除规则（Elision），该规则之所以存在，仅仅是因为这些场景太通用了，为了方便用户而已。事实上对于借用检查器而言，该有的生命周期一个都不能少，只不过对于用户而言，可以省去一些。

```rust
/* 移除所有可以消除的生命周期标注 */

fn nput<'a>(x: &'a i32) {
    println!("`annotated_input`: {}", x);
}

fn pass<'a>(x: &'a i32) -> &'a i32 { x }

fn longest<'a, 'b>(x: &'a str, y: &'b str) -> &'a str {
    x
}

struct Owner(i32);

impl Owner {
    fn add_one<'a>(&'a mut self) { self.0 += 1; }
    fn print<'a>(&'a self) {
        println!("`print`: {}", self.0);
    }
}

struct Person<'a> {
    age: u8,
    name: &'a str,
}

enum Either<'a> {
    Num(i32),
    Ref(&'a i32),
}

fn main() {}
```

#### 我的解答

```rust
/* 移除所有可以消除的生命周期标注 */

fn nput(x: &i32) {
    println!("`annotated_input`: {}", x);
}

fn pass(x: &i32) -> &i32 {
    x
}

fn longest<'a, 'b>(x: &'a str, y: &'b str) -> &'a str {
    x
}

struct Owner(i32);

impl Owner {
    fn add_one(&mut self) {
        self.0 += 1;
    }
    fn prin(&self) {
        println!("`print`: {}", self.0);
    }
}

struct Person<'a> {
    age: u8,
    name: &'a str,
}

enum Either<'a> {
    Num(i32),
    Ref(&'a i32),
}

fn main() {}
```

## &'static and T: 'static

### 问题一

'static 是一个 Rust 保留的生命周期名称，在之前我们可能已经见过好几次了:

```rust
#![allow(unused)]
fn main() {
   // 引用的生命周期是 'static :
   let s: &'static str = "hello world";

   // 'static 也可以用于特征约束中:
   fn generic<T>(x: T) where T: 'static {}
}
```

虽然它们都是 'static，但是也稍有不同。

作为一个引用生命周期，&'static 说明该引用指向的数据可以跟程序活得一样久，但是该引用的生命周期依然有可能被强转为一个更短的生命周期。

有好几种方法可以将一个变量标记为 'static 生命周期，其中两种都是和保存在二进制文件中相关（例如字符串字面量就是保存在二进制文件中，它的生命周期是 'static）。

```rust
/* 使用两种方法填空 */
fn main() {
    __;
    need_static(v);

    println!("Success!")
}

fn need_static(r : &'static str) {
    assert_eq!(r, "hello");
}
```

#### 我的解答

```rust
/* 使用两种方法填空 */
fn main() {
    let v: &'static str = "hello";
    need_static(v);

    println!("Success!")
}

fn need_static(r : &'static str) {
    assert_eq!(r, "hello");
}
```

```rust
/* 使用两种方法填空 */
fn main() {
    let v = "hello";
    need_static(v);

    println!("Success!")
}

fn need_static(r : &'static str) {
    assert_eq!(r, "hello");
}
```

### 问题二

使用 Box::leak 也可以产生 'static 生命周期

```rust
#[derive(Debug)]
struct Config {
    a: String,
    b: String,
}
static mut config: Option<&mut Config> = None;

/* 让代码工作，但不要修改函数的签名 */
fn init() -> Option<&'static mut Config> {
    Some(&mut Config {
        a: "A".to_string(),
        b: "B".to_string(),
    })
}

fn main() {
    unsafe {
        config = init();

        println!("{:?}",config)
    }
}
```

#### 我的解答

```rust
#[derive(Debug)]
struct Config {
    a: String,
    b: String,
}
static mut config: Option<&mut Config> = None;

/* 让代码工作，但不要修改函数的签名 */
fn init() -> Option<&'static mut Config> {
    Some(Box::leak(Box::new(Config {
        a: "A".to_string(),
        b: "B".to_string(),
    })))
}

fn main() {
    unsafe {
        config = init();

        println!("{:?}", config)
    }
}
```

### 问题三

&'static 只能说明引用指向的数据是能一直存活的，但是引用本身依然受限于它的作用域

```rust
fn main() {
    {
        // 字符串字面量能跟程序活得一样久，因此 `static_string` 的生命周期是 `'static`
        let static_string = "I'm in read-only memory";
        println!("static_string: {}", static_string);

        // 当 `static_string` 超出作用域时，该引用就无法再被使用，但是引用指向的数据( 字符串字面量 ) 依然保存在二进制 binary 所占用的内存中
    }

    println!("static_string reference remains alive: {}", static_string);
}
```

#### 我的解答

```rust
```

### 问题四

&'static 可以被强转成一个较短的生命周期

```rust
// 声明一个 static 常量，它拥有 `'static` 生命周期.
static NUM: i32 = 18;

// 返回常量 `Num` 的引用，注意，这里的生命周期从 `'static` 强转为 `'a`
fn coerce_static<'a>(_: &'a i32) -> &'a i32 {
    &NUM
}

fn main() {
    {
        let lifetime_num = 9;

        let coerced_static = coerce_static(&lifetime_num);

        println!("coerced_static: {}", coerced_static);
    }

    println!("NUM: {} stays accessible!", NUM);
}
```

#### 我的解答

```rust
```

### 问题五

关于 'static 的特征约束详细解释，请参见 [Rust 语言圣经](https://course.rs/advance/lifetime/static.html#t-static)，这里就不再赘述。

```rust
/* 让代码工作 */
use std::fmt::Debug;

fn print_it<T: Debug + 'static>( input: T) {
    println!( "'static value passed in is: {:?}", input );
}

fn print_it1( input: impl Debug + 'static ) {
    println!( "'static value passed in is: {:?}", input );
}


fn print_it2<T: Debug + 'static>( input: &T) {
    println!( "'static value passed in is: {:?}", input );
}

fn main() {
    // i 是有所有权的数据，并没有包含任何引用，因此它是 'static
    let i = 5;
    print_it(i);

    // 但是 &i 是一个引用，生命周期受限于作用域，因此它不是 'static
    print_it(&i);

    print_it1(&i);

    // 但是下面的代码可以正常运行 !
    print_it2(&i);
}
```

#### 我的解答

```rust
```

### 问题六

```rust
use std::fmt::Display;

fn main() {
  let mut string = "First".to_owned();

  string.push_str(string.to_uppercase().as_str());
  print_a(&string);
  print_b(&string);
  print_c(&string); // Compilation error
  print_d(&string); // Compilation error
  print_e(&string);
  print_f(&string);
  print_g(&string); // Compilation error
}

fn print_a<T: Display + 'static>(t: &T) {
  println!("{}", t);
}

fn print_b<T>(t: &T)
where
  T: Display + 'static,
{
  println!("{}", t);
}

fn print_c(t: &'static dyn Display) {
  println!("{}", t)
}

fn print_d(t: &'static impl Display) {
  println!("{}", t)
}

fn print_e(t: &(dyn Display + 'static)) {
  println!("{}", t)
}

fn print_f(t: &(impl Display + 'static)) {
  println!("{}", t)
}

fn print_g(t: &'static String) {
  println!("{}", t);
}
```

#### 我的解答

```rust
```

## 深入

### 问题一

就像泛型类型可以有约束一样，生命周期也可以有约束 ，如下所示：

- `T: 'a`，所有引用在 T 必须超过生命周期 'a
- `T: Trait + 'a`: T 必须实现特征 Trait 并且所有引用在 T 必须超过生命周期 'a

示例

```rust
use std::fmt::Debug; // 特征约束使用

#[derive(Debug)]
struct Ref<'a, T: 'a>(&'a T);
// `Ref` 包含对泛型类型 `T` 的引用，该泛型类型具有
// 未知的生命周期 `'a`. `T` 是约定任何
// 引用在 `T` 必须大于 `'a` 。此外，在生命周期
// 里 `Ref` 不能超过 `'a`。

// 使用 `Debug` 特征打印的通用函数。
fn print<T>(t: T) where
    T: Debug {
    println!("`print`: t is {:?}", t);
}

// 这里引用 `T` 使用 where `T` 实现
// `Debug` 和所有引用 `T` 都要比 `'a` 长
// 此外，`'a`必须要比函数声明周期长
fn print_ref<'a, T>(t: &'a T) where
    T: Debug + 'a {
    println!("`print_ref`: t is {:?}", t);
}

fn main() {
    let x = 7;
    let ref_x = Ref(&x);

    print_ref(&ref_x);
    print(ref_x);
}
```

```rust
/* 使用生命周期注释结构体
1. `r` 和 `s` 必须是不同生命周期
2. `s` 的生命周期需要大于 'r'
*/
struct DoubleRef<T> {
    r: &T,
    s: &T
}
fn main() {
    println!("Success!")
}
```

#### 我的解答

```rust
```

### 问题二

```rust
/* 添加类型约束使下面代码正常运行 */
struct ImportantExcerpt<'a> {
    part: &'a str,
}

impl<'a, 'b> ImportantExcerpt<'a> {
    fn announce_and_return_part(&'a self, announcement: &'b str) -> &'b str {
        println!("Attention please: {}", announcement);
        self.part
    }
}

fn main() {
    println!("Success!")
}
```

#### 我的解答

```rust
```

### 问题三

```rust
/* 添加类型约束使下面代码正常运行 */
fn f<'a, 'b>(x: &'a i32, mut y: &'b i32) {
    y = x;                      
    let r: &'b &'a i32 = &&0;   
}

fn main() {
    println!("Success!")
}
```

#### 我的解答

```rust
```

### 问题四

类型约束可能在生命周期中排名更高。这些约束指定了一个约束对于所有生命周期都为真。例如，诸如此类的约束 `for<'a> &'a T: PartialEq<i32>` 需要如下实现：

```rust
impl<'a> PartialEq<i32> for &'a T {
   // ...
}
```

然后可以用于将一个 &'a T 与任何生命周期进行比较 i32 。

这里只能使用更高级别的约束，因为引用的生命周期比函数上任何可能的生命周期参数都短。

```rust
/* 添加 HRTB 使下面代码正常运行！ */
fn call_on_ref_zero<'a, F>(f: F) where F: Fn(&'a i32) {
    let zero = 0;
    f(&zero);
}

fn main() {
    println!("Success!")
}
```

#### 我的解答

```rust
```

### 问题五

在解释 NLL 之前，我们先看一段代码：

```rust
fn main() {
   let mut s = String::from("hello");

    let r1 = &s;
    let r2 = &s;
    println!("{} and {}", r1, r2);

    let r3 = &mut s;
    println!("{}", r3);
}
```

根据我们目前的知识，这段代码会因为违反 Rust 中的借用规则而导致错误。

但是，如果您执行 cargo run ，那么一切都没问题，那么这里发生了什么？

编译器在作用域结束之前判断不再使用引用的能力称为 非词法生命周期（简称 NLL）。

有了这种能力，编译器就知道最后一次使用引用是什么时候，并根据这些知识优化借用规则。

```rust
let mut u = 0i32;
let mut v = 1i32;
let mut w = 2i32;

// lifetime of `a` = α ∪ β ∪ γ
let mut a = &mut u;     // --+ α. lifetime of `&mut u`  --+ lexical "lifetime" of `&mut u`,`&mut u`, `&mut w` and `a`
use(a);                 //   |                            |
*a = 3; // <-----------------+                            |
...                     //                                |
a = &mut v;             // --+ β. lifetime of `&mut v`    |
use(a);                 //   |                            |
*a = 4; // <-----------------+                            |
...                     //                                |
a = &mut w;             // --+ γ. lifetime of `&mut w`    |
use(a);                 //   |                            |
*a = 5; // <-----------------+ <--------------------------+
```

学习了 NLL 之后，我们现在可以很容易地理解再借用了。

示例

```rust
#[derive(Debug)]
struct Point {
    x: i32,
    y: i32,
}

impl Point {
    fn move_to(&mut self, x: i32, y: i32) {
        self.x = x;
        self.y = y;
    }
}

fn main() {
    let mut p = Point { x: 0, y: 0 };
    let r = &mut p;
    // 这里是再借用
    let rr: &Point = &*r;

    println!("{:?}", rr); // 这里结束再借用

    // 再借用结束，现在我们可以继续使用 `r`
    r.move_to(10, 10);
    println!("{:?}", r);
}
```

```rust
/* 通过重新排序一些代码使下面代码正常运行 */
fn main() {
    let mut data = 10;
    let ref1 = &mut data;
    let ref2 = &mut *ref1;

    *ref1 += 1;
    *ref2 += 2;

    println!("{}", data);
}
```

#### 我的解答

```rust
```

### 问题六

未约束的生命周期：在 [Nomicon - Unbounded Lifetimes](https://doc.rust-lang.org/nomicon/unbounded-lifetimes.html) 中查看更多信息。

更多省略规则

```rust
impl<'a> Reader for BufReader<'a> {
    // 'a 在以下方法中不使用
}

// 可以写为：
impl Reader for BufReader<'_> {
    
}
``

```rust
// Rust 2015
struct Ref<'a, T: 'a> {
    field: &'a T
}

// Rust 2018
struct Ref<'a, T> {
    field: &'a T
}
```

```rust
/* 使下面代码正常运行 */
struct Interface<'a> {
    manager: &'a mut Manager<'a>
}

impl<'a> Interface<'a> {
    pub fn noop(self) {
        println!("interface consumed");
    }
}

struct Manager<'a> {
    text: &'a str
}

struct List<'a> {
    manager: Manager<'a>,
}

impl<'a> List<'a> {
    pub fn get_interface(&'a mut self) -> Interface {
        Interface {
            manager: &mut self.manager
        }
    }
}

fn main() {
    let mut list = List {
        manager: Manager {
            text: "hello"
        }
    };

    list.get_interface().noop();

    println!("Interface should be dropped here and the borrow released");

    use_list(&list);
}

fn use_list(list: &List) {
    println!("{}", list.manager.text);
}
```

#### 我的解答

```rust
```

// TODO https://zh.practice.rs/generics-traits/intro.html
