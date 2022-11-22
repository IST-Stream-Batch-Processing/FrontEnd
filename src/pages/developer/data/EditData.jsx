import React from 'react';
import {
  Button, Card, Col, Input, message, Modal, Popconfirm, Radio, Row, Select, Table
} from 'antd';
import {withRouter} from 'react-router-dom';
import history from '../../../utils/history';
import {getData, getTableInfo, updateTable} from '../../../api/data';
import {getTableId} from '../../../utils/token';

class EditData extends React.Component {
  constructor() {
    super();
    this.state = {
      dataSource: [{}, {}],
      // 已有的属性
      tableName: '',
      detail: '',
      display: '',
      fieldProperty: [],
      fieldRelation: [],
      // 记录更新操作
      propertyAction: [],
      relationAction: [],
      propertyActionType: 'ADD',
      relationActionType: 'ADD',
      newProperty: null,
      newRelation: null,
      oldProperty: null,
      oldRelation: null,
      // 控制modal
      propertyWindow: false,
      relationWindow: false,
      builtIn: false,
      canModifyRelation: true,
      canModifyProperty: true
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

  getDataInfo = () => {
    this.setState({
      loadingP: true,
      loadingR: true
    });
    try {
      getTableInfo(getTableId()).then(r => {
        this.setState({
          tableName: r.tableName,
          detail: r.detail || '',
          display: r.display.fieldName,
          fieldProperty: r.fieldProperty || [],
          fieldRelation: r.fieldRelation || [],
        });
      });
    } catch (err) {
      console.error(err);
    } finally {
      this.setState({
        loadingP: false,
        loadingR: false
      });
    }
  }

  componentDidMount() {
    this.getDataModel();
    this.getDataInfo();
  }

  addProperty = () => {
    this.setState({
      propertyActionType: 'ADD',
      newProperty: {
        fieldName: '',
        fieldType: undefined,
        defaultValue: null
      },
      oldProperty: null,
      canModifyProperty: true
    }, () => this.setState({
      propertyWindow: true
    }));
  }

  updateProperty = (fieldName) => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    const oldProperty = this.state.fieldProperty.find(item => item.fieldName === fieldName);
    this.setState({
      propertyActionType: 'MODIFY',
      newProperty: oldProperty,
      oldProperty,
    }, () => this.canModifyProperty());
  }

  canModifyProperty = () => {
    const {propertyActionType, oldProperty, propertyAction} = this.state;
    let flag = true;
    if (propertyActionType === 'MODIFY') {
      const action = propertyAction.find((item) => item.type === 'ADD' && item.newProperty.fieldName === oldProperty.fieldName);
      flag = !!action;
    }
    this.setState({
      canModifyProperty: flag,
      propertyWindow: true,
    });
  }

  deleteProperty = (fieldName) => {
    // 删除与display对应的列
    if (fieldName === this.state.display) {
      this.state.display = null;
    }
    let { propertyAction } = this.state;
    // 删除的是新添加的
    const duplicateAdd = propertyAction.find((item) => item.type === 'ADD' && item.newProperty.fieldName === fieldName);
    if (duplicateAdd) {
      propertyAction = propertyAction.filter((item) => !(item.type === 'ADD' && item.newProperty.fieldName === fieldName));
    }
    // 删除的被修改过
    const duplicateModify = propertyAction.find((item) => item.type === 'MODIFY' && item.newProperty.fieldName === fieldName);
    if (duplicateModify) {
      propertyAction = propertyAction.map((item) => {
        if (item.type === 'MODIFY' && item.newProperty.fieldName === fieldName) {
          return {
            type: 'DELETE',
            sourcePropertyName: item.sourcePropertyName
          };
        }
        return item;
      });
    }
    // 删除原有的列
    if (!duplicateAdd && !duplicateModify) {
      propertyAction.push({
        type: 'DELETE',
        sourcePropertyName: fieldName
      });
    }
    this.setState((prev) => ({
      fieldProperty: prev.fieldProperty.filter((item) => item.fieldName !== fieldName),
      propertyAction
    }));
  }

  addRelation = () => {
    this.setState({
      relationActionType: 'ADD',
      newRelation: {
        relationName: '',
        tableId: undefined,
        type: undefined,
        builtIn: false,
        relatedTableName: ''
      },
      oldRelation: null,
      canModifyRelation: true
    }, () => this.setState({
      relationWindow: true
    }));
  }

  updateRelation = (relationName) => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    const oldRelation = this.state.fieldRelation.find(item => item.relationName === relationName);
    this.setState({
      relationActionType: 'MODIFY',
      newRelation: oldRelation,
      oldRelation,
    }, () => this.canModifyRelation());
  }

  canModifyRelation = () => {
    const {relationActionType, oldRelation, relationAction} = this.state;
    let flag = true;
    if (relationActionType === 'MODIFY') {
      const action = relationAction.find((item) => item.type === 'ADD' && item.newRelation.relationName === oldRelation.relationName);
      flag = !!action;
    }
    this.setState({
      canModifyRelation: flag,
      relationWindow: true,
    });
  }

  deleteRelation = (relationName) => {
    let { relationAction } = this.state;
    // 删除的是新添加的
    const duplicateAdd = relationAction.find((item) => item.type === 'ADD' && item.newRelation.relationName === relationName);
    if (duplicateAdd) {
      relationAction = relationAction.filter((item) => !(item.type === 'ADD' && item.newRelation.relationName === relationName));
    }
    // 删除的被修改过
    const duplicateModify = relationAction.find((item) => item.type === 'MODIFY' && item.newRelation.relationName === relationName);
    if (duplicateModify) {
      relationAction = relationAction.map((item) => {
        if (item.type === 'MODIFY' && item.newRelation.relationName === relationName) {
          return {
            type: 'DELETE',
            sourceRelationName: item.sourceRelationName
          };
        }
        return item;
      });
    }
    // 删除原有的关系
    if (!duplicateAdd && !duplicateModify) {
      relationAction.push({
        type: 'DELETE',
        sourceRelationName: relationName
      });
    }
    this.setState((prev) => ({
      fieldRelation: prev.fieldRelation.filter((item) => item.relationName !== relationName),
      relationAction
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
    propertyActionType, newProperty, oldProperty
    } = this.state;
    let {fieldProperty, propertyAction} = this.state;
    if (propertyActionType === 'ADD') {
      const duplicate = fieldProperty.find(item => item.fieldName === newProperty.fieldName);
      if (duplicate) {
        message.error('存在相同的列名');
        return;
      }
      fieldProperty.push(newProperty);
      // 之前被删除过,需要改为modify
      const duplicateDelete = propertyAction.find((item) => item.type === 'DELETE' && item.sourcePropertyName === newProperty.fieldName);
      if (duplicateDelete) {
        propertyAction = propertyAction.map((item) => {
          if (item.type === 'DELETE' && item.sourcePropertyName === newProperty.fieldName) {
            return {
              type: 'MODIFY',
              sourcePropertyName: item.sourcePropertyName,
              newProperty
            };
          }
          return item;
        });
      } else {
        propertyAction.push({
          type: 'ADD',
          newProperty
        });
      }
    }
    if (propertyActionType === 'MODIFY') {
      const duplicate = fieldProperty.find(item => item.fieldName === newProperty.fieldName);
      if (duplicate && newProperty.fieldName !== oldProperty.fieldName) {
        message.error('存在相同的列名');
        return;
      }
        fieldProperty = fieldProperty.map((item) => {
         if (item.fieldName === oldProperty.fieldName) {
           return newProperty;
         }
         return item;
        });
        // 如果修改了和display对应的列
        if (oldProperty.fieldName === this.state.display && newProperty.fieldName !== this.state.display) {
          this.state.display = null;
        }
        // 查看修改的行是不是新添加的
        const duplicateAdd = propertyAction.find((item) => item.type === 'ADD' && item.newProperty.fieldName === oldProperty.fieldName);
        if (duplicateAdd) {
          propertyAction = propertyAction.map((item) => {
            if (item.type === 'ADD' && item.newProperty.fieldName === oldProperty.fieldName) {
              return {
                type: 'ADD',
                newProperty
              };
            }
            return item;
          });
        }
        // 二次修改
        const duplicateModify = propertyAction.find((item) => item.type === 'MODIFY' && item.newProperty.fieldName === oldProperty.fieldName);
        if (duplicateModify) {
          propertyAction = propertyAction.map((item) => {
            if (item.type === 'MODIFY' && item.newProperty.fieldName === oldProperty.fieldName) {
              return {
                type: 'MODIFY',
                sourcePropertyName: item.sourcePropertyName,
                newProperty
              };
            }
            return item;
          });
        }
        // 第一次修改已有值
        if (!duplicateModify && !duplicateAdd) {
          propertyAction.push({
            type: 'MODIFY',
            sourcePropertyName: oldProperty.fieldName,
            newProperty
          });
        }
    }
    this.setState({
      fieldProperty,
      propertyAction,
      propertyWindow: false,
    });
  }

  savePropertyR=() => {
    const {
      relationActionType, newRelation, oldRelation, dataSource
    } = this.state;
    let {fieldRelation, relationAction} = this.state;
    const data = dataSource.find((item) => item.id === newRelation.tableId);
    newRelation.relatedTableName = data ? data.tableName : '';
    if (relationActionType === 'ADD') {
      const duplicate = fieldRelation.find(item => item.relationName === newRelation.relationName);
      if (duplicate) {
        message.error('存在相同的关联名');
        return;
      }
      fieldRelation.push(newRelation);
      // 之前被删除过,需要改为modify
      const duplicateDelete = relationAction.find((item) => item.type === 'DELETE' && item.sourceRelationName === newRelation.relationName);
      if (duplicateDelete) {
        relationAction = relationAction.map((item) => {
          if (item.type === 'DELETE' && item.sourceRelationName === newRelation.relationName) {
            return {
              type: 'MODIFY',
              sourceRelationName: item.sourceRelationName,
              newRelation
            };
          }
          return item;
        });
      } else {
        relationAction.push({
          type: 'ADD',
          newRelation
        });
      }
    }
    if (relationActionType === 'MODIFY') {
      const duplicate = fieldRelation.find(item => item.relationName === newRelation.relationName);
      if (duplicate && newRelation.fieldName !== oldRelation.fieldName) {
        message.error('存在相同的关联名');
        return;
      }
      fieldRelation = fieldRelation.map((item) => {
        if (item.relationName === oldRelation.relationName) {
          return newRelation;
        }
        return item;
      });
      // 查看修改的是不是新添加的
      const duplicateAdd = relationAction.find((item) => item.type === 'ADD' && item.newRelation.relationName === oldRelation.relationName);
      if (duplicateAdd) {
        relationAction = relationAction.map((item) => {
          if (item.type === 'ADD' && item.newRelation.relationName === oldRelation.relationName) {
            return {
              type: 'ADD',
              newRelation
            };
          }
          return item;
        });
      }
      // 二次修改
      const duplicateModify = relationAction.find((item) => item.type === 'MODIFY' && item.newRelation.relationName === oldRelation.relationName);
      if (duplicateModify) {
        relationAction = relationAction.map((item) => {
          if (item.type === 'MODIFY' && item.newRelation.relationName === oldRelation.relationName) {
            return {
              type: 'MODIFY',
              sourceRelationName: item.sourceRelationName,
              newRelation
            };
          }
          return item;
        });
      }
      // 第一次修改已有值
      if (!duplicateModify && !duplicateAdd) {
        relationAction.push({
          type: 'MODIFY',
          sourceRelationName: oldRelation.relationName,
          newRelation
        });
      }
    }
    this.setState({
      fieldRelation,
      relationAction,
      relationWindow: false,
    });
  }

  submit= () => {
    const display = this.state.fieldProperty.find((item) => this.state.display === item.fieldName);
    if (!display) {
      message.error('请选择展示名');
      return;
    }
    const data = {
      display,
      propertyOperations: this.state.propertyAction,
      relationOperations: this.state.relationAction
    };
    updateTable(getTableId(), data).then((r) => {
      message.success('修改成功');
      history.push('/developer/dataModel');
    }).catch((e) => {
      console.error(e);
    });
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
              disabled
            />
          </Row>
          <Row style={{marginBottom: '10px'}}>
            <Input
              style={{width: '40%'}}
              placeholder="简介"
              value={this.state.detail}
              disabled
            />
          </Row>
          <Row style={{marginBottom: '15px'}}>
            <Select placeholder="展示名" style={{width: '40%'}} value={this.state.display} onChange={(e) => this.setState({display: e})}>
              {this.state.fieldProperty.map((item) => (
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
            <Table bordered size="middle" dataSource={this.state.fieldProperty} columns={columnsP} rowKey="fieldName" loading={this.state.loadingP} />
          </Row>
          <Modal title="属性" visible={this.state.propertyWindow} onOk={this.savePropertyP} onCancel={this.closeWindow} destroyOnClose>
            <Input style={{width: 400}} placeholder="列名" value={this.state.newProperty ? this.state.newProperty.fieldName : ''} onChange={(e) => this.setState((prev) => ({newProperty: {...prev.newProperty, fieldName: e.target.value}}))} />
            <Select
                placeholder="数据类型"
                style={{ width: 400, marginTop: 15}}
                value={this.state.newProperty ? this.state.newProperty.fieldType : undefined}
                onChange={(e) => {
                  if (e === 'File') this.setState((prev) => ({newProperty: {...prev.newProperty, defaultValue: null}}));
                  this.setState((prev) => ({newProperty: {...prev.newProperty, fieldType: e}}));
                }}
                disabled={!this.state.canModifyProperty}
            >
              <Option value="Int" key="Int">Int</Option>
              <Option value="Double" key="Double">Double</Option>
              <Option value="string" key="string">String</Option>
              <Option value="Char" key="Char">Char</Option>
              <Option value="Bool" key="Bool">Bool</Option>
              <Option value="File" key="File">File</Option>
            </Select>
            {
              this.state.newProperty && this.state.newProperty.fieldType === 'File' ? null :
              <Input style={{width: 400, marginTop: 15}} placeholder="默认值" value={this.state.newProperty ? this.state.newProperty.defaultValue : ''} onChange={(e) => this.setState((prev) => ({newProperty: {...prev.newProperty, defaultValue: e.target.value}}))} />
            }
          </Modal>
          <Row style={{marginBottom: '5px'}}>
            <Button type="primary" icon="plus" onClick={this.addRelation}>添加关联</Button>
          </Row>
          <Row style={{marginBottom: '15px'}}>
            <Table bordered rowKey="relationName" size="middle" dataSource={this.state.fieldRelation} columns={columnsR} loading={this.state.loadingR} />
          </Row>
          <Modal title="关联" visible={this.state.relationWindow} onOk={this.savePropertyR} onCancel={this.closeWindow} destroyOnClose>
            <Input placeholder="关联名称" style={{ width: 400}} value={this.state.newRelation ? this.state.newRelation.relationName : ''} onChange={(e) => this.setState((prev) => ({newRelation: {...prev.newRelation, relationName: e.target.value}}))} />
            <Radio.Group style={{ marginTop: 15}} value={this.state.newRelation ? this.state.newRelation.builtIn : undefined} onChange={(e) => this.setState((prev) => ({newRelation: {...prev.newRelation, builtIn: e.target.value, tableId: undefined}}))} disabled={!this.state.canModifyRelation}>
              <Radio.Button value key="true">内置数据</Radio.Button>
              <Radio.Button value={false} key="false">自定义数据</Radio.Button>
            </Radio.Group>
            <Select placeholder="关联表" style={{ width: 400, marginTop: 15}} value={this.state.newRelation ? this.state.newRelation.tableId : undefined} onChange={(e) => this.setState((prev) => ({newRelation: {...prev.newRelation, tableId: e}}))} disabled={!this.state.canModifyRelation}>
              {this.state.dataSource.map(data => {
                if (this.state.newRelation && this.state.newRelation.builtIn) {
                  if (data.tableName === 'user') {
                    return (
                      <Option value={data.id} key={data.id}>{data.tableName}</Option>
                    );
                  }
                  return null;
                }
                if (this.state.newRelation && data.tableName !== 'user') {
                  return (
                    <Option value={data.id} key={data.id}>{data.tableName}</Option>
                  );
                }
                return null;
              })}
            </Select>
            <Select placeholder="关联类型" style={{ width: 400, marginTop: 15}} defaultValue={this.state.newRelation ? this.state.newRelation.type : undefined} onChange={(e) => this.setState((prev) => ({newRelation: {...prev.newRelation, type: e}}))} disabled={!this.state.canModifyRelation}>
              <Option value="single" key="single">单个</Option>
              <Option value="multiple" key="multiple">多个</Option>
            </Select>
          </Modal>
          <Row type="flex" justify="center">
            <Button type="primary" onClick={this.submit}>提交</Button>
          </Row>
        </Card>
      </>
    );
  }
}

export default withRouter(EditData);
