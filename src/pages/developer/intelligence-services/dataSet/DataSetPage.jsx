import {withRouter} from 'react-router-dom';
import {
    Button, Card, Cascader, Form, Icon, Input, message, Modal, Popconfirm, Table, Upload
} from 'antd';
import React from 'react';
import {
    CloudUploadOutlined,
} from "@ant-design/icons";
import {
    deleteDataSet,
    getAllDataSets, updateDataSet, uploadDataSet
} from '../../../../api/intelligence';
import downloadFile from '../../../../utils/downloadFile';

const typeOptions = [
    {value: 'cluster', label: '聚类算法'}
];

class DataSetPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            dataSource: [],
            currentId: null,
            dataSetName: null,
            description: '',
            file: null
        };
    }

    transformType =(type) => {
        const kv = typeOptions.find((x) => x.value === type);
        return kv.label;
    }

    getData = () => {
        getAllDataSets().then(r => {
            this.setState({
                dataSource: r
            });
        });
    }

    componentDidMount() {
        this.getData();
    }

    cancelModal =() => {
        this.setState({
            showModal: false,
            currentId: null,
            dataSetName: null,
            description: '',
            type: null,
            file: null
        });
    }

    uploadDataSet =() => {
        if (!this.state.dataSetName || this.state.dataSetName === '' || !this.state.file) {
            message.error("输入信息不完整！");
        } else {
            const form = new FormData();
            form.append('name', this.state.dataSetName);
            form.append('description', this.state.description);
            form.append('type', this.state.type);
            form.append('file', this.state.file);
            if (!this.state.currentId) {
                uploadDataSet(form).then(() => {
                    this.cancelModal();
                    this.getData();
                    message.success('数据集上传成功');
                });
            } else {
                updateDataSet(this.state.currentId, form).then(() => {
                    this.cancelModal();
                    this.getData();
                    message.success('数据集修改成功');
                });
            }
            this.cancelModal();
        }
    }

    deleteDataSet =(id) => {
        deleteDataSet(id).then(() => {
            message.success('删除成功');
            this.getData();
        });
    }

    renderEditModal =() => (
            <div>
                <Modal
                    title={this.state.currentId ? '编辑数据集' : '新增数据集'}
                    visible={this.state.showModal}
                    onCancel={this.cancelModal}
                    onOk={this.uploadDataSet}
                    destroyOnClose
                >
                    <Form>
                        <Form.Item label="数据集名" rules={[{required: true, message: '请输入数据集名称'}]}>
                            <Input
                                value={this.state.dataSetName}
                                onChange={(e) => {
                                    this.setState({dataSetName: e.target.value});
                                }}
                            />
                        </Form.Item>
                        <Form.Item label="数据集描述">
                            <Input
                                value={this.state.description}
                                onChange={(e) => {
                                    this.setState({description: e.target.value});
                                }}
                            />
                        </Form.Item>
                        数据集类型:
                        <br />
                        <br />
                        <Cascader
                            placeholder="请选择数据集类型"
                            defaultValue={[this.state.type]}
                            onChange={(values) => {
                                this.setState({type: values[0]});
                            }}
                            options={typeOptions}
                        />
                        <br />
                        <br />
                        <Form.Item>
                            <input
                                type="file"
                                accept=".*"
                                onChange={(e) => {
                                    this.setState({
                                        file: e.target.files[0]
                                    });
                                }}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )

    renderDataSetList =() => {
        const columns = [
            {
                title: '数据集名',
                dataIndex: 'name',
                key: 'name',
                align: 'center',
                width: '25%'
            },
            {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
                align: 'center',
                width: '25%',
            },
            {
                title: '类型',
                dataIndex: 'type',
                key: 'type',
                align: 'center',
                width: '25%',
                render: (type) => (
                    this.transformType(type)
                )
            },
            {
                title: '操作',
                dataIndex: 'fileId',
                key: 'fileId',
                align: 'center',
                width: '90%',
                render: (fileId, dataSet) => (
                    <>
                        <Button
                            icon="download"
                            style={{ marginLeft: 5, borderColor: '#7b68ee', color: '#7b68ee' }}
                            type="primary"
                            ghost
                            onClick={() => downloadFile(dataSet.fileId)}
                        >
                            下载
                        </Button>
                        <Button
                            icon="project"
                            style={{ marginLeft: 5, borderColor: '#f6b529', color: '#f6b529' }}
                            type="primary"
                            ghost
                            onClick={k => {
                                k.preventDefault();
                                this.setState({
                                    currentId: dataSet.id,
                                    dataSetName: dataSet.name,
                                    description: dataSet.description,
                                    file: null,
                                    type: dataSet.type,
                                    showModal: true
                                });
                            }}
                        >
                            编辑
                        </Button>
                        <Popconfirm
                            title="确定删除吗"
                            okText="Yes"
                            cancelText="No"
                            type="error"
                            onConfirm={() => this.deleteDataSet(dataSet.id)}
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
            <Card>
                <div className="panelSpan" style={{ margin: '10px' }}>数据集列表</div>
                <Table
                    bordered
                    columns={columns}
                    dataSource={this.state.dataSource}
                    rowKey="id"
                />
            </Card>
        );
    }

    render() {
        return (
            <div>
                <Button
                    type="primary"
                    onClick={() => {
                        this.setState({
                            showModal: true
                        });
                    }}
                    style={{marginBottom: '10px'}}
                >
                    <CloudUploadOutlined />
                    上传数据集
                </Button>
                {this.renderEditModal()}
                {this.renderDataSetList()}
            </div>
        );
    }
}

export default withRouter(DataSetPage);
