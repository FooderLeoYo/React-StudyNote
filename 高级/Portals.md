# Portals

## 目录

[基本概念](#jump1)

[用法](#jump2)

[](#jump)

[](#jump)

[](#jump)

[](#jump)

---	

<span id="jump1"></span>

## 基本概念

Portal 提供了一种将子节点渲染到存在于父组件以外的 DOM 节点的优秀的方案

```javascript
ReactDOM.createPortal(child, container)
```

第一个参数（child）是任何可渲染的 React 子元素，例如一个元素，字符串或 fragment。第二个参数（container）是需要嵌入到其他 DOM 节点的元素，嵌入还需要再使用appendChild

---

<span id="jump2"></span>

## 用法

通常来讲，当你从组件的 render 方法返回一个元素时，该元素将被挂载到 DOM 节点中离其最近的父节点

然而，有时候将子元素插入到 DOM 节点中的不同位置也是有好处的，一个 portal 的典型用例是当父组件有 overflow: hidden 或 z-index 样式时，但你需要子组件能够在视觉上“跳出”其容器。例如，对话框、悬浮卡以及提示框

即使 Portal 是在父级 DOM 元素之外呈现的，他的表现行为也跟平常我们在 React 组件中使用是一样的。它能够接受 props 以及 context API。这是因为 Portal 驻留在 React Tree 层次结构内（也就是保证在同一颗 React Tree 上）

