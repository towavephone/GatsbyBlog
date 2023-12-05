---
title: Python 后端 oom 处理过程
categories:
   - 后端
path: /python-backend-oom-process/
tags: 后端, python, 预研
date: 2023-11-30 17:46:51
---

# 背景

python 的 django 后端在刚启动时内存占用上升很快，导致对应的 pod 内存溢出，很多接口响应慢

# 方案

需要找到哪行代码导致的内存泄漏，有以下方案

1. [pympler](https://zhuanlan.zhihu.com/p/436577356)
2. [scalene](https://github.com/plasma-umass/scalene) (python3.8 以上，不符合)
3. [memray](https://github.com/bloomberg/memray) (python3.7 以上，不符合)
4. 使用 python 内置的 tracemalloc 库

由于项目用的是 python 3.6 的版本，所以采用方案 1 和 4

# 实现

## 内存占用检测

1. 通过接口获取当前内存占用最大的排名前几的代码行数
2. 通过接口获取当前占用内存最大的对象

controllers/app_monitor_controller.py

```py
import tracemalloc
import logging

from controllers.wrapper import (
    get_param, get_int_param, request_wrapper)


@request_wrapper()
def get_tracemalloc(request):
    key_type = get_param(request, 'key_type', default='traceback')
    limit = get_int_param(request, 'limit', default='10')
    snapshot = tracemalloc.take_snapshot()
    snapshot = snapshot.filter_traces((
        tracemalloc.Filter(False, "<unknown>"),
        tracemalloc.Filter(
            False, "<frozen importlib._bootstrap_external>"),
        tracemalloc.Filter(
            False, "<frozen importlib._bootstrap>"),
        tracemalloc.Filter(False, tracemalloc.__file__),
    ))
    top_stats = snapshot.statistics(key_type)
    top_result = []
    for index, stat in enumerate(top_stats[:limit], 1):
        frame = stat.traceback[0]
        desc = "#%s: %s:%s: %.1f KiB" % (
            index, frame.filename, frame.lineno, stat.size / 1024)
        top_result.append({
            'desc': desc,
            'traceback': stat.traceback.format()
        })

    other = top_stats[limit:]
    if other:
        size = sum(stat.size for stat in other)

    total = sum(stat.size for stat in top_stats)

    return {
        'top_result': top_result,
        'other_result': "Total %s, other: %.1f KiB" %
        (len(other), size / 1024),
        'total_size': "%.1f KiB" % (total / 1024)
    }


@request_wrapper()
def get_memory(request):
    limit = get_int_param(request, 'limit', default='1')
    from pympler import muppy, summary

    all_objects = muppy.get_objects()
    sum1 = summary.summarize(all_objects)
    logging.info('Summary -----')
    summary.print_(sum1)

    filter_all_objects = muppy.sort(all_objects)
    dicts = [ao for ao in filter_all_objects if isinstance(ao, dict)]
    result = []
    for d in dicts[-limit:]:
        item = f'{len(d)}, {str(d).encode("utf-8")}'
        result.append(item)

    import objgraph

    logging.info('Common -----')
    objgraph.show_most_common_types()

    logging.info('Growth -----')
    objgraph.show_growth(limit=5)

    return result
```

这里需要在项目启动的时候去开启记录内存的功能，否则上面的 `get_tracemalloc` 功能不可用，当然这里的功能需要在使用结束后立即关闭，否则内存占用较大

apps.py

```py
from django.apps import AppConfig
import tracemalloc
import os

# 减少 pypinyin 的内存占用
os.environ['PYPINYIN_NO_PHRASES'] = 'true'
os.environ['PYPINYIN_NO_DICT_COPY'] = 'true'


class Config(AppConfig):
    def ready(self):
        from entry.settings import START_RECORD_MEMORY
        if not START_RECORD_MEMORY:
            return
        tracemalloc.start(25)
```

## 耗时检测

主要用来统计函数执行过程中每行耗时及调用次数

tools/performance_tool.py

```py
from cProfile import Profile
from pstats import Stats


def print_func_cost():
    def wrapper2(func):
        def wrapper1(*args, **kwargs):
            profiler = Profile()
            # request = args[0]

            result = profiler.runcall(func, *args, **kwargs)

            stats = Stats(profiler)
            stats.strip_dirs()
            stats.sort_stats('cumulative')
            # stats.print_stats()
            stats.print_callers()

            return result
        return wrapper1
    return wrapper2
```

# 效果展示

由以下日志可看出，内存占用较大的部分主要在 protobuf 解码，大文件读取，pypinyin，之后的优化就可以进行下去

```bash
07:56:48 apps.py:37 INFO #1: /usr/local/lib/python3.6/site-packages/google/protobuf/text_format.py:682: 114541.4 KiB
07:56:48 apps.py:43 INFO     b'  File "文件路径", line 1580'
07:56:48 apps.py:43 INFO     b'    data = text_format.Parse(data, DataTree())'
07:00:05 apps.py:33 INFO #2: 文件路径:1571: 66375.2 KiB
07:00:05 apps.py:37 INFO     b"data = data + open(file_path, 'r').read()"
07:00:05 apps.py:33 INFO #8: 文件路径:1569: 2053.4 KiB
07:00:05 apps.py:37 INFO     b"data = data + open(file_path, 'r').read()"
07:56:52 apps.py:37 INFO #5: /usr/local/lib/python3.6/site-packages/pypinyin/phrases_dict.py:45476: 2560.4 KiB
  07:56:52 apps.py:43 INFO     b'  File "文件路径", line 26'
07:56:52 apps.py:43 INFO     b'    from pypinyin import lazy_pinyin'
```
