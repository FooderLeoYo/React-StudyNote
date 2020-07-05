# React路由

## 目录

[起步](#jump1)

[ReactRouter三大组件](#jump2)

[动态路由](#jump3)

---	

<span id="jump1"></span>

## 起步

根据不同的路径，显示不同的组件（内容）

React使用的库react-router-dom

安装

```shell
Cnpm install react-router-dom --save
```

导入必要组件

```javascript
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
```

---

<span id="jump2"></span>

## ReactRouter三大组件

### <Router>

like <BrowserRouter> and <HashRouter>

#### 使用范例

Router我们可以把它看做是react路由的一个路由外层盒子

```javascript
class App extends React.Component {
    render() {
        return (
            <div id="app">
                <Router basename="/admin">
                    <Route path="/product" component={Product}></Route>
                </Router>
            </div>
        )
    }
}
```

#### Router类型

- <BrowserRouter>
	
	 - 生成常规格式的url
	 
	 - 需要配置服务器<配置指导>(https://create-react-app.dev/docs/deployment/#serving-apps-with-client-side-routing)

- <HashRouter>

	- 生成带#的url

	- 不需要配置服务器，因为hash不会被发送到服务器

```

### Route Matchers

like <Route> and <Switch>

#### <Route>

Route代表了你的路由界面，path代表路径，component代表路径所对应的界面

```javascript
class App extends React.Component {
    render() {
        return (
            <div id="app">
                <Router>
                    {/* 路由导向的组件可以是现定义的 */}
                    <Route path="/" component={() => (<div>首页</div>)}></Route>
                    {/* 也可以是之前导入的 */}
                    <Route path="/product" component={Product}></Route>
                </Router>
            </div>
        )
    }
}
```

#### 精确匹配
 
route上设置exact属性

```javascript
//这种情况下，如果匹配路由path='/page'，那么会把Home也会展示出来
<Route path='/' component={Home} />
<Route path='/page' component={Page}>

//这样匹配路由path='/page'，只会匹配到Page组件
<Route exact path='/' component={Home} />
<Route path='/page' component={Page} />
```

#### <Switch>

Switch只会渲染第一个匹配的路径，而只有Route则会全部渲染

例如对于path="/"和path="/second",当url为"/second"时，Route都渲染

v5.1后官方建议<Route>都应在<Switch>渲染

#### Route的匹配原则

- 若某个path是某个url的前面一段，就会被匹配，如：path="/a"会匹配任何以'/a'开头的url

- 为了避免出现这种匹配，route遵循越高层级越靠后的摆放规则，如：<Route path="/">总在最后

	```javascript
	function App() {
	  return (
	    <div>
	      <Switch>
		<Route path="/contact/:id">
		  <Contact />
		</Route>
		<Route path="/contact">
		  <AllContacts />
		</Route>
		<Route path="/">
		  <Home />
		</Route>
	      </Switch>
	    </div>
	  );
	}
	```

### Navigation

like <Link>, <NavLink>, and <Redirect>

#### <Link>

Link是react路由中的点击切换到哪一个组件的链接

```javascript
class Main extends React.Component{
    render(){
        return(
        <Router>
            <div>
                <ul>
                    <li><link to='/'>首页</Link></li>
                    <li><link to='/other'>其他页</Link></li>
                </ul>
            </div>
        </Router>
        )
    }
}
```

to属性可以是一个对象

```javascript
render(){
        let meObj = {
            pathname:"/me",//跳转的路径
            search:"?username=admin",//get请求参数
            hash:"#abc",//设置的HASH值
            state:{msg:'helloworld'}//传入组件的数据
        };
        return (
            <div id="app">
                <Router>
                    <div className="nav">
                        <Link to={ meObj }>个人中心</Link>
                    </div>
                </Router>
            </div>
        )
    }
```

Link的replace属性：点击链接后，将新地址替换成历史访问记录的原地址


#### <NavLink>

- 是一种特殊的<Link>

- 当被激活的时候，可以添加样式

	```javascript
	<NavLink to="/react" activeClassName="hurray">
	  React
	</NavLink>

	// When the URL is /react, this renders:
	// <a href="/react" className="hurray">React</a>

	// When it's something else:
	// <a href="/react">React</a>
	```

#### <Redirect>

重定向和跳转有一个重要的区别，就是跳转式可以用浏览器的回退按钮返回上一级的，而重定向是不可以的

##### 标签式重定向

就是利用<Redirect>标签来进行重定向，业务逻辑不复杂时建议使用这种

```javascript
 <Redirect to="/home/" />
```

##### 编程式重定向

编程式重定向就是不再利用<Redirect/>标签，而是直接使用JS的语法（history）实现重定向

一般用于业务逻辑当中，比如登录成功挑战到会员中心页面

比如直接在构造函数constructor中加入下面的重定向代码：

```javascript
 this.props.history.push("/home/");
```

---

<span id="jump3"></span>

## 动态路由

1. 在Route上设置动态传值

这个设置是以:开始的，然后紧跟着你传递的key（键名称）名称

如果你不传任何东西，是没办法匹配路由成功的

```javascript
<Route path="/list/:id" component={List} />
```

2. Link上传递值

设置好规则后，就可以在Link上设置值了

这时候不用再添加id了，直接写值就可以

```javascript
<li><Link to="/list/123">列表</Link> </li>
```

3. 在List组件上接收并显示传递值

组件接收传递过来的值的时候，可以在componentDidMount中进行

传递的值在this.props.match中，包括三个部分：

	- patch:自己定义的路由规则，可以清楚的看到是可以产地id参数的。

	- url: 真实的访问路径，这上面可以清楚的看到传递过来的参数是什么。
	
	- params：传递过来的参数，key和value值。

List组件中取得传递过来的ID值：

```javascript
import React, { Component } from 'react';

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return (  <h2>List Page->{this.state.id}</h2> );
    }
    componentDidMount(){
       let tempId = this.props.match.params.id
        this.setState({id:tempId })
    }
}

export default List;
```
