# useReducer

## 目录

[定义](#jump1)

[指定初始 state](#jump2)

[跳过dispatch](#jump3)

[使用场景](#jump4)

[useReducer的优点](#jump5)

[与useState的区别](#jump6)


---	

<span id="jump1"></span>

## 定义

```javascript
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

它接收一个形如 (state, action) => newState 的 reducer

返回当前的 state 以及与其配套的 dispatch 方法，其中dispatch不会因re-render而改变

useState 的替代方案，在某些场景下，useReducer 会比 useState 更适用，例如：

- state 逻辑较复杂且包含多个子值

- 下一个 state 依赖于之前的 state 等

---

<span id="jump2"></span>

## 指定初始 state

有两种不同初始化 useReducer state 的方式，你可以根据使用场景选择其中的一种

### 作为第二个参数传入 useReducer

```javascript
const [state, dispatch] = useReducer(
  reducer,
  {count: initialCount}
);
```

### 惰性初始化

需要将 init 函数作为 useReducer 的第三个参数传入，这样初始 state 将被设置为 init(initialArg)

```javascript
function init(initialCount) {
  return {count: initialCount};
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}

function Counter({initialCount}) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'reset', payload: initialCount})}>Reset</button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

这么做可以将用于计算 state 的逻辑提取到 reducer 外部，这也为将来对重置 state 的 action 做处理提供了便利

---

<span id="jump3"></span>

## 跳过dispatch

如果 Reducer Hook 的返回值与当前 state 相同，React 将跳过子组件的渲染及副作用的执行（React 使用 Object.is 比较算法 来比较 state）

需要注意的是，React 可能仍需要在跳过渲染前再次渲染该组件。不过由于 React 不会对组件树的“深层”节点进行不必要的渲染，所以大可不必担心。如果你在渲染期间执行了高开销的计算，则可以使用 useMemo 来进行优化

---

<span id="jump4"></span>

## 使用场景

- 如果你的state是一个数组或者对象

- 如果你的state变化很复杂，经常一个操作需要修改很多state

- 如果你需要在深层子组件里面去修改一些状态

- 如果你希望构建自动化测试用例来保证程序的稳定性

- 如果你用应用程序比较大，希望UI和业务能够分开维护

---

<span id="jump5"></span>

## useReducer的优点

- useReducer可以让我们将what和how分开。比如点击了登录按钮，我们要做的就是发起登陆操作dispatch({ type: 'login' })，点击退出按钮就发起退出操作dispatch({ type: 'logout' })，所有和how相关的代码都在reducer中维护，组件中只需要思考What。这让我们的代码可以像用户的行为一样，更加清晰，实现了表现和业务分离

- 另一个好处是所有的state处理都集中到了一起，使得我们对state的变化更有掌控力，同时也更容易复用state逻辑变化代码，比如在其他函数中也需要触发登录error状态，只需要dispatch({ type: 'error' })

- Reducer是一个UI无关的纯函数，useReducer的方案使得我们更容易构建自动化测试用例

---

<span id="jump6"></span>

## 与useState的区别

### 延期执行函数中的state更新

当某个state的更新逻辑位于一个延期执行函数中时，useReducer用于更新state可以避免闭包旧数据问题

这是因为，useReducer的dispatch 的身份永远是稳定的 —— 即使 reducer 函数是定义在组件内部并且依赖 props

```javascript
// s将永远只能拿到初始值，导致除了首次调用setState，之后的state永远不会“+1”
setState(s + 1); 

// state将可以正确的“+1”
dispatch({type: 'add', gap: 1}); 
```

### 当 state 只是用来描述一个独立的元素时，请使用 useState

### 当 state 中的一个元素依赖于另一个 state 的值来进行更新时，请使用 useReducer