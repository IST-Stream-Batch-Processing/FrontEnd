import React from 'react';
import {withRouter} from 'react-router-dom';
import {
    Button, Card, Divider, Icon, Input, Modal, Popconfirm, Row, Select, Table, Tag, TreeSelect, Upload, message, Col
} from 'antd';
import {
    getDateItem, newDataItem, getTableInfo, updateDataItem, deleteDataItem, getDisplay, conditionQuery
} from '../../../api/data';
import {getTableId} from '../../../utils/token';
import downloadFile from '../../../utils/downloadFile';
import history from '../../../utils/history';
import '../../../css/dataItem.css';
import ConditionTree from '../../../components/query/ConditionTree';
import {queryTypes} from '../../../constants/query';

const {TreeNode} = TreeSelect;

class dataItem extends React.Component {
    constructor() {
        super();
        this.state = {
            dataSource: [{}, {}],
            keys: [],
            relationKey: [],
            window: false,
            field: [],
            newItems: {},
            relationType: {},
            indexWindow: false,
            selections: [[], []],
            displayNames: {},
            tableName: '',
            isSearched: false,
            itemId: 0,
            queryCondition: null,
        };
    }

    async componentDidMount() {
        await this.getDataModel();
    }

    getDataModel = async () => {
        try {
            await getDateItem(getTableId()).then(r => {
                this.setState({
                    dataSource: r,
                });
            });
            await getTableInfo(getTableId()).then(r => {
                let infoR = r.fieldRelation;
                if (infoR == null) infoR = [];
                const tem = {};
                const temt = {};
                let temS = {};
                let temD = {};
                infoR.forEach((item, index) => {
                    if (item.type === 'single') {
                        temt[item.relationName] = 'single';
                        tem[item.relationName] = '';
                    } else {
                        temt[item.relationName] = 'multiple';
                        tem[item.relationName] = [];
                    }
                    getDisplay(item.tableId).then(t => {
                        temD = this.state.displayNames;
                        temS = this.state.selections;
                        temS[index] = t;
                        if (t.length > 0)temD[item.relationName] = Object.keys(t[0])[1];
                        this.setState({
                            selections: temS,
                            displayNames: temD,
                        });
                    });
                });
                this.setState({
                    keys: r.fieldProperty,
                    relationKey: infoR,
                    newItems: tem,
                    relationType: temt,
                    tableName: r.tableName,
                    builtIn: r.builtIn,
                });
            });
        } catch (err) {
            console.error(err);
        }
    }

    newWindow = (i, relation) => {
        const relationInfo = this.state.relationKey.find((item) => item.relationName === relation);
        history.push({
            pathname: '/developer/relation',
            state: {item: i.id, name: relation, relationTableId: relationInfo.tableId}
        });
    }

    showWindow = () => {
        this.setState({
            window: true,
        });
    }

    showWindowEdit = (id) => {
        const { dataSource } = this.state;
        const item = dataSource.find((i) => i.id === id);
        const field = [];
        Object.keys(item).forEach(key => {
            if (key !== 'id') field.push(item[key]);
        });
        this.setState({
            window: true,
            editIndex: id,
            field,
            indexWindow: true
        });
    }

    closeWindow = () => {
        const {field} = this.state;
        for (let i = 0; i < field.length; i += 1) {
            field[i] = '';
        }
        this.setState({
            window: false,
            indexWindow: false,
            field
        });
    }

    addButton = () => {
        if (!this.state.builtIn) {
            return (
              <Button type="primary" icon="plus" style={{marginBottom: 10}} onClick={this.showWindow}>添加数据</Button>
            );
        }
        return null;
    }

    update = async () => {
        const tem = {};
        const {keys} = this.state;
        const {newItems} = this.state;
        for (let i = 0; i < keys.length; i += 1) {
            tem[keys[i].fieldName] = this.state.field[i];
        }
        // eslint-disable-next-line no-restricted-syntax
        for (const key in newItems) {
            if (newItems[key] === '') delete newItems[key];
        }
        this.setState({
            newItems,
        });
        const result = Object.assign(tem, newItems);
        // 转为表单格式的数据
        const formdata = new FormData();
        Object.keys(result).forEach((i) => {
            formdata.append(i, result[i]);
        });
        try {
            if (this.state.indexWindow) {
                formdata.append('id', this.state.editIndex);
                await updateDataItem(getTableId(), formdata);
            } else {
                await newDataItem(getTableId(), formdata);
            }
        } catch (e) {
            console.error(e);
        }
        this.setState({
            window: false,
            indexWindow: false,
            field: [],
        });
        await this.getDataModel();
    }

    delete = async (id) => {
        await deleteDataItem(getTableId(), parseInt(id, 10));
        await this.getDataModel();
    }

    relationButton = (i, k) => (
        <>
            <Button style={{marginLeft: 5, marginTop: 5}} onClick={this.newWindow.bind(this, i, k)}>展示详情</Button>
        </>
    )

    showTag = (i) => {
        if (this.state.newItems[i] === '') return null;
        return (
            <Tag>
                {this.state.newItems[i]}
            </Tag>
        );
    }

    selectRelation = (i, index) => {
        const {Option} = Select;
        const {selections} = this.state;
        const {displayNames} = this.state;
        const display = displayNames[i];
        const {newItems} = this.state;
        if (this.state.relationType[i] === 'single') {
            return (
                <>
                    <div style={{marginTop: 15}}>{i}</div>
                    <Select
                        style={{width: 400}}
                        value={newItems[i]}
                        onChange={(e) => {
                            newItems[i] = e;
                            this.setState({newItems});
                        }}
                    >
                        {selections[index].map(item => (
                            <Option value={item.id}>{item[display]}</Option>
                        ))}
                    </Select>
                </>
            );
        }
        return (
            <>
                <div style={{marginTop: 15}}>{i}</div>
                <Select
                    mode="multiple"
                    allowClear
                    style={{width: 400}}
                    defaultValue={[]}
                    onChange={(e) => {
                        newItems[i] = e;
                        this.setState({newItems});
                    }}
                >
                    {selections[index].map(item => (
                        <Option value={item.id}>{item[display]}</Option>
                    ))}
                </Select>
            </>
        );
    }

    search = () => {
        const data = {
            tableId: getTableId(),
            tableName: this.state.tableName,
            queryCondition: this.state.reversedCondition || null,
        };
        conditionQuery(data).then(r => {
            this.setState({
                dataSource: r,
                isSearched: true,
            });
        }).catch(err => {
            console.error(err);
            this.clearSearch();
        });
    }

    clearSearch = () => {
        this.getDataModel().then(() => {
            this.setState({
                isSearched: false,
            });
        });
    }

    renderKeys = (keys) => keys.map((item, index) => (
          <TreeNode
            title={item.fieldName}
            key={item.fieldName + index}
            value={item.fieldName}
          />
        ))

    setDefaultTarget = (condition) => (condition ? condition.fieldName : null);

    chooseTarget = (fieldName) => ({fieldName})

    onChange = (value) => {
        this.setState({
            queryCondition: value,
            reversedCondition: this.dataFormatConversion(value)
        });
    }

    dataFormatConversion = (data) => {
        if (!data) return null;
        return {
            ...data.condition,
            queryType: data.condition ? data.condition.operator : null,
            left: this.dataFormatConversion(data.left),
            right: this.dataFormatConversion(data.right),
            logicType: data.logicType,
        };
    }

    render() {
        const columns = [];
        const rowIndex = {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
        };
        columns.push(rowIndex);
        this.state.keys.forEach(k => {
            const name = k.fieldName;
            const row = {
                title: name,
                dataIndex: name,
                key: name,
                align: 'center',
                render: (text) => {
                    if (k.fieldType === 'File') {
                        return <Button icon="download" onClick={() => downloadFile(text)}>下载文件</Button>;
                    }
                    return <>{text}</>;
                }
            };
            if (name !== 'id') columns.push(row);
        });
        this.state.relationKey.forEach(key => {
            const row = {
                title: key.relationName,
                key: key.relationName,
                align: 'center',
                render: (text) => (
                    <>
                        {this.relationButton(text, key.relationName)}
                    </>
                ),
            };
            columns.push(row);
        });
        const rowOperation = {
            title: '操作',
            align: 'center',
            key: 'action',
            width: '20%',
            render: (text) => (
                <>
                    <Button
                      icon="edit"
                      type="primary"
                      ghost
                      onClick={k => {
                            k.preventDefault();
                            this.showWindowEdit(text.id);
                      }}
                    >
                        修改
                    </Button>
                    <Popconfirm
                      title="确定删除吗"
                      onConfirm={() => this.delete(text.id)}
                      okText="Yes"
                      cancelText="No"
                      type="error"
                    >
                        <Button icon="delete" type="danger" ghost style={{marginLeft: '5px' }}>
                            删除
                        </Button>
                    </Popconfirm>
                </>
            ),
        };
        if (!this.state.builtIn) columns.push(rowOperation);
        return (
            <>
                {this.addButton()}
                <Card>
                        <Row type="flex" justify="end" align="middle">
                            <Col span={12}>
                            <ConditionTree
                              key={this.state.keys}
                              targets={this.state.keys}
                              data={this.state.queryCondition}
                              chooseTarget={(value) => this.chooseTarget(value)}
                              setDefaultTarget={(value) => this.setDefaultTarget(value)}
                              renderTargets={(value) => this.renderKeys(value)}
                              onChange={(value) => this.onChange(value)}
                              operators={queryTypes}
                              editable
                              displayable
                            />
                            </Col>
                            <Col span={12} align="right">
                                { this.state.isSearched ? (
                                  <Button size="small" icon="undo" type="primary" style={{marginTop: 20}} onClick={this.clearSearch}>
                                      还原
                                  </Button>
                                ) : (
                                  <Button size="small" icon="zoom-in" type="primary" style={{marginTop: 20}} onClick={() => this.search()}>
                                      查询
                                  </Button>
                                )}
                            </Col>
                        </Row>
                    <Divider />
                    <div className="panelSpan" style={{margin: '10px'}}>数据表</div>
                    <Table bordered columns={columns} dataSource={this.state.dataSource} pagination={false} rowKey="id" />
                    <Modal
                        title="数据项信息"
                        visible={this.state.window}
                        onOk={this.update}
                        onCancel={this.closeWindow}
                        destroyOnClose
                    >
                        {this.state.keys.map((item, index) => (
                          <>
                              <div style={{marginBottom: 2}} key={index.toString()}>{`${item.fieldName} :`}</div>
                              {
                                  item.fieldType === 'File' ? (
                                    <Upload
                                      beforeUpload={
                                        file => {
                                            const {field} = this.state;
                                            field[index] = file;
                                            this.setState({
                                                field
                                            });
                                        }
                                    }
                                    >
                                      <Button>
                                          <Icon type="upload" />
                                            上传文件
                                      </Button>
                                    </Upload>
                                  ) : (
                                    <Input
                                    style={{marginBottom: 15}}
                                    value={this.state.field[index]}
                                    onChange={(e) => {
                                        const {field} = this.state;
                                        field[index] = e.target.value;
                                        this.setState({
                                            field
                                        });
                                    }}
                                    />
                                    )
                              }
                          </>
                        ))}
                        {this.state.relationKey.map((item, index) => (
                            <>
                                {this.selectRelation(item.relationName, index)}
                            </>
                        ))}
                    </Modal>
                </Card>
            </>
        );
    }
}

export default withRouter(dataItem);
