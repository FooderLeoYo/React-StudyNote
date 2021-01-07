# Props

## 目录

[简介](#jump1)

[使用 Props](#jump2)

[默认 Props](#jump3)

[数据父传子](#jump4)

[数据子传父](#jump5)

---	

<span id="jump1"></span>

## 简介

在React中，数据流是自上而下单向的从父节点传递到子节点，组件需要从父节点提供的props中获取数据并渲染即可

如果顶层组件的某个prop改变了，React会递归地向下遍历整棵组件数，重新渲染所有使用这个属性的组件

在组件内部，props是组件唯一的数据来源

对于组件来说，props永远是只读的，不要尝试在组件内部调用setProps方法来修改props

---

<span id="jump2"></span>

## 使用 Props

### 函数式组件

函数式组件中，使用props.属性名，拿到参数值

```javascript
function HelloMessage(props) {
    return <h1>Hello, {props.name}!</h1>;
}
```

### 类组件

类组件中，使用this.props.属性名，拿到参数值

```javascript
class HelloMessage extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}
```

---

<span id="jump3"></span>

## 默认 Props

可以通过组件类的 defaultProps 属性为 props 设置默认值

```javascript
class HelloMessage extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}
 
HelloMessage.defaultProps = {
  name: 'Runoob'
};
```

---

<span id="jump4"></span>

## 数据父传子

我们可以在父组件中设置 state，并通过在子组件上使用 props 将其传递到子组件上

```javascript
class Parent extends React.Component {
  constructor() {
      super();
      this.state = {
        name: "传给子组件的参数",
      }
    }
  render() {
    return (
      <div>
        <Child name={this.state.name} />
      </div>
    );
  }
}
 
class Child extends React.Component {
  render() {
    return (
      <h1>{this.props.name}</h1>
    );
  }
}
```

---

<span id="jump5"></span>

## 数据子传父

### 利用ref透传

类组件中，使用[Refs转发](https://github.com/FooderLeoYo/React-StudyNote/blob/master/%E9%AB%98%E7%BA%A7/Refs%E8%BD%AC%E5%8F%91.md)，可将子组件的实例赋值给父组件传递过来的ref的current属性上

函数组件中，使用[useImperativeHandle](https://github.com/FooderLeoYo/React-StudyNote/blob/master/Hook/useImperativeHandle.md)

### 利用props

#### 原理

由于数据流是单向的，我们无法直接通过props实现子传父

但是，props的传值可以是任意的类型，这其中就包括函数

因此通过传递父元素的函数，就可以去修改父元素的state，从而达到传递数据给父元素

#### 实例

父组件

```javascript
class ParentCom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modifiedByChild: null
    }
  }

  render() {
    return (
      <div>
	{/* 将父组件的函数传递给子组件 */}
        <ChildCom setChildData={this.setChildData} />
	{/* 展示拿到的子组件数据 */}
        <h1>子元素传递给父元素的数据：{this.state.modifiedByChild}</h1>
      </div>
    )
  }
  setChildData = (data) => {
    this.setState({
      modifiedByChild: data
    })
  }
}
```

子组件

```javascript
class ChildCom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataToParent: "helloworld"
    }
  }
  render() {
    return (
      <div>
        <button onClick={this.sendData}>传递helloworld给父元素</button>
      </div>
    )
  }
  sendData = () => {
    // 调用父组件传递进来的函数，实现修改父组件的state
    this.props.setChildData(this.state.dataToParent)
  }
}
```

### 应用：状态提升

如果几个组件的数据需要共享，实现相互响应，则可以采用状态提升

核心思想：

1. 将需共享的数据提升至这些组件的最近共同父组件中，即将共享数据保存在父组件的state中

2. 子组件通过调用父组件传递过来的函数实现修改共享数据

3. 子组件通过this.props拿到共享数据
