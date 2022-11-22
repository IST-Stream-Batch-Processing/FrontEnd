import React from 'react';
import {
    Button,
    Card, message, Modal, Popconfirm, Table,
}
    from 'antd';
import { withRouter } from 'react-router-dom';
import {
    getData, publish, unpublish, deleteDataModel
} from '../../../api/data';
import { setTableId } from '../../../utils/token';
import history from '../../../utils/history';

class dataModel extends React.Component {
    constructor() {
        super();
        this.state = {
            dataSource: [{}, {}],
            propertyWindow: false,
            relationWindow: false,
            currentDataSource: null
        };
    }

    getDataModel = () => {
        try {
            getData().then(r => {
                this.setState({
                    dataSource: r,
                });
            });
        } catch (err) {
            console.error(err);
        }
    }

    detail = (i) => {
        setTableId(i);
        history.push({
            pathname: '/developer/dataItem',
        });
    }

    edit = (i) => {
        setTableId(i);
        history.push({
            pathname: '/developer/editData',
        });
    }

    javaClass = (i) => {
        setTableId(i.id);
        history.push({
            pathname: '/developer/model',
        });
    }

    isPublished = (e, i) => {
        if (e || e == null) {
            return (
                <>
                    <Button
                        icon="project"
                        style={{ marginLeft: 5, borderColor: '#f6b529', color: '#f6b529' }}
                        type="primary"
                        ghost
                        onClick={k => {
                            k.preventDefault();
                            this.unpublish(i.id);
                        }}
                    >
                        取消发布
                    </Button>
                    <Button icon="appstore" style={{ marginLeft: 5, borderColor: '#60ae73', color: '#60ae73' }} type="primary" ghost onClick={t => { t.preventDefault(); this.detail(i.id); }}>查看数据库</Button>
                </>
            );
        }
        return (
            <>
                <Button
                    icon="project"
                    style={{ marginLeft: 5, borderColor: '#f67e29', color: '#f67e29' }}
                    type="primary"
                    ghost
                    onClick={k => {
                        k.preventDefault();
                        this.publish(i.id);
                    }}
                >
                    发布
                </Button>
                <Button icon="edit" style={{ marginLeft: 5 }} type="primary" ghost onClick={t => { t.preventDefault(); this.edit(i.id); }}>修改</Button>
            </>
        );
    }

    publish = async (id) => {
        try {
            await publish(id);
            message.success('发布成功');
            this.getDataModel();
        } catch (err) {
            console.error(err);
        }
    }

    unpublish = async (id) => {
        try {
            await unpublish(id);
            message.success('取消发布成功');
            this.getDataModel();
        } catch (err) {
            console.error(err);
        }
    }

    deleteDataModel = async (i) => {
        try {
            await deleteDataModel(i.id);
            message.success('删除成功');
            this.getDataModel();
        } catch (err) {
            console.error(err);
        }
    }

    componentDidMount() {
        this.getDataModel();
    }

    showWindowP = (e) => {
        this.setState((prev) => ({
            propertyWindow: true,
            currentDataSource: prev.dataSource.length > 0 ? prev.dataSource.find(item => item.id === e) : null
        }));
    }

    showWindowR = (e) => {
        this.setState((prev) => ({
            relationWindow: true,
            currentDataSource: prev.dataSource.length > 0 ? prev.dataSource.find(item => item.id === e) : null
        }));
    }

    closeWindow = () => {
        this.setState({
            propertyWindow: false,
            relationWindow: false
        });
    }

    newData = () => {
        history.push({
            pathname: '/developer/createData',
        });
    }

    render() {
        const { dataSource } = this.state;
        const columnsP = [
            {
                title: '列名',
                dataIndex: 'fieldName',
                key: 'fieldName',
                align: 'center',
            },
            {
                title: '数据类型',
                dataIndex: 'fieldType',
                key: 'fieldType',
                align: 'center',
            },
            {
                title: '默认值',
                dataIndex: 'defaultValue',
                key: 'defaultValue',
                align: 'center',
                render: (record) => (
                    <div>
                        {record ? record.toString() : ''}
                    </div>
                ),
            }
        ];
        const columnsR = [
            {
                title: '关联名称',
                dataIndex: 'relationName',
                key: 'relationName',
                align: 'center',
            },
            {
                title: '中间表名',
                dataIndex: 'tableName',
                key: 'tableName',
                align: 'center',
            },
            {
                title: '关联类型',
                dataIndex: 'type',
                key: 'type',
                align: 'center',
            },
        ];
        const columns = [
            {
                title: '表名',
                dataIndex: 'tableName',
                key: 'tableName',
                align: 'center',
                width: '25%'
            },
            {
                title: '详情',
                dataIndex: 'detail',
                key: 'detail',
                align: 'center',
                width: '40%',
                render: (detail, text, index) => (
                    <>
                        <Button icon="tags" onClick={this.showWindowP.bind(this, text.id)}>属性详情</Button>
                        <Button icon="control" style={{ marginLeft: 5 }} onClick={this.showWindowR.bind(this, text.id)}>关联详情</Button>
                        <Button icon="unordered-list" style={{ marginLeft: 5 }} onClick={t => { t.preventDefault(); this.javaClass(text); }}>查看JAVA类</Button>
                    </>
                )
            },
            {
                title: '操作',
                dataIndex: 'published',
                key: 'published',
                align: 'center',
                width: '45%',
                render: (published, id) => (
                    <>
                        {this.isPublished(published, id)}
                        <Popconfirm
                            title="确定删除吗"
                            okText="Yes"
                            cancelText="No"
                            type="error"
                            onConfirm={() => this.deleteDataModel(id)}
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
            <>
                <Button onClick={this.newData} type="primary" icon="plus" style={{ marginBottom: '10px' }}>新建数据模型</Button>
                <Card>
                    <div className="panelSpan" style={{ margin: '10px' }}>数据源列表</div>
                    <Table
                        bordered
                        columns={columns}
                        dataSource={dataSource}
                        rowKey="id"
                    />
                </Card>
                <Modal
                    title="属性信息"
                    visible={this.state.propertyWindow}
                    onOk={this.closeWindow}
                    onCancel={this.closeWindow}
                    footer={null}
                >
                    <Table rowKey="fieldName" style={{marginBottom: '10px'}} columns={columnsP} dataSource={this.state.currentDataSource ? this.state.currentDataSource.fieldProperty : []} pagination={false} />
                </Modal>
                <Modal
                    title="关联信息"
                    visible={this.state.relationWindow}
                    onOk={this.closeWindow}
                    onCancel={this.closeWindow}
                    footer={null}
                >
                    <Table rowKey="relationName" style={{marginBottom: '10px'}} columns={columnsR} dataSource={this.state.currentDataSource ? this.state.currentDataSource.fieldRelation : []} pagination={false} />
                </Modal>
            </>
        );
    }
}

export default withRouter(dataModel);
