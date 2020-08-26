## element ui select下拉框在ios移动端需要点击两次才能选中的问题修复
```javascript
项目中使用element ui 的下拉框，在ios上面，当我去选择下拉框的选项，需要点击两次才能选中。
经过在element ui 的github上的issue上面找到解决方法。
解决方法:
添加scss代码：
.el-scrollbar {
> .el-scrollbar__bar {
opacity: 1 !importat;
}
}
```

## element table X轴滚动条在设置固定列时，滚动条在固定列范围内不可拖拽

```javascript
.el-table {
    .el-table__fixed {
      height:auto !important; // 此处的important表示优先于element.style
      bottom:17px; // 改为自动高度后，设置与父容器的底部距离，则高度会动态改变
    }
  }
```

