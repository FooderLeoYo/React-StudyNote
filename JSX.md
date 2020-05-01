# JSX

## 目录

[简介](#jump1)

[使用 JSX](#jump2)

[JSX中的JavaScript表达式](#jump3)

[样式](#jump4)

[注释](#jump5)

[数组](#jump6)

---	

<span id="jump1"></span>

## 简介

React 使用 JSX 来替代常规的 JavaScript。

JSX 是一个看起来很像 XML 的 JavaScript 语法扩展

我们知道元素是构成 React 应用的最小单位，JSX 就是用来声明 React 当中的元素

我们不需要一定使用 JSX，但它有以下优点：

- JSX 执行更快，因为它在编译为 JavaScript 代码后进行了优化。

- 它是类型安全的，在编译过程中就能发现错误。

- 使用 JSX 编写模板更加简单快速

注意:

```
由于 JSX 就是 JavaScript，一些标识符像 class 和 for 不建议作为 XML 属性名
作为替代，React DOM 使用 className 和 htmlFor 来做对应的属性
```

---

<span id="jump2"></span>

## 使用 JSX

- 我们可以在代码中嵌套多个 HTML 标签，需要使用一个 div 元素包裹它

- 添加自定义属性需要使用 data- 前缀，实例中的 p 元素添加了自定义属性 data-myattribute

```javascript
ReactDOM.render(
    <div>
    <h1>标题</h1>
    <h2>欢迎学习 React</h2>
    <p data-myattribute = "somevalue">这是一个很不错的 JavaScript 库!</p>
    </div>
    ,
    document.getElementById('example')
);
```

---

<span id="jump3"></span>

## JSX中的JavaScript表达式

### 基本

- 我们可以在 JSX 中使用 JavaScript 表达式。表达式写在花括号 {} 中

- 一个括号内只能有一个表达式

- {}中间表达式中可以使用JSX对象

```javascript
ReactDOM.render(
    <div>
      <h1>{1+1}</h1>
    </div>
    ,
    document.getElementById('example')
);
```

### 在 JSX 中不能使用 if else 语句，但可以使用 conditional (三元运算) 表达式来替代

```javascript
ReactDOM.render(
    <div>
      <h1>{i == 1 ? 'True!' : 'False'}</h1>
    </div>
    ,
    document.getElementById('example')
);
```

---

<span id="jump4"></span>

## 样式

### 基本

- React 推荐使用内联样式

- 我们可以使用 camelCase 语法来设置内联样式. React 会在指定元素数字后自动添加 px 

```javascript
var myStyle = {
    fontSize: 100,
    color: '#FF0000'
};
ReactDOM.render(
    <h1 style = {myStyle}>内容</h1>,
    document.getElementById('example')
);
```

### class，style中，不可以存在多个class或style属性

```jsx
{/* 错误的表示 */}
<div class=’abc’  class={‘active’}> 
```

### style样式中，如果存在多个单词的属性组合，第二个单词开始，首字母大写，或者用引号引起来，否则会报错

```javascript
let exampleStyle = {
    borderBottom:"4px solid red",
    'background-image':"url(https://www.baidu.com/img/pc_1c6e30772d5e4103103bd460913332f9.png)"
}
```

### 多个类共存的操作

```javascript
// 将多个类的类名进行字符串拼接
let element2 = (
    <div>
        <h1 className={"abc" + classStr}>helloworld</h1>
    </div>
)
```

---

<span id="jump5"></span>

## 注释

- 注释需要写在花括号中

```javascript
ReactDOM.render(
    <div>
    <h1>内容</h1>
    {/*注释...*/}
     </div>,
    document.getElementById('example')
);
```

---

<span id="jump6"></span>

## 数组

- JSX 允许在模板中插入数组，数组会自动展开所有成员

```javascript
var arr = [
  <h1>内容1</h1>,
  <h2>内容2</h2>,
];
ReactDOM.render(
  <div>{arr}</div>,
  document.getElementById('example')
);
```
