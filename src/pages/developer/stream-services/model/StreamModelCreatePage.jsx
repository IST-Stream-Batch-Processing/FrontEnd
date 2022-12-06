import React from 'react';
import {
Button, Divider, Form, Icon, Input, Layout, List, message, Switch
} from 'antd';
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import {CloseCircleOutlined} from "@ant-design/icons";
import history from "../../../../utils/history";
import {getToken, getUserId} from "../../../../utils/token";
import {createModelData} from "../../../../api/stream";

class StreamModelCreatePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isTimeStamp: true,
      attributeList: []
    };
  }

  createModel = async (e) => {
    e.preventDefault();
    const {form} = this.props;
    try {
      await form.validateFields();
      const data = form.getFieldsValue();
      data.userId = getUserId(getToken());
      data.isTimeStamp = this.state.isTimeStamp;
      data.attributeList = this.state.attributeList;
      await createModelData(data);
    } catch (err) {
      console.error(err);
    }
  }

  changeAttribute = (e, param, index) => {
    e.preventDefault();
    const newList = this.state.attributeList;
    newList[index][`${param}`] = e.target.value;
    this.setState(state => ({attributeList: newList}));
  }

  removeAttribute = (e, deleteItem) => {
    e.preventDefault();
    const newList = this.state.attributeList;
    this.setState(state => ({attributeList: newList.filter(item => item !== deleteItem)}));
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

    return (
      <Layout>
        <div style={{flexDirection: 'row', display: 'flex'}}>
          <Title level={4}>创建流数据源</Title>
        </div>
        <Divider />
        <Form style={{
          width: "400px", margin: "auto", display: "flex", flexDirection: "column"
        }}
        >
          <Form.Item label="数据源文件路径">
            {getFieldDecorator('filePath', {
              rules: [
                {
                  required: true,
                  message: "必须填写数据源文件路径！"
                }
              ]
            })(
              <Input placeholder="请输入数据源名称" />
            )}
          </Form.Item>
          <Form.Item label="数据源名称">
            {getFieldDecorator('className', {
              rules: [
                {
                  required: true,
                  message: "必须填写数据源名称！"
                }
              ]
            })(
              <Input placeholder="请输入数据源名称" />
            )}
          </Form.Item>
          <div style={{
            display: "flex", flexDirection: "row", justifyContent: "space-around"
          }}
          >
            <div style={{display: "flex", flexDirection: "column", flex: 3}}>
              <Form.Item label="是否使用时间戳">
                <div>
                  <Switch
                    checked={this.state.isTimeStamp}
                    onChange={(checked) => {
                      this.setState({isTimeStamp: checked});
                    }}
                  />
                </div>
              </Form.Item>
            </div>
            <div style={{display: "flex", flexDirection: "column", flex: 7}}>
              <Form.Item label="时间戳名称">
                {getFieldDecorator('timeStampName', {
                  rules: [
                    {
                      required: this.state.isTimeStamp,
                      message: "必须填写时间戳名称！"
                    }
                  ]
                })(
                  <Input placeholder="请输入时间戳名称" />
                )}
              </Form.Item>
            </div>
          </div>
          <Text strong style={{marginBottom: 10}}>数据源属性列表</Text>
          <List
            bordered
            size="small"
            dataSource={this.state.attributeList}
            renderItem={(item, index) => (
              <List.Item key={index} style={{display: 'flex'}}>
                <Input
                  size="large"
                  defaultValue={item.type}
                  onChange={(e) => this.changeAttribute(e, "type", index)}
                />
                <Divider type="vertical" />
                <Input
                  size="large"
                  defaultValue={item.name}
                  onChange={(e) => this.changeAttribute(e, "name", index)}
                />
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
              this.addAttribute(e);
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
              type="primary"
              icon="form"
              onClick={(e) => {
                this.createModel(e).then(() => {
                  message.success("成功创建数据源！");
                  history.push("/developer/streamProcess/model");
                });
              }}
            >
              创建
            </Button>
            <Button
              icon="close"
              onClick={(e) => {
                history.push("/developer/streamProcess/model");
              }}
            >
              取消
            </Button>
          </div>
        </Form>
      </Layout>
    );
  }
}

StreamModelCreatePage = Form.create({name: 'stream_model_create_page'})(StreamModelCreatePage);
export default StreamModelCreatePage;
