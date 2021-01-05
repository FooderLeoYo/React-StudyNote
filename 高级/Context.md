# Context

## 目录

[Context有什么用](#jump1)

[React.createContext](#jump2)

[Context.Provider](#jump3)

[Class.contextType](#jump4)

[Context.Consumer](#jump5)

[Context.displayName](#jump6)

---	

<span id="jump1"></span>

## Context有什么用

Context 提供了一个无需为每层组件手动添加 props，就能在组件树间进行数据传递的方法

Context 设计目的是为了共享那些对于一个组件树而言是“全局”的数据

---

<span id="jump2"></span>

## React.createContext

```javascript
const MyContext = React.createContext(defaultValue);
```

- 创建一个 Context 对象

- 当渲染一个订阅了这个 Context 对象的组件，这个组件会从组件树中离自身最近的那个匹配的 Provider 中读取到当前的 context 值

- 只有当组件所处的树中没有匹配到 Provider 时，其 defaultValue 参数才会生效

---

<span id="jump3"></span>

## Context.Provider

```javascript
<MyContext.Provider value={/* 某个值 */}>
```

- 每个 Context 对象都会返回一个 Provider 组件，它允许消费组件订阅 context 的变化

- Provider 接收一个 value 属性，传递给消费组件

- 当 Provider 的 value 值发生变化时，它内部的所有消费组件都会重新渲染

---

<span id="jump4"></span>

## Class.contextType

```javascript
MyClass.contextType = MyContext;
``

- 挂载在 class 上的 contextType 属性会被重赋值为一个由 React.createContext() 创建的 Context 对象

- 这能让你使用 this.context 来消费最近 Context 上的那个值

---

<span id="jump5"></span>

## Context.Consumer

```javascript
<MyContext.Consumer>
  {value => /* 基于 context 值进行渲染*/}
</MyContext.Consumer>
```

- 能让你在函数式组件中完成订阅 context

- 传递给函数的 value 值等同于往上组件树离这个 context 最近的 Provider 提供的 value 值

---

<span id="jump6"></span>

## Context.displayName

- context 对象接受一个名为 displayName 的 property，类型为字符串

- React DevTools 使用该字符串来确定 context 要显示的内容
