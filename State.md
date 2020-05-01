# State

## 目录

[简介](#jump1)

[setState()方法](#jump2)

[单向数据流](#jump3)

---	

<span id="jump1"></span>

## 简介 

- 用来存放会动态变更的数据，相当于VUE的data

- state代表组件内部的状态，这些状态只在组件内部改变，它相当于函数的内部参数

- React 里，只需更新组件的 state，然后根据新的 state 重新渲染用户界面（不要操作 DOM）

```javascript
constructor(props){
    super(props)
    //构造函数初始化数据，将需要改变的数据初始化到state中
    this.state = {
        time: ''
    }
}
```

---

<span id="jump2"></span>

## setState()方法

- 只有在constructor()可以对state进行初始化，即this.state=值

- 在其他地方改变state的值都需要使用this.setState()方法

```javascript
this.setState({
    time: new Date().toLocaleTimeString()
})
```

---

<span id="jump3"></span>

## 单向数据流

- state通常被称为局部或封装，除了拥有并设置它的组件外，其它组件不可访问

- 任何状态始终由某些特定组件所有，并且从该状态导出的任何数据或 UI 只能影响树中下方的组件

- 这通常被称为自顶向下或单向数据流

为了表明所有组件都是真正隔离的，我们可以创建一个 App 组件，它渲染三个Clock：

```javascript
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }
 
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
 
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
 
  tick() {
    this.setState({
      date: new Date()
    });
  }
 
  render() {
    return (
      <div>
        现在是：{this.state.date.toLocaleTimeString()}
      </div>
    );
  }
}
 
function App() {
  return (
    <div>
      <Clock />
      <Clock />
      <Clock />
    </div>
  );
}
 
ReactDOM.render(<App />, document.getElementById('example'));
```

以上实例中每个 Clock 组件都建立了自己的定时器并且独立更新
