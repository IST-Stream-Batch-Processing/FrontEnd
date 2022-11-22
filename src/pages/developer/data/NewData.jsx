import React from 'react';
import {
    Button, Card, Col, Input, message, Modal, Popconfirm, Radio, Row, Select, Table
} from 'antd';
import {withRouter} from 'react-router-dom';
import history from '../../../utils/history';
import {getData, newData} from '../../../api/data';

class NewData extends React.Component {
    constructor() {
        super();
        this.state = {
            dataSource: [{}, {}],
            propertyWindow: false,
            relationWindow: false,
            fieldProperty: [],
            fieldRelation: [],
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

    componentDidMount() {
        this.getDataModel();
    }

    addProperty=() => {
        this.setState({
            oldFieldName: null,
            fieldName: '',
            fieldType: undefined,
            defaultValue: null,
            propertyWindow: true,
        });
    }

    updateProperty = (fieldName) => {
        const {fieldProperty} = this.state;
        const field = fieldProperty.find((item) => item.fieldName === fieldName);
        this.setState({
            oldFieldName: fieldName,
            fieldName: field.fieldName,
            fieldType: field.fieldType,
            defaultValue: field.defaultValue,
            propertyWindow: true,
        });
    }

    deleteProperty = (fieldName) => {
        if (fieldName === this.state.display) {
            this.setState({
                display: null
            });
        }
        this.setState((prev) => ({
            fieldProperty: prev.fieldProperty.filter((item) => item.fieldName !== fieldName)
        }));
    }

    addRelation=() => {
        this.setState({
            oldRelationName: null,
            relationName: '',
            tableId: undefined,
            type: undefined,
            builtIn: false,
            relationWindow: true,
        });
    }

    updateRelation = (relationName) => {
        const {fieldRelation} = this.state;
        const relation = fieldRelation.find((item) => item.relationName === relationName);
        this.setState({
            oldRelationName: relationName,
            relationName,
            tableId: relation.tableId,
            type: relation.type,
            builtIn: relation.builtIn,
            relationWindow: true,
        });
    }

    deleteRelation = (relationName) => {
        this.setState((prev) => ({
            fieldRelation: prev.fieldRelation.filter((item) => item.relationName !== relationName)
        }));
    }

    closeWindow=() => {
        this.setState({
            propertyWindow: false,
        });
        this.setState({
            relationWindow: false,
        });
    }

    savePropertyP=() => {
        const {
         oldFieldName, fieldName, fieldType, defaultValue
        } = this.state;
        let {fieldProperty} = this.state;
        const duplicate = fieldProperty.find((item) => item.fieldName === fieldName);
        if (oldFieldName) {
            if (duplicate && fieldName !== oldFieldName) {
                message.error('属性名重复');
                return;
            }
            if (oldFieldName !== fieldName && oldFieldName === this.state.display) {
                this.setState({
                    display: null
                });
            }
            fieldProperty = fieldProperty.map((item) => {
                if (item.fieldName === oldFieldName) {
                    return {
                        fieldName,
                        fieldType,
                        defaultValue
                    };
                }
                return item;
            });
        } else {
            if (duplicate) {
                message.error('属性名重复');
                return;
            }
            fieldProperty.push({
                fieldName,
                fieldType,
                defaultValue
            });
        }
        this.setState({
            fieldProperty,
            propertyWindow: false,
        });
    }

    savePropertyR=() => {
        const {
            oldRelationName, relationName, tableId, type, builtIn, dataSource
        } = this.state;
        let {fieldRelation} = this.state;
        const data = dataSource.find((item) => item.id === tableId);
        const relatedTableName = data ? data.tableName : '';
        const duplicate = fieldRelation.find((item) => item.relationName === relationName);
        if (oldRelationName) {
            if (duplicate && oldRelationName !== relationName) {
                message.error('关系名重复');
                return;
            }
            fieldRelation = fieldRelation.map((item) => {
                if (item.relationName === oldRelationName) {
                    return {
                        relationName, tableId, type, builtIn, relatedTableName
                    };
                }
                return item;
            });
        } else {
            if (duplicate) {
                message.error('关系名重复');
                return;
            }
            fieldRelation.push({
                relationName, tableId, type, builtIn, relatedTableName
            });
        }
        this.setState({
            fieldRelation,
            relationWindow: false,
        });
    }

    submit=async () => {
        if (!this.state.display) {
            message.error('请选择展示名');
            return;
        }
        const data = {};
        data.tableName = this.state.tableName;
        data.fieldProperty = this.state.fieldProperty;
        data.fieldRelation = this.state.fieldRelation;
        data.detail = this.state.detail;
        data.display = this.state.fieldProperty.find((item) => item.fieldName === this.state.display);
        try {
            await newData(data);
            message.success('创建成功');
            history.push('/developer/dataModel');
        } catch (err) {
            console.error(err);
        }
    }

    render() {
        const { Option } = Select;
        const columnsP = [
            {
                title: '列名',
                dataIndex: 'fieldName',
                key: 'name',
                width: '30%',
                align: 'center',
            },
            {
                title: '数据类型',
                dataIndex: 'fieldType',
                key: 'type',
                width: '25%',
                align: 'center',
            },
            {
                title: '默认值',
                dataIndex: 'defaultValue',
                key: 'defaultValue',
                width: '25%',
                align: 'center',
            },
            {
                title: '操作',
                key: 'action',
                width: '20%',
                align: 'center',
                render: (text) => (
                  <>
                      <Button type="primary" ghost icon="edit" onClick={() => this.updateProperty(text.fieldName)}>
                          修改
                      </Button>
                      <Popconfirm
                        title="确定删除吗"
                        okText="Yes"
                        cancelText="No"
                        type="error"
                        onConfirm={() => this.deleteProperty(text.fieldName)}
                      >
                          <Button icon="delete" type="danger" ghost style={{marginLeft: '5px' }}>
                              删除
                          </Button>
                      </Popconfirm>
                  </>
                )
            },
        ];
        const columnsR = [
            {
                title: '关联名称',
                dataIndex: 'relationName',
                key: 'relationName',
                width: '30%',
                align: 'center',
            },
            {
                title: '关联表名称',
                dataIndex: 'relatedTableName',
                key: 'relatedTableName',
                width: '25%',
                align: 'center',
            },
            {
                title: '关联类型',
                dataIndex: 'type',
                key: 'type',
                width: '25%',
                align: 'center',
            },
            {
                title: '操作',
                key: 'action',
                width: '20%',
                align: 'center',
                render: (text) => (
                  <>
                      <Button type="primary" ghost icon="edit" onClick={() => this.updateRelation(text.relationName)}>
                          修改
                      </Button>
                      <Popconfirm
                        title="确定删除吗"
                        okText="Yes"
                        cancelText="No"
                        type="error"
                        onConfirm={() => this.deleteRelation(text.relationName)}
                      >
                          <Button icon="delete" type="danger" ghost style={{marginLeft: '5px' }}>
                              删除
                          </Button>
                      </Popconfirm>
                  </>
                )
            },
        ];
        return (
            <>
                <Card>
                    <Row style={{marginBottom: '10px'}}>
                        <Input
                          style={{width: '40%'}}
                          placeholder="表名"
                          value={this.state.tableName}
                          onChange={(e) => this.setState({tableName: e.target.value})}
                        />
                    </Row>
                    <Row style={{marginBottom: '10px'}}>
                        <Input
                          style={{width: '40%'}}
                          placeholder="简介"
                          value={this.state.detail}
                          onChange={(e) => this.setState({detail: e.target.value})}
                        />
                    </Row>
                    <Row style={{marginBottom: '15px'}}>
                        <Select placeholder="展示名" style={{width: '40%'}} value={this.state.display} onChange={(e) => this.setState({display: e})}>
                        {this.state.fieldProperty.map((item, index) => (
                            <Option value={item.fieldName} key={item.fieldName}>{item.fieldName}</Option>
                        ))}
                        </Select>
                    </Row>
                    <Row style={{marginBottom: '5px'}}>
                        <Col>
                            <Button type="primary" icon="plus" onClick={this.addProperty}>添加属性</Button>
                        </Col>
                    </Row>
                    <Row style={{marginBottom: '15px'}}>
                        <Table bordered size="middle" dataSource={this.state.fieldProperty} columns={columnsP} rowKey="fieldName" />
                    </Row>
                    <Row style={{marginBottom: '5px'}}>
                        <Button type="primary" icon="plus" onClick={this.addRelation}>添加关联</Button>
                    </Row>
                    <Row style={{marginBottom: '15px'}}>
                        <Table bordered size="middle" dataSource={this.state.fieldRelation} columns={columnsR} rowKey="relationName" />
                    </Row>
                    <Row type="flex" justify="center">
                        <Button type="primary" onClick={this.submit}>提交</Button>
                    </Row>
                    <Modal title="属性" visible={this.state.propertyWindow} onOk={this.savePropertyP} onCancel={this.closeWindow} destroyOnClose>
                        <Input style={{width: 400}} placeholder="列名" value={this.state.fieldName} onChange={(e) => this.setState({fieldName: e.target.value})} />
                        <Select
                            placeholder="数据类型"
                            style={{ width: 400, marginTop: 15}}
                            defaultValue="Int"
                            value={this.state.fieldType}
                            onChange={(e) => {
                                if (e === 'File') this.setState({defaultValue: null});
                                this.setState({fieldType: e});
                            }}
                        >
                            <Option value="Int" key="Int">Int</Option>
                            <Option value="Double" key="Double">Double</Option>
                            <Option value="string" key="string">String</Option>
                            <Option value="Char" key="Char">Char</Option>
                            <Option value="Bool" key="Bool">Bool</Option>
                            <Option value="File" key="File">File</Option>
                        </Select>
                        {
                            this.state.fieldType === 'File' ? null :
                            <Input style={{width: 400, marginTop: 15}} placeholder="默认值" value={this.state.defaultValue} onChange={(e) => this.setState({defaultValue: e.target.value})} />
                        }
                    </Modal>
                    <Modal title="关联" visible={this.state.relationWindow} onOk={this.savePropertyR} onCancel={this.closeWindow} destroyOnClose>
                        <Input placeholder="关联名称" style={{ width: 400}} value={this.state.relationName} onChange={(e) => this.setState({relationName: e.target.value})} />
                        <Radio.Group style={{ marginTop: 15}} value={this.state.builtIn} onChange={(e) => this.setState({builtIn: e.target.value, tableId: undefined})}>
                            <Radio.Button value key="true">内置数据</Radio.Button>
                            <Radio.Button value={false} key="false">自定义数据</Radio.Button>
                        </Radio.Group>
                        <Select placeholder="关联表" style={{ width: 400, marginTop: 15}} defaultValue="true" value={this.state.tableId} onChange={(e) => this.setState({tableId: e})}>
                            {this.state.dataSource.map(data => {
                                if (this.state.builtIn) {
                                    if (data.tableName === 'user') {
                                        return (
                                            <Option value={data.id} key={data.id}>{data.tableName}</Option>
                                        );
                                    }
                                    return null;
                                }
                                if (data.tableName !== 'user') {
                                    return (
                                        <Option value={data.id} key={data.id}>{data.tableName}</Option>
                                    );
                                }
                                return null;
                            })}
                        </Select>
                        <Select placeholder="关联类型" style={{ width: 400, marginTop: 15}} defaultValue="true" value={this.state.type} onChange={(e) => this.setState({type: e})}>
                            <Option value="single" key="single">单个</Option>
                            <Option value="multiple" key="multiple">多个</Option>
                        </Select>
                    </Modal>
                </Card>
            </>
        );
    }
}

export default withRouter(NewData);
