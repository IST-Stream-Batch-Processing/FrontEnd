import React from 'react';
import {
  Button, Card, Icon, Popconfirm, Tooltip, Tree
} from 'antd';
import history from '../../../utils/history';
import {getOSServices, deleteOSService} from '../../../api/osService';
import TableWithSearch from '../../../components/TableWithSearch';
import '../../../css/osService.css';
import {renderNode} from './node-render/TreeRender';

export default class OrchestrationServiceList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      services: [],
      loading: true,
    };
  }

  async componentDidMount() {
    await this.getOSServices();
  }

  getOSServices = async() => {
    getOSServices().then((r) => {
      this.setState({services: r, loading: false});
    }).catch((err) => {
      console.log(err);
      this.setState({loading: false});
    });
  }

  deleteService = async(id) => {
    this.setState({loading: true});
    deleteOSService(id).then((r) => {
      this.setState(prev => ({ services: prev.services.filter(item => item.id !== id), loading: false}));
    }).catch((err) => {
      console.log(err);
      this.setState({loading: false});
    });
  }

  render() {
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '输入数据',
        dataIndex: 'inType',
        key: 'inType',
        render: (text, record) => (
          <Tree>
            { renderNode('', record.inType, false) }
          </Tree>
        )
      },
      {
        title: '输出数据',
        dataIndex: 'outType',
        key: 'outType',
        render: (text, record) => (
          <Tree>
            { renderNode('', record.outType, false) }
          </Tree>
        ),
      },
      {
        title: '创建人',
        align: 'center',
        key: 'creator',
        render: (text, record) => (
          record.creator && record.creator.userName ? record.creator.userName : ''
        ),
      },
      {
        title: '操作',
        align: 'center',
        key: 'action',
        render: (text, record) => (
              <>
                <Tooltip title="修改">
                  <Button
                    type="link"
                    size="small"
                    onClick={() => { history.push('orchestration/edit', { serviceId: record.id}); }}
                  >
                    <Icon type="edit" style={{ color: '#3598e7'}} />
                  </Button>
                </Tooltip>
                <Tooltip title="查看详情">
                  <Button
                    type="link"
                    size="small"
                    onClick={() => { history.push('orchestration/detail', { serviceId: record.id}); }}
                  >
                    <Icon type="snippets" style={{ color: '#3598e7'}} />
                  </Button>
                </Tooltip>
                <Popconfirm
                  title="确定删除该组合服务吗"
                  onConfirm={() => this.deleteService(record.id)}
                  okText="Yes"
                  cancelText="No"
                  type="error"
                >
                  <Icon type="delete" theme="filled" style={{ color: 'red', marginLeft: '5px' }} />
                </Popconfirm>
              </>
            )
      },
    ];
    return (
      <div>
        <Button type="primary" onClick={() => history.push('orchestration/new')} style={{marginBottom: '10px'}} icon="plus">新建组合服务</Button>
        <Card>
          <div className="panelSpan" style={{margin: '10px'}}>组合服务列表</div>
          <TableWithSearch rowKey="id" dataSource={this.state.services} columns={columns} size="middle" bordered loading={this.state.loading} />
        </Card>
      </div>
    );
  }
}
