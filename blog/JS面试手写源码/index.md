---
title: JS面试手写源码
date: 2021-8-2 13:38:39
categories:
  - 前端
tags: 前端, JS, 面试
path: /js-interview-source-code/
draft: true
---

# js 基础

```js
Function.prototype.call2 = function (context) {
  var context = Object(context) || window;
  context.fn = this;

  var params = [];
  for (var i = 1; i < arguments.length; i++) {
    params.push("arguments[" + i + "]");
  }
  var result = eval("context.fn(" + params + ")");
  delete context.fn;
  return result;
};

// var obj = {
//   value: 1
// }

// function bar(name, age) {
//   return {
//     value: this.value,
//     name: name,
//     age: age
//   }
// }

// console.log(bar.call2(obj, 'kevin', 18));
// // Object {
// //    value: 1,
// //    name: 'kevin',
// //    age: 18
// // }

Function.prototype.apply2 = function (context, arr) {
  var context = Object(context) || window;
  context.fn = this;

  var result;
  if (!arr) {
    result = context.fn();
  } else {
    var params = [];
    for (var i = 0; i < arr.length; i++) {
      params.push("arr[" + i + "]");
    }
    result = eval("context.fn(" + params + ")");
  }
  delete context.fn;
  return result;
};

Function.prototype.bind2 = function (context) {
  var self = this;
  var args = Array.prototype.slice.call2(arguments, 1);
  var fn = function () {
    var bindArgs = args.concat(Array.prototype.slice.call2(arguments));
    // this instanceof fn ? this : context 为了 this.habit
    return self.apply2(this instanceof fn ? this : context, bindArgs);
  };
  // fn.prototype = Object.create(this.prototype);
  var fNOP = function () {};
  fNOP.prototype = this.prototype;
  fn.prototype = new fNOP();
  return fn;
};

// var value = 2;

// var foo = {
//   value: 1
// };

// function bar(name, age) {
//     this.habit = 'shopping';
//     console.log(this.value);
//     console.log(name);
//     console.log(age);
// }

// bar.prototype.friend = 'kevin';

// var bindFoo = bar.bind2(foo, 'daisy');

// bindFoo('18');
// // 1
// // daisy
// // 18

// var obj = new bindFoo('18');
// // undefined
// // daisy
// // 18
// console.log(obj.habit);
// console.log(obj.friend);
// // shopping
// // kevin

function objectFactory() {
  var obj = {};
  // 返回第一个元素的值
  var Constructor = Array.prototype.shift.call2(arguments);
  // 形成构造函数的 prototype 链
  obj.__proto__ = Constructor.prototype;
  // 使 obj 里面有值，通过 apply 强制改变 this 指向
  var result = Constructor.apply2(obj, arguments);
  // 查看返回值是否是对象
  return typeof result === "object" ? result : obj;
}

// // Otaku 御宅族，简称宅
// function Otaku(name, age) {
//   this.name = name;
//   this.age = age;

//   this.habit = 'Games';
// }

// // 因为缺乏锻炼的缘故，身体强度让人担忧
// Otaku.prototype.strength = 60;

// Otaku.prototype.sayYourName = function () {
//   console.log('I am ' + this.name);
// }

// var person = new objectFactory(Otaku, 'Kevin', '18');

// console.log(person.name) // Kevin
// console.log(person.habit) // Games
// console.log(person.strength) // 60

// person.sayYourName(); // I am Kevin

// // Otaku 御宅族，简称宅
// function Otaku(name, age) {
//   this.strength = 60;
//   this.age = age;

//   return {
//       name: name,
//       habit: 'Games'
//   }
// }

// // 使用 objectFactory
// var person = objectFactory(Otaku, 'Kevin', '18')

// console.log(person.name) // Kevin
// console.log(person.habit) // Games
// console.log(person.strength) // undefined
// console.log(person.age) // undefined

// 工厂模式
function createPerson(name) {
  var o = new Object();
  o.name = name;
  o.getName = function () {
    console.log(this.name);
  };

  return o;
}

var person1 = createPerson("kevin");

// 构造函数模式
function Person(name) {
  this.name = name;
  this.getName = getName;
}

function getName() {
  console.log(this.name);
}

var person1 = new Person("kevin");

// 原型模式
function Person(name) {}

Person.prototype = {
  constructor: Person,
  name: "kevin",
  getName: function () {
    console.log(this.name);
  },
};

var person1 = new Person();

// 组合模式（推荐）
function Person(name) {
  this.name = name;
}

Person.prototype = {
  constructor: Person,
  getName: function () {
    console.log(this.name);
  },
};

var person1 = new Person();

// 动态原型模式
function Person(name) {
  this.name = name;
  if (typeof this.getName != "function") {
    Person.prototype.getName = function () {
      console.log(this.name);
    };
  }
}

var person1 = new Person();

// 寄生构造函数模式
function Person(name) {
  var o = new Object();
  o.name = name;
  o.getName = function () {
    console.log(this.name);
  };
  return o;
}

var person1 = new Person("kevin");
console.log(person1 instanceof Person); // false
console.log(person1 instanceof Object); // true

// 稳妥构造函数模式
// 所谓稳妥对象，指的是没有公共属性，而且其方法也不引用 this 的对象。
function person(name) {
  var o = new Object();
  o.sayName = function () {
    console.log(name);
  };
  return o;
}

var person1 = person("kevin");

person1.sayName(); // kevin

person1.name = "daisy";

person1.sayName(); // kevin

console.log(person1.name); // daisy

// 原型链继承
function Parent() {
  this.name = "kevin";
}

Parent.prototype.getName = function () {
  console.log(this.name);
};

function Child() {}

Child.prototype = new Parent();

var child1 = new Child();

console.log(child1.getName()); // kevin

// 借用构造函数（经典继承）
function Parent() {
  this.names = ["kevin", "daisy"];
}

function Child() {
  Parent.call(this);
}

var child1 = new Child();

child1.names.push("yayu");

console.log(child1.names); // ["kevin", "daisy", "yayu"]

var child2 = new Child();

console.log(child2.names); // ["kevin", "daisy"]

// 组合继承
function Parent(name) {
  this.name = name;
  this.colors = ["red", "blue", "green"];
}

Parent.prototype.getName = function () {
  console.log(this.name);
};

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}

Child.prototype = new Parent();
Child.prototype.constructor = Child;

var child1 = new Child("kevin", "18");
child1.colors.push("black");

console.log(child1.name); // kevin
console.log(child1.age); // 18
console.log(child1.colors); // ["red", "blue", "green", "black"]

var child2 = new Child("daisy", "20");
console.log(child2.name); // daisy
console.log(child2.age); // 20
console.log(child2.colors); // ["red", "blue", "green"]

// 原型式继承，始终共享引用类型的值，和原型链继承相同
function createObj(o) {
  function F() {}
  F.prototype = o;
  return new F();
}

var person = {
  name: "kevin",
  friends: ["daisy", "kelly"],
};

var person1 = createObj(person);
var person2 = createObj(person);

person1.name = "person1";
console.log(person2.name); // kevin

person1.__proto__.name = "person1";
console.log(person2.name); // person1

person1.friends.push("taylor");
console.log(person2.friends); // ["daisy", "kelly", "taylor"]

// 寄生式继承
function createObj(o) {
  var clone = Object.create(o);
  clone.sayName = function () {
    console.log("hi");
  };
  return clone;
}

// 寄生组合式继承（推荐）
function Parent(name) {
  this.name = name;
  this.colors = ["red", "blue", "green"];
}

Parent.prototype.getName = function () {
  console.log(this.name);
};

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}

// 关键的三步
var F = function () {};

F.prototype = Parent.prototype;

Child.prototype = new F();

var child1 = new Child("kevin", "18");

console.log(child1);

// 封装一下
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}

function prototype(child, parent) {
  var prototype = object(parent.prototype);
  prototype.constructor = child;
  child.prototype = prototype;
}

// 当我们使用的时候：
prototype(Child, Parent);

```

# js 进阶

```js
// immediate 前置执行
function debounce(func, wait, immediate) {
  var timeout, result;

  var debounced = function () {
    var context = this;
    var args = arguments;
    if (timeout) {
      clearTimeout(timeout);
    }

    if (immediate) {
      var callNow = !timeout;
      timeout = setTimeout(function () {
        timeout = null;
      }, wait);
      if (callNow) {
        result = func.apply(context, args);
      }
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    }
    return result;
  };

  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
}

function throttle(func, wait) {
  var prev = 0;
  return function () {
    var now = Date.now();
    var context = this;
    var args = arguments;
    if (now - prev > wait) {
      func.apply(context, args);
      prev = now;
    }
  };
}

function throttle(func, wait) {
  var timeout;
  return function () {
    var context = this;
    var args = arguments;

    if (!timeout) {
      timeout = setTimeout(function () {
        func.apply(context, args);
        timeout = null;
      }, wait);
    }
  };
}

// 有头有尾都触发
function throttle(func, wait) {
  var timeout, context, args;
  var prev = 0;

  var throttled = function () {
    context = this;
    args = arguments;
    var now = Date.now();
    var remain = wait - (now - prev);
    if (remain <= 0 || remain > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      func.apply(context, args);
      prev = now;
    } else if (!timeout) {
      timeout = setTimeout(function () {
        prev = Date.now();
        timeout = null;
        func.apply(context, args);
      }, remain);
    }
  };

  return throttled;
}

// 排序后去重
var array = [1, 1, "1"];

function unique(array) {
  var res = [];
  var sortedArray = array.concat().sort();
  var seen;
  for (var i = 0, len = sortedArray.length; i < len; i++) {
    // 如果是第一个元素或者相邻的元素不相同
    if (!i || seen !== sortedArray[i]) {
      res.push(sortedArray[i]);
    }
    seen = sortedArray[i];
  }
  return res;
}

var array = [1, 2, 1, 1, "1"];

function unique(array) {
  var res = array.filter(function (item, index, array) {
    return array.indexOf(item) === index;
  });
  return res;
}

console.log(unique(array));

var array = [1, 2, 1, 1, "1"];

function unique(array) {
  return array
    .concat()
    .sort()
    .filter(function (item, index, array) {
      return !index || item !== array[index - 1];
    });
}

console.log(unique(array));

var unique = (a) => [...new Set(a)];

// 可以用来判断是函数还是数组
function type(obj) {
  // type 函数
  var class2type = {};

  // 生成 class2type 映射
  "Boolean Number String Function Array Date RegExp Object Error"
    .split(" ")
    .map(function (item, index) {
      class2type["[object " + item + "]"] = item.toLowerCase();
    });
  // 一箭双雕，针对 ie6
  // 在 IE6 中，null 和 undefined 会被 Object.prototype.toString 识别成 [object Object]
  if (obj == null) {
    return obj + "";
  }
  return typeof obj === "object" || typeof obj === "function"
    ? class2type[Object.prototype.toString.call(obj)] || "object"
    : typeof obj;
}

// 通过 ”{}” 或 “new Object” 创建的，区别于 null，数组，宿主对象（documents）
function isPlainObject(obj) {
  // 上节中写 type 函数时，用来存放 toString 映射结果的对象
  var class2type = {};

  // 相当于 Object.prototype.toString
  var toString = class2type.toString;

  // 相当于 Object.prototype.hasOwnProperty
  var hasOwn = class2type.hasOwnProperty;

  var proto, Ctor;

  // 排除掉明显不是 obj 的以及一些宿主对象如 Window
  if (!obj || toString.call(obj) !== "[object Object]") {
    return false;
  }

  /**
   * getPrototypeOf es5 方法，获取 obj 的原型
   * 以 new Object 创建的对象为例的话
   * obj.__proto__ === Object.prototype
   */
  proto = Object.getPrototypeOf(obj);

  // 没有原型的对象是纯粹的，Object.create(null) 就在这里返回 true
  if (!proto) {
    return true;
  }

  /**
   * 以下判断通过 new Object 方式创建的对象
   * 判断 proto 是否有 constructor 属性，如果有就让 Ctor 的值为 proto.constructor
   * 如果是 Object 函数创建的对象，Ctor 在这里就等于 Object 构造函数
   */
  Ctor = hasOwn.call(proto, "constructor") && proto.constructor;

  // 在这里判断 Ctor 构造函数是不是 Object 构造函数
  // 用于区分自定义构造函数和 Object 构造函数，比较函数源代码字符串
  return (
    typeof Ctor === "function" &&
    hasOwn.toString.call(Ctor) === hasOwn.toString.call(Object)
  );
}

function isEmptyObject(obj) {
  var name;

  for (name in obj) {
    return false;
  }

  return true;
}

function isWindow(obj) {
  return obj != null && obj === obj.window;
}

function isArrayLike(obj) {
  // obj 必须有 length 属性
  var length = !!obj && "length" in obj && obj.length;
  var typeRes = type(obj);

  // 排除掉函数和 Window 对象
  if (typeRes === "function" || isWindow(obj)) {
    return false;
  }

  return (
    typeRes === "array" ||
    length === 0 ||
    (typeof length === "number" && length > 0 && length - 1 in obj)
  );
}

// 判断是不是 DOM 元素
function isElement(obj) {
  return !!(obj && obj.nodeType === 1);
}

// 数组浅拷贝使用 concat, slice，深拷贝使用 JSON.parse(JSON.stringify([]))
// 浅拷贝
function shallowCopy(obj) {
  if (typeof obj !== "object") {
    return;
  }
  var newObj = obj instanceof Array ? [] : {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}

// 深拷贝
function deepCopy(obj) {
  if (typeof obj !== "object") {
    return;
  }
  var newObj = obj instanceof Array ? [] : {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] =
        typeof obj[key] === "object" ? deepCopy(obj[key]) : obj[key];
    }
  }
  return newObj;
}

var arr = [6, 4, 1, 8, 2, 11, 23];
var max = eval("Math.max(" + arr + ")");
console.log(max);

var arr = [6, 4, 1, 8, 2, 11, 23];
console.log(Math.max.apply(null, arr));

var arr = [6, 4, 1, 8, 2, 11, 23];
console.log(Math.max(...arr));

// 数组扁平化
var arr = [1, [2, [3, 4]]];
function flatten(arr) {
  var result = [];
  for (var i = 0, len = arr.length; i < len; i++) {
    if (Array.isArray(arr[i])) {
      result = result.concat(flatten(arr[i]));
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}
console.log(flatten(arr));

var arr = [1, [2, [3, 4]]];
function flatten(arr) {
  return arr.reduce(function (prev, next) {
    return prev.concat(Array.isArray(next) ? flatten(next) : next);
  }, []);
}
console.log(flatten(arr));

var arr = [1, [2, [3, 4]]];
function flatten(arr) {
  while (arr.some((item) => Array.isArray(item))) {
    // 只能扁平一层，需要多次扁平
    arr = [].concat(...arr);
  }
  return arr;
}
console.log(flatten(arr));

/**
 * 数组扁平化
 * @param  {Array} input   要处理的数组
 * @param  {boolean} shallow 是否只扁平一层
 * @param  {boolean} strict  是否严格处理元素，下面有解释，为 true 的话就是过滤掉数组元素
 * @param  {Array} output  这是为了方便递归而传递的参数
 * 源码地址：https://github.com/jashkenas/underscore/blob/master/underscore.js#L528
 */
function flatten(input, shallow, strict, output) {
  // 递归使用的时候会用到output
  output = output || [];
  var idx = output.length;

  for (var i = 0, len = input.length; i < len; i++) {
    var value = input[i];
    // 如果是数组，就进行处理
    if (Array.isArray(value)) {
      // 如果是只扁平一层，遍历该数组，依此填入 output
      if (shallow) {
        var j = 0,
          length = value.length;
        while (j < length) output[idx++] = value[j++];
      }
      // 如果是全部扁平就递归，传入已经处理的 output，递归中接着处理 output
      else {
        flatten(value, shallow, strict, output);
        idx = output.length;
      }
    }
    // 不是数组，根据 strict 的值判断是跳过不处理还是放入 output
    else if (!strict) {
      output[idx++] = value;
    }
  }

  return output;
}

// 偏函数
var partial = function (fn) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function () {
    var newArgs = args.concat(Array.prototype.slice.call(arguments));
    return fn.apply(this, newArgs);
  }
}

function add(a, b) {
  return a + b;
}

var addCurry = partial(add, 1, 2);
addCurry() // 3
//或者
var addCurry = partial(add, 1);
addCurry(2) // 3
//或者
var addCurry = partial(add);
addCurry(1, 2) // 3

// 柯里化
function curry(fn, args) {
  var length = fn.length;
  args = args || [];
  return function () {
    var newArgs = args.slice().concat(Array.prototype.slice.call(arguments));
    if (newArgs.length < length) {
      return curry.call(this, fn, newArgs);
    } else {
      return fn.apply(this, newArgs);
    }
  }
}

var fn = curry(function(a, b, c) {
  return [a, b, c];
});

// fn("a", "b", "c") // ["a", "b", "c"]
// fn("a", "b")("c") // ["a", "b", "c"]
// fn("a")("b")("c") // ["a", "b", "c"]
fn("a")("b", "c") // ["a", "b", "c"]

// 惰性函数
function addEvent(type, el, fn) {
  if (window.addEventListener) {
      addEvent = function(type, el, fn) {
          el.addEventListener(type, fn, false);
      }
  }
  else if (window.attachEvent) {
      addEvent = function(type, el, fn) {
          el.attachEvent('on' + type, fn);
      }
  }
}

// 惰性函数闭包形式
var addEvent = (function(){
  if (window.addEventListener) {
      return function (type, el, fn) {
          el.addEventListener(type, fn, false);
      }
  }
  else if(window.attachEvent){
      return function (type, el, fn) {
          el.attachEvent('on' + type, fn);
      }
  }
})();

var toUpperCase = function(x) { return x.toUpperCase(); };
var hello = function(x) { return 'HELLO, ' + x; };

// 组合
function compose() {
  var args = arguments;
  var start = args.length - 1;
  return function() {
    var i = start;
    var result = args[i].apply(this, arguments);
    while(i--) {
      result = args[i].call(this, result);
    }
    return result;
  }
}

var greet = compose(hello, toUpperCase);
greet('kevin');

// 管道
function pipe() {
  var args = arguments;
  return function() {
    var i = 0;
    var result = args[i].apply(this, arguments);
    i++;
    while(i < args.length) {
      result = args[i].call(this, result);
      i++;
    }
    return result;
  }
}

var greet = pipe(toUpperCase, hello);
greet('kevin');


var add = function(a, b, c) {
  return a + b + c
}

// 函数记忆，第二版 (来自 underscore 的实现)
var memoize = function(func, hasher) {
  var memoize = function(key) {
    var cache = memoize.cache;
    var address = '' + (hasher ? hasher.apply(this, arguments) : key);
    if (!cache[address]) {
      cache[address] = func.apply(this, arguments);
    }
    return cache[address];
  }
  memoize.cache = {};
  return memoize;
};

var memoizedAdd = memoize(add, function(){
  var args = Array.prototype.slice.call(arguments)
  return JSON.stringify(args)
})

console.log(memoizedAdd(1, 2, 3)) // 6
console.log(memoizedAdd(1, 2, 4)) // 7

// Promise 实现原理
function Promise2(fn) {
  // Promise resolve 时的回调函数集
  this.cbs = [];

  // 传递给 Promise 处理函数的 resolve
  // 这里直接往实例上挂个 data
  // 然后把 onResolvedCallback 数组里的函数依次执行一遍就可以
  const resolve = (value) => {
    // 注意 promise 的 then 函数需要异步执行
    setTimeout(() => {
      this.data = value;
      this.cbs.forEach((cb) => cb(value));
    })
  };

  // 执行用户传入的函数 
  // 并且把 resolve 方法交给用户执行
  fn(resolve);
}

Promise2.prototype.then = function(onResolved) {
  // 这里叫做 promise2
  return new Promise2((resolve) => {
    // 这里的 this 其实是 promise1
    this.cbs.push(() => {
      const result = onResolved(this.data);
      if (result instanceof Promise2) {
        // resolve 的权力被交给了 promise
        result.then(resolve);
      } else {
        // 如果是普通值就直接 resolve
        // 依次执行 cbs 里的函数，并且把值传递给 cbs
        resolve(result);
      }
    })
  });
}

new Promise2((resolve) => {
  setTimeout(() => {
    resolve(1);
  }, 500);
})
// then1
.then((res) => {
  console.log(res);
  // promise1
  return new Promise2((resolve) => {
    setTimeout(() => {
      // resolve2
      resolve(2);
    }, 500);
  });
})
// then2
.then(console.log);

// Promise 标准
// 1. 只有一个 then 方法，没有 catch，race，all 等方法，甚至没有构造函数
// 2. then 方法返回一个新的 Promise
// 3. 不同 Promise 的实现需要可以相互调用(interoperable)
// 4. Promise 的初始状态为 pending
//    它可以由此状态转换为 fulfilled（本文为了一致把此状态叫做 resolved）或者 rejected
//    一旦状态确定，就不可以再次转换为其它状态，状态确定的过程称为 settle

// redux 高阶函数
function compose(...funcs) {
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

function createStore(reducer, middlewares) {
  let currentState;

  function dispatch(action) {
    currentState = reducer(currentState, action);
  }

  function getState() {
    return currentState;
  }

  // 初始化一个随意的 dispatch，要求外部在 type 匹配不到的时候返回初始状态
  // 在这个 dispatch 后 currentState 就有值了。
  dispatch({ 
    type: "INIT" 
  });

  let enhancedDispatch = dispatch;
  // 如果第二个参数传入了 middlewares
  if (middlewares) {
    // 用 compose 把 middlewares 包装成一个函数
    enhancedDispatch = compose(...middlewares)(dispatch);
  }

  return {
    dispatch: enhancedDispatch,
    getState
  };
}

// 使用
const otherDummyMiddleware = dispatch => {
  // 返回一个新的 dispatch
  return action => {
    console.log(`type in dummy is ${type}`);
    return dispatch(action);
  };
};

// 这个 dispatch 其实是 otherDummyMiddleware 执行后返回 otherDummyDispatch
const typeLogMiddleware = dispatch => {
  // 返回一个新的 dispatch
  return ({ type, ...args }) => {
    console.log(`type is ${type}`);
    return dispatch({ type, ...args });
  };
};

// 中间件从右往左执行，相当于 typeLogMiddleware(otherDummyMiddleware(dispatch))
const counterStore = createStore(counterReducer, [
  typeLogMiddleware,
  otherDummyMiddleware
]);

console.log(counterStore.getState().count);
counterStore.dispatch({ type: "add", payload: 2 });
console.log(counterStore.getState().count);
// 输出：
// 0
// type is add
// type in dummy is add
// 2

// koa
class Koa {
  constructor() {
    this.middlewares = [];
  }
  use(middleware) {
    this.middlewares.push(middleware);
  }
  start({ req }) {
    function composeMiddlewares(middlewares) {
      return function wrapMiddlewares(ctx) {
        // 记录当前运行的 middleware 的下标
        let index = -1;
        function dispatch(i) {
          // index 向后移动
          index = i;
    
          // 找出数组中存放的相应的中间件
          const fn = middlewares[i];
    
          // 最后一个中间件调用 next 也不会报错
          if (!fn) {
            return Promise.resolve();
          }
    
          return Promise.resolve(
            fn(
              // 继续传递 ctx
              ctx,
              // next 方法，允许进入下一个中间件。
              () => dispatch(i + 1)
            )
          );
        }
        // 开始运行第一个中间件
        return dispatch(0);
      };
    }
    const composed = composeMiddlewares(this.middlewares);
    const ctx = { req, res: undefined };
    return composed(ctx);
  }
}

// 最外层：管控全局错误
app.use(async (ctx, next) => {
  try {
    // 这里的 next 包含了第二层以及第三层的运行
    await next();
  } catch (error) {
    console.log(`[koa error]: ${error.message}`);
  }
});

// 第二层：日志中间件
app.use(async (ctx, next) => {
  const { req } = ctx;
  console.log(`req is ${JSON.stringify(req)}`);
  await next();
  // next 过后已经能拿到第三层写进 ctx 的数据了
  console.log(`res is ${JSON.stringify(ctx.res)}`);
});

// 第三层：核心服务中间件
// 在真实场景中，这一层一般用来构造真正需要返回的数据，写入ctx中
app.use(async (ctx, next) => {
  const { req } = ctx;
  console.log(`calculating the res of ${req}...`);
  const res = {
    code: 200,
    result: `req ${req} success`
  };
  // 写入ctx
  ctx.res = res;
  await next();
});

app.start({ req: "ssh" });

// req is "ssh"
// calculating the res of ssh...
// res is {"code":200,"result":"req ssh success"}
```
