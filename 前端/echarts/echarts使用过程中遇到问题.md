## echarts柱状图在部分ios上数据过多显示不出来的解决方案
```
问题：主要就是在部分的ios上面由于该echarts所要展示的数据超过80条  导致canvas所加载的图像显示不出来

解决：一个不行就多放几个canvas拼接起来就行 每个canvas只显示50条数据就行，（我测试的50条刚好所有的手机把echarts图显示出来没什么问题）
使用dataZoom
```