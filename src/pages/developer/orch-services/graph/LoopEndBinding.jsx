import React from 'react';
import {
  Button,
  Modal,
  Row, Select
} from 'antd';

import { nodeType } from '../../../../constants/nodeType';
import '../../../../css/osService.css';
import NodeCondition from './NodeCondition';

export default class LoopEndBinding extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bindServices: props.bindServices || [], // [{id, serviceId, serviceName, inType, outType, type, x, y}]
      showModal: props.showModal,
      currentNode: props.currentNode, // {id, type, x, y, qualifiedNodeId, unqualifiedNodeId, conditionList[]}
      editable: props.editable,
      qualifiedNodeId: props.currentNode !== null ? props.currentNode.qualifiedNodeId || null : null,
      unqualifiedNodeId: props.currentNode !== null ? props.currentNode.unqualifiedNodeId || null : null,
      loopStartNodeId: props.currentNode !== null ? props.currentNode.loopStartNodeId || null : null,
      condition: props.currentNode !== null ? props.currentNode.condition || null : null, // nodeId,fieldPath{fieldKey, fullFieldName},value,operator}
      showNewCondition: false,
      nextNodes: props.nextNodes || [],
      loopStartNodes: props.loopStartNodes || [],
    };
  }

  chooseQualifiedNode = (nodeId) => {
    this.setState({
      qualifiedNodeId: nodeId
    });
  }

  chooseUnqualifiedNode = (nodeId) => {
    this.setState({
      unqualifiedNodeId: nodeId
    });
  }

  changeCondition = (condition) => {
    this.setState({
      condition
    });
  }

  chooseLoopStartNode = (nodeId) => {
    this.setState({
      loopStartNodeId: nodeId
    });
  }

  onCancel = () => {
    this.props.onCancel();
    this.setState({
      showModal: false
    });
  }

  onOk = () => {
    this.props.onOk(this.state.condition, this.state.qualifiedNodeId, this.state.unqualifiedNodeId, this.state.loopStartNodeId);
    this.setState({
      showModal: false
    });
  }

  render() {
    const {
      currentNode, bindServices, editable, nextNodes, loopStartNodes
    } = this.state;
    return (
      <Modal visible={this.state.showModal} destroyOnClose title="节点条件绑定" onCancel={this.onCancel} onOk={this.onOk} footer={editable ? undefined : null}>
        {
          currentNode !== null ? (
            <div className="panelDiv">
              <Row className="panelSpan">
                当前节点
              </Row>
              <Row>
                id：
                { currentNode.id }
              </Row>
              <Row>
                类别：
                { nodeType[currentNode.type] }
              </Row>
            </div>
          ) : null
        }
        <div className="panelDiv">
          <Row className="panelSpan">
            绑定条件
          </Row>
        </div>
        <NodeCondition
            bindServices={bindServices}
            condition={this.state.condition}
            onChange={(data) => this.changeCondition(data)}
            editable
        />
        <div className="panelDiv">
          <Row className="panelSpan">
            条件满足时执行节点
          </Row>
        </div>
        <Select onChange={this.chooseQualifiedNode} defaultValue={this.state.qualifiedNodeId} disabled={!editable} style={{ width: '100%' }}>
          {nextNodes.map((o, index) => (
            <Select.Option value={o.id} key={`${index}qualifiedNodeId`}>
              {o.serviceName === undefined ? o.id : `${o.serviceName}(${o.id})`}
            </Select.Option>
          ))}
        </Select>
        <div className="panelDiv">
          <Row className="panelSpan">
            超出次数时执行节点
          </Row>
        </div>
        <Select onChange={this.chooseUnqualifiedNode} defaultValue={this.state.unqualifiedNodeId} disabled={!editable} style={{ width: '100%' }}>
          {nextNodes.map((o, index) => (
            <Select.Option value={o.id} key={`${index}unqualifiedNodeId`}>
              {o.serviceName === undefined ? o.id : `${o.serviceName}(${o.id})`}
            </Select.Option>
          ))}
        </Select>
        <div className="panelDiv">
          <Row className="panelSpan">
            循环开始节点
          </Row>
        </div>
        <Select onChange={this.chooseLoopStartNode} defaultValue={this.state.loopStartNodeId} disabled={!editable} style={{ width: '100%' }}>
          {loopStartNodes.map((o, index) => (
            <Select.Option value={o.id} key={index}>
              {o.id}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    );
  }
}
