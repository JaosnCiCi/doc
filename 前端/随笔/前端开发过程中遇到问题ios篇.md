## iOS中文输入法多次触发的问题及解决方案
最近要在移动端实现一个文本框实时搜索的功能，即在文本框里每输入一个字，就向服务器请求一次搜索结果。暂且不考虑性能优化问题，第一时间想到的是用keyup实现：
```
$('input').on('keyup',function() {
    AjaxRequest();
});
```
这在安卓上没有问题，但在iOS上如果使用中文输入或者输入法的预设文本，就不会触发keyup事件，因此也就无法和服务器通信。为解决这个问题，在网上查了些资料，HTML5有专门处理的事件oninput，可以响应实时输入：
```
$('input').on('input',function() {
    AjaxRequest();
});
```
这样在输入中文时就能监听到文本框的变化了。但还是有问题，在输入中文时，比如“我”字，拼音是“wo”，五笔是"q"，均会向服务器发送三次请求，如果打印出来，会得到“我”、“”、“我”三个值，可我只想在“我”字输出到文本框以后再发请求，这时候就需要一个专门的compositionstart和compositionend事件来处理这种情况，这是参考资料。

“compositionstart 事件触发于一段文字的输入之前（类似于 keydown 事件，但是该事件仅在若干可见字符的输入之前，而这些可见字符的输入可能需要一连串的键盘操作、语音识别或者点击输入法的备选词）。“

最后，完整代码如下：
```
var lock = false;
$('input').on({
    input: function() {
        if(!lock) AjaxRequest(); //这里再调用一次方法是为了响应退格删除中文
    },
    compositionstart: function() {
        lock = true;
    },
    compositionend: function() {
        lock = false;　　　　　
        AjaxRequest(); //可以响应正常中文输入，但不响应使用退格删除中文
    }
});
```