import React, {Component} from 'react';
import Title from "antd/es/typography/Title";
import {
  Button,
  Descriptions,
  Divider,
  Form,
  Icon,
  Input,
  Layout,
  List,
  message,
  Radio,
  Select,
  Steps,
  Switch
} from "antd";
import {css} from "aphrodite";
import Text from "antd/es/typography/Text";
import {CloseCircleOutlined} from "@ant-design/icons";
import styles from '../../../../constants/pageStyle';
import history from "../../../../utils/history";
import {
  createAGGService,
  createATService,
  createFDCOService,
  createKBDCService,
  createMAKBYService,
  createMCService,
  createPLSService,
  createPVLService,
  createTWService,
  createWVCService,
  getAllCombinationData
} from "../../../../api/stream";

const {Step} = Steps;

const steps = [{title: '选择服务类型', }, {title: '填写信息', }, {title: '创建成功', }];

class StreamServiceCreatePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      selectedType: "",
      isRegex: false,
      combinationData: [],
      dataList: []
    };
  }

  componentDidMount() {
    this.getCombinationData();
  }

  getCombinationData = () => {
    try {
      getAllCombinationData().then((result) => {
        this.setState(state => ({
          combinationData: result
        }));
      });
    } catch (err) {
      console.error(err);
      message.error("获取编排信息失败！");
    }
  }

  createService = async (e) => {
    try {
      await this.props.form.validateFields();
      const data = this.props.form.getFieldsValue();
      switch (this.state.selectedType) {
        case "MapConstruct":
          data.dataList = this.state.dataList;
          await createMCService(data);
          break;
        case "AscendingTimeStamp":
          await createATService(data);
          break;
        case "FilterDataClassOne":
          await createFDCOService(data);
          break;
        case "KeyByDataClass":
          await createKBDCService(data);
          break;
        case "TimeWindow":
          await createTWService(data);
          break;
        case "WindowViewCount":
          data.attributeList = this.state.dataList;
          console.log(data);
          await createWVCService(data);
          break;
        case "Aggregate":
          await createAGGService(data);
          break;
        case "ProcessListState":
          await createPLSService(data);
          break;
        case "MapAndKeyByRandom":
          await createMAKBYService(data);
          break;
        case "ProcessValueState":
          await createPVLService(data);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error(err);
      message.error("生成服务失败！");
    }
  }

  next() {
    const current = this.state.current + 1;
    this.setState(state => ({current}));
  }

  prev() {
    const current = this.state.current - 1;
    this.setState(state => ({current}));
  }

  // 选择算子类型
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
        <Radio.Button className={css(styles.radioButtons)} value="WindowViewCount">WindowViewCount</Radio.Button>
        <Radio.Button className={css(styles.radioButtons)} value="Aggregate">Aggregate</Radio.Button>
        <Radio.Button className={css(styles.radioButtons)} value="ProcessListState">ProcessListState</Radio.Button>
        <Radio.Button className={css(styles.radioButtons)} value="MapAndKeyByRandom">MapAndKeyByRandom</Radio.Button>
        <Radio.Button className={css(styles.radioButtons)} value="ProcessValueState">ProcessValueState</Radio.Button>
      </Radio.Group>
    </>
  )

  changeAttribute = (e, param, index) => {
    const newList = this.state.dataList;
    newList[index][`${param}`] = e;
    this.setState(state => ({dataList: newList}));
  }

  removeAttribute = (e, deleteItem) => {
    e.preventDefault();
    const newList = this.state.dataList;
    this.setState(state => ({dataList: newList.filter(item => item !== deleteItem)}));
  }

  addAttribute = (e) => {
    e.preventDefault();
    const newList = this.state.dataList;
    this.setState(state => ({
      dataList: newList.concat({
        type: "String",
        index: 0
      })
    }));
  }

  MapConstructorItems = () => {
    const {getFieldDecorator} = this.props.form;
    return (
      <>
        <Form.Item label="是否需要分割数据流字符串">
          {getFieldDecorator('isSplit', {
            rules: [
              {
                required: false,
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
            <Select placeholder="请输入时间戳类型">
              <Select.Option value="String">String</Select.Option>
              <Select.Option value="String">Integer</Select.Option>
              <Select.Option value="String">Long</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="时间戳属性的格式">
          {getFieldDecorator('regexFormat', {
            rules: [
              {
                required: true,
              }
            ]
          })(
            <Input placeholder="请输入时间戳属性的格式" />
          )}
        </Form.Item>
        <Form.Item label="时间戳在分割后字符串列表中的位置">
          {getFieldDecorator('timeStampIndex', {
            rules: [
              {
                required: true,
              }
            ]
          })(
            <Input type="number" placeholder="请输入时间戳在分割后字符串列表中的位置" />
          )}
        </Form.Item>
        <List
          header="数据属性类型与其在数据流中的对应位置"
          bordered
          size="small"
          dataSource={this.state.dataList}
          renderItem={(item, index) => (
            <List.Item key={index} style={{display: 'flex'}}>
              <Select
                size="large"
                defaultValue={item.type}
                onChange={(e) => this.changeAttribute(e, "type", index)}
              >
                <Select.Option value="String">String</Select.Option>
                <Select.Option value="Integer">Integer</Select.Option>
                <Select.Option value="Long">Long</Select.Option>
              </Select>
              <Divider type="vertical" />
              <Input
                size="large"
                defaultValue={item.index}
                onChange={(e) => this.changeAttribute(e.target.value, "index", index)}
                type="number"
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
      </>
    );
  }

  ATItems = () => {
    const {getFieldDecorator} = this.props.form;
    return (
      <>
        <Form.Item label="时间戳名称">
          {getFieldDecorator('timeStampName', {
            rules: [
              {
                required: true,
              }
            ]
          })(
            <Input placeholder="请输入时间戳名称" />
          )}
        </Form.Item>
        <Form.Item label="时间戳单位">
          {getFieldDecorator('unit', {
            rules: [
              {
                required: true,
              }
            ]
          })(
            <Input placeholder="请输入时间戳单位" />
          )}
        </Form.Item>
      </>
    );
  }

  FDCOItems = () => {
    const {getFieldDecorator} = this.props.form;
    return (
      <>
        <Form.Item label="筛选目标属性名称">
          {getFieldDecorator('filterName', {
            rules: [
              {
                required: true,
              }
            ]
          })(
            <Input placeholder="请输入筛选目标属性名称" />
          )}
        </Form.Item>
        <Form.Item label="筛选目标值">
          {getFieldDecorator('value', {
            rules: [
              {
                required: true,
              }
            ]
          })(
            <Input placeholder="请输入筛选目标值" />
          )}
        </Form.Item>
        <div style={{
          display: "flex", flexDirection: "row", justifyContent: "space-around"
        }}
        >
          <div style={{display: "flex", flexDirection: "column", flex: 3}}>
            <Form.Item label="是否需要正则表达">
              <div>
                <Switch
                  checked={this.state.isRegex}
                  onChange={(checked) => {
                    this.setState({isRegex: checked});
                  }}
                />
              </div>
            </Form.Item>
          </div>
          <div style={{display: "flex", flexDirection: "column", flex: 7}}>
            <Form.Item label="正则表达式">
              {getFieldDecorator('timeStampName', {
                rules: [
                  {
                    required: this.state.isRegex,
                    message: "必须填写正则表达式！"
                  }
                ]
              })(
                <Input placeholder="请输入正则表达式" />
              )}
            </Form.Item>
          </div>
        </div>
      </>
    );
  }

  KBDCItems = () => {
    const {getFieldDecorator} = this.props.form;
    return (
      <>
        <Form.Item label="key名称">
          {getFieldDecorator('keyName', {
            rules: [
              {
                required: true,
              }
            ]
          })(
            <Input placeholder="请输入key名称" />
          )}
        </Form.Item>
        <Form.Item label="key的数据类型">
          {getFieldDecorator('keyType', {
            rules: [
              {
                required: true,
              }
            ]
          })(
            <Input placeholder="请输入key的数据类型" />
          )}
        </Form.Item>
      </>
    );
  }

  TimeWindowItems = () => {
    const {getFieldDecorator} = this.props.form;
    return (
      <>
        <Form.Item label="是否为滑动窗口">
          {getFieldDecorator('isSlide', {
            rules: [
              {
                required: false,
              }
            ]
          })(
            <Switch />
          )}
        </Form.Item>
        <Form.Item label="窗口长度单位">
          {getFieldDecorator('lengthUnit', {
            rules: [
              {
                required: true,
              }
            ]
          })(
            <Select placeholder="请输入窗口长度单位">
              <Select.Option value="day">天</Select.Option>
              <Select.Option value="hour">小时</Select.Option>
              <Select.Option value="minute">分钟</Select.Option>
              <Select.Option value="second">秒</Select.Option>
              <Select.Option value="millisecond">毫秒</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="窗口长度">
          {getFieldDecorator('length', {
            rules: [
              {
                required: true,
              }
            ]
          })(
            <Input placeholder="请输入窗口长度" />
          )}
        </Form.Item>
        <Form.Item label="滑动窗口间隔单位">
          {getFieldDecorator('intervalUnit', {
            rules: [
              {
                required: true,
              }
            ]
          })(
            <Input placeholder="请输入滑动窗口间隔单位" />
          )}
        </Form.Item>
        <Form.Item label="间隔长度">
          {getFieldDecorator('interval', {
            rules: [
              {
                required: true,
              }
            ]
          })(
            <Input placeholder="请输入间隔长度" />
          )}
        </Form.Item>
        <Form.Item label="key数据类型">
          {getFieldDecorator('keyType', {
            rules: [
              {
                required: true,
              }
            ]
          })(
            <Input placeholder="key数据类型" />
          )}
        </Form.Item>
      </>
    );
  }

  WindowViewCountItems = () => {
    const {getFieldDecorator} = this.props.form;
    return (
      <>
        <Form.Item label="名称">
          {getFieldDecorator('className', {
            rules: [
              {
                required: true,
                initialValue: "WindowViewCount"
              }
            ]
          })(
            <Input placeholder="请输入名称" />
          )}
        </Form.Item>
        <Form.Item label="key名称">
          {getFieldDecorator('keyName', {
            rules: [
              {
                required: true,
              }
            ]
          })(
            <Input placeholder="请输入key名称" />
          )}
        </Form.Item>
        <Form.Item label="key的数据类型">
          {getFieldDecorator('keyType', {
            rules: [
              {
                required: true,
              }
            ]
          })(
            <Input placeholder="请输入key的数据类型" />
          )}
        </Form.Item>
        <List
          header="Attribute List"
          bordered
          size="small"
          dataSource={this.state.dataList}
          renderItem={(item, index) => (
            <List.Item key={index} style={{display: 'flex'}}>
              <Select
                size="large"
                defaultValue={item.type}
                onChange={(e) => this.changeAttribute(e, "type", index)}
              >
                <Select.Option value="String">String</Select.Option>
                <Select.Option value="Integer">Integer</Select.Option>
                <Select.Option value="Long">Long</Select.Option>
              </Select>
              <Divider type="vertical" />
              <Input
                size="large"
                defaultValue={item.name}
                onChange={(e) => this.changeAttribute(e.target.value, "name", index)}
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
      </>
    );
  }

  AggregateItems = () => {
    const {getFieldDecorator} = this.props.form;
    return (
      <>
        <Form.Item label="key的数据类型">
          {getFieldDecorator('keyType', {
            rules: [
              {
                required: true,
              }
            ]
          })(
            <Input placeholder="请输入key的数据类型" />
          )}
        </Form.Item>
        <Descriptions title="规则说明" bordered layout="vertical" column={1}>
          <Descriptions.Item label="accumulator累加器初始化">0</Descriptions.Item>
          <Descriptions.Item label="accumulator累加规则">accumulator = accumulator + 1</Descriptions.Item>
        </Descriptions>
      </>
    );
  }

  ProcessListStateItems = () => {
    const {getFieldDecorator} = this.props.form;
    return (
      <>
        <Form.Item label="key的数据类型">
          {getFieldDecorator('keyType', {
            rules: [
              {
                required: true,
              }
            ]
          })(
            <Input placeholder="请输入key的数据类型" />
          )}
        </Form.Item>
        <Form.Item label="是否全部输出前N">
          {getFieldDecorator('isTop', {
            rules: [
              {
                required: false,
              }
            ]
          })(
            <Switch />
          )}
        </Form.Item>
        <Form.Item label="Top Size">
          {getFieldDecorator('topSize', {
            rules: [
              {
                required: true,
              }
            ]
          })(
            <Input placeholder="请输入Top Size" type="number" />
          )}
        </Form.Item>
        <Form.Item label="是否排序">
          {getFieldDecorator('isSort', {
            rules: [
              {
                required: false,
              }
            ]
          })(
            <Switch />
          )}
        </Form.Item>
        <Form.Item label="是否从大到小排">
          {getFieldDecorator('isDescending', {
            rules: [
              {
                required: false,
              }
            ]
          })(
            <Switch />
          )}
        </Form.Item>
      </>
    );
  }

  MapAndKeyByRandomItems = () => {
    const {getFieldDecorator} = this.props.form;
    return (
      <>
        <Form.Item label="随机值">
          {getFieldDecorator('randomSize', {
            rules: [
              {
                required: true,
              }
            ]
          })(
            <Input placeholder="请输入随机值的大小" />
          )}
        </Form.Item>
      </>
    );
  }

  ProcessValueStateItems = () => {
    const {getFieldDecorator} = this.props.form;
    return (
      <>
        <Form.Item label="key的数据类型">
          {getFieldDecorator('keyType', {
            rules: [
              {
                required: true,
              }
            ]
          })(
            <Input placeholder="请输入key的数据类型" />
          )}
        </Form.Item>
      </>
    );
  }

  // 生成不同算子的Form
  getOperationForm = () => {
    const {getFieldDecorator} = this.props.form;

    return (
      <>
        <Title level={4}>{`创建${this.state.selectedType}服务`}</Title>
        <Form>
          <Form.Item label="所属 combination 的 Id">
            {getFieldDecorator('combinationId', {
              rules: [
                {
                  required: true,
                }
              ]
            })(
              <Select placeholder="请选择所属 combination 的 Id">
                {this.state.combinationData.map(item => <Select.Option value={item.id}>{item.name}</Select.Option>)}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="输入的具体类型">
            {getFieldDecorator('originalType', {
              rules: [
                {
                  required: false,
                  initialValue: "String"
                }
              ],
            })(
              <Input placeholder="请输入用户需要输入的具体类型" />
            )}
          </Form.Item>
          <Form.Item label="输出的具体类型">
            {getFieldDecorator('finalType', {
              rules: [
                {
                  required: false,
                  initialValue: "String"
                }
              ]
            })(
              <Input placeholder="请输入用户需要输出的具体类型" />
            )}
          </Form.Item>
          {this.state.selectedType === "MapConstruct" ? this.MapConstructorItems() : null}
          {this.state.selectedType === "AscendingTimeStamp" ? this.ATItems() : null}
          {this.state.selectedType === "FilterDataClassOne" ? this.FDCOItems() : null}
          {this.state.selectedType === "KeyByDataClass" ? this.KBDCItems() : null}
          {this.state.selectedType === "TimeWindow" ? this.TimeWindowItems() : null}
          {this.state.selectedType === "WindowViewCount" ? this.WindowViewCountItems() : null}
          {this.state.selectedType === "Aggregate" ? this.AggregateItems() : null}
          {this.state.selectedType === "ProcessListState" ? this.ProcessListStateItems() : null}
          {this.state.selectedType === "MapAndKeyByRandom" ? this.MapAndKeyByRandomItems() : null}
          {this.state.selectedType === "ProcessValueState" ? this.ProcessValueStateItems() : null}
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
        <Steps current={this.state.current} style={{marginBottom: 50}}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div style={{
          width: "400px", margin: "auto", display: "flex", flexDirection: "column"
        }}
        >
          <div>
            {this.state.current === 0 ? this.selectOperationType() : null}
            {this.state.current === 1 ? this.getOperationForm() : null}
          </div>
          <div style={{
            flexDirection: 'row-reverse', display: "flex", marginTop: 80, justifyContent: "space-around"
          }}
          >
            {this.state.current === 0 && (
              <>
                <Button icon="arrow-right" type="primary" onClick={() => this.next()}>
                下一步
                </Button>
                <Button icon="close" onClick={() => history.push("/developer/streamProcess/service")}>
                  取消
                </Button>
              </>
            )}
            {this.state.current === 1 && (
              <Button
                icon="arrow-right"
                type="primary"
                onClick={(e) => {
                  e.preventDefault();
                  this.createService(e).then(() => {
                    this.next();
                  });
                }}
              >
                下一步
              </Button>
            )}
            {this.state.current === steps.length - 1 && (
              <Button icon="check" type="primary" onClick={() => history.push("/developer/streamProcess/service")}>
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
