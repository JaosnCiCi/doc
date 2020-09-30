# Reflect

## 1.概述

reflect和proxy对象一样，也是ES6为了操作对象而提供的新API。Reflect对象的设计目的有这样几个。

1. 将**Object**对象的一些明显属于语言内部的方法（比如**Object.defineProperty**）放到**reflect**对象上。现阶段，某些方法同时在**object**和**reflect**对象上部署，未来的新方法将只部署在**reflect**对象上。也就是说，从**reflect**对象上可以拿到语言内部的方法。

2. 修改某些**object**方法的返回结果，让其变得更合理。比如，**Object.defineProperty(obj,name,desc)**在无法定义属性时，会抛出一个错误，而**Reflect.defineProperty(obj,name,desc)**则会返回**false**。

   ```javascript
   //老写法
   try{
       //success
       Object.defineProperty(target,property,attributes);
   }catch(e){
       //failure
   }
   
   //新写法
   if(Reflect.defineProperty(target,property,attributes)){
       //success
   }else{
       //failure
   }
   ```

3. 让object操作都变成函数行为。某些object操作时命令式。比如`name in obj` 和 `delete obj[name]`，而`Reflect.has(obj,name)`和`Reflect.deleteProperty(obj,name)`让它们变成了函数行为。

   ```javascript
   //老写法
   'assign' in Object  //true
   
   //新写法
   Reflect.has(Object,'assign')  //true
   ```

4. **Reflect**对象的方法与Proxy对象的方法一一对应，只要是proxy对象的方法，就能在reflect对象上找到对应的方法。这就让proxy对象可以方便的调用对用的reflect方法，完成默认行为，作为修改行为的基础。也就是说，不管proxy怎么修改默认行为，你总可以在reflect上获取默认行为。

   ```
   Proxy(target,{
   	set:function(target,name,value,receiver){
   	var success=Reflect.set(target,name,value,receiver);
   	if(success){
       	console.log('property ' +name+' on '+target+' set to '+value});
       }
       retutn success;
   	}
   })
   ```

   上面代码中，`Proxy`方法拦截`target`对象的属性赋值行为。它采用`Reflect.set`方法将值赋值给对象的属性，确保完成原有的行为，然后再部署额外的功能。

   

   下面是另一个例子。

   ```javascript
   var loggedObj=new Proxy(obj,{
       get(target,name){
           console.log('get',target,name)
           return Reflect.get(target,name)
       },
       deleteProperty(target,name){
           console.log('delete'+name)
           return Reflect.deleteProperty(target,name)
       },
       has(target,name){
           console.log('has'+name)
           return Reflect.has(target,name)
       }
   })
   ```

   上面代码中，每一个proxy对象的拦截操作(get,delete,has)，内部都调用对应的reflect方法，保证原生行为能够正常执行。添加的工作，就是将每个操作输出一行日志。

   有了reflect对象以后，很多操作会更易读。

   ```javascript
   //老写法
   Function.prototype.apply.call(Math.Floor,undefined,[1.75])  //1
   
   //新写法
   Reflect.apply(Math.floor,undefined,[1.75])  //1
   ```

   

## 2.静态方法

Reflect对象一共有13个静态方法。

- Reflect.apply(target, thisArg, args)
- Reflect.construct(target, args)
- Reflect.get(target, name, receiver)
- Reflect.set(target, name, value, receiver)
- Reflect.defineProperty(target, name, desc)
- Reflect.deleteProperty(target, name)
- Reflect.has(target, name)
- Reflect.ownKeys(target)
- Reflect.isExtensible(target)
- Reflect.preventExtensions(target)
- Reflect.getOwnPropertyDescriptor(target, name)
- Reflect.getPrototypeOf(target)
- Reflect.setPrototypeOf(target, prototype)

上面这些方法的作用，大部分与`Object`对象的同名方法的作用都是相同的，而且它与`Proxy`对象的方法是一一对应的。



### 1.Reflect.get(target,name,receiver)

Reflect.get方法查找并返回target对象的name属性，如果没有该属性，则返回undefined。

```javascript
var myObject={
    foo:1,
    bar:2,
    get baz(){
    	return this.foo+this.bar
    }
}
Reflect.get(myObject,'foo')  //1
Reflect.get(myObject,'bar')  //2
Reflect.get(myObject,'baz')  //3
```

**如果name属性部署了读取函数(getter)，则读取函数this绑定receiver。**

```javascript
var myObject = {
  foo: 1,
  bar: 2,
  get baz() {
    return this.foo + this.bar;
  },
};

var myReceiverObject = {
  foo: 4,
  bar: 4,
};

Reflect.get(myObject, 'baz', myReceiverObject) // 8
```

如果第一个参数不是对象，`Reflect.get`方法会报错。

```javascript
Reflect.get(1, 'foo') // 报错
Reflect.get(false, 'foo') // 报错
```



### 2.Reflect.set(target,name,value,receiver)

`Reflect.set`方法设置`target`对象的`name`属性等于`value`。

```javascript
var myObject = {
  foo: 1,
  set bar(value) {
    return this.foo = value;
  },
}

myObject.foo // 1

Reflect.set(myObject, 'foo', 2);
myObject.foo // 2

Reflect.set(myObject, 'bar', 3)
myObject.foo // 3
```

如果`name`属性设置了赋值函数，则赋值函数的`this`绑定`receiver`。

```javascript
var myObject = {
  foo: 4,
  set bar(value) {
    return this.foo = value;
  },
};

var myReceiverObject = {
  foo: 0,
};

Reflect.set(myObject, 'bar', 1, myReceiverObject);
myObject.foo // 4
myReceiverObject.foo // 1
```

注意，如果proxy对象和reflect对象连用使用，前者拦截赋值操作，后者完成赋值的默认行为，而且传入了receiver，那么Reflect.set会触发Proxy.defineProperty拦截。

```javascript
let p = {
  a: 'a'
};

let handler = {
  set(target, key, value, receiver) {
    console.log('set');
    Reflect.set(target, key, value, receiver)
  },
  defineProperty(target, key, attribute) {
    console.log('defineProperty');
    Reflect.defineProperty(target, key, attribute);
  }
};

let obj = new Proxy(p, handler);
obj.a = 'A';
// set
// defineProperty
```

























## 3.实例：使用Proxy实现观察者模式





