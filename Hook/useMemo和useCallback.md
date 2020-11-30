# useMemo和useCallback

## 目录

[useMemo](#jump1)

[useCallback](#jump2)

[使用场景](#jump3)

[与useEffect的区别](#jump4)

[](#jump)

[](#jump)

---	

<span id="jump1"></span>

## useMemo

```javascript
const memoizedValue = useMemo(() => f(), []);
```
### 参数

形式上与useEffect相似，可以传入两个参数：

- 第一个参数是一个回调函数，在**渲染期间**，将在依赖项发生改变时被执行

- 第二个参数是依赖数组

### 返回值

返回一个 memoized **值**，在依赖参数不变的的情况返回的是上次第一次计算的值

### 执行时机

memo是在**DOM更新前**触发的，类比生命周期就是```shouldComponentUpdate```

传入 useMemo 的函数会在**渲染期间**执行，不要在这个函数内部执行与渲染无关的操作

---

<span id="jump2"></span>

## useCallback

```javascript
const memoizedCallback = useCallback(() => f(), []);
```

### 参数

与useMemo一致，可以传入两个参数：

- 第一个参数是一个回调函数，在**渲染期间**，将在依赖项发生改变时被执行

- 第二个参数是依赖数组

### 返回值

返回第一个参数的 memoized 版本（是一个**函数**），在依赖参数不变的情况下，返回的回调函数是同一个引用地址

### 其他

useCallback(fn, deps) 相当于 useMemo(() => fn, deps)

---

<span id="jump3"></span>

## 使用场景

关于使用场景，二者的共同点就是它们都**仅作为性能优化的手段，而不要试图用它们阻止渲染**

### useMemo

某个值需要通过一个高开销的计算得到，当与这个值不相关的因素变化从而触发重渲染时，将引发该高开销的计算无意义的重新执行

#### 例子

##### 原始方案

```javascript
const [count, setCount] = useState(100);
const [irrelevance, setIrrelevance] = useState(100);

const handleSetCount = () => {
  setCount(pre => pre * 2);
};
const handleSetIrrelevance = () => {
  setIrrelevance(pre => pre * 2);
};

function countExpensiveComputation(count) {
  console.log('computeExpensiveValue 被执行');
  // 模拟高开销计算
  const array = new Array(count).fill(count);
  return array.reduce((currentTotal, item) => {
    return currentTotal + item;
  }, 0);
}
const computeValue = countExpensiveComputation(count);

return (
  <div>
    <div>{computeValue}</div>
    <div onClick={handleSetCount}>addCount{count} </div>
    <div onClick={handleSetIrrelevance}>addIrrelevance{changeNum}</div>
  </div>
);
```

当点击addIrrelevance时，控制台打印:

```javascript
> computeExpensiveValue 被执行
```

说明irrelevance变化时，触发了computeExpensiveValue不必要的执行，这是因为：

点击触发了重渲染，computeValue的赋值语句被重新执行，进而countExpensiveComputation被重新执行，而这时count并没有发生变化

##### 使用useMemo进行改进

将computeValue的赋值用useMemo进行包裹

```javascript
const [count, setCount] = useState(100);
const [irrelevance, setIrrelevance] = useState(100);

const handleSetCount = () => {
  setCount(pre => pre * 2);
};
const handleSetIrrelevance = () => {
  setIrrelevance(pre => pre * 2);
};

function countExpensiveComputation(count) {
  console.log('computeExpensiveValue 被执行');
  // 模拟高开销计算
  const array = new Array(count).fill(count);
  return array.reduce((currentTotal, item) => {
    return currentTotal + item;
  }, 0);
}
const computeValue = useMemo(() => computeExpensiveValue(count), [count]);

return (
  <div>
    <div>{computeValue}</div>
    <div onClick={handleSetCount}>addCount{count} </div>
    <div onClick={handleSetIrrelevance}>addIrrelevance{changeNum}</div>
  </div>
);
```

当点击addIrrelevance时，发现控制台不再打印

### useCallback

父组件将一个函数作为props传递给子组件，当父组件重渲染时，将会同时触发子组件的无意义重渲染

#### 例子

##### 原始方案

```javascript
const ParentComponent = () => {
  const [count, setCount] = useState(0);


  const handleParent = () => {
    console.log('ParentComponent clicked');
    setCount(preCount => preCount + 1);
  };
  const handleChild = () => {
    console.log('ChildComponent clicked');
  };

  return (
    <div>
      <div onClick={handleParent}>ParentBtn{count}</div>
      <ChildComponent handleChild={handleChild} />
    </div>
  );
};

const ChildComponent = memo(({ handleChild }) => {
  console.log('ChildrenComponent renders');
  return <div onClick={handleChild}>ChildBtn</div>;
});
```

当点击ParentBtn时，控制台打印：

```javascript
> ParentComponent clicked
> ChildrenComponent renders
```

说明父组件的操作引发了不必要的子组件重渲染，这是因为：

点击触发handleParent回调，setCount执行触发父组件重渲染，组件函数重新执行过程中新建一个handleChild，ChildComponent检测到其prop handleChild发生了变化因此也执行重渲染执，虽然ChildrenComponent采用了memo优化

##### 使用useCallback进行改进

将传递给子组件的点击回调函数用改为用useCallback包裹的handleChildCallback：

```javascript
const ParentComponent = () => {
  const [count, setCount] = useState(0);

  const handleParent = () => {
    console.log('ParentComponent clicked');
    setCount(preCount => preCount + 1);
  };
  const handleChild = () => {
    console.log('ChildComponent clicked');
  };
  const handleChildCallback = useCallback(() => {
    handleChild();
  }, []);

  return (
    <div>
      <div onClick={handleParent}>ParentBtn{count}</div>
      <ChildComponent handleChild={handleChildCallback} />
    </div>
  );
};

const ChildComponent = memo(({ handleChild }) => {
  console.log('ChildrenComponent renders');
  return <div onClick={handleChild}>ChildBtn</div>;
});
```

当点击ParentBtn时，控制台打印：

```javascript
> ParentComponent clicked
```

说明改进后，父组件的操作不再引发不必要的子组件重渲染，这是因为：

1. 父组件重渲染时，子组件的prop handleChild拿到的将是hook中保存的的值，由于依赖项无变化，故拿到的是前一次的值

2. 子组件本身是使用memo包裹的，即若props无变化则即使父组件重渲染也不会触发子组件重渲染

---

<span id="jump4"></span> 

## 与useEffect的区别

二者与useEffect的语法格式一致，且都是在依赖项发生变化后才执行回调，区别在于：

- 回调执行的时机，useEffect的回调在每次DOM渲染完成后才执行，而useMemo的回调则是在渲染期间执行

- useEffect的回调只要依赖项发生改变就会自动触发；useMemo和useCallback则是将目标变量或函数进行包裹，当使用该变量或函数且依赖项发生改变时，hook里的回调才会被触发

### 例子

我们的目标是控制```displayName```，使其只在name发生变化时才会被重新赋值，price发生变化时则不会

#### 使用useEffect

一个直觉上的方法，就是为useEffect的依赖数组传入name：

```javascript
const [price, setPrice] = useState(0);
const [name, setName] = useState('apple');

function getName() {
  console.log('getName触发');
  return name;
}
const displayName = getName(); // 目标

// 试图使用传入name作为依赖项的useEffect进行控制
useEffect(() => {
  console.log('name effect 触发');
  getName();
}, [name]);

return (
  <Fragment>
    <p>{displayName}</p>
    <button onClick={() => setPrice(price+1)}>价钱+1</button>
    <button onClick={() => setName(nameList[Math.random() * nameList.length << 0])}>修改名字</button>
  </Fragment>
);
```

上述代码当点击价钱+1按钮时，控制台输出结果为：

```javascript
> getName触发
```

可见useEffect并没有起到预期的效果，这是因为useEffect的执行时机是在每次渲染完成后，具体过程如下：

- setPrice触发重新渲染

- 触发```const displayName = getName();```执行

- 然后才是useEffect执行，name依赖没变，不执行回调

### 使用useMemo

```javascript
const [price, setPrice] = useState(0);
const [name, setName] = useState('apple');

function getName() {
  console.log('getName触发');
  return name;
}
const displayName = useMemo(() => {
  console.log('name memo 触发');
  return getName();
}, [name]);

return (
  <Fragment>
    <p>{displayName}</p>
    <button onClick={() => setPrice(price+1)}>价钱+1</button>
    <button onClick={() => setName(nameList[Math.random() * nameList.length << 0])}>修改名字</button>
  </Fragment>
);
```

上述代码当点击价钱+1按钮时，控制台没有输出，说明```getName```没有被触发
