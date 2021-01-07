# Refs转发

## 目录

[简介](#jump1)

[获取子组件的DOM](#jump2)

[获取子组件的实例](#jump3)

---	

<span id="jump1"></span>

## 简介

### 概念

- Ref 转发是一个可选特性，其允许某些组件接收 ref，并将其向下传递（换句话说，“转发”它）给子组件

- 对于大多数应用中的组件来说，这通常不是必需的。但其对某些组件，尤其是可重用的组件库是很有用的

### 语法

- 首先需要在父组件中创建一个ref

```javascript
// 父组件中创建一个ref，它就是要传给子组件的那个ref
const childRef = useRef();
```

- 将创建的ref传递给子组件

```javascript
return (
  <div>
    {/* 为子组件绑定ref */}
    <Child ref={childRef} />
    <button onClick={() => handleClick();} />
  </div>
)
```

- 子组件必须配合React.forwardRef使用，父组件传递过来的ref可从形参中获取

  - React.forwardRef既可以放在定义组件处：

  ```javascript
  const FancyButton = React.forwardRef((props, ref) => (
    <button ref={ref} className="FancyButton">
      {props.children}
    </button>
  ));
  ```
  
  - 也可以在最后导出的时候用React.forwardRef包裹被导出组件：

  ```javascript
  export default React.forwardRef(FancyButton);
  ```

---

<span id="jump2"></span>

## 获取子组件的DOM

在下面的示例中，FancyButton 使用 React.forwardRef 来获取传递给它的 ref，然后转发到它渲染的 DOM button：

```javascript
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// 你可以直接获取 button 的 ref：
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```

这样，使用 FancyButton 的组件可以获取底层 DOM 节点 button 的 ref ，并在必要时访问，就像其直接使用 DOM button 一样

---

<span id="jump3"></span>

## 获取子组件的实例

原理：父组件透传一个ref，子组件拿到该ref后将需要暴露出去的实例赋值到ref.current上，之后父组件就可以在ref.current中拿到这些实例了

子组件：

```javascript
import * as React from "react";

const { forwardRef } = React;

const Child = forwardRef((props, ref) => {
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
