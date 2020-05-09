# Next.js

## 目录

[起步](#jump1)

[Page和Component的使用](#jump2)

[路由-基础和基本跳转](#jump3)

[路由-跳转时用query传递和接受参数](#jump4)

[路由-六个钩子事件的讲解](#jump5)

[在getInitialProps中用Axios获取远端数据](#jump6)

[使用Style JSX编写页面的CSS样式](#jump7)

[Lazy Loading实现模块懒加载](#jump8)

[自定义Head 更加友好的SEO操作](#jump9)

[Next.js框架下使用Ant Design UI](#jump10)

[使用了Ant Desgin后的Next.js打包问题](#jump11)

---	

<span id="jump1"></span>

## 起步

### 安装

安装项目依赖包react、react-dom和next：

```shell
cnpm install --save react react-dom next
```

### 全局安装脚手架

```shell
npm install -g create-next-app
```

### 使用脚手架创建项目

```shell
create-next-app
```

---

<span id="jump2"></span>

## Page和Component的使用

### 新建页面和访问路径

直接在根目录下的pages文件夹下，建立.js文件，然后export default该页面

Next框架会自动配好路由，路径就是文件名（不带后缀）

当然也可以在pages文件夹下再建文件夹，那么路径将包含这些文件夹

### Component组件的制作

直接在components目录下，建立.js文件，然后export default该组件

需要使用该组件的地方import它，然后就能使用了

---

<span id="jump3"></span>

## 路由-基础和基本跳转

页面跳转一般有两种形式

第一种是利用标签<Link>

第二种是用js编程的方式进行跳转，也就是利用Router组件

### 标签式导航

使用标签式导航需要先导入Link：

```javascript
import Link from 'next/link'
```

使用<Link>标签设置跳转路径：

- href为跳转路径

- 最外层必须包裹a标签

```javascript
<Link href="/"><a>返回首页</a></Link>
```

注意，<Link>标签不支持其内部存在兄弟标签并列的情况

例如以下示例会报错：

```javascript
 <div>
  <Link href="/A">
    <span>去A页面</span>
    <span>去B页面</span>
  </Link>
</div>
```

解决方法是把这两个标签外边套一个父标签（div、a标签等）：

```javascript
<Link href="/A">
  <a>
    <span>去A页面</span>
    <span>去B页面</span>
  </a>
</Link>
```

### Router模块进行跳转

使用前也需要我们引入Router：

```javascript
import Router from 'next/router'
```

使用Router.push方法就可以进行跳转了，一般是将其封装到一个方法中：

```javascript
function gotoA(){
  Router.push('/A')
}
```

然后在触发跳转的元素上绑定该方法为点击事件：

```javascript
<button onClick={gotoA}>去A页面</button>
```

---

<span id="jump4"></span>

## 路由-跳转时用query传递和接受参数

在Next.js中只能通过通过query（?id=1）来传递参数，而不能通过(path:id)的形式传递参数

### 标签式跳转传递参数

依赖导入：

```javascript
import Link from 'next/link'
import Router from 'next/router'
```

Link标签内href：

```javascript
<Link href="/targetpage?name=name1"><a>跳转</a></Link>
```

或将路径写成对象形式：

```javascript
<Link href={{pathname:'/targetpage',query:{name:'name1'}}}><a>跳转</a></Link>
```

跳转目标页面接收参数：

1. 创建targetpage.js文件

2. 使用router.query.name拿到参数

3. 导出时使用withRouter包裹组件

```javascript
import { withRouter } from 'next/router'
import Link from 'next/link'

const Targetpage = ({ router }) => {
  return (
    <>
      <div>接收到的参数是：{router.query.name}</div>
      <Link href="/"><a>返回首页</a></Link>
    </>
  )
}

export default withRouter(Targetpage)
```

### 编程式跳转传递参数

添加跳转方法：

```javascript
function gotoTargetPage(){
  Router.push({
    pathname:'/TargetPage',
    query:{
	  name:'name1'
    }
  })
}
```

跳转按钮绑定点击事件：

```javascript
<div>
  <button onClick={gotoTargetPage}>跳转</button>
</div>
```

---

<span id="jump5"></span>

## 路由-六个钩子事件的讲解

路由的钩子事件，也就是当路由发生变化时，可以监听到这些变化事件，执行对应的函数

需要使用：Router.events.on()进行监听

### routerChangeStart路由发生变化时

```javascript
Router.events.on('routeChangeStart', (...args) => {
  console.log('1.routeChangeStart->路由开始变化,参数为:', ...args)
})
```

### routerChangeComplete路由结束变化时

```javascript
Router.events.on('routeChangeComplete', (...args) => {
  console.log('routeChangeComplete->路由结束变化,参数为:', ...args)
})
```

### beforeHistoryChange浏览器history触发前

```javascript
Router.events.on('beforeHistoryChange', (...args) => {
  console.log('3,beforeHistoryChange->在改变浏览器 history之前触发,参数为:', ...args)
})
```

### routeChangeError路由跳转发生错误时

```javascript
Router.events.on('routeChangeError', (...args) => {
  console.log('4,routeChangeError->跳转发生错误,参数为:', ...args)
})
```

### 转变成hash路由模式

```javascript
Router.events.on('hashChangeStart', (...args) => {
  console.log('5,hashChangeStart->hash跳转开始时执行,参数为:', ...args)
})

Router.events.on('hashChangeComplete', (...args) => {
  console.log('6,hashChangeComplete->hash跳转完成时,参数为:', ...args)
})
```

---

<span id="jump6"></span>

## 在getInitialProps中用Axios获取远端数据

React 组件的生命周期函数缺乏对异步操作的支持，它就是 Next.js 对 React 组件生命周期的扩充

获得的数据作为 props 来启动 React 组件的原生生命周期过程

### 调用getInitialProps获取数据

```javascript
// 定义Page组件
function Page() {
  ...
}

Page.getInitialProps = async () => {
  return axios('数据接口地址').then(
    (res) => {
      resolve(res.data.data)
    }
  )
}
```

### 使用拿到的数据

获得数据后，用{数据变量名}将数据传递给组件使用

```javascript
const Xiaojiejie = ({ 数据变量名 }) => {
  return (
    <>
      <div>{数据变量名}</div>
    </>
  )
}
```

---

<span id="jump7"></span>

## 使用Style JSX编写页面的CSS样式

在Next.js中引入一个CSS样式是不可以的

因为框架为我们提供了一个style jsx特性，也就是把CSS用JSX的语法写出来

```javascript
function Jspang() {
  return (
    <>
      <div>元素1</div>
      <div className="element2">元素2</div>

      <style jsx>
        {`
          div { color:blue;}
          .element2 {color:red;}
        `}
      </style>
    </>
  )
}
```

---

<span id="jump8"></span>

## Lazy Loading实现模块懒加载

### 懒加载外部组件

```javascript
const changeTime = async () => { //把方法变成异步模式
  const moment = await import('moment') //等待moment加载完成
  setTime(moment.default(Date.now()).format()) //注意使用defalut
}
```

### 懒加载自定义组件

先要在懒加载这个组件的文件中引入dynamic：

```javascript
import dynamic from 'next/dynamic'
```

引入后就可以懒加载自定义组件了：

```javascript
const CustomCom = dynamic(import('../components/customCom'))
```

---

<span id="jump9"></span>

## 自定义Head 更加友好的SEO操作

为了更好的进行SEO优化，可以自己定制<Head>标签

定义<Head>一般有两种方式

### 在各个页面加上<Head>标签

引入next/head:

```javascript
import Head from 'next/head'
```

引入后就可以写头部标签了:

```javascript
function Header() {
  return (
    <>
      <Head>
        <title>自定义标题</title>
        <meta charSet='utf-8' />
      </Head>
    </>
  )
}
export default Header
```

### 定义全局的<Head>

这种方法相当于自定义了一个组件，以后每个页面都使用这个组件

这种方法用处不大，也不灵活

封装自定义标题组件：

```javascript
import Head from 'next/head'
import Head from 'next/head'

const MyHeader = () => {
  return (
    <>
      <Head>
        <title> 自定义全局标题 </title>
      </Head>
    </>
  )
}

export default MyHeader
```

在需要使用该自定义标题的地方导入它，就可以使用了：

```javascript
import Myheader from '../components/myheader'

function Header() {
  return (
    <>
      <Myheader />

    </>
  )
}
export default Header
```

---

<span id="jump10"></span>

## Next.js框架下使用Ant Design UI

### 让Next.js支持CSS文件

Next.js默认是不支持直接用import进行引入css的，因此需要额外配置

安装zeit/next-css包，它的主要功能就是让Next.js可以加载CSS文件：

```shell
cnpm i -S @zeit/next-css
```

配置文件的编写:

```javascript
const withCss = require('@zeit/next-css')

if (typeof require !== 'undefined') {
  require.extensions['.css'] = file => { }
}

module.exports = withCss({})
```

之后就可以直接引入css了

### 按需加载Ant Design

加载Ant Design在我们打包的时候会把Ant Design的所有包都打包进来，这样就会产生性能问题

因此需要只加载项目中用到的模块，这就需要用到babel-plugin-import插件

安装：

```shell
cnpm i -S babel-plugin-import
```

安装完成后，在项目根目录建立.babelrc文件，然后写入如下配置文件:

```javascript
{
  "presets": ["next/babel"],  //Next.js的总配置文件，相当于继承了它本身的所有配置
    "plugins": [     //增加新的插件，这个插件就是让antd可以按需引入，包括CSS
      [
        "import",
        {
          "libraryName": "antd",
          "style": "css"
        }
      ]
    ]
}
```

通过上面的配置，就可以按需加载了

---

<span id="jump11"></span>

## 使用了Ant Desgin后的Next.js打包问题

Next.js非常简单，但是当你使用了Ant Desgin后，在打包的时候会遇到一些问题

可以通过全局引入CSS解决问题

在page目录下，新建一个_app.js文件，然后写入下面的代码：

```javascript
import App from 'next/app'

import 'antd/dist/antd.css'

export default App
```
