---
title: Python深入学习
date: 2024-3-21 03:08:01
path: /python-deep-learn/
tags: 后端, python, 读书笔记
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

```c
// https://github.com/python/cpython/blob/e225bebc1409bcf68db74a35ed3c31222883bf8f/Python/ceval.c#L1234

if (_Py_atomic_load_relaxed(&ceval->gil_drop_request)) {
   /* Give another thread a chance */
   if (_PyThreadState_Swap(&runtime->gilstate, NULL) != tstate) {
      Py_FatalError("ceval: tstate mix-up");
   }
   drop_gil(ceval, tstate);

   /* Other threads may run now */

   take_gil(ceval, tstate);

   /* Check if we should make a quick exit. */
   exit_thread_if_finalizing(tstate);

   if (_PyThreadState_Swap(&runtime->gilstate, tstate) != NULL) {
      Py_FatalError("ceval: orphan tstate");
   }
}
```

以上代码保证了当前线程会拿到全局的 gil 锁，通过这种机制可以保证每个 bytecode 在运行时会拿到全局锁，不会被其他线程打断

有了这个全局锁之后好处是：

1. 简单的设计不会出错：比每个 object 都实现一个锁要简单
2. 由于只有一个线程锁，避免了死锁问题
3. 对于单线程或没法并行的多线程程序，全局锁性能优秀，如果每个 object 都实现一个锁，那么由于每一行 bytecode 要读写很多 object，需要加很多锁性能较低
4. cpython 维护简单，不需要在修改 python object 的时候关心锁问题，让第三方开发者心智负担降低

当然有做过拿掉 gil 的尝试，但是有以下问题：

1. 不能保证单进程、单线程下运行速度
2. 向后兼容问题，不能兼容之前的代码

坏处是：

1. python 多线程无法利用多核增加运行速度，但是可以用以下方式解决
   1. 多进程
   2. c 拓展在 c 里面做多线程
   3. 无 gil 的 python 解释器

# Descriptor

```py
# 情况 1
class Name:
    def __get__(self, obj, objtype):
        return "Peter"


class A:
    name = Name()


print(A.name) # Peter


# 情况 2
class Name:
    def __get__(self, obj, objtype):
        return "Peter"


class A:
    def __init__(self):
        self.name = Name()


o = A()
print(o.name) # <__main__.Name object at 0x7fb1658443a0>


# 情况 3
class Name:
    def __get__(self, obj, objtype):
        return "Peter"


class A:
    name = Name()


o = A()
o.name = "Bob"
print(o.name) # Bob


# 情况 4
class Name:
    def __get__(self, obj, objtype):
        return "Peter"


class A:
    name = Name()


o = A()
o.name = "Bob"
Name.__set__ = lambda x, y, z: None
print(o.name) # Peter
```

本质上和字节码 `LOAD_ATTR`、`STORE_ATTR` 有关，有着相似的逻辑，下面只说明 `LOAD_ATTR` 的情况

```c
// https://github.com/python/cpython/blob/95c340a86b828cac6c0a2e4f2fa8a96695388c73/Python/ceval.c#L2963
case TARGET(LOAD_ATTR): {
   PyObject *name = GETITEM(names, oparg);
   PyObject *owner = TOP();
   // 核心逻辑
   PyObject *res = PyObject_GetAttr(owner, name);
   Py_DECREF(owner);
   SET_TOP(res);
   if (res == NULL)
         goto error;
   DISPATCH();
}

// https://github.com/python/cpython/blob/95c340a86b828cac6c0a2e4f2fa8a96695388c73/Objects/object.c#L929
PyObject *
PyObject_GetAttr(PyObject *v, PyObject *name)
{
   PyTypeObject *tp = Py_TYPE(v);

   if (!PyUnicode_Check(name)) {
      PyErr_Format(PyExc_TypeError,
                  "attribute name must be string, not '%.200s'",
                  name->ob_type->tp_name);
      return NULL;
   }
   if (tp->tp_getattro != NULL)
      // 核心逻辑 getattro
      return (*tp->tp_getattro)(v, name);
   if (tp->tp_getattr != NULL) {
      const char *name_str = PyUnicode_AsUTF8(name);
      if (name_str == NULL)
         return NULL;
      return (*tp->tp_getattr)(v, (char *)name_str);
   }
   PyErr_Format(PyExc_AttributeError,
               "'%.50s' object has no attribute '%U'",
               tp->tp_name, name);
   return NULL;
}

// https://github.com/python/cpython/blob/95c340a86b828cac6c0a2e4f2fa8a96695388c73/Objects/typeobject.c#L4796
PyTypeObject PyBaseObject_Type = {
   PyVarObject_HEAD_INIT(&PyType_Type, 0)
   "object",                                   /* tp_name */
   sizeof(PyObject),                           /* tp_basicsize */
   0,                                          /* tp_itemsize */
   object_dealloc,                             /* tp_dealloc */
   0,                                          /* tp_vectorcall_offset */
   0,                                          /* tp_getattr */
   0,                                          /* tp_setattr */
   0,                                          /* tp_as_async */
   object_repr,                                /* tp_repr */
   0,                                          /* tp_as_number */
   0,                                          /* tp_as_sequence */
   0,                                          /* tp_as_mapping */
   (hashfunc)_Py_HashPointer,                  /* tp_hash */
   0,                                          /* tp_call */
   object_str,                                 /* tp_str */
   // 没有重载的时候用的逻辑
   PyObject_GenericGetAttr,                    /* tp_getattro */
   PyObject_GenericSetAttr,                    /* tp_setattro */
   0,                                          /* tp_as_buffer */
   Py_TPFLAGS_DEFAULT | Py_TPFLAGS_BASETYPE,   /* tp_flags */
   object_doc,                                 /* tp_doc */
   0,                                          /* tp_traverse */
   0,                                          /* tp_clear */
   object_richcompare,                         /* tp_richcompare */
   0,                                          /* tp_weaklistoffset */
   0,                                          /* tp_iter */
   0,                                          /* tp_iternext */
   object_methods,                             /* tp_methods */
   0,                                          /* tp_members */
   object_getsets,                             /* tp_getset */
   0,                                          /* tp_base */
   0,                                          /* tp_dict */
   0,                                          /* tp_descr_get */
   0,                                          /* tp_descr_set */
   0,                                          /* tp_dictoffset */
   object_init,                                /* tp_init */
   PyType_GenericAlloc,                        /* tp_alloc */
   object_new,                                 /* tp_new */
   PyObject_Del,                               /* tp_free */
};

// https://github.com/python/cpython/blob/95c340a86b828cac6c0a2e4f2fa8a96695388c73/Objects/object.c#L1332C1-L1336C2
PyObject *
PyObject_GenericGetAttr(PyObject *obj, PyObject *name)
{
    return _PyObject_GenericGetAttrWithDict(obj, name, NULL, 0);
}

// https://github.com/python/cpython/blob/95c340a86b828cac6c0a2e4f2fa8a96695388c73/Objects/object.c#L1217
// obj: obj 本身，name: attr 值，字符串
PyObject *
_PyObject_GenericGetAttrWithDict(PyObject *obj, PyObject *name,
                                 PyObject *dict, int suppress)
{
   /* Make sure the logic of _PyObject_GetMethod is in sync with
      this method.

      When suppress=1, this function suppress AttributeError.
   */
   // obj 的 type 就是 class A
   PyTypeObject *tp = Py_TYPE(obj);
   PyObject *descr = NULL;
   PyObject *res = NULL;
   descrgetfunc f;
   Py_ssize_t dictoffset;
   PyObject **dictptr;

   if (!PyUnicode_Check(name)){
      PyErr_Format(PyExc_TypeError,
                  "attribute name must be string, not '%.200s'",
                  name->ob_type->tp_name);
      return NULL;
   }
   Py_INCREF(name);

   if (tp->tp_dict == NULL) {
      if (PyType_Ready(tp) < 0)
         goto done;
   }

   // 在这个 type 里找 name，也就是说 descriptor 必须定义在 type 上，即写到 class 的定义里面，解释了情况 2
   descr = _PyType_Lookup(tp, name);

   f = NULL;
   if (descr != NULL) {
      Py_INCREF(descr);
      // 首先寻找了可能是 descriptor 的 object 有没有 tp_descr_get 函数，即有没有 __get__ 函数
      f = descr->ob_type->tp_descr_get;
      // 判断 IsData：实际上就是有没有 __set__ 函数
      if (f != NULL && PyDescr_IsData(descr)) {
         // 返回 __get__ 函数的返回值
         res = f(descr, obj, (PyObject *)obj->ob_type);
         if (res == NULL && suppress &&
                  PyErr_ExceptionMatches(PyExc_AttributeError)) {
               PyErr_Clear();
         }
         goto done;
      }
   }

   // 找到 object 本身的 __dict__，里面保存了所有的成员变量
   if (dict == NULL) {
      /* Inline _PyObject_GetDictPtr */
      dictoffset = tp->tp_dictoffset;
      if (dictoffset != 0) {
         if (dictoffset < 0) {
               Py_ssize_t tsize;
               size_t size;

               tsize = ((PyVarObject *)obj)->ob_size;
               if (tsize < 0)
                  tsize = -tsize;
               size = _PyObject_VAR_SIZE(tp, tsize);
               _PyObject_ASSERT(obj, size <= PY_SSIZE_T_MAX);

               dictoffset += (Py_ssize_t)size;
               _PyObject_ASSERT(obj, dictoffset > 0);
               _PyObject_ASSERT(obj, dictoffset % SIZEOF_VOID_P == 0);
         }
         dictptr = (PyObject **) ((char *)obj + dictoffset);
         dict = *dictptr;
      }
   }
   // object 的 key 里面找对应的值，和 object 绑定的变量
   if (dict != NULL) {
      Py_INCREF(dict);
      res = PyDict_GetItemWithError(dict, name);
      if (res != NULL) {
         Py_INCREF(res);
         Py_DECREF(dict);
         goto done;
      }
      else {
         Py_DECREF(dict);
         if (PyErr_Occurred()) {
               if (suppress && PyErr_ExceptionMatches(PyExc_AttributeError)) {
                  PyErr_Clear();
               }
               else {
                  goto done;
               }
         }
      }
   }

   // 如果只有 __get__ 函数，没有 __set__ 函数
   if (f != NULL) {
      res = f(descr, obj, (PyObject *)Py_TYPE(obj));
      if (res == NULL && suppress &&
               PyErr_ExceptionMatches(PyExc_AttributeError)) {
         PyErr_Clear();
      }
      goto done;
   }

   // 如果没有 __get__、__set__ 函数，原样返回
   // 对应如下代码
   // class A:
   //    name = "Alice"
   // a = A()
   // print(a.__dict__) # {}，没有值
   // print(a.name) # 没发现 name 有 __get__ 或 __set__ 函数，直接返回
   // 实现的是实例成员变量没有找到，再到类的属性上找，甚至到父类
   if (descr != NULL) {
      res = descr;
      descr = NULL;
      goto done;
   }

   if (!suppress) {
      PyErr_Format(PyExc_AttributeError,
                  "'%.50s' object has no attribute '%U'",
                  tp->tp_name, name);
   }
  done:
    Py_XDECREF(descr);
    Py_DECREF(name);
    return res;
}
```

总结，`LOAD_ATTR` 优先级如下，从大到小：

1. 如果 `__get__`、`__set__` 都有，用 `__get__` 返回值
2. 在 `__dict__` 找对应的值
3. 用 `__get__` 返回值
4. 类的属性

# Decorator

从字节码来看，是一个输入输出都是函数的语法糖

```py
def dec(f):
    pass


@dec
def double(x):
    return x * 2


# 完全等价
double = dec(double)
```

但是输出不一定是函数

```py
def dec(f):
    return 1


@dec
def double(x):
    return x * 2
```

当然，装饰器还可以带参数

```py
import time


def timeit(iter):
    def inner(f):
        def wrapper(*args, **kwargs):
            start = time.time()
            for _ in range(iter):
                ret = f(*args, **kwargs)
            print(time.time() - start)
            return ret

        return wrapper

    return inner


@timeit(1000)
def double(x):
    return x * 2


# double(3)
# 等价于
inner = timeit(1000)
double = inner(double)
```

# 类装饰器

```py
import time


class Timer:
    def __init__(self, func):
        self.func = func

    def __call__(self, *args, **kwargs):
        start = time.time()
        ret = self.func(*args, **kwargs)
        print(f"Time: {time.time() - start}")
        return ret


@Timer
def add(a, b):
    return a + b

# 等价于
# add = Timer(add)

print(add(2, 3))
```

```py
import time


class Timer:
    def __init__(self, prefix):
        self.prefix = prefix

    def __call__(self, func):
        def wrapper(*args, **kwargs):
            start = time.time()
            ret = func(*args, **kwargs)
            print(f"{self.prefix}{time.time() - start}")
            return ret

        return wrapper


@Timer(prefix="curr_time: ")
def add(a, b):
    return a + b


# 等价于
# add = Timer(prefix="curr_time: ")(add)

print(add(2, 3))
```

上面的 2 种都是装饰器类，下面是真正的类装饰器

```py
def add_str(cls):
    def __str__(self):
        return str(self.__dict__)

    cls.__str__ = __str__
    return cls


@add_str
class MyObject:
    def __init__(self, a, b):
        self.a = a
        self.b = b

# 等价于
# MyObject = add_str(MyObject)

o = MyObject(1, 2)
print(o)
```
