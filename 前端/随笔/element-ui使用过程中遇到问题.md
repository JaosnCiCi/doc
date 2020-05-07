## element ui select下拉框在ios移动端需要点击两次才能选中的问题修复
```
项目中使用element ui 的下拉框，在ios上面，当我去选择下拉框的选项，需要点击两次才能选中。
经过在element ui 的github上的issue上面找到解决方法。
解决方法:
添加scss代码：
.el-scrollbar {
> .el-scrollbar__bar {
opacity: 1 !important;
}
}
```