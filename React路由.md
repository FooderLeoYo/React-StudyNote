# React路由

## 目录

[起步](#jump1)

[ReactRouter三大组件](#jump2)

[动态路由](#jump3)

[重定向组件](#jump4)

[Switch组件](#jump5)

[利用history实现跳转](#jump6)
				 
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

### Router

Router我们可以把它看做是react路由的一个路由外层盒子

Router属性basename：设置此路由根路径，路径会先自动拼接上admin，再拼接具体的path

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

router可以在1个组件中写多个

```javascript
class App extends React.Component {
    render() {
        return (
            <div id="app">
                <Router>
                    <Route path="/product1" component={Product1}></Route>
                </Router>
				<Router>
                    <Route path="/product2" component={Product2}></Route>
                </Router>
            </div>
        )
    }
}
```

### Route

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

如果要精确匹配，那么可以在route上设置exact属性

```javascript
//这种情况下，如果匹配路由path='/page'，那么会把Home也会展示出来
<Route path='/' component={Home} />
<Route path='/page' component={Page}>

//这样匹配路由path='/page'，只会匹配到Page组件
<Route exact path='/' component={Home} />
<Route path='/page' component={Page} />
```

### Link

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

---

<span id="jump3"></span>

## 动态路由

Route的path可以拼接一个动态的值，该值由Link的to属性决定

语法：在路径最后加冒号再加自定义名

```javascript
function News(props) {
    return (
        <div>
            {/* 跳转目标组件可以拿到该动态值 */}
            新闻页，新闻id：{props.match.params.id}
        </div>
    )
}

class App extends React.Component {
    render() {
        return (
            <div id="app">
                <Router>
                    <div className="nav">
                        {/* 此处决定动态值 */}
                        <Link to="/news/4568789">新闻页</Link>
                    </div>
                    {/* 将动态值拼接到path中 */}
                    <Route path="/news/:id" component={News}></Route>
                </Router>
            </div>
        )
    }
}
```

---

<span id="jump4"></span>

## 重定向组件

访问某个组件时如果有重定向组件，就会修改页面路径，使得页面内容显示为所定向路径的内容

```javascript
function LoginInfo(props){
    if(props.location.state.loginState === 'success'){
        return <Redirect to="/admin"></Redirect>
    }else{
        return <Redirect to="/login"></Redirect>
    }
}
```

---

<span id="jump5"></span>

## Switch组件

switch组件内若存在多个匹配条件的路由，只有第一个匹配的route有效，剩余的匹配路由将无效

```javascript
class App extends React.Component {
    render() {
        return (
            <div>
                <Router>
                    <Switch>
                        {/* 这里有两个path="/abc" */}
                        {/* 第一个有效，第二个无效 */}
                        <Route path="/abc" exact component={() => (<h1>abc1页,登录成功</h1>)}></Route>
                        <Route path="/abc" exact component={() => (<h1>abc2页,登录成功</h1>)}></Route>
                    </Switch>
                </Router>
            </div>
        )
    }
}
```

---

<span id="jump6"></span>

## 利用history实现跳转

利用利用this.props.history的相关方法，可以不使用router实现跳转

- 利用push或replace跳转到指定路径

```javascript
class ChildCom extends React.Component{
    render(){
        return (
        <div>
            <button onClick={this.clickEvent}>跳转到首页</button>
        </div>
        )
    }
    clickEvent=()=>{
        this.props.history.push("/page1")
        this.props.history.replace("/page2")
    }
}
```

- 可以传递参数

```javascript
class ChildCom extends React.Component{
    render(){
        return (
        <div>
            <button onClick={this.clickEvent}>跳转到首页</button>
        </div>
        )
    }
    clickEvent=()=>{
        this.props.history.push("/",{msg:"这是由ChildCom组件发给首页的数据"})
    }
}
```

- 前进

```javascript
class ChildCom extends React.Component{
    render(){
        return (
        <div>
            <button onClick={this.clickEvent}>跳转到首页</button>
        </div>
        )
    }
    clickEvent=()=>{
        this.props.history.push("/")
        //前进
        this.props.history.go(1)
        this.props.history.goForward()
    }
}
```

- 后退

```javascript
class ChildCom extends React.Component{
    render(){
        return (
        <div>
            <button onClick={this.clickEvent}>跳转到首页</button>
        </div>
        )
    }
    clickEvent=()=>{
        this.props.history.push("/")
        //后退
        this.props.history.go(-1)
        this.props.history.goBack()
    }
}
```
