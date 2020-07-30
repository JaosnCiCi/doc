# Event Bus

### 1.思想

- 使用一个空的vue实例作为事件总线
- 通过该空vue实例来监听和触发事件

### 2.示例代码

- 如下代码示例，a和b组件作为兄弟组件在p组件引入

```vue
// p.vue
<template>
  <div>
    <p>bus</p>
    <aa></aa>
    <bb></bb> 
  </div>
</template>

<script>
import aa from '@/components/a'
import bb from '@/components/b'
export default {
  components: {
    aa,
    bb
  }
} 
</script>
```

- 在bus.js 中创建一个空的Vue实例

```vue
import Vue from 'vue'
export default new Vue()
```

- a和b组件想通过bus通讯，则需引入bus.js 。要传递参数的组件，通过$on监听自定义事件；要接受参数的组件，通过$emit 触发自定义事件，并处理传递的参数。

```vue
// a.vue
<template>
  <div>
      组件a
      <button @click="sendMsg">问候组件b</button>
  </div>
</template>

<script>
import bus from './bus'
export default {
    methods: {
        sendMsg() {
            bus.$emit('send', '组件b你好吗？')
        }
    }
}
</script>
```

```vue
// b.vue 
<template>
	<div>
		<p>组件b：{{ msg }}</p>
	</div>
</template> 
<script> 
import bus from './bus'
export default {
	data() {
		return { msg: 'msg初始值', }
	},
	created() {
		bus.$on('send', data => { this.msg = data })
	}
} 
</script>
```


