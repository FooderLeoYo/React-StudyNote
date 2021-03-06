# useState

## 目录

[基本概念](#jump1)

[使用useState](#jump2)

[函数式初始化和更新](#jump3)

[使用多个 state 变量](#jump4)

[跳过 state 更新](#jump5)

[useState的实现原理](#jump6)

[更新state后的回调](#jump7)

---	

<span id="jump1"></span>

## 基本概念

useState 是允许你在 React 函数组件中添加 state 的 Hook

```javascript
const [state, setState] = useState(initialState);
```

返回一个 state，以及更新 state 的函数

在初始渲染期间，返回的状态 (state) 与传入的第一个参数 (initialState) 值相同

setState 函数用于更新 state。它接收一个新的 state 值并将组件的一次重新渲染加入队列

### useState 需要哪些参数

useState() 方法里面唯一的参数就是初始state，只会在组件的初始渲染中起作用

不同于 class 的是，我们可以按照需要使用数字或字符串对其进行赋值，而不一定是对象

### useState 方法的返回值是什么

返回回值为：当前 state 以及更新 state 的函数

### 更新 state 的函数

它接收一个新的 state 值并将组件的一次重新渲染加入队列

---

<span id="jump2"></span>

## 使用useState

### 声明 State 变量

在 class 中，我们通过在构造函数中设置 this.state 为 { count: 0 } 来初始化 count state 为 0：

```javascript
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
```

在函数组件中，我们没有 this，所以我们不能分配或读取 this.state。我们直接在组件中调用 useState Hook：

```javascript
import React, { useState } from 'react';

function Example() {
  // 声明一个叫 “count” 的 state 变量
  const [count, setCount] = useState(0);
}
```

上述例子中：

- 我们声明了一个叫 count 的 state 变量，然后把它设为 0

- 我们可以通过调用 setCount 来更新当前的 count

### 读取 State

当我们想在 class 中显示当前的 count，我们读取 this.state.count：

```javascript
<p>You clicked {this.state.count} times</p>
```

在函数中，我们可以直接用 count:

```javascript
<p>You clicked {count} times</p>
```

### 更新 State

在 class 中，我们需要调用 this.setState() 来更新 count 值：

```javascript
<button onClick={() => this.setState({ count: this.state.count + 1 })}>
Click me
</button>
```

在函数中，我们已经有了 setCount 和 count 变量，所以我们不需要 this:

```javascript
<button onClick={() => setCount(count + 1)}>
Click me
</button>
```

---

<span id="jump3"></span>

## 函数式初始化和更新

### 函数式初始化

如果初始state需要通过复杂计算获得，则可以传入一个函数，在函数中计算并返回初始的state

```javascript
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});
```

### 函数式更新

如果新的 state 需要通过使用先前的 state 计算得出，那么可以将函数传递给 setState

该函数将接收先前的 state，并返回一个更新后的值

这种更新方式较之直接更新，最大的优点是可以避免闭包旧数据问题。因为函数式更新允许我们指定 state 该如何改变而不用引用当前 state，而回调函数中的参数一直都能拿到最新的state值

例如：

```javascript
<button onClick={() => setCount(prevCount => prevCount + 1)}>数量加1</button>
```

上述例子中：

- setCount为更新state的函数

- prevCount => prevCount + 1 作为函数式参数传递给它

---

<span id="jump4"></span>

## 使用多个 state 变量

如果我们想要在 state 中存储多个不同的变量，只需调用 useState() 多次即可

```javascript
// 声明多个 state 变量
const [age, setAge] = useState(42);
const [fruit, setFruit] = useState('banana');
const [todos, setTodos] = useState([{ text: '学习 Hook' }]);
```

---

<span id="jump5"></span>

## 跳过 state 更新

调用 State Hook 的更新函数并传入当前的 state 时，React 将跳过子组件的渲染及 effect 的执行

需要注意的是，React 可能仍需要在跳过渲染前渲染该组件

过由于 React 不会对组件树的“深层”节点进行不必要的渲染，所以大可不必担心

如果你在渲染期间执行了高开销的计算，则可以使用 useMemo 来进行优化

---

<span id="jump6"></span>

## useState的实现原理

### 模拟useState

```javascript
let memoizedState = []; //全局memoizedState用来存储state的值，避免重新渲染的时候被myUseState重置为初始值，与useEffect等其他hooks共用
let cursor = 0; // 当前 memoizedState 下标

const myUseState = initialValue => {
    const currentCursor = cursor++;
    memoizedState[currentCursor] = memoizedState[currentCursor] || initialValue;
    const setState = newValue => {
        memoizedState[currentCursor] = newValue;
        render();
    }
    return [memoizedState[currentCursor], setState];
}

const render = () => {
    cursor = 0
    ReactDOM.render(<App1 />, document.getElementById('root'))
}
```

### 为什么不能在循环、判断内部使用 Hook

正如上述模拟useState的代码所呈现的，一个组件有多个state时，它们被**按顺序**放入一个容器中保存

如果在循环、判断内部使用Hook（指的是useState，useState所返回的state和setState可以使用），由于不一定会执行，就有可能导致某个state拿到原本不是它自己的序号所对应的值

也正是因为这个原因，在使用 Hook 的时候，必须在函数组件顶部使用

---

<span id="jump7"></span>

## 更新state后的回调

同类组件的setState一样，HOOK更新state也是异步的。由于等待state更新后再执行相关操作是十分常见的需求，因此回调就非常重要

但HOOK不支持setState那样将回调直接作为第二个参数

HOOK的解决方案为使用useEffect

  - 设置一个标记，以跳过targetState初始化赋值时触发的那次useEffect

  - 将目标state作为useEffect的依赖参数

例如：

```javascript
  const [targetState, setTargetState] = useState("old");
  const [firstTime, setFirstTime] = useState(true); 

  useEffect(() => {
    !firstTime && console.log(targetState) // "new"
  }, [targetState]);

  useEffect(() => {
    setTimeout(() => { // 模拟未来某一时刻targetState发生改变
      setFirstTime(false);
      setTargetState("new");
    }, 5000);
  }, []);
```
