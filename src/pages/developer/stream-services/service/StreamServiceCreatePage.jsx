import React, {Component} from 'react';
import Title from "antd/es/typography/Title";
import {
Button, Divider, Form, Input, Layout, message, Radio, Steps, Switch
} from "antd";
import {css} from "aphrodite";
import Text from "antd/es/typography/Text";
import styles from '../../../../constants/pageStyle';

const {Step} = Steps;

const steps = [{ title: '选择服务类型', }, { title: '填写信息', }, { title: '创建成功', }];

class StreamServiceCreatePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      selectedType: ""
    };
  }

  next() {
    const current = this.state.current + 1;
    this.setState(state => ({current}));
  }

  prev() {
    const current = this.state.current - 1;
    this.setState(state => ({current}));
  }

  selectOperationType = () => (
    <>
      <Text strong style={{marginBottom: 10, marginTop: 20}}>请选择服务类型</Text>
      <Radio.Group
        defaultValue="a"
        size="large"
        style={{display: "flex", flexDirection: "column", justifyContent: "space-around"}}
        onChange={(e) => {
          this.setState(state => ({selectedType: e.target.value}));
        }}
      >
        <Radio.Button className={css(styles.radioButtons)} value="MapConstruct">Map Construct</Radio.Button>
        <Radio.Button className={css(styles.radioButtons)} value="AscendingTimeStamp">Ascending TimeStamp</Radio.Button>
        <Radio.Button className={css(styles.radioButtons)} value="FilterDataClassOne">
          Filter Data Class One
        </Radio.Button>
        <Radio.Button className={css(styles.radioButtons)} value="KeyByDataClass">Key By Data Class</Radio.Button>
        <Radio.Button className={css(styles.radioButtons)} value="TimeWindow">Time Window</Radio.Button>
      </Radio.Group>
    </>
  )

  getOperationForm = () => {
    const {getFieldDecorator} = this.props.form;

    return (
      <>
        <Title level={4}>创建MapConstruct服务</Title>
        <Form>
          <Form.Item label="输入的具体类型">
            {getFieldDecorator('originalType', {
              rules: [
                {
                  required: false,
                }
              ]
            })(
              <Input placeholder="请输入用户需要输入的具体类型" />
            )}
          </Form.Item>
          <Form.Item label="输出的具体类型">
            {getFieldDecorator('originalType', {
              rules: [
                {
                  required: false,
                }
              ]
            })(
              <Input placeholder="请输入用户需要输出的具体类型" />
            )}
          </Form.Item>
          <Form.Item label="isSplit">
            {getFieldDecorator('isSplit', {
              rules: [
                {
                  required: false,
                  defaultValue: true
                }
              ]
            })(
              <Switch />
            )}
          </Form.Item>
          <Form.Item label="分隔符">
            {getFieldDecorator('delimiter', {
              rules: [
                {
                  required: true,
                }
              ]
            })(
              <Input placeholder="请输入分隔符" />
            )}
          </Form.Item>
          <Form.Item label="时间戳类型">
            {getFieldDecorator('timeStampType', {
              rules: [
                {
                  required: true,
                }
              ]
            })(
              <Input placeholder="请输入时间戳类型" />
            )}
          </Form.Item>
          <Form.Item label="Regex Format">
            {getFieldDecorator('regexFormat', {
              rules: [
                {
                  required: true,
                }
              ]
            })(
              <Input placeholder="请输入Regex Format" />
            )}
          </Form.Item>
          <Form.Item label="TimeStamp Index">
            {getFieldDecorator('timeStampIndex', {
              rules: [
                {
                  required: true,
                }
              ]
            })(
              <Input placeholder="请输入TimeStamp Index" />
            )}
          </Form.Item>
        </Form>
      </>
    );
  }

  render() {
    return (
      <Layout>
        <div style={{flexDirection: 'row', display: 'flex'}}>
          <Title level={4}>创建流数据服务</Title>
        </div>
        <Divider />
        <Steps current={this.state.current}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div style={{
          width: "400px", margin: "auto", display: "flex", flexDirection: "column"
        }}
        >
          <div className="steps-content">
            {this.state.current === 0 ? this.selectOperationType() : null}
            {this.state.current === 1 ? this.getOperationForm() : null}
          </div>
          <div style={{
            flexDirection: 'row-reverse', display: "flex", marginTop: 80, justifyContent: "space-around"
          }}
          >
            {this.state.current < steps.length - 1 && (
              <Button icon="arrow-right" type="primary" onClick={() => this.next()}>
                下一步
              </Button>
            )}
            {this.state.current === steps.length - 1 && (
              <Button icon="check" type="primary" onClick={() => message.success('Processing complete!')}>
                完成
              </Button>
            )}
            {this.state.current > 0 && (
              <Button icon="arrow-left" onClick={() => this.prev()}>
                上一步
              </Button>
            )}
          </div>
        </div>
      </Layout>
    );
  }
}

StreamServiceCreatePage = Form.create({name: 'stream_service_create_page'})(StreamServiceCreatePage);
export default StreamServiceCreatePage;
