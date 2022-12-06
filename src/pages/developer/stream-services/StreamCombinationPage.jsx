import React, {Component} from 'react';
import Title from "antd/es/typography/Title";
import {
Divider, Form, Layout, message
} from "antd";
import {getSingleModelData} from "../../../api/stream";
import history from "../../../utils/history";

class StreamCombinationPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      current: 0,
      selectedType: "",
      isRegex: false,
    };
  }

  componentDidMount() {
    this.getModelData();
  }

  getModelData() {
    try {
      getSingleModelData(this.props.match.params.id).then(result => {
        this.setState(state => ({
          null: result
        }));
      });
    } catch (err) {
      console.error(err);
      message.error("数据加载失败");
      history.goBack();
    }
  }

  render() {
    return (
      <Layout>
        <div style={{flexDirection: 'row', display: 'flex'}}>
          <Title level={4}>创建流数据编排</Title>
        </div>
        <Divider />
      </Layout>
    );
  }
}

StreamCombinationPage = Form.create({name: 'stream_combination_page'})(StreamCombinationPage);
export default StreamCombinationPage;
