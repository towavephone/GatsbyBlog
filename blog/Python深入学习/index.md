---
title: Python深入学习
date: 2024-3-21 03:08:01
path: /python-deep-learn/
tags: 后端, python, 读书笔记
draft: true
---

# 字节码与虚拟机

当每次调用函数或刚开始运行时候，建立新 frame，然后在这个 frame 的环境下一条条的运行 bytecode，每一条 bytecode 都有相应的 c 语言代码执行，在每一个 frame python 会维护一个 stack，然后 bytecode 和 stack 进行交互，当然也会和 code object 保存信息进行交互，执行逻辑运算结果

```py
import dis


def add(a, b):
    return a + b


dis.dis(add)
```

```bash
5           0 LOAD_FAST                0 (a)
            2 LOAD_FAST                1 (b)
            4 BINARY_ADD
            6 RETURN_VALUE
```

```c
// https://github.com/python/cpython/blob/ddd1949fea59f256e51191540a4446f75ed608fa/Python/ceval.c#L1070
case TARGET(LOAD_FAST): {
   PyObject *value = GETLOCAL(oparg);
   if (value == NULL) {
         format_exc_check_arg(tstate, PyExc_UnboundLocalError,
                              UNBOUNDLOCAL_ERROR_MSG,
                              PyTuple_GetItem(co->co_varnames, oparg));
         goto error;
   }
   Py_INCREF(value); // 引用
   PUSH(value);
   FAST_DISPATCH(); // 进入下个循环
}

// https://github.com/python/cpython/blob/ddd1949fea59f256e51191540a4446f75ed608fa/Python/ceval.c#L1280
case TARGET(BINARY_ADD): {
   PyObject *right = POP();
   PyObject *left = TOP();
   PyObject *sum;
   /* NOTE(haypo): Please don't try to micro-optimize int+int on
      CPython using bytecode, it is simply worthless.
      See http://bugs.python.org/issue21955 and
      http://bugs.python.org/issue10044 for the discussion. In short,
      no patch shown any impact on a realistic benchmark, only a minor
      speedup on microbenchmarks. */
   // 关于 string 的优化
   if (PyUnicode_CheckExact(left) &&
            PyUnicode_CheckExact(right)) {
         sum = unicode_concatenate(left, right, f, next_instr);
         /* unicode_concatenate consumed the ref to left */
   }
   else {
         sum = PyNumber_Add(left, right);
         Py_DECREF(left);
   }
   Py_DECREF(right);
   SET_TOP(sum);
   if (sum == NULL)
         goto error;
   DISPATCH();
}

// https://github.com/python/cpython/blob/ddd1949fea59f256e51191540a4446f75ed608fa/Python/ceval.c#L1648
case TARGET(RETURN_VALUE): {
   retval = POP();
   assert(f->f_iblock == 0);
   goto return_or_yield;
}
```

# Code Object

编译一次就不会再改变

```py
def f(a, *, b=3, **kwargs):
    pass


code = f.__code__

# 代码位置
print(f"co_code: {code.co_code}")  # 这段代码真正的 bytecode，用二进制表示
print(f"co_filename: {code.co_filename}")  # 这段 code 的名字，在哪一个文件里被定义的
print(
    f"co_lnotab: {code.co_lnotab}"
)  # mapping，bytecode 对应的源代码行数，用二进制表示

# virtual machine 需要的数据
print(
    f"co_flags: {code.co_flags}"
)  # bitmap，编译时会判断 code 有没有特别属性根据这些来执行不同的逻辑，比如有没有 *args/**kwargs/generator/coroutine
print(f"co_stacksize: {code.co_stacksize}")  # virtual machine 需要栈空间有多大

# 输入参数数量，python 函数重载基础
print(f"co_argcount: {code.co_argcount}")  # 排除 * 和 ** 之后的数量
print(
    f"co_posonlyargcount: {code.co_posonlyargcount}"
)  # / 之前的所有参数都是 args 变量
print(
    f"co_kwonlyargcount: {code.co_kwonlyargcount}"
)  # * 之后的所有参数都是 kwargs 变量

f(1)
f(1, b=1)
f(a=1)


print(f"co_nlocals: {code.co_nlocals}")  # 局部变量数量

print(f"co_varnames: {code.co_varnames}")  # 局部变量
print(f"co_names: {code.co_names}")  # 除了 varnames/cellvars/freevars 之外的变量
print(f"co_cellvars: {code.co_cellvars}")  # 其他的 scope 也会用，一般用来实现闭包方式
print(f"co_freevars: {code.co_freevars}")  # 这个 vars 是从其他 scope 中来的

print(f"co_consts: {code.co_consts}")  # 函数中出现的常量
```

```bash
co_code: b'd\x00S\x00'
co_filename: /blog/Python深入学习/test.py
co_lnotab: b'\x00\x01'
co_flags: 75
co_stacksize: 1
co_argcount: 1
co_posonlyargcount: 0
co_kwonlyargcount: 1
co_nlocals: 3
co_varnames: ('a', 'b', 'kwargs')
co_names: ()
co_cellvars: ()
co_freevars: ()
co_consts: (None,)
```

# Frame

1. 和 Code Object 不同是动态的，记录当前运行时状态
2. 每个函数只会编译出来一个 code object，大部分信息是保存在 code object 里面的，而 frame 根据执行逻辑不同，可能会对同一函数有不同的 frame
3. 每一次函数的执行开始到结束可以认为是当前 frame 的开始结束，结束时返回上一个 frame（栈结构）

```py
import inspect

# import sys
from objprint import op


def f():
    frame = inspect.currentframe()
    # frame = sys._getframe()
    op(frame, honor_existing=False, depth=1)


f()
```

```bash
<frame 0x7f7064b28400
  .f_back = <frame 0x560f77c639c0 ... >, # 上一个 frame
  .f_builtins = { ... }, # 这个函数下的内置函数
  .f_code = <code 0x7f7064e6f500 ... >, # 代码运行信息
  .f_globals = { ... }, # 全局变量
  .f_lasti = 18, # 运行到哪个字节码
  .f_lineno = 10, # 运行到第几行
  .f_locals = { ... }, # 局部变量，实质上是一个读出来的值，用了类似数组的方式保存的
  .f_trace = None, # 下面 3 个变量和 trace 有关，比如 debugger/coverage，sys.settrace 设置后就不是 None
  .f_trace_lines = True, # 是否每一行触发函数
  .f_trace_opcodes = False # 是否每一个字节码触发函数
>
```

```py
import inspect
# from objprint import op


def f():
    frame = inspect.currentframe()

    # 调用方函数的情况
    print(frame.f_back.f_code.co_name)
    print(frame.f_back.f_locals)

    # 需要知道是调用了这个函数
    print(frame.f_back.f_code.co_filename)
    print(frame.f_back.f_lineno)


def g():
    a = 3
    b = 4
    f()


g()
```

```
g
{'a': 3, 'b': 4}
路径/test4.py
20
```

# BINARY_ADD

```c
// https://github.com/python/cpython/blob/ddd1949fea59f256e51191540a4446f75ed608fa/Python/ceval.c#L1280
case TARGET(BINARY_ADD): {
   PyObject *right = POP();
   PyObject *left = TOP();
   PyObject *sum;
   /* NOTE(haypo): Please don't try to micro-optimize int+int on
      CPython using bytecode, it is simply worthless.
      See http://bugs.python.org/issue21955 and
      http://bugs.python.org/issue10044 for the discussion. In short,
      no patch shown any impact on a realistic benchmark, only a minor
      speedup on microbenchmarks. */
   // 关于 string 的优化
   if (PyUnicode_CheckExact(left) &&
            PyUnicode_CheckExact(right)) {
         sum = unicode_concatenate(left, right, f, next_instr);
         /* unicode_concatenate consumed the ref to left */
   }
   else {
         // 耗时最长
         sum = PyNumber_Add(left, right);
         Py_DECREF(left);
   }
   Py_DECREF(right);
   SET_TOP(sum);
   if (sum == NULL)
         goto error;
   DISPATCH();
}

// https://github.com/python/cpython/blob/95c340a86b828cac6c0a2e4f2fa8a96695388c73/Objects/abstract.c#L956
PyObject *
PyNumber_Add(PyObject *v, PyObject *w)
{
    PyObject *result = binary_op1(v, w, NB_SLOT(nb_add));
    if (result == Py_NotImplemented) {
        PySequenceMethods *m = v->ob_type->tp_as_sequence;
        Py_DECREF(result);
        if (m && m->sq_concat) {
            return (*m->sq_concat)(v, w);
        }
        result = binop_type_error(v, w, "+");
    }
    return result;
}

// https://github.com/python/cpython/blob/95c340a86b828cac6c0a2e4f2fa8a96695388c73/Objects/abstract.c#L785
static PyObject *
binary_op1(PyObject *v, PyObject *w, const int op_slot)
{
    PyObject *x;
    binaryfunc slotv = NULL;
    binaryfunc slotw = NULL;

    // 左边是数字，开始加
    if (v->ob_type->tp_as_number != NULL)
        slotv = NB_BINOP(v->ob_type->tp_as_number, op_slot);
    // 左右两边类型不同且右边是数字
    if (w->ob_type != v->ob_type &&
        w->ob_type->tp_as_number != NULL) {
        slotw = NB_BINOP(w->ob_type->tp_as_number, op_slot);
        if (slotw == slotv)
            slotw = NULL;
    }
    if (slotv) {
        // v/w 是同一类型，且 v/w 都有 + 函数指针，比如 1 + 1
        if (slotw && PyType_IsSubtype(w->ob_type, v->ob_type)) {
            x = slotw(v, w);
            if (x != Py_NotImplemented)
                return x;
            Py_DECREF(x); /* can't do it */
            slotw = NULL;
        }
        // 调用 long_add
        x = slotv(v, w);
        if (x != Py_NotImplemented)
            return x;
        Py_DECREF(x); /* can't do it */
    }
    if (slotw) {
        x = slotw(v, w);
        if (x != Py_NotImplemented)
            return x;
        Py_DECREF(x); /* can't do it */
    }
    Py_RETURN_NOTIMPLEMENTED;
}

static PyObject *
long_add(PyLongObject *a, PyLongObject *b)
{
    // a, b 能不能做加法
    CHECK_BINOP(a, b);
    return _PyLong_Add(a, b);
}

PyObject *
_PyLong_Add(PyLongObject *a, PyLongObject *b)
{
    // a, b 都比较小的时候，可以加
    if (_PyLong_BothAreCompact(a, b)) {
        // 耗时部分
        return _PyLong_FromSTwoDigits(medium_value(a) + medium_value(b));
    }

    // 如果 a, b 很大的情况
    PyLongObject *z;
    if (_PyLong_IsNegative(a)) {
        if (_PyLong_IsNegative(b)) {
            z = x_add(a, b);
            if (z != NULL) {
                /* x_add received at least one multiple-digit int,
                   and thus z must be a multiple-digit int.
                   That also means z is not an element of
                   small_ints, so negating it in-place is safe. */
                assert(Py_REFCNT(z) == 1);
                _PyLong_FlipSign(z);
            }
        }
        else
            z = x_sub(b, a);
    }
    else {
        if (_PyLong_IsNegative(b))
            z = x_sub(a, b);
        else
            z = x_add(a, b);
    }
    return (PyObject *)z;
}

/* Create a new int object from a C word-sized int */
static inline PyObject *
_PyLong_FromSTwoDigits(stwodigits x)
{
    if (IS_SMALL_INT(x)) {
        return get_small_int((sdigit)x);
    }
    assert(x != 0);
    if (is_medium_int(x)) {
        return _PyLong_FromMedium((sdigit)x);
    }
    return _PyLong_FromLarge(x);
}

static PyObject *
get_small_int(sdigit ival)
{
    assert(IS_SMALL_INT(ival));
    return (PyObject *)&_PyLong_SMALL_INTS[_PY_NSMALLNEGINTS + ival];
}

static PyObject *
_PyLong_FromMedium(sdigit x)
{
    assert(!IS_SMALL_INT(x));
    assert(is_medium_int(x));
    /* We could use a freelist here */
    PyLongObject *v = PyObject_Malloc(sizeof(PyLongObject));
    if (v == NULL) {
        PyErr_NoMemory();
        return NULL;
    }
    digit abs_x = x < 0 ? -x : x;
    _PyLong_SetSignAndDigitCount(v, x<0?-1:1, 1);
    _PyObject_Init((PyObject*)v, &PyLong_Type);
    v->long_value.ob_digit[0] = abs_x;
    return (PyObject*)v;
}

static PyObject *
_PyLong_FromLarge(stwodigits ival)
{
    twodigits abs_ival;
    int sign;
    assert(!is_medium_int(ival));

    if (ival < 0) {
        /* negate: can't write this as abs_ival = -ival since that
           invokes undefined behaviour when ival is LONG_MIN */
        abs_ival = 0U-(twodigits)ival;
        sign = -1;
    }
    else {
        abs_ival = (twodigits)ival;
        sign = 1;
    }
    /* Must be at least two digits */
    assert(abs_ival >> PyLong_SHIFT != 0);
    twodigits t = abs_ival >> (PyLong_SHIFT * 2);
    Py_ssize_t ndigits = 2;
    while (t) {
        ++ndigits;
        t >>= PyLong_SHIFT;
    }
    PyLongObject *v = _PyLong_New(ndigits);
    if (v != NULL) {
        digit *p = v->long_value.ob_digit;
        _PyLong_SetSignAndDigitCount(v, sign, ndigits);
        t = abs_ival;
        while (t) {
            *p++ = Py_SAFE_DOWNCAST(
                t & PyLong_MASK, twodigits, digit);
            t >>= PyLong_SHIFT;
        }
    }
    return (PyObject *)v;
}

PyLongObject *
_PyLong_New(Py_ssize_t size)
{
    assert(size >= 0);
    PyLongObject *result;
    if (size > (Py_ssize_t)MAX_LONG_DIGITS) {
        PyErr_SetString(PyExc_OverflowError,
                        "too many digits in integer");
        return NULL;
    }
    /* Fast operations for single digit integers (including zero)
     * assume that there is always at least one digit present. */
    Py_ssize_t ndigits = size ? size : 1;
    /* Number of bytes needed is: offsetof(PyLongObject, ob_digit) +
       sizeof(digit)*size.  Previous incarnations of this code used
       sizeof() instead of the offsetof, but this risks being
       incorrect in the presence of padding between the header
       and the digits. */
    // 申请新内存，耗时核心原因
    result = PyObject_Malloc(offsetof(PyLongObject, long_value.ob_digit) +
                             ndigits*sizeof(digit));
    if (!result) {
        PyErr_NoMemory();
        return NULL;
    }
    _PyLong_SetSignAndDigitCount(result, size != 0, size);
    _PyObject_Init((PyObject*)result, &PyLong_Type);
    /* The digit has to be initialized explicitly to avoid
     * use-of-uninitialized-value. */
    result->long_value.ob_digit[0] = 0;
    return result;
}
```

综上，python 做一个简单加法这么复杂的原因：

1. 灵活代价，复杂度交给了底层性能不高
2. 建立对象消耗性能

# Gil
