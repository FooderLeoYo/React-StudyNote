# React路由

## 目录

[起步](#jump1)

[Router](#jump2)

[Route](#jump3)

[Switch](#jump4)

[Route的匹配原则](#jump5)

[Link](#jump6)

[NavLink](#jump7)

[Redirect](#jump8)

[动态路由](#jump9)

[StaticRouter](#jump10)

[SPA与MPA跳转的区别](#jump11)

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

## Router

like BrowserRouter and HashRouter

### 使用范例

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

### Router类型

- BrowserRouter
	
	 - 生成常规格式的url
	 
	 - 需要配置服务器<配置指导>(https://create-react-app.dev/docs/deployment/#serving-apps-with-client-side-routing)

- HashRouter

	- 生成带#的url

	- 不需要配置服务器，因为hash不会被发送到服务器

---

<span id="jump3"></span>

## Route

Route代表了你的路由界面，path代表路径，component代表路径所对应的界面

### 使用范例

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

### 精确匹配
 
route上设置exact属性

```javascript
//这种情况下，如果匹配路由path='/page'，那么会把Home也会展示出来
<Route path='/' component={Home} />
<Route path='/page' component={Page}>

//这样匹配路由path='/page'，只会匹配到Page组件
<Route exact path='/' component={Home} />
<Route path='/page' component={Page} />
```

### Route render methods

All three render methods will be passed the same three route props

- match

- location

- history

#### Route component

A React component to render only when the location matches

It will be rendered with route props

会创建新组件并卸载旧组件

#### Route render function

匹配路径后会更新组件而不像component渲染方式那样创建新组件并卸载旧组件

you can pass in a function to be called when the location matches

```javascript
function FadingRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={routeProps => (
        <FadeIn>
          <Component {...routeProps} />
        </FadeIn>
      )}
    />
  );
}
```

#### Route children function

It works exactly like render except that it gets called whether there is a match or not

<Route children> takes precedence over both <Route component> and <Route render>

### Route props

#### match

match objects contain the following properties:

- params 

- isExact 

- path 

- url 

You’ll have access to match objects in various places:

```
Route component as this.props.match
Route render as ({ match }) => ()
Route children as ({ match }) => ()
withRouter as this.props.match
matchPath as the return value
useRouteMatch as the return value
```

#### location

It looks like this:

```javascript
{
  key: 'ac3df4', // not with HashHistory!
  pathname: '/somewhere',
  search: '?some=search-string',
  hash: '#howdy',
  state: {
    [userDefined]: true
  }
}
```

The router will provide you with a location object in a few places:

```
Route component as this.props.location
Route render as ({ location }) => ()
Route children as ({ location }) => ()
withRouter as this.props.location
```

#### history

history objects typically have the following properties and methods:

- length 

- action

- location 

	- pathname 

	- search 

	- hash

	- state

- push(path, [state])

- replace(path, [state])

- go(n)

- goBack()

- goForward()

- block(prompt)

注意：

```
The history object is mutable
Therefore it is recommended to access the location from the render props of <Route>
not from history.location
```

---

<span id="jump4"></span>

## Switch

Switch只会渲染第一个匹配的路径，而只有Route则会全部渲染

例如对于path="/"和path="/second",当url为"/second"时，Route都渲染

v5.1后官方建议<Route>都应在<Switch>渲染

---

<span id="jump5"></span>

## Route的匹配原则

- 若某个path是某个url的前面一段，就会被匹配
	
	如：path="/a"会匹配任何以'/a'开头的url

- 为了避免出现这种匹配，route遵循越高层级越靠后的摆放规则

	如：<Route path="/">总在最后

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

---

<span id="jump6"></span>

## Link

Link是react路由中的点击切换到哪一个组件的链接

### 使用范例

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

### to属性可以是一个对象

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

### Link的replace属性

点击链接后，将新地址替换成历史访问记录的原地址


---

<span id="jump7"></span>

## NavLink

- 是一种特殊的Link

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

---

<span id="jump8"></span>

## Redirect

重定向和跳转有一个重要的区别，就是跳转式可以用浏览器的回退按钮返回上一级的，而重定向是不可以的

### 标签式重定向

就是利用<Redirect>标签来进行重定向，业务逻辑不复杂时建议使用这种

```javascript
 <Redirect to="/home/" />
```

### 编程式重定向

编程式重定向就是不再利用<Redirect/>标签，而是直接使用JS的语法（history）实现重定向

一般用于业务逻辑当中，比如登录成功挑战到会员中心页面

比如直接在构造函数constructor中加入下面的重定向代码：

```javascript
 this.props.history.push("/home/");
```

---

<span id="jump9"></span>

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

---

<span id="jump10"></span>

## StaticRouter

用于SSR的服务端

StaticRouter的静态体现在：
 
它被使用在服务端，而服务端不会出现客户端那样的路由跳转(即不发生页面刷新)

遇到新请求时ocation属性改变，进而加载对应该location的组件，然后发送新的响应给客户端并触发页面刷新

它与router的关系是它需要按照客户端router的路由关系，来为请求url加载对应的组件

---

<span id="jump11"></span>

## SPA与MPA跳转的区别

### MPA

#### 跳转机制

MPA 路由基于原生浏览器的文档跳转（navigating across documents）

每一次页面跳转的时候，后台服务器都会给返回一个新的html文档

因此每一次的页面更新都是一次页面重载

#### 为什么首屏时间快？

当我们访问页面的时候，服务器返回一个html，页面就会展示出来

这个过程只经历了一个HTTP请求，所以页面展示的速度非常快

#### 为什么切换慢？

次跳转都需要发出一个http请求，在页面之间来回跳转时，就会发现明显的卡顿

#### 为什么SEO效果好？

每个页面所有的内容都放在Html中，而搜索引擎是可以识别html内容的

### SPA

#### 跳转机制

SPA 路由跳转是基于前端路由，非原生浏览器的文档跳转（navigating across documents）

即可实现按需进行页面中的必要的组件级更新，而非无差别式页面级更新

第一次进入页面的时候会请求一个html文件，然后浏览器执行刷新清除一下旧文件

切换到其他组件，此时路径也相应变化

JS会感知到url的变化，然后动态的将当前页面的内容清除掉，再将下一个页面的内容挂载到当前页面上

这个时候的路由不再是后端来做了，而是前端来做

每次跳转的时候不需要再请求html文件了，也不再需要浏览器执行刷新清除

#### 为什么首屏时间慢？

首屏时需要请求一次html，同时还要发送一次js请求

两次请求回来了，首屏才会展示出来

#### 为什么页面切换快？

页面每次切换跳转时，并不需要处理html文件的请求，这样就节约了很多HTTP发送时延

#### 为什么SEO差？

SPA 应用在初始时是从 无状态 空白页面进入到 有状态 内容页面

而搜索引擎算法的抓取结果仅限初次请求时返回页面，搜索引擎是不会等待当前SPA进行状态填充

### 对比

|  | MPA | SPA |
| --- | --- | --- |
| 应用构成 | 由多个完整页面构成 | 一个外壳页面和多个页面片段构成 |
| 跳转方式 | 页面之间的跳转是从一个页面到另一个页面 | 一个页面片段删除或隐藏，加载另一个页面片段并显示。片段间的模拟跳转，没有开壳页面 |
| 跳转后公共资源是否重新加载 | 是 | 否 |
| 前后端耦合性 | 前端页面与后端是一一对应 | 前端不再依赖于后端的路由分配 |

### 实现SPA跳转的方式

1. 使用Link

例如：

```javascript
<Link to={"/video/av" + video.aId}>
  // 可以加内容
</ Link>
```


2. 使用history.push

例如：

```javascript
this.props.history.push({
	pathname: "/channel/" + tab.id
});
```
