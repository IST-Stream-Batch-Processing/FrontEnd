import React from 'react';
import {
  Button, Icon, Modal, Row, Table, Tag, Tooltip, Tree
} from 'antd';
import {getOSServiceInstanceById, getOSServiceInstanceByServiceId} from '../../../../api/osService';
import timeFormat from '../../../../utils/time';
import TableWithSearch from '../../../../components/TableWithSearch';
import '../../../../css/osService.css';
import renderTree from '../../../../components/as-services/LogDataTreeRender';

const statusTagStyle = {
  'RUNNING': 'blue',
  'FAIL': 'red',
  'SUCCESS': 'green'
};

export default class OrchestrationServiceInstanceList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      instances: [],
      serviceId: props.serviceId,
      loading: true,
      isShowModal: false,
      instance: null
    };
  }

  async componentDidMount() {
    await this.getInstance();
  }

  getInstance = async() => {
    const { serviceId } = this.state;
    getOSServiceInstanceByServiceId(serviceId).then((r) => {
      this.setState({instances: r, loading: false});
    });
  }

  showModal = (instanceId) => {
    const { serviceId } = this.state;
    getOSServiceInstanceById(serviceId, instanceId).then((r) => {
      this.setState({instance: r, isShowModal: true});
    });
  }

  onCancel = () => {
    this.setState({isShowModal: false});
  }

  render() {
    const columns = [
      {
        title: '输入',
        dataIndex: 'input',
        key: 'input',
        render: (text, record) => <Tree>{renderTree('', JSON.parse(record.input))}</Tree>
      },
      {
        title: '输出',
        dataIndex: 'output',
        key: 'output',
        render: (text, record) => <Tree>{renderTree('', JSON.parse(record.output))}</Tree>
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        key: 'startTime',
        render: (text, record) => (
          <div>{timeFormat(record.startTime)}</div>
        )
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
        render: (text, record) => (
          record.endTime === null ? '暂未结束' : <div>{timeFormat(record.endTime)}</div>
        ),
      },
      {
        title: '调用人',
        align: 'invoker',
        key: 'invoker',
        render: (text, record) => (
          record.invoker.userName
        ),
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => (
            <Tag color={statusTagStyle[record.status]}>{record.status}</Tag>
        ),
      },
      {
        title: '操作',
        align: 'center',
        key: 'action',
        render: (text, record, index) => (
          <>
            <Tooltip title="服务日志">
              <Button
                type="link"
                size="small"
                onClick={() => { this.showModal(record.id); }}
              >
                <Icon type="snippets" style={{ color: '#3598e7', marginLeft: '5px' }} />
              </Button>
            </Tooltip>
          </>
        )
      },
    ];
    const columnsInput = [
      {
        title: '节点id',
        dataIndex: 'nodeId',
        key: 'nodeId',
        width: '30%',
      },
      {
        title: '节点名称',
        dataIndex: 'name',
        key: 'name',
        width: '30%',
      },
      {
        title: '输入',
        dataIndex: 'data',
        key: 'data',
        render: (text, record) => <Tree>{renderTree('', JSON.parse(record.data))}</Tree>
      },
    ];
    const columnsOutput = [
      {
        title: '节点id',
        dataIndex: 'nodeId',
        key: 'nodeId',
        width: '30%',
      },
      {
        title: '节点名称',
        dataIndex: 'name',
        key: 'name',
        width: '30%',
      },
      {
        title: '输出',
        dataIndex: 'data',
        key: 'data',
        render: (text, record) => <Tree>{renderTree('', JSON.parse(record.data))}</Tree>
      }
    ];
    return (
      <div>
          <div className="panelSpan" style={{margin: '10px'}}>组合服务日志</div>
          <TableWithSearch rowKey="id" dataSource={this.state.instances} columns={columns} size="middle" bordered loading={this.state.loading} />
          <Modal visible={this.state.isShowModal} onCancel={this.onCancel} footer={null} title="组合服务日志" destroyOnClose style={{minWidth: '600px'}}>
          <Row className="panelSpan">各节点输入详情</Row>
            { this.state.instance !== null && this.state.instance.inputLogs !== null ? (
            <Table size="small" dataSource={this.state.instance.inputLogs} columns={columnsInput} />
          ) : '暂无'}
          <Row className="panelSpan">各节点输出详情</Row>
          { this.state.instance !== null && this.state.instance.outputLogs !== null ? (
            <Table size="small" dataSource={this.state.instance.outputLogs} columns={columnsOutput} />
            )
           : '暂无'}
            { this.state.instance !== null && this.state.instance.status === 'FAIL' ?
              (
                <>
                  <Row className="panelSpan">错误信息</Row>
                  <div>
                    {this.state.instance.failMessage || '无'}
                  </div>
                </>
              )
              : null}
          </Modal>
      </div>
    );
  }
}
