# Refs

## 目录

[简介](#jump1)

[使用方法](#jump2)

---	

<span id="jump1"></span>

## 简介

React 支持一种非常特殊的属性 Ref ，你可以用来绑定到 render() 输出的任何组件上

这个特殊的属性允许你可以确保在任何时间总是拿到正确的实例

---

<span id="jump2"></span>

## 使用方法

绑定一个 ref 属性到 render 的返回值上：

```javascript
<input ref="myInput" />
```

在其它代码中，通过 this.refs 获取支撑实例:

```javascript
var input = this.refs.myInput;
```

拿到元素后，可以获取它的属性：

```javascript
var inputValue = input.value;
var inputRect = input.getBoundingClientRect();
```
