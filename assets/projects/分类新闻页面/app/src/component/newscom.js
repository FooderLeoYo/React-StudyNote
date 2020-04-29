import React from 'react';
import axios from 'axios';
import bannerImg from '../assets/img/banner.jpg'

class NewsCom extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            datalist: []
        }
    }

    /* 获取新闻内容数据 */
    async componentWillMount() {
        let res = await axios.get('http://localhost:8080/api/news');
        //console.log(res.data)
        let data = JSON.parse(res.data.data[0].content)
        this.setState({
            datalist: data.sub_raw_datas
        })
    }
    render() {
        return (
            <div className="contentItem new">
                {/* 顶部标题 */}
                <div className="banner">
                    <img alt="banner" src={bannerImg} />
                    <h1>疫情追踪</h1>
                </div>
                {/* 新闻内容 */}
                <div className="newContent">
                    <div className="line"></div>
                    <div className="newsList">
                        {
                            this.state.datalist.map((item, index) => {
                                // 有的新闻可能不带图，因此要区分
                                if (item.raw_data.event_image) {
                                    return (
                                        <div className="newsListItem" key={index}>
                                            <div className="time">{item.raw_data.showtime_string}</div>
                                            <div className="desc">
                                                {item.raw_data.desc}
                                            </div>
                                            <div className="img">
                                                <img src={item.raw_data.event_image.url} alt="img" />
                                            </div>
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div className="newsListItem" key={index}>
                                            <div className="time">{item.raw_data.showtime_string}</div>
                                            <div className="desc">
                                                {item.raw_data.desc}
                                            </div>

                                        </div>
                                    )
                                }

                            })
                        }
                    </div>
                </div>
            </div>
        )
    }


}

export default NewsCom;