---
title: 面试高频算法题
categories:
  - 面试
path: /interview-algorithm/
tags: 面试, 算法
date: 2021-8-17 17:29:30
draft: true
---

# 509 斐波那契数

斐波那契数，通常用 F(n) 表示，形成的序列称为斐波那契数列。该数列由  0 和 1 开始，后面的每一项数字都是前面两项数字的和。也就是：

```
F(0) = 0，F(1) = 1
F(n) = F(n - 1) + F(n - 2)，其中 n > 1
给你 n ，请计算 F(n) 。
```

示例 1：

```
输入：2
输出：1
解释：F(2) = F(1) + F(0) = 1 + 0 = 1
```

示例 2：

```
输入：3
输出：2
解释：F(3) = F(2) + F(1) = 1 + 1 = 2
```

示例 3：

```
输入：4
输出：3
解释：F(4) = F(3) + F(2) = 2 + 1 = 3
```

提示：

`0 <= n <= 30`

## 递归

```cpp
class Solution {
public:
  int fib(int N) {
    if (N < 2) return N;
    return fib(N - 1) + fib(N - 2);
  }
};
```

- 时间复杂度：O(n^2)
- 空间复杂度：O(n)

## 动态规划

```cpp
class Solution {
public:
  int fib(int N) {
    if (N <= 1) return N;
    int dp[2];
    dp[0] = 0;
    dp[1] = 1;
    for (int i = 2; i <= N; i++) {
      int sum = dp[0] + dp[1];
      dp[0] = dp[1];
      dp[1] = sum;
    }
    return dp[1];
  }
};
```

- 时间复杂度：O(n)
- 空间复杂度：O(1)

# 剑指 Offer 25. 合并两个排序的链表

输入两个递增排序的链表，合并这两个链表并使新链表中的节点仍然是递增排序的。

示例 1：

```
输入：1->2->4, 1->3->4
输出：1->1->2->3->4->4
```

限制：

`0 <= 链表长度 <= 1000`

常规题目，类似于归并排序中的合并过程。

## 递归

```js
/*
 */
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var mergeTwoLists = function(l1, l2) {
  if (l1 === null) return l2;
  if (l2 === null) return l1;
  if (l1.val < l2.val) {
    l1.next = mergeTwoLists(l1.next, l2);
    return l1;
  } else {
    l2.next = mergeTwoLists(l1, l2.next);
    return l2;
  }
};
```

- 时间复杂度：O(N)，其中 N 为两个链表节点总数
- 空间复杂度：O(1)

## 迭代

```js
/*
 * @lc app=leetcode id=21 lang=javascript
 *
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var mergeTwoLists = function(l1, l2) {
  let current = new ListNode();
  const dummy = current;

  while (l1 || l2) {
    if (!l1) {
      current.next = l2;
      return dummy.next;
    } else if (!l2) {
      current.next = l1;
      return dummy.next;
    }

    if (l1.val <= l2.val) {
      current.next = l1;
      l1 = l1.next;
    } else {
      current.next = l2;
      l2 = l2.next;
    }

    current = current.next;
  }

  return dummy.next;
};
```

- 时间复杂度：O(N)，其中 N 为两个链表节点总数
- 空间复杂度：加上栈空间的话，空间复杂度为 O(N)，其中 N 为两个链表节点总数

# 剑指 Offer 24. 反转链表

定义一个函数，输入一个链表的头节点，反转该链表并输出反转后链表的头节点。

示例:

```
输入: 1->2->3->4->5->NULL
输出: 5->4->3->2->1->NULL
```

限制：

`0 <= 节点个数 <= 5000`

## 迭代

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function(head) {
  let prev = null;
  let curr = head;
  while (curr) {
    const next = curr.next; // 修改前先记住下一个节点
    curr.next = prev; // 改指向，第一个节点 prev 是 null
    prev = curr; // 记录前一个节点，供下次循环使用
    curr = next; // curr 通过 next 指向下一节点
  }
  return prev; // curr 会循环直到 null
};
```

- 时间复杂度：O(n)，其中 n 是链表的长度。需要遍历链表一次。
- 空间复杂度：O(1)。

## 递归

```js
var reverseList = function(head) {
  if (head == null || head.next == null) {
    return head;
  }
  const newHead = reverseList(head.next);
  // 节点 n(k + 1) 到 n(m) 已经反转
  head.next.next = head; // 希望 n(k + 1) 的下一个节点指向 n(k)，所以 n(k).next.next = n(k)
  head.next = null; // 避免产生环
  return newHead;
};
```

- 时间复杂度：O(n)，其中 n 是链表的长度。需要对链表的每个节点进行反转操作。
- 空间复杂度：O(n)，其中 n 是链表的长度。空间复杂度主要取决于递归调用的栈空间，最多为 n 层。

# 141. 环形链表

给定一个链表，判断链表中是否有环。

如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。为了表示给定链表中的环，我们使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。如果 pos 是 -1，则在该链表中没有环。注意：pos 不作为参数进行传递，仅仅是为了标识链表的实际情况。

如果链表中存在环，则返回 true 。 否则，返回 false 。

进阶：

你能用 O(1)（即，常量）内存解决此问题吗？

示例 1：

![](res/2021-08-17-18-32-52.png)

```
输入：head = [3,2,0,-4], pos = 1
输出：true
解释：链表中有一个环，其尾部连接到第二个节点。
```

示例 2：

![](res/2021-08-17-18-33-54.png)

```
输入：head = [1,2], pos = 0
输出：true
解释：链表中有一个环，其尾部连接到第一个节点。
```

示例 3：

![](res/2021-08-17-18-34-23.png)

```
输入：head = [1], pos = -1
输出：false
解释：链表中没有环。
```

提示：

- 链表中节点的数目范围是 [0, 104]
- -105 <= Node.val <= 105
- pos 为 -1 或者链表中的一个有效索引。

## 哈希表

```cpp
class Solution {
public:
  bool hasCycle(ListNode *head) {
    unordered_set<ListNode*> seen;
    while (head != nullptr) {
      if (seen.count(head)) {
        return true;
      }
      seen.insert(head);
      head = head->next;
    }
    return false;
  }
};
```

- 时间复杂度：O(N)O(N)，其中 NN 是链表中的节点数。最坏情况下我们需要遍历每个节点一次。
- 空间复杂度：O(N)O(N)，其中 NN 是链表中的节点数。主要为哈希表的开销，最坏情况下我们需要将每个节点插入到哈希表中一次。

## 快慢指针

```cpp
class Solution {
public:
  bool hasCycle(ListNode* head) {
    if (head == nullptr || head->next == nullptr) {
      return false;
    }
    ListNode* slow = head;
    ListNode* fast = head->next;
    while (slow != fast) {
      if (fast == nullptr || fast->next == nullptr) {
        return false;
      }
      slow = slow->next;
      fast = fast->next->next;
    }
    return true;
  }
};
```

- 时间复杂度：O(N)，其中 N 是链表中的节点数。
  - 当链表中不存在环时，快指针将先于慢指针到达链表尾部，链表中每个节点至多被访问两次。
  - 当链表中存在环时，每一轮移动后，快慢指针的距离将减小一。而初始距离为环的长度，因此至多移动 N 轮。
- 空间复杂度：O(1)。我们只使用了两个指针的额外空间。
