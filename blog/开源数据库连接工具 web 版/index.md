---
title: 数据库连接工具 web 版
categories:
   - 后端
path: /database-connection-tool-web-based/
tags: 后端, 数据库, 预研
date: 2025-10-23 16:40:42
---

# 介绍

dbgate 支持多种数据库连接，详见 https://github.com/dbgate/dbgate?tab=readme-ov-file

# Dockerfile

以下是开发过程中用到的连接格式

```yml
version: '3'
services:
   dbgate:
      image: dbgate/dbgate
      restart: always
      # network_mode: host
      extra_hosts:
         - 'host.docker.internal:host-gateway'
      ports:
         - 3010:3000
      volumes:
         - dbgate-data:/root/.dbgate
      environment:
         # LOGIN: user1,user2

         # 这里可以配置登录用户的账号密码，不配置的默认不要密码
         # LOGIN_PASSWORD_user1: xxxx
         # LOGIN_PASSWORD_user2: xxxx

         # 这里配置哪些用户能看到哪些数据库连接
         # LOGIN_PERMISSIONS_user1: ~connections/*,connections/con1,connections/con2
         # LOGIN_PERMISSIONS_user2: ~connections/*,connections/con3

         CONNECTIONS: con1,con2,con3

         LABEL_con1: 正式服
         SERVER_con1: xxxx
         USER_con1: xxxx
         PASSWORD_con1: xxxx
         PORT_con1: 5432
         ENGINE_con1: postgres@dbgate-plugin-postgres

         LABEL_con2: 正式服
         # 格式为：mongodb://用户名:密码@地址:端口/数据库名
         # 密码里面遇到 # 需要转义成 %23
         # 遇到不是分片的 mongo 数据库时候需要加上 ?directConnection=true 查询字符串
         URL_con2: xxxx
         ENGINE_con2: mongo@dbgate-plugin-mongo

         LABEL_con3: 本地（读写）
         SERVER_con3: host.docker.internal
         PORT_con3: 6379
         ENGINE_con3: redis@dbgate-plugin-redis

volumes:
   dbgate-data:
      driver: local
```

# 启动

```bash
docker-compose -f ./dbgate.yml up -d
```

打开 http://localhost:3010
