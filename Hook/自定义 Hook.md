# 自定义 Hook

## 目录

[提取自定义 Hook](#jump1)

[使用自定义 Hook](#jump2)

[几个注意点](#jump3)

---	

<span id="jump1"></span>

## 提取自定义 Hook

当我们想在两个函数之间共享逻辑时，我们会把它提取到第三个函数中

而组件和 Hook 都是函数，所以也同样适用这种方式

自定义 Hook 是一个函数，其名称以 “use” 开头，函数内部可以调用其他的 Hook

与组件中一致，请确保只在自定义 Hook 的顶层无条件地调用其他 Hook

例如，下面的 useFriendStatus 是我们第一个自定义的 Hook:

```javascript
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

---

<span id="jump2"></span>

## 使用自定义 Hook

我们一开始的目标是在 FriendStatus 和 FriendListItem 组件中去除重复的逻辑

即：这两个组件都想知道好友是否在线

现在我们已经把这个逻辑提取到 useFriendStatus 的自定义 Hook 中，然后就可以使用它了：

FriendStatus组件：

```javascript
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

FriendListItem组件：

```javascript
function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id);

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

---

<span id="jump3"></span>

## 几个注意点

### 自定义 Hook 必须以 “use” 开头吗？

必须如此

不遵循的话，由于React无法判断某个函数是否包含对其内部 Hook 的调用

将无法自动检查你的 Hook 是否违反了 Hook 的规则

### 在两个组件中使用相同的 Hook 会共享 state 吗？

不会

每次使用自定义 Hook 时，其中的所有 state 和副作用都是完全隔离的

### 自定义 Hook 如何获取独立的 state

每次调用 Hook，它都会获取独立的 state

当我们调用自定义Hook时，从React的角度来看，我们的组件只是调用了useState和useEffect

正如我们可以在一个组件中多次调用 useState 和 useEffect，它们是完全独立的
