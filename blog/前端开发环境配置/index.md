---
title: 前端开发环境配置
date: 2021-9-30 13:51:29
categories:
   - 前端
tags: 前端, 开发环境
path: /frontend-devlopment-environment-setting/
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

## powerlevel10k

高性能 zsh 主题，安装步骤：https://github.com/romkatv/powerlevel10k

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

## 针对 zsh 启动性能的优化

由于 nvm 以上脚本导致在启动 zsh 时延时较高，所以优化脚本如下

```bash
if [ -s "$HOME/.nvm/nvm.sh" ]; then
  export NVM_DIR="$HOME/.nvm"
  nvm_cmds=(nvm node npm yarn)
  for cmd in $nvm_cmds ; do
    alias $cmd="unalias $nvm_cmds && unset nvm_cmds && . $NVM_DIR/nvm.sh && $cmd"
  done
fi
```

大致原理就是在运行 `nvm/node/npm/yarn` 相关命令时触发 nvm 的初始化

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

# 命令行打开程序

## xdg-open

命令行打开文件、目录、网址等等，但是打开文件时没有使用 windows 的默认打开方式

```bash
# 安装 xdg-utils 工具包
sudo apt-get install xdg-utils
# 打开目录
xdg-open .
# 打开文件（这里没有调用 windows 的记事本打开）
xdg-open example.txt
# 打开网址
xdg-open https://baidu.com
```

以下使用 wsl-open 可以做到用 windows 的默认方式打开

## wsl-open

用 windows 的默认方式打开

```bash
# 安装 wsl-open
npm install -g wsl-open
# 打开目录
wsl-open .
# 打开文件
wsl-open example.txt
wsl-open example.png
# 打开网址
wsl-open https://baidu.com
```

可以在 .zshrc 设置如下一行，直接使用 `open` 命令

```bash
alias open='wsl-open'
```

# 外网访问 wsl

## 设置端口转发到 wsl

### 查看、复制 ip

需要在 windows 上做端口转发，否则同一局域网内不能访问到 wsl，以下使用 powershell 命令

首先在 wsl 查看 ip

```bash
hostname -I | awk '{print $1}'
```

同样也可以在 .zshrc 中配置别名，这里顺便把获取 windows 的地址配置了，也实现了复制 ip 的功能

```bash
alias wsl_ip="hostname -I | awk '{print $1}'"
alias windows_ip="cat /etc/resolv.conf | grep nameserver | cut -d ' ' -f 2"
alias copy_wsl_ip="wsl_ip | clip.exe"
alias copy_windows_ip="windows_ip | clip.exe"
alias cwsl="copy_wsl_ip"
alias cwin="copy_windows_ip"
```

### 设置端口转发

在 powershell 命令行上操作，powershell 新窗口打开提升管理员权限

```powershell
powershell start-process cmd -verb runas
```

端口转发，这样设置后就能通过访问 `http://{windows的ip}:3000` 进而访问 wsl，当然端口号不一定要一样，你也可以用 7101 转发 7001

```powershell
netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=3000 connectaddress=wsl的ip connectport=3000
```

显示所有转发端口

```powershell
netsh interface portproxy show all
```

如果要删除某一条规则，命令如下

```powershell
netsh interface portproxy delete v4tov4 listenaddress=0.0.0.0 listenport=14000
```

如果要清空列表，使用以下命令

```powershell
netsh interface portproxy reset
```

如果此时还不能访问，还需要注意的步骤有（以下假设需要用手机去访问同一局域网的电脑）

1. 关闭 windows 防火墙
2. 手机，电脑在同一局域网

## 移动端真机调试

### 背景

wsl2 运行 spy-debugger 命令后，windows 上的浏览器却打不开调试界面

### 产生原因

经分析是 spy-debugger 在 windows 上访问了 `127.0.0.1` 网址，而这个网址是不能访问到 wsl2 的

### 解决方案

针对 wsl2 运行 spy-debugger 却不能代理的问题，直接在 windows 上运行 spy-debugger 来代替（这里同样需要配置端口转发，因为项目是跑在 wsl2 上）

# 快捷键

## window terminal

- `ctrl + shift + t`：打开 window terminal（快捷方式自定义命令）
- `ctrl + tab`：切换命令行 tab
- `ctrl + shift + d`：复制已有的命令行 tab
- `ctrl + shift + 1/4`：打开新的 powershell/wsl 命令行 tab
- `ctrl + shift + w`：关闭当前命令行 tab

## git

以下是 zsh 的 git 插件提供的快捷命令

```bash
alias g='git'

alias ga='git add'
alias gaa='git add --all'
alias gapa='git add --patch'
alias gau='git add --update'
alias gap='git apply'

alias gb='git branch'
alias gba='git branch -a'
alias gbd='git branch -d'
alias gbda='git branch --no-color --merged | command grep -vE "^(\*|\s*(master|develop|dev)\s*$)" | command xargs -n 1 git branch -d'
alias gbl='git blame -b -w'
alias gbnm='git branch --no-merged'
alias gbr='git branch --remote'
alias gbs='git bisect'
alias gbsb='git bisect bad'
alias gbsg='git bisect good'
alias gbsr='git bisect reset'
alias gbss='git bisect start'

alias gc='git commit -v'
alias gc!='git commit -v --amend'
alias gcn!='git commit -v --no-edit --amend'
alias gca='git commit -v -a'
alias gca!='git commit -v -a --amend'
alias gcan!='git commit -v -a --no-edit --amend'
alias gcans!='git commit -v -a -s --no-edit --amend'
alias gcam='git commit -a -m'
alias gcsm='git commit -s -m'
alias gcb='git checkout -b'
alias gcf='git config --list'
alias gcl='git clone --recursive'
alias gclean='git clean -fd'
alias gpristine='git reset --hard && git clean -dfx'
alias gcm='git checkout master'
alias gcd='git checkout develop'
alias gcmsg='git commit -m'
alias gco='git checkout'
alias gcount='git shortlog -sn'
compdef _git gcount
alias gcp='git cherry-pick'
alias gcpa='git cherry-pick --abort'
alias gcpc='git cherry-pick --continue'
alias gcs='git commit -S'

alias gd='git diff'
alias gdca='git diff --cached'
alias gdcw='git diff --cached --word-diff'
alias gdct='git describe --tags `git rev-list --tags --max-count=1`'
alias gdt='git diff-tree --no-commit-id --name-only -r'
alias gdw='git diff --word-diff'

alias gf='git fetch'
alias gfa='git fetch --all --prune'
alias gfo='git fetch origin'

alias gg='git gui citool'
alias gga='git gui citool --amend'

alias ggpur='ggu'

alias ggpull='git pull origin $(git_current_branch)'

alias ggpush='git push origin $(git_current_branch)'

alias ggsup='git branch --set-upstream-to=origin/$(git_current_branch)'
alias gpsup='git push --set-upstream origin $(git_current_branch)'

alias ghh='git help'

alias gignore='git update-index --assume-unchanged'
alias gignored='git ls-files -v | grep "^[[:lower:]]"'
alias git-svn-dcommit-push='git svn dcommit && git push github master:svntrunk'

alias gk='\gitk --all --branches'
alias gke='\gitk --all $(git log -g --pretty=%h)'

alias gl='git pull'
alias glg='git log --stat'
alias glgp='git log --stat -p'
alias glgg='git log --graph'
alias glgga='git log --graph --decorate --all'
alias glgm='git log --graph --max-count=10'
alias glo='git log --oneline --decorate'
alias glol="git log --graph --pretty='%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset'"
alias glod="git log --graph --pretty='%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%ad) %C(bold blue)<%an>%Creset'"
alias glods="git log --graph --pretty='%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%ad) %C(bold blue)<%an>%Creset' --date=short"
alias glola="git log --graph --pretty='%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --all"
alias glog='git log --oneline --decorate --graph'
alias gloga='git log --oneline --decorate --graph --all'
alias glp="_git_log_prettily"
compdef _git glp=git-log

alias gm='git merge'
alias gmom='git merge origin/master'
alias gmt='git mergetool --no-prompt'
alias gmtvim='git mergetool --no-prompt --tool=vimdiff'
alias gmum='git merge upstream/master'
alias gma='git merge --abort'

alias gp='git push'
alias gpd='git push --dry-run'
alias gpoat='git push origin --all && git push origin --tags'
compdef _git gpoat=git-push
alias gpu='git push upstream'
alias gpv='git push -v'

alias gr='git remote'
alias gra='git remote add'
alias grb='git rebase'
alias grba='git rebase --abort'
alias grbc='git rebase --continue'
alias grbd='git rebase develop'
alias grbi='git rebase -i'
alias grbm='git rebase master'
alias grbs='git rebase --skip'
alias grh='git reset'
alias grhh='git reset --hard'
alias grmv='git remote rename'
alias grrm='git remote remove'
alias grset='git remote set-url'
alias grt='cd $(git rev-parse --show-toplevel || echo ".")'
alias gru='git reset --'
alias grup='git remote update'
alias grv='git remote -v'

alias gsb='git status -sb'
alias gsd='git svn dcommit'
alias gsi='git submodule init'
alias gsps='git show --pretty=short --show-signature'
alias gsr='git svn rebase'
alias gss='git status -s'
alias gst='git status'
alias gsta='git stash save'
alias gstaa='git stash apply'
alias gstc='git stash clear'
alias gstd='git stash drop'
alias gstl='git stash list'
alias gstp='git stash pop'
alias gsts='git stash show --text'
alias gsu='git submodule update'

alias gts='git tag -s'
alias gtv='git tag | sort -V'

alias gunignore='git update-index --no-assume-unchanged'
alias gunwip='git log -n 1 | grep -q -c "\-\-wip\-\-" && git reset HEAD~1'
alias gup='git pull --rebase'
alias gupv='git pull --rebase -v'
alias glum='git pull upstream master'

alias gwch='git whatchanged -p --abbrev-commit --pretty=medium'
alias gwip='git add -A; git rm $(git ls-files --deleted) 2> /dev/null; git commit --no-verify -m "--wip-- [skip ci]"'
```

# 日常工作顺序

`ctrl + shift + t`（打开 window terminal）+ `j hub`（使用 autojump 的 j 命令快速跳转到 github 目录）+ `yarn start`（执行脚本）+ `ctrl + shift + d`（复制已有的命令行 tab） + `code .`（在 vscode 打开） + `f11`（窗口全屏）

> 注：`ctrl + shift + t` 需要将 window terminal 快捷方式拖到桌面并设置此快捷键，否则按下没反应

# 完整的 .zshrc 配置

```bash
# 开启 powerlevel10k 主题的即时提示功能
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

# ZSH 安装路径
export ZSH=$HOME/.oh-my-zsh

# nvm 初始化脚本（延时触发）
if [ -s "$HOME/.nvm/nvm.sh" ]; then
  export NVM_DIR="$HOME/.nvm"
  nvm_cmds=(nvm node npm yarn)
  for cmd in $nvm_cmds ; do
    alias $cmd="unalias $nvm_cmds && unset nvm_cmds && . $NVM_DIR/nvm.sh && $cmd"
  done
fi

# 主题设置为 powerlevel10k
ZSH_THEME="powerlevel10k/powerlevel10k"

# 插件列表
plugins=(git autojump zsh-syntax-highlighting zsh-autosuggestions)

# 运行 zsh 配置
source $ZSH/oh-my-zsh.sh

# 别名设置

# 解决 sass 编译问题，需提前安装 python2
alias python="/usr/bin/python2.7"
# 解决 sass 编译问题，需提前安装 python2
alias python2="/usr/bin/python2.7"
# 打开方式别名
alias open="wsl-open"

# ip 命令别名
alias wsl_ip="hostname -I | awk '{print $1}'"
alias windows_ip="cat /etc/resolv.conf | grep nameserver | cut -d ' ' -f 2"
alias copy_wsl_ip="wsl_ip | clip.exe"
alias copy_windows_ip="windows_ip | clip.exe"
alias cwsl="copy_wsl_ip"
alias cwin="copy_windows_ip"

# 运行 powerlevel10k 主题配置
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh
```
