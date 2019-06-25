##flex弹性盒子布局
```
 .box{
     display:flex;
     display:-webkit-flex;
 }
```
注意，设为 Flex 布局以后，子元素的float、clear和vertical-align属性将失效。

###flex主要配置

1.容器属性
| 属性 | 描述 | 配置项 |
| :--- | :--- | :--- | :--- |
| flex-direction | 主轴的方向（即项目的排列方向）| row,row-reverse,column,column-reverse |
|flex-wrap|是否换行|nowrap,wrap,wrap-reverse;|
|flex-flow|flex-direction+flex-wrap|默认值row nowrap|
|justify-content|项目在主轴上的对齐方式|flex-start,flex-end,center,space-between,space-around;|
|align-items|项目在交叉轴上如何对齐|flex-start,flex-end,center,baseline,stretch;|
|align-content|定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用|flex-start,flex-end,center,space-between,space-around,stretch;|
2.项目属性，flex-item上的属性
| 属性 | 描述 | 配置项 |
| :--- | :--- | :--- | :--- |
| order | 定义项目的排列顺序。数值越小，排列越靠前，默认为0| number |
|flex-grow|属性定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大|number|
|flex-shrink|项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。|number|
|flex-basis|定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小。|length,auto|
|flex|flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto。后两个属性可选。|0 1 auto|
|align-self|允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性。默认值为auto，表示继承父元素的align-items属性，如果没有父元素，则等同于stretch。|auto,flex-start,flex-end,center,baseline,stretch;|
```
 flex-grow
 默认为0，即如果存在剩余空间，也不放大。如果所有项目的flex-grow属性都为1，则它们将等分剩余空间（如果有的话）。如果一个项目的flex-grow属性为2，其他项目都为1，则前者占据的剩余空间将比其他项多一倍。

 flex-shrink
 如果所有项目的flex-shrink属性都为1，当空间不足时，都将等比例缩小。如果一个项目的flex-shrink属性为0，其他项目都为1，则空间不足时，前者不缩小。
 负值对该属性无效。

 flex-basis
属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小。
它可以设为跟width或height属性一样的值（比如350px），则项目将占据固定空间。

flex
该属性有两个快捷值：auto (1 1 auto) 和 none (0 0 auto)。

建议优先使用这个属性，而不是单独写三个分离的属性，因为浏览器会推算相关值。

align-self
align-self属性允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性。默认值为auto，表示继承父元素的align-items属性，如果没有父元素，则等同于stretch。

```

