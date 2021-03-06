# Hook 概览

## 目录

[概念](#jump1)

[在组件之间复用状态逻辑很难](#jump2)

[复杂组件变得难以理解](#jump3)

[难以理解的class](#jump4)

[Hook 规则](#jump5)

---	

<span id="jump1"></span>

## 概念

Hook 是一些可以让你在函数组件里“钩入” React state 及生命周期等特性的函数

主要解决以下几个问题：

---

<span id="jump2"></span>

## 在组件之间复用状态逻辑很难

React 没有提供将可复用性行为“附加”到组件的途径（例如，把组件连接到 store）

Hook 使你在无需修改组件结构的情况下复用状态逻辑

---

<span id="jump3"></span>

## 复杂组件变得难以理解

例如，组件常常在 componentDidMount 和 componentDidUpdate 中获取数据

但是，同一个 componentDidMount 中可能也包含很多其它的逻辑，如设置事件监听，而之后需在 componentWillUnmount 中清除

相互关联且需要对照修改的代码被进行了拆分，而完全不相关的代码却在同一个方法中组合在一起

为了解决这个问题，Hook 将组件中相互关联的部分拆分成更小的函数（比如设置订阅或请求数据），而并非强制按照生命周期划分

---

<span id="jump4"></span>

## 难以理解的class

你必须去理解 JavaScript 中 this 的工作方式，还不能忘记绑定事件处理器，没有稳定的语法提案，这些代码非常冗余

使用 class 组件会无意中鼓励开发者使用一些让优化措施无效的方案，class 不能很好的压缩，并且会使热重载出现不稳定的情况

为了解决这些问题，Hook 使你在非 class 的情况下可以使用更多的 React 特性

---

<span id="jump5"></span>

## Hook 规则

在使用Hook时需要遵循两条规则：

### 只在最顶层使用 Hook

不要在循环，条件或嵌套函数中调用 Hook

遵守这条规则，你就能确保 Hook 在每一次渲染中都按照同样的顺序被调用

这让 React 能够在多次的 useState 和 useEffect 调用之间保持 hook 状态的正确

如果想要有条件地执行一个 effect，可以将判断放到 Hook 的内部：

```javascript
useEffect(function persistForm() {
  // 👍 将条件判断放置在 effect 中
  if (name !== '') {
    localStorage.setItem('formData', name);
  }
});
```

### 只在 React 函数中调用 Hook

不要在普通的 JavaScript 函数中调用 Hook。你可以：

- 在 React 的函数组件中调用 Hook

- 在自定义 Hook 中调用其他 Hook

### ESLint 插件

如果使用了提供的 lint 插件，就无需担心出现上述两个问题
