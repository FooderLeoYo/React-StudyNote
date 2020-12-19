# useLayoutEffect

## 目录

[定义](#jump1)

[与useEffect的不同](#jump2)

---	

<span id="jump1"></span>

## 定义

其函数签名与 useEffect 相同，可以使用它来读取 DOM 布局并同步触发重渲染

useLayoutEffect和componentDidMount和componentDidUpdate触发时机一致（都在在DOM修改后且浏览器渲染之前）

useLayoutEffect要比useEffect更早的触发执行

useLayoutEffect会阻塞浏览器渲染，切忌执行同步的耗时操作

---

<span id="jump2"></span>

## 与useEffect的不同

除非要修改DOM并且不让用户看到修改DOM的过程，才考虑使用useLayoutEffect，否则应当使用useEffect，因为useLayoutEffect会阻塞渲染

### 例子

展示随机数字的case，点击后count先变为0，经过一个耗时操作后再变为另一个随机生成个数字

#### 使用useEffect实现:

```javascript
import { useState, useEffect, useLayoutEffect } from 'react'

export default function App() {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        console.log(`useEffect - count=${count}`)
        // 耗时的操作
        const pre = Date.now();
        while(Date.now() - pre < 500) {}
        
        // count为0时重新生成个随机数
        if (count === 0) {    
            setCount(10 + Math.random() * 200);
        }
    }, [count]);
    
    // 点击DIV重置count
    return (
        <div onClick={() => setCount(0)}>{count}</div>
    );
} 
```

[useEffect随机数](https://raw.githubusercontent.com/FooderLeoYo/React-StudyNote/master/assets/imgs/useEffect%E9%9A%8F%E6%9C%BA%E6%95%B0.gif)

点击后会先显示0，然后才显示随机数

#### useLayoutEffect实现

```javascript
import { useState, useEffect, useLayoutEffect } from 'react'

export default function App() {
    const [count, setCount] = useState(0);
    
    useLayoutEffect(() => {
        console.log(`useLayoutEffect - count=${count}`)
        // 耗时的操作
        const pre = Date.now();
        while(Date.now() - pre < 500) {}

        if (count === 0) {    
            setCount(10 + Math.random() * 200);
        }
    }, [count]);
  
    return (
        <div onClick={() => setCount(0)}>{count}</div>
    );
}  
```

[useLayoutEffect随机数](https://raw.githubusercontent.com/FooderLeoYo/React-StudyNote/master/assets/imgs/useLayoutEffect%E9%9A%8F%E6%9C%BA%E6%95%B0.gif)

点击后发现：

- 没有闪烁，当点击 div，count 更新为 0，此时页面并不会渲染，而是等待useLayoutEffect内部状态修改后，才会去更新页面，所以页面不会闪烁

- 但是也可以发现页面更新的比较卡顿，因为useLayoutEffect会阻塞浏览器渲染，正好本例中useLayoutEffect的实参函数里有个耗时操作，所以页面更新比较卡顿