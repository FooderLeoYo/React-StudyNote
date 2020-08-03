# Redux

## 目录

[Actions](#jump1)

[Reducers](#jump2)

[Store](#jump3)

[Redux数据流程](#jump4)

[React-Redux](#jump5)

[Redux-Thunk](#jump6)

[数据持久化](#jump7)

---	

<span id="jump1"></span>

## Actions

### 基本概念

Action 的任务是描述“发生了什么事情？”

action是一个简单的对象，只提供事件的所有要素，不提供逻辑

Actions must have a `type` property

### Action Creators

```javascript
function setRoomData(roomData) {
  return { 
	type: SET_ROOM_DATA, 
	roomData 
  };
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
const initialState = {
  roomData: {}
}

function combineRoomData(roomData = initialState.roomData, action) {
  switch (action.type) {
    case SET_ROOM_DATA:
      return action.roomData;
    default:
      return roomData;
  }
}

export {
  combineRoomData
}
```

### combineReducers()

该方法可以将多个reducers合成一个对象对外导出

```javascript
const reducer = combineReducers({
  liveData: combineLiveData,
  liveListData: combineLiveListData,
  roomData: combineRoomData,
});

export default reducer;
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

### dispatch()

然后你可以通过 `dispatch()` 一个 action 来让Store改变状态：

```javascript
store.dispatch(getRoomData(param.roomId))
```

dispatch()返回The dispatched action

---

<span id="jump4"></span>

## Redux数据流程

1. createStore()创建一个store，参数中传入reducers、middlewares

2. action creator创建一个action

3. dispatch()将新建的action发送给store

4. store将收到的action以及旧的state传进reducer（通常是使用combineReducers()整合多个reducers的一个总的reducer）

5. reducer根据type执行相应操作后返回更新state

---

<span id="jump5"></span>

## React-Redux

### Installing React-Redux

```shell
cnpm install react-redux -s
```

### `Provider()`

在最外层，把所有内容包裹在Provider组件中

其作用是将之前创建的store作为props，提供给Provider所包裹的组件使用

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

connect()返回的是：原组件将所选的state和action添加进props后的新组件

### connect的两个作用

- Provider内的任何一个组件如果需要使用state中的数据，就必须是「被 connect 过的」组件

- connect后，相当于做了过滤，能保证组件拿到的props就只有自己需要的，而不是整个store

### 两个参数

The connect function takes two arguments, both optional:

- mapStateToProps(state, 组件本身的props)

- mapDispatchToProps

### mapStateToProps(state, 组件本身的props)

- 它的作用是将store中的数据作为props绑定到组件上

- 是一个函数

- 这个函数的第一个参数state就是 Redux 的store

- 第二个参数ownProps，是react组件自己的props

```javascript
const mapStateToProps = (state) => ({
  roomData: state.roomData
});
```

### mapDispatchToProps

- 它的作用是将action作为props绑定到react组件上

- 可以是一个object，也可以是函数

### 使用connect的范例

```javascript
import { connect } from "react-redux";
import Ranking from "../../views/ranking/Ranking";

// Ranking组件只会拿mapStateToProps定义的三个state属性作为props，而不会拿整个store
const mapStateToProps = (state) => ({
  shouldLoad: state.shouldLoad,
  rankingPartitions: state.rankingPartitions,
  rankingVideos: state.rankingVideos
});

// actions同理
const mapDispatchToProps = { increment, decrement, reset }

export default connect(mapStateToProps, mapDispatchToProps)(Ranking);
```

---

<span id="jump6"></span>

## Redux-Thunk

Redux-Thunk实现的功能就是：在dispatch一个action之后，到达reducer之前，进行一些额外的操作

Redux原生dispatch()只能用一个返回值为`plain object`的`action creator`作为参数，使用Redux-Thunk后则可以用返回值为函数的做参数

正因为这个action creator可以返回一个函数，那么就可以在这个函数中执行一些异步的操作

### 安装及配置

安装：

```shell
cnpm install redux-thunk -s
```

然后在store.js中，创建新store时将thunk应用到其中：

```javascript
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from 'reducers路径';

const store = () => createStore(rootReducer, applyMiddleware(thunk));

export default store;
```

### 应用实例

action creator：

```javascript
// getRoomData是一个action creator，只不过和同步creator不同，它的返回值是一个函数
import { AnyAction, Dispatch } from "redux";
import { getRoomInfo, getPlayUrl } from "../../../api/live";
import { setRoomData } from "../../action-creators";
import { Live } from "../../../class-object-creators";

export default function getRoomData(roomId: number) {
  return (dispatch: Dispatch<AnyAction>) => {
    const promises = [getRoomInfo(roomId), getPlayUrl(roomId)];
    return Promise.all(promises).then(([result1, result2]) => {
      if (result1.code === "1") {
        const data = result1.data;
        const live = new Live(
          data.title,
          data.room_id,
          data.online,
          data.user_cover,
          data.live_status,
          "",
          null
        );
        live.playUrl = result2.data.durl[result2.data.current_quality - 1].url;

        dispatch(setRoomData({
          parentAreaId: data.parent_area_id,
          parentAreaName: data.parent_area_name,
          areaId: data.area_id,
          areaName: data.area_name,
          uId: data.uid,
          description: data.description,
          liveTime: data.live_time,
          live,
        }));
      }
    });
  };
}
```

组件中：

```javascript
store.dispatch(getRoomData(param.roomId));
```

---	

<span id="jump7"></span>

## 数据持久化

### 页面未关闭redux的数据也可能被清除

redux的数据在以下情况下会被清除：

- 页面刷新

- 组件卸载

- 使用```window.location.href```而非router方式进行跳转

### 实现数据持久化

使用npm包```redux-persist```
