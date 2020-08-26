# nrm

nrm 是一个 js 模块，类似 vue-cli，是一个命令行工具，可以用来快速切换 npm 源。

安装

```
npm install -g nrm
```

看看有哪些源供我选择

类似 linux 里的 ls，列出可供选择的源

```
nrm ls
```

 

```
nrm use taobao
```

这样，就切换到了淘宝的源，下载速度接近网速了。

查看使用的源

```
npm config get registry
```

 

```
nrm use npm
```

这样，就切换到了官方源，登录、发布代码到操作就可以正常进行了

之后安装模块还是用 npm install vue，而不是nrm install vue，nrm 只用来切换源