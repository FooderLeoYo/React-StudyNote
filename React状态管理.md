# 状态管理

## 目录

[Redux](#jump1)

[React-redux](#jump2)

---	

<span id="jump1"></span>

## Redux

解决React数据管理（状态管理），用于中大型，数据比较庞大，组件之间数据交互多的情况下使用

### 几个概念

- Store:数据仓库，保存数据的地方。

- State:state是1个对象，数据仓库里的所有数据都放到1个state里。

- Action:1个动作，触发数据改变的方法。

- Dispatch:将动作触发成方法

- Reducer:是1个函数，通过获取动作，改变数据，生成1个新state。从而改变页面

### 使用步骤

安装

```shell
Cnpm install redux --save
```

导入必要组件

```javascript
import {createStore} from 'redux'
```

初始化数据

```javascript
// 创建仓库
const store = createStore(reducer)
// reduce有2个作用，1.初始化数据；2. 通过获取动作，改变数据
// action就是dispatch括号内传过来的参数
const reducer = function(state={num:0},action){
    switch(action.type){
        case "add":
            state.num++;
            break;
        case 'decrement':
            state.num--;
            break;
        default:
            break;
    }
	// 返回一个新的哈希值的state，值和原来相同
	// 如果是直接返回state，由于前后哈希值相同，react有可能认为是同一个数据而不更新渲染
    return {...state}
}
```

获取数据

```javascript
let state = store.getState()
```

修改数据（通过动作修改数据）

```javascript
// 通过仓库的方法dispatch进行修改数据
// 每次调用dispatch，都会调用reducer
// dispatch括号内的参数将作为reducer的action
store.dispatch({type:"add"})
```

修改视图（监听数据的变化，重新渲染内容）

```javascript
store.subscribe(()=>{
    ReactDOM.render(<Counter></Counter>,document.querySelector("#root"))
})
```

---

<span id="jump2"></span>

## React-redux

### 几个概念

- Provider组件：自动的将store里的state和组件进行关联。

- MapStatetoProps：这个函数用于将store的state映射到组件的里props

- mapdispatchToProps:将store中的dispatch映射到组件的props里，实现了方法的共享。

- Connect方法：将组件和数据（方法）进行连接

### 使用步骤

安装

```shell
cnpm install react-redux --save
```

导入必要组件

```javascript
import {createStore} from 'redux'
import {connect, Provider} from 'react-redux'
```

初始化数据

```javascript
const store = createStore(reducer)

function reducer(state={num:0},action){
    switch(action.type){
        case "add":
            state.num++;
            break;
        default:
            break;
    }
    return {...state}
}
```

将store的state映射到到组件的props中

```javascript
function mapStateToProps(state) {
  return {
    value: state.num
  }
}
```

将修改数据的方法映射到组件的props中

```javascript
const addAction = {
  type: 'add'
}

function mapDispatchToProps(dispatch) {
  return {
    onAddClick: () => {dispatch(addAction)}
  }
}
```

使用connect将上述两个方法与目标组件进行关联

```javascript
const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(TargetCom)
```

获取数据

```javascript
const value = this.props.value;
```

获取修改数据的方法

```javascript
const onAddClick = this.props.onAddClick;
```
