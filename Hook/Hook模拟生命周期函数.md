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

把目标```prop```上一轮的变量的值存在一个```state```变量中

比较目标```prop```变量的当前值与前一轮是否相同

```javascript
const [prevArg, setPrevArg] = useState(null);

if (props.arg !== prevArg) {
  // do sth
}
```

