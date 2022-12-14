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
                message.error('???????????????');
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
                message.error('???????????????');
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
                message.error('???????????????');
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
                message.error('???????????????');
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
            message.error('??????????????????');
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
            message.success('????????????');
            history.push('/developer/dataModel');
        } catch (err) {
            console.error(err);
        }
    }

    render() {
        const { Option } = Select;
        const columnsP = [
            {
                title: '??????',
                dataIndex: 'fieldName',
                key: 'name',
                width: '30%',
                align: 'center',
            },
            {
                title: '????????????',
                dataIndex: 'fieldType',
                key: 'type',
                width: '25%',
                align: 'center',
            },
            {
                title: '?????????',
                dataIndex: 'defaultValue',
                key: 'defaultValue',
                width: '25%',
                align: 'center',
            },
            {
                title: '??????',
                key: 'action',
                width: '20%',
                align: 'center',
                render: (text) => (
                  <>
                      <Button type="primary" ghost icon="edit" onClick={() => this.updateProperty(text.fieldName)}>
                          ??????
                      </Button>
                      <Popconfirm
                        title="???????????????"
                        okText="Yes"
                        cancelText="No"
                        type="error"
                        onConfirm={() => this.deleteProperty(text.fieldName)}
                      >
                          <Button icon="delete" type="danger" ghost style={{marginLeft: '5px' }}>
                              ??????
                          </Button>
                      </Popconfirm>
                  </>
                )
            },
        ];
        const columnsR = [
            {
                title: '????????????',
                dataIndex: 'relationName',
                key: 'relationName',
                width: '30%',
                align: 'center',
            },
            {
                title: '???????????????',
                dataIndex: 'relatedTableName',
                key: 'relatedTableName',
                width: '25%',
                align: 'center',
            },
            {
                title: '????????????',
                dataIndex: 'type',
                key: 'type',
                width: '25%',
                align: 'center',
            },
            {
                title: '??????',
                key: 'action',
                width: '20%',
                align: 'center',
                render: (text) => (
                  <>
                      <Button type="primary" ghost icon="edit" onClick={() => this.updateRelation(text.relationName)}>
                          ??????
                      </Button>
                      <Popconfirm
                        title="???????????????"
                        okText="Yes"
                        cancelText="No"
                        type="error"
                        onConfirm={() => this.deleteRelation(text.relationName)}
                      >
                          <Button icon="delete" type="danger" ghost style={{marginLeft: '5px' }}>
                              ??????
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
                          placeholder="??????"
                          value={this.state.tableName}
                          onChange={(e) => this.setState({tableName: e.target.value})}
                        />
                    </Row>
                    <Row style={{marginBottom: '10px'}}>
                        <Input
                          style={{width: '40%'}}
                          placeholder="??????"
                          value={this.state.detail}
                          onChange={(e) => this.setState({detail: e.target.value})}
                        />
                    </Row>
                    <Row style={{marginBottom: '15px'}}>
                        <Select placeholder="?????????" style={{width: '40%'}} value={this.state.display} onChange={(e) => this.setState({display: e})}>
                        {this.state.fieldProperty.map((item, index) => (
                            <Option value={item.fieldName} key={item.fieldName}>{item.fieldName}</Option>
                        ))}
                        </Select>
                    </Row>
                    <Row style={{marginBottom: '5px'}}>
                        <Col>
                            <Button type="primary" icon="plus" onClick={this.addProperty}>????????????</Button>
                        </Col>
                    </Row>
                    <Row style={{marginBottom: '15px'}}>
                        <Table bordered size="middle" dataSource={this.state.fieldProperty} columns={columnsP} rowKey="fieldName" />
                    </Row>
                    <Row style={{marginBottom: '5px'}}>
                        <Button type="primary" icon="plus" onClick={this.addRelation}>????????????</Button>
                    </Row>
                    <Row style={{marginBottom: '15px'}}>
                        <Table bordered size="middle" dataSource={this.state.fieldRelation} columns={columnsR} rowKey="relationName" />
                    </Row>
                    <Row type="flex" justify="center">
                        <Button type="primary" onClick={this.submit}>??????</Button>
                    </Row>
                    <Modal title="??????" visible={this.state.propertyWindow} onOk={this.savePropertyP} onCancel={this.closeWindow} destroyOnClose>
                        <Input style={{width: 400}} placeholder="??????" value={this.state.fieldName} onChange={(e) => this.setState({fieldName: e.target.value})} />
                        <Select
                            placeholder="????????????"
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
                            <Input style={{width: 400, marginTop: 15}} placeholder="?????????" value={this.state.defaultValue} onChange={(e) => this.setState({defaultValue: e.target.value})} />
                        }
                    </Modal>
                    <Modal title="??????" visible={this.state.relationWindow} onOk={this.savePropertyR} onCancel={this.closeWindow} destroyOnClose>
                        <Input placeholder="????????????" style={{ width: 400}} value={this.state.relationName} onChange={(e) => this.setState({relationName: e.target.value})} />
                        <Radio.Group style={{ marginTop: 15}} value={this.state.builtIn} onChange={(e) => this.setState({builtIn: e.target.value, tableId: undefined})}>
                            <Radio.Button value key="true">????????????</Radio.Button>
                            <Radio.Button value={false} key="false">???????????????</Radio.Button>
                        </Radio.Group>
                        <Select placeholder="?????????" style={{ width: 400, marginTop: 15}} defaultValue="true" value={this.state.tableId} onChange={(e) => this.setState({tableId: e})}>
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
                        <Select placeholder="????????????" style={{ width: 400, marginTop: 15}} defaultValue="true" value={this.state.type} onChange={(e) => this.setState({type: e})}>
                            <Option value="single" key="single">??????</Option>
                            <Option value="multiple" key="multiple">??????</Option>
                        </Select>
                    </Modal>
                </Card>
            </>
        );
    }
}

export default withRouter(NewData);
