# Fragments

## 目录

[有什么用](#jump1)

[语法糖](#jump2)

[带 key 的 Fragments](#jump3)

---	

<span id="jump1"></span>

## 有什么用

### 问题产生

React 中的一个常见模式是一个组件返回多个元素

render 函数的返回必须有一个根节点，否则报错，为满足这一原则会使用一个div包裹一下

这样就会产生很多不必的要节点嵌套，使代码结构变得复杂

### 解决方案

Fragments 允许你将子列表分组，而无需向 DOM 添加额外节点

Fragments与Vue.js的<template>功能类似，可做不可见的包裹元素

```javascript
class Columns extends React.Component {
  render() {
    return (
	  {/* 相当于用Fragment替换了原来的div */}
      <React.Fragment>
        <td>Hello</td>
        <td>World</td>
      </React.Fragment>
    );
  }
}
```

---

<span id="jump2"></span>

## 语法糖

可以使用一种新的，且更简短的语法来声明 Fragments

它看起来像空标签：

```javascript
class Columns extends React.Component {
  render() {
    return (
      <>
        <td>Hello</td>
        <td>World</td>
      </>
    );
  }
}
```

注意：

```
语法糖不支持 key 属性
```

---

<span id="jump3"></span>

## 带 key 的 Fragments

使用显式 <React.Fragment> 语法声明的片段可具有 key

```javascript
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // 没有`key`，React 会发出一个关键警告
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```

注意：

```
key 是目前唯一可以传递给 Fragment 的属性
```