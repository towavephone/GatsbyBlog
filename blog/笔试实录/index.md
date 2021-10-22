---
title: 笔试实录
categories:
  - 面试
path: /written-examination-record/
tags: 面试, 笔试
date: 2021-4-14 23:22:33
draft: true
---

# 联通产业交互

## this

写出执行结果

```js
(function() {
  var obj = {
    fun1: () => {
      console.log(this);
    },
    fun2: function() {
      console.log(this);
    },
    fun3() {
      console.log(this);
    }
  };

  obj.fun1();
  obj.fun2();
  obj.fun3();
})();
```

```js
window; // 箭头函数的 this 根据外层作用域绑定
obj; // 隐式绑定，this 指向对象
obj; // 同上，不同写法而已
```

## 作用域

```js
(function() {
  var a = '';
  console.log(a);
  console.log(b);
  {
    var b = (a = '123');
    let c = b;
  }
  console.log(c);
})();
```

```js
'';
undefined;
ReferenceError;
```

## 异步

```js
async function async1() {
  console.log('1');
  await async2();
  console.log('2');
}
async function async2() {
  console.log('3');
}
console.log('4');
setTimeout(function() {
  console.log('5');
}, 0);
async1();
new Promise(function(resolve) {
  console.log('6');
  resolve();
}).then(function() {
  console.log('7');
});
console.log('8');
```

```js
4;
1;
3;
6;
8;
2;
7;
5;
```

## 闭包

```js
var count = 10;
function add() {
  var count = 0;
  return function() {
    count += 1;
    console.log(count);
  };
}
var s = add();
s();
s();
```

```js
1;
2;
```

# 文远知行

## 一面

### 51Nod 加农炮

一个长度为 M 的正整数数组 A，表示从左向右的地形高度。测试一种加农炮，炮弹平行于地面从左向右飞行，高度为 H，如果某处地形的高度大于等于炮弹飞行的高度 H（`A[i] >= H`），炮弹会被挡住并落在 i - 1 处，则 `A[i - 1] + 1`。如果 H <= `A[0]`，则这个炮弹无效，如果 H > 所有的 `A[i]`，这个炮弹也无效。现在给定 N 个整数的数组 B 代表炮弹高度，计算出最后地形的样子。例如：地形高度 A = {1, 2, 0, 4, 3, 2, 1, 5, 7}, 炮弹高度 B = {2, 8, 0, 7, 6, 5, 3, 4, 5, 6, 5}，最终得到的地形高度为：{2, 2, 2, 4, 3, 3, 5, 6, 7}。

Input

第 1 行：2 个数 M, N 中间用空格分隔，分别为数组 A 和 B 的长度(1 <= m, n <= 50000) 第 2 至 M + 1 行：每行 1 个数，表示对应的地形高度(0 <= `A[i]` <= 1000000)。第 M + 2 至 N + M + 1 行，每行 1 个数，表示炮弹的高度(0 <= `B[i]` <= 1000000)。

Output

输出共 M 行，每行一个数，对应最终的地形高度。

Input 示例

```
9 11
1
2
0
4
3
2
1
5
7
2
8
0
7
6
5
3
4
5
6
5
```

Output 示例

```
2
2
2
4
3
3
5
6
7
```

```cpp
scanf("%d%d",&n, &m);
for (int i=1; i<=n; i++) {
  scanf("%d",&a[i]);
}
for (int i=1; i<=m; i++) {
  scanf("%d",&b[i])
}

for (int i=1; i<=n; i++)
{
  for (int j=1; j<=m; j++)
  {
    if (b[j] >= a[i]) {
      a[i-1] += 1;
    }
  }
}

for (int i=1; i<=n; i++)
  printf("%d ", a[i]);
```

### a ^ b mod n

Input: Positive integer a, b, n (0<a,b,n<10^9)

Output: a^b mod n

example: Input: 2 3 3

Output 2

```js
// a^b mod n = (a mod n)^b mod n
// b 为偶数 a^b mod n = (a*a)^(b/2) mod n
// b 为奇数 ((a*a)^(b/2)*a) mod n
function mod(a, b, n) {
  var result = 1;
  a = a % n;
  while (b) {
    if (b % 2 === 1) {
      result = (result * a) % n;
    }
    a = (a * a) % n;
    b = b / 2;
  }
  return result;
}
```

### 第 i 个最小的数

Input:

1.  Positive integer n, means the length of the list. (0<n<10^7)
2.  n Positive integers of the list.
3.  Positive integer i.

Output:

the i-th smallest number of the list.

```js
var array = [4, 3, 2, 5];
findSmallest(array, 0, array.length - 1, 1);

function findSmallest(array, low, high, i) {
  var localLow = low;
  var localHigh = high;

  if (low >= high) {
    return array[low];
  }

  var tmp = array[low];
  while (low < high) {
    while (high > low && array[high] >= tmp) {
      high--;
    }
    array[low] = array[high];
    while (low < high && array[low] <= tmp) {
      low++;
    }
    array[high] = array[low];
  }

  array[low] = tmp;
  // 要找的第几小的比
  if (i <= low) {
    return findSmallest(array, localLow, low, i);
  } else {
    return findSmallest(array, low + 1, localHigh, i);
  }
}
```

## 二面

### 全排列

```js
const a = [1, 2]
const b = [1, 2, 3]
const c = [1, 2, 3, 4]

descartes(a, b)

// 输出
[
[1, 1],
[1, 2],
[1, 3],
[2, 1],
[2, 2],
[2, 3],
]

descartes(a, b, c)

// 输出
[
[1, 1, 1],
[1, 1, 2],
[1, 1, 2],
[1, 1, 3],
[1, 2, 1],
[1, 2, 2],
[1, 2, 2],
[1, 2, 3],
]

// 可能的调用方式
descartes(a, b)
descartes(a, b, c)
descartes(a, b, c, d)
descartes(a, b, c, d, e)
```

```cpp
void backTrack(int n, int k) {
  if (符合条件) {
    输出；
    return;
  }
  else {
    执行代码;
    backTrack(n, k + 1);
    代码回溯;
  }
}
```

利用这个模式可以写出例如组合，全排列，子集，八皇后等问题。

```java
public class Solution {
  public List<List<String>> descartes(List<List<String>> dimValue) {
    List<List<String>> res = new ArrayList<>();
    if (dimValue == null || dimValue.size() == 0) {
      return res;
    }
    backtrace(dimValue, 0, res, new ArrayList<>());
    return res;
  }

  /**
    * 递归回溯法求解
    *
    * @param dimValue 原始数据集合
    * @param index 当前执行的集合索引
    * @param result 结果集合
    * @param curList 当前的单个结果集
    */
  private void backtrace(List<List<String>> dimValue, int index, List<List<String>> result, List<String> curList) {
    if (curList.size() == dimValue.size()) {
      result.add(new ArrayList<>(curList));
    } else {
      for (int j = 0; j < dimValue.get(index).size(); j++) {
        curList.add(dimValue.get(index).get(j));
        backtrace(dimValue, index + 1, result, curList);
        curList.remove(curList.size() - 1);
      }
    }
  }

  public static void main(String[] args) {
    List<String> list1 = new ArrayList<String>();
    list1.add("a");
    list1.add("b");
    List<String> list2 = new ArrayList<String>();
    list2.add("0");
    list2.add("1");
    list2.add("2");
    List<List<String>> dimValue = new ArrayList<List<String>>();
    dimValue.add(list1);
    dimValue.add(list2);

    // 递归实现笛卡尔积
    Solution s = new Solution();
    List<List<String>> res = s.descartes(dimValue);
    System.out.println("递归实现笛卡尔乘积: 共 " + res.size() + " 个结果");
    for (List<String> list : res) {
      for (String string : list) {
        System.out.print(string + " ");
      }
      System.out.println();
    }
  }
}
```

```js
function f(arr, re, tp, k) {
  if (tp.length === arr.length) {
    re.push([...tp]);
  } else {
    for (let i = k; i < arr.length; i++) {
      for (let j = 0; j < arr[i].length; j++) {
        tp.push(arr[i][j]);
        f(arr, re, tp, k + 1);
        tp.pop();
      }
      tp.pop();
    }
  }
}

let arr = [[1, 2], [3, 4, 5], [6]],
  re = [],
  tp = [];

f(arr, re, tp, 0);
console.log(re);
//[ [1,3,6], [1,4,6], [1,5,6], [2,3,6], [2,4,6], [2,5,6]]
```

```
递归实现笛卡尔乘积: 共 6 个结果
a 0
a 1
a 2
b 0
b 1
b 2
```

## 三面

### 比特币买卖

现在有一个比特币的涨跌序列，只能买卖一次，求最大的收益是多少？

Input:

1.  Positive integer n, means the days you can predict.
2.  n integers, means the bitcoin's changed in i-th day

-  you can buy one bitcoin
-  you can buy and sell one time

Output:

-  the max profit you can earn.

exmaple:

Input:

```
5
10 -20 30 -20 50
```

output:

```
60
```

#### 暴力法

```js
const prices = [10, -20, 30, -20, 50];
function maxProfit(prices) {
  let maxProfit = 0;
  for (let i = 0; i < prices.length; i++) {
    for (let j = i + 1; j < prices.length; j++) {
      let profit = 0;
      for (let m = i; m <= j; m++) {
        profit += prices[m];
      }
      if (profit > maxProfit) {
        maxProfit = profit;
      }
    }
  }
  return maxProfit;
}
console.log(maxProfit(prices));
```

#### 动态规划

```js
dp[i] = max(prices[i], dp[i - 1] + prices[i]);
```

```js
const prices = [10, -20, 30, -20, 50];
function maxProfit(prices) {
  let maxProfit = 0;
  const dp = [prices[0]];
  for (let i = 1; i < prices.length; i++) {
    dp[i] = prices[i] > dp[i - 1] + prices[i] ? prices[i] : dp[i - 1] + prices[i];
    maxProfit = dp[i] > maxProfit ? dp[i] : maxProfit;
  }
  return maxProfit;
}
console.log(maxProfit(prices));

// 或
var maxSubArray = function(nums) {
  let pre = 0,
    maxAns = nums[0];
  nums.forEach((x) => {
    pre = Math.max(pre + x, x);
    maxAns = Math.max(maxAns, pre);
  });
  return maxAns;
};
```
