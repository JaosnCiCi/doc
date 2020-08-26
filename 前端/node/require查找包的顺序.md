### 最近开始学习Nodejs， 对于其中module的引用大家应该比较熟悉，就是[js](http://lib.csdn.net/base/javascript)中的eRequire 关键字，如果没有module的路径，Node中会去怎样找到这个引用呢？例如：var m=require("xxxx"), 那么该XXXk查找顺序如下：![img](file:///C:/Users/Jason/AppData/Local/Temp/enhtmlclip/Image.png)





### 尽管Node模块系统的本质简单直接，但还是有两点需要注意一下。第一，如果模块是目录，在模块目录中定义模块的文件必须被命名为index.js，除非你在这个目录下一个叫package.json的文件里特别指明。要指定一个取代index.js的文件，package.json文件里必须有一个用[JavaScript](http://lib.csdn.net/base/javascript)对象表示法（JSON）数据定义的对象，其中有一个名为main的键，指明模块目录内主文件的路径。图3-6中的流程图对这些规则做了汇总。

![img](file:///C:/Users/Jason/AppData/Local/Temp/enhtmlclip/Image(1).png)



### 还有一点需要注意的是，Node能把模块作为对象缓存起来。如果程序中的两个文件引入了相同的模块，第一个文件会把模块返回的数据存到程序的内存中，这样第二个文件就不用再去访问和计算模块的源文件了。实际上第二个引入有机会修改缓存的数据。这种“猴子补丁”（monkeypatching）让一个模块可以改变另一个模块的行为，开发人员可以不用创建它的新版本。