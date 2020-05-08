# Next.js

## 目录

[起步](#jump1)

[Page和Component的使用](#jump2)

[路由-基础和基本跳转](#jump3)

[路由-跳转时用query传递和接受参数](#jump4)

[](#jump5)

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
