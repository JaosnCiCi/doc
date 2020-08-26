# Django开始项目踩坑之路

1. pip安装插件提示pip版本过低时，需要升级版本，升级版本成功之后，

```
pip --version
```

还是显示的是老版本，此时需要

```
1. curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
2. python get-pip.py
```

都成功之后，pip --version检查，版本信息已经可以显示最新的版本了，此时可以继续安装插件了。

2. 