# Render Props

## 目录

[概念](#jump1)

[解决横切关注点（Cross-Cutting Concerns）](#jump2)

[与传统props的区别](#jump3)

[注意事项](#jump4)

[](#jump)

[](#jump)

---	

<span id="jump1"></span>

## 概念

具有 render prop 的组件接受一个函数，该函数返回一个 React 元素并调用它来实现渲染，而不是实现自己的渲染逻辑

更具体地说，render prop是一个用于告知组件需要渲染什么内容的函数形式的prop

```javascript
<DataProvider render={data => (
  <h1>Hello {data.target}</h1>
)}/>
```

---

<span id="jump2"></span>

## 解决横切关注点（Cross-Cutting Concerns）

分享一个组件state到其他需要相同state的组件并不总是很容易

### 需求产生

比如需要封装一个Mouse组件，它相当于一个空盒子，使得鼠标在这个盒子中移动时，将鼠标的当前坐标记录到它的state中：

```javascript
class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>
      </div>
    );
  }
}
```

现在有另一个组件Cat，它可以呈现一张在屏幕上追逐鼠标的猫的图片。为了实现这一效果，Cat就需要使用Mouse的state：

```javascript
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}
```

### 将Cat作为Mouse的子组件

一个可行的办法是在Mouse内部渲染Cat组件：

```javascript
class Mouse extends React.Component {
  // 这些部分与之前相同
  // ...

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>
        <Cat mouse={this.state} />
      </div>
    );
  }
}
```

然后在父组件中使用Mouse：

```javascript
class App extends React.Component {
  render() {
    return (
      <div>
        <h1>移动鼠标!</h1>
        <Mouse />
      </div>
    );
  }
}
```

很显然，这种方式下的Mouse的封装并不彻底，因为它与Cat存在耦合。那么它就不是完全可复用的，每当我们想要鼠标位置用于不同的用例时，我们必须创建一个新的组件（本质上是另一个Mouse）

### 使用render prop

我们可以提供一个带有函数 prop 的 Mouse 组件，它能够动态决定什么需要渲染的，而不是将 Cat 硬编码到 Mouse 组件里：

```javascript
class Mouse extends React.Component {
  // 这些部分与之前相同
  // ...

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>
        {/*
          Instead of providing a static representation of what <Mouse> renders,
          use the `render` prop to dynamically determine what to render.
        */}
        {this.props.render(this.state)}
      </div>
    );
  }
}
```

然后在父组件中使用Mouse时，传递所需渲染的内容（即Cat）作为render prop给Mouse：

```javascript
class App extends React.Component {
  render() {
    return (
      <div>
        <h1>移动鼠标!</h1>
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

---

<span id="jump3"></span>

## 与传统props的区别

### 命名

render prop 是因为模式才被称为 render prop ，你不一定要用名为 render 的 prop 来使用这种模式

尽管之前的例子使用了 render，我们也可以简单地使用 children prop：

```javascript
<Mouse children={mouse => (
  <p>鼠标的位置是 {mouse.x}，{mouse.y}</p>
)}/>
```

### 位置

render prop 并不真正需要添加到 JSX 元素的 “attributes” 列表中

相反，你可以直接放置到元素的内部：

```javascript
<Mouse>
  {mouse => (
    <p>鼠标的位置是 {mouse.x}，{mouse.y}</p>
  )}
</Mouse>
```

---

<span id="jump4"></span>

## 注意事项

### 与 React.PureComponent 一起使用

如果你在 render 方法里创建函数，那么使用 render prop 会抵消使用 React.PureComponent 带来的优势

因为如果在 render 方法里创建函数，那么这个函数将在每次渲染完成后会被销毁，然后在下一次渲染时又会生成一个新的函数，那么浅比较 props 的时候总会得到 false

例如，继续我们之前使用的 Mouse 组件，如果 Mouse 继承自 React.PureComponent 而不是 React.Component，我们的例子看起来就像这样：

```javascript
class Mouse extends React.PureComponent {
  // 与上面相同的代码......
}

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        {/*
          Bad！
          每此渲染的 `render` prop的值将会是不同的。
        */}
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

为了绕过这一问题，有时你可以定义一个 prop 作为实例方法，类似这样：

```javascript
class MouseTracker extends React.Component {
  // 定义为实例方法
  // 当我们在渲染中使用它时，`this.renderTheCat`始终指向的是相同的函数
  renderTheCat(mouse) {
    return <Cat mouse={mouse} />;
  }

  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse render={this.renderTheCat} />
      </div>
    );
  }
}
```

如果你无法静态定义 prop（例如，因为你需要关闭组件的 props 和/或 state），则 Mouse 应该扩展 React.Component