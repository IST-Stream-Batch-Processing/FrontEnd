import React from 'react';
import {
Button, Divider, Form, Icon, Input, Layout, List, message
} from 'antd';
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import {CloseCircleOutlined} from "@ant-design/icons";
import history from '../../../../utils/history';
import {deleteServiceData, getSingleCombinationData} from "../../../../api/stream";

class StreamCombinationEditPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      data: []
    };
  }

  componentDidMount() {
    this.getSingleData();
  }

  getSingleData() {
    try {
      getSingleCombinationData(this.props.match.params.id).then(result => {
        this.setState(state => ({
          data: result,
          isLoading: false
        }));
        this.props.form.setFieldsValue(result);
      });
    } catch (err) {
      console.error(err);
      message.error("数据加载失败");
      history.goBack();
    }
  }

  removeAttribute = (e, deleteItem) => {
    e.preventDefault();
    deleteServiceData(deleteItem).then(() => { this.getSingleData(); });
  }

  addAttribute = (e) => {
    e.preventDefault();
    const newList = this.state.attributeList;
    this.setState(state => ({
      attributeList: newList.concat({
        type: "string",
        name: "default"
      })
    }));
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    if (this.state.isLoading) return null;
    return (
      <Layout>
        <div style={{flexDirection: 'row', display: 'flex'}}>
          <Title level={4}>编辑流数据源</Title>
        </div>
        <Divider />
        <Form style={{
          width: "400px", margin: "auto", display: "flex", flexDirection: "column"
        }}
        >
          <Form.Item label="编排id">
            {getFieldDecorator('id', {
              rules: [
                {
                  required: true,
                }
              ]
            })(
              <Input disabled />
            )}
          </Form.Item>
          <Form.Item label="数据源id">
            {getFieldDecorator('dataId', {
              rules: [
                {
                  required: true,
                }
              ]
            })(
              <Input disabled />
            )}
          </Form.Item>
          <Text strong style={{marginBottom: 10}}>编排的算子列表</Text>
          <List
            bordered
            size="small"
            dataSource={this.state.data.operatorIds}
            renderItem={(item, index) => (
              <List.Item key={index} style={{display: 'flex'}}>
                {index + 1}
                <Divider type="vertical" />
                {item}
                <Divider type="vertical" />
                <CloseCircleOutlined
                  style={{color: 'red', fontSize: '20px'}}
                  onClick={(e) => {
                    this.removeAttribute(e, item);
                  }}
                />
              </List.Item>
            )}
          />
          <Button
            type="dashed"
            onClick={(e) => {
              history.push("/developer/streamProcess/service/create");
            }}
            style={{width: '100%', marginTop: '20px'}}
          >
            <Icon type="plus" />
            创建
          </Button>
          <div style={{
            flexDirection: 'row-reverse', display: "flex", marginTop: 80, justifyContent: "space-around"
          }}
          >
            <Button
              icon="arrow-left"
              onClick={(e) => {
                history.push("/developer/streamProcess/combination");
              }}
            >
              返回
            </Button>
          </div>
        </Form>
      </Layout>
    );
  }
}

StreamCombinationEditPage = Form.create({name: 'stream_combination_edit_page'})(StreamCombinationEditPage);
export default StreamCombinationEditPage;
