---
title: 博客大纲
date: 2022-07-27 18:13:56
categories:
   - 前端
tags: 预研
path: /blog-summary/
draft: true
---

1. 全局任务确保唯一性，并行执行接口请求，重试错误处理

   ```py
   from concurrent.futures import ThreadPoolExecutor
   import requests
   import time

   start = time.time()
   url = 'https://blog.towavephone.com'

   def task(name):
      try:
         result = requests.get(url)
         print(name + 'ping ' + url + result.text[0:20])
      except Exception as e:
         print('except:', e)

   if __name__ == "__main__":
      pool = ThreadPoolExecutor(100)

      for i in range(1, 500):
         pool.submit(task, "请求 %s：" % i)

      pool.shutdown()
      end = time.time()
      print("主线程结束，花费时间为：", end - start)
   ```

   ```py
   import queue
   import threading
   import time
   import requests

   start = time.time()
   url = 'https://blog.towavephone.com'

   def task(que):
      while not que.empty():
         name = que.get()
         try:
               result = requests.get(url)
               print(name + 'ping ' + url + result.text[0:20])
         except Exception as e:
               print('except:', e)

   q = queue.Queue()
   for i in range(1, 500):
      q.put('请求 %s：' % i)

   max_thread = 100
   ts = []
   for i in range(max_thread):
      t = threading.Thread(target=task, args=(q,))
      t.start()
      ts.append(t)
   for t in ts:
      t.join()

   end = time.time()
   print("主线程结束，花费时间为：", end - start)
   ```

   ```py
   import asyncio
   import time
   import requests
   import httpx
   import uvloop

   start = time.time()
   url = 'https://blog.towavephone.com'

   sem = asyncio.Semaphore(100)

   async def task(name, client):
      async with sem:
         try:
               result = await client.get(url)
               print(name + 'ping ' + url + result.text[0:20])
         except Exception as e:
               print('except:', e)

   async def main():
      async with httpx.AsyncClient() as client:
         # 获取 EventLoop:
         tasks = []
         for i in range(1, 500):
               tasks.append(task('请求 %s：' % i, client))
         await asyncio.gather(*tasks)
         # 执行 coroutine

   uvloop.install()
   asyncio.run(main())

   end = time.time()
   print("主线程结束，花费时间为：", end - start)
   ```

   ```py
   import asyncio
   import time
   import httpx
   import random
   # import uvloop

   start = time.time()
   url = 'https://blog.towavephone.com'

   sem = asyncio.Semaphore(1)

   count = 0
   is_success = True

   async def task(name, client):
      async with sem:
         global count
         global is_success

         if not is_success:
               return
         for i in range(0, 3):
               try:
                  result = await client.get(url)
                  print(name + 'ping ' + url + result.text[0:20], count)
                  if i == 2 and random.randint(0, 1):
                     print('------------' + name)
                     is_success = False
                     break
                     # raise asyncio.CancelledError('请求' + name + '取消')
               except Exception as e:
                  print('except:', e)

         count = count + 1

         # return result.text[0:4]

   async def main():
      async with httpx.AsyncClient() as client:
         # 获取 EventLoop:
         tasks = []
         for i in range(1, 100):
               tasks.append(task('请求 %s：' % i, client))
         result = await asyncio.gather(*tasks)
         print(result)
   # uvloop.install()
   loop = asyncio.get_event_loop()
   loop.run_until_complete(main())
   end = time.time()
   print("主线程结束，花费时间为：", end - start)
   ```

2. diff 文件对比选型过程，`db.bp_policies.find({ '$or': [{ 'status': 2 }] })` 耗时过长，git diff 的选型过程
3. https://blog.csdn.net/konkon2012/article/details/115090606 的 6、7 步骤配置 rsync
4. 为了让软链接 `/var/cloudsim/nas/cloud_simulation_nas/simulation/bp_policy` -> `/data/nas-prod/cloud_simulation_nas/simulation/bp_policy/` 生效
5. https://developer.microsoft.com/en-us/microsoft-edge/tools/vms/ 下载 Virutal Box 的 ova 镜像，密码是 Passw0rd!
6. 地图方向反转问题：MutationObserver, transform: scale(1, -1)
7. 道路中心线算法（多次方程模拟，中心线取点后端逻辑移到前端）、paper.js 画箭头 https://stackoverflow.com/questions/16991895/draw-line-with-arrow-cap

   ```py
   import matplotlib.pyplot as plt
   import numpy as np
   import numpy.polynomial.polynomial as poly

   # https://stackoverflow.com/questions/49037902/how-to-interpolate-a-line-between-two-other-lines-in-python
   def interpolate(a1, a2, poly_deg=3, n_points=10, plot=True):
      min_a1_x, max_a1_x = min(a1[:, 0]), max(a1[:, 0])
      new_a1_x = np.linspace(min_a1_x, max_a1_x, n_points)
      a1_coefs = poly.polyfit(a1[:, 0], a1[:, 1], poly_deg)
      new_a1_y = poly.polyval(new_a1_x, a1_coefs)

      min_a2_x, max_a2_x = min(a2[:, 0]), max(a2[:, 0])
      new_a2_x = np.linspace(min_a2_x, max_a2_x, n_points)
      a2_coefs = poly.polyfit(a2[:, 0], a2[:, 1], poly_deg)
      new_a2_y = poly.polyval(new_a2_x, a2_coefs)

      midx = [np.mean([new_a1_x[i], new_a2_x[i]]) for i in range(n_points)]
      midy = [np.mean([new_a1_y[i], new_a2_y[i]]) for i in range(n_points)]

      if plot:
         plt.plot(a1[:, 0], a1[:, 1], c='black')
         plt.plot(a2[:, 0], a2[:, 1], c='black')
         plt.plot(midx, midy, '--', c='black')
         plt.show()

      return [[x, y] for x, y in zip(midx, midy)]

   a1 = np.array(
      [
         [
               113.38226806372708,
               23.162344275038354
         ],
         [
               113.3822851628109,
               23.163151871405752
         ],
         [
               113.38228818029653,
               23.163380278265958
         ],
         [
               113.3822873421064,
               23.163461918002366
         ],
         [
               113.38228516281187,
               23.163597788651938
         ],
         [
               113.38227460161451,
               23.16384656353636
         ],
         [
               113.38225507178088,
               23.16411109639837
         ],
         [
               113.3822487853537,
               23.164175637052246
         ]
      ]
   )
   a2 = np.array(
      [
         [
               113.38236629963569,
               23.16418460568882
         ],
         [
               113.38238390163173,
               23.163970028969388
         ],
         [
               113.38239580393373,
               23.16377364097953
         ],
         [
               113.38239580393373,
               23.16377364097953
         ],
         [
               113.38239823468551,
               23.16371362655323
         ],
         [
               113.38239823468551,
               23.16371362655323
         ],
         [
               113.3824045211124,
               23.163508018469752
         ],
         [
               113.3824045211118,
               23.16320585086209
         ],
         [
               113.3824045211118,
               23.16320585086209
         ],
         [
               113.38240284473103,
               23.163134185590337
         ],
         [
               113.38240284473103,
               23.163134185590337
         ],
         [
               113.38239907287435,
               23.162987502285524
         ],
         [
               113.38239907287435,
               23.162987502285524
         ],
         [
               113.38239748031269,
               23.162955483415537
         ],
         [
               113.38239748031269,
               23.162955483415537
         ],
         [
               113.38238549419019,
               23.162341592829492
         ]
      ]
   )

   result = interpolate(a1, a2)
   print('result', result)
   ```

8. umi 新架构配置
9. https://www.cyberciti.biz/faq/vim-vi-text-editor-save-file-without-root-permission/ vim 保存文件在 root 下
10. 解压 zip 文件中文乱码，需要使用这个命令 `unzip -O CP936 ./tmp.zip`
11. policy 聚合 mongodb 写法
12. python 时间转换过滤
13. 汇总 sql 优化过程
14. 深入浅出：如何正确使用 protobuf https://zhuanlan.zhihu.com/p/406832315
15. [python 动态修改并发量](https://stackoverflow.com/questions/48483348/how-to-limit-concurrency-with-python-asyncio)

      ```py
      import asyncio
      import time
      import httpx
      import random
      # import uvloop

      start = time.time()
      url = 'https://blog.towavephone.com'

      sem = asyncio.Semaphore(100)

      count = 0
      is_success = True

      async def task(name, client):
         async with sem:
            global count
            global is_success

            if not is_success:
                  return
            for i in range(0, 3):
                  try:
                     result = await client.get(url)
                     if result.status_code == 200:
                        print(name + 'ping ' + url + result.text[0:20], count)
                        break

                     if i == 2:
                        print('------------' + name)
                        is_success = False
                        break
                        # raise asyncio.CancelledError('请求' + name + '取消')
                  except Exception as e:
                     print('Exception:', name, e)

            count = count + 1

            return result.text[0:4]

      async def main():
         async with httpx.AsyncClient() as client:
            # 获取 EventLoop:
            tasks = []
            for i in range(1, 100):
                  tasks.append(task('请求 %s：' % i, client))
            result = await asyncio.gather(*tasks)
            print(result)
      # uvloop.install()
      loop = asyncio.get_event_loop()
      loop.run_until_complete(main())
      end = time.time()
      print("主线程结束，花费时间为：", end - start)
      ```

      ```py
      import asyncio
      import time
      import httpx
      import random
      # import uvloop

      start = time.time()
      url = 'https://blog.towavephone.com'

      count = 0
      is_success = True

      async def task(name, client):
         global count
         global is_success

         if not is_success:
            return
         for i in range(0, 3):
            try:
                  result = await client.get(url)
                  if result.status_code == 200:
                     print(name + 'ping ' + url + result.text[0:20], count)
                     break

                  if i == 2:
                     print('------------' + name)
                     is_success = False
                     break
                     # raise asyncio.CancelledError('请求' + name + '取消')
            except Exception as e:
                  print('Exception:', name, e)

         count = count + 1

         return result.text[0:4]

      # async def main():
      #     async with httpx.AsyncClient() as client:
      #         # 获取 EventLoop:
      #         tasks = []
      #         for i in range(1, 100):
      #             tasks.append(task('请求 %s：' % i, client))
      #         result = await asyncio.gather(*tasks)
      #         print(result)
      # uvloop.install()

      # download(code) is the same

      async def main():
         async with httpx.AsyncClient() as client:
            no_concurrent = 1
            dltasks = set()
            for i in range(100):
                  if len(dltasks) >= no_concurrent:
                     # Wait for some download to finish before adding a new one
                     _done, dltasks = await asyncio.wait(dltasks, return_when=asyncio.FIRST_COMPLETED)

                  dltasks.add(asyncio.create_task(task('请求 %s：' % i, client)))
                  print('----323')
            print('-4345')
            # Wait for the remaining downloads to finish
            await asyncio.wait(dltasks)

      loop = asyncio.get_event_loop()
      loop.run_until_complete(main())
      end = time.time()
      print("主线程结束，花费时间为：", end - start)
      ```

16. 线宽问题解决，需要使用 threejs 的 line2 组件以及对应的 [降级策略](https://registry.khronos.org/webgl/sdk/tests/conformance/limits/gl-line-width.html)，即识别 `gl.ALIASED_LINE_WIDTH_RANGE` 的 `MAX_LINE_WIDTH` 是否大于 1，大于 1 的情况下才需要使用 line2
17. python schedule 任务[并行执行](https://zhuanlan.zhihu.com/p/537722631)
18. 解决一直打印 browerslist 相关提示，设置 `BROWSERSLIST_IGNORE_OLD_DATA=true` 环境变量
19. list append 是原子性的，不需要加锁，可以通过 dis.dis(func) [链接 1](https://docs.python.org/3.6/faq/library.html#what-kinds-of-global-value-mutation-are-thread-safe) [链接 2](https://www.zoulei.net/2016/07/31/list_dict_threading_safe/#) 看出
20. 多线程提交任务时候必须调用 result() 方法，否则不会抛出异常

      ```py
      from concurrent.futures import ThreadPoolExecutor, wait

       def task(n):
           print("Processing {}".format(n))

       with ThreadPoolExecutor() as executor:
           futures = [
               executor.submit(task, 1),
               executor.submit(task, 2),
           ]

           wait(futures)

           for fut in futures:
               # 这句话必须使用，否则不会抛出异常
               fut.result()
      ```

21. 对于 border-radius: 50% 且分布范围较大的框，box-shadow 的形状应为圆形，对应[链接](https://github.com/w3c/csswg-drafts/issues/7103)
22. 封装飞书项目 sdk

      local.json

      ```json
      {
         "mr_lark_project_info": {
            "user_key": "",
            "project_key": "",
            "work_item_type_key": ""
         }
      }
      ```

      `lark_project_utils.py`

      ```py
      import logging
      import time

      import requests
      from entry.settings import (
         LARK_PROJECT_INFO_BASE_URL,
         LARK_PROJECT_INFO_PLUGIN_ID,
         LARK_PROJECT_INFO_PLUGIN_SECRET,
         MR_LARK_PROJECT_INFO_PROJECT_KEY,
         MR_LARK_PROJECT_INFO_USER_KEY,
         MR_LARK_PROJECT_INFO_WORK_ITEM_TYPE_KEY,
      )
      from pydash import py_

      class LarkProjectPlugin:
         """飞书项目插件."""

         instance_count = 0

         def __init__(
            self,
            user_key=None,
            project_key=None,
            work_item_type_key=None,
         ):
            # 基础飞书项目配置
            self.plugin_id = LARK_PROJECT_INFO_PLUGIN_ID
            self.plugin_secret = LARK_PROJECT_INFO_PLUGIN_SECRET
            self.base_url = LARK_PROJECT_INFO_BASE_URL

            # 要操作的飞书项目空间
            self.user_key = user_key
            self.project_key = project_key
            self.work_item_type_key = work_item_type_key

            self.session = requests.Session()
            self.access_token = None
            self.expires_at = 0

            LarkProjectPlugin.instance_count += 1
            logging.debug(
                  "LarkProjectPlugin instance count: %s", LarkProjectPlugin.instance_count
            )

         def _get_access_token(self):
            """获取访问令牌和过期时间."""
            url = f"{self.base_url}/open_api/authen/plugin_token"
            data = {"plugin_id": self.plugin_id, "plugin_secret": self.plugin_secret}
            result = self.session.post(url, json=data)
            res = result.json().get("data")
            return res.get("token"), res.get("expire_time")

         def _refresh_access_token(self):
            """检查访问令牌是否过期，如果过期则重新获取."""
            now = time.time()
            if self.expires_at > now:
                  logging.debug(
                     "LarkProjectPlugin time %s, expires_at %s, not expired",
                     now,
                     self.expires_at,
                  )
                  return

            self.access_token, ttl = self._get_access_token()
            self.expires_at = time.time() + ttl - 10
            logging.debug(
                  "LarkProjectPlugin access_token %s, expires_at %s",
                  self.access_token,
                  self.expires_at,
            )

         def _call_api(self, path, ignore_project_key=False, method="post", **kwargs):
            self._refresh_access_token()

            url = f"{self.base_url}/open_api/{self.project_key}/{path}"

            if ignore_project_key:
                  url = f"{self.base_url}/open_api/{path}"

            headers = {"X-PLUGIN-TOKEN": self.access_token, "X-USER-KEY": self.user_key}
            res = self.session.request(method=method, url=url, headers=headers, **kwargs)
            result = res.json()

            # {'err_code': 30009, 'err_msg': 'Field Not Found', 'err': {'code': 30009, 'msg': ':can not find field', 'log_id': ''}}
            err_code = py_.get(result, "err_code")

            if err_code:
                  err_msg = py_.get(result, "err.msg")
                  raise Exception(f"url: {url}, err msg: {err_msg}")

            return result

         # 获取空间下工作项类型
         def get_work_item_all_types(self):
            path = "work_item/all-types"
            res = self._call_api(
                  path,
                  method="get",
            )
            return res

         # # 获取工作项详情
         # def get_work_item_detail(self, json):
         #     path = f"work_item/{self.work_item_type_key}/query"
         #     res = self._call_api(
         #         path,
         #         json=json,
         #     )
         #     return res

         # 获取用户详情
         def get_user_keys(self, json):
            path = "user/query"
            res = self._call_api(path, json=json, ignore_project_key=True)
            return res

         # 获取指定的工作项列表（单空间-复杂传参）
         def search_single_workspace_complex(self, json):
            path = f"work_item/{self.work_item_type_key}/search/params"
            res = self._call_api(
                  path,
                  json=json,
            )
            return res

         # 通过 dt 号获取工作项详情
         def get_work_item_detail_by_dt(self, dt, **kwargs):
            res = self.search_single_workspace_complex(
                  json={
                     "search_group": {
                        "conjunction": "AND",
                        "search_params": [
                              {
                                 # dt 号对应 field key 为 auto_number，通过获取字段详情接口可以拿到
                                 "param_key": "auto_number",
                                 "value": dt,
                                 "operator": "=",
                              }
                        ],
                     },
                     "page_size": 1,
                     **kwargs,
                  }
            )

            return py_.get(res, "data.0")

         # 获取创建工作项元数据
         def get_work_item_meta(self):
            path = f"work_item/{self.work_item_type_key}/meta"
            res = self._call_api(path, method="get")
            return res

         # 更新工作项
         def update_work_item_detail(self, work_item_id, json):
            path = f"work_item/{self.work_item_type_key}/{work_item_id}"
            res = self._call_api(
                  path,
                  method="put",
                  json=json,
            )
            return res

         # 获取字段详情
         def get_all_field(self):
            path = "field/all"
            res = self._call_api(path, json={"work_item_type_key": self.work_item_type_key})
            return res

      mr_lark_project = LarkProjectPlugin(
         user_key=MR_LARK_PROJECT_INFO_USER_KEY,
         project_key=MR_LARK_PROJECT_INFO_PROJECT_KEY,
         work_item_type_key=MR_LARK_PROJECT_INFO_WORK_ITEM_TYPE_KEY,
      )
      ```

      使用

      ```py
      from lark_project_utils import mr_lark_project

      mr_lark_project.get_work_item_detail_by_dt(
         dt=lark_project_dt, fields=["id"]
      )

      mr_lark_project.update_work_item_detail(
         work_item_id,
         json={"update_fields": update_fields},
      )
      ```
