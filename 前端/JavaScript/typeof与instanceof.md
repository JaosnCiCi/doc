# typeof 与 instanceof之间的区别
```
ES6规范中有2大类型，7中小类
基本类型和引用类型两大类
基本类型（简单类型，原始类型）：String，Number，Bollean，Null，Undefined，Symbol
引用类型（复杂类型）：Object（对象，Function，Array）
```
1.typeof返回结果是该类型的字符串形式表示【6】（number、string、undefined、boolean、function、object）
注意
```
 typeof对于原始类型来说，除了null都可以显示正确类型
 typeof对于对象来说，除了函数都会显示object
```
2.instanceof是用来判断 A 是否为 B 的实例，表达式为：A instanceof B，如果 A 是 B 的实例，则返回 true,否则返回 false。 在这里需要特别注意的是：instanceof 检测的是原型。 
例如：
```javascript
[] instanceof Array; //true
{} instanceof Object;//true
new Date() instanceof Date;//true
 
function Person(){};
new Person() instanceof Person;
 
[] instanceof Object; //true
new Date() instanceof Object;//true
new Person instanceof Object;//true
但是instanceof可以判断出[]是Array的实例，同时也认为是Object的实例，Why？？？？
instanceof 只能用来判断两个对象是否属于实例关系， 而不能判断一个对象实例具体属于哪种类型。
之后增加了Array.isArray()方法判断这个值是不是数组的。
```
**总结**

```
1、typeof能够检测出了null之外的原型类型（String、Number、Boolean、Undefined），对于对象类型能判断出function、其他的都为Object

2、判断一个值是否为数组，使用Array.isArray()

3、如果需要判断一个值是否为null，最直接就是与null比较
value === null;    //true or false
　注意这里需要三等号操作符“===”，因为三等号操作符在进行比较的时候不会将变量强制转换为另一种类型。

由此可见，无论是typeof还是instanceof都不能准确判断出正确的类型。
```
