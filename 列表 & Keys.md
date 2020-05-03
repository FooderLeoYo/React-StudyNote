# 列表 & Keys

## 目录

[使用 map() 方法来创建列表](#jump1)

[Keys](#jump2)

[用keys提取组件](#jump3)

[key不需要全局唯一](#jump4)

[在 jsx 中嵌入 map()](#jump5)

---	

<span id="jump1"></span>

## 使用 map() 方法来创建列表

使用数组的map方法，对每一项数据按照JSX的形式进行加工，最终得到一个每项都是JSX对象的数组，再将数组渲染到模板中

例如，生成一个 1 到 5 的数字列表:

```javascript
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((numbers) =>
  <li>{numbers}</li>
);
 
ReactDOM.render(
  <ul>{listItems}</ul>,
  document.getElementById('example')
);
```

---

<span id="jump2"></span>

## Keys

Keys 可以在 DOM 中的某些元素被增加或删除的时候帮助 React 识别哪些元素发生了变化

因此你应当给数组中的每一个元素赋予一个确定的标识

一个元素的 key 最好是这个元素在列表中拥有的一个独一无二的字符串。通常，我们使用来自数据的 id 作为元素的 key

```javascript
const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
);
```

当元素没有确定的 id 时，你可以使用他的序列号索引 index 作为 key：

```javascript
const todoItems = todos.map((todo, index) =>
  // 只有在没有确定的 id 时使用
  <li key={index}>
    {todo.text}
  </li>
);
```

如果列表可以重新排序，我们不建议使用索引来进行排序，因为这会导致渲染变得很慢

---

<span id="jump3></span>

## 用keys提取组件

元素的 key 只有在它和它的兄弟节点对比时才有意义

比方说，如果你提取出一个 ListItem 组件，你应该把 key 保存在数组中的这个 <ListItem /> 元素上，而不是放在 ListItem 组件中的 <li> 元素上

错误示范：

```javascript
function ListItem(props) {
  const value = props.value;
  return (
    // 错啦！你不需要在这里指定key:
    <li key={value.toString()}>
      {value}
    </li>
  );
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // 元素的key应该在这里指定：
    <ListItem value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}
```

当你在 map() 方法的内部调用元素时，你最好随时记得为每一个元素加上一个独一无二的 key

---

<span id="jump4"></span>

## key不需要全局唯一

数组元素中使用的 key 在其兄弟之间应该是独一无二的

然而，它们不需要是全局唯一的，当我们生成两个不同的数组时，我们可以使用相同的键

```javascript
function Blog(props) {
  // 数组1
  const sidebar = (
    <ul>
      {props.posts.map((post) =>
	    {/* 使用post.id作为Key */}
        <li key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
  );

  // 数组2
  const content = props.posts.map((post) =>
  	{/* Key也是post.id */}
    <div key={post.id}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  );

  return (
    <div>
      {sidebar}
      <hr />
      {content}
    </div>
  );
}
```

key 会作为给 React 的提示，但不会传递给你的组件

如果您的组件中需要使用和 key 相同的值，请将其作为属性传递

```javascript
const content = posts.map((post) =>
  <Post
    key={post.id}
    id={post.id} />
);
```

上面例子中，Post 组件可以读出 props.id，但是不能读出 props.key

---

<span id="jump5"></span>

## 在 jsx 中嵌入 map()

在下面的例子中，我们声明了一个单独的 listItems 变量用以保存map方法处理后的结果:

```javascript
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <ListItem key={number.toString()}
              value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}
```

由于 JSX 允许在大括号中嵌入任何表达式，因此我们可以将map放入JSX内

上述代码等价于：

```javascript
function NumberList(props) {
  const numbers = props.numbers;
  return (
    <ul>
      {numbers.map((number) =>
        <ListItem key={number.toString()}
                  value={number} />
      )}
    </ul>
  );
}
```
