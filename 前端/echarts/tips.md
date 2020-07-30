### 1.echarts的type 类型为customer类型时候data不可以为[],
```
  为空的时候报错 Cannot read property 'name' of undefined
```
### 2.echarts 当legend过多的时候onlegendclick触发会有延时
```
 当legend过多，大约100多个时候，触发有三到四秒的延迟，在这三四秒时间里面捕获不到事件。
 用dom做一个假的legend，通过dom事件触发
```
