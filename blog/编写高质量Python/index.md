---
title: 编写高质量Python
date: 2022-9-15 11:45:45
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

Python 的 unpacking 机制可以用在许多方面，例如构建列表（参见第 13 条）、给函数设计参数列表（参见第 22 条）、传递关键字参数（参见第 23 条）、接收多个返回值（参见第 19 条）等。

明智地使用 unpacking 机制，可以实现很多原来必须通过下标才能写出的功能，这让代码变得更加清晰，而且能充分发挥 Python 的优势。

### 总结

1. unpacking 是一种特殊的 Python 语法，只需要一行代码，就能把数据结构里面的多个值分别赋给相应的变量。
2. unpacking 在 Python 中应用广泛，凡是可迭代的对象都能拆分，无论它里面还有多少层迭代结构。
3. 尽量通过 unpacking 来拆解序列之中的数据，而不要通过下标访问，这样可以让代码更简洁、更清晰。

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

### 总结

1. 从 Python 3.7 版开始，我们就可以确信迭代标准的字典时所看到的顺序跟这些键值对插入字典时的顺序一致。
2. 在 Python 代码中，我们很容易就能定义跟标准的字典很像但本身并不是 dict 实例的对象。对于这种类型的对象，不能假设迭代时看到的顺序必定与插入时的顺序相同。
3. 如果不想把这种跟标准字典很相似的类型也当成标准字典来处理，那么可以考虑这样三种办法。

   1. 不要依赖插入时的顺序编写代码；
   2. 在程序运行时明确判断它是不是标准的字典；
   3. 给代码添加类型注解并做静态分析。

## 第 16 条：用 get 处理键不在字典中的情况，不要使用 in 与 KeyError

```py
counters = {
    'pumpernickel': 2,
    'sourdough': 1,
}

key = 'wheat'

if key not in counters:
    counters[key] = 0
counters[key] += 1

if key in counters:
    counters[key] += 1
else:
    counters[key] = 1

try:
    counters[key] += 1
except KeyError:
    counters[key] = 1
```

使用 get 来优化

```py
counters = {
    'pumpernickel': 2,
    'sourdough': 1,
}

key = 'wheat'

count = counters.get(key, 0)
counters[key] = count + 1
```

如果使用 setdefault 改写是有问题的，这会有一次访问、两次赋值操作

而且 setdefault 不管是否有这个键，都会执行默认值的分配，这会造成比较大的性能开销

```py
count = counters.setdefault(key, 0)
counters[key] = count + 1
```

缓解性能问题的话，可以用 get 方法加赋值表达式，也可以直接用 defaultdict

```py
names = votes.get(key)
if names is None:
    votes[key] = names = []
names.append(who)

# 或者使用赋值表达式
if (names := votes.get(key)) is None:
    votes[key] = names = []
names.append(who)
```

只有与键相关联的默认值构造起来开销很低且可以变化，而且不用担心异常问题（例如 list 实例）。在这种情况下可以使用 setdefault，然而一般也优先考虑使用 defaultdict 取代 dict

### 总结

1. 有四种办法可以处理键不在字典中的情况：in 表达式、KeyError 异常、get 方法与 setdefault 方法。
2. 如果跟键相关联的值是像计数器这样的基本类型，那么 get 方法就是最好的方案；如果是那种构造起来开销比较大，或是容易出异常的类型，那么可以把这个方法与赋值表达式结合起来使用。
3. 即使看上去最应该使用 setdefault 方案，也不一定要真的使用 setdefault 方案，而是可以考虑用 defaultdict 取代普通的 dict。

## 第 17 条：用 defaultdict 处理内部状态中缺失的元素，而不要用 setdefault

通过 setdefault 方案把新的城市添加到对应的集合里，这要比利用 get 方法与赋值表达式（Python3.8 的新特性）来实现的方案短很多。

```py
visits = {
    'Mexico': {'Tulum', 'Puerto Vallarta'},
    'Japan': {'Hakone'},
}

visits.setdefault('France', set()).add('Arles')  # Short
if (japan := visits.get('Japan')) is None:  # Long
    visits['Japan'] = japan = set()
japan.add('Kyoto')

print(visits)

>>>
{'Mexico': {'Tulum', 'Puerto Vallarta'}, 'Japan': {'Kyoto', 'Hakone'}, 'France': {'Arles'}}
```

如果程序所访问的这个字典需要由你自己明确地创建，那又该怎么写？

```py
class Visits:
    def __init__(self):
        self.data = {}

    def add(self, country, city):
        city_set = self.data.setdefault(country, set())
        city_set.add(city)


visits = Visits()
visits.add('Russia', 'Yekaterinburg')
visits.add('Tanzania', 'Zanzibar')
print(visits.data)

>>>
{'Russia': {'Yekaterinburg'}, 'Tanzania': {'Zanzibar'}}
```

以上代码有以下问题

1. 调用了名字很怪的 setdefault 方法，很难让人理解发生了什么
2. 每次调用 add 方法，都会构造新的 set 实例

改用 defaultdict 可以解决以上问题，它会在键缺失的情况下，自动添加这个键以及键所对应的默认值，每次发现键不存在时，该字典都会调用这个函数返回一份新的默认值

```py
from collections import defaultdict


class Visits:
    def __init__(self):
        self.data = defaultdict(set)

    def add(self, country, city):
        self.data[country].add(city)


visits = Visits()
visits.add('England', 'Bath')
visits.add('England', 'London')
print(visits.data)

>>>
defaultdict(<class 'set'>, {'England': {'Bath', 'London'}})
```

### 总结

1. 如果你管理的字典可能需要添加任意的键，那么应该考虑能否用内置的 collections 模块中的 defaultdict 实例来解决问题。
2. 如果这种键名比较随意的字典是别人传给你的，你无法把它创建成 defaultdict，那么应该考虑通过 get 方法访问其中的键值。然而，在个别情况下，也可以考虑改用 setdefault 方法，因为那样写更短。

## 第 18 条：学会利用 `__missing__` 构造依赖键的默认值

```py
pictures = {}
path = 'profile_1234.png'
if (handle := pictures.get(path)) is None:
    try:
        handle = open(path, 'a+b')
    except OSError:
        print(f'Failed to open path {path}')
        raise
    else:
        pictures[path] = handle

handle.seek(0)
image_data = handle.read()
```

如果改成 setdefault

```py
pictures = {}
path = 'profile_1234.png'
try:
    handle = pictures.setdefault(path, open(path, 'a+b'))
except OSError:
    print(f'Failed to open path {path}')
    raise
else:
    handle.seek(0)

image_data = handle.read()
```

然而使用 setdefault 实现会有以下问题

1. 即便图片的路径名已经在字典里了，程序也还是得调用内置的 open 函数创建文件句柄，于是导致这个程序要给已经创建过 handle 的那份文件再度创建 handle（两者可能相互冲突）
2. 如果 try 块抛出异常，那我们可能无法判断这个异常是 open 函数导致的，还是 setdefault 方法导致的，因为这两次调用全都写在了同一行代码里

理论上可以使用 defaultdict 优化，但是 defaultdict 的第二个函数不能传参

```py
from collections import defaultdict


def open_picture(profile_path):
    try:
        return open(profile_path, 'a+b')
    except OSError:
        print(f'Failed to open path {profile_path}')
        raise


path = 'profile_1234.png'
pictures = defaultdict(open_picture)
handle = pictures[path]
handle.seek(0)
image_data = handle.read()

>>>
Traceback ...
TypeError: open_picture() missing 1 required positional argument: 'profile_path'
```

可以通过继承 dict 类型并实现 `__missing__` 特殊方法来解决这个问题

```py
def open_picture(profile_path):
    try:
        return open(profile_path, 'a+b')
    except OSError:
        print(f'Failed to open path {profile_path}')
        raise


class Pictures(dict):
    def __missing__(self, key):
        value = open_picture(key)
        self[key] = value
        return value


path = 'profile_1234.png'
pictures = Pictures()
handle = pictures[path]
handle.seek(0)
image_data = handle.read()
```

### 总结

1. 如果创建默认值需要较大的开销，或者可能抛出异常，那就不适合用 dict 类型的 setdefault 方法实现。
2. 传给 defaultdict 的函数必须是不需要参数的函数，所以无法创建出需要依赖键名的默认值。
3. 如果要构造的默认值必须根据键名来确定，那么可以定义自己的 dict 子类并实现 `__missing__` 方法。

# 函数

## 第 19 条：不要把函数返回的多个数值拆分到三个以上的变量中

unpacking 机制允许 Python 函数返回一个以上的值（参见第 6 条）。

```js
def get_stats(numbers):
    minimum = min(numbers)
    maximum = max(numbers)
    return minimum, maximum


lengths = [63, 73, 72, 60, 67, 66, 71, 61, 72, 70]
minimum, maximum = get_stats(lengths)  # Two return values
print(f'Min: {minimum}, Max: {maximum}')

>>>
Min: 60, Max: 73
```

```js
first, second = 1, 2
assert first == 1
assert second == 2


def my_function():
    return 1, 2


first, second = my_function()
assert first == 1
assert second == 2
```

在返回多个值的时候，可以用带星号的表达式接收那些没有被普通变量捕获到的值（参见第 13 条）

```py
def get_avg_ratio(numbers):
    average = sum(numbers) / len(numbers)
    scaled = [x / average for x in numbers]
    scaled.sort(reverse=True)
    return scaled


lengths = [63, 73, 72, 60, 67, 66, 71, 61, 72, 70]
longest, *middle, shortest = get_avg_ratio(lengths)
print(f'Longest:  {longest:>4.0%}')
print(f'Shortest: {shortest:>4.0%}')

>>>
Longest:  108%
Shortest:  89%
```

```py
def get_stats(numbers):
    minimum = min(numbers)
    maximum = max(numbers)
    count = len(numbers)
    average = sum(numbers)/count
    sorted_numbers = sorted(numbers)
    middle = count // 2
    if count % 2 == 0:
        lower = sorted_numbers[middle - 1]
        upper = sorted_numbers[middle]
        median = (lower + upper)/2
    else:
        median = sorted_numbers[middle]
    return minimum, maximum, average, median, count


lengths = [63, 73, 72, 60, 67, 66, 71, 61, 72, 70]
minimum, maximum, average, median, count = get_stats(lengths)
print(f'Min: {minimum}, Max: {maximum}')
print(f'Average: {average}, Median: {median}, Count: {count}')

>>>
Min: 60, Max: 73
Average: 67.5, Median: 68.5, Count: 10
```

上面的写法有 2 个问题：

1. 函数返回的五个值都是数字，所以很容易就会搞错顺序
2. 调用函数并拆分返回值的那行代码会写得比较长

为避免这些问题，我们不应该把函数返回的多个值拆分到三个以上的变量里。一个三元组最多只拆成三个普通变量，或两个普通变量与一个万能变量（带星号的变量）。当然用于接收的变量个数也可以比这更少。假如要拆分的值确实很多，那最好还是定义一个轻便的类或 namedtuple（参见第 37 条），并让函数返回这样的实例。

### 总结

1. 函数可以把多个值合起来通过一个元组返回给调用者，以便利用 Python 的 unpacking 机制去拆分。
2. 对于函数返回的多个值，可以把普通变量没有捕获到的那些值全都捕获到一个带星号的变量里。
3. 把返回的值拆分到四个或四个以上的变量是很容易出错的，所以最好不要那么写，而是应该通过小类或 namedtuple 实例完成。

## 第 20 条：遇到意外状况时应该抛出异常，不要返回 None

编写工具函数（utility function）时，许多 Python 程序员都爱用 None 这个返回值来表示特殊情况。对于某些函数来说，这或许有几分道理。

例如，我们要编写一个辅助函数计算两数相除的结果。在除数是 0 的情况下，返回 None 似乎相当合理，因为这种除法的结果是没有意义的。

```py
def careful_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return None
```

调用这个函数时，可以按自己的方式处理这样的返回值。

```py
def careful_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return None


x, y = 1, 0
result = careful_divide(x, y)
if result is None:
    print('Invalid inputs')

>>>
Invalid inputs
```

如果传给 `careful_divide` 函数的被除数为 0，会怎么样呢？在这种情况下，只要除数不为 0，函数返回的结果就应该是 0。

问题是，这个函数的返回值有时可能会用在 if 条件语句里面，那时可能会根据值本身是否相当于 False 来做判断，而不像刚才那样明确判断这个值是否为 None（第 5 条也列举了类似的例子）。

```py
def careful_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return None


x, y = 0, 5
result = careful_divide(x, y)
if not result:
    print('Invalid inputs')  # This runs! But shouldn't

>>>
Invalid inputs
```

上面这种 if 语句，会把函数返回 0 时的情况，也当成函数返回 None 时那样来处理。这种写法经常出现在 Python 代码里，因此像 `careful_divide` 这样，用 None 来表示特殊状况的函数是很容易出错的。有两种办法可以减少这样的错误。

1. 利用二元组把计算结果分成两部分返回（与这种写法有关的基础知识，参见第 19 条）。元组的首个元素表示操作是否成功，第二个元素表示计算的实际值。

   ```py
   def careful_divide(a, b):
    try:
        return True, a / b
    except ZeroDivisionError:
        return False, None
   ```

   这样写，会促使调用函数者去拆分返回值，他可以先看看这次运算是否成功，然后再决定怎么处理运算结果。

   ```py
   success, result = careful_divide(x, y)
   if not success:
      print('Invalid inputs')
   ```

   但问题是，有些调用方总喜欢忽略返回元组的第一个部分（在 Python 代码里，习惯用下划线表示用不到的变量）。这样写成的代码，乍一看似乎没问题，但实际上还是无法区分返回 0 与返回 None 这两种情况。

   ```py
   _, result = careful_divide(x, y)
   if not result:
      print('Invalid inputs')
   ```

2. 不采用 None 表示特例，而是向调用方抛出异常（Exception），让他自己去处理。下面我们把执行除法时发生的 ZeroDivisionError 转化成 ValueError，告诉调用方输入的值不对（什么时候应该使用 Exception 类的子类，可参见第 87 条）。

   ```py
   def careful_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        raise ValueError('Invalid inputs')
   ```

   现在，调用方拿到函数的返回值之后，不用先判断操作是否成功了。因为这次可以假设，只要能拿到返回值，就说明函数肯定顺利执行完了，所以只需要用 try 把函数包起来并在 else 块里处理运算结果就好（这种结构的详细用法，参见第 65 条）。

   ```py
   def careful_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        raise ValueError('Invalid inputs')

   x, y = 5, 2
   try:
      result = careful_divide(x, y)
   except ValueError:
      print('Invalid inputs')
   else:
      print('Result is %.1f' % result)

   >>>
   Result is 2.5
   ```

这个办法也可以扩展到那些使用类型注解的代码中（参见第 90 条），我们可以把函数的返回值指定为 float 类型，这样它就不可能返回 None 了。然而，Python 采用的是动态类型与静态类型相搭配的 gradual 类型系统，我们不能在函数的接口上指定函数可能抛出哪些异常（有的编程语言支持这样的受检异常（checked exception），调用方必须应对这些异常）。所以，我们只好把有可能抛出的异常写在文档里面，并希望调用方能够根据这份文档适当地捕获相关的异常（参见第 84 条）。

下面我们给刚才那个函数加类型注解，并为它编写 docstring。

```py
def careful_divide(a: float, b: float) -> float:
    """Divides a by b.

    Raises:
      ValueError: When the inputs cannot be divided.
    """
    try:
        return a / b
    except ZeroDivisionError as e:
        raise ValueError('Invalid inputs')
```

这样写，输入、输出与异常都显得很清晰，所以调用方出错的概率就变得很小了。

### 总结

1. 用返回值 None 表示特殊情况是很容易出错的，因为这样的值在条件表达式里面，没办法与 0 和空白字符串之类的值区分，这些值都相当于 False。
2. 用异常表示特殊的情况，而不要返回 None。让调用这个函数的程序根据文档里写的异常情况做出处理。
3. 通过类型注解可以明确禁止函数返回 None，即便在特殊情况下，它也不能返回这个值。

## 第 21 条：了解如何在闭包里面使用外围作用域中的变量

有时，我们要给列表中的元素排序，而且要优先把某个群组之中的元素放在其他元素的前面。例如，渲染用户界面时，可能就需要这样做，因为关键的消息和特殊的事件应该优先显示在其他信息之前。

实现这种做法的一种常见方案，是把辅助函数通过 key 参数传给列表的 sort 方法（参见第 14 条），让这个方法根据辅助函数所返回的值来决定元素在列表中的先后顺序。辅助函数先判断当前元素是否处在重要群组里，如果在，就把返回值的第一项写成 0，让它能够排在不属于这个组的那些元素之前。

```py
def sort_priority(values, group):
    def helper(x):
        if x in group:
            return (0, x)
        return (1, x)
    values.sort(key=helper)
```

这个函数可以处理比较简单的输入数据。

```py
def sort_priority(values, group):
    def helper(x):
        if x in group:
            return (0, x)
        return (1, x)
    values.sort(key=helper)


numbers = [8, 3, 1, 2, 5, 4, 7, 6]
group = {2, 3, 5, 7}
sort_priority(numbers, group)
print(numbers)

>>>
[2, 3, 5, 7, 1, 4, 6, 8]
```

它为什么能够实现这个功能呢？这要分三个原因来讲：

1. Python 支持闭包（closure），这让定义在大函数里面的小函数也能引用大函数之中的变量。具体到这个例子，`sort_priority` 函数里面的那个 helper 函数也能够引用前者的 group 参数。
2. 函数在 Python 里是头等对象（first-class object），所以你可以像操作其他对象那样，直接引用它们、把它们赋给变量、将它们当成参数传给其他函数，或是在 in 表达式与 if 语句里面对它做比较，等等。闭包函数也是函数，所以，同样可以传给 sort 方法的 key 参数。
3. Python 在判断两个序列（包括元组）的大小时，有自己的一套规则。它首先比较 0 号位置的那两个元素，如果相等，那就比较 1 号位置的那两个元素；如果还相等，那就比较 2 号位置的那两个元素；依此类推，直到得出结论为止。所以，我们可以利用这套规则让 helper 这个闭包函数返回一个元组，并把关键指标写为元组的首个元素以表示当前排序的值是否属于重要群组（0 表示属于，1 表示不属于）。

如果这个 `sort_priority` 函数还能告诉我们，列表里面有没有位于重要群组之中的元素，那就更好了，因为这样可以让用户界面开发者更方便地做出相应处理。添加这样一个功能似乎相当简单，因为闭包函数本身就需要判断当前值是否处在重要群组之中，既然这样，那么不妨让它在发现这种值时，顺便把标志变量翻转过来。最后，让闭包外的大函数（即 `sort_priority` 函数）返回这个标志变量，如果闭包函数当时遇到过这样的值，那么这个标志肯定是 True。

下面，试着用最直接的写法来实现。

```py
def sort_priority2(numbers, group):
    found = False

    def helper(x):
        if x in group:
            found = True  # Seems simple
            return (0, x)
        return (1, x)
    numbers.sort(key=helper)
    return found


numbers = [8, 3, 1, 2, 5, 4, 7, 6]
group = {2, 3, 5, 7}
found = sort_priority2(numbers, group)
print('Found:', found)
print(numbers)

>>>
Found: False
[2, 3, 5, 7, 1, 4, 6, 8]
```

排序结果没有问题，可以看到：在排过序的 numbers 里面，重要群组 group 里的那些元素（2、3、5、7），确实出现在了其他元素前面。既然这样，那表示函数返回值的 found 变量就应该是 True，但我们看到的却是 False，这是为什么？

在表达式中引用某个变量时，Python 解释器会按照下面的顺序，在各个作用域（scope）里面查找这个变量，以解析（resolve）这次引用

1. 当前函数的作用域。
2. 外围作用域（例如包含当前函数的其他函数所对应的作用域）。
3. 包含当前代码的那个模块所对应的作用域（也叫全局作用域，global scope）。
4. 内置作用域（built-in scope，也就是包含 len 与 str 等函数的那个作用域）。

如果这些作用域中都没有定义名称相符的变量，那么程序就抛出 NameError 异常。

```py
foo = does_not_exist * 5

>>>
Traceback...
NameError: name 'does_not_exist' is not defined
```

刚才讲的是怎么引用变量，现在我们来讲怎么给变量赋值，这要分两种情况处理。

1. 如果变量已经定义在当前作用域中，那么直接把新值交给它就行了。
2. 如果当前作用域中不存在这个变量，那么即便外围作用域里有同名的变量，Python 也还是会把这次的赋值操作当成变量的定义来处理

这会产生一个重要的效果，也就是说，Python 会把包含赋值操作的这个函数当成新定义的这个变量的作用域。

这可以解释刚才那种写法错在何处。`sort_priority2` 函数里面的 helper 闭包函数是把 True 赋给了 found 变量。当前作用域里没有这样一个叫作 found 的变量，所以就算外围的 `sort_priority2` 函数里面有 found 变量，系统也还是会把这次赋值当成定义，也就是会在 helper 里面定义一个新的 found 变量，而不是把它当成给 `sort_priority2` 已有的那个 found 变量赋值。

这种问题有时也称作作用域 bug（scoping bug），Python 新手可能认为这样的赋值规则很奇怪，但实际上 Python 是故意这么设计的。因为这样可以防止函数中的局部变量污染外围模块。假如不这样做，那么函数里的每条赋值语句都有可能影响全局作用域的变量，这样不仅混乱，而且会让全局变量之间彼此交互影响，从而导致很多难以探查的 bug。

Python 有一种特殊的写法，可以把闭包里面的数据赋给闭包外面的变量。用 nonlocal 语句描述变量，就可以让系统在处理针对这个变量的赋值操作时，去外围作用域查找。然而，nonlocal 有个限制，就是不能侵入模块级别的作用域（以防污染全局作用域）。

下面，用 nonlocal 改写刚才那个函数。

```py{5}
def sort_priority2(numbers, group):
    found = False

    def helper(x):
        nonlocal found
        if x in group:
            found = True  # Seems simple
            return (0, x)
        return (1, x)
    numbers.sort(key=helper)
    return found


numbers = [8, 3, 1, 2, 5, 4, 7, 6]
group = {2, 3, 5, 7}
found = sort_priority2(numbers, group)
print('Found:', found)
print(numbers)

>>>
Found: True
[2, 3, 5, 7, 1, 4, 6, 8]
```

nonlocal 语句清楚地表明，我们要把数据赋给闭包之外的变量。有一种跟它互补的语句，叫作 global，用这种语句描述某个变量后，在给这个变量赋值时，系统会直接把它放到模块作用域（或者说全局作用域）中。

我们都知道全局变量不应该滥用，其实 nonlocal 也这样。除比较简单的函数外，大家尽量不要用这个语句，因为它造成的副作用有时很难发现。尤其是在那种比较长的函数里，nonlocal 语句与其关联变量的赋值操作之间可能隔得很远。

如果 nonlocal 的用法比较复杂，那最好是改用辅助类来封装状态。下面就定义了这样一个类，用来实现与刚才那种写法相同的效果。这样虽然稍微长一点，但看起来更清晰易读（`__call__` 这个特殊方法，请参见第 38 条）。

```py
class Sorter:
    def __init__(self, group):
        self.group = group
        self.found = False

    def __call__(self, x):
        if x in self.group:
            self.found = True
            return (0, x)
        return (1, x)


numbers = [8, 3, 1, 2, 5, 4, 7, 6]
group = {2, 3, 5, 7}
sorter = Sorter(group)
numbers.sort(key=sorter)
assert sorter.found is True
```

### 总结

1. 闭包函数可以引用定义它们的那个外围作用域之中的变量。
2. 按照默认的写法，在闭包里面给变量赋值并不会改变外围作用域中的同名变量。
3. 先用 nonlocal 语句说明，然后赋值，可以修改外围作用域中的变量。
4. 除特别简单的函数外，尽量少用 nonlocal 语句。

## 第 22 条：用数量可变的位置参数给函数设计清晰的参数列表

让函数接受数量可变的位置参数（positional argument），可以把函数设计得更加清晰（这些位置参数通常简称 var args，或者叫作 star args，因为我们习惯用 `*args` 指代）。例如，假设我们要记录调试信息。如果采用参数数量固定的方案来设计，那么函数应该接受一个表示信息的 message 参数和一个 values 列表（这个列表用于存放需要填充到信息里的那些值）。

```py
def log(message, values):
    if not values:
        print(message)
    else:
        values_str = ', '.join(str(x) for x in values)
        print(f'{message}: {values_str}')


log('My numbers are', [1, 2])
log('Hi there', [])

>>>
My numbers are: 1, 2
Hi there
```

即便没有值需要填充到信息里面，也必须专门传一个空白的列表进去，这样显得多余，而且让代码看起来比较乱。最好是能允许调用者把第二个参数留空。在 Python 里，可以给最后一个位置参数加前缀 \*，这样调用者就只需要提供不带星号的那些参数，然后可以不再指其他参数，也可以继续指定任意数量的位置参数。函数的主体代码不用改，只修改调用代码即可。

```py
def log(message, *values):  # The only difference
    if not values:
        print(message)
    else:
        values_str = ', '.join(str(x) for x in values)
        print(f'{message}: {values_str}')


log('My numbers are', 1, 2)
log('Hi there')  # Much better

>>>
My numbers are: 1, 2
Hi there
```

这种写法与拆解数据时用在赋值语句左边带星号的 unpacking 操作非常类似（参见第 13 条）。

如果想把已有序列（例如某列表）里面的元素当成参数传给像 log 这样的参数个数可变的函数（variadic function），那么可以在传递序列的时采用 \* 操作符。这会让 Python 把序列中的元素都当成位置参数传给这个函数。

```py
favorites = [7, 33, 99]
log('Favorite colors', *favorites)

>>>
Favorite colors: 7, 33, 99
```

令函数接受数量可变的位置参数，可能导致两个问题。

1. 程序总是必须先把这些参数转化成一个元组，然后才能把它们当成可选的位置参数传给函数。这意味着，如果调用函数时，把带 \* 操作符的生成器传了过去，那么程序必须先把这个生成器里的所有元素迭代完（以便形成元组），然后才能继续往下执行（相关知识，参见第 30 条）。这个元组包含生成器所给出的每个值，这可能耗费大量内存，甚至会让程序崩溃。

   ```py
   def my_generator():
    for i in range(10):
        yield i

   def my_func(*args):
      print(args)

   it = my_generator()
   my_func(*it)

   >>>
   (0, 1, 2, 3, 4, 5, 6, 7, 8, 9)
   ```

   接受 `*args` 参数的函数，适合处理输入值不太多，而且数量可以提前预估的情况。在调用这种函数时，传给 `*args` 这一部分的应该是许多个字面值或变量名才对。这种机制，主要是为了让代码写起来更方便、读起来更清晰。

2. 如果用了 `*args` 之后，又要给函数添加新的位置参数，那么原有的调用操作就需要全都更新。例如给参数列表开头添加新的位置参数 sequence，那么没有据此更新的那些调用代码就会出错。

   ```py
   def log(sequence, message, *values):
    if not values:
        print(f'{sequence} - {message}')
    else:
        values_str = ', '.join(str(x) for x in values)
        print(f'{sequence} - {message}: {values_str}')

   log(1, 'Favorites', 7, 33)  # New with *args OK
   log(1, 'Hi there')  # New message only OK
   log('Favorite numbers', 7, 33)  # old usage breaks

   >>>
   1 - Favorites: 7, 33
   1 - Hi there
   Favorite numbers - 7: 33
   ```

   问题在于：第三次调用 log 函数的那个地方并没有根据新的参数列表传入 sequence 参数，所以 Favorite numbers 就成了 sequence 参数，7 就成了 message 参数。这样的 bug 很难排查，因为程序不会抛出异常，只会采用错误的数据继续运行下去。为了彻底避免这种漏洞，在给这种 `*arg` 函数添加参数时，应该使用只能通过关键字来指定的参数（keyword-only argument，参见第 25 条）。要是想做得更稳妥一些，可以考虑添加类型注解（参见第 90 条）。

### 总结

1. 用 def 定义函数时，可以通过 `*args` 的写法让函数接受数量可变的位置参数。
2. 调用函数时，可以在序列左边加上 `*` 操作符，把其中的元素当成位置参数传给 `*args` 所表示的这一部分。
3. 如果 `*` 操作符加在生成器前，那么传递参数时，程序有可能因为耗尽内存而崩溃。
4. 给接受 `*args` 的函数添加新位置参数，可能导致难以排查的 bug。

## 第 23 条：用关键字参数来表示可选的行为

与大多数其他编程语言一样，Python 允许在调用函数时，按照位置传递参数

```py
def remainder(number, divisor):
    return number % divisor


assert remainder(20, 7) == 6
```

Python 函数里面的所有普通参数，除了按位置传递外，还可以按关键字传递。调用函数时，在调用括号内可以把关键字的名称写在 = 左边，把参数值写在右边。这种写法不在乎参数的顺序，只要把必须指定的所有位置参数全都传过去即可。另外，关键字形式与位置形式也可以混用。下面这四种写法的效果相同：

```py
remainder(20, 7)
remainder(20, divisor=7)
remainder(number=20, divisor=7)
remainder(divisor=7, number=20)
```

如果混用，那么位置参数必须出现在关键字参数之前，否则就会出错。

```py
remainder(number=20, 7)

>>>
Traceback ...
SyntaxError: positional argument follows keyword argument
```

每个参数只能指定一次，不能既通过位置形式指定，又通过关键字形式指定。

```py
remainder(20, number=7)

>>>
Traceback ...
TypeError: remainder() got multiple values for argument number
```

如果有一份字典，而且字典里面的内容能够用来调用 remainder 这样的函数，那么可以把 `**` 运算符加在字典前面，这会让 Python 把字典里面的键值以关键字参数的形式传给函数。

```py
my_kwargs = {
    'number': 20,
    'divisor': 7,
}
assert remainder(**my_kwargs) == 6
```

调用函数时，带 `**` 操作符的参数可以和位置参数或关键字参数混用，只要不重复指定就行。

```py
my_kwargs = {
    'divisor': 7,
}
assert remainder(number=20, **my_kwargs) == 6
```

也可以对多个字典分别施加 `**` 操作，只要这些字典所提供的参数不重叠就好。

```py
my_kwargs = {
    'number': 20,
}
other_kwargs = {
    'divisor': 7,
}
assert remainder(**my_kwargs, **other_kwargs) == 6
```

定义函数时，如果想让这个函数接受任意数量的关键字参数，那么可以在参数列表里写上万能形参 `**kwargs`，它会把调用者传进来的参数收集合到一个字典里面稍后处理（第 26 条讲了一种特别适合这么做的情况）。

```py
def print_parameters(**kwargs):
    for key, value in kwargs.items():
        print(f'{key} = {value}')


print_parameters(alpha=1.5, beta=9, gamma=4)

>>>
alpha = 1.5
beta = 9
gamma = 4
```

关键字参数的灵活用法可以带来三个好处。

1. 用关键字参数调用函数可以让初次阅读代码的人更容易看懂。例如，读到 remainder(20, 7) 这样的调用代码，就不太容易看出谁是被除数 number，谁是除数 divisor，只有去查看 remainder 的具体实现方法才能明白。但如果改用关键字形式来调用，例如 remainder(number=20, divisor=7)，那么每个参数的含义就相当明了。

2. 它可以带有默认值，该值是在定义函数时指定的。在大多数情况下，调用者只需要沿用这个值就好，但有时也可以明确指定自己想要传的值。这样能够减少重复代码，让程序看上去干净一些。

   例如，我们要计算液体流入容器的速率。如果这个容器带刻度，那么可以取前后两个时间点的刻度差（`weight_diff`），并把它跟这两个时间点的时间差（`time_diff`）相除，就可以算出流速了。

   ```py
   def flow_rate(weight_diff, time_diff):
    return weight_diff / time_diff

   weight_diff = 0.5
   time_diff = 3
   flow = flow_rate(weight_diff, time_diff)
   print(f'{flow:.3} kg per second')
   ```

   一般来说，我们会用每秒的千克数表示流速。但有的时候，我们还想估算更长的时间段（例如几小时或几天）内的流速结果。只需给同一个函数加一个 period 参数来表示那个时间段相当于多少秒即可。

   ```py
   def flow_rate(weight_diff, time_diff, period):
       return (weight_diff / time_diff) * period
   ```

   这样写有个问题，就是每次调用函数时，都得明确指定 period 参数。即便我们想计算每秒钟的流速，也还是得明确指定 period 为 1。

   ```py
   flow_per_second = flow_rate(weight_diff, time_diff, 1)
   ```

   为了简化这种用法，我们可以给 period 参数设定默认值。

   ```py
   def flow_rate(weight_diff, time_diff, period=1):
       return (weight_diff / time_diff) * period

   flow_per_second = flow_rate(weight_diff, time_diff)
   flow_per_hour = flow_rate(weight_diff, time_diff, 3600)
   ```

   这个办法适用于默认值比较简单的情况。如果默认值本身要根据比较复杂的逻辑来确定（可参考第 24 条），那就得仔细考虑一下了。

3. 我们可以很灵活地扩充函数的参数，而不用担心会影响原有的函数调用代码。这样的话，我们就可以通过这些新参数在函数里面实现许多新的功能，同时又无须修改早前写好的调用代码，这也让程序不容易因此出现 bug。

   例如，我们想继续扩充上述 `flow_rate` 函数的功能，让它可以用千克之外的其他重量单位来计算流速。那只需要再添加一个可选参数，用来表示 1 千克相当于多少个那样的单位即可。

   ```py
   def flow_rate(weight_diff, time_diff, period=1, units_per_kg=1):
      return ((weight_diff * units_per_kg) / time_diff) * period
   ```

   新参数 `units_per_kg` 的默认值为 1，这表示默认情况下，依然以千克为重量单位来计算。于是，以前写好的那些调用代码就不用修改了。以后调用 `flow_rate` 时，可以通过关键字形式给这个参数指定值，以表示他们想用的那种单位（例如磅，1 千克约等于 2.2 磅）。

   ```py
   pounds_per_hour = flow_rate(weight_diff, time_diff,
                            period=3600, units_per_kg=2.2)
   ```

   可选的关键字参数有助于维护向后兼容（backward compatibility）。这是个相当重要的问题，对于接受带 `*args` 参数的函数，也要注意向后兼容（参见第 22 条）。

   像 period 和 `units_per_kg` 这样可选的关键字参数，只有一个缺点，就是调用者仍然能够按照位置来指定。

   ```py
   pounds_per_hour = flow_rate(weight_diff, time_diff, 3600, 2.2)
   ```

   通过位置来指定可选参数，可能会让读代码的人有点儿糊涂，因为他不太清楚 3600 和 2.2 这两个值分别指哪个量的缩放系数。所以，最好是能以关键字的形式给这些参数传值，而不要按位置去传。从设计函数的角度来说，还可以考虑用更加明确的方案以降低出错概率（参见第 25 条）。

### 总结

1. 函数的参数可以按位置指定，也可以用关键字的形式指定。
2. 关键字可以让每个参数的作用更加明了，因为在调用函数时只按位置指定参数，可能导致这些参数的含义不够明确。
3. 应该通过带默认值的关键字参数来扩展函数的行为，因为这不会影响原有的函数调用代码。
4. 可选的关键字参数总是应该通过参数名来传递，而不应按位置传递。

## 第 24 条：用 None 和 docstring 来描述默认值会变的参数

有时，我们想把那种不能够提前固定的值，当作关键字参数的默认值。例如，记录日志消息时，默认的时间应该是触发事件的那一刻。所以，如果调用者没有明确指定时间，那么就默认把调用函数的那一刻当成这条日志的记录时间。现在试试下面这种写法，假定它能让 when 参数的默认值随着这个函数每次的执行时间而发生变化。

```py
from time import sleep
from datetime import datetime


def log(message, when=datetime.now()):
    print(f'{when}: {message}')


log('Hi there!')
sleep(0.1)
log('Hello again!')

>>>
2022-09-16 11:39:58.577119: Hi there!
2022-09-16 11:39:58.577119: Hello again!
```

这样写不行。因为 datetime.now 只执行了一次，所以每条日志的时间戳（timestamp）相同。参数的默认值只会在系统加载这个模块的时候，计算一遍，而不会在每次执行时都重新计算，这通常意味着这些默认值在程序启动后，就已经定下来了。只要包含这段代码的那个模块已经加载进来，那么 when 参数的默认值就是加载时计算的那个 datetime.now()，系统不会重新计算。

要想在 Python 里实现这种效果，惯用的办法是把参数的默认值设为 None，同时在 docstring 文档里面写清楚，这个参数为 None 时，函数会怎么运作（参见第 84 条）。给函数写实现代码时，要判断该参数是不是 None，如果是，就把它改成相应的默认值。

```py
from time import sleep
from datetime import datetime


def log(message, when=None):
    """Log a message with a timestamp.

    Args:
        message: Message to print.
        when: datetime of when the message occurred.
            Defaults to the present time.
    """
    if when is None:
        when = datetime.now()
    print(f'{when}: {message}')


log('Hi there!')
sleep(0.1)
log('Hello again!')

>>>
2022-09-16 11:52:02.810552: Hi there!
2022-09-16 11:52:02.910765: Hello again!
```

把参数的默认值写成 None 还有个重要的意义，就是用来表示那种以后可能由调用者修改内容的默认值（例如某个可变的容器）。例如，我们要写一个函数对采用 JSON 格式编码的数据做解码。如果无法解码，那么就返回调用时所指定的默认结果，假如调用者当时没有明确指定，那就返回空白的字典。

```py
import json


def decode(data, default={}):
    try:
        return json.loads(data)
    except ValueError:
        return default
```

这样的写法与前面 datetime.now 的例子有着同样的问题。系统只会计算一次 default 参数（在加载这个模块的时候），所以每次调用这个函数时，给调用者返回的都是一开始分配的那个字典，这就相当于凡是以默认值调用这个函数的代码都共用同一份字典。这会使程序出现很奇怪的效果。

```py
import json


def decode(data, default={}):
    try:
        return json.loads(data)
    except ValueError:
        return default


foo = decode('bad data')
foo['stuff'] = 5
bar = decode('also bad')
bar['meep'] = 1
print('Foo:', foo)
print('Bar:', bar)

>>>
Foo: {'stuff': 5, 'meep': 1}
Bar: {'stuff': 5, 'meep': 1}
```

我们本意是想让这两次调用操作得到两个不同的空白字典，每个字典都可以分别用来存放不同的键值。但实际上，只要修改其中一个字典，另一个字典的内容就会受到影响。这种错误的根源在于，foo 和 bar 实际上是同一个字典，都等于系统一开始给 default 参数确定默认值时所分配的那个字典。它们表示的是同一个字典对象。

要解决这个问题，可以把默认值设成 None，并且在 docstring 文档里面说明，函数在这个值为 None 时会怎么做。

```py
import json


def decode(data, default=None):
    """Load JSON data from a string.

    Args:
        data: JSON data to decode.
        default: Value to return if decoding fails.
            Defaults to an empty dictionary.
    """
    try:
        return json.loads(data)
    except ValueError:
        if default is None:
            default = {}
        return default


foo = decode('bad data')
foo['stuff'] = 5
bar = decode('also bad')
bar['meep'] = 1
print('Foo:', foo)
print('Bar:', bar)
assert foo is not bar

>>>
Foo: {'stuff': 5}
Bar: {'meep': 1}
```

这个思路可以跟类型注解搭配起来（参见第 90 条）。下面这种写法把 when 参数标注成可选（Optional）值，并限定其类型为 datetime。于是，它的取值就只有两种可能，要么是 None，要么是 datetime 对象。

```py
from typing import Optional


def log_typed(message: str, when: Optional[datetime] = None) -> None:
    """Log a message with a timestamp.

        Args:
            message: Message to print.
            when: datetime of when the message occurred.
                Defaults to the present time.
    """
    if when is None:
        when = datetime.now()
    print(f'{when}: {message}')
```

### 总结

1. 参数的默认值只会计算一次，也就是在系统把定义函数的那个模块加载进来的时候。所以，如果默认值将来可能由调用方修改（例如{}、[]）或者要随着调用时的情况变化（例如 datetime.now()），那么程序就会出现奇怪的效果。
2. 如果关键字参数的默认值属于这种会发生变化的值，那就应该写成 None，并且要在 docstring 里面描述函数此时的默认行为。
3. 默认值为 None 的关键字参数，也可以添加类型注解。

## 第 25 条：用只能以关键字指定和只能按位置传入的参数来设计清晰的参数列表

按关键字传递参数是 Python 函数的一项强大特性（参见第 23 条）。这种关键字参数特别灵活，在很多情况下，都能让我们写出一看就懂的函数代码。例如，计算两数相除的结果时，可能需要仔细考虑各种特殊情况。

例如，在除数为 0 的情况下，是抛出 ZeroDivisionError 异常，还是返回无穷（infinity）；在结果溢出的情况下，是抛出 OverflowError 异常，还是返回 0。

```py
def safe_division(number, divisor,
                  ignore_overflow,
                  ignore_zero_division):
    try:
        return number / divisor
    except OverflowError:
        if ignore_overflow:
            return 0
        else:
            raise
    except ZeroDivisionError:
        if ignore_zero_division:
            return float('inf')
        else:
            raise
```

这个函数用起来很直观。如果想在结果溢出的情况下，让它返回 0，那么可以像下面这样调用函数。

```py
result = safe_division(1.0, 10**500, True, False)
print(result)

>>>
0
```

如果想在除数是 0 的情况下，让函数返回无穷，那么就按下面这样来写。

```py
result = safe_division(1.0, 0, False, True)
print(result)

>>>
inf
```

表示要不要忽略异常的那两个参数都是 Boolean 值，所以容易弄错位置，这会让程序出现难以查找的 bug。要想让代码看起来更清晰，一种办法是给这两个参数都指定默认值。按照默认值，该函数只要遇到特殊情况，就会抛出异常。

调用者可以用关键字参数指定覆盖其中某个参数的默认值，以调整函数在遇到那种特殊情况时的处理方式，同时让另一个参数依然取那个参数自己的默认值。

```py{2-3}
def safe_division_b(number, divisor,
                    ignore_overflow=False,
                    ignore_zero_division=False):
    try:
        return number / divisor
    except OverflowError:
        if ignore_overflow:
            return 0
        else:
            raise
    except ZeroDivisionError:
        if ignore_zero_division:
            return float('inf')
        else:
            raise


result = safe_division_b(1.0, 10**500, ignore_overflow=True)
print(result)
result = safe_division_b(1.0, 0, ignore_zero_division=True)
print(result)

>>>
0
inf
```

然而，由于这些关键参数是可选的，我们没办法要求调用者必须按照关键字形式来指定这两个参数。他们还是可以用传统的写法，按位置给这个新定义的 `safe_division_b` 函数传递参数。

```py
assert safe_division_b(1.0, 10**500, True, False) == 0
```

对于这种参数比较复杂的函数，我们可以声明只能通过关键字指定的参数（keyword-only argument），这样的话，写出来的代码就能清楚地反映调用者的想法了。这种参数只能用关键字来指定，不能按位置传递。

下面就重新定义 `safe_division` 函数，让它接受这样的参数。参数列表里的 `*` 符号把参数分成两组，左边是位置参数，右边是只能用关键字指定的参数。

```py{1}
def safe_division_c(number, divisor, *,
                    ignore_overflow=False,
                    ignore_zero_division=False):
    try:
        return number / divisor
    except OverflowError:
        if ignore_overflow:
            return 0
        else:
            raise
    except ZeroDivisionError:
        if ignore_zero_division:
            return float('inf')
        else:
            raise


assert safe_division_c(1.0, 10**500, True, False) == 0

>>>
Traceback ...
TypeError: safe_division_c() takes 2 positional arguments but 4 were given
```

当然我们还是可以像前面那样，用关键字参数指定覆盖其中一个参数的默认值（即忽略其中一种特殊情况，并让函数在遇到另一种特殊情况时抛出异常）。

```py
result = safe_division_c(1.0, 0, ignore_zero_division=True)
assert result == float('inf')
try:
    result = safe_division_c(1.0, 0)
except ZeroDivisionError:
    pass  # Expected
```

这样改依然有问题，因为在 `safe_division_c` 版本的函数里面，有两个参数（也就是 number 和 divisor）必须由调用者提供。然而，调用者在提供这两个参数时，既可以按位置提供，也可以按关键字提供，还可以把这两种方式混起来用。

```py
assert safe_division_c(number=2, divisor=5) == 0.4
assert safe_division_c(divisor=5, number=2) == 0.4
assert safe_division_c(2, divisor=5) == 0.4
```

在未来也许因为扩展函数的需要，甚至是因为代码风格的变化，或许要修改这两个参数的名字。

```py{1}
def safe_division_c(numerator, denominator, *,
                    ignore_overflow=False,
                    ignore_zero_division=False):
```

这看起来只是文字上面的微调，但之前所有通过关键字形式来指定这两个参数的调用代码，都会出错。

其实最重要的问题在于，我们根本就没打算把 number 和 divisor 这两个名称纳入函数的接口；我们只是在编写函数的实现代码时，随意挑了这两个比较顺口的名称而已。也并不期望调用者也非得采用这种称呼来指定这两个参数。

Python 3.8 引入了一项新特性，可以解决这个问题，这就是只能按位置传递的参数（positional-only argument）。这种参数与刚才的只能通过关键字指定的参数（keyword-only argument）相反，它们必须按位置指定，绝不能通过关键字形式指定。下面来重新定义 `safe_division` 函数，使其前两个必须由调用者提供的参数只能按位置来提供。参数列表中的 `/` 符号，表示它左边的那些参数只能按位置指定。

```py{1}
def safe_division_d(numerator, denominator, /, *,
                    ignore_overflow=False,
                    ignore_zero_division=False):
    try:
        return numerator / denominator
    except OverflowError:
        if ignore_overflow:
            return 0
        else:
            raise
    except ZeroDivisionError:
        if ignore_zero_division:
            return float('inf')
        else:
            raise


assert safe_division_d(2, 5) == 0.4 # 正常运行
assert safe_division_d(numerator=2, denominator=5) == 0.4 # 报错
```

现在我们可以确信：给 `safe_division_d` 函数的前两个参数（也就是那两个必备的参数）所挑选的名称，已经与调用者的代码解耦了。即便以后再次修改这两个参数的名称，也不会影响已经写好的调用代码。

在函数的参数列表之中，`/` 符号左侧的参数是只能按位置指定的参数，`*` 符号右侧的参数则是只能按关键字形式指定的参数。那么，这两个符号如果同时出现在参数列表中，会有什么效果呢？这是个值得注意的问题。这意味着，这两个符号之间的参数，既可以按位置提供，又可以用关键字形式指定（其实，如果不特别说明 Python 函数的参数全都属于这种参数）。在设计 API 时，为了体现某编程风格或者实现某些需求，可能会允许某些参数既可以按位置传递，也可以用关键字形式指定，这样可以让代码简单易读。例如，给下面这个 `safe_division` 函数的参数列表添加一个可选的 ndigits 参数，允许调用者指定这次除法应该精确到小数点后第几位。

下面我们用三种方式来调用这个 `safe_division_e` 函数。ndigits 是个带默认值的普通参数，因此，它既可以按位置传递，也可以用关键字来指定，还可以直接省略。

```py
def safe_division_e(numerator, denominator, /,
                    ndigits=10, *,
                    ignore_overflow=False,
                    ignore_zero_division=False):
    try:
        fraction = numerator / denominator
        return round(fraction, ndigits)
    except OverflowError:
        if ignore_overflow:
            return 0
        else:
            raise
    except ZeroDivisionError:
        if ignore_zero_division:
            return float('inf')
        else:
            raise


result = safe_division_e(22, 7)
print(result)
result = safe_division_e(22, 7, 5)
print(result)
result = safe_division_e(22, 7, ndigits=2)
print(result)

>>>
3.1428571429
3.14286
3.14
```

### 总结

1. Keyword-only argument 是一种只能通过关键字指定而不能通过位置指定的参数。这迫使调用者必须指明，这个值是传给哪一个参数的。在函数的参数列表中，这种参数位于 `*` 符号的右侧。
2. Positional-only argument 是这样一种参数，它不允许调用者通过关键字来指定，而是要求必须按位置传递。这可以降低调用代码与参数名称之间的耦合程度。在函数的参数列表中，这些参数位于 `/` 符号的左侧。
3. 在参数列表中，位于 `/` 与 `*` 之间的参数，可以按位置指定，也可以用关键字来指定。这也是 Python 普通参数的默认指定方式。

## 第 26 条：用 functools.wraps 定义函数修饰器

Python 中有一种特殊的写法，可以用修饰器（decorator）来封装某个函数，从而让程序在执行这个函数之前与执行完这个函数之后，分别运行某些代码。这意味着，调用者传给函数的参数值、函数返回给调用者的值，以及函数抛出的异常，都可以由修饰器访问并修改。这是个很有用的机制，能够确保用户以正确的方式使用函数，也能够用来调试程序或实现函数注册功能，此外还有许多用途。

例如，假设我们要把函数执行时收到的参数与返回的值记录下来。这在调试递归函数时是很有用的，因为我们需要知道，这个函数执行每一层递归时，输入的是什么参数，返回的是什么值。下面我们就定义这样一个修饰器，在实现这个修饰器时，用 `*args` 与 `**kwargs` 表示受修饰的原函数 func 所收到的参数（参见第 22 条与第 23 条）。

```py
def trace(func):
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        print(f'{func.__name__}({args!r}，{kwargs!r})'
              f'-> {result!r}')
        return result
    return wrapper


@trace # 相当于 fibonacci = trace(fibonacci)
def fibonacci(n):
    """Return the n-th Fibonacci number"""
    if n in (0, 1):
        return n
    return fibonacci(n - 2) + fibonacci(n - 1)

fibonacci(4)

>>>
fibonacci((0,)，{})-> 0
fibonacci((1,)，{})-> 1
fibonacci((2,)，{})-> 1
fibonacci((1,)，{})-> 1
fibonacci((0,)，{})-> 0
fibonacci((1,)，{})-> 1
fibonacci((2,)，{})-> 1
fibonacci((3,)，{})-> 2
fibonacci((4,)，{})-> 3
```

这样写确实能满足需求，但是会带来一个我们不愿意看到的副作用。修饰器返回的那个值，也就是刚才调用的 fibonacci，它的名字并不叫 `fibonacci`。

```py
print(fibonacci)

>>>
<function trace.<locals>.wrapper at 0x108955dcO>
```

这种现象解释起来并不困难。trace 函数返回的，是它里面定义的 wrapper 函数，所以，当我们把这个返回值赋给 fibonacci 之后，fibonacci 这个名称所表示的自然就是 wrapper 了。问题在于，这样可能会干扰那些需要利用 introspection 机制来运作的工具，例如调试器（debugger）（参见第 80 条）。

例如，如果用内置的 help 函数来查看修饰后的 fibonacci，那么打印出来的并不是我们想看的帮助文档，它本来应该打印前面定义时写的那行 `Return the n-th Fibonacci number` 文本才对。

```py
help(fibonacci)

>>>
Help on function wrapper in module __main__:

wrapper(*args, **kwargs)
```

对象序列化器（object serializer，参见第 68 条）也无法正常运作，因为它不能确定受修饰的那个原始函数的位置。

```py
import pickle

pickle.dumps(fibonacci)

>>>
Traceback ...
AttributeError: Can't pickle local object 'trace.<locals>.wrapper'
```

要想解决这些问题，可以改用 functools 内置模块之中的 wraps 辅助函数来实现。wraps 本身也是个修饰器，它可以帮助你编写自己的修饰器。把它运用到 wrapper 函数上面，它就会将重要的元数据（metadata）全都从内部函数复制到外部函数。

```py{2,6}
import pickle
from functools import wraps


def trace(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        print(f'{func.__name__}({args!r}，{kwargs!r})'
              f'-> {result!r}')
        return result
    return wrapper


@trace
def fibonacci(n):
    """Return the n-th Fibonacci number"""
    if n in (0, 1):
        return n
    return fibonacci(n - 2) + fibonacci(n - 1)


pickle.dumps(fibonacci)
help(fibonacci)
```

现在我们就可以通过 help 函数看到正确的文档了。虽然原来的 fibonacci 函数现在封装在修饰器里面，但我们还是可以看到它的文档。

除了这里讲到的几个方面之外，Python 函数还有很多标准属性（例如 `__name__`、`__module__`、`__annotations__`）也应该在受到封装时得以保留，这样才能让相关的接口正常运作。wraps 可以帮助保留这些属性，使程序表现出正确的行为。

### 总结

1. 修饰器是 Python 中的一种写法，能够把一个函数封装在另一个函数里面，这样程序在执行原函数之前与执行完毕之后，就有机会执行其他一些逻辑了。
2. 修饰器可能会让那些利用 introspection 机制运作的工具（例如调试器）产生奇怪的行为。
3. Python 内置的 functools 模块里有个叫作 wraps 的修饰器，可以帮助我们正确定义自己的修饰器，从而避开相关的问题。

# 推导与生成

## 第 27 条：用列表推导取代 map 与 filter

Python 里面有一种很精简的写法，可以根据某个序列或可迭代对象派生出一份新的列表。用这种写法写成的表达式，叫作列表推导（list comprehension）。假设我们要用列表中每个元素的平方值构建一份新的列表。传统的写法是，采用下面这个简单的 for 循环来实现。

```py
a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
squares = []
for x in a:
    squares.append(x**2)
print(squares)

>>>
[1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
```

上面那段代码可以改用列表推导来写，这样可以在迭代列表的过程中，根据表达式算出新列表中的对应元素。

```py
a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
squares = [x**2 for x in a]
print(squares)
```

这种功能当然也可以用内置函数 map 实现，它能够从多个列表中分别取出当前位置上的元素，并把它们当作参数传给映射函数，以求出新列表在这个位置上的元素值。如果映射关系比较简单（例如只是把一个列表映射到另一个列表），那么用列表推导来写还是比用 map 简单一些，因为用 map 的时候，必须先把映射逻辑定义成 lambda 函数，这看上去稍微有点烦琐。

```py
a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
squares = list(map(lambda x: x ** 2, a))
print(squares)
```

列表推导还有一个地方比 map 好，就是它能够方便地过滤原列表，把某些输入值对应的计算结果从输出结果中排除。例如，假设新列表只需要纳入原列表中那些偶数的平方值，那我们可以在推导的时候，在 for x in a 这一部分的右侧写一个条件表达式：

```py
a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
even_squares = [x**2 for x in a if x % 2 == 0]
print(even_squares)

>>>
[4, 16, 36, 64, 100]
```

这种功能也可以通过内置的 filter 与 map 函数来实现，但是这两个函数相结合的写法要比列表推导难懂一些。

```py
a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
even_squares = [x**2 for x in a if x % 2 == 0]
alt = map(lambda x: x**2, filter(lambda x: x % 2 == 0, a))
assert even_squares == list(alt)
```

字典与集合也有相应的推导机制，分别叫作字典推导（dictionary comprehension）与集合推导（set comprehension）。编写算法时，可以利用这些机制根据原字典与原集合创建新字典与新集合。

```py
a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
even_squares_dict = {x: x**2 for x in a if x % 2 == 0}
threes_cubed_set = {x**3 for x in a if x % 3 == 0}
print(even_squares_dict)
print(threes_cubed_set)

>>>
{2: 4, 4: 16, 6: 36, 8: 64, 10: 100}
{216, 729, 27}
```

如果改用 map 与 filter 实现，那么还必须调用相应的构造器（constructor），这会让代码变得很长，需要分成多行才能写得下。这样看起来比较乱，不如使用推导机制的代码清晰。

```py
a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
even_squares_dict = {x: x**2 for x in a if x % 2 == 0}
threes_cubed_set = {x**3 for x in a if x % 3 == 0}

alt_dict = dict(map(lambda x: (x, x**2),
                    filter(lambda x: x % 2 == 0, a)))
alt_set = set(map(lambda x: x**3,
                  filter(lambda x: x % 3 == 0, a)))

assert even_squares_dict == alt_dict
assert threes_cubed_set == alt_set
```

### 总结

1. 列表推导要比内置的 map 与 filter 函数清晰，因为它不用另外定义 lambda 表达式。
2. 列表推导可以很容易地跳过原列表中的某些数据，假如改用 map 实现，那么必须搭配 filter 才能实现。
3. 字典与集合也可以通过推导来创建。

## 第 28 条：控制推导逻辑的子表达式不要超过两个

除了最基本的用法（参见第 27 条）外，列表推导还支持多层循环。例如，要把矩阵（一种二维列表，它的每个元素本身也是列表）转化成普通的一维列表，那么可以在推导时，使用两条 for 子表达式。这些子表达式会按照从左到右的顺序解读。

```py
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flat = [x for row in matrix for x in row]
print(flat)

>>>
[1, 2, 3, 4, 5, 6, 7, 8, 9]
```

这样写简单易懂，这也正是多层循环在列表推导之中的合理用法。多层循环还可以用来重制那种两层深的结构。例如，如果要根据二维矩阵里每个元素的平方值构建一个新的二维矩阵，那么可以采用下面这种写法。这看上去有点儿复杂，因为它把小的推导逻辑 `[x**2 for x in row]` 嵌到了大的推导逻辑里面，不过，这行语句总体上不难理解。

```py
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
squared = [[x**2 for x in row] for row in matrix]
print(squared)

>>>
[[1, 4, 9], [16, 25, 36], [49, 64, 81]]
```

如果推导过程中还要再加一层循环，那么语句就会变得很长，必须把它分成多行来写，例如下面是把一个三维矩阵转化成普通一维列表的代码。

```py
my_lists = [
    [[1, 2, 3], [4, 5, 6]]
]
flat = [x for sublist1 in my_lists
        for sublist2 in sublist1
        for x in sublist2]
print(flat)

>>>
[1, 2, 3, 4, 5, 6]
```

在这种情况下，采用列表推导来实现，其实并不会比传统的 for 循环节省多少代码。下面用常见的 for 循环改写刚才的例子。这次我们通过级别不同的缩进表示每一层循环的深度，这要比刚才那种三层矩阵的列表推导更加清晰。

```py
my_lists = [
    [[1, 2, 3], [4, 5, 6]]
]
flat = []
for sublistl in my_lists:
    for sublist2 in sublistl:
        flat.extend(sublist2)
```

推导的时候，可以使用多个 if 条件。如果这些 if 条件出现在同一层循环内，那么它们之间默认是 and 关系，也就是必须同时成立。例如，如果要用原列表中大于 4 且是偶数的值来构建新列表，那么既可以连用两个 if，也可以只用一个 if，下面两种写法效果相同。

```py
a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
b = [x for x in a if x > 4 if x % 2 == 0]
c = [x for x in a if x > 4 and x % 2 == 0]
```

在推导时，每一层的 for 子表达式都可以带有 if 条件。例如，要根据原矩阵构建新的矩阵，把其中各元素之和大于等于 10 的那些行选出来，而且只保留其中能够被 3 整除的那些元素。这个逻辑用列表推导来写，并不需要太多的代码，但是这些代码理解起来会很困难。

```py
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
filtered = [[x for x in row if x % 3 == 0]
            for row in matrix if sum(row) >= 10]
print(filtered)

>>>
[[6], [9]]
```

虽然这个例子是笔者专门构造出来的，但在实际中，我们确实会碰到很多类似的需求。有人可能觉得，这些需求应该通过推导来实现。然而，笔者强烈建议大家不要用刚才的写法来推导新的 list、dict 或 set，因为这样写出来的代码很难让初次阅读这段程序的人看懂。对于 dict 来说，问题尤其严重，因为必须得把键与值的推导逻辑都表达出来才行。

总之，在表示推导逻辑时，最多只应该写两个子表达式（例如两个 if 条件、两个 for 循环，或者一个 if 条件与一个 for 循环）。只要实现的逻辑比这还复杂，那就应该采用普通的 if 与 for 语句来实现，并且可以考虑编写辅助函数（参见第 30 条）。

### 总结

1. 推导的时候可以使用多层循环，每层循环可以带有多个条件。
2. 控制推导逻辑的子表达式不要超过两个，否则代码很难读懂。

## 第 29 条：用赋值表达式消除推导中的重复代码

推导 list、dict 与 set 等变体结构时，经常要在多个地方用到同一个计算结果。例如，我们要给制作紧固件的公司编写程序以管理订单。顾客下单后，我们要判断当前的库存能否满足这份订单，也就是说，要核查每种产品的数量有没有达到可以发货的最低限制（8 个为一批，至少要有一批，才能发货）。

```py
stock = {
    'nails': 125,
    'screws': 35,
    'wingnuts': 8,
    'washers': 24,
}
order = ['screws', 'wingnuts', 'clips']


def get_batches(count, size):
    return count // size


result = {}
for name in order:
    count = stock.get(name, 0)
    batches = get_batches(count, 8)
    if batches:
        result[name] = batches

print(result)

>>>
{'screws': 4, 'wingnuts': 1}
```

这段循环逻辑，如果改用字典推导来写，会简单一些（参见第 27 条）。

```py
found = {name: get_batches(stock.get(name, 0), 8)
         for name in order
         if get_batches(stock.get(name, 0), 8)}
print(found)
```

这样写虽然比刚才简短，但问题是，它把 `get_batches(stock.get(name, 0), 8)` 写了两遍。这样会让代码看起来比较乱，而且实际上，程序也没有必要把这个结果计算两遍。另外，如果这两个地方忘了同步更新，那么程序就会出现 bug。例如，我们决定每一批不是 8 个，而是 4 个，那么需要把 `get_batches` 的第二个参数从 8 改成 4，但是，万一我们忘了同步修改另一个地方，那么代码就可能会出问题（它会把大于等于 4 但是小于 8 的情况给漏掉）。

有个简单的办法可以解决这个问题，那就是在推导的过程中使用 Python 3.8 新引入的 `:=` 操作符进行赋值表达（参见第 10 条）。

```py
found = {name: batches for name in order
         if (batches := get_batches(stock.get(name, 0), 8))}
```

这条 `batches := get_batches(...)` 赋值表达式，能够从 stock 字典里查到对应产品一共有几批，并把这个批数放在 batches 变量里。这样的话，我们推导这个产品所对应批数时，就不用再通过 `get_batches` 计算了，因为结果已经保存到 batches 里面了。这种写法只需要把 get 与 `get_batches` 调用一次即可，这样能够提升效率，因为我们不需要针对 order 列表中的每件产品都多做一次 get 与 `get_batches`。

在推导过程中，描述新值的那一部分也可以出现赋值表达式。但如果在其他部分引用了定义在那一部分的变量，那么程序可能就会在运行时出错。例如，如果写成了下面这样，那么程序就必须先考虑 `for name, count in stock.items() if tenth > 0`，而这个时候，其中的 tenth 还没有得到定义。

```py
result = {name: (tenth := count // 10)
          for name, count in stock.items() if tenth > 0}
print(result)

>>>
Traceback ...
NameError: name 'tenth' is not defined
```

为了解决这个问题，可以把赋值表达式移动到 if 条件里面，然后在描述新值的这一部分引用已经定义过的 tenth 变量。

```py
result = {name: tenth for name, count in stock.items()
          if (tenth := count // 10) > 0}
print(result)

>>>
{'nails': 12, 'screws': 3, 'washers': 2}
```

如果推导逻辑不带条件，而表示新值的那一部分又使用了 `:=` 操作符，那么操作符左边的变量就会泄漏到包含这条推导语句的那个作用域里（参见第 21 条）。

```py
half = [(last := count // 2) for count in stock.values()]
print(f'Last item of {half} is {last}')

>>>
Last item of [62, 17, 4, 12] is 12
```

这与普通的 for 循环所用的那个循环变量类似

```py
for count in stock.values():  # Leaks loop variable
    pass
print(f'Last item of {list(stock.values())} is {count}')

>>>
Last item of [125, 35, 8, 24] is 24
```

然而，推导语句中的 for 循环所使用的循环变量，是不会像刚才那样泄漏到外面的。

```py
half = [count // 2 for count in stock.values()]
print(half)
# Works
print(count)  # Exception because loop variable didn't leak

>>>
[62, 17, 4, 12]
Traceback ...
NameError: name 'count' is not defined
```

最好不要泄漏循环变量，所以，建议赋值表达式只出现在推导逻辑的条件之中。

赋值表达式不仅可以用在推导过程中，而且可以用来编写生成器表达式（generator expression，参见第 32 条）。下面这种写法创建的是迭代器，而不是字典实例，该迭代器每次会给出一对数值，其中第一个元素为产品的名字，第二个元素为这种产品的库存。

```py
found = ((name, batches) for name in order
         if (batches := get_batches(stock.get(name, 0), 8)))
print(next(found))
print(next(found))

>>>
('screws', 4)
('wingnuts', 1)
```

### 总结

1. 编写推导式与生成器表达式时，可以在描述条件的那一部分通过赋值表达式定义变量，并在其他部分复用该变量，可使程序简单易读。
2. 对于推导式与生成器表达式来说，虽然赋值表达式也可以出现在描述条件的那一部分之外，但最好别这么写。

## 第 30 条：不要让函数直接返回列表，应该让它逐个生成列表里的值

如果函数要返回的是个包含许多结果的序列，那么最简单的办法就是把这些结果放到列表中。例如，我们要返回字符串里每个单词的首字母所对应的下标。下面这种写法，会把每次遇到的新单词所在的位置追加（append）到存放结果的 result 列表中，在函数末尾返回这份列表。

```py
def index_words(text):
    result = []
    if text:
        result.append(0)
    for index, letter in enumerate(text):
        if letter == ' ':
            result.append(index + 1)
    return result
```

我们把一段范例文本传给这个函数，它可以返回正确的结果。

```py
address = 'Four score and seven years ago...'
result = index_words(address)
print(result)

>>>
[0, 5, 11, 15, 21, 27]
```

index_words 函数有两个缺点。

1. 它的代码看起来有点杂乱。每找到一个新单词，它都要调用 append 方法，而调用这个方法时，必须写上 result.append 这样一串字符，这就把我们想要强调的重点，也就是这个新单词在字符串中的位置（index + 1）淡化了。另外，函数还必须专门用一行代码创建这个保存结果的 result 列表，并且要用一条 return 语句把它返回给调用者。这样算下来，虽然函数的主体部分大约有 130 个字符（非空白的），但真正重要的只有 75 个左右。

   这种函数改用生成器（generator）来实现会比较好。生成器由包含 yield 表达式的函数创建。下面就定义一个生成器函数，实现与刚才那个函数相同的效果。

   ```py
   def index_words_iter(text):
      if text:
         yield 0
      for index, letter in enumerate(text):
         if letter == ' ':
               yield index + 1

   address = 'Four score and seven years ago...'
   result = index_words_iter(address)
   print(list(result))
   ```

2. 它必须把所有的结果都保存到列表中，然后才能返回列表。如果输入的数据特别多，那么程序可能会因为耗尽内存而崩溃。

   相反，用生成器函数来实现，就不会有这个问题了。它可以接受长度任意的输入信息，并把内存消耗量压得比较低。例如下面这个生成器，只需要把当前这行文字从文件中读进来就行，每次推进的时候，它都只处理一个单词，直到把当前这行文字处理完毕，才读入下一行文字。

   ```py
   import itertools

   def index_file(handle):
      offset = 0
      for line in handle:
         if line:
               yield offset
         for letter in line:
               offset += 1
               if letter == ' ':
                  yield offset

   with open('address.txt', 'r') as f:
      it = index_file(f)
      results = itertools.islice(it, 0, 10)
      print(list(results))
   ```

   该函数运行时所耗的内存，取决于文件中最长的那一行所包含的字符数。把刚才那份输入数据存放到 address.txt 文件，让这个函数去读取并用它所返回的生成器构建一份列表，可以看到跟原来相同的结果（islice 函数的详细用法，参见第 36 条）。

   定义这种生成器函数的时候，只有一个地方需要注意，就是调用者无法重复使用函数所返回的迭代器，因为这些迭代器是有状态的（参见第 31 条）。

### 总结

1. 用生成器来实现比让函数把结果收集合到列表里再返回，要更加清晰一些。
2. 生成器函数所返回的迭代器可以产生一系列值，每次产生的那个值都是由函数体的下一条 yield 表达式所决定的。
3. 不管输入的数据量有多大，生成器函数每次都只需要根据其中的一小部分来计算当前这次的输出值。它不用把整个输入值全都读取进来，也不用一次就把所有的输出值全都算好。

## 第 31 条：谨慎地迭代函数所收到的参数

如果函数接受的参数是个包含许多对象的列表，那么这份列表有可能要迭代多次。例如，我们要分析美国得克萨斯州的游客数量。原始数据保存在一份列表中，其中的每个元素表示每年有多少游客到这个城市旅游（单位是百万）。我们现在要统计每个城市的游客数占游客总数的百分比。

为了求出这份数据，先把列表里的所有元素加起来求出游客总数，然后，分别用每个城市的游客数除以游客总数计算出该城市在总数据中所占的百分比。

```py
def normalize(numbers):
    total = sum(numbers)
    result = []
    for value in numbers:
        percent = 100 * value / total
        result.append(percent)
    return result
```

把一份范例数据放到列表中传给这个函数，可以得到正确的结果。

```py
def normalize(numbers):
    total = sum(numbers)
    result = []
    for value in numbers:
        percent = 100 * value / total
        result.append(percent)
    return result


visits = [15, 35, 80]
percentages = normalize(visits)
print(percentages)
assert sum(percentages) == 100.0

>>>
[11.538461538461538, 26.923076923076923, 61.53846153846154]
```

为了应对规模更大的数据，我们现在需要让程序能够从文件中读取信息，并假设得克萨斯州所有城市的游客数都放在这份文件中。笔者决定用生成器实现，因为这样做可以让我们把同样的功能套用在其他数据上面，例如分析全世界（而不仅仅是得克萨斯一州）各城市的游客数。那些场合的数据量与内存用量可能会比现在大得多（参见第 30 条）。

```py
def read_visits(data_path):
    with open(data_path)as f:
        for line in f:
            yield int(line)
```

奇怪的是，对 `read_visits` 所返回的迭代器调用 normalize 函数后，并没有得到结果。

```py
it = read_visits('my_numbers.txt')
percentages = normalize(it)
print(percentages)

>>>
[]
```

出现这种状况的原因在于，迭代器只能产生一次结果。假如迭代器或生成器已经抛出过 StopIteration 异常，继续用它来构造列表或是像 normalize 那样对它做 for 循环，那它不会给出任何结果。

```py
it = read_visits('my_numbers.txt')
print(list(it))
print(list(it))  # Already exhausted

>>>
[15, 35, 80]
[]
```

还有个因素也很令人迷惑，那就是：在已经把数据耗完的迭代器上面继续迭代，程序居然不报错。for 循环、list 构造器以及 Python 标准库的其他许多函数，都认为迭代器在正常的操作过程中抛出 StopIteration 异常是很自然的。它们没办法区分，这个迭代器是本身就没有数据可以提供，还是虽然有数据，但现在已经耗尽了。

为了解决这个问题，我们可以把外界传入的迭代器特意遍历一整轮，从而将其中的内容复制到一份列表里。这样的话，以后就可以用这份列表来处理数据了，那时想迭代多少遍都可以。下面的函数与原来的 normalize 函数功能相同，但是它会把收到的那个 numbers 迭代器所能提供的数据明确地复制到 `numbers_copy` 列表里。

```py
def normalize_copy(numbers):
    numbers_copy = list(numbers)  # Copy the iterator
    total = sum(numbers_copy)
    result = []
    for value in numbers_copy:
        percent = 100 * value / total
        result.append(percent)
    return result
```

现在的这个函数就可以正确处理 `read_visits` 生成器函数所返回的 it 值了。

```py
it = read_visits('my_numbers.txt')
percentages = normalize_copy(it)
print(percentages)
assert sum(percentages) == 100.0
```

这个办法虽然能解决问题，但如果输入给它的迭代器所要提供的数据量相当庞大，那么有可能导致程序在复制迭代器时，因耗尽内存而崩溃。所以，把这个方案用在大规模的数据集合上面，会抵消掉 `read_visits` 的好处。编写那样一个函数，就是不想让程序把整套数据全都读取进来，而是可以一条一条地处理。为了应对大规模的数据，其中一个变通方案是让 normalize 函数接受另外一个函数（也就是下面的 `get_iter`），使它每次要使用迭代器时，都去向那个函数索要。

```py
def normalize_func(get_iter):
    total = sum(get_iter())  # New iterator
    result = []
    for value in get_iter():  # New iterator
        percent = 100 * value / total
        result.append(percent)
    return result
```

使用 `normalize_func` 函数时，需要传入一条 `lambda` 表达式，让这个表达式去调用 `read_visits` 生成器函数。这样 `normalize_func` 每次向 `get_iter` 索要迭代器时，程序都会给出一个新的迭代器。

```py
path = 'my_numbers.txt'
percentages = normalize_func(lambda: read_visits(path))
print(percentages)
assert sum(percentages) == 100.0
```

这样做虽然可行，但传入这么一个 lambda 表达式显得有点儿生硬。要想用更好的办法解决这个问题，可以新建一种容器类，让它实现迭代器协议（iterator protocol）。

Python 的 for 循环及相关的表达式，正是按照迭代器协议来遍历容器内容的。Python 执行 `for x in foo` 这样的语句时，实际上会调用 iter(foo)，也就是把 foo 传给内置的 iter 函数。这个函数会触发名为 `foo.__iter__` 的特殊方法，该方法必须返回迭代器对象（这个迭代器对象本身要实现 `__next__` 特殊方法）。最后，Python 会用迭代器对象反复调用内置的 next 函数，直到数据耗尽为止（如果抛出 StopIteration 异常，就表示数据已经迭代完了）。

这个过程听上去比较复杂，但总结起来，其实只需要让你的类在实现 `__iter__` 方法时，按照生成器的方式来写就好。下面定义这样一种可迭代的容器类，用来读取文件中的游客数据。

```py
class ReadVisits:
    def __init__(self, data_path):
        self.data_path = data_path

    def __iter__(self):
        with open(self.data_path) as f:
            for line in f:
                yield int(line)
```

我们只需要把新的容器传给最早的那个 normalize 函数运行即可，函数本身的代码不需要修改。

```py
def normalize(numbers):
    total = sum(numbers)
    result = []
    for value in numbers:
        percent = 100 * value / total
        result.append(percent)
    return result


class ReadVisits:
    def __init__(self, data_path):
        self.data_path = data_path

    def __iter__(self):
        with open(self.data_path) as f:
            for line in f:
                yield int(line)


path = 'my_numbers.txt'
visits = ReadVisits(path)
percentages = normalize(visits)
print(percentages)
assert sum(percentages) == 100.0
```

这样做为什么可行呢？因为 normalize 函数里面的 sum 会触发 `ReadVisits.__iter__`，让系统分配一个新的迭代器对象给它。接下来，normalize 通过 for 循环计算每项数据占总值的百分比时，又会触发 `__iter__`，于是系统会分配另一个迭代器对象。这些迭代器各自推进，其中一个迭代器把数据耗尽，并不会影响其他迭代器。所以，在每一个迭代器上面遍历，都可以分别看到一套完整的数据。这种方案的唯一缺点，就是多次读取输入数据。

明白了 ReadVisits 这种容器的工作原理后，我们就可以在编写函数和方法时先确认一下，收到的应该是像 ReadVisits 这样的容器，而不是普通的迭代器。按照协议，如果将普通的迭代器传给内置的 iter 函数，那么函数会把迭代器本身返回给调用者。反之，如果传来的是容器类型，那么 iter 函数就会返回一个新的迭代器对象。我们可以借助这条规律，判断输入值是不是这种容器。如果不是，就抛出 TypeError 异常，因为我们没办法在那样的值上面重复遍历。

```py
def normalize_defensive(numbers):
    if iter(numbers) is numbers:  # An iterator -- bad!
        raise TypeError('Must supply a container')
    total = sum(numbers)
    result = []
    for value in numbers:
        percent = 100 * value / total
        result.append(percent)
    return result
```

还有一种写法也可以检测出这样的问题。collections.abc 内置模块里定义了名为 Iterator 的类，它用在 isinstance 函数中，可以判断自己收到的参数是不是这种实例。如果是，就抛出异常（参见第 43 条）。

```py
def normalize_defensive(numbers):
    if isinstance(numbers, Iterator):  # Another way to check
        raise TypeError('Must supply a container')
    total = sum(numbers)
    result = []
    for value in numbers:
        percent = 100 * value / total
        result.append(percent)
    return result
```

这种自定义容器的方案，最适合于既不想像 `normalize_copy` 函数一样，把迭代器提供的这套数据全部复制一份，同时又要多次遍历这套数据的情况。该方案不仅支持自定义容器，还支持系统自带的列表类型，因为这些全都属于遵循迭代器协议的可迭代容器。

```py
visits = [15, 35, 80]
percentages = normalize_defensive(visits)
assert sum(percentages) == 100.0

path = 'my_numbers.txt'
visits = ReadVisits(path)
percentages = normalize_defensive(visits)
assert sum(percentages) == 100.0
```

如果输入的是普通迭代器而不是容器，那么 `normalize_defensive` 就会抛出异常。

```py
visits = [15, 35, 80]
it = iter(visits)
normalize_defensive(it)

>>>
Traceback ...
TypeError: Must supply a container
```

这种思路也适用于异步的迭代器（示例参见第 61 条）。

### 总结

1. 函数和方法如果要把收到的参数遍历很多遍，那就必须特别小心。因为如果这些参数为迭代器，那么程序可能得不到预期的值，从而出现奇怪的效果。
2. Python 的迭代器协议确定了容器与迭代器应该怎样跟内置的 iter 及 next 函数、for 循环及相关的表达式交互。
3. 要想让自定义的容器类型可以迭代，只需要把 `__iter__` 方法实现为生成器即可。
4. 可以把值传给 iter 函数，检测它返回的是不是那个值本身。如果是，就说明这是个普通的迭代器，而不是一个可以迭代的容器。另外，也可以用内置的 isinstance 函数判断该值是不是 collections.abc.Iterator 类的实例。

## 第 32 条：考虑用生成器表达式改写数据量较大的列表推导

列表推导可以根据输入序列中的每个元素创建一个包含派生元素的新列表（参见第 27 条）。如果输入的数据量比较小，那么这样做没问题，但如果数据量很大，那么程序就有可能因为内存耗尽而崩溃。

例如，我们要读取一份文件并返回每行的字符数。假如采用列表推导来实现，那需要把文件中的每行文本都载入内存，并统计长度。对于庞大的文件，或者像 network socket 这样无休止的输入来说，这么写恐怕有问题。下面就是采用列表推导写的代码，它只能处理输入数据量比较少的情况。

```py
value = [len(x) for x in open('my_file.txt')]
print(value)
```

要想处理大规模的数据，可以使用生成器表达式（generator expression）来做，它扩展了列表推导式与生成器机制。程序在对生成器表达式求值时，并不会让它把包含输出结果的那个序列立刻构建出来，而是会把它当成一个迭代器，该迭代器每次可以根据表达式中的逻辑给出一项结果。

生成器表达式的写法，与列表推导式语法类似，但它是写在一对圆括号内，而不是方括号里面。下面这种写法的效果与刚才一样，但是程序并不会立刻给出全部结果，而是先将生成器表达式表示成一个迭代器返回。

```py
it = (len(x) for x in open('my_file.txt'))
print(it)

>>>
<generator object <genexpr> at 0x7f13063e03c0>
```

返回的迭代器每次可以推进一步，这时它会根据生成表达式的逻辑计算出下一项输出结果（这项结果可以通过内置的 next 函数取得）。需要多少项结果，就把迭代器推进多少次，这种采用生成器表达式来实现的写法不会消耗太多内存。

```py
print(next(it))
print(next(it))
```

生成器表达式还有个强大的特性，就是可以组合起来。例如，可以用刚才那条生成器表达式所形成的 it 迭代器作为输入，编写一条新的生成器表达式。

```py
it = (len(x) for x in open('my_file.txt'))
roots = ((x, x ** 0.5) for x in it)
print(roots)
```

这条表达式所形成的 roots 迭代器每次推进时，会引发连锁反应：它也推进内部迭代器 it 以判断当前是否还能在 it 上面继续迭代，如果可以，就把 it 所返回的值代入 `(x, x ** 0.5)` 里面求出结果。这种写法使用的内存同样不会太多。

多个生成器嵌套而成的代码，执行起来还是相当快的。所以，如果要对数据量很大的输入流做一系列处理，那么生成器表达式应该是个很好的选择。唯一需要注意的是，生成器表达式返回的迭代器是有状态的，跑完一整轮之后，就不能继续使用了（参见第 31 条）。

### 总结

1. 通过列表推导来处理大量的输入数据，可能会占用许多内存。
2. 改用生成器表达式来做，可以避免内存使用量过大的问题，因为这种表达式所形成的迭代器每次只会计算一项结果。
3. 生成器表达式所形成的迭代器可以当成 for 语句的子表达式出现在另一个生成器表达式里。
4. 把生成器表达式组合起来使用，能够写出执行速度快且占用内存少的代码。

## 第 33 条：通过 yield from 把多个生成器连起来用

生成器有很多好处（参见第 30 条），而且能够解决许多常见的问题（参见第 31 条）。生成器的用途特别广，所以许多程序都会频繁使用它们，而且是一个连着一个地用。

例如，我们要编写一个图形程序，让它在屏幕上面移动图像，从而形成动画效果。假设要实现这样一段动画：图片先快速移动一段时间，然后暂停，接下来慢速移动一段时间。为了把移动与暂停表示出来，笔者定义了下面两个生成器函数，让它们分别给出图片在当前时间段内应该保持的速度。

```py
def move(period, speed):
    for _ in range(period):
        yield speed


def pause(delay):
    for _ in range(delay):
        yield 0
```

为了把完整的动画制作出来，需要将 move 与 pause 连起来使用，从而算出这张图片当前的位置与上一个位置之差。下面的函数用三个 for 循环来表示动画的三个环节，在每一个环节里，它都通过 yield 把图片当前的位置与上一次的位置之差 delta 返回给调用者。根据 animate 函数返回的 delta 值，即可把整段动画做好。

```py
def animate():
    for delta in move(4, 5.0):
        yield delta
    for delta in pause(3):
        yield delta
    for delta in move(2, 3.0):
        yield delta
```

接下来，我们就根据 animate 生成器所给出的 delta 值，把整个动画效果渲染出来。

```py
def render(delta):
    print(f'Delta: {delta:.1f}')
    # Move the images onscreen


def run(func):
    for delta in func():
        render(delta)


run(animate)

>>>
Delta: 5.0
Delta: 5.0
Delta: 5.0
Delta: 5.0
Delta: 0.0
Delta: 0.0
Delta: 0.0
Delta: 3.0
Delta: 3.0
```

这种写法的问题在于，animate 函数里有很多重复的地方。比如它反复使用 for 结构来操纵生成器，而且每个 for 结构都使用相同的 yield 表达式，这样看上去很啰唆。这个例子仅仅连用了三个生成器，就让代码变得如此烦琐，若是动画里面有十几或几十个环节，那么代码读起来会更加困难。

为了解决这个问题，我们可以改用 yield from 形式的表达式来实现。这种形式，会先从嵌套进去的小生成器里面取值，如果该生成器已经用完，那么程序的控制流程就会回到 yield from 所在的这个函数之中，然后它有可能进入下一套 yield from 逻辑。下面这段代码，用 yield from 语句重新实现了 animate 函数。

```py
def animate_composed():
    yield from move(4, 5.0)
    yield from pause(3)
    yield from move(2, 3.0)

run(animate_composed)

>>>
Delta: 5.0
Delta: 5.0
Delta: 5.0
Delta: 5.0
Delta: 0.0
Delta: 0.0
Delta: 0.0
Delta: 3.0
Delta: 3.0
```

它的运行结果与刚才一样，但是代码看上去更清晰、更直观了。Python 解释器看到 yield from 形式的表达式后，会自己想办法实现与带有普通 yield 语句的 for 循环相同的效果，而且这种实现方式要更快。下面采用内置的 timeit 模块编写并运行一个 micro-benchmark 试试。

```py
import timeit


def child():
    for i in range(1_000_000):
        yield i


def slow():
    for i in child():
        yield i


def fast():
    yield from child()


baseline = timeit.timeit(
    stmt='for _ in slow(): pass',
    globals=globals(),
    number=50)
print(f'Manual nesting {baseline:.2f}s')
comparison = timeit.timeit(
    stmt='for _ in fast(): pass',
    globals=globals(),
    number=50)
print(f'Composed nesting {comparison:2f}s')
reduction = -(comparison - baseline)/baseline
print(f'{reduction:.1%} less time')

>>>
Manual nesting 3.70s
Composed nesting 3.319963s
10.2% less time
```

所以，如果要把多个生成器连起来用，那么笔者强烈建议优先考虑 yield from 表达式。

### 总结

1. 如果要连续使用多个生成器，那么可以通过 yield from 表达式来分别使用这些生成器，这样做能够免去重复的 for 结构。
2. yield from 的性能要胜过那种在 for 循环里手工编写 yield 表达式的方案。

## 第 34 条：不要用 send 给生成器注入数据

yield 表达式让我们能够轻松地写出生成器函数，使得调用者可以每次只获取输出序列中的一项结果（参见第 30 条）。但问题是，这种通道是单向的，也就是说，无法让生成器在其一端接收数据流，同时在另一端给出计算结果。假如能实现双向通信，那么生成器的适用面会更广。

例如，我们想用软件实现无线电广播，用它来发送信号。为了编写这个程序，我们必须用一个函数来模拟正弦波，让它能够给出一系列按照正弦方式分布的点。

```py
import math


def wave(amplitude, steps):
    step_size = 2 * math.pi / steps
    for step in range(steps):
        radians = step * step_size
        fraction = math.sin(radians)
        output = amplitude * fraction
        yield output
```

有了这个 wave 函数，我们可以让它按照某个固定的振幅生成一系列可供传输的值。

```py
def transmit(output):
    if output is None:
        print(f'Output is None')
    else:
        print(f'Output: {output:>5.1f}')


def run(it):
    for output in it:
        transmit(output)


run(wave(3.0, 8))

>>>
Output:   0.0
Output:   2.1
Output:   3.0
Output:   2.1
Output:   0.0
Output:  -2.1
Output:  -3.0
Output:  -2.1
```

这样写可以生成基本的波形，但问题是，该函数在产生这些值的时候，只能按照刚开始给定的振幅来计算，而没办法使振幅在整个生成过程中根据某个因素发生变化（例如在发送调幅广播信号时，我们就需要这么做）。现在，我们要让生成器在计算每个值的时候，都能考虑到振幅的变化，从而实现调幅。

Python 的生成器支持 send 方法，这可以让生成器变为双向通道。send 方法可以把参数发给生成器，让它成为上一条 yield 表达式的求值结果，并将生成器推进到下一条 yield 表达式，然后把 yield 右边的值返回给 send 方法的调用者。然而在一般情况下，我们还是会通过内置的 next 函数来推进生成器，按照这种写法，上一条 yield 表达式的求值结果总是 None。

```py
def my_generator():
    received = yield 1
    print(f'received {received}')


it = iter(my_generator())
output = next(it)  # Get first generator output
print(f'output = {output}')
try:
    next(it)  # Run generator until it exits
except StopIteration:
    pass

>>>
output = 1
received None
```

如果不通过 for 循环或内置的 next 函数推进生成器，而是改用 send 方法，那么调用方法时传入的参数就会成为上一条 yield 表达式的值，生成器拿到这个值后，会继续运行到下一条 yield 表达式那里。可是，刚开始推进生成器的时候，它是从头执行的，而不是从某一条 yield 表达式那里继续的，所以，首次调用 send 方法时，只能传 None，要是传入其他值，程序运行时就会抛出异常。

```py
def my_generator():
    received = yield 1
    print(f'received {received}')


it = iter(my_generator())
output = it.send(None)  # Get first generator output
print(f'output {output}')
try:
    it.send('hello!')  # Send value into the generator
except StopIteration:
    pass

>>>
output 1
received hello!
```

我们可以利用这种机制让调用者把振幅发送过来，这样函数就能根据这个输入值调整生成的正弦波幅值了。首先修改 wave 函数的代码，让它把 yield 表达式的求值结果（也就是调用者通过 send 发过来的振幅）保存到 amplitude 变量里，这样就能根据该变量计算出下次应该生成的值。

然后，要修改 run 函数调用 `wave_modulating` 函数的方式。它现在必须把每次所要使用的振幅发给 `wave_modulating` 生成器。首次必须发送 None，因为此时生成器还没有遇到过 yield 表达式，它不需要知道上一条 yield 表达式的求值结果。

```py
import math


def transmit(output):
    if output is None:
        print(f'Output is None')
    else:
        print(f'Output: {output:>5.1f}')


def wave_modulating(steps):
    step_size = 2 * math.pi / steps
    amplitude = yield  # Receive initial amplitude
    for step in range(steps):
        radians = step * step_size
        fraction = math.sin(radians)
        output = amplitude * fraction
        amplitude = yield output  # Receive next amplitude


def run_modulating(it):
    amplitudes = [None, 7, 7, 7, 2, 2, 2, 2, 10, 10, 10, 10, 10]
    for amplitude in amplitudes:
        output = it.send(amplitude)
        transmit(output)


run_modulating(wave_modulating(12))

>>>
Output is None
Output:   0.0
Output:   3.5
Output:   6.1
Output:   2.0
Output:   1.7
Output:   1.0
Output:   0.0
Output:  -5.0
Output:  -8.7
Output: -10.0
Output:  -8.7
Output:  -5.0
```

这样写没问题，程序可以按照每次输入的值调整输出信号的振幅。首次输出的肯定是 None，因为此时 `wave_modulating` 函数并不知道 amplitude 是多少，它只有在运行第一条 yield 表达式后，才能把调用者通过 send 发来的值保存到这个变量里。

这种写法有个缺点，就是它很难让初次阅读这段代码的人立刻理解它的意思。把 yield 放在赋值语句的右侧，本身就不太直观，因为我们必须先了解生成器的这项高级特性，才能明白 yield 与 send 是如何相互配合的。

现在假设程序的需求变得更复杂了。这次要生成的载波不是简单的正弦波，而是由多个信号序列构成的复合波形（complex waveform）。要实现这个需求，可以连用几条 yield from 语句，把多个生成器串接起来（参见第 33 条）。下面先验证一下，这种写法能否处理振幅固定的简单情况。

```py
def complex_wave():
    yield from wave(7.0, 3)
    yield from wave(2.0, 4)
    yield from wave(10.0, 5)


run(complex_wave())

>>>
Output:   0.0
Output:   6.1
Output:  -6.1
Output:   0.0
Output:   2.0
Output:   0.0
Output:  -2.0
Output:   0.0
Output:   9.5
Output:   5.9
Output:  -5.9
Output:  -9.5
```

可以看到，利用 yield from 表达式确实可以处理比较简单的情况。那既然这样，我们再试试看，它能否处理那种采用 send 方法写成的函数。下面就用这种写法，接连多次调用 `wave_modulating` 生成器。

```py
def complex_wave_modulating():
    yield from wave_modulating(3)
    yield from wave_modulating(4)
    yield from wave_modulating(5)


run_modulating(complex_wave_modulating())

>>>
Output is None
Output:   0.0
Output:   6.1
Output:  -6.1
Output is None
Output:   0.0
Output:   2.0
Output:   0.0
Output: -10.0
Output is None
Output:   0.0
Output:   9.5
Output:   5.9
```

这样写在大方向上是对的，但问题在于：程序竟然输出了那么多 None！这是为什么呢？因为每条 yield from 表达式其实都在遍历一个嵌套进去的生成器，所以每个嵌套生成器都必须分别执行它们各自的第一条 yield 语句（也就是什么值都不带的那条 yield 语句），只有执行过这条语句之后，这些生成器才能通过 send 方法所传来的值决定这条语句的求值结果，并把这个结果放在 amplitude 变量里以计算下一次应该输出的值。所以，`complex_wave_modulating` 函数处理完前一个嵌套的生成器之后，会进入下一个嵌套的生成器，而这时就必须先把该生成器的第一条 yield 语句运行过去，这就导致后面两个嵌套生成器会各自从 amplitudes 列表里浪费掉一个，并使得每个嵌套生成器所拿到的第一个结果必定是 None，还会让最后那个嵌套生成器少执行两次。

这意味着，虽然 yield from 语句与 send 方法单独用着都没问题，然而结合使用的效果却不太让人满意。当然也可以在 `run_modulating` 函数里添加一些代码，使得计算波形的步调与 amplitudes 列表提供振幅值的步调相一致，但这只能使程序越写越复杂，因为利用 send 方法写成的 `wave_modulating` 函数本身已经不太直观了，而我们又把这个生成器函数通过 yield from 语句套到了 `complex_wave_modulating` 里面，这理解起来就更加困难了。所以，笔者建议彻底抛开 send 方法，改用更简单的方案来做。

最简单的一种写法，是把迭代器传给 wave 函数，让 wave 每次用到振幅的时候，通过 Python 内置的 next 函数推进这个迭代器并返回一个输入振幅。于是，这就促使多个生成器之间，产生连环反应（其他类似案例参见第 32 条）。

这样，我们只需要把同一个迭代器分别传给这几条 yield from 语句里的 `wave_cascading` 就行。迭代器是有状态的（参见第 31 条），所以下一个 `wave_cascading` 会从上一个 `wave_cascading` 使用完的地方，继续往下使用 `amplitude_it` 迭代器。

要想触发这个组合的生成器，只需要把振幅值放在列表中，并把针对列表制作的迭代器传给 `complex_wave_cascading` 就好。

```py
import math


def transmit(output):
    if output is None:
        print(f'Output is None')
    else:
        print(f'Output: {output:>5.1f}')


def wave_cascading(amplitude_it, steps):
    step_size = 2 * math.pi / steps
    for step in range(steps):
        radians = step * step_size
        fraction = math.sin(radians)
        amplitude = next(amplitude_it)  # Get next input
        output = amplitude * fraction
        yield output


def complex_wave_cascading(amplitude_it):
    yield from wave_cascading(amplitude_it, 3)
    yield from wave_cascading(amplitude_it, 4)
    yield from wave_cascading(amplitude_it, 5)


def run_cascading():
    amplitudes = [7, 7, 7, 2, 2, 2, 2, 10, 10, 10, 10, 10]
    it = complex_wave_cascading(iter(amplitudes))
    for amplitude in amplitudes:
        output = next(it)
        transmit(output)


run_cascading()

>>>
Output:   0.0
Output:   6.1
Output:  -6.1
Output:   0.0
Output:   2.0
Output:   0.0
Output:  -2.0
Output:   0.0
Output:   9.5
Output:   5.9
Output:  -5.9
Output:  -9.5
```

这种写法最大的优点在于，迭代器可以来自任何地方，而且完全可以是动态的（例如可以用生成器函数来实现迭代器）。此方案只有一个缺陷，就是必须假设负责输入的生成器绝对能保证线程安全，但有时其实保证不了这一点。如果代码要跨越线程边界，那么用 async 函数实现可能更好（参见第 62 条）。

### 总结

1. send 方法可以把数据注入生成器，让它成为上一条 yield 表达式的求值结果，生成器可以把这个结果赋给变量。
2. 把 send 方法与 yield from 表达式搭配起来使用，可能导致奇怪的结果，例如会让程序在本该输出有效值的地方输出 None。
3. 通过迭代器向组合起来的生成器输入数据，要比采用 send 方法的那种方案好，所以尽量避免使用 send 方法。

## 第 35 条：不要通过 throw 变换生成器的状态

除 yield from 表达式（参见第 33 条）与 send 方法（参见第 34 条）外，生成器还有一项高级功能，就是可以把调用者通过 throw 方法传来的 Exception 实例重新抛出。这个 throw 方法用起来很简单：如果调用了这个方法，那么生成器下次推进时，就不会像平常那样，直接走到下一条 yield 表达式那里，而是会把通过 throw 方法传入的异常重新抛出。下面用代码演示这种效果。

```py
class MyError(Exception):
    pass


def my_generator():
    yield 1
    yield 2
    yield 3


it = my_generator()
print(next(it))  # Yield 1
print(next(it))  # Yield 2
print(it.throw(MyError('test error')))

>>>
1
2
Traceback ...
__main__.MyError: test error
```

生成器函数可以用标准的 try/except 复合语句把 yield 表达式包裹起来，如果函数上次执行到了这条表达式这里，而这次即将继续执行时，又发现外界通过 throw 方法给自己注入了异常，那么这个异常就会被 try 结构捕获下来，如果捕获之后不继续抛异常，那么生成器函数会推进到下一条 yield 表达式（更多异常处理，参见第 65 条）。

```py
class MyError(Exception):
    pass


def my_generator():
    yield 1
    try:
        yield 2
    except MyError:
        print('Got MyError!')
    else:
        yield 3
    yield 4


it = my_generator()
print(next(it))  # Yield 1
print(next(it))  # Yield 2
print(it.throw(MyError('test error')))

>>>
1
2
Got MyError!
4
```

这项机制会在生成器与调用者之间形成双向通信通道（另一种双向通信通道，参见第 34 条），这在某些情况下是有用的。例如，要编写一个偶尔可以重置的计时器程序。笔者定义下面的 Reset 异常与 timer 生成器方法，让调用者可以在 timer 给出的迭代器上通过 throw 方法注入 Reset 异常，令计时器重置。

```py
class Reset(Exception):
    pass


def timer(period):
    current = period
    while current:
        current -= 1
        try:
            yield current
        except Reset:
            current = period
```

按照这种写法，如果 timer 正准备从 yield 表达式往下推进时，发现有人注入了 Reset 异常，那么它就会把这个异常捕获下来，并进入 except 分支，在这里它会把表示倒计时的 current 变量重新调整成最初的 period 值。

这个计时器可以与外界某个按秒轮询的输入机制对接起来。为此，笔者定义一个 run 函数以驱动 timer 生成器所给出的那个 it 迭代器，并根据外界的情况做处理，如果外界要求重置，那就通过 it 迭代器的 throw 方法给计时器注入 Reset 变量，如果外界没有这样要求，那就调用 announce 函数打印生成器所给的倒计时值。

```py
class Reset(Exception):
    pass


def timer(period):
    current = period
    while current:
        current -= 1
        try:
            yield current
        except Reset:
            current = period


def check_for_reset():
    # Poll for external event
    # ...
    pass


def announce(remaining):
    print(f'{remaining} ticks remaining')


def run():
    it = timer(4)
    while True:
        try:
            if check_for_reset():
                current = it.throw(Reset())
            else:
                current = next(it)
        except StopIteration:
            break
        else:
            announce(current)


run()

>>>
3 ticks remaining
2 ticks remaining
1 ticks remaining
0 ticks remaining
```

这样写没错，但是有点儿难懂，因为用了许多层嵌套结构。我们要判断 `check_for_reset` 函数的返回值，以确定是应该通过 it.throw 注入 Reset 异常，还是应该通过 next 推进迭代器。如果是要推进迭代器，那么还得捕获 StopIteration 异常：若是捕获到了这种异常，那说明迭代器已经走到终点，则要执行 break 跳出 while 循环；若没捕获到，则需要调用 announce 函数打印倒计时值。这会让代码变得很乱。

有个简单的办法，能够改写这段代码，那就是用可迭代的容器对象（参见第 31 条）定义一个有状态的闭包（参见第 38 条）。下面的代码就写了这样一个 Timer 类，并通过它重新实现刚才的 timer 生成器。

```py
class Timer:
    def __init__(self, period):
        self.current = period
        self.period = period

    def reset(self):
        self.current = self.period

    def __iter__(self):
        while self.current:
            self.current -= 1
            yield self.current
```

现在，run 函数就好写多了，因为它只需要用 for 循环迭代这个 timer 即可。这样写出来的代码，不像刚才那样有那么多层嵌套，所以读起来很容易懂。

```py{29-37}
class Reset(Exception):
    pass


def check_for_reset():
    # Poll for external event
    # ...
    pass


def announce(remaining):
    print(f'{remaining} ticks remaining')


class Timer:
    def __init__(self, period):
        self.current = period
        self.period = period

    def reset(self):
        self.current = self.period

    def __iter__(self):
        while self.current:
            self.current -= 1
            yield self.current


def run():
    timer = Timer(4)
    for current in timer:
        if check_for_reset():
            timer.reset()
        announce(current)


run()

>>>
3 ticks remaining
2 ticks remaining
1 ticks remaining
0 ticks remaining
```

这样写所输出的结果与前面一样，但是这种实现方案理解起来要容易得多，即便是初次阅读这段代码的人也很容易就能读懂。凡是想用生成器与异常来实现的功能，通常都可以改用异步机制去做（参见第 60 条），那样会更好。如果确实遇到了这里讲到的这种需求，那么应该通过可迭代的类来实现生成器，而不要用 throw 方法注入异常。

### 总结

1. throw 方法可以把异常发送到生成器刚执行过的那条 yield 表达式那里，让这个异常在生成器下次推进时重新抛出。
2. 通过 throw 方法注入异常，会让代码变得难懂，因为需要用多层嵌套的模板结构来抛出并捕获这种异常。
3. 如果确实遇到了这样的特殊情况，那么应该通过类的 `__iter__` 方法实现生成器，并且专门提供一个方法，让调用者通过这个方法来触发这种特殊的状态变换逻辑。

## 第 36 条：考虑用 itertools 拼装迭代器与生成器

Python 内置的 itertools 模块里有很多函数，可以用来安排迭代器之间的交互关系（相关的基础知识，参见第 30 条与第 31 条）。

如果要实现比较难写的迭代逻辑，那么应该先查看 itertools 的文档（在 Python 解释器界面输入 help(itertools)），说不定里面就有你能用到的函数。下面分三大类，列出其中最重要的函数。

### 连接多个迭代器

内置的 itertools 模块有一些函数可以把多个迭代器连成一个使用。

#### chain

chain 可以把多个迭代器从头到尾连成一个迭代器。

```py
import itertools

it = itertools.chain([1, 2, 3], [4, 5, 6])
print(list(it))

>>>
[1, 2, 3, 4, 5, 6]
```

#### repeat

repeat 可以制作这样一个迭代器，它会不停地输出某个值。调用 repeat 时，也可以通过第二个参数指定迭代器最多能输出几次。

```py
import itertools

it = itertools.repeat('hello', 3)
print(list(it))

>>>
['hello', 'hello', 'hello']
```

#### cycle

cycle 可以制作这样一个迭代器，它会循环地输出某段内容之中的各项元素。

```py
import itertools

it = itertools.cycle([1, 2])
result = [next(it) for _ in range(10)]
print(result)

>>>
[1, 2, 1, 2, 1, 2, 1, 2, 1, 2]
```

#### tee

tee 可以让一个迭代器分裂成多个平行的迭代器，具体个数由第二个参数指定。如果这些迭代器推进的速度不一致，那么程序可能要用大量内存做缓冲，以存放进度落后的迭代器将来会用到的元素。

```py
import itertools

it1, it2, it3 = itertools.tee(['first', 'second'], 3)
print(list(it1))
print(list(it2))
print(list(it3))

>>>
['first', 'second']
['first', 'second']
['first', 'second']
```

#### zip_longest

它与 Python 内置的 zip 函数类似（参见第 8 条），但区别在于，如果源迭代器的长度不同，那么它会用 fillvalue 参数的值来填补提前耗尽的那些迭代器所留下的空缺。

```py
import itertools

keys = ['one', 'two', 'three']
values = [1, 2]

normal = list(zip(keys, values))
print('zip:        ', normal)

it = itertools.zip_longest(keys, values, fillvalue='nope')
longest = list(it)
print('zip_longest:', longest)

>>>
zip:         [('one', 1), ('two', 2)]
zip_longest: [('one', 1), ('two', 2), ('three', 'nope')]
```

### 过滤源迭代器中的元素

Python 内置的 itertools 模块里有一些函数可以过滤源迭代器中的元素。

#### islice

islice 可以在不拷贝数据的前提下，按照下标切割源迭代器。可以只给出切割的终点，也可以同时给出起点与终点，还可以指定步进值。这种切割方式与标准的序列切片及步进机制类似（参见第 11 条与第 12 条）。

```py
import itertools

values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
first_five = itertools.islice(values, 5)
print('First five: ', list(first_five))
middle_odds = itertools.islice(values, 2, 8, 2)
print('Middle odds:', list(middle_odds))

>>>
First five:  [1, 2, 3, 4, 5]
Middle odds: [3, 5, 7]
```

// TODO 编写高质量 Python 待完成
