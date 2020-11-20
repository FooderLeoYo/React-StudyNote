# useState

## 目录

[基本概念](#jump1)

[使用useState](#jump2)

[函数式初始化和更新](#jump3)

[使用多个 state 变量](#jump4)

[跳过 state 更新](#jump5)

[useState的实现原理](#jump6)

[闭包造成的数据不同步问题](#jump7)

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

例如：

```javascript
<button onClick={() => setCount(prevCount => prevCount + 1)}>数量加1</button>
```

上述例子中：

- setCount为更新state的函数

- prevCount => prevCount + 1作为函数式参数传递给它

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
let memoizedState = []; //全局memoizedState用来存储state的值，避免重新渲染的时候被myUseState重置为初始值
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

## 闭包造成的数据不同步问题

### 问题

当在一个**延期执行**的**函数**中，引用某个位于组件作用域中的变量，到了该函数执行的时刻，拿到的值将仍是初始值而不是当前值

该问题出现的场景有设置定时器、在第二个参数为[]的useEffect中绑定事件监听的回调

### 产生的原因

组件式函数```Comp```中有一个```state```，或传统变量，用以记录**状态**：

```javascript
function Comp () {
  const [state, setState] = React.useState(InitialState);
  // or let V;
}
```

延期执行函数```f````中引用了```state```(或传统变量)

```javascript
function Comp () {
  const [state, setState] = React.useState(InitialState);

  function f() {
    // ...
    console.log(state);
    // ...
  }
  htmlEle.addEventListener("click", F);
}
```

当程序运行到```f```时，在```f```的作用域链中保存该引用变量这个时刻的**值而不是引用**，到```CompContext.AO```

```javascript
fContext = {
  AO: {
    arguments: {
      // ...
    },
    // ...
  }，
  Scope: [AO, CompContext.AO, ..., globalContext.VO]
}

CompContext = {
  AO: {
    arguments: {
      // ...
    },
    // ...
    state: InitialState, // 注意是此刻state的值，而不是指向state的引用
    // ...
  }，
  Scope: [AO, ..., globalContext.VO]
}
```

由于是组件式函数，每次re-render时Comp将重头执行一遍，前一次渲染时的Comp这个函数会被销毁

但由于```f```是延期执行的，因此它和它的作用域链将不会被销毁，即形成了闭包

当到了```f```的执行时刻，```f```执行到需要使用```state```时，会到其作用域链中寻找

```javascript
// fContext.Scope
[AO, CompContext.AO, ..., globalContext.VO]
```

在```CompContext.AO```中找到了与```state```同名的属性

```javascript
// CompContext.AO
{
  arguments: {
    // ...
  },
  // ...
  state: InitialState, 
  // ...
}
```

而这个属性的值就是闭包所保存的```InitialState```，而不是当前时刻state的值

### 解决方案

#### 使用useRef

将延期函数要引用的变量保存到一个Ref中，并动态更新该Ref

然后延期函数引用这个Ref而不是原变量

```javascript
function Comp () {
  const [state, setState] = React.useState(InitialState);

  const stateRef = React.useRef(state);
  useEffect(
    () => {
      stateRef.current = state;
    },
    [state]
  ); 

  function f() {
    // 不再是console.log(state)，而是：
    console.log(stateRef.current);
  }
  htmlEle.addEventListener("click", F);
}
```

#### 使用useEffect

将事件绑定放入一个useEffect中

并将延期函数要引用的变量作为依赖参数传入useEffect的第二个参数中

```javascript
function Comp () {
  const [state, setState] = React.useState(InitialState);

  function f() {
    console.log(state);
  }
  useEffect(
    () => {
      htmlEle.addEventListener("click", F);
    },
    [state]
  ); 
}
```

此方法由于每次```依赖变量```更新都会触发useEffect，因此只适用于useEffect中的操作开销不大的情况

向上述代码中的addEventListener就不适用，因为每次state更新就会添加一个新的事件监听
