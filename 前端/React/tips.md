### 1.react在import component的时候首字母需要大写，否则不识别
### 2. 报错：Super expression must either be null or a function, not undefined
```
   原因：React.Component instad of React.component
```
### 3.cloneElement is not exported by node_modules\react\react.js
```
修改rollup.js
namedExports: {
    'node_modules/react/react.js': ['PropTypes', 'createElement','cloneElement']
} 
```
### 4.可以通过this.props访问props，但绝对不能通过这种方式修改它。一个组件绝对不可以修改自己的props
