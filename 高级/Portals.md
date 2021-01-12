# Portals

## 目录

[基本概念](#jump1)

[为什么需要它](#jump2)

[使用实例](#jump3)

[](#jump)

[](#jump)

[](#jump)

---	

<span id="jump1"></span>

## 基本概念

Portal 提供了一种将子节点渲染到存在于父组件以外的 DOM 节点的优秀的方案

```javascript
ReactDOM.createPortal(child, container)
```

第一个参数（child）是任何可渲染的 React 子元素，例如一个元素，字符串或 fragment。第二个参数（container）是需要嵌入到其他 DOM 节点的元素，嵌入还需要再使用appendChild

---

<span id="jump2"></span>

## 为什么需要它

通常来讲，当你从组件的 render 方法返回一个元素时，该元素将被挂载到 DOM 节点中离其最近的父节点

在我们需要在正常 DOM 层次结构之外呈现子组件而又不通过 React 组件树层次结构破坏事件传播的默认行为时，React Portal（传送门）会派上用场,比如在渲染模态框，工具提示，弹出消息之类的组件时

但是当我们在特定元素（父组件）中使用模态弹窗时，模态的高度和宽度就会从模态弹窗所在的组件继承，也就是说模态弹窗的样式可能会被父组件影响

---

<span id="jump3"></span>

## 使用实例

下面的代码使用 createPortal() 在 root 树层次结构之外创建 DOM 节点：

```javascript
const Modal = ({ message, isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div className="modal">
      <span>{message}</span>
      <button onClick={onClose}>Close</button>
    </div>,
    document.body
  );
};

function Component() {
  const [open, setOpen] = useState(false);
  return (
    <div className="component">
      <button onClick={() => setOpen(true)}>Open Modal</button>
      <Modal
        message="Hello World!"
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
```

Modal组件将被注入 root 之外，并且与 root 处于同一层级
