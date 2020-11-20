# useMemo

## 目录

[定义](#jump1)

[](#jump)

[](#jump)

[](#jump)

[](#jump)

[](#jump)

---	

<span id="jump1"></span>

## 定义

```javascript
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

返回一个 memoized 值

把“创建”函数和依赖项数组作为参数传入 useMemo，它仅会在某个依赖项改变时才重新计算 memoized 值。这种优化有助于避免在每次渲染时都进行高开销的计算

如果没有提供依赖项数组，useMemo 在每次渲染时都会计算新的值

传入 useMemo 的函数会在渲染期间执行，不要在这个函数内部执行与渲染无关的操作

