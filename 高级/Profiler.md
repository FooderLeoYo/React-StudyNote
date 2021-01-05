# Profiler

## 目录

[概念](#jump1)

[用法](#jump2)

[onRender 回调](#jump3)

[](#jump)

[](#jump)

[](#jump)

---	

<span id="jump1"></span>

## 概念

Profiler 能添加在 React 树中的任何地方来测量树中这部分渲染所带来的开销

它的目的是识别出应用中渲染较慢的部分，或是可以使用类似 memoization 优化的部分

Profiling 增加了额外的开支，所以它在生产构建中会被禁用

---

<span id="jump2"></span>

## 用法

它需要两个 prop ：一个是 id(string)，一个是当组件树中的组件“提交”更新的时候被React调用的回调函数 onRender(function)

```javascript
render(
  <App>
    <Profiler id="Navigation" onRender={callback}>
      <Navigation {...props} />
    </Profiler>
    <Main {...props} />
  </App>
);
```

多个 Profiler 组件能测量应用中的不同部分：

```javascript
render(
  <App>
    <Profiler id="Navigation" onRender={callback}>
      <Navigation {...props} />
    </Profiler>
    <Profiler id="Main" onRender={callback}>
      <Main {...props} />
    </Profiler>
  </App>
);
```

嵌套使用 Profiler 组件来测量相同一个子树下的不同组件：

```javascript
render(
  <App>
    <Profiler id="Panel" onRender={callback}>
      <Panel {...props}>
        <Profiler id="Content" onRender={callback}>
          <Content {...props} />
        </Profiler>
        <Profiler id="PreviewPane" onRender={callback}>
          <PreviewPane {...props} />
        </Profiler>
      </Panel>
    </Profiler>
  </App>
);
```

---

<span id="jump3"></span>

## onRender 回调

React 会在 profile 包含的组件树中任何组件 “提交” 一个更新的时候调用这个函数

它的参数描述了渲染了什么和花费了多久：

```javascript
function onRenderCallback(
  id, // 发生提交的 Profiler 树的 “id”
  phase, // "mount" （如果组件树刚加载） 或者 "update" （如果它重渲染了）之一
  actualDuration, // 本次更新 committed 花费的渲染时间
  baseDuration, // 估计不使用 memoization 的情况下渲染整颗子树需要的时间
  startTime, // 本次更新中 React 开始渲染的时间
  commitTime, // 本次更新中 React committed 的时间
  interactions // 属于本次更新的 interactions 的集合
) {
  // 合计或记录渲染时间。。。
}
```