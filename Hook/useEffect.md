# useEffect 

## 目录

[基本介绍](#jump1)

[无需清除的effect](#jump2)

[需要清除的effect](#jump3)

[使用多个 Effect 实现关注点分离](#jump4)

[通过跳过 Effect 进行性能优化](#jump5)

[useState的实现原理](#jump6)

---

<span id="jump1"></span>

## 基本介绍

### 概念

当你调用 useEffect 时，就是在告诉 React 在**每次DOM渲染完成之后**运行你的“副作用”函数

可以把 useEffect Hook 看做 componentDidMount，componentDidUpdate 和 componentWillUnmount 这三个函数的组合

```javascript
useEffect(didUpdate);
```

该 Hook 接收一个包含命令式、且可能有副作用代码的函数

### useEffect 做了什么？

通过使用这个 Hook，你可以告诉 React 组件需要在渲染后执行某些操作

React 会保存你传递的函数（我们将它称之为 “effect”），并且在执行 DOM 更新之后调用它

### 为什么在组件内部调用 useEffect？

将 useEffect 放在组件内部让我们可以在 effect 中直接访问 count state 变量（或其他 props）

我们不需要特殊的 API 来读取它 —— 它已经保存在函数作用域中

### useEffect 会在每次渲染后都执行吗？

是的，默认情况下，它在第一次渲染之后和每次更新之后都会执行

每次我们重新渲染，都会生成新的 effect，替换掉之前的

某种意义上讲，effect 更像是渲染结果的一部分 —— 每个 effect “属于”一次特定的渲染

不用再去考虑“挂载”还是“更新”，而是接受 effect 发生在**每次DOM渲染完成之后**这种概念

---

<span id="jump2"></span>

## 无需清除的effect

比如发送网络请求，手动变更 DOM，记录日志，这些都是常见的无需清除的操作

因为我们在执行完这些操作之后，不需要在将来的某个时间“取消”这些操作

让我们对比一下使用 class 和 Hook 都是怎么实现这些副作用的：

### 使用 class 的示例

我们把副作用操作放到 componentDidMount 和 componentDidUpdate 函数中：

```javascript
componentDidMount() {
document.title = `You clicked ${this.state.count} times`;
}
componentDidUpdate() {
document.title = `You clicked ${this.state.count} times`;
}
```

在这个 class 中，我们需要在两个生命周期函数中编写重复的代码

### 使用 Hook 的示例

```javascript
useEffect(() => {
document.title = `You clicked ${count} times`;
});
```

与 componentDidMount 或 componentDidUpdate 不同，使用 useEffect 调度的 effect 不会阻塞浏览器更新屏幕

大多数情况下，effect 不需要同步地执行，这让你的应用看起来响应更快

---

<span id="jump3"></span>

## 需要清除的effect

有一些副作用是需要清除的，例如在类组件中，需要放到componentWillUnmount中执行的操作

这种情况下，清除工作是非常重要的，可以防止引起内存泄露

### 使用 Class 的示例

通常会在 componentDidMount 中设置订阅，并在 componentWillUnmount 中清除它

```javascript
componentDidMount() {
  ChatAPI.subscribeToFriendStatus(
    this.props.friend.id,
    this.handleStatusChange
  );
}

componentWillUnmount() {
  ChatAPI.unsubscribeFromFriendStatus(
    this.props.friend.id,
    this.handleStatusChange
  );
}

handleStatusChange(status) {
  this.setState({
    isOnline: status.isOnline
  });
}
```

你会注意到 componentDidMount 和 componentWillUnmount 之间相互对应

使用生命周期函数迫使我们拆分这些逻辑代码，即使这两部分代码都作用于相同的副作用

### 使用 Hook 的示例

使 effect 返回一个函数，React 将会在执行清除操作时调用它

由于添加和删除订阅的代码的紧密性，所以 useEffect 的设计是在同一个地方执行

```javascript
useEffect(() => {
  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }
  ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);

  // 执行清除操作时会被调用
  return function cleanup() {
    ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
  };
});
```

#### 为什么要在 effect 中返回一个函数？

这是 effect 可选的清除机制，如此可以将添加和移除订阅的逻辑放在一起

如果你的 effect 返回一个函数，React 将会在执行清除操作时调用它

#### React 何时清除 effect？

React 会在**每次重新渲染前和组件卸载的时候**执行清除操作

effect 在每次渲染的时候都会执行，React 会在执行当前 effect 之前对上一个 effect 进行清除

---

<span id="jump4"></span>

## 使用多个 Effect 实现关注点分离

就像你可以使用多个 state 的 Hook 一样，你也可以使用多个 effect

Hook 允许我们按照代码的用途分离他们，这会将不相关逻辑分离到不同的 effect 中

下面是使用生命周期函数和Hook的比较：

- 使用class生命周期函数将计数器和好友在线状态指示器逻辑组合在一起

```javascript
class FriendStatusWithCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0, isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }
```

上述例子中，设置 document.title 的逻辑、订阅逻辑被分割到不同的生命周期函数中

而且 componentDidMount 中同时包含了两个不同功能的代码

- 使用useEffect实现相同功能

```javascript
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
}
```

---

<span id="jump5"></span>

## 通过跳过 Effect 进行性能优化

### 问题产生

如果渲染前后内容相同，每次渲染后都执行清理或者执行 effect 可能会导致性能问题

### 解决方案

可以通过传递数组作为 useEffect 的第二个可选参数，避免重复渲染

```javascript
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // 仅在 count 更改时更新
```

上面这个示例中，我们传入 [count] 作为第二个参数

当组件重渲染的时候，如果count和之前的一样，React 会跳过这个 effect

如果数组中有多个元素，即使只有一个元素发生变化，React 也会执行 effect

注意:

```
如果你要使用此优化方式，请确保数组中包含了所有外部作用域中会随时间变化并且在 effect 中使用的变量
```

### 传递空数组

如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组（[]）作为第二个参数

这就告诉 React 你的 effect 不依赖于 props 或 state 中的任何值，所以它永远都不需要重复执行

---

<span id="jump6"></span>

## useState的实现原理

### 模拟useEffect

```javascript
let memoizedState = []; // hooks 存放在这个数组，与useState等其他hooks共用
let cursor = 0; // 当前 memoizedState 下标

function useEffect(callback, depArray) {
  const hasNoDeps = !depArray;
  const deps = memoizedState[cursor];
  const hasChangedDeps = deps ?
    !depArray.every((el, i) => el === deps[i])
    : true;
  if (hasNoDeps || hasChangedDeps) {
    callback();
    memoizedState[cursor] = depArray;
  }
  cursor++;
}
```

### 为什么第二个参数是空数组，相当于 componentDidMount ？

因为依赖一直不变化，第二次及之后的执行中，```deps```均为```[]```，```hasChangedDeps```均为``` ![] === []```，callback 不会二次执行

