# JSX

## 目录

[简介](#jump1)

[使用 JSX](#jump2)

[JSX中的JavaScript表达式](#jump3)

[样式](#jump4)

[注释](#jump5)

[数组](#jump6)

[用户定义的组件必须以大写字母开头](#jump7)

[动态决定React元素类型](#jump8)

[JSX 中的 Props](#jump9)

[JSX 中的子元素](#jump10)

[](#jump)

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

---

<span id="jump7"></span>

## 用户定义的组件必须以大写字母开头

小写字母开头的元素代表一个 HTML 内置组件，比如```<div>```或者```<span>```

如果你确实需要一个以小写字母开头的组件，则在 JSX 中使用它之前，必须将它赋值给一个大写字母开头的变量

```javascript
// 错误！组件应该以大写字母开头：
function hello(props) {
  // 正确！这种 <div> 的使用是合法的，因为 div 是一个有效的 HTML 标签
  return <div>Hello {props.toWhat}</div>;
}

function HelloWorld() {
  // 错误！React 会认为 <hello /> 是一个 HTML 标签，因为它没有以大写字母开头：
  return <hello toWhat="World" />;
}
```

---

<span id="jump8"></span>

## 动态决定React元素类型

不能将通用表达式作为 React 元素类型

如果你想通过通用表达式来（动态）决定元素类型，你需要首先将它赋值给大写字母开头的变量

这通常用于根据 prop 来渲染不同组件的情况下：

```javascript
function Story(props) {
  // 错误！JSX 类型不能是一个表达式。
  return <components[props.storyType] story={props.story} />;
}
```

要解决这个问题, 需要首先将类型赋值给一个大写字母开头的变量：

```javascript
function Story(props) {
  // 正确！JSX 类型可以是大写字母开头的变量。
  const SpecificStory = components[props.storyType];
  return <SpecificStory story={props.story} />;
}
```

---

<span id="jump9"></span>

## JSX 中的 Props

有多种方式可以在 JSX 中指定 props

### 属性展开

如果你已经有了一个 props 对象，你可以使用展开运算符 ... 来在 JSX 中传递整个 props 对象

以下两个组件是等价的：

```javascript
function App1() {
  return <Greeting firstName="Ben" lastName="Hector" />;
}

function App2() {
  const props = {firstName: 'Ben', lastName: 'Hector'};
  return <Greeting {...props} />;
}
```

你还可以选择只保留当前组件需要接收的 props，并使用展开运算符将其他 props 传递下去

在下面的例子中，kind 的 prop 会被安全的保留，它将不会被传递给 DOM 中的```<button>```元素，所有其他的 props 则会通过 ...other 对象传递:

```javascript
const Button = props => {
  const { kind, ...other } = props;
  const className = kind === "primary" ? "PrimaryButton" : "SecondaryButton";
  return <button className={className} {...other} />;
};

const App = () => {
  return (
    <div>
      <Button kind="primary" onClick={() => console.log("clicked!")}>
        Hello World!
      </Button>
    </div>
  );
};
```

属性展开在某些情况下很有用，但是也很容易将不必要的 props 传递给不相关的组件，或者将无效的 HTML 属性传递给 DOM，因此官方建议谨慎的使用该语法

### JavaScript 表达式作为 Props

你可以把包裹在 {} 中的 JavaScript 表达式作为一个 prop 传递给 JSX 元素

例如，如下的 JSX：

```javascript
<MyComponent foo={1 + 2 + 3 + 4} />
```

if 语句以及 for 循环不是 JavaScript 表达式，所以不能在 JSX 中直接使用。但是，你可以用在 JSX 以外的代码中

```javascript
function NumberDescriber(props) {
  let description;
  if (props.number % 2 == 0) {
    description = <strong>even</strong>;
  } else {
    description = <i>odd</i>;
  }
  return <div>{props.number} is an {description} number</div>;
}
```

### 字符串字面量

你可以将字符串字面量赋值给 prop. 如下两个 JSX 表达式是等价的：

```javascript
<MyComponent message="hello world" />

<MyComponent message={'hello world'} />
```

### Props 默认值为 “True”

```javascript
MyTextBox autocomplete />

<MyTextBox autocomplete={true} />
```

---

<span id="jump10"></span>

## JSX 中的子元素

包含在开始和结束标签之间的 JSX 表达式内容将作为特定属性 props.children 传递给外层组件

有几种不同的方法来传递子元素：

### 字符串字面量

你可以将字符串放在开始和结束标签之间，此时 props.children 就只是该字符串

例如：

```javascript
<MyComponent>Hello world!</MyComponent>
```

JSX 会移除行首尾的空格以及空行，与标签相邻的空行均会被删除，文本字符串之间的新行会被压缩为一个空格

因此以下的几种方式都是等价的：

```javascript
<div>Hello World</div>

<div>
  Hello World
</div>

<div>
  Hello
  World
</div>

<div>

  Hello World
</div>
```

### JSX 子元素

子元素允许由多个 JSX 元素组成。这对于嵌套组件非常有用：

```javascript
<MyContainer>
  <MyFirstComponent />
  <MySecondComponent />
</MyContainer>
```

React 组件也能够返回存储在数组中的一组元素：

```javascript
render() {
  // 不需要用额外的元素包裹列表元素！
  return [
    // 不要忘记设置 key :)
    <li key="A">First item</li>,
    <li key="B">Second item</li>,
    <li key="C">Third item</li>,
  ];
}
```

### JavaScript 表达式作为子元素

JavaScript 表达式可以被包裹在```{} ```中作为子元素

例如，以下表达式是等价的：

```javascript
<MyComponent>foo</MyComponent>

<MyComponent>{'foo'}</MyComponent>
```

这对于展示任意长度的列表非常有用。例如，渲染 HTML 列表：

```javascript
function Item(props) {
  return <li>{props.message}</li>;
}

function TodoList() {
  const todos = ['finish doc', 'submit pr', 'nag dan to review'];
  return (
    <ul>
      {todos.map((message) => <Item key={message} message={message} />)}
    </ul>
  );
}
```

JavaScript 表达式也可以和其他类型的子元素组合。这种做法可以方便地替代模板字符串：

```javascript
function Hello(props) {
  return <div>Hello {props.addressee}!</div>;
}
```

### 函数作为子元素

props.children 和其他 prop 一样，它可以传递任意类型的数据，只要确保在该组件渲染之前能够被转换成 React 理解的对象

例如，如果你有一个自定义组件，你可以把回调函数作为 props.children 进行传递：

```javascript
// 调用子元素回调 numTimes 次，来重复生成组件
function Repeat(props) {
  let items = [];
  for (let i = 0; i < props.numTimes; i++) {
    items.push(props.children(i));
  }
  return <div>{items}</div>;
}

function ListOfTenThings() {
  return (
    <Repeat numTimes={10}>
      {(index) => <div key={index}>This is item {index} in the list</div>}
    </Repeat>
  );
}
```

### 布尔类型、Null 以及 Undefined 将会忽略

false, null, undefined 是合法的子元素，但它们并不会被渲染

这有助于依据特定条件来渲染其他的 React 元素

例如，在以下 JSX 中，仅当 showHeader 为 true 时，才会渲染```<Header />```组件：

```javascript
<div>
  {showHeader && <Header />}
  <Content />
</div>
```

值得注意的是有一些 “falsy” 值，如数字 0，仍然会被 React 渲染

例如，以下代码并不会像你预期那样工作，因为当 props.messages 是空数组时，0 仍然会被渲染：

```javascript
<div>
  {props.messages.length &&
    <MessageList messages={props.messages} />
  }
</div>
```

反之，如果你想渲染 false、true、null、undefined 等值，你需要先将它们转换为字符串：

```javascript
<div>
  My JavaScript variable is {String(myVariable)}.
</div>
```
