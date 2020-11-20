# useRef

## 目录

[定义](#jump1)

[访问目标DOM节点](#jump2)

[解决过时闭包数据问题](#jump3)

[确保DOM节点已加载](#jump4)

[](#jump)

[](#jump)

---	

<span id="jump1"></span>

## 定义

```javascript
const refContainer = useRef(initialValue);
```

useRef 返回一个可变的 ref 对象，其 .current 属性被初始化为传入的参数（initialValue），这里的可变指的是useRef 就像是可以在其 .current 属性中保存一个可变值的“盒子”

返回的 ref 对象在组件的整个生命周期内保持不变，这里的不变不是不能重新赋值，而是始终为同一个引用，不会随着函数式组件在重新渲染时被销毁-重建

---

<span id="jump2"></span>

## 访问目标DOM节点

相当于类组件中的```ref```

```javascript
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

---

<span id="jump3"></span>

## 解决过时闭包数据问题

原理：useRef 会在每次渲染时返回同一个 ref 对象

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
  htmlEle.addEventListener("click", f);
}
```

---

<span id="jump4"></span>

## 确保DOM节点已加载

当 ref 对象内容发生变化时，useRef 并不会通知你，变更 .current 属性不会引发组件重新渲染

如果想要在 React 绑定或解绑 DOM 节点的 ref 时运行某些代码，则需要使用回调 useCallback 来实现

```javascript
function MeasureExample() {
  const [height, setHeight] = useState(0);

  const measuredRef = useCallback(node => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  return (
    <>
      <h1 ref={measuredRef}>Hello, world</h1>
      <h2>The above header is {Math.round(height)}px tall</h2>
    </>
  );
}
```

如果你希望在每次组件调整大小时都收到通知，则还需要使用 ResizeObserver 或基于其构建的第三方 Hook

