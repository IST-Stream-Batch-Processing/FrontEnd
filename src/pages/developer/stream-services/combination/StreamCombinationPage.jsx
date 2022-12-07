import React, {Component} from 'react';
import Title from "antd/es/typography/Title";
import {
Button, Divider, Form, Layout, message, Modal, Select, Table
} from "antd";
import {NavLink} from "react-router-dom";
import {
  createCombination,
  deleteCombination,
  generateCombination,
  getAllCombinationData,
  getAllModelData,
  runCombination
} from "../../../../api/stream";

const {Column} = Table;

class StreamCombinationPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      visible: false,
      modelData: [],
      newDataId: null,
    };
  }

  getAllData = () => {
    try {
      getAllCombinationData().then(result => {
        this.setState(state => ({
          data: result
        }));
      });
    } catch (err) {
      console.error(err);
    }
  }

  getModelData = () => {
    try {
      getAllModelData().then(result => {
        this.setState(state => ({
          modelData: result
        }));
      });
    } catch (err) {
      console.error(err);
    }
  }

  deleteRecord = (id) => {
    try {
      deleteCombination(id).then(() => {
        this.getAllData();
      });
      message.success("成功删除！");
    } catch (err) {
      console.error(err);
      message.error("删除失败！");
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    try {
      createCombination(this.state.newDataId).then(() => {
        message.success("创建成功！");
        this.getAllData();
      });
    } catch (err) {
      console.error(err);
      message.success("创建失败！");
    }
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  handleChange = e => {
    this.setState(state => ({newDataId: e}));
  };

  componentDidMount() {
    this.getAllData();
    this.getModelData();
  }

  render() {
    return (
      <Layout>
        <div style={{flexDirection: 'row', display: 'flex'}}>
          <Title level={4}>流数据源</Title>
          <Button
            type="primary"
            style={{marginLeft: "auto"}}
            icon="form"
            onClick={() => { this.showModal(); }}
          >
            创建
          </Button>
        </div>
        <Divider />
        <Table dataSource={this.state.data} size="small">
          <Column title="编排id" dataIndex="id" key="id" />
          <Column title="对应的数据源" dataIndex="dataId" key="dataId" />
          <Column
            title="操作"
            key="action"
            render={(text, record) => (
              <span>
                <Button onClick={() => { generateCombination(record.id); }}>
                  生成
                </Button>
                <Divider type="vertical" />
                <Button onClick={() => { runCombination(record.id); }}>
                  执行
                </Button>
                <Divider type="vertical" />
                <Button>
                    <NavLink to={`/developer/streamProcess/combination/edit/${record.id}`}>
                        编辑
                    </NavLink>
                </Button>
                <Divider type="vertical" />
                <Button
                  type="danger"
                  onClick={(e) => {
                    e.preventDefault();
                    this.deleteRecord(record.id);
                  }}
                >
                  删除
                </Button>
              </span>
            )}
          />
        </Table>
        <Modal title="创建数据源编排" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
          <Select placeholder="请选择数据源" style={{ width: "100%" }} onChange={this.handleChange}>
            {this.state.modelData.map(model => <Select.Option value={model.id}>{model.className}</Select.Option>)}
          </Select>
        </Modal>
      </Layout>
    );
  }
}

StreamCombinationPage = Form.create({name: 'stream_combination_page'})(StreamCombinationPage);
export default StreamCombinationPage;
