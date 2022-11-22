import React from "react";
import {
Button, Card, Modal, Popconfirm
} from "antd";
import {
    getAllDataSets,
    getIntelServiceById,
    getTrainInstances,
} from '../../../../api/intelligence';
import {trainStatus} from '../../../../constants/developer/intelligence-services/intel-service';
import TableWithSearch from '../../../../components/TableWithSearch';
import TrainForm from './TrainForm';
import downloadFile from '../../../../utils/downloadFile';

export default class TrainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            service: null,
            showModal: false,
            instances: [],
            dataSets: []
        };
    }

    async componentDidMount() {
        await this.getServiceInfo();
        await this.getTrainInstances();
        await this.getDataSets();
    }

    getServiceInfo = async() => {
        getIntelServiceById(localStorage.getItem('intelServiceId'),).then((r) => {
            this.setState({service: r});
        }).catch((err) => {
            console.log(err);
        });
    }

    getTrainInstances = async() => {
        getTrainInstances(localStorage.getItem('intelServiceId'),).then((r) => {
            this.setState({instances: r});
        }).catch((err) => {
            console.log(err);
        });
    }

    getDataSets = async() => {
        getAllDataSets().then((r) => {
            this.setState({dataSets: r});
        }).catch((err) => {
            console.log(err);
        });
    }

    getLastInstanceId = () => {
        const size = this.state.instances.length;
        if (size === 0) return null;
        return this.state.instances[size - 1].id;
    }

    onClose = () => {
        this.setState({
            showModal: false,
            showPublishModal: false,
            current: null
        });
    }

    onFresh = async () => {
        await this.getTrainInstances();
        this.onClose();
    }

    render() {
        const columns = [
            {
                title: '数据集',
                align: 'center',
                dataIndex: 'dataSetId',
                key: 'dataSetId',
                width: 150,
                render: (text, record) => {
                    const dataSet = this.state.dataSets.find((d) => d.id === record.dataSetId);
                    if (dataSet) {
                        return (
                        <span>{dataSet.name}</span>
                        );
                    }
                    return <div />;
                },
            },
            {
                title: '训练前模型',
                align: 'center',
                dataIndex: 'beforeFileId',
                key: 'beforeFileId',
                width: 200,
                render: (text, record) => (
                    <div>
                        {record.beforeFileId === null ? '暂无' : (
                            <Button
                                icon="download"
                                style={{ marginLeft: 5, borderColor: '#7b68ee', color: '#7b68ee' }}
                                type="primary"
                                ghost
                                onClick={() => downloadFile(record.beforeFileId)}
                            >
                                下载
                            </Button>
                        )}
                    </div>
                ),
            },
            {
                title: '训练后模型',
                align: 'center',
                dataIndex: 'trainedFileId',
                key: 'trainedFileId',
                width: 200,
                render: (text, record) => (
                    <div>
                    {record.trainedFileId === null ? '暂无' : (
                        <Button
                            icon="download"
                            style={{ marginLeft: 5, borderColor: '#7b68ee', color: '#7b68ee' }}
                            type="primary"
                            ghost
                            onClick={() => downloadFile(record.trainedFileId)}
                        >
                            下载
                        </Button>
                        )}
                    </div>
                ),
            },
            {
                title: '训练版本',
                align: 'center',
                dataIndex: 'version',
                key: 'version',
                width: 100,
                render: (text, record) => (
                    <span>{record.version}</span>
                ),
            },
            {
                title: '状态',
                align: 'center',
                dataIndex: 'status',
                key: 'status',
                width: 100,
                render: (text, record) => (
                    <span>{trainStatus[record.status]}</span>
                ),
            },
            {
                title: '开始时间',
                align: 'center',
                dataIndex: 'startTime',
                key: 'startTime',
                width: 150,
                render: (text, record) => (
                    <span>{record.startTime}</span>
                ),
            },
            {
                title: '结束时间',
                align: 'center',
                dataIndex: 'endTime',
                key: 'endTime',
                width: 150,
                render: (text, record) => (
                    <span>{record.endTime}</span>
                ),
            },
        ];
        return (
            <div>
                <Button type="primary" onClick={() => this.setState({showModal: true})} style={{marginBottom: '10px'}} icon="plus">进行新一轮训练</Button>
                <Card>
                    <div className="panelSpan" style={{margin: '10px'}}>智能服务训练情况</div>
                    <TableWithSearch rowKey="id" dataSource={this.state.instances} columns={columns} size="middle" bordered />
                </Card>
                <Modal visible={this.state.showModal} title="设置训练参数" destroyOnClose footer={null} onCancel={this.onClose}>
                    <TrainForm onClose={this.onClose} onFresh={this.onFresh} current={this.state.service} dataSets={this.state.dataSets} lastInstanceId={this.getLastInstanceId()} />
                </Modal>
            </div>
        );
    }
}
