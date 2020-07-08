# Redux

## 目录

[Actions](#jump1)

[Reducers](#jump2)

[Store](#jump3)

[Data Flow](#jump4)

[React-Redux](#jump5)

[Redux-Thunk](#jump6)

---	

<span id="jump1"></span>

## Actions

### 基本概念

Action 的任务是描述“发生了什么事情？”

action是一个简单的对象，只提供事件的所有要素，不提供逻辑

For example:

```javascript
{ type: 'LIKE_ARTICLE', articleId: 42 }
{ type: 'FETCH_USER_SUCCESS', response: { id: 3, name: 'Mary' } }
{ type: 'ADD_TODO', text: 'Read the Redux docs.' }
```

They are the **only** source of information for the store

Actions must have a `type` property

### Action Creators

比如刚才那个例子中我们把 text 从 “Hello world” 变成了 “Hello Stark” ，那么我们应该用一个 Action 对象来描述我们的行为：

```javascript
function changeText(){
    return {
        type: 'CHANGE_TEXT',
        newText: 'Hello Stark'
    }
}
```

这个函数会返回一个 Action 对象，这个对象里描述了“页面发生了什么”

随后这个对象会被传入到 Reducer 中

---

<span id="jump2"></span>

## Reducers

Reducer 的任务是根据传入的 Action 对象去修改状态树

Reducer 就是一个纯函数，根据传入的 当前state 和 action ，返回一个新的 state 

```javascript
(previousState, action) => nextState
```

比如我们这个例子中的 Reducer 应该是这样的：

```javascript
const initialState = {
    text : 'Hello world'
}

function Reducer(state=initialState, action) {
    switch(action.type) {
        case 'CHANGE_TEXT':
            return {
                text : 'Hello Stark'
            }
        default:
            return state;
    }
}
```

### combineReducers() 

该方法可以将多个reducers合成一个对象对外导出

```javascript
import { combineReducers } from 'redux'

const todoApp = combineReducers({
  visibilityFilter,
  todos
})

export default todoApp
```

---

<span id="jump3"></span>

## Store

Store 就是把 Reducer 和 action 联系到一起的对象

Store 有以下职责：

- 维持应用的 state；

- 提供 getState() 方法获取 state；

- 提供 dispatch(action) 方法更新 state；

- 通过 subscribe(listener) 注册监听器；

### createStore()

你可以这样产生一个 Store :

```javascript
import { createStore } from 'redux'
import todoApp from './reducers'
const store = createStore(todoApp)
```

You may optionally specify the initial state as the second argument to createStore()：

```javascript
const store = createStore(todoApp, window.STATE_FROM_SERVER)
```

### Dispatching Actions

然后你可以通过 dispatch 一个 action 来让Store改变状态：

```javascript
store.dispatch( changeText() );
```

---

<span id="jump4"></span>

## Data Flow

Redux architecture revolves around a **strict unidirectional data flow**

The data lifecycle in any Redux app follows these 4 steps:

1. You call `store.dispatch(action)`.

	An `action` is a plain object describing what happened.

	You can call `store.dispatch(action)` from anywhere in your app.

2. The Redux store calls the reducer function you gave it.

	The `store` will pass two arguments to the `reducer`：
	
	the current state tree and the action.

3. The root reducer may combine the output of multiple reducers into a single state tree.

	How you structure the root reducer is completely up to you. 

	Redux ships with a `combineReducers()` helper function.

4. The Redux store saves the complete state tree returned by the root reducer.

	This new tree is now the next state of your app

	Every listener registered with store.subscribe(listener) will now be invoked.

	If you use bindings like React Redux, this is the point at which component.setState(newState) is called.

---

<span id="jump5"></span>

## React-Redux

### Installing React-Redux

```shell
cnpm install react-redux -s
```

### `Provider()`

Make the store available to all container components in the application

在最外层容器中，把所有内容包裹在Provider组件中

将之前创建的store作为prop传给Provider

```javascript
const App = () => {
  return (
    <Provider store={store}>
      <Comp/>
    </Provider>
  )
};
```

### `connect()`

Provider内的任何一个组件如果需要使用state中的数据，就必须是「被 connect 过的」组件

connect()返回的是原组件添加state和action进props后的新组件

The connect function takes two arguments, both optional:

- mapStateToProps(state, 组件本身的props)

- mapDispatchToProps

### mapStateToProps(state, 组件本身的props)

- 它的作用是将store中的数据作为props绑定到组件上

- 是一个函数

- 这个函数的第一个参数state就是 Redux 的store

- 第二个参数ownProps，是react组件自己的props

```javascript
const mapStateToProps = (state) => {
  return {
    count: state.count
  }
}
```

### mapDispatchToProps

- 它的作用是将action作为props绑定到react组件上

- 可以是一个object，也可以是函数

### 使用connect的范例

```javascript
import { connect } from 'react-redux'
import { increment, decrement, reset } from './actionCreators'

// react组件ReactCounter
const ReactCounter = {
  // 组件的内容
}

const mapStateToProps = (state /*, ownProps*/) => {
  return {
    counter: state.counter
  }
}

const mapDispatchToProps = { increment, decrement, reset }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReactCounter)
```

---

<span id="jump6"></span>

## Redux-Thunk

Redux只能同步dispatch，需要实现异步dispatch时，就要使用中间件Redux-Thunk

### 安装及配置

安装：

```shell
cnpm install redux-thunk -s
```

然后在store.js中：

```javascript
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from 'reducers路径';

const store = () => createStore(rootReducer, applyMiddleware(thunk));

export default store;
```

### 实现异步dispatch

一个例子：

```javascript
function getRequest() {
  return dispatch => {
    axios({
      method: 'get',
      url: 'https://randomuser.me/api',
    })
    .then((res) => {
      const action = {
        type: UPDATE_REQUESTNAME,
        payload: {
          reducer: res.data.reducer
        }
      }
      dispatch(action)
    })
    .catch((err) => {
      console.log(err)
    })
  }
}
```

