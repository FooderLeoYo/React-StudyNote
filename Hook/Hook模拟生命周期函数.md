# Hook模拟生命周期函数

## 目录

[componentDidMount](#jump1)

[componentDidUpdate](#jump2)

[componentWillUnmount](#jump3)

[getDerivedStateFromProps](#jump4)

[](#jump)

[](#jump)

[](#jump)

---	

<span id="jump1"></span>

## componentDidMount

使用```useEffect```

第二个参数传入一个空数组

这样该```useEffect```内的语句只会在组件加载完成时执行一次

```javascript
useEffect(() => {
  // do sth
}, []);
```

**注意**，由于闭包造成的过时数据问题，如果在第二个参数传入一个空数组的useEffect中有延迟执行函数，比如设置定时器或绑定事件监听回调，那么当延迟时间结束该函数执行时，拿到的仍是初始值而非当前值

解决办法为使用Ref或为[]添加依赖变量

---

<span id="jump2"></span>

## componentDidUpdate

使用```useEffect```

第二个参数传入一个数组，数组元素为需要监听的变量

```javascript
useEffect(() => {
  // do sth
}, [arg]);
```

---

<span id="jump3"></span>

## componentWillUnmount

使用```useEffect```

并将需要在组件卸载时执行的语句写在```return```内

可以传入了一个数组，若如此，则相当于一个只关注数组中变量的```componentWillUnmount```

```javascript
useEffect(() => {
  return () => {
    wsForClose.webSocket.close();
  }
}, [wsForClose]);
```

---

<span id="jump4"></span>

## getDerivedStateFromProps

使用useState；这个state可以是组件渲染所依赖的某个数据，也可以一个最简单的flage，因为其目的仅仅是调用一个set方法进而触发组件刷新

使用useEffect，并把目标```prop```作为依赖参数，目标```prop```发生变化时需要执行的操作写在useEffect中

调用set方法，触发组件刷新

```javascript
const [flag, setFlag] = useState(1); // flag形式的state
// 也可以是组件渲染所依赖的某个数据：const [data, setData] = useState(initData);

useEffect(() => {
  // 进行需要的操作
  // ...
  
  setFlag(-flag); // 调用一个set方法进而触发组件刷新
}, [props.目标prop]);
```
