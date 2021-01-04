# useImperativeHandle

## 目录

[概念](#jump1)

[使用](#jump2)

[使用useEffect模拟（原理）](#jump3)

[](#jump)

[](#jump)

[](#jump)

---	

<span id="jump1"></span>

## 概念

### 作用

子组件将自己的一些实例对外暴露，使得父组件可以拿到并使用它们

### 语法

```javascript
useImperativeHandle(ref, createHandle, [deps])
```

要特别留意不能忘记```createHandle```的箭头后的括号：

```javascript
() => ({
  属性名: 属性值
  ...
})
```

useImperativeHandle 应当与 forwardRef 一起使用，因为子组件对外暴露的实例是通过ref传递出去的

---

<span id="jump2"></span>

## 使用

子组件：

```javascript
import * as React from "react";

const { useImperativeHandle, forwardRef } = React;

// Child需要使用forwardRef包括，以实现ref透传
const Child = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    // useImperativeHandle会自动将下面的所有属性都赋值给ref.current
    childMethod: () => {
      // do sth
    },
    childAtribute: 值,
    ...
  }), [ 依赖项 ]);

  return (
    <div>我是子组件</div>
  )
});

export default Child;
```

父组件：

```javascript
import * as React from "react";

const { useRef } = React;

const Parent = props => {
  // 父组件中创建一个ref，它就是要传给子组件的那个ref
  const childRef = useRef();

  function handleClick() {
    // 通过ref.current可以拿到子组件暴露出来的实例
    childRef.current.childMethod();
    console.log(childRef.current.childAtribute);
    ...
  }

  return (
    <div>
      {/* 为子组件绑定ref */}
      <Child ref={childRef} />
      <button onClick={() => handleClick();} />
    </div>
  )
}
```

---

<span id="jump3"></span>

## 使用useEffect模拟（原理）

### 原理

useImperativeHandle的本质是父组件透传一个```ref```，子组件拿到该```ref```后将需要暴露出去的实例赋值到```ref.current```上，之后父组件就可以在```ref.current```中拿到这些实例了

### 模拟

根据原理，可以使用```useEffect```对```useImperativeHandle```进行模拟

useImperativeHandle：

```javascript
useImperativeHandle(ref, () => ({
  childMethod: () => {
    // do sth
  },
  childAtribute: 值,
  ...
}), [ 依赖项 ]);
```

使用useEffect模拟：

```javascript
useEffect(() => {
  if (ref) {
    ref.current = {
      childMethod: () => {
        // do sth
      },
      childAtribute: 值,
      ...
    };
  }
}, [ref]);
```
