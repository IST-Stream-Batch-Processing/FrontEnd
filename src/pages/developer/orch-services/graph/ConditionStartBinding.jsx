import React from 'react';
import {
  Modal,
  Row, Select
} from 'antd';

import { nodeType } from '../../../../constants/nodeType';
import '../../../../css/osService.css';
import NodeCondition from './NodeCondition';

export default class ConditionStartBinding extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bindServices: props.bindServices || [], // [{id, serviceId, serviceName, inType, outType, type, x, y}]
      showConditionModal: props.showConditionModal,
      currentNode: props.currentNode, // {id, type, x, y, qualifiedNodeId, unqualifiedNodeId, conditionList[]}
      editable: props.editable,
      qualifiedNodeId: props.currentNode !== null ? props.currentNode.qualifiedNodeId || null : null,
      condition: props.currentNode !== null ? props.currentNode.condition || null : null,
      nextNodes: props.nextNodes || [],
    };
  }

  chooseQualifiedNode = (nodeId) => {
    this.setState({
      qualifiedNodeId: nodeId
    });
  }

  changeCondition = (condition) => {
    this.setState({
      condition
    });
  }

  onCancel = () => {
    this.props.onCancel();
    this.setState({
      showConditionModal: false
    });
  }

  onOk = () => {
    const unqualifiedNode = this.state.nextNodes.find(i => i.id !== this.state.qualifiedNodeId);
    this.props.onOk(this.state.condition, this.state.qualifiedNodeId, unqualifiedNode === undefined ? null : unqualifiedNode.id);
    this.setState({
      showConditionModal: false
    });
  }

  render() {
    const {
 currentNode, bindServices, editable, nextNodes
} = this.state;
    return (
      <Modal visible={this.state.showConditionModal} destroyOnClose title="条件开始节点绑定" onCancel={this.onCancel} onOk={this.onOk} footer={editable ? undefined : null}>
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
            <Select.Option value={o.id} key={index}>
              {o.serviceName === undefined ? o.id : `${o.serviceName}(${o.id})`}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    );
  }
}
