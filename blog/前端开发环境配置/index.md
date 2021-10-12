---
title: 前端开发环境配置
date: 2021-9-30 13:51:29
categories:
  - 前端
tags: 前端, 开发环境
path: /frontend-devlopment-environment-setting/
draft: true
---

# wsl

wsl1 或 2 或类 linux 环境

1. 配置步骤：https://docs.microsoft.com/zh-cn/windows/wsl/setup/environment 和 https://docs.microsoft.com/zh-cn/windows/dev-environment/javascript/nodejs-on-wsl
2. 注意 wsl2 需要项目路径为 wsl2 的路径，推荐放在 /home/用户名/project 下面；wsl1 没有这个问题，可以直接放在 window 系统，通过 /mnt 访问。原因：安装了 wsl2 之后项目文件却在 windows 系统的情况下会造成文件改动后不能热更新。建议安装 Ubuntu18.04 的 wsl2
3. 开机启动时使用 vscode remote 连接 wsl2 有可能连接失败，可以尝试重启 wsl2，即需要打开 powershell 控制台运行以下命令

   ```bash
   wsl --shutdown
   wsl
   ```

# windows terminal

windows terminal（windows 应用商店安装，以上配置步骤有，设置里面默认启动 Ubuntu18.04）

# ohmyzsh

git 状态显示、命令配色/补全等多项功能，安装步骤：https://github.com/ohmyzsh/ohmyzsh/wiki

## autojump

可以让在任意目录之间进行跳转

```bash
$ brew install autojump
$ vim ~/.zshrc

61 plugins = (
62  git
63  autojump
64 )

$ source ~/.zshrc
```

### 使用 autojump

j + 目录缩写 快速去到你曾经进入过的目录

autojump 会自动对你进入过的目录进行记录并且定义权重，使用 j 命令可以迅速进入目录

```bash
$ j hub # 等价于 cd ~/workspace/github
$ j hub # 如果当前目录不对，可以重复执行该命令，会自动根据权重依次匹配
$ d # 会列出你曾经进入过的目录，输入前面的序号可以直接进入该目录
```

## zsh-syntax-highlighting

命令高亮，安装步骤：https://github.com/zsh-users/zsh-syntax-highlighting/blob/master/INSTALL.md

## zsh-autosuggestions

它能够根据你的命令历史记录即时提示，安装步骤：https://github.com/zsh-users/zsh-autosuggestions/blob/master/INSTALL.md

# vs code

主要是 vs code remote 的安装（连接到 wsl2 开发）

## vs remote

可以远程连接 ssh 进行开发，使用 vs remote 注意 ssh 密钥只能在 window 下不在 wsl 下，且 -i 参数后带的是私钥

# nvm

管理 Node.js 版本，通过 nvm 我们可以同时安装/切换不同的 Node.js 版本，安装步骤：https://github.com/nvm-sh/nvm

在 /home/用户名/.zshrc 下添加以下脚本，才可以在 zsh 中正常运行，否则找不到命令

```bash
export NVM_DIR="\$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "\$NVM_DIR/bash_completion" # This loads nvm bash_completion
```

## 使用命令

```bash
$ nvm ls-remote # 列出所有支持的 Node.js 版本
$ nvm ls # 列出本地已安装的 Node.js 版本
$ nvm install 11.5.0 # 安装指定的 Node.js 版本
$ nvm alias default 11 # 设置默认使用的版本
```

# nrm

使用 nrm 可以让我们来切换不同的 npm 源而不用单独安装 cnpm 之类的库，安装步骤：https://github.com/Pana/nrm

## 使用命令

```bash
$ nrm ls # 列出当前支持切换的源
$ nrm use taobao # 使用 taobao 的源作为默认的 npm 源
```

# sass 编译

如果项目中有 sass 存在则需要 python 编译，需要以下处理

- 安装 `python2 sudo apt-get install python2.7`
- 在 /home/用户名/.zshrc 下添加以下脚本

  ```bash
  alias python="/usr/bin/python2.7" # 解决 sass 编译问题，需提前安装
  python2 alias python2="/usr/bin/python2.7" # 解决 sass 编译问题，需提前安装 python2
  ```

# ssh 免密登录

1. `ssh-copy-id -i /home/tubt/.ssh/id_rsa.pub 用户名@ip`
2. 输入具体密码
3. `ssh 用户名@ip` 这里即可免密登录

# 日常工作顺序

`` win + ` ``（打开 window terminal） + `ctrl + shift + t`（建立新的窗口）+ `j hub`（使用 autojump 的 j 命令快速跳转到 github 目录）+ `code .`（在 vscode 打开）+ `f11`（窗口全屏）

# 完整的 .zshrc 配置

```bash
# If you come from bash you might have to change your $PATH.
export PATH=$HOME/bin:/usr/local/bin:$PATH

# Path to your oh-my-zsh installation.
export ZSH=$HOME/.oh-my-zsh

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# Set name of the theme to load --- if set to "random", it will
# load a random theme each time oh-my-zsh is loaded, in which case,
# to know which specific one was loaded, run: echo $RANDOM_THEME
# See https://github.com/ohmyzsh/ohmyzsh/wiki/Themes
ZSH_THEME="lukerandall"

# Set list of themes to pick from when loading at random
# Setting this variable when ZSH_THEME=random will cause zsh to load
# a theme from this variable instead of looking in $ZSH/themes/
# If set to an empty array, this variable will have no effect.
# ZSH_THEME_RANDOM_CANDIDATES=( "robbyrussell" "agnoster" )

# Uncomment the following line to use case-sensitive completion.
# CASE_SENSITIVE="true"

# Uncomment the following line to use hyphen-insensitive completion.
# Case-sensitive completion must be off. _ and - will be interchangeable.
# HYPHEN_INSENSITIVE="true"

# Uncomment the following line to disable bi-weekly auto-update checks.
# DISABLE_AUTO_UPDATE="true"

# Uncomment the following line to automatically update without prompting.
# DISABLE_UPDATE_PROMPT="true"

# Uncomment the following line to change how often to auto-update (in days).
# export UPDATE_ZSH_DAYS=13

# Uncomment the following line if pasting URLs and other text is messed up.
# DISABLE_MAGIC_FUNCTIONS="true"

# Uncomment the following line to disable colors in ls.
# DISABLE_LS_COLORS="true"

# Uncomment the following line to disable auto-setting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment the following line to enable command auto-correction.
# ENABLE_CORRECTION="true"

# Uncomment the following line to display red dots whilst waiting for completion.
# Caution: this setting can cause issues with multiline prompts (zsh 5.7.1 and newer seem to work)
# See https://github.com/ohmyzsh/ohmyzsh/issues/5765
# COMPLETION_WAITING_DOTS="true"

# Uncomment the following line if you want to disable marking untracked files
# under VCS as dirty. This makes repository status check for large repositories
# much, much faster.
# DISABLE_UNTRACKED_FILES_DIRTY="true"

# Uncomment the following line if you want to change the command execution time
# stamp shown in the history command output.
# You can set one of the optional three formats:
# "mm/dd/yyyy"|"dd.mm.yyyy"|"yyyy-mm-dd"
# or set a custom format using the strftime function format specifications,
# see 'man strftime' for details.
# HIST_STAMPS="mm/dd/yyyy"

# Would you like to use another custom folder than $ZSH/custom?
# ZSH_CUSTOM=/path/to/new-custom-folder

# Which plugins would you like to load?
# Standard plugins can be found in $ZSH/plugins/
# Custom plugins may be added to $ZSH_CUSTOM/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
# Add wisely, as too many plugins slow down shell startup.
plugins=(git autojump zsh-syntax-highlighting zsh-autosuggestions)

source $ZSH/oh-my-zsh.sh

# User configuration

# export MANPATH="/usr/local/man:$MANPATH"

# You may need to manually set your language environment
# export LANG=en_US.UTF-8

# Preferred editor for local and remote sessions
# if [[ -n $SSH_CONNECTION ]]; then
#   export EDITOR='vim'
# else
#   export EDITOR='mvim'
# fi

# Compilation flags
# export ARCHFLAGS="-arch x86_64"

# Set personal aliases, overriding those provided by oh-my-zsh libs,
# plugins, and themes. Aliases can be placed here, though oh-my-zsh
# users are encouraged to define aliases within the ZSH_CUSTOM folder.
# For a full list of active aliases, run `alias`.
#
# Example aliases
# alias zshconfig="mate ~/.zshrc"
# alias ohmyzsh="mate ~/.oh-my-zsh"
alias python="/usr/bin/python2.7" # 解决 sass 编译问题，需提前安装 python2
alias python2="/usr/bin/python2.7" # 解决 sass 编译问题，需提前安装 python2

CODE_PATH=`which code`
```
