import React from 'react';
import {
Button, Divider, Form, Icon, Input, Layout, List, message, Switch
} from 'antd';
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import {CloseCircleOutlined} from "@ant-design/icons";
import history from '../../../../utils/history';
import {getSingleModelData, updateModelData} from "../../../../api/stream";

class StreamModelEditPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isTimeStamp: null,
      attributeList: []
    };
  }

  componentDidMount() {
    this.getSingleData();
  }

  updateModel = async (e) => {
    e.preventDefault();
    const {form} = this.props;
    try {
      await form.validateFields();
      const data = form.getFieldsValue();
      data.isTimeStamp = this.state.isTimeStamp;
      data.attributeList = this.state.attributeList;
      console.log(data);
      await updateModelData(data);
    } catch (err) {
      console.error(err);
    }
  }

  getSingleData() {
    try {
      getSingleModelData(this.props.match.params.id).then(result => {
        this.setState(state => ({
          isTimeStamp: result.isTimeStamp,
          attributeList: result.attributeList,
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
          <Form.Item label="数据源id">
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
          <Form.Item label="用户id">
            {getFieldDecorator('userId', {
              rules: [
                {
                  required: true,
                }
              ]
            })(
              <Input disabled />
            )}
          </Form.Item>
          <Form.Item label="数据源文件路径">
            {getFieldDecorator('filePath', {
              rules: [
                {
                  required: true,
                  message: "必须填写数据源文件路径！",
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
                  message: "必须填写数据源名称！",
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
              icon="save"
              onClick={(e) => {
                this.updateModel(e).then(() => {
                  message.success("成功更新数据源！");
                  history.push("/developer/streamProcess/model");
                });
              }}
            >
              保存
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

StreamModelEditPage = Form.create({name: 'stream_model_edit_page'})(StreamModelEditPage);
export default StreamModelEditPage;
