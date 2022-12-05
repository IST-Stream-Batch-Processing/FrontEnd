import React, {Component} from 'react';
import Title from "antd/es/typography/Title";
import {Divider, Layout} from "antd";

class StreamServiceEditPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  render() {
    return (
      <Layout>
        <div style={{flexDirection: 'row', display: 'flex'}}>
          <Title level={4}>编辑流数据服务</Title>
        </div>
        <Divider />
      </Layout>
    );
  }
}

export default StreamServiceEditPage;
