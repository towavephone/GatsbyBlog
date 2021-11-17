---
title: 代码生成脚手架搭建
categories:
   - 前端工程化
path: /code-generation-scaffolding/
tags: 前端, 前端工程化, 预研
date: 2021-11-15 11:43:19
draft: true
---

# 需求背景

由于 C 端营销线新建项目需要模板化，需要代码模板的生成功能，以便统一技术栈

# 一期

一期代码生成需要在 lerna 工程下去做改造，除了带有代码模板的功能，还封装了执行脚本的入口

参考链接：[react-boilerplate](https://github.com/react-boilerplate/react-boilerplate)

> 这里的代码模板包含项目级别的代码模板、页面级别的代码模板，目前只完成了项目的代码模板生成

## 目录结构

```js
.
├── index.html
├── internals
│   ├── generators
│   │   ├── index.js // 模板代码执行主入口
│   │   ├── package // 模板文件夹，带有模板变量的文件后缀名为 hbs
│   │   │   ├── config.js.hbs
│   │   │   ├── index.js // 项目级别的代码模板命令执行入口
│   │   │   ├── package-lock.json.hbs
│   │   │   ├── package.json.hbs // 带模板变量的模板文件
│   │   │   └── template // 不带模板变量的模板文件
│   │   ├── page
│   │   │   └── index.js // 页面级别的代码模板命令执行入口
│   │   └── utils
│   │       ├── directoryExists.js // 检测 packages 文件夹存在性
│   │       └── fileKeyExists.js // 检测 packages 下面文件里面某种属性是否存在，主要为了实现端口占用检测功能
│   └── scripts
│       ├── helpers
│       │   └── argv.js // 命令行参数封装
│       └── run.js // 脚本执行主入口
├── packages // 项目源代码，即代码模板生成后的结果文件夹
|   ├── demo1
│   └── demo2
├── lerna.json
├── package-lock.json
├── package.json // 命令主入口
└── readme.md
```

## 脚本主入口

package.json

```json
{
   "name": "root",
   "private": true,
   "devDependencies": {
      "cross-env": "^7.0.3",
      "lerna": "^4.0.0",
      "minimist": "^1.2.5",
      "plop": "^2.7.4",
      "shelljs": "^0.8.4"
   },
   "scripts": {
      "postinstall": "lerna bootstrap",
      "start": "node internals/scripts/run --cmd=start",
      "build": "node internals/scripts/run --cmd=build",
      "generate": "plop --plopfile internals/generators/index.js"
   }
}
```

## 模板代码生成

### 模板代码执行主入口

internals/generators/index.js

```js
const shell = require('shelljs');

const packageGenerator = require('./package/index.js');

module.exports = (plop) => {
   plop.setGenerator('package', packageGenerator); // 注册 package 下的命令
   // plop.setGenerator("page", containerGenerator);
   plop.setDefaultInclude({ actionTypes: true });
   // 拓展 plop 复制功能
   plop.setActionType('copy', (answers, config, plop) => {
      const src = plop.renderString(config.src, answers);
      const dest = plop.renderString(config.dest, answers);
      shell.cp('-r', src, dest);
   });
};
```

### 检测 packages 文件夹存在性

internals/generators/utils/directoryExists.js

```js
const fs = require('fs');
const path = require('path');

/**
 *
 * @param {*} directoryPath 文件夹路径
 * @param {*} value 输入的值
 * @returns
 */
function directoryExists(directoryPath, value) {
   const directoryFullPath = path.join(
      process.cwd(),
      ...(Array.isArray(directoryPath) ? directoryPath : [directoryPath])
   );
   if (fs.existsSync(directoryFullPath) && fs.statSync(directoryFullPath).isDirectory()) {
      const packages = fs.readdirSync(directoryFullPath);
      return packages.indexOf(value) >= 0;
   }
   return false;
}

module.exports = directoryExists;
```

### 检测 packages 下面文件里面某种属性是否存在

主要为了实现端口占用检测功能

internals/generators/utils/fileKeyExists.js

```js
const fs = require('fs');
const path = require('path');
const packagesPath = path.join(process.cwd(), 'packages');
const packages = fs.readdirSync(packagesPath);
const lodash = require('lodash');

/**
 * 检测 packages 下面文件里面某种属性是否存在
 * @param {*} filePath 文件路径
 * @param {*} key 文件的属性
 * @param {*} defaultValue 属性不存在时的默认值
 * @param {*} value 输入的值
 * @returns
 */
function fileKeyExists(filePath, key, defaultValue, value) {
   const values = [];
   packages.forEach((item) => {
      if (item !== 'js-bridge') {
         const fileFullPath = path.join(packagesPath, item, ...(Array.isArray(filePath) ? filePath : [filePath]));
         if (fs.existsSync(fileFullPath) && fs.statSync(fileFullPath).isFile()) {
            const fileResult = require(fileFullPath);
            const fileKeyValue = lodash.get(fileResult, key);
            if (fileKeyValue) {
               values.push(fileKeyValue);
            } else {
               values.push(defaultValue);
            }
         } else {
            values.push(defaultValue);
         }
      }
   });
   return values.map((item) => `${item}`).indexOf(value) >= 0;
}

module.exports = fileKeyExists;
```

### 项目级别的代码模板命令执行入口

internals/generators/package/index.js

```js
const directoryExists = require('../utils/directoryExists');
const fileKeyExists = require('../utils/fileKeyExists');

const portExists = (value) =>
   fileKeyExists('config.js', 'serverPort', 3000, value) || fileKeyExists('config.js', 'fePort', 8888, value);

module.exports = {
   description: '生成 package',
   prompts: [
      {
         type: 'input',
         name: 'name',
         message: 'package 叫什么名字？',
         default: 'demo',
         validate: (value) => {
            if (/.+/.test(value)) {
               return directoryExists('packages', value) ? 'package 名字已存在' : true;
            }

            return 'package 名字必填';
         }
      },
      {
         type: 'input',
         name: 'serverPort',
         message: 'package 的 Node.js 服务端口？',
         default: '8001',
         validate: (value) => {
            if (/.+/.test(value)) {
               return portExists(value) ? '要设置 package 的 Node.js 服务端口已被占用' : true;
            }

            return 'package 名字必填';
         }
      },
      {
         type: 'input',
         name: 'fePort',
         message: 'package 的 webpack-dev-server 端口？',
         default: '8002',
         validate: (value) => {
            if (/.+/.test(value)) {
               return portExists(value) ? '要设置 package 的 webpack-dev-server 端口已被占用' : true;
            }

            return 'package 名字必填';
         }
      }
   ],
   actions: (data) => {
      const actions = [
         {
            type: 'copy',
            src: 'internals/generators/package/template',
            dest: 'packages/{{ dashCase name }}'
         },
         {
            type: 'addMany',
            templateFiles: 'package/*.hbs',
            destination: '../../packages/{{ dashCase name }}/'
         }
      ];

      return actions;
   }
};
```

### 带模板变量的模板文件

hbs 文件为模板文件，所有需要替换的地方用 `{{}}` 模板变量，详情请查看 [plop](https://github.com/plopjs/plop)，其他模板文件不再举例

internals/generators/package/config.js.hbs

```hbs
module.exports = {
  prefix: 'page',
  serverPort: {{ serverPort }},
  fePort: {{ fePort }}
}
```

### 运行结果

以下是检测存在冲突的情况

![代码生成冲突检测](./res/code-generation.gif)

## 脚本执行封装

封装 lerna 脚本，以实现脚本的并行执行

internals/scripts/helpers/argv.js

```js
module.exports = require('minimist')(process.argv.slice(2));
```

internals/scripts/run.js

```js
#!/usr/bin/env node

const shelljs = require('shelljs');
const argv = require('./helpers/argv');

let scopeParams = [];
const arguments = argv._;

if (arguments && arguments.length > 0) {
   scopeParams = arguments.map((item) => `--scope=${item}`);
}

shelljs.exec(`
  cross-env FORCE_COLOR=1 lerna run ${argv.cmd} --stream --parallel ${scopeParams.join(' ')}
`);
```

### 使用说明

```bash
npm i # 安装依赖

# 启动
npm start # 并行启动所有 package
npm start website # 启动 website 项目
npm start website demo # 并行启动 website,demo 项目

# 编译
npm run build # 并行编译所有 package
npm run build website # 编译 package 项目
npm run build website demo # 并行编译 website,demo 项目

# 模板代码生成
npm run generate
```

# 二期

由于项目代码需要分离，不再使用 lerna 管理各个产品线的包，所以二期主要工作在于封装成可用的命令行，以便直接使用它来新建项目

参考链接：[从 0-1 搭建 react，ts 脚手架](https://juejin.cn/post/6919308174151385096)

## 目录结构

```js
.
├── bin
│   └── cli.js // 脚本主入口
├── internals
│   ├── generators
│   │   ├── index.js // 模板代码生成
│   │   ├── package
│   │   │   ├── config.js.hbs
│   │   │   ├── index.js
│   │   │   ├── package-lock.json.hbs
│   │   │   ├── package.json.hbs
│   │   │   └── template
│   │   ├── page
│   │   │   └── index.js
│   │   └── utils
│   │       ├── directoryExists.js
│   │       └── fileKeyExists.js
│   └── scripts
│       ├── helpers
│       │   └── argv.js
│       └── run.js
├── package-lock.json
├── package.json
├── src
│   ├── create.js // 模板代码生成主入口
│   └── start.js
└── utils
    └── index.js
```

## 脚本主入口

package.json

```json
{
   "name": "cli",
   "version": "1.0.0",
   "description": "销服C端脚手架",
   "main": "index.js",
   "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "start": "node internals/scripts/run --cmd=start",
      "build": "node internals/scripts/run --cmd=build"
   },
   "bin": {
      "cli": "./bin/cli.js"
   },
   "author": "",
   "license": "ISC",
   "dependencies": {
      "commander": "^8.2.0",
      "cross-env": "^7.0.3",
      "minimist": "^1.2.5",
      "plop": "^2.7.4",
      "shelljs": "^0.8.4"
   }
}
```

## 模板代码生成

以下仅列出和一期的不同点

### 模板代码执行主入口

相比一期主要多了新建项目后 `npm install` 的功能

bin/cli.js

```js
#!/usr/bin/env node
const program = require('commander');
const create = require('../src/create');
// const start = require("../src/start");

const { green } = require('../utils');

program.version('1.0.0');

/* create a project */
program
   .command('create')
   .description('create a project ')
   .action(function() {
      green('👽 👽 👽 ' + '欢迎使用 rux, 轻松构建 react ts 项目～🎉🎉🎉');
      create();
   });

/* start project */
program
   .command('start')
   .description('start a project')
   .action(function() {
      green('--------运行项目-------');
      start('start').then(() => {
         green('-------✅  ✅运行完成-------');
      });
   });

program.parse(process.argv);
```

internals/generators/index.js

```js
const shell = require('shelljs');
const { spawn } = require('child_process');

const packageGenerator = require('./package/index.js');

const didSucceed = (code) => `${code}` === '0';

function npmInstall(answers, config, plop) {
   const path = plop.renderString(config.path, answers);
   const spawnOptions = config.verbose
      ? {
           cwd: path,
           shell: true,
           stdio: 'inherit'
        }
      : {
           cwd: path
        };

   return new Promise((resolve, reject) => {
      const npmI = spawn('npm', ['install'], spawnOptions);

      npmI.on('close', (code) => {
         if (didSucceed(code)) {
            resolve(`npm install ran correctly`);
         } else {
            reject(`npm install exited with ${code}`);
         }
      });
   });
}

module.exports = (plop) => {
   plop.setGenerator('package', packageGenerator);
   // plop.setGenerator("page", containerGenerator);
   plop.setDefaultInclude({ actionTypes: true });
   plop.setActionType('copy', (answers, config, plop) => {
      const src = plop.renderString(config.src, answers);
      const dest = plop.renderString(config.dest, answers);
      shell.cp('-r', src, dest);
   });
   plop.setActionType('npmInstall', npmInstall);
};
```

### 项目级别的代码模板命令执行入口

相比一期增加 `npm install` 逻辑

```js
const directoryExists = require('../utils/directoryExists');
const fileKeyExists = require('../utils/fileKeyExists');

const portExists = (value) =>
   fileKeyExists('config.js', 'serverPort', 3000, value) || fileKeyExists('config.js', 'fePort', 8888, value);

module.exports = {
   description: '生成 package',
   prompts: [
      {
         type: 'input',
         name: 'name',
         message: 'package 叫什么名字？',
         default: 'demo',
         validate: (value) => {
            if (/.+/.test(value)) {
               return directoryExists('packages', value) ? 'package 名字已存在' : true;
            }

            return 'package 名字必填';
         }
      },
      {
         type: 'input',
         name: 'serverPort',
         message: 'package 的 Node.js 服务端口？',
         default: '8001',
         validate: (value) => {
            if (/.+/.test(value)) {
               return portExists(value) ? '要设置 package 的 Node.js 服务端口已被占用' : true;
            }

            return 'package 名字必填';
         }
      },
      {
         type: 'input',
         name: 'fePort',
         message: 'package 的 webpack-dev-server 端口？',
         default: '8002',
         validate: (value) => {
            if (/.+/.test(value)) {
               return portExists(value) ? '要设置 package 的 webpack-dev-server 端口已被占用' : true;
            }

            return 'package 名字必填';
         }
      }
   ],
   actions: (data) => {
      const actions = [
         {
            type: 'copy',
            src: 'internals/generators/package/template',
            dest: 'packages/{{ dashCase name }}'
         },
         {
            type: 'addMany',
            templateFiles: 'package/*.hbs',
            destination: '../../packages/{{ dashCase name }}/'
         },
         {
            type: 'npmInstall',
            path: `packages/{{ dashCase name }}/`
         }
      ];

      return actions;
   }
};
```

### 运行结果

```bash
$ cli create
👽 👽 👽 欢迎使用 rux, 轻松构建 react ts 项目～🎉🎉🎉
? package 叫什么名字？ (demo) 项目路径/packages
? package 叫什么名字？ demo
? package 的 Node.js 服务端口？ 8001
? package 的 webpack-dev-server 端口？ 8002
✔  copy
✔  +! 3 files added
 -> 项目路径/packages/demo/config.js
 -> 项目路径/packages/demo/package-lock.json
 -> 项目路径/packages/demo/package.json
✔  npmInstall npm install ran correctly
```

// TODO 代码生成脚手架还在完成中
