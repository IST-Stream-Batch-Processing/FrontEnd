import React from 'react';
import {
    Button, Card, message, Modal, Popconfirm
} from 'antd';
import {
 getAllIntelServices, deleteIntelService, unPublishIntelService
} from '../../../../api/intelligence';
import TableWithSearch from '../../../../components/TableWithSearch';
import ServiceForm from './ServiceForm';
import {intelServiceStatus, Published} from '../../../../constants/developer/intelligence-services/intel-service';
import {getModels} from '../../../../api/model';
import ServicePublishForm from './ServicePublishForm';
import history from '../../../../utils/history';

export default class ServiceList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            services: [],
            models: [],
            loading: true,
            showModal: false,
            showPublishModal: false,
            current: null
        };
    }

    async componentDidMount() {
        await this.getServices();
    }

    getModels = async() => {
        getModels().then((r) => {
            this.setState({models: r});
        }).catch((err) => {
            console.log(err);
        });
    }

    getServices = async() => {
        await this.getModels();
        getAllIntelServices().then((r) => {
            this.setState({services: r, loading: false});
        }).catch((err) => {
            console.log(err);
            this.setState({loading: false});
        });
    }

    deleteService = async(id) => {
        this.setState({loading: true});
        deleteIntelService(id).then((r) => {
            this.setState(prev => ({ services: prev.services.filter(item => item.id !== id), loading: false}));
            message.success('删除成功');
        }).catch((err) => {
            console.log(err);
            this.setState({loading: false});
        });
    }

    editService = (data) => {
        this.setState({
            current: data,
            showModal: true
        });
    }

    onClose = () => {
        this.setState({
            showModal: false,
            showPublishModal: false,
            current: null
        });
    }

    onFresh = async () => {
        await this.getServices();
        this.onClose();
    }

    publish = (data) => {
        this.setState({
            current: data,
            showPublishModal: true
        });
    }

    unPublish = (id) => {
        unPublishIntelService(id).then((r) => {
            this.getServices();
        }).catch((err) => {
            console.log(err);
        });
    }

    findModelName = (id) => {
        const res = this.state.models.find((model) => model.id === id);
        if (res) return res.name;
        return '';
    }

    render() {
        const columns = [
            {
                title: '名称',
                align: 'center',
                dataIndex: 'name',
                key: 'name',
                width: 150,
            },
            {
                title: '描述',
                align: 'center',
                dataIndex: 'description',
                key: 'description',
                width: 200,
                render: (text, record) => (
                    <span>{record.description}</span>
                ),
            },
            {
                title: '模型',
                align: 'center',
                dataIndex: 'modelId',
                key: 'modelId',
                width: 200,
                render: (text, record) => (
                    <span>{this.findModelName(record.modelId)}</span>
                ),
            },
            {
                title: '发布版本',
                align: 'center',
                dataIndex: 'releaseVersion',
                key: 'releaseVersion',
                width: 100,
                render: (text, record) => (
                    <span>{record.releaseVersion}</span>
                ),
            },
            {
                title: '最新版本',
                align: 'center',
                dataIndex: 'latestVersion',
                key: 'latestVersion',
                width: 100,
                render: (text, record) => (
                    <span>{record.latestVersion}</span>
                ),
            },
            {
                title: '状态',
                align: 'center',
                dataIndex: 'status',
                key: 'status',
                width: 100,
                render: (text, record) => (
                    <span>{intelServiceStatus[record.status]}</span>
                ),
            },
            {
                title: '操作',
                align: 'center',
                key: 'action',
                render: (text, record) => (
                    <>
                        <Button
                            icon="carry-out"
                            style={{ marginLeft: 5, borderColor: '#7b68ee', color: '#7b68ee' }}
                            type="primary"
                            disabled={record.latestVersion === 0}
                            ghost
                            onClick={() => {
                                if (record.status === 'Published') this.unPublish(record.id);
                                else this.publish(record);
                            }}
                        >
                            {record.status === Published ? "取消发布" : "发布"}
                        </Button>
                        <Button
                            icon="usb"
                            style={{ marginLeft: 5, borderColor: '#20B2AA', color: '#20B2AA' }}
                            type="primary"
                            ghost
                            onClick={() => {
                                localStorage.setItem('intelServiceId', record.id);
                                history.push({
                                    pathname: '/developer/intelligence/service/train',
                                });
                            }}
                        >
                            训练
                        </Button>
                        <Button
                            icon="read"
                            style={{ marginLeft: 5, borderColor: '#4682B4', color: '#4682B4' }}
                            type="primary"
                            ghost
                            onClick={() => {
                                history.push(`/intelligence/service/reason/${record.id}`);
                            }}
                        >
                            推理
                        </Button>
                        <Button
                            icon="project"
                            style={{ marginLeft: 5, borderColor: '#f6b529', color: '#f6b529' }}
                            type="primary"
                            ghost
                            onClick={() => {
                                this.editService(record);
                            }}
                        >
                            编辑
                        </Button>
                        <Popconfirm
                            title="确定删除该智能服务吗"
                            onConfirm={() => this.deleteService(record.id)}
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
                <Button type="primary" onClick={() => this.setState({showModal: true})} style={{marginBottom: '10px'}} icon="plus">新建智能服务</Button>
                <Card>
                    <div className="panelSpan" style={{margin: '10px'}}>智能服务列表</div>
                    <TableWithSearch rowKey="id" dataSource={this.state.services} columns={columns} size="middle" bordered loading={this.state.loading} />
                </Card>
                <Modal visible={this.state.showModal} title={this.state.current ? "编辑服务" : "新建服务"} destroyOnClose footer={null} onCancel={this.onClose}>
                    <ServiceForm onClose={this.onClose} onFresh={this.onFresh} current={this.state.current} models={this.state.models} />
                </Modal>
                <Modal visible={this.state.showPublishModal} title="发布智能服务" destroyOnClose footer={null} onCancel={this.onClose}>
                    <ServicePublishForm onClose={this.onClose} onFresh={this.onFresh} current={this.state.current} />
                </Modal>
            </div>
        );
    }
}
