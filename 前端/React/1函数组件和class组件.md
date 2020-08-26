# 函数组件

```react
function Clock(props){
	return (
		<div>
			<h1>hello,react</h1>
			<h2>It is {props.date.toLocaleTimeString()}</h2>
		</div>
	)
}

function tick(){
	RecatDOM.render(
		<Clock date={new Date()} />,
		document.getElementById('root')
	)
}

setInterval(tick,1000)
```

在Clock组件中添加“state”来实现时钟的自动更新

State和props类似，但是state是私有的，并且完全受控于当前组件



# class组件

```react
class Clock extends React.Component{
	//构造函数
	constructor(props) {
        super(props);
        this.state = {date: new Date()};
    }
    
    componentDidMount(){
    	this.timerID=setInterval(()=>{
    		this.tick()
    	},1000)
    }
    
    componentWillUnmount(){
    	clearInterval(this.timerID)
    }
    
    tick(){
    	this.setState({
    		date:new Date()
    	})
    }

	render(){
		return(
			<div>
                <h1>Hello, world!</h1>
                <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
            </div>
		)
	}
}
```

