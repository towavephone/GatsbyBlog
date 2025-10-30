---
title: 接口缓存策略探索
categories:
   - 后端
path: /interface-cache-strategy-explore/
tags: 后端, 接口缓存, 预研
date: 2025-10-30 11:21:37
---

# 背景

由于有些接口响应时间较长，在接口不需要频繁更新的情况下可以对其进行缓存

# 实现

cache_tool.py

实现装饰器缓存函数

```py
import hashlib
import json
import logging
import time

from cacheout import Cache
from controllers.wrapper import get_post_param
from tools import redis_tool

Queue_Cache = Cache(maxsize=1024, ttl=300, timer=time.time, default=None)


def cache_request(is_with_cache_param=False, cache_type="cache", ttl=300):
    """
    _summary_.

    Args:
        is_with_cache_param (bool, optional): 是否携带缓存参数，默认为 False
    """

    def wrapper2(func):
        if cache_type == "cache":
            queue_cache = Cache(maxsize=1024, ttl=ttl, timer=time.time, default=None)

        def wrapper1(*args, **kwargs):
            request = args[0]
            is_not_cache = get_post_param(
                request, "is_not_cache", default="0", type=int
            )

            # 如果携带缓存参数为真且 is_not_cache 为真，则不使用缓存
            # 除了以上情况，默认使用缓存
            if is_with_cache_param and is_not_cache:
                result = func(*args, **kwargs)

            prefix = f"{func.__module__}.{func.__name__}:"
            key = prefix + hashlib.md5(str(request.POST.dict()).encode()).hexdigest()
            logging.debug(
                "cache_request key %s, params %s",
                key,
                str(request.POST.dict()).encode("utf-8"),
            )

            result = None

            if cache_type == "cache":
                result = queue_cache.get(key)
            elif cache_type == "redis":
                cache_result = redis_tool.get(key)
                if cache_result:
                    result = json.loads(cache_result)

            if not result:
                result = func(*args, **kwargs)

                if cache_type == "cache":
                    queue_cache.set(key, result)
                elif cache_type == "redis":
                    redis_tool.setex(key, ttl, json.dumps(result))

            return result

        return wrapper1

    return wrapper2
```

redis_tool.py

实现删除某个接口的所有缓存结果，这里使用了 redis 的 scan 方法，因为是顺序扫描效率很低，数据量大的时候比较慢

```py
@retry_on_redis_error()
def scan(pattern, count=100000):
    itcl = IntervalTimeCostLogging(func_name="scan", enable_call=True)
    cursor = 0
    result = []
    index = 0
    # 这里全量扫描耗时太长，有 20 秒，有 80 万条数据（2025-03-28 16:07:10），暂时只扫描 10 万个
    while True:
        cursor, keys = _get_client().scan(cursor, pattern, count=count)
        itcl.mark(f"scan_from_{index}_to_{index + count}_keys_count_{len(keys)}")
        result += keys
        #   if cursor == 0 or index == 0:  # 这里临时提前终止
        #       break
        index += count

    itcl.logging_cost()

    logging.debug(f"Scan keys: {result}")
    return cursor, result

@retry_on_redis_error()
def delete(key: str):
    res = _get_client().delete(key)
    logging.debug("Delete %s [%s]", key, res and "hit" or "miss")
    return res

@retry_on_redis_error()
def delete_scan(pattern):
    _, keys = scan(pattern)
    for key in keys:
        delete(key)
```

使用时

```py
# 需要缓存的接口
@request_wrapper()
@cache_tool.cache_request(
    cache_type="redis", is_with_cache_param=True
)  # 作用：根据参数缓存响应结果
def get_list(request):
    pass


# 需要删除上面接口的缓存，比如在更新时候需要删除缓存以便拿到最新结果
@request_wrapper()
def update(request):
    # 重置缓存
    redis_tool.delete_scan(
        "接口路径.get_list:*"
    )
```

# 缓存失效优化

由于上面实现模糊匹配删除缓存 key 即 redis scan 时间过长，需要转换思路通过递增数据版本号来使缓存失效，避免性能问题

cache_tool.py

```py
# cache_tool.py（摘取并替换 redis 分支相关部分）
version_key = f"version:{func.__module__}.{func.__name__}"
version = "0"
if cache_type == "redis":
    v = redis_tool.get(version_key)
    if v:
        version = v.decode() if isinstance(v, bytes) else str(v)

# 旧的 key 生成： prefix + md5(...) 改成带版本
key = f"{prefix}{version}:{hashlib.md5(str(request.POST.dict()).encode()).hexdigest()}"

# 后续正常读写 redis（setex/get）即可
```

redis_tool.py

```py
@retry_on_redis_error()
def incr(key: str):
    # 返回递增后的 int 值
    return _get_client().incr(key)
```

使用时

```py
@request_wrapper()
def update(request):
    # ... 执行更新数据库的操作 ...

    # 旧做法：redis_tool.delete_scan("接口路径.get_list:*")  # 慢
    # 新做法：递增版本号
    redis_tool.incr("version:接口路径.get_list")
```

# 其他

## 耗时打印

实现耗时日志的打印，方便打印每块代码区间的耗时

### 实现

```py
import logging
import time

from pydash import py_


class IntervalTimeCostLogging:
    def __init__(
        self,
        enable=False,
        enable_call=False,
        enable_cost=False,
        func_name="",
    ):
        self.enable_call = enable_call
        self.enable_cost = enable_cost

        if enable:
            self.enable_call = True
            self.enable_cost = True

        self.func_name = func_name
        self.last_time = time.time()
        self.total_time = 0
        self.log_list = []

    def mark(self, name):
        if not self.enable_call and not self.enable_cost:
            return

        current_time = time.time()
        elapsed_ms = (current_time - self.last_time) * 1000
        self.total_time += elapsed_ms
        log = f"函数名称: {self.func_name}, 区间 {name} 耗时: {elapsed_ms:.2f}ms, 累积耗时: {self.total_time:.2f}ms"
        if self.enable_call:
            logging.debug(log)
        self.log_list.append(
            {
                "name": name,
                "elapsed_ms": elapsed_ms,
                "total_time": self.total_time,
            }
        )
        self.last_time = current_time

    def logging_cost(self):
        if not self.enable_cost:
            return
        from tabulate import tabulate

        self.log_list.sort(key=lambda x: x["elapsed_ms"], reverse=True)
        data = []
        for item in self.log_list:
            data.append([item["name"], item["elapsed_ms"], item["total_time"]])
        table = tabulate(
            data,
            ["区间名称", "区间耗时(ms)", "累积耗时(ms)"],
            tablefmt="grid",
            numalign="right",
        )
        logging.debug(f"函数名称：{self.func_name} 花费时间按区间耗时倒序: \n{table}")


def test():
    timer = IntervalTimeCostLogging(enable=True, func_name="test")

    # 模拟一些操作
    time.sleep(0.1)
    timer.mark("step_1")

    time.sleep(0.2)
    timer.mark("step_2")

    time.sleep(0.3)
    timer.mark("step_3")

    timer.logging_cost()


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.DEBUG,
        format="%(asctime)s %(levelname)s %(filename)s:%(lineno)d %(message)s"
    )
    test()
```

### 打印效果

```bash
2025-10-30 15:31:15,733 DEBUG cost.py:36 函数名称: test, 区间 step_1 耗时: 107.24ms, 累积耗时: 107.24ms
2025-10-30 15:31:15,950 DEBUG cost.py:36 函数名称: test, 区间 step_2 耗时: 216.73ms, 累积耗时: 323.98ms
2025-10-30 15:31:16,251 DEBUG cost.py:36 函数名称: test, 区间 step_3 耗时: 301.41ms, 累积耗时: 625.39ms
2025-10-30 15:31:16,258 DEBUG cost.py:61 函数名称：test 花费时间按区间耗时倒序: 
+--------+------------+------------+
| 区间名称   |   区间耗时(ms) |   累积耗时(ms) |
+========+============+============+
| step_3 |    301.413 |    625.391 |
+--------+------------+------------+
| step_2 |    216.735 |    323.978 |
+--------+------------+------------+
| step_1 |    107.244 |    107.244 |
+--------+------------+------------+
```
