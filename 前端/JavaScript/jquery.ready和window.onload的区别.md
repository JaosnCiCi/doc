### jquery 的ready() 与window.onload()的区别
描述 | window.onload()  |  $(document).ready()
:-| :- | :-
加载时机 |  必须等待网页全部加载完毕（包括图片等），然后再执行JS代码 | 只需要等待网页中的DOM结构加载完毕，就能执行JS代码
执行次数 | 只能执行一次，如果第二次，那么第一次的执行会被覆盖        | 可以执行多次，第N次都不会被上一次覆盖
触发时间 | onload事件是要在页面的元素全部加载完了才触发的,这也包括页面上的图片，以及大的表格数据。如果页面上图片较多或图片太大,加载需要较多时间，就会导致页面无响应，或者用户做了其它操作了。 | 在页面的dom(节点)加载完后就可以做相应的操作,而不用等待全部元素加载完成.比如只知道页面某处有一张图片，而不一定要等它显示出来就可以为它绑定点击方法。

### 执行次数
```javascript
   window.onload = function()  { alert(“text1”);}; 
   window.onload = function()  { alert(“text2”);}; 
   ///只会弹出text2
   $(document).ready(function(){alert(“text1”)});    
   $(document).ready(function(){alert(“text2”)}); 
   ///两次结果都弹出

```

### $(selector).ready())函数
在jquery脚本加载的时候,会设置一个isReady的标记,监听DOMContentLoaded事件(这个不是什么浏览器都有的,不同浏览器,jquery运作方式不一样).当然遇到调用ready函数的时候,如果isReady未被设置,那就是说页面未加载完,就会把要执行的函数用一个数组缓存起来,当页面加载完后,再把缓存的函数一一执行.
Jquery中的详细代码分析:
```javascript
ready: function(fn) {
// 绑定监听器
bindReady();
// 如果 DOM 加载完成
if ( jQuery.isReady )
// 马上运行此函数
fn.call( document, jQuery );
// 否则保存起来
else
// 把函数加入缓存数组中
jQuery.readyList.push( function() { return fn.call(this, jQuery); } );
return this;
}
```
当然，jquery对不同的浏览器dom加载完成的通知 bindReady()函数也是不同的
```javascript
var readyBound = false;
function bindReady(){
    if ( readyBound ) return;
    readyBound = true;

    // Mozilla,opera,webkitnightlies支持DOMContentLoaded事件
    if ( document.addEventListener && !jQuery.browser.opera)
    // 直接使用事件回调即可
    	document.addEventListener( "DOMContentLoaded", jQuery.ready, false );

    // 如果是ie并且不是嵌在frame中
    // 就需要不断地检查文档是否加载完
    if ( jQuery.browser.msie && window == top ) (function(){
        if (jQuery.isReady) return;
        try {
        	document.documentElement.doScroll("left");
        } catch( error ) {
            setTimeout( arguments.callee, 0 );
            return;
    	}
        // and execute any waiting functions
        jQuery.ready();
    })();

    if ( jQuery.browser.opera )
        document.addEventListener( "DOMContentLoaded", function () {
        if (jQuery.isReady) return;
        for (var i = 0; i < document.styleSheets.length; i++) 
            if (document.styleSheets[i].disabled) {
            setTimeout( arguments.callee, 0 );
            return;
        }
        // and execute any waiting functions
        jQuery.ready();
    }, false);

    if ( jQuery.browser.safari ) {
        var numStyles;
        (function(){
        	if (jQuery.isReady) return;
        	if ( document.readyState != "loaded" && document.readyState != "complete" ) { 
        		setTimeout( arguments.callee, 0 );
        		return;
        	}
        	if ( numStyles === undefined )
        		numStyles = jQuery("style, link[rel=stylesheet]").length;
        	if ( document.styleSheets.length != numStyles ) { 
        		setTimeout( arguments.callee, 0 );
        	return;
        }
        // and execute any waiting functions
        jQuery.ready();
        })();
    }

    // A fallback to window.onload, that will always work
    jQuery.event.add( window, "load", jQuery.ready ); 
    }
}
```
ps:这里最要注意的是，IE只有在页面不是嵌入frame中的情况下才和其它浏览器等一样，在DOM加载完成以后就执行$(document).ready()的内容。