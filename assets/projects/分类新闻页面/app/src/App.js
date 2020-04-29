import React from 'react';
import axios from 'axios'
import NewsCom from './component/newscom'
import './assets/css/style.css'

/* 各子页面内容 */
function MapCom(props) {
  return (
    <div className="contentItem">
      <h1>
        这是疫情地图组件
      </h1>
    </div>
  )
}
function GzCom(props) {
  return (
    <div className="contentItem">
      <h1>
        这是广州疫情组件
      </h1>
    </div>
  )
}
function XcCom(props) {
  return (
    <div className="contentItem">
      <h1>
        这是直击现场组件
      </h1>
    </div>
  )
}


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      newData: null,
      navList: ['疫情地图', '最新进展', "广州疫情", "直击现场"],
      tabIndex: 0,
      barStyle: {
        left: '22px'
      },
      contentStyle: {
        transform: 'translate(0,0)'
      }
    }
  }

  /* 获取导航栏数据 */
  async componentWillMount() {
    let res = await axios.get('http://localhost:8080/api/newsdata')
    let data = JSON.parse(res.data.forum.extra.ncov_string_list)
  }

  render() {
    return (
      <div className="App">
        {/* 导航栏 */}
        <div className="nav">
          {
            /* 导航栏标题 */
            this.state.navList.map((item, index) => {
              // 判断是否为用户选中的项
              if (index === this.state.tabIndex) {
                return (
                  <div key={index} onClick={(event) => { this.tabClickEvent(index) }} className="navItem active">{item}</div>
                )
              } else {
                return (
                  <div key={index} onClick={(event) => { this.tabClickEvent(index) }} className="navItem">{item}</div>
                )
              }

            })
          }
          {/* active项下划线 */}
          <div className="bar" style={this.state.barStyle}></div>
        </div>

        {/* 新闻内容 */}
        <div className="content" style={this.state.contentStyle}>
          <MapCom></MapCom>
          <NewsCom></NewsCom>
          <GzCom></GzCom>
          <XcCom></XcCom>
        </div>
      </div>
    );
  }

  /* 点击导航栏相关事件 */
  tabClickEvent = (index) => {
    this.setState({
      barStyle: {
        left: (index * 88 + 22) + "px"
      },
      contentStyle: {
        transform: `translate(-${index * 375}px,0)`
      },
      tabIndex: index
    })
  }
}

export default App;
