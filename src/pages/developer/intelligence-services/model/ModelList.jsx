import React from 'react';
import {
  Button, Card, Icon, message, Modal, Popconfirm, Tooltip, Tree
} from 'antd';
import { getModels, deleteModel } from '../../../../api/model';
import TableWithSearch from '../../../../components/TableWithSearch';
import ModelForm from "./ModelForm";
import {modelTypesNames} from '../../../../constants/developer/intelligence-services/model';
import downloadFile from "../../../../utils/downloadFile";

export default class ModelList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      models: [],
      loading: true,
      showModal: false,
      current: null
    };
  }

  async componentDidMount() {
    await this.getModels();
  }

  getModels = async() => {
    getModels().then((r) => {
      this.setState({models: r, loading: false});
    }).catch((err) => {
      console.log(err);
      this.setState({loading: false});
    });
  }

  deleteModel = async(id) => {
    this.setState({loading: true});
    deleteModel(id).then((r) => {
      this.setState(prev => ({ models: prev.models.filter(item => item.id !== id), loading: false}));
      message.success('删除成功');
    }).catch((err) => {
      console.log(err);
      this.setState({loading: false});
    });
  }

  editModel = (data) => {
    this.setState({
      current: data,
      showModal: true
    });
  }

  onClose = () => {
    this.setState({
      showModal: false,
      current: null
    });
  }

  onFresh = async () => {
    await this.getModels();
    this.onClose();
  }

  render() {
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: 200,
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
        width: 300,
        render: (text, record) => (
          <span>{record.description}</span>
        ),
      },
      {
        title: '模型类型',
        dataIndex: 'modelType',
        key: 'modelType',
        width: 200,
        render: (text, record) => (
          <span>{modelTypesNames[record.modelType]}</span>
        ),
      },
      {
        title: '创建人',
        align: 'center',
        key: 'user',
        width: 200,
        render: (text, record) => (
          record.user && record.user.username ? record.user.username : ''
        ),
      },
      {
        title: '操作',
        align: 'center',
        key: 'action',
        render: (text, record) => (
          <>
            <Button
              icon="download"
              style={{ marginLeft: 5, borderColor: '#7b68ee', color: '#7b68ee' }}
              type="primary"
              ghost
              onClick={() => downloadFile(record.fileId)}
            >
              下载
            </Button>
            <Button
              icon="project"
              style={{ marginLeft: 5, borderColor: '#f6b529', color: '#f6b529' }}
              type="primary"
              ghost
              onClick={() => {
                this.editModel(record);
              }}
            >
              编辑
            </Button>
            <Popconfirm
              title="确定删除该模型吗"
              onConfirm={() => this.deleteModel(record.id)}
              okText="Yes"
              cancelText="No"
              type="error"
            >
              <Button icon="delete" type="danger" ghost style={{ marginLeft: '5px' }}>
                删除
              </Button>
            </Popconfirm>
          </>
        )
      },
    ];
    return (
      <div>
        <Button type="primary" onClick={() => this.setState({showModal: true})} style={{marginBottom: '10px'}} icon="plus">新建模型</Button>
        <Card>
          <div className="panelSpan" style={{margin: '10px'}}>模型列表</div>
          <TableWithSearch rowKey="id" dataSource={this.state.models} columns={columns} size="middle" bordered loading={this.state.loading} />
        </Card>
        <Modal visible={this.state.showModal} title={this.state.current ? "编辑模型" : "新建模型"} destroyOnClose footer={null} onCancel={this.onClose}>
          <ModelForm onClose={this.onClose} onFresh={this.onFresh} current={this.state.current} />
        </Modal>
      </div>
    );
  }
}
