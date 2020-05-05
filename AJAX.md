# AJAX

## 目录

[获取异步数据](#jump1)

[AJAX使用实例](#jump2)

---	

<span id="jump1"></span>

## 获取异步数据

React 组件的数据可以通过 componentDidMount 方法中的 Ajax 来获取

当从服务端获取数据时可以将数据存储在 state 中，再用 this.setState 方法重新渲染 UI

当使用异步加载数据时，在组件卸载前使用 componentWillUnmount 来取消未完成的请求

---

<span id="jump"></span>

## AJAX使用实例

以下代码使用 jQuery 完成 Ajax 请求

```javascript
class UserGist extends React.Component {
  constructor(props) {
      super(props);
      this.state = {username: '', lastGistUrl: ''};
  }
 
  // componentDidMount中使用ajax获取数据
  componentDidMount() {
    this.serverRequest = $.get(this.props.source, function (result) {
      var lastGist = result[0];
      this.setState({
        username: lastGist.owner.login,
        lastGistUrl: lastGist.html_url
      });
    }.bind(this));
  }
 
  // 取消未完成的请求
  componentWillUnmount() {
    this.serverRequest.abort();
  }
 
  render() {
    return (
      <div>
        {this.state.username} 用户最新的 Gist 共享地址：
        <a href={this.state.lastGistUrl}>{this.state.lastGistUrl}</a>
      </div>
    );
  }
}
 
ReactDOM.render(
  <UserGist source="https://api.github.com/users/octocat/gists" />,
  document.getElementById('example')
);
```
