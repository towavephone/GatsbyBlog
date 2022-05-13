---
title: 编写高质量Python
date: 2022-05-05 10:09:56
path: /writing-high-quality-python/
tags: 后端, python, 读书笔记
---

# 培养 Pythonic 思维

## 第 1 条：查询自己使用的 Python 版本

```bash
$ python --version
$ python -V
$ python3 --version
$ python3 -V
```

```bash
>>> import sys
>>> print(sys.version_info)
sys.version_info(major=3, minor=6, micro=15, releaselevel='final', serial=0)
>>> print(sys.version)
3.6.15 (default, Apr 20 2022, 13:05:41)
[GCC 5.4.0 20160609]
```

Python 2 于 2020 年 1 月 1 日退场，到这一刻，所有的 bug 修复、安全补丁，以及特性向后移植都会停止。此后，如果你还坚持使用 Python 2，那么会面临很多不利因素，因为它不会再获得正式的维护了。深度依赖 Python 2 代码库的开发者可以考虑用 2to3（Python 预装的工具）与 [six](https://six.readthedocs.io/) 这样的工具过渡到 Python 3。

## 第 2 条：遵循 PEP 8 风格指南

### 与空白有关的建议

在 Python 中，空白（whitespace）在语法上相当重要。Python 程序员对空白字符的用法尤其在意，因为它们会影响代码的清晰程度。在这方面，大家应该遵循以下几条建议。

- 用空格（space）表示缩进，而不要用制表符（tab）。
- 和语法相关的每一层缩进都用 4 个空格表示。
- 每行不超过 79 个字符。
- 对于占据多行的长表达式来说，除了首行之外的其余各行都应该在通常的缩进级别之上再加 4 个空格。
- 在同一份文件中，函数与类之间用两个空行隔开。
- 在同一个类中，方法与方法之间用一个空行隔开。
- 使用字典时，键与冒号之间不加空格，写在同一行的冒号和值之间应该加一个空格。
- 给变量赋值时，赋值符号的左边和右边各加一个空格，并且只加一个空格就好。
- 给变量的类型做注解（annotation）时，不要把变量名和冒号隔开，但在类型信息前应该有一个空格。

### 与命名有关的建议

PEP 8 建议采用不同的方式来给 Python 代码中的各个部分命名，这样在阅读代码时，就可以根据这些名称看出它们在 Python 语言中的角色。遵循以下与命名相关的建议。

- 函数、变量及属性用小写字母来拼写，各单词之间用下划线相连，例如：`lowercase_underscore`。
- 受保护的实例属性，用一个下划线开头，例如：`_leading_underscore`。
- 私有的实例属性，用两个下划线开头，例如：`__double_leading_underscore`。
- 类（包括异常）命名时，每个单词的首字母均大写，例如：CapitalizedWord。
- 模块级别的常量，所有字母都大写，各单词之间用下划线相连，例如：`ALL_CAPS`。
- 类中的实例方法，应该把第一个参数命名为 self，用来表示该对象本身。
- 类方法的第一个参数，应该命名为 cls，用来表示这个类本身。

### 与表达式和语句有关的建议

The Zen of Python 中提到：`每件事都应该有简单的做法，而且最好只有一种`。PEP 8 就试着运用这个理念，来规范表达式和语句的写法。

- 采用行内否定，即把否定词直接写在要否定的内容前面，而不要放在整个表达式的前面，例如应该写 `if a is not b`，而不是 `if not a is b`。
- 不要通过长度判断容器或序列是不是空的，例如不要通过 `if len(somelist) == 0` 判断 somelist 是否为 `[]` 或 `''` 等空值，而是应该采用 `if not somelist` 这样的写法来判断，因为 Python 会把空值自动评估为 False。
- 如果要判断容器或序列里面有没有内容（比如要判断 somelist 是否为 `[1]` 或 `'hi'` 这样非空的值），也不应该通过长度来判断，而是应该采用 `if somelist` 语句，因为 Python 会把非空的值自动判定为 True。
- 不要把 if 语句、for 循环、while 循环及 except 复合语句挤在一行。应该把这些语句分成多行来写，这样更加清晰。
- 如果表达式一行写不下，可以用括号将其括起来，而且要适当地添加换行与缩进以便于阅读。多行的表达式，应该用括号括起来，而不要用 `\` 符号续行。

### 与引入有关的建议

PEP 8 对于怎样在代码中引入并使用模块，给出了下面几条建议。

- import 语句（含 `from x import y`）总是应该放在文件开头。
- 引入模块时，总是应该使用绝对名称，而不应该根据当前模块路径来使用相对名称。例如，要引入 bar 包中的 foo 模块，应该完整地写出 `from bar import foo`，即便当前路径为 bar 包里，也不应该简写为 `import foo`。
- 如果一定要用相对名称来编写 import 语句，那就应该明确地写成：`from . import foo`。文件中的 import 语句应该按顺序划分成三个部分：首先引入标准库里的模块，然后引入第三方模块，最后引入自己的模块。属于同一个部分的 import 语句按字母顺序排列。

## 第 3 条：了解 bytes 与 str 的区别

Python 有两种类型可以表示字符序列：一种是 bytes，另一种是 str。

bytes 实例包含的是原始数据，即 8 位的无符号值（通常按照 ASCII 编码标准来显示）。

```py
a = b'h\x65llo'
print(list(a))
print(a)

>>>
[104, 101, 108, 108, 111]
b'hello'
```

str 实例包含的是 Unicode 码点（code point，也叫作代码点），这些码点与人类语言之中的文本字符相对应。

```py
a = 'a\u0300 propos'
print(list(a))
print(a)

>>>
['a', '̀', ' ', 'p', 'r', 'o', 'p', 'o', 's']
à propos
```

两种不同的字符类型与 Python 中两种常见的使用情况相对应：

- 开发者需要操作原始的 8 位值序列，序列里面的这些 8 位值合起来表示一个应该按 UTF-8 或其他标准编码的字符串。
- 开发者需要操作通用的 Unicode 字符串，而不是操作某种特定编码的字符串。

我们通常需要编写两个辅助函数，以便在这两种情况之间转换，确保输入值类型符合开发者的预期形式。

第一个辅助函数接受 bytes 或 str 实例，并返回 str：

```py
def to_str(bytes_or_str):
    if isinstance(bytes_or_str, bytes):
        value = bytes_or_str.decode('utf-8')
    else:
        value = bytes_or_str
    return value # Instance of str

print(repr(to_str(b'foo')))
print(repr(to_str('bar')))

>>>
'foo'
'bar'
```

第二个辅助函数也接受 bytes 或 str 实例，但它返回的是 bytes：

```py
def to_bytes(bytes_or_str):
    if isinstance(bytes_or_str, str):
        value = bytes_or_str.encode('utf-8')
    else:
        value = bytes_or_str
    return value # Instance of bytes

print(repr(to_bytes(b'foo')))
print(repr(to_bytes('bar')))

>>>
b'foo'
b'bar'
```

在 Python 中使用原始的 8 位值与 Unicode 字符串时，有两个问题要注意。

第一个问题是，bytes 与 str 这两种类型似乎是以相同的方式工作的，但其实例并不相互兼容，所以在传递字符序列的时候必须考虑好其类型。

可以用 + 操作符将 bytes 添加到 bytes，str 也可以这样。

```py
print(b'one' + b'two')
print('one' + 'two')

>>>
b'onetwo'
onetwo
```

但是不能将 str 实例添加到 bytes 实例：

```py
b'one' + 'two'

>>>
Traceback ...
TypeError: can't concat str to bytes
```

也不能将 bytes 实例添加到 str 实例：

```py
'one' + b'two'

>>>
Traceback ...
TypeError: can only concatenate str (not "bytes") to str
```

bytes 与 bytes 之间可以用二元操作符（binary operator）来比较大小，str 与 str 之间也可以：

```py
assert b'red' > b'blue'
assert 'red' > 'blue'
```

但是 str 实例不能与 bytes 实例比较：

```py
assert 'red' > b'blue'

>>>
Traceback ...
TypeError: '>' not supported between instances of 'str' and 'bytes'
```

反过来也一样，也就是说 bytes 实例不能与 str 实例比较：

```py
assert b'blue' < 'red'

>>>
Traceback ...
TypeError: '<' not supported between instances of 'bytes' and 'str'
```

判断 bytes 与 str 实例是否相等，总是会评估为假（False），即便这两个实例表示的字符完全相同，它们也不相等。例如，在下面这个例子里，它们表示的字符串都相当于 ASCII 编码之中的 foo。

```py
print(b'foo' == 'foo')

>>>
False
```

两种类型的实例都可以出现在 % 操作符的右侧，用来替换左侧那个格式字符串（format string）里面的 %s。

```py
print(b'red %s' % b'blue')
print('red %s' % 'blue')

>>>
b'red blue'
red blue
```

如果格式字符串是 bytes 类型，那么不能用 str 实例来替换其中的 %s，因为 Python 不知道这个 str 应该按照什么方案来编码。

```py
print(b'red %s' % 'blue')

>>>
Traceback ...
TypeError: %b requires a bytes-like object, or an object that implements _bytes_, not 'str'
```

但反过来却可以，也就是说如果格式字符串是 str 类型，则可以用 bytes 实例来替换其中的 %s，问题是这可能跟你想要的结果不一样。

```py
print('red %s' % b'blue')

>>>
red b'blue'
```

这样做，会让系统在 bytes 实例上面调用 `__repr__` 方法（参见第 75 条），然后用这次调用所得到的结果替换格式字符串里的 %s，因此程序会直接输出 `b'blue'`，而不是像你想的那样，输出 blue 本身。

第二个问题发生在操作文件句柄的时候，这里的句柄指由内置的 open 函数返回的句柄。这样的句柄默认需要使用 Unicode 字符串操作，而不能采用原始的 bytes。习惯了 Python 2 的开发者，尤其容易碰到这个问题，进而导致程序出现奇怪的错误。例如，向文件写入二进制数据的时候，下面这种写法其实是错误的。

```py
with open('data.bin', 'w') as f:
   f.write(b'\xf1\xf2\xf3\xf4\xf5')

>>>
Traceback ...
TypeError: write() argument must be str, not bytes
```

程序发生异常是因为在调用 open 函数时，指定的是 `'w'` 模式，所以系统要求必须以文本模式写入。如果想用二进制模式，那应该指定 `'wb'` 才对。在文本模式下，write 方法接受的是包含 Unicode 数据的 str 实例，不是包含二进制数据的 bytes 实例。所以，我们得把模式改成 `'wb'` 来解决该问题。

```py
with open('data.bin', 'wb') as f:
   f.write(b'\xf1\xf2\xf3\xf4\xf5')
```

读取文件的时候也有类似的问题。例如，如果要把刚才写入的二进制文件读出来，那么不能用下面这种写法，同样需要改成 `'rb'`

```py
with open('data.bin', 'r') as f:
   data = f.read()

>>>
Traceback ...
UnicodeDecodeError: 'utf-8' codec can't decode byte 0xf1 in position 0: invalid continuation byte
```

另一种改法是在调用 open 函数的时候，通过 encoding 参数明确指定编码标准，以确保平台特有的一些行为不会干扰代码的运行效果。例如，假设刚才写到文件里的那些二进制数据表示的是一个采用 'cp1252' 标准（cp1252 是一种老式的 Windows 编码方案）来编码的字符串，则可以这样写

```py
with open('data.bin', 'r', encoding='cp1252') as f:
   data f.read()

assert data == 'ioooδ'
```

这样程序就不会出现异常了，但返回的字符串也与读取原始字节数据所返回的有很大区别。通过这个例子，我们要提醒自己注意当前操作系统默认的编码标准（可以执行 `python3 -c 'import locale; print(locale.getpreferredencoding())'` 命令查看），了解它与你所期望的是否一致。如果不确定，那就在调用 open 时明确指定 encoding 参数。

## 第 4 条：用支持插值的 f-string 取代 C 风格的格式字符串与 str.format 方法

Python 里面最常用的字符串格式化方式是采用 % 格式化操作符。

```py
a = 0b10111011
b = 0xc5f
print('Binary is %d, hex is %d' % (a, b))

>>>
Binary is 187, hex is 3167
```

但是 C 风格的格式字符串，在 Python 里有四个缺点。

1. 如果 % 右侧那个元组里面的值在类型或顺序上有变化，那么程序可能会因为转换类型时发生不兼容问题而出现错误。例如，下面这个简单的格式化表达式是正确的。

   ```py
   key = 'my_var'
   value = 1.234
   formatted = '%-10s = %.2f' % (key, value)
   print(formatted)

   >>>
   my_var     = 1.23
   ```

   但如果把 key 跟 value 互换位置，那么程序就会在运行时出现异常。

   ```py
   reordered_tuple = '%-10s = %.2f' % (value, key)

   >>>
   Traceback ...
   TypeError: must be real number, not str
   ```

   如果 % 右侧的写法不变，但左侧那个格式字符串里面的两个说明符对调了顺序，那么程序同样会发生这个错误。

2. 在填充模板之前，经常要先对准备填写进去的这个值稍微做一些处理，但这样一来，整个表达式可能就会写得很长，让人觉得比较混乱。下面这段代码用来罗列厨房里的各种食材，现在的这种写法并没有对填入格式字符串里面的那三个值（也就是食材的编号 i、食材的名称 item，以及食材的数量 count）预先做出调整。

   ```py
   pantry = [
      ('avocados', 1.25),
      ('bananas', 2.5),
      ('cherries', 15),
   ]

   for i, (item, count) in enumerate(pantry):
      print('#%d: %-10s = %.2f' % (i, item, count))

   >>>
   #0: avocados   = 1.25
   #1: bananas    = 2.50
   #2: cherries   = 15.00
   ```

   如果想让打印出来的信息更好懂，那可能得把这几个值稍微调整一下，但是调整之后，% 操作符右侧的那个三元组就特别长，所以需要多行拆分才能写得下，这会影响程序的可读性。

   ```py
   pantry = [
      ('avocados', 1.25),
      ('bananas', 2.5),
      ('cherries', 15),
   ]

   for i, (item, count) in enumerate(pantry):
      print('#%d: %-10s = %d' % (
         i + 1,
         item.title(),
         round(count)))

   >>>
   #1: Avocados   = 1
   #2: Bananas    = 2
   #3: Cherries   = 15
   ```

3. 如果想用同一个值来填充格式字符串里的多个位置，那么必须在 % 操作符右侧的元组中相应地多次重复该值。

   ```py
   template = '%s loves food. See %s cook.'
   name = 'Max'
   formatted = template % (name, name)
   print(formatted)

   >>>
   Max loves food. See Max cook.
   ```

   如果想在填充之前把这个值修改一下，那么必须同时修改多处才行，这尤其烦人，且容易出错。例如，如果这次要填的不是 name 而是 name.title()，那就必须提醒自己，要把所有的 name 都改成 name.title()。若是有的地方改了，有的地方没改，那输出的信息可能就不一致了。

   为了解决上面提到的一些问题，Python 的 % 操作符允许我们用 dict 取代 tuple，这样的话，我们就可以让格式字符串里面的说明符与 dict 里面的键以相应的名称对应起来，例如 %(key)s 这个说明符，意思就是用字符串（s）来表示 dict 里面名为 key 的那个键所保存的值。下面通过这种办法解决刚才讲的第一个缺点，也就是 % 操作符两侧的顺序不匹配问题。

   ```py
   key = 'my_var'
   value = 1.234
   old_way = '%-10s = %.2f' % (key, value)

   new_way = '%(key)-10s = %(value).2f' % {
      'key': key, 'value': value}  # Original

   reordered = '%(key)-10s = %(value).2f' % {
      'value': value, 'key': key}  # Swapped

   assert old_way == new_way == reordered
   ```

   这种写法还可以解决刚才讲的第三个缺点，也就是用同一个值替换多个格式说明符的问题。改用这种写法之后，我们就不用在 % 操作符右侧重复这个值了。

   ```py
   name = 'Max'
   template = '%s loves food .See %s cook.'
   before = template % (name, name)  # Tuple
   template = '%(name)s loves food .See %(name)s cook.'
   after = template % {'name': name}  # Dictionary
   assert before == after
   ```

   但是，这种写法会让刚才讲的第二个缺点变得更加严重，因为字典格式字符串的引入，我们必须给每一个值都定义键名，而且要在键名的右侧加冒号，格式化表达式变得更加冗长，看起来也更加混乱。我们把不采用 dict 的写法与采用 dict 的写法对比一下，可以更明确地意识到这种写法的缺点。

   ```py
   pantry = [
    ('avocados', 1.25),
    ('bananas', 2.5),
    ('cherries', 15),
   ]

   for i, (item, count) in enumerate(pantry):
      before = '#%d: %-10s = %d' % (
         i + 1,
         item.title(),
         round(count)
      )
      after = '#%(loop)d: %(item)-10s = %(count)d' % {
         'loop': i + 1,
         'item': item.title(),
         'count': round(count),
      }

      assert before == after
   ```

4. 把 dict 写到格式化表达式里面会让代码变多。每个键都至少要写两次：一次是在格式说明符中，还有一次是在字典中作为键，另外，定义字典的时候，可能还要专门用一个变量来表示这个键所对应的值，而且这个变量的名称或许也和键名相同，这样算下来就是三次了。

   ```py
   soup = 'lentil'
   formatted = 'Today\'s soup is %(soup)s.' % {'soup': soup}
   print(formatted)

   >>>
   Today's soup is lentil.
   ```

   除了要反复写键名，在格式化表达式里面使用 dict 的办法还会让表达式变得特别长，通常必须拆分为多行来写，同时，为了与格式字符串的多行写法相对应，定义字典的时候，也要一行一行地给每个键设定对应的值。

   ```py
   menu = {
    'soup': 'lentil',
    'oyster': 'kumamoto',
    'special': 'schnitzel',
   }

   template = ('Today\'s soup is %(soup)s, '
               'buy one get two %(oyster)s oysters, '
               'and our special entree is %(special)s.')
   formatted = template % menu
   print(formatted)

   >>>
   Today's soup is lentil, buy one get two kumamoto oysters, and our special entree is schnitzel.
   ```

   为了查看格式字符串中的说明符究竟对应于字典里的哪个键，必须在这两段代码之间来回跳跃，这会令人难以发现其中的 bug。如果要对键名稍做修改，那么必须同步修改格式字符串里的说明符，这更让代码变得相当烦琐，可读性更差。

### 内置的 format 函数与 str 类的 format 方法

Python 3 添加了高级字符串格式化（advanced string formatting）机制，它的表达能力比老式 C 风格的格式字符串要强，且不再使用 % 操作符。

```py
a = 1234.5678
formatted = format(a, ',.2f')
print(formatted)
b = 'my string'
formatted = format(b, '^20s')
print('*', formatted, '*')

>>>
1,234.57
*      my string       *
```

```py
key = 'my_var'
value = 1.234

formatted = '{} = {}'.format(key, value)
print(formatted)

>>>
my_var = 1.234
```

你可以在 {} 里写个冒号，然后把格式说明符写在冒号的右边，用以规定 format 方法所接收的这个值应该按照怎样的格式来调整。在 Python 解释器里输入 help('FORMATTING')，可以详细查看 str.format 使用的这套格式说明符所依据的规则。

```py
key = 'my_var'
value = 1.234

formatted = '{:<10} = {:.2f}'.format(key, value)
print(formatted)

>>>
my_var     = 1.23
```

运行过程：系统先把 str.format 方法接收到的每个值传给内置的 format 函数，并找到这个值在字符串里对应的 {}，同时将 {} 里面写的格式也传给 format 函数，例如系统在处理 value 的时候，传的就是 format(value, '.2f')。然后，系统会把 format 函数所返回的结果写在整个格式化字符串 {} 所在的位置。另外，每个类都可以通过 `__format__` 这个特殊的方法定制相应的逻辑，这样的话，format 函数在把该类实例转换成字符串时，就会按照这种逻辑来转换。

C 风格的格式字符串采用 % 操作符来引导格式说明符，所以如果要将这个符号照原样输出，那就必须转义，也就是连写两个 %。

```py
print('%.2f%%' % 12.5)
print('{} replaces {{}}'.format(1.23))

>>>
12.50%
1.23 replaces {}
```

调用 str.format 方法的时候，也可以给 str 的 {} 里面写上数字，用来指代 format 方法在这个位置所接收到的参数值位置索引。以后即使这些 {} 在格式字符串中的次序有所变动，也不用调换传给 format 方法的那些参数。于是，这就避免了前面讲的第一个缺点所提到的那个顺序问题。

```py
key = 'my_var'
value = 1.234

formatted = '{1} = {0}'.format(key, value)
print(formatted)

>>>
1.234 = my_var
```

同一个位置索引可以出现在 str 的多个 {} 里面，这些 {} 指代的都是 format 方法在对应位置所收到的值。这就不需要把这个值重复地传给 format 方法，于是就解决了前面提到的第三个缺点。

```py
name = 'Max'
formatted = '{0} loves food. See {0} cook.'.format(name)
print(formatted)

>>>
Max loves food. See Max cook.
```

然而，这个新的 str.format 方法并没有解决上面讲的第二个缺点。如果在对值做填充之前要先对这个值做出调整，那么用这种方法写出来的代码还是跟原来一样乱，阅读性差。把原来那种写法和现在的新写法对比一下，大家就会看到新写法并不比原来好多少。

```py
pantry = [
    ('avocados', 1.25),
    ('bananas', 2.5),
    ('cherries', 15),
]

for i, (item, count) in enumerate(pantry):
    old_style = '#%d: %-10s = %d' % (
        i + 1,
        item.title(),
        round(count))
    new_style = '#{}: {:<10s} = {}'.format(
        i + 1,
        item.title(),
        round(count))
    assert old_style == new_style
```

当然，这种 {} 形式的说明符，还支持一些比较高级的用法，例如可以查询 dict 中某个键的值，可以访问 list 里某个位置的元素，还可以把值转化成 Unicode 或 repr 字符串。下面这段代码把这三项特性结合了起来。

```py
menu = {
    'soup': 'lentil',
    'oyster': 'kumamoto',
    'special': 'schnitzel',
}

formatted = 'First letter is {menu[oyster][0]!r}'.format(
    menu=menu)
print(formatted)

>>>
First letter is 'k'
```

但是这些特性，依然不能解决前面提到的第四个缺点，也就是键名需要多次重复的那个问题。下面把 C 风格的格式化表达式与新的 str.format 方法对比一下，看看这两种写法在处理键值对形式的数据时有什么区别。

```py
old_template = (
    'Today\'s soup is %(soup)s, '
    'buy one get two %(oyster)s oysters, '
    'and our special entree is %(special)s.')
old_formatted = old_template % {
    'soup': 'lentil',
    'oyster': 'kumamoto',
    'special': 'schnitzel',
}

new_template = (
    'Today\'s soup is {soup}, '
    'buy one get two {oyster} oysters, '
    'and our special entree is {special}.')
new_formatted = new_template.format(
    soup='lentil',
    oyster='kumamoto',
    special='schnitzel',
)

assert old_formatted == new_formatted
```

新写法稍微好一点儿，因为它不用定义 dict 了，所以不需要把键名用 `' '` 给括起来。它的说明符也比旧写法的说明符要简单一些。然而这些优点并不突出。另外，虽然我们在新写法里面，可以访问字典中的键，也可以访问列表中的元素，但这些功能只涵盖了 Python 表达式的一小部分特性，str.format 方法还是没有能够把 Python 表达式的优势充分发挥出来。

### 插值格式字符串

Python 3.6 添加了一种新的特性，叫作插值格式字符串（interpolatedformat string，简称 f-string），可以解决上面提到的所有问题。新语法特性要求在格式字符串的前面加字母 f 作为前缀，这跟字母 b 与字母 r 的用法类似，也就是分别表示字节形式的字符串与原始的（或者说未经转义的）字符串的前缀。

f-string 把格式字符串的表达能力发挥到了极致，它彻底解决了上文提到的第四个缺点，也就是键名重复导致的程序冗余问题。我们不用再像使用 C 风格格式表达式时那样专门定义 dict，也不用再像调用 str.format 方法时那样专门把值传给某个参数，这次可以直接在 f-string 的 {} 里面引用当前 Python 范围内的所有名称，进而达到简化的目的。

```py
key = 'my_var'
value = 1.234

formatted = f'{key} = {value}'
print(formatted)

>>>
my_var = 1.234
```

str.format 方法所支持的那套迷你语言，也就是在 {} 内的冒号右侧所采用的那套规则，现在也可以用到 f-string 里面，而且还可以像早前使用 str.format 时那样，通过 ! 符号把值转化成 Unicode 及 repr 形式的字符串。

```py
key = 'my_var'
value = 1.234

formatted = f'{key!r:<10} = {value:.2f}'
print(formatted)

>>>
'my_var'   = 1.23
```

同一个问题，使用 f-string 来解决总是比通过 % 操作符使用 C 风格的格式字符串简单，而且也比 str.format 方法简单。下面按照从短到长的顺序把这几种写法所占的篇幅对比一下，每种写法里面的那个赋值符号（=）左侧都对齐到同一个位置，这样很容易看出符号右边的代码到底有多少。

```py
key = 'my_var'
value = 1.234

f_string = f'{key:<10} = {value:.2f}'
c_tuple = '%-10s = %.2f' % (key, value)
str_args = '{:<10} = {:.2f}'.format(key, value)
str_kw = '{key:<10} = {value:.2f}'.format(key=key,
                                          value=value)
c_dict = '%(key)-10s = %(value).2f' % {'key': key,
                                       'value': value}
assert c_tuple == c_dict == f_string
assert str_args == str_kw == f_string
```

在 f-string 方法中，各种 Python 表达式都可以出现在 {} 里，于是这就解决了前面提到的第二个缺点。我们现在可以用相当简洁的写法对需要填充到字符串里面的值做出微调。C 风格的写法与采用 str.format 方法的写法可能会让表达式变得很长，但如果改用 f-string，或许一行就能写完。

```py
pantry = [
    ('avocados', 1.25),
    ('bananas', 2.5),
    ('cherries', 15),
]

for i, (item, count) in enumerate(pantry):
    old_style = '#%d: %-10s = %d' % (
        i + 1,
        item.title(),
        round(count))
    new_style = '#{}: {:<10s} = {}'.format(
        i + 1,
        item.title(),
        round(count))
    f_string = f'#{i + 1}: {item.title():<10s} = {round(count)}'
    assert old_style == new_style == f_string
```

要是想表达得更清楚一些，可以把 f-string 写成多行的形式，类似于 C 语言的相邻字符串拼接（adjacent-string concatenation）。这样写虽然比单行的 f-string 要长，但仍然好过另外那两种多行的写法。

```py
pantry = [
    ('avocados', 1.25),
    ('bananas', 2.5),
    ('cherries', 15),
]

for i, (item, count) in enumerate(pantry):
    f_string = (
        f'# {i + 1}: '
        f'{item.title():<10s} = '
        f'{round(count)}'
    )
    print(f_string)

>>>
# 1: Avocados   = 1
# 2: Bananas    = 2
# 3: Cherries   = 15
```

Python 表达式也可以出现在格式说明符中。例如，下面的代码把小数点之后的位数用变量来表示，然后把这个变量的名字 places 用 {} 括起来放到格式说明符中，这样写比采用硬代码更灵活。

```py
places = 3
number = 1.23456
print(f'My number is {number:.{places}f}')

>>>
My number is 1.235
```

在 Python 内置的四种字符串格式化办法里面，f-string 可以简洁而清晰地表达出许多种逻辑，这使它成为程序员的最佳选择。如果你想把值以适当的格式填充到字符串里面，那么首先应该考虑的就是采用 f-string 来实现。

### 总结

1. 采用 % 操作符把值填充到 C 风格的格式字符串时会遇到许多问题，而且这种写法比较烦琐。
2. str.format 方法专门用一套迷你语言来定义它的格式说明符，这套语言给我们提供了一些有用的概念，但是在其他方面，这个方法还是存在与 C 风格的格式字符串一样的多种缺点，所以我们也应该避免使用它。
3. f-string 采用新的写法，将值填充到字符串之中，解决了 C 风格的格式字符串所带来的最大问题。f-string 是个简洁而强大的机制，可以直接在格式说明符里嵌入任意 Python 表达式。

## 第 5 条：用辅助函数取代复杂的表达式

Python 的语法相当简明，所以有时只用一条表达式就能实现许多逻辑。例如，要把 URL 之中的查询字符串拆分成键值对，那么只需要使用 parse_qs 函数就可以了。下面的例子会解析查询字符串之中的每个参数，并把这些参数跟它们所对应的整数值放到一份字典（dict）里面。

```py
from urllib.parse import parse_qs
my_values = parse_qs('red=5&blue=0&green=',
                     keep_blank_values=True)
print(repr(my_values))

>>>
{'red': ['5'], 'blue': ['0'], 'green': ['']}
```

在解析查询字符串时，可以发现，有的参数可能带有多个值，有的参数可能只有一个值，还有的参数可能是空白值，另外也会遇到根本没提供这个参数的情况。下面这三行代码分别通过 get 方法查询结果字典里面的三个参数，这刚好对应三种不同的情况：

```py
from urllib.parse import parse_qs
my_values = parse_qs('red=5&blue=0&green=',
                     keep_blank_values=True)

print('Red:         ', my_values.get('red'))
print('Green:       ', my_values.get('green'))
print('Opacity:     ', my_values.get('opacity'))

>>>
Red:          ['5']
Green:        ['']
Opacity:      None
```

如果能把参数缺失与参数为空白值这两种情况都默认当成 0，那就更好了。但这样一个小小的逻辑，似乎不值得专门写 if 语句或辅助函数，所以有人会直接用 Boolean 表达式实现。

Boolean 表达式用 Python 的语法写起来很简单，因为 Python 在对这种表达式求值的时候，会把空白字符串、空白 list 以及 0 值，全都当成 False 看待。所以，只需要把 get 方法查到的结果放在 or 操作符的左边，并且在右边写上 0 就行了。这样的话，只要左边的子表达式为 False，那么整个表达式的值自然就被评估为右边那个表达式的值，也就是 0。

```py
from urllib.parse import parse_qs
my_values = parse_qs('red=5&blue=0&green=',
                     keep_blank_values=True)

# For query string 'red=5&blue=0&green='
red = my_values.get('red', [''])[0] or 0
green = my_values.get('green', [''])[0] or 0
opacity = my_values.get('opacity', [''])[0] or 0
print(f'Red:     {red!r}')
print(f'Green:   {green!r}')
print(f'Opacity: {opacity!r}')

>>>
Red:     '5'
Green:   0
Opacity: 0
```

表达式写成这样，看起来很别扭，而且它并没有完全实现我们想要的效果，因为我们还得保证解析出来的参数值是能够直接参与数学运算的整数。于是，需要通过内置的 int() 把这种表达式所解析出来的字符串转换成整数。

```py
red = int(my_values.get('red', [''])[0] or 0)
```

现在的代码比原来更难读了，因为看上去比原来还要乱。这种代码让人觉得很可怕：如果你是第一次阅读该代码，那必须得把整个表达式逐层拆分，才能明白这行代码的意思，这要花很长时间。代码当然应该写得短一些，但并不意味着非得挤成一行。

Python 可以用 if/else 结构实现三元的条件表达式，这样写比刚才那种写法更清晰，且能保持代码简短。

```py
red_str = my_values.get('red', [''])
red = int(red_str[0]) if red_str[0] else 0
```

但在我们这个例子里，这种写法还是不如完整的多行 if/else 结构好，虽然要多写几行，但非常容易看懂。

```py
green_str = my_values.get('green', [''])
if green_str[0]:
    green = int(green_str[0])
else:
    green = 0
```

如果要反复使用这套逻辑，那还是写成辅助函数比较好，即使像下面这个例子一样只用两三次，也还是值得这样做。

```py
def get_first_int(values, key, default=0):
    found = values.get(key, [''])
    if found[0]:
        return int(found[0])
    return default
```

### 总结

1. Python 的语法很容易把复杂的意思挤到同一行表达式里，这样写很难懂。
2. 复杂的表达式，尤其是那种需要重复使用的复杂表达式，应该写到辅助函数里面。
3. 用 if/else 结构写成的条件表达式，要比用 or 与 and 写成的 Boolean 表达式更好懂。

## 第 6 条：把数据结构直接拆分到多个变量里，不要专门通过下标访问

Python 内置的元组（tuple）类型可以创建不可变的序列，把许多元素依次保存起来。最简单的用法是只用元组保存两个值，例如字典里面的键值对。

```py
snack_calories = {
    'chips': 140,
    'popcorn': 80,
    'nuts': 190,
}
items = tuple(snack_calories.items())
print(items)

>>>
(('chips', 140), ('popcorn', 80), ('nuts', 190))
```

我们可以用整数作下标，通过下标来访问元组里面对应的元素。

```py
item = ('Peanut butter', 'Jelly')
first = item[0]
second = item[1]
print(first, 'and', second)

>>>
Peanut butter and Jelly
```

创建好 tuple 之后，就不能通过下标给其中的元素赋新值了。

```py
pair = ('Chocolate', 'Peanut butter')
pair[0] = 'Honey'

>>>
Traceback ...
TypeError: 'tuple' object does not support item assignment
```

Python 还有一种写法，叫作拆分（unpacking）。这种写法让我们只用一条语句，就可以把元组里面的元素分别赋给多个变量。

```py
item = ('Peanut butter', 'Jelly')
first, second = item  # Unpacking
print(first, 'and', second)

>>>
Peanut butter and Jelly
```

通过 unpacking 来赋值要比通过下标去访问元组内的元素更清晰，而且这种写法所需的代码量通常比较少。当然，赋值操作的左边除了可以罗列单个变量，也可以写成列表、序列或任意深度的可迭代对象（iterable）。

```py
favorite_snacks = {
    'salty': ('pretzels', 100),
    'sweet': ('cookies', 180),
    'veggie': ('carrots', 20),
}

((type1, (name1, cals1)),
 (type2, (name2, cals2)),
 (type3, (name3, cals3))) = favorite_snacks.items()
print(f'Favorite {type1} is {name1} with {cals1} calories')
print(f'Favorite {type2} is {name2} with {cals2} calories')
print(f'Favorite {type3} is {name3} with {cals3} calories')

>>>
Favorite salty is pretzels with 100 calories
Favorite sweet is cookies with 180 calories
Favorite veggie is carrots with 20 calories
```

```py
snacks = [('bacon', 350), ('donut', 240), ('muffin', 190)]

for rank, (name, calories) in enumerate(snacks, 1):
    print(f'#{rank}: {name} has {calories} calories')

>>>
#1: bacon has 350 calories
#2: donut has 240 calories
#3: muffin has 190 calories
```

这才是符合 Python 风格的写法（Pythonic 式的写法），我们不需要再通过下标逐层访问了。这种写法可以节省篇幅，而且比较容易理解。

## 第 7 条：尽量用 enumerate 取代 range

Python 内置的 range 函数适合用来迭代一系列整数。

```py
from random import randint

random_bits = 0
for i in range(32):
    if randint(0, 1):
        random_bits |= 1 << i
print(bin(random_bits))

>>>
0b100101010010000001011011010011
```

如果要迭代的是某种数据结构，例如字符串列表，那么可以直接在这个序列上面迭代，用不着专门通过 range 设定一个取值范围，然后把这个范围里的每个整数值，依次当成下标来访问列表中的元素。

```py
flavor_list = ['vanilla', 'chocolate', 'pecan', 'strawberry']

for flavor in flavor_list:
    print(f'{flavor} is delicious')

>>>
vanilla is delicious
chocolate is delicious
pecan is delicious
strawberry is delicious
```

当然有的时候，在迭代 list 的过程中也需要知道当前处理的这个元素在 list 里的位置。例如，我把爱吃的冰激淋口味写在 `flavor_list` 列表里面，在打印每种口味时，我还想指出这种口味在自己心目中的排名。为了实现这样的功能，我们可以用传统的 range 方式来实现。

```py
flavor_list = ['vanilla', 'chocolate', 'pecan', 'strawberry']

for i in range(len(flavor_list)):
    flavor = flavor_list[i]
    print(f'{i+1}: {flavor}')

>>>
1: vanilla
2: chocolate
3: pecan
4: strawberry
```

`range(len(flavor_list))` 的写法太过复杂，可以用 enumerate 代替。enumerate 能够把任何一种迭代器（iterator）封装成惰性生成器（lazy generator，参见第 30 条）

```py
flavor_list = ['vanilla', 'chocolate', 'pecan', 'strawberry']

it = enumerate(flavor_list)
print(next(it))
print(next(it))

>>>
(0, 'vanilla')
(1, 'chocolate')
```

```py
flavor_list = ['vanilla', 'chocolate', 'pecan', 'strawberry']

for i, flavor in enumerate(flavor_list):
    print(f'{i + 1}: {flavor}')

>>>
1: vanilla
2: chocolate
3: pecan
4: strawberry
```

另外，还可以通过 enumerate 的第二个参数指定起始序号，这样就不用在每次打印的时候去调整了。例如，本例可以从 1 开始计算。

```py
for i, flavor in enumerate(flavor_list, 1):
    print(f'{i + 1}: {flavor}')
```

### 总结

1. enumerate 函数可以用简洁的代码迭代 iterator，而且可以指出当前这轮循环的序号。
2. 不要先通过 range 指定下标的取值范围，然后用下标去访问序列，而是应该直接用 enumerate 函数迭代。
3. 可以通过 enumerate 的第二个参数指定起始序号（默认为 0）。

## 第 8 条：用 zip 函数同时遍历两个迭代器

写 Python 代码时，经常会根据某份列表中的对象创建许多与这份列表有关的新列表。下面这样的列表推导机制，可以把表达式运用到源列表的每个元素上面，从而生成一份派生列表（参见第 27 条）。

```py
names = ['Cecilia', 'Lise', 'Marie']
counts = [len(n) for n in names]
print(counts)

>>>
[7, 4, 5]
```

派生列表中的元素与源列表中对应位置上面的元素有着一定的关系。如果想同时遍历这两份列表，那可以根据源列表的长度做迭代。

```py
names = ['Cecilia', 'Lise', 'Marie']
counts = [len(n) for n in names]

longest_name = None
max_count = 0
for i in range(len(names)):
    count = counts[i]
    if count > max_count:
        longest_name = names[i]
        max_count = count

print(longest_name)

>>>
Cecilia
```

这种写法的问题在于，整个循环代码看起来很乱。我们要通过下标访问 names 与 counts 这两个列表里的元素，所以表示下标的那个循环变量 i 在循环体里必须出现两次，这让代码变得不太好懂。改用 enumerate 实现（参见第 7 条）会稍微好一些，但仍然不够理想。

为了把代码写得更清楚，可以用 Python 内置的 zip 函数来实现。这个函数能把两个或更多的 iterator 封装成惰性生成器（lazy generator）。

```py
for name, count in zip(names, counts):
    if count > max_count:
        longest_name = name
        max_count = count
```

zip 每次只从它封装的那些迭代器里面各自取出一个元素，所以即便源列表很长，程序也不会因为占用内存过多而崩溃。但是，如果输入 zip 的那些列表的长度不一致，那就得小心了。例如，我给 names 列表里又添加了一个名字，但是忘了把它的长度更新到 counts 列表之中。在这种情况下，用 zip 同时遍历这两份列表，会产生奇怪的结果。

```py
names = ['Cecilia', 'Lise', 'Marie']
counts = [len(n) for n in names]

longest_name = None
max_count = 0
for name, count in zip(names, counts):
    if count > max_count:
        longest_name = name
        max_count = count

names.append('Rosalind')
for name, count in zip(names, counts):
    print(name)

>>>
Cecilia
Lise
Marie
```

zip 函数只要其中任何一个迭代器处理完毕，它就不再往下走了。于是，循环的次数实际上等于最短的那份列表所具备的长度。一般情况下，我们都是根据某份列表推导出其他几份列表，然后把这些列表一起封装到 zip 里面，由于这些列表长度相同，因此不会遇到刚才的问题。

在列表长度不同的情况下，zip 函数的提前终止行为可能跟你想实现的效果不一样。所以，如果无法确定这些列表的长度相同，那就不要把它们传给 zip，而是应该传给另一个叫作 `zip_longest` 的函数，这个函数位于内置的 itertools 模块里。

```py
import itertools

names = ['Cecilia', 'Lise', 'Marie']
counts = [len(n) for n in names]

longest_name = None
max_count = 0
for name, count in zip(names, counts):
    if count > max_count:
        longest_name = name
        max_count = count

names.append('Rosalind')

for name, count in itertools.zip_longest(names, counts):
    print(f'{name}: {count}')

>>>
Cecilia: 7
Lise: 4
Marie: 5
Rosalind: None
```

如果其中有些列表已经遍历完了，那么 `zip_longest` 会用当初传给 fillvalue 参数的那个值来填补空缺（本例中空缺的为字符串 `'Rosalind'` 的长度值），默认的参数值是 None。

### 总结

1. 内置的 zip 函数可以同时遍历多个迭代器。
2. zip 会创建惰性生成器，让它每次只生成一个元组，所以无论输入的数据有多长，它都是一个一个处理的。
3. 如果提供的迭代器的长度不一致，那么只要其中任何一个迭代完毕，zip 就会停止。如果想按最长的那个迭代器来遍历，那就改用内置的 itertools 模块中的 `zip_longest` 函数。

## 第 9 条：不要在 for 与 while 循环后面写 else 块

Python 的循环有一项大多数编程语言都不支持的特性，即可以把 else 块紧跟在整个循环结构的后面。

```py
for i in range(3):
    print('Loop', i)
else:
    print('Else block!')

>>>
Loop 0
Loop 1
Loop 2
Else block!
```

如果循环没有从头到尾执行完（也就是循环提前终止了），那么 else 块里的代码是不会执行的。在循环中使用 break 语句实际上会跳过 else 块。这个与实际想象中的功能差别较大

```py
for i in range(3):
    print('Loop', i)
    if i == 1:
        break
else:
    print('Else block!')

>>>
Loop 0
Loop 1
```

还有一个奇怪的地方是，如果对空白序列做 for 循环，那么程序立刻就会执行 else 块。

```py
for x in []:
    print('Never runs')
else:
    print('For Else block!')

>>>
For Else block!
```

while 循环也是这样，如果首次循环就遇到 False，那么程序也会立刻运行 else 块。

```py
while False:
    print('Never runs')
else:
    print('While Else block!')

>>>
While Else block!
```

把 else 设计成这样，是想让你利用它实现搜索逻辑。例如，如果要判断两个数是否互质（也就是除了 1 之外，是不是没有别的数能够同时整除它们），就可以用这种结构实现。先把有可能同时整除它们的数逐个试一遍，如果全都试过之后还是没找到这样的数，那么循环就会从头到尾执行完（这意味着循环没有因为 break 而提前跳出），然后程序就会执行 else 块里的代码。

```py
a = 4
b = 9

for i in range(2, min(a, b) + 1):
    print('Testing', i)
    if a % i == 0 and b % i == 0:
        print('Not coprime')
        break
else:
    print('Coprime')

>>>
Testing 2
Testing 3
Testing 4
Coprime
```

实际工作中，会改用辅助函数完成计算。这样的辅助函数有两种常见的写法。

1. 只要发现某个条件成立，就立刻返回，如果始终都没碰到这种情况，那么循环就会完整地执行，让程序返回函数末尾的那个值作为默认返回值。

   ```py
   def coprime(a, b):
      for i in range(2, min(a, b) + 1):
         if a % i == 0 and b % i == 0:
               return False
      return True

   assert coprime(4, 9)
   assert not coprime(3, 6)
   ```

2. 用变量来记录循环过程中有没有碰到这样的情况，如果有，那就用 break 提前跳出循环，如果没有，循环就会完整地执行，无论如何，最后都返回这个变量的值。

   ```py
   def coprime_alternate(a, b):
      is_coprime = True
      for i in range(2, min(a, b) + 1):
         if a % i == 0 and b % i == 0:
               is_coprime = False
               break
      return is_coprime

   assert coprime_alternate(4, 9)
   assert not coprime_alternate(3, 6)
   ```

for/else 或 while/else 结构本身虽然可以实现某些逻辑表达，但它带来的困惑，已经盖过了它的好处。

### 总结

1. Python 有种特殊的语法，可以把 else 块紧跟在整个 for 循环或 while 循环的后面。
2. 只有在整个循环没有因为 break 提前跳出的情况下，else 块才会执行
3. 把 else 块紧跟在整个循环后面，会让人不太容易看出这段代码的意思，所以要避免这样写。

## 第 10 条：用赋值表达式减少重复代码

赋值表达式（assignment expression）是 Python3.8 新引入的语法，它会用到海象操作符（walrus operator）。这种写法可以解决某些持续已久的代码重复问题。

这种表达式很有用，可以在普通的赋值语句无法应用的场合实现赋值，例如可以用在条件表达式的 if 语句里面。赋值表达式的值，就是赋给海象操作符左侧那个标识符的值。

举个例子。如果有一筐新鲜水果要给果汁店做食材，那我们就可以这样定义其中的内容：

```py
fresh_fruit = {
    'apple': 10,
    'banana': 8,
    'lemon': 5,
}

def make_lemonade(count):
    pass

def out_of_stock():
    pass

count = fresh_fruit.get('lemon', 0)
if count:
    make_lemonade(count)
else:
    out_of_stock()
```

这段代码看上去虽然简单，但还是显得有点儿松散，因为 count 变量虽然定义在整个 if/else 结构之上，然而只有 if 语句才会用到它，else 块根本就不需要使用这个变量。所以，这种写法让人误以为 count 是个重要的变量，if 和 else 都要用到它，但实际上并非如此。

我们在 Python 里面经常要先获取某个值，然后判断它是否非零，如果是就执行某段代码。对于这种用法，我们以前总是要通过各种技巧，来避免 count 这样的变量重复出现在代码之中，这些技巧有时会让代码变得比较难懂（参考第 5 条里面提到的那些技巧）。Python 引入赋值表达式正是为了解决这样的问题。下面改用海象操作符来写：

```py
if count := fresh_fruit.get('lemon', 0):
    make_lemonade(count)
else:
    out_of_stock()
```

新代码虽然只省了一行，但读起来却清晰很多，因为这种写法明确体现出 count 变量只与 if 块有关。这个赋值表达式先把 `:=` 右边的值赋给左边的 count 变量，然后对自身求值，也就是把变量的值当成整个表达式的值。由于表达式紧跟着 if，程序会根据它的值是否非零来决定该不该执行 if 块。这种先赋值再判断的做法，正是海象操作符想要表达的意思。

```py
fresh_fruit = {
    'apple': 10,
    'banana': 8,
    'lemon': 5,
}

def make_cider(count):
    pass

count = fresh_fruit.get('apple', 0)

if count >= 4:
    make_cider(count)
else:
    out_of_stock()
```

同理以上代码可以修改如下：

```py
if (count := fresh_fruit.get('apple', 0)) >= 4:
    make_lemonade(count)
else:
    out_of_stock()
```

与刚才那个例子一样，修改之后的代码也比原来少了一行。但是这次，我们还要注意另外一个现象：赋值表达式本身是放在一对括号里面的。为什么要这样做呢？因为我们要在 if 语句里面把这个表达式的结果跟 4 这个值相比较。刚才柠檬汁的例子没有加括号，因为那时只凭赋值表达式本身的值就能决定 if/else 的走向：只要表达式的值不是 0，程序就进入 if 分支。但是这次不行，这次要把这个赋值表达式放在更大的表达式里面，所以必须用括号把它括起来。当然，在没有必要加括号的情况下，还是尽量别加括号比较好。

还有一种类似的逻辑也会出现刚才说的重复代码，这指的是：我们要根据情况给某个变量赋予不同的值，紧接着要用这个变量做参数来调用某个函数。例如，若顾客要点香蕉冰沙，那我们首先得把香蕉切成好几份，然后用其中的两份来制作这道冰沙。如果不够两份，那就抛出香蕉不足（OutOfBananas）异常。下面用传统的写法实现这种逻辑：

```py
def slice_bananas(count):
    pass


class OutofBananas(Exception):
    pass


def make_smoothies(count):
    pass


fresh_fruit = {
    'apple': 10,
    'banana': 8,
    'lemon': 5,
}

pieces = 0
count = fresh_fruit.get('banana', 0)
if count >= 2:
    pieces = slice_bananas(count)

try:
    smoothies = make_smoothies(pieces)
except OutofBananas:
    out_of_stock()
```

还有一种传统的写法也很常见，就是把 if/else 结构上方那条 pieces = 0 的赋值语句移动到 else 块中。

```py
count = fresh_fruit.get('banana', 0)
if count >= 2:
    pieces = slice_bananas(count)
else:
    pieces = 0

try:
    smoothies = make_smoothies(pieces)
except OutofBananas:
    out_of_stock()
```

这种写法看上去稍微有点儿怪，因为 if 与 else 这两个分支都给 pieces 变量定义了初始值。根据 Python 的作用域规则，这种分别定义变量初始值的写法是成立的（参见第 21 条）。虽说成立，但这样写看起来比较别扭，所以很多人喜欢用第一种写法，也就是在进入 if/else 结构之前，先把 pieces 的初始值给设置好。

改用海象操作符来实现，可以少写一行代码，而且能够压低 count 变量的地位，让它只出现在 if 块里，这样我们就能更清楚地意识到 pieces 变量才是整段代码的重点。

```py
pieces = 0
if (count := fresh_fruit.get('banana', 0)) >= 2:
    pieces = slice_bananas(count)

try:
    smoothies = make_smoothies(pieces)
except OutofBananas:
    out_of_stock()
```

对于在 if 与 else 分支里面分别定义 pieces 变量的写法来说，海象操作符也能让代码变得清晰，因为这次不用再把 count 变量放到整个 if/else 块的上方了。

```py
if (count := fresh_fruit.get('banana', 0)) >= 2:
    pieces = slice_bananas(count)
else:
    pieces = 0

try:
    smoothies = make_smoothies(pieces)
except OutofBananas:
    out_of_stock()
```

Python 新手经常会遇到这样一种困难，就是找不到好办法来实现 switch/case 结构。最接近这种结构的做法是在 if/else 结构里面继续嵌套 if/else 结构，或者使用 if/elif/else 结构。

例如，我们想按照一定的顺序自动给客人制作饮品，这样就不用点餐了。下面这段逻辑先判断能不能做香蕉冰沙，如果不能，就做苹果汁，还不行，就做柠檬汁：

```py
count = fresh_fruit.get('banana', 0)
if count >= 2:
    pieces = slice_bananas(count)
    to_enjoy = make_smoothies(pieces)
else:
    count = fresh_fruit.get('apple', 0)
    if count >= 4:
        to_enjoy = make_cider(count)
    else:
        count = fresh_fruit.get('lemon', 0)
        if count:
            to_enjoy = make_lemonade(count)
        else:
            to_enjoy = 'Nothing'
```

这种难看的写法其实在 Python 代码里特别常见。幸好现在有了海象操作符，让我们能够轻松地模拟出很接近 switch/case 的方案。

```py
if (count := fresh_fruit.get('banana', 0)) >= 2:
    pieces = slice_bananas(count)
    to_enjoy = make_smoothies(pieces)
elif (count := fresh_fruit.get('apple', 0)) >= 4:
    to_enjoy = make_cider(count)
elif count := fresh_fruit.get('lemon', 0):
    to_enjoy = make_lemonade(count)
else:
    to_enjoy = 'Nothing'
```

这个版本只比原来短五行，但是看起来却清晰得多，因为嵌套深度与缩进层数都变少了。只要碰到刚才那种难看的结构，我们就应该考虑能不能改用海象操作符来写。

Python 新手还会遇到一个困难，就是缺少 do/while 循环结构。例如，我们要把新来的水果做成果汁并且装到瓶子里面，直到水果用完为止。下面先用普通的 while 循环来实现：

```py
def pick_fruit():
    pass


def make_juice(fruit, count):
    pass


bottles = []
fresh_fruit = pick_fruit()
while fresh_fruit:
    for fruit, count in fresh_fruit.items():
        batch = make_juice(fruit, count)
        bottles.extend(batch)
    fresh_fruit = pick_fruit()
```

这种写法必须把 `fresh_fruit = pick_fruit()` 写两次，第一次是在进入 while 循环之前，因为我们要给 `fresh_fruit` 设定初始值，第二次是在 while 循环体的末尾，因为我们得把下一轮需要处理的水果列表填充到 `fresh_fruit` 里面。如果想复用这行代码，可以考虑 loop-and-a-half 模式。这个模式虽然能消除重复，但是会让 while 循环看起来很笨，因为它成了无限循环，程序只能通过 break 语句跳出这个循环。

```py
bottles = []
while True:
   fresh_fruit = pick_fruit()
   if not fresh_fruit:
      break
    for fruit, count in fresh_fruit.items():
        batch = make_juice(fruit, count)
        bottles.extend(batch)
```

有了海象操作符，就不需要使用 `loop-and-a-half` 模式了，我们可以在每轮循环的开头给 `fresh_fruit` 变量赋值，并根据变量的值来决定要不要继续循环。这个写法简单易读，所以应该成为首选方案。

```py
bottles = []
while fresh_fruit := pick_fruit():
    for fruit, count in fresh_fruit.items():
        batch = make_juice(fruit, count)
        bottles.extend(batch)
```

在其他一些场合，赋值表达式也能缩减重复代码（参见第 29 条）。总之，如果某个表达式或赋值操作多次出现在一组代码里面，那就可以考虑用赋值表达式把这段代码改得简单一些。

### 总结

1. 赋值表达式通过海象操作符（:=）给变量赋值，并且让这个值成为这条表达式的结果，于是，我们可以利用这项特性来缩减代码。如果赋值表达式是大表达式里的一部分，就得用一对括号把它括起来。
2. 虽说 Python 不支持 switch/case 与 do/while 结构，但可以利用赋值表达式清晰地模拟出这种逻辑。

# 列表与字典

## 第 11 条：学会对序列做切片

Python 有这样一种写法，可以从序列里面切割（slice）出一部分内容，让我们能够轻松地获取原序列的某个子集合。最简单的用法就是切割内置的 list、str 与 bytes。其实，凡是实现了 `__getitem__` 与 `__setitem__` 这两个特殊方法的类都可以切割（参见第 43 条）。

最基本的写法是用 `somelist[start:end]` 这一形式来切割，也就是从 start 开始一直取到 end 这个位置，但不包含 end 本身的元素。

```py
a = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
print('Middle two:   ', a[3:5])
print('All but ends: ', a[1:7])

>>>
Middle two:    ['d', 'e']
All but ends:  ['b', 'c', 'd', 'e', 'f', 'g']
```

如果是从头开始切割列表，那就应该省略冒号左侧的下标 0，这样看起来更清晰。

```py
assert a[:5] == a[0:5]
```

如果一直取到列表末尾，那就应该省略冒号右侧的下标，因为用不着专门把它写出来。

```py
assert a[5:] == a[5:len(a)]
```

用负数作下标表示从列表末尾往前算。下面这些切割方式，即便是刚看到这段代码的人也应该能明白是什么意思。

```py
a = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
print(a[:]) # ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
print(a[:5]) # ['a', 'b', 'c', 'd', 'e']
print(a[:-1]) # ['a', 'b', 'c', 'd', 'e', 'f', 'g']
print(a[4:]) # ['e', 'f', 'g', 'h']
print(a[-3:]) # ['f', 'g', 'h']
print(a[2:5]) # ['c', 'd', 'e']
print(a[2:-1]) # ['c', 'd', 'e', 'f', 'g']
print(a[-3:-1]) # ['f', 'g']
```

如果起点与终点所确定的范围超出了列表的边界，那么系统会自动忽略不存在的元素。利用这项特性，很容易就能构造出一个最多只有若干元素的输入序列，例如：

```py
first_twenty_items = a[:20]
last_twenty_items = a[-20:]
```

切割时所用的下标可以越界，但是直接访问列表时却不行，那样会让程序抛出异常。

```py
a[20]

>>>
Traceback ...
IndexError: list index out of range
```

切割出来的列表是一份全新的列表。即便把某个元素换掉，也不会影响原列表中的相应位置。那个位置上的元素还是旧值。

```py
a = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
b = a[3:]
print('Before:', b)
b[1] = 99
print('After: ', b)
print('No change:', a)

>>>
Before: ['d', 'e', 'f', 'g', 'h']
After:  ['d', 99, 'f', 'g', 'h']
No change: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
```

切片可以出现在赋值符号的左侧，表示用右侧那些元素把原列表中位于这个范围之内的元素换掉。与 unpacking 形式的赋值不同，这种赋值不要求等号两边所指定的元素个数必须相同（如果是做 unpacking，那么等号左侧用来接收数值的变量个数必须与等号右边所提供的数值个数一致，例如 `a, b = c[:2]`，参见第 6 条）。在原列表中，位于切片范围之前和之后的那些元素会予以保留，但是列表的长度可能有所变化。例如在下面这个例子中，列表会变短，因为赋值符号右侧只提供了 3 个值，但是左侧那个切片却涵盖了 5 个值，列表会比原来少两个元素。

```py
a = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
print('Before ', a)
a[2:7] = [99, 22, 14]
print('After  ', a)

>>>
Before  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
After   ['a', 'b', 99, 22, 14, 'h']
```

下面这段代码会使列表变长，因为赋值符号右侧的元素数量比左侧那个切片所涵盖的元素数量要多。

```py
a = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
print('Before ', a)
a[2:3] = [47, 11]
print('After  ', a)

>>>
Before  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
After   ['a', 'b', 47, 11, 'd', 'e', 'f', 'g', 'h']
```

起止位置都留空的切片，如果出现在赋值符号右侧，那么表示给这个列表做副本，这样制作出来的新列表内容和原列表相同，但身份不同。

```py
b = a[:]
assert b == a and b is not a
```

把不带起止下标的切片放在赋值符号左边，表示是用右边那个列表的副本把左侧列表的全部内容替换掉（注意，左侧列表依然保持原来的身份，系统不会分配新的列表）。

```py
a = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
b = a
c = a[:]
print('Before a', a)
print('Before b', b)
print('Before c', b)
a[:] = [101, 102, 103]
assert b is a and c is not a  # Still the same list object
print('After a ', a)  # Now has different contents
print('After b ', b)  # Same list, so same contents as a
print('After c ', c)  # Not same list, same contents as a

>>>
Before a ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
Before b ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
Before c ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
After a  [101, 102, 103]
After b  [101, 102, 103]
After c  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
```

### 总结

1. 切片要尽可能写得简单一些：如果从头开始选取，就省略起始下标 0；如果选到序列末尾，就省略终止下标。
2. 切片允许起始下标或终止下标越界，所以很容易就能表达“取开头多少个元素”（例如 `a[:20]`）或“取末尾多少个元素”（例如 `a[-20:0]`）等含义，而不用担心切片是否真有这么多元素。
3. 把切片放在赋值符号的左侧可以将原列表中这段范围内的元素用赋值符号右侧的元素替换掉，但可能会改变原列表的长度。

## 第 12 条：不要在切片里同时指定起止下标与步进

除了基本的切片写法（参见第 11 条）外，Python 还有一种特殊的步进切片形式，也就是 somelist[start\:end\:stride]。这种形式会在每 n 个元素里面选取一个，这样很容易就能把奇数位置上的元素与偶数位置上的元素分别通过 `x[::2]` 与 `x[1::2]` 选取出来。

```py
x = ['red', 'orange', 'yellow', 'green', 'blue', 'purple']
odds = x[::2]
evens = x[1::2]
print(odds)
print(evens)

>>>
['red', 'yellow', 'blue']
['orange', 'green', 'purple']
```

带有步进的切片经常会引发意外的效果，并且使程序出现 bug。例如，Python 里面有个常见的技巧，就是把 -1 当成步进值对 bytes 类型的字符串做切片，这样就能将字符串反转过来。

```py
x = b'mongoose'
y = x[::-1]
print(y)

>>>
b'esoognom'
```

Unicode 形式的字符串也可以这样反转（参见第 3 条）。

```py
x = '多喝水'
y = x[::-1]
print(y)

>>>
水喝多
```

但如果把这种字符串编码成 UTF-8 标准的字节数据，就不能用这个技巧来反转了。

```py
x = '多喝水'
x = x.encode('utf-8')
y = x[::-1]
z = y.decode('utf-8')

>>>
Traceback ...
UnicodeDecodeError: 'utf-8' codec can't decode byte 0xb4 in position 0: invalid start byte
```

除了 -1 之外，用其他负数做步进值，有没有意义呢？请看下面的例子：

```py
x = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
print(x[::2])  # ['a', 'c', 'e', 'g']
print(x[::-2])  # ['h', 'f', 'd', 'b']
```

上例中，`::2` 表示从头开始往后选，每两个元素里面选一个。`::-2` 的含义稍微有点儿绕，表示从末尾开始往前选，每两个元素里面选一个。

同时使用起止下标与步进会让切片很难懂。方括号里面写三个值显得太过拥挤，读起来不大容易，而且在指定了步进值（尤其是负数步进值）的时候，我们必须很仔细地考虑：这究竟是从前往后取，还是从后往前取？

为了避免这个问题，笔者建议大家不要把起止下标和步进值同时写在切片里。如果必须指定步进，那么尽量采用正数，而且要把起止下标都留空。即便必须同时使用步进值与起止下标，也应该考虑分成两次来写。

```py
y = x[::2]  # ['a', 'c', 'e', 'g']
z = y[1:-1] # ['c', 'e']
```

像刚才那样先隔位选取然后再切割，会让程序多做一次浅拷贝（shallow copy）。所以，应该把最能缩减列表长度的那个切片操作放在前面。如果程序实在没有那么多时间或内存去分两步操作，那么可以改用内置的 itertools 模块中的 islice 方法（参见第 36 条），这个方法用起来更清晰，因为它的起止位置与步进值都不能是负数。

### 总结

1. 同时指定切片的起止下标与步进值理解起来会很困难。
2. 如果要指定步进值，那就省略起止下标，而且最好采用正数作为步进值，尽量别用负数。
3. 不要把起始位置、终止位置与步进值全都写在同一个切片操作里。如果必须同时使用这三项指标，那就分两次来做（其中一次隔位选取，另一次做切割），也可以改用 itertools 内置模块里的 islice 方法。

## 第 13 条：通过带星号的 unpacking 操作来捕获多个元素，不要用切片

基本的 unpacking 操作（参见第 6 条）有一项限制，就是必须提前确定需要拆解的序列的长度。例如，销售汽车的时候，我们可能会把每辆车的车龄写在一份列表中，然后按照从大到小的顺序排列好。如果试着通过基本的 unpacking 操作获取其中最旧的两辆车，那么程序运行时会出现异常。

```py
car_ages = [0, 9, 4, 8, 7, 20, 19, 1, 6, 15]
car_ages_descending = sorted(car_ages, reverse=True)
oldest, second_oldest = car_ages_descending

>>>
Traceback ...
ValueError: too many values to unpack (expected 2)
```

Python 新手经常通过下标与切片（参见第 11 条）来处理这个问题。例如，可以明确通过下标把最旧和第二旧的那两辆车取出来，然后把其余的车放到另一份列表中。

```py
car_ages = [0, 9, 4, 8, 7, 20, 19, 1, 6, 15]
car_ages_descending = sorted(car_ages, reverse=True)
oldest = car_ages_descending[0]
second_oldest = car_ages_descending[1]
others = car_ages_descending[2:]
print(oldest, second_oldest, others)

>>>
20 19 [15, 9, 8, 7, 6, 4, 1, 0]
```

这样做没问题，但是下标与切片会让代码看起来很乱。而且，用这种办法把序列中的元素分成多个子集合，其实很容易出错，因为我们通常容易把下标多写或少写一个位置。例如，若修改了其中一行，但却忘了更新另一行，那就会遇到这种错误。

这个问题通过带星号的表达式（starred expression）来解决会更好一些，这也是一种 unpacking 操作，它可以把无法由普通变量接收的那些元素全都囊括进去。下面用带星号的 unpacking 操作改写刚才那段代码，这次既不用取下标，也不用做切片。

```py
car_ages = [0, 9, 4, 8, 7, 20, 19, 1, 6, 15]
car_ages_descending = sorted(car_ages, reverse=True)
oldest, second_oldest, *others = car_ages_descending
print(oldest, second_oldest, others)

>>>
20 19 [15, 9, 8, 7, 6, 4, 1, 0]
```

这样写简短易读，而且不容易出错，因为它不要求我们在修改完其中一个下标之后，还必须记得同步更新其他的下标。

这种带星号的表达式可以出现在任意位置，所以它能够捕获序列中的任何一段元素。

```py
car_ages = [0, 9, 4, 8, 7, 20, 19, 1, 6, 15]
car_ages_descending = sorted(car_ages, reverse=True)
oldest, *others, youngest = car_ages_descending
print(oldest, youngest, others)
*others, second_youngest, youngest = car_ages_descending
print(youngest, second_youngest, others)

>>>
20 0 [19, 15, 9, 8, 7, 6, 4, 1]
0 1 [20, 19, 15, 9, 8, 7, 6, 4]
```

只不过，在使用这种写法时，至少要有一个普通的接收变量与它搭配，否则就会出现 SyntaxError。例如不能像下面这样，只使用带星号的表达式而不搭配普通变量。

```py
car_ages = [0, 9, 4, 8, 7, 20, 19, 1, 6, 15]
car_ages_descending = sorted(car_ages, reverse=True)
*others = car_ages_descending

>>>
SyntaxError: starred assignment target must be in a list or tuple
```

另外，对于单层结构来说，同一级里面最多只能出现一次带星号的 unpacking。

```py
first, *middle, *second_middle, last = [1, 2, 3, 4]

>>>
SyntaxError: two starred expressions in assignment
```

如果要拆解的结构有很多层，那么同一级的不同部分里面可以各自出现带星号的 unpacking 操作。当然笔者并不推荐这种写法（类似的建议参见第 19 条）。这里举这样一个例子，是想帮助大家理解这种带星号的表达式可以实现怎样的拆分效果。

```py
car_inventory = {
    'Downtown': ('Silver Shadow', 'Pinto', 'DMC'),
    'Airport': ('Skyline', 'Viper', 'Gremlin', 'Nova'),
}

((loc1, (best1, *rest1)),
 (loc2, (best2, *rest2))) = car_inventory.items()
print(f'Best at {loc1} is {best1}, {len(rest1)} others')
print(f'Best at {loc2} is {best2}, {len(rest2)} others')

>>>
Best at Downtown is Silver Shadow, 2 others
Best at Airport is Skyline, 3 others
```

带星号的表达式总会形成一份列表实例。如果要拆分的序列里已经没有元素留给它了，那么列表就是空白的。如果能提前确定有待处理的序列里至少会有 N 个元素，那么这项特性就相当有用。

```py
short_list = [1, 2]
first, second, *rest = short_list
print(first, second, rest)

>>>
1 2 []
```

unpacking 操作也可以用在迭代器上，但是这样写与把数据拆分到多个变量里面的那种基本写法相比，并没有太大优势。例如，我可以先构造长度为 2 的取值范围（range），并把它封装在 it 这个迭代器里，然后将其中的值拆分到 first 与 second 这两个变量里。但这样写还不如直接使用形式相符的静态列表（例如[1, 2]），那样更简单。

```py
it = iter(range(1, 3))
first, second = it
print(f'{first} and {second}')

>>>
1 and 2
```

对迭代器做 unpacking 操作的好处，主要体现在带星号的用法上面，它使迭代器的拆分值更清晰。例如，这里有个生成器，每次可以从含有整个一周的汽车订单的 CSV 文件中取出一行数据。

```py
def generate_csv():
    yield ('Date', 'Make', 'Model', 'Year', 'Price')
    # ...
```

我们可以用下标和切片来处理这个生成器所给出的结果，但这样写需要很多行代码，而且看着比较混乱。

```py
def generate_csv():
    yield ('Date', 'Make', 'Model', 'Year', 'Price')
    yield ('Date', 'Make', 'Model', 'Year', 'Price')
    yield ('Date', 'Make', 'Model', 'Year', 'Price')
    yield ('Date', 'Make', 'Model', 'Year', 'Price')
    yield ('Date', 'Make', 'Model', 'Year', 'Price')
    # ...


all_csv_rows = list(generate_csv())
header = all_csv_rows[0]
rows = all_csv_rows[1:]
print('CSV Header:', header)
print('Row count:', len(rows))

>>>
CSV Header: ('Date', 'Make', 'Model', 'Year', 'Price')
Row count: 4
```

利用带星号的 unpacking 操作，我们可以把第一行（表头）单独放在 header 变量里，同时把迭代器所给出的其余内容合起来表示成 rows 变量。这样写就清楚多了。

```py
def generate_csv():
    yield ('Date', 'Make', 'Model', 'Year', 'Price')
    yield ('Date', 'Make', 'Model', 'Year', 'Price')
    yield ('Date', 'Make', 'Model', 'Year', 'Price')
    yield ('Date', 'Make', 'Model', 'Year', 'Price')
    yield ('Date', 'Make', 'Model', 'Year', 'Price')
    # ...


it = list(generate_csv())
header, *rows = it
print('CSV Header:', header)
print('Row count:', len(rows))

>>>
CSV Header: ('Date', 'Make', 'Model', 'Year', 'Price')
Row count: 4
```

带星号的这部分总是会形成一份列表，所以要注意，这有可能耗尽计算机的全部内存并导致程序崩溃。首先必须确定系统有足够的内存可以存储拆分出来的结果数据，然后才可以对迭代器使用带星号的 unpacking 操作（还有另一种做法，参见第 31 条）。

### 总结

1. 拆分数据结构并把其中的数据赋给变量时，可以用带星号的表达式，将结构中无法与普通变量相匹配的内容捕获到一份列表里。
2. 这种带星号的表达式可以出现在赋值符号左侧的任意位置，它总是会形成一份含有零个或多个值的列表。
3. 在把列表拆解成互相不重叠的多个部分时，这种带星号的 unpacking 方式比较清晰，而通过下标与切片来实现的方式则很容易出错。

## 第 14 条：用 sort 方法的 key 参数来表示复杂的排序逻辑

内置的列表类型提供了名叫 sort 的方法，可以根据多项指标给 list 实例中的元素排序。在默认情况下，sort 方法总是按照自然升序排列列表内的元素。例如，如果列表中的元素都是整数，那么它就按数值从小到大排列。

```py
numbers = [93, 86, 11, 68, 70]
numbers.sort()
print(numbers)

>>>
[11, 68, 70, 86, 93]
```

这里定义了一个 Tool 类表示各种建筑工具，它带有 `__repr__` 方法，因此我们能把这个类的实例打印成字符串。

如果仅仅这样写，那么这个由该类的对象所构成的列表是没办法用 sort 方法排序的，因为 sort 方法发现，排序所需要的特殊方法并没有定义在 Tool 类中。

```py
class Tool:
    def __init__(self, name, weight):
        self.name = name
        self.weight = weight

    def __repr__(self):
        return f'Tool({self.name!r}, {self.weight})'


tools = [
    Tool('level', 3.5),
    Tool('hammer', 1.25),
    Tool('screwdriver', 0.5),
    Tool('chisel', 0.25),
]

tools.sort()

>>>
Traceback ...
TypeError: '<' not supported between instances of 'Tool' and 'Tool'
```

下面用 lambda 关键字定义这样的一个函数，把它传给 sort 方法的 key 参数，让我们能够按照 name 的字母顺序排列这些 Tool 对象。

```py
class Tool:
    def __init__(self, name, weight):
        self.name = name
        self.weight = weight

    def __repr__(self):
        return f'Tool({self.name!r}, {self.weight})'


tools = [
    Tool('level', 3.5),
    Tool('hammer', 1.25),
    Tool('screwdriver', 0.5),
    Tool('chisel', 0.25),
]

print('Unsorted:', repr(tools))
tools.sort(key=lambda x: x.name)
print('\nSorted:', tools)

>>>
Unsorted: [Tool('level', 3.5), Tool('hammer', 1.25), Tool('screwdriver', 0.5), Tool('chisel', 0.25)]

Sorted: [Tool('chisel', 0.25), Tool('hammer', 1.25), Tool('level', 3.5), Tool('screwdriver', 0.5)]
```

有时我们可能需要用多个标准来排序。可以利用元组的特性：如果两个元组的首个元素相等，就比较第二个元素，如果仍然相等，就继续往下比较。

```py
class Tool:
    def __init__(self, name, weight):
        self.name = name
        self.weight = weight

    def __repr__(self):
        return f'Tool({self.name!r}, {self.weight})'


power_tools = [
    Tool('drill', 4),
    Tool('circular saw', 5),
    Tool('jackhammer', 40),
    Tool('sander', 4),
]

power_tools.sort(key=lambda x: (x.weight, x.name))
print(power_tools)

power_tools.sort(key=lambda x: (x.weight, x.name), reverse=True)
print(power_tools)

>>>
[Tool('drill', 4), Tool('sander', 4), Tool('circular saw', 5), Tool('jackhammer', 40)]
[Tool('jackhammer', 40), Tool('circular saw', 5), Tool('sander', 4), Tool('drill', 4)]
```

这种做法有个缺点，就是 key 函数所构造的这个元组只能按同一个排序方向来对比它所表示的各项指标（要是升序，就都得是升序；要是降序，就都得是降序），可以利用以下方法实现不同方向的排序

```py
power_tools.sort(key=lambda x: (-x.weight, x.name))
print(power_tools)
```

但是 str 类型不支持一元减操作符，可以通过多次调用 sort 方法实现不同方向的排序，这里利用了 sort 方法是稳定排序算法的原理

```py
power_tools.sort(key=lambda x: x.name)  # Name ascending
power_tools.sort(key=lambda x: x.weight, reverse=True)  # Weight descending
print(power_tools)
```

无论有多少项排序指标都可以按照这种思路来实现，而且每项指标可以分别按照各自的方向来排，不用全都是升序或全都是降序。只需要倒着写即可，也就是把最主要的那项排序指标放在最后一轮处理。在上面的例子中，首要指标是重量降序，次要指标是名称升序，所以先按名称升序排列，然后按重量降序排列。

尽管这两种思路都能实现同样的效果，但只调用一次 sort，还是要比多次调用 sort 更为简单。所以，在实现多个指标按不同方向排序时，应该优先考虑让 key 函数返回元组，并对元组中的相应指标取相反数。只有在万不得已的时候，才可以考虑多次调用 sort 方法。

### 总结

1. 列表的 sort 方法可以根据自然顺序给其中的字符串、整数、元组等内置类型的元素进行排序。
2. 普通对象如果通过特殊方法定义了自然顺序，那么也可以用 sort 方法来排列，但这样的对象并不多见。
3. 可以把辅助函数传给 sort 方法的 key 参数，让 sort 根据这个函数所返回的值来排列元素顺序，而不是根据元素本身来排列。
4. 如果排序时要依据的指标有很多项，可以把它们放在一个元组中，让 key 函数返回这样的元组。对于支持一元减操作符的类型来说，可以单独给这项指标取反，让排序算法在这项指标上按照相反的方向处理。
5. 如果这些指标不支持一元减操作符，可以多次调用 sort 方法，并在每次调用时分别指定 key 函数与 reverse 参数。最次要的指标放在第一轮处理，然后逐步处理更为重要的指标，首要指标放在最后一轮处理。

## 第 15 条：不要过分依赖给字典添加条目时所用的顺序

在 Python 3.5 与之前的版本中，迭代字典（dict）时所看到的顺序好像是任意的，不一定与当初把这些键值对添加到字典时的顺序相同。

```py
# Python 3.5
baby_names = {
    'cat': 'kitten',
    'dog': 'puppy',
}

print(baby_names)

>>>
{'dog': 'puppy', 'cat': 'kitten'}
```

之所以出现这种效果，是因为字典类型以前是用哈希表算法来实现的（这个算法通过内置的 hash 函数与一个随机的种子数来运行，而该种子数会在每次启动 Python 解释器时确定）。所以，这样的机制导致这些键值对在字典中的存放顺序不一定会与添加时的顺序相同，而且每次运行程序的时候，存放顺序可能都不一样。

从 Python 3.6 开始，字典会保留这些键值对在添加时所用的顺序，而且 Python 3.7 版的语言规范正式确立了这条规则。于是，在新版的 Python 里，总是能够按照当初创建字典时的那套顺序来遍历这些键值对。

```py
baby_names = {
    'cat': 'kitten',
    'dog': 'puppy',
}

print(baby_names)

>>>
{'cat': 'kitten', 'dog': 'puppy'}
```

在 Python 3.5 与之前的版本中，dict 所提供的许多方法（包括 keys、values、items 与 popitem 等）都不保证固定的顺序，所以让人觉得好像是随机处理的。

```py
baby_names = {
    'cat': 'kitten',
    'dog': 'puppy',
}

# Python 3.5
print(list(baby_names.keys()))
print(list(baby_names.values()))
print(list(baby_names.items()))
print(baby_names.popitem())  # Randomly chooses an item

>>>
['dog', 'cat']
['puppy', 'kitten']
[('dog', 'puppy'), ('cat', 'kitten')]
('dog', 'puppy')
```

在新版的 Python 中，这些方法已经可以按照当初添加键值对时的顺序来处理了。

```py
baby_names = {
    'cat': 'kitten',
    'dog': 'puppy',
}

print(list(baby_names.keys()))
print(list(baby_names.values()))
print(list(baby_names.items()))
print(baby_names.popitem())  # Randomly chooses an item

>>>
['cat', 'dog']
['kitten', 'puppy']
[('cat', 'kitten'), ('dog', 'puppy')]
('dog', 'puppy')
```

这项变化对 Python 中那些依赖字典类型及其实现细节的特性产生了很多影响。

函数的关键字参数（包括万能的 `**kwargs` 参数，参见第 23 条），以前是按照近乎随机的顺序出现的，这使函数调用操作变得很难调试。

```py
# Python 3.5
def my_func(**kwargs):
    for key, value in kwargs.items():
        print('%s = %s' % (key, value))


my_func(goose='gosling', kangaroo='joey')

>>>
kangaroo = joey
goose = gosling
```

现在，这些关键字参数总是能够保留调用函数时所指定的那套顺序。

```py
def my_func(**kwargs):
    for key, value in kwargs.items():
        print('%s = %s' % (key, value))


my_func(goose='gosling', kangaroo='joey')

>>>
goose = gosling
kangaroo = joey
```

另外，类也会利用字典来保存这个类的实例所具备的一些数据。在早前版本的 Python 中，对象（object）中的字段看上去好像是按随机顺序出现的。

```py
class MyClass:
    def __init__(self):
        self.alligator = 'hatchling'
        self.elephant = 'calf'


a = MyClass()
for key, value in a.__dict__.items():
    print('%s = %s' % (key, value))

>>>
# Python 3.5
elephant = calf
alligator = hatchling

# Python > 3.5
alligator = hatchling
elephant = calf
```

现在的 Python 语言规范已经要求，字典必须保留添加键值对时所依照的顺序。所以，我们可以利用这样的特征来实现一些功能，而且可以把它融入自己给类和函数所设计的 API 中。

> 其实，内置的 collections 模块早就提供了这种能够保留插入顺序的字典，叫作 OrderedDict。它的行为跟（Python 3.7 以来的）标准 dict 类型很像，但性能上有很大区别。如果要频繁插入或弹出键值对（例如要实现 least-recently-used 缓存），那么 OrderedDict 可能比标准的 Python dict 类型更合适（如何判断是否应该换用这种类型，请参见第 70 条）。

处理字典的时候，不能总是假设所有的字典都能保留键值对插入时的顺序。在 Python 中，我们很容易就能定义出特制的容器类型，并且让这些容器也像标准的 list 与 dict 等类型那样遵守相关的协议（参见第 43 条）。Python 不是静态类型的语言，大多数代码都以鸭子类型（duck typing）机制运作（也就是说，对象支持什么样的行为，就可以当成什么样的数据使用，而不用执着于它在类体系中的地位）。这种特性可能会产生意想不到的问题。

例如，现在要写一个程序，统计各种小动物的受欢迎程度。我们可以设定一个字典，把每种动物和它得到的票数关联起来。

```py
votes = {
    'otter': 1281,
    'polar bear': 587,
    'fox': 863,
}
```

现在定义一个函数来处理投票数据。用户可以把空的字典传给这个函数，这样的话，它就会把每个动物及其排名放到这个字典中。这种字典可以充当数据模型，给带有用户界面（UI）的元素提供数据。

```py
def populate_ranks(votes, ranks):
    names = list(votes.keys())
    names.sort(key=votes.get, reverse=True)
    for i, name in enumerate(names, 1):
        ranks[name] = i
```

我们还需要写一个函数来查出人气最高的动物。这个函数假定 populate_ranks 总是会按照升序向字典写入键值对，这样第一个出现在字典里的就应该是排名最靠前的动物。

```py
def get_winner(ranks):
    return next(iter(ranks))
```

下面来验证刚才设计的函数，看它们能不能实现想要的结果。

```py
votes = {
    'otter': 1281,
    'polar bear': 587,
    'fox': 863,
}


def populate_ranks(votes, ranks):
    names = list(votes.keys())
    names.sort(key=votes.get, reverse=True)
    for i, name in enumerate(names, 1):
        ranks[name] = i


def get_winner(ranks):
    return next(iter(ranks))


ranks = {}
populate_ranks(votes, ranks)
print(ranks)
winner = get_winner(ranks)
print(winner)

>>>
{'otter': 1, 'fox': 2, 'polar bear': 3}
otter
```

结果没有问题。但是，假设现在的需求变了，我们现在想要按照字母顺序在 UI 中显示，而不是像原来那样按照名次显示。为了实现这种效果，我们用内置的 collections.abc 模块定义这样一个类。这个类的功能和字典一样，而且会按照字母顺序迭代其中的内容。

```py
from collections.abc import MutableMapping


class SortedDict(MutableMapping):
    def __init__(self):
        self.data = {}

    def __getitem__(self, key):
        return self.data[key]

    def __setitem__(self, key, value):
        self.data[key] = value

    def __delitem__(self, key):
        del self.data[key]

    def __iter__(self):
        keys = list(self.data.keys())
        keys.sort()
        for key in keys:
            yield key

    def __len__(self):
        return len(self.data)


votes = {
    'otter': 1281,
    'polar bear': 587,
    'fox': 863,
}


def populate_ranks(votes, ranks):
    names = list(votes.keys())
    names.sort(key=votes.get, reverse=True)
    for i, name in enumerate(names, 1):
        ranks[name] = i


def get_winner(ranks):
    return next(iter(ranks))


sorted_ranks = SortedDict()
populate_ranks(votes, sorted_ranks)
print(sorted_ranks.data)
winner = get_winner(sorted_ranks)
print(winner)

>>>
{'otter': 1, 'fox': 2, 'polar bear': 3}
fox
```

没有得到预期的结果，为什么会这样呢？因为 `get_winner` 函数总是假设，迭代字典时的顺序应该跟 `populate_ranks` 函数当初向字典中插入数据时的顺序一样。但是这次，我们用的是 SortedDict 实例，而不是标准的 dict 实例，所以这项假设不成立。因此，函数返回的数据是按字母顺序排列时最先出现的那个数据，也就是 `'fox'`，有以下 3 种解决方案：

1. 重新实现 `get_winner` 函数，使它不再假设 ranks 字典总是能按照固定的顺序来迭代。这是最保险、最稳妥的一种方案。

   ```py
   def get_winner(ranks):
      for name, rank in ranks.items():
         if rank == 1:
               return name

   winner = get_winner(sorted_ranks)
   print(winner)

   >>>
   otter
   ```

2. 在函数开头先判断 ranks 是不是预期的那种标准字典（dict）。如果不是，就抛出异常。这个办法的运行性能要比刚才那种好。

   ```py
   def get_winner(ranks):
      if not isinstance(ranks, dict):
         raise TypeError('must provide a dict instance')
      return next(iter(ranks))

   get_winner(sorted_ranks)

   >>>
   Traceback ...
   TypeError: must provide a dict instance
   ```

3. 通过类型注解（type annotation）来保证传给 `get_winner` 函数的确实是个真正的 dict 实例，而不是那种行为跟标准字典类似的 MutableMapping（参见第 90 条）。下面就采用严格（strict）模式，针对含有注解的代码运行 mypy 工具。

   ```py
   from typing import Dict, MutableMapping

   def populate_ranks(votes: Dict[str, int],
                     ranks: Dict[str, int]) -> None:
      names = list(votes.keys())
      names.sort(key=votes.get, reverse=True)
      for i, name in enumerate(names, 1):
         ranks[name] = i

   def get_winner(ranks: Dict[str, int]) -> str:
      return next(iter(ranks))

   class SortedDict(MutableMapping[str, int]):
      def __init__(self):
         self.data = {}

      def __getitem__(self, key):
         return self.data[key]

      def __setitem__(self, key, value):
         self.data[key] = value

      def __delitem__(self, key):
         del self.data[key]

      def __iter__(self):
         keys = list(self.data.keys())
         keys.sort()
         for key in keys:
               yield key

      def __len__(self):
         return len(self.data)

   votes = {
      'otter': 1281,
      'polar bear': 587,
      'fox': 863,
   }

   sorted_ranks = SortedDict()
   populate_ranks(votes, sorted_ranks)
   print(sorted_ranks.data)
   winner = get_winner(sorted_ranks)
   print(winner)

   $ python3 -m mypy --strict test.py
   test.py:42: error: Argument 2 to "populate_ranks" has incompatible type "SortedDict"; expected "Dict[str, int]"
   test.py:44: error: Argument 1 to "get_winner" has incompatible type "SortedDict"; expected "Dict[str, int]"
   ```

   这样可以检查出类型不相符的问题，mypy 会标出错误的用法，指出函数要求的是 dict，但传入的却是 MutableMapping。这个方案既能保证静态类型准确，又不会影响程序的运行效率。

### 要点

1. 从 Python 3.7 版开始，我们就可以确信迭代标准的字典时所看到的顺序跟这些键值对插入字典时的顺序一致。
2. 在 Python 代码中，我们很容易就能定义跟标准的字典很像但本身并不是 dict 实例的对象。对于这种类型的对象，不能假设迭代时看到的顺序必定与插入时的顺序相同。
3. 如果不想把这种跟标准字典很相似的类型也当成标准字典来处理，那么可以考虑这样三种办法。

   1. 不要依赖插入时的顺序编写代码；
   2. 在程序运行时明确判断它是不是标准的字典；
   3. 给代码添加类型注解并做静态分析。

// TODO 编写高质量代码待完成
