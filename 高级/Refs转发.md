# Refs转发

## 目录

[简介](#jump1)

[使用方法](#jump2)

---	

<span id="jump1"></span>

## 简介

Ref 转发是一个可选特性，其允许某些组件接收 ref，并将其向下传递（换句话说，“转发”它）给子组件

对于大多数应用中的组件来说，这通常不是必需的。但其对某些组件，尤其是可重用的组件库是很有用的

---

<span id="jump2"></span>

## 使用方法

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

**注意**
```
第二个参数 ref 只在使用 React.forwardRef 定义组件时存在

常规函数和 class 组件不接收 ref 参数，且 props 中也不存在 ref

Ref 转发不仅限于 DOM 组件，你也可以转发 refs 到 class 组件实例中
```

