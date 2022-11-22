import React from 'react';
import {
  Modal,
  Row, Select, Tree, TreeSelect
} from 'antd';

import { renderNode } from '../node-render/TreeRender';
import renderService from '../node-render/TreeSelectRender';
import { nodeType } from '../../../../constants/nodeType';
import '../../../../css/osService.css';
import Descriptor from '../../../../components/orchestration-services/descriptor/Descriptor';
import {convertDescriptor, getKeys, reconvertDescriptor} from '../../../../utils/orch-service/orchUtil';

export default class ConditionEndBinding extends React.Component {
  constructor(props) {
    super(props);
    const {currentNode} = props;
    let conditionNodeId2Qualified = [];
    let conditionNodeId2Unqualified = [];
    let inType = {};
    let conditionStartNodeId = null;
    if (currentNode) {
      conditionNodeId2Qualified = props.conditionNodeId2Qualified[currentNode.id] || [];
      conditionNodeId2Unqualified = props.conditionNodeId2Unqualified[currentNode.id] || [];
      inType = currentNode.inType || null;
      conditionStartNodeId = currentNode.conditionStartNodeId || null;
    }
    this.state = {
      childRef: React.createRef(),
      inType,
      descriptor: inType ? reconvertDescriptor(inType) : null,
      services: props.services,
      bindServices: props.bindServices || [], // [{id, serviceId, serviceName, inType, outType, type, x, y}]
      showModal: props.showConditionEndModal,
      conditionStartNodes: props.conditionStartNodes,
      conditionStartNodeId,
      currentNode,
      target: null,
      from: null,
      fromNodeId: null,
      conditionNodeId2Qualified, // [{fromNodeId, from: {fieldKey, fullFieldName}, target: {fieldKey, fullFieldName}]
      conditionNodeId2Unqualified,
      defaultTargetParamQualified: '',
      defaultTargetParamUnqualified: '',
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
    // 删除绑定过但没有在descriptor中出现过的绑定信息
    const keys = getKeys(this.state.descriptor);
    let {conditionNodeId2Qualified, conditionNodeId2Unqualified} = this.state;
    conditionNodeId2Qualified = conditionNodeId2Qualified.filter((item) => keys.some(i => i === item.target.fieldKey));
    conditionNodeId2Unqualified = conditionNodeId2Unqualified.filter((item) => keys.some(i => i === item.target.fieldKey));
    this.props.onOk(this.state.inType, conditionNodeId2Qualified, conditionNodeId2Unqualified, this.state.conditionStartNodeId);
    this.setState({
      conditionNodeId2Qualified,
      conditionNodeId2Unqualified,
      showModal: false
    });
  }

  setInType = (descriptor) => {
    const inType = convertDescriptor(descriptor);
    descriptor = reconvertDescriptor(inType);
    if (this.state.childRef.current) this.state.childRef.current.setData(descriptor);
    this.setState({
      inType,
      descriptor
    });
  }

  // value: fieldKey,fullFieldName 或者 Base
  chooseTargetParam = (value) => {
    if (value.length === 0) return;
    const { conditionNodeId2Qualified, conditionNodeId2Unqualified } = this.state;
    this.setDefaultValue(value, true, conditionNodeId2Qualified);
    this.setDefaultValue(value, false, conditionNodeId2Unqualified);
  }

  setDefaultValue = (value, flag, paramBindingList) => {
    let defaultTargetParam = '';
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
        target: {fieldKey: values[0], fullFieldName: values[1]}
      });
    }
    if (flag) {
      this.setState({
        defaultTargetParamQualified: defaultTargetParam
      });
    } else {
      this.setState({
        defaultTargetParamUnqualified: defaultTargetParam
      });
    }
  }

  // value: fieldKey,nodeId,fullFieldName 或者 Base,nodeId
  chooseFromParam = (value, flag) => {
    if (value.length === 0) return;
    const { conditionNodeId2Qualified, conditionNodeId2Unqualified } = this.state;
    if (flag) this.setParamBindingList(value, true, conditionNodeId2Qualified);
    else this.setParamBindingList(value, false, conditionNodeId2Unqualified);
  }

  setParamBindingList = (value, flag, paramBindingList) => {
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
      }]; // target是object
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
    if (flag) {
      this.setState({
        defaultTargetParamQualified: value,
        conditionNodeId2Qualified: paramBindingList
      });
    } else {
      this.setState({
        defaultTargetParamUnqualified: value,
        conditionNodeId2UnQualified: paramBindingList
      });
    }
  }

  chooseConditionStartNode = (id) => {
    this.setState({
      conditionStartNodeId: id
    });
  }

  render() {
    const { currentNode, editable } = this.state;
    return (
      <Modal visible={this.state.showModal} destroyOnClose title="节点信息绑定" onCancel={this.onCancel} onOk={this.onOk} footer={editable ? undefined : null}>
        {
          currentNode ? (
            <div className="panelDiv">
              <Row className="panelSpan">
                当前节点
              </Row>
              <Row>
                id：
                { currentNode.id}
              </Row>
              <Row>
                类别：
                { nodeType[currentNode.type] }
              </Row>
            </div>
          ) : null
        }
        {
          currentNode ? (
            <div>
              <Row className="panelSpan">
                创建参数
              </Row>
              <Descriptor editable data={this.state.descriptor} onChange={(i) => this.setInType(i)} ref={this.state.childRef} />
            </div>
          ) : null
        }
        {
          currentNode && this.state.inType ? (
            <div className="panelDiv">
              <Row className="panelSpan">
                绑定参数
              </Row>
              <Tree onSelect={(e) => this.chooseTargetParam(e)} defaultExpandAll>
                {renderNode('', this.state.inType, true)}
              </Tree>
            </div>
          ) : null
        }
        {
          currentNode && this.state.target !== null ? (
            <div className="panelDiv">
              <Row className="panelSpan">
                条件满足时
              </Row>
              <TreeSelect
                placeholder="请选择满足条件时的上下文参数"
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                onChange={(value) => this.chooseFromParam(value, true)}
                value={this.state.defaultTargetParamQualified}
                treeDefaultExpandAll
                disabled={!editable}
              >
                { renderService(this.state.bindServices.filter((item) => item.id !== currentNode.id)) }
              </TreeSelect>
            </div>
          ) : null
        }
        {
          currentNode && this.state.target ? (
            <div className="panelDiv">
              <Row className="panelSpan">
                条件不满足时
              </Row>
              <TreeSelect
                placeholder="请选择不满足条件时的上下文参数"
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                onChange={(value) => this.chooseFromParam(value, false)}
                value={this.state.defaultTargetParamUnqualified}
                treeDefaultExpandAll
                disabled={!editable}
              >
                { renderService(this.state.bindServices.filter((item) => item.id !== currentNode.id)) }
              </TreeSelect>
            </div>
          ) : null
        }
        <div className="panelDiv">
          <Row className="panelSpan">
            条件开始节点
          </Row>
        </div>
        <Select onChange={this.chooseConditionStartNode} defaultValue={this.state.conditionStartNodeId} disabled={!editable} style={{ width: '100%' }}>
      {this.state.conditionStartNodes.map((o, index) => (
        <Select.Option value={o.id} key={index}>
          {o.id}
        </Select.Option>
        ))}
        </Select>
      </Modal>
    );
  }
}
