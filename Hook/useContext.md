# useContext

## 目录

[定义](#jump1)

[语法](#jump2)

[例子](#jump3)

[](#jump)

[](#jump)

[](#jump)

---	

<span id="jump1"></span>

## 定义

context所对应的hook

用于跨层穿越props，即当两个组件具有“祖先-后代”关系，但不是父子这样的相邻层级关系而是跨级关系时，传递props就需要一级一级往下传，这时就可以使用useContext直接跨过中间层级传递props

---

<span id="jump2"></span>

## 语法

```javascript
const value = useContext(MyContext);
```

接收一个 context 对象（React.createContext 的返回值）并返回该 context 的当前值

当前的 context 值由上层组件中距离当前组件最近的 <MyContext.Provider> 的 value prop 决定

当组件上层最近的 <MyContext.Provider> 更新时，该 Hook 会触发重渲染

---

<span id="jump3"></span>

## 例子

```javascript
const themes = {
  light: {
    foreground: "#000000",
    background: "#eeeeee"
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222"
  }
};

const ThemeContext = React.createContext(themes.light);

function App() {
  return (
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return (
    <button style={{ background: theme.background, color: theme.foreground }}>
      I am styled by theme context!
    </button>
  );
}
```