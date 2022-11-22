import React from 'react';
import {
  Modal,
  Row, Select, Tree, TreeSelect
} from 'antd';

import { renderNode } from '../node-render/TreeRender';
import renderService from '../node-render/TreeSelectRender';
import { nodeType } from '../../../../constants/nodeType';
import '../../../../css/osService.css';

export default class NodeBinding extends React.Component {
  constructor(props) {
    super(props);
    const {currentNode} = props;
    let currentService = null;
    let paramBindingList = [];
    if (currentNode !== null) {
      paramBindingList = props.nodeId2ParamBindingList[currentNode.id] || [];
    }
    if (currentNode !== null && currentNode.serviceId !== undefined) {
      currentService = {
        id: currentNode.serviceId,
        name: currentNode.serviceName,
        inType: currentNode.inType,
        outType: currentNode.outType
      };
    }
    this.state = {
      services: props.services,
      bindServices: props.bindServices || [], // [{id, serviceId, serviceName, inType, outType, type, x, y}]
      showModal: props.showModal,
      currentNode,
      currentService,
      target: null,
      from: null,
      fromNodeId: null,
      paramBindingList, // [{fromNodeId, from: {fieldKey, fullFieldName}, target: {fieldKey, fullFieldName}]
      defaultTargetParam: '',
      isEndBind: props.isEndBind,
      editable: props.editable
    };
  }

  onCancel = () => {
    this.props.onCancel();
    this.setState({
      showModal: false
    });
  }

  onOk = () => {
    this.props.onOk(this.state.currentService, this.state.paramBindingList);
    this.setState({
      showModal: false
    });
  }

  chooseService = (serviceId) => {
    const { services } = this.state;
    const service = services.find((item) => item.id === serviceId);
    this.setState({
      currentService: service,
      paramBindingList: [],
      defaultTargetParam: '',
      currentSourceParam: null
    });
  }

  // value: fieldKey,fullFieldName 或者 Base
  chooseTargetParam = (value) => {
    if (value.length === 0) return;
    const { paramBindingList } = this.state;
    let defaultTargetParam;
    if (value[0] === 'Base') { // target为单层0
      if (paramBindingList.length > 0) {
        if (paramBindingList[0].from.fieldKey === undefined || paramBindingList[0].from.fieldKey === null) { // from是单层
          defaultTargetParam = `Base,${paramBindingList[0].fromNodeId}`;
        } else {
          defaultTargetParam = `${paramBindingList[0].from.fieldKey},${paramBindingList[0].fromNodeId},${paramBindingList[0].from.fullFieldName}`;
        }
      } else {
        defaultTargetParam = '';
      }
      this.setState({
        defaultTargetParam,
        target: {fieldKey: undefined, fullFieldName: ''}
      });
    } else { // target为Object
      const values = value[0].split(',');
      const paramBinding = paramBindingList.find((item) => item.target.fieldKey === values[0]);
      if (paramBinding !== undefined) { // 已经绑定过
        if (paramBinding.from.fieldKey === undefined || paramBinding.from.fieldKey == null) { // from是单层
          defaultTargetParam = `Base,${paramBinding.fromNodeId}`;
        } else { // from的是多层
          defaultTargetParam = `${paramBinding.from.fieldKey},${paramBinding.fromNodeId},${paramBinding.from.fullFieldName}`;
        }
      } else { // 未绑定过
        defaultTargetParam = '';
      }
      this.setState({
        defaultTargetParam,
        target: {fieldKey: values[0], fullFieldName: values[1]}
      });
    }
  }

  // value: fieldKey,nodeId,fullFieldName 或者 Base,nodeId
  chooseFromParam = (value) => {
    if (value.length === 0) return;
    this.setState({
      defaultTargetParam: value
    });
    let { paramBindingList } = this.state;
    const { target } = this.state;
    const values = value.split(',');
    const fromNodeId = values[1];
    let from;
    if (values[0] === 'Base') { // from是单层
      from = {fieldKey: undefined, fullFieldName: ''};
    } else {
      from = {fieldKey: values[0], fullFieldName: values[2]};
    }
    if (target.fieldKey === undefined) { // target是单层
      paramBindingList = [{
        from,
        fromNodeId,
        target
      }];// target是object
    } else if (paramBindingList.find((item) => item.target.fieldKey === target.fieldKey) !== undefined) { // 绑定过
        paramBindingList = paramBindingList.map((item) => {
          if (item.target.fieldKey === target.fieldKey) {
            return {
              from,
              fromNodeId,
              target: this.state.target
            };
          }
          return item;
        });
      } else { // 没有绑定过
        paramBindingList.push({
          from,
          fromNodeId,
          target: this.state.target
        });
    }
    this.setState({
      paramBindingList
    });
  }

  render() {
    const { currentNode, isEndBind, editable } = this.state;
    return (
      <Modal visible={this.state.showModal} destroyOnClose title="节点信息绑定" onCancel={this.onCancel} onOk={this.onOk} footer={editable ? undefined : null}>
        {
          currentNode !== null ? (
            <div className="panelDiv">
              <Row className="panelSpan">
                当前节点
              </Row>
              {!isEndBind ? (
                <>
                  <Row>
                      id：
                      { currentNode.id}
                  </Row>
                  <Row>
                    类别：
                    { nodeType[currentNode.type] }
                  </Row>
                </>
                ) : <Row>组合服务输出</Row>}
            </div>
          ) : null
        }
        {
          !isEndBind && currentNode !== null ? (
            <div className="panelDiv">
              <Row className="panelSpan">
                绑定服务
              </Row>
              <Row>
                <Select style={{width: '100%'}} onChange={this.chooseService} defaultValue={this.state.currentService === null ? '' : this.state.currentService.id} disabled={!editable}>
                  {this.state.services.map((o) => (
                    <Select.Option value={o.id} key={o.id}>
                      {o.name}
                    </Select.Option>
                  ))}
                </Select>
              </Row>
            </div>
          ) : null
        }
        {
          !isEndBind && currentNode !== null && this.state.currentService !== null ? (
            <div className="panelDiv">
              <Row className="panelSpan">
                绑定参数
              </Row>
              <Tree onSelect={(e) => this.chooseTargetParam(e)} defaultExpandAll>
                {renderNode('', this.state.currentService.inType, true, this.state.paramBindingList)}
              </Tree>
            </div>
          ) : null
        }
        {
          isEndBind && currentNode !== null ? (
            <div className="panelDiv">
              <Row className="panelSpan">
                绑定参数
              </Row>
              <Tree onSelect={(e) => this.chooseTargetParam(e)} defaultExpandAll>
                {renderNode('', this.state.currentNode.inType, true, this.state.paramBindingList)}
              </Tree>
            </div>
          ) : null
        }
        {
          currentNode !== null && this.state.target !== null ? (
            <div className="panelDiv">
              <Row className="panelSpan">
                选择上下文参数
              </Row>
              <TreeSelect
                  placeholder="请选择上下文参数"
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  onChange={(value) => this.chooseFromParam(value)}
                  value={this.state.defaultTargetParam}
                  treeDefaultExpandAll
                  disabled={!editable}
              >
                { renderService(this.state.bindServices.filter((item) => item.id !== currentNode.id)) }
              </TreeSelect>
            </div>
          ) : null
        }
      </Modal>
    );
  }
}
