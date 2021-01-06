# Refs & DOM

## 目录

[概念](#jump1)

[创建 Refs](#jump2)

[访问 Refs](#jump3)

[将 DOM Refs 暴露给父组件](#jump4)

[](#jump)

[](#jump)

---	

<span id="jump1"></span>

## 概念

在典型的 React 数据流中，props 是父组件与子组件交互的唯一方式

但是，在某些情况下，你需要在典型数据流之外强制修改子组件。被修改的子组件可能是一个 React 组件的实例，也可能是一个 DOM 元素

你可能首先会想到使用 refs 在你的 app 中“让事情发生”，通常你会想明白，让更高的组件层级拥有这个 state，是更恰当的

---

<span id="jump2"></span>

## 创建 Refs

Refs 是使用 React.createRef() 创建的，并通过 ref 属性附加到 React 元素：

```javascript
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return <div ref={this.myRef} />;
  }
}
```

---

<span id="jump3"></span>

## 访问 Refs

ref 的值根据节点的类型而有所不同

### 为 DOM 元素添加 ref

当 ref 属性用于 HTML 元素时，构造函数中使用 React.createRef() 创建的 ref 接收底层 DOM 元素作为其 current 属性

React 会在组件挂载时给 current 属性传入 DOM 元素，并在组件卸载时传入 null 值。ref 会在 componentDidMount 或 componentDidUpdate 生命周期钩子触发前更

以下代码使用 ref 去存储 DOM 节点的引用：

```javascript
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // 创建一个 ref 来存储 textInput 的 DOM 元素
    this.textInput = React.createRef();
  }

  focusTextInput() {
    // 直接使用原生 API 使 text 输入框获得焦点
    // 注意：我们通过 "current" 来访问 DOM 节点
    this.textInput.current.focus();
  }

  render() {
    // 告诉 React 我们想把 <input> ref 关联到
    // 构造器里创建的 `textInput` 上
    return (
      <div>
        <input type="text" ref={this.textInput} />
        <input type="button" value="Focus the text input"
          onClick={this.focusTextInput}/>
      </div>
    );
  }
}
```

### 为 class 组件添加 Ref

当 ref 属性用于自定义 class 组件时，ref 对象接收组件的挂载实例作为其 current 属性

我们可以使用 ref 来获取上面的 CustomTextInput 的 input 组件并手动调用它的 focusTextInput 方法：

```javascript
class AutoFocusTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  componentDidMount() {
    this.textInput.current.focusTextInput();
  }

  render() {
    return (
      <CustomTextInput ref={this.textInput} />
    );
  }
}
```

这时CustomTextInput中的ref无需再创建，而是使用AutoFocusTextInput传递给它的：

```javascript
class CustomTextInput extends React.Component {
  constructor(props, ref) {
    super(props);
    // 不再需要新建一个ref，而是使用CustomTextInput传递过来的
    this.textInput = ref;
  }

  // 其他部分则与原来一样
}
```

### Refs 与函数组件

如果要在函数组件中使用 ref，你可以使用 forwardRef（可与 useImperativeHandle 结合使用）

---

<span id="jump4"></span>

## 将 DOM Refs 暴露给父组件

你可能希望在父组件中引用子节点的 DOM 节点或实例，官方推荐使用[Refs转发](https://github.com/FooderLeoYo/React-StudyNote/blob/master/%E9%AB%98%E7%BA%A7/Refs%E8%BD%AC%E5%8F%91.md)
