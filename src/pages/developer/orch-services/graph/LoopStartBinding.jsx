import React from 'react';
import {
  Input,
  Modal,
  Row
} from 'antd';

import { nodeType } from '../../../../constants/nodeType';
import '../../../../css/osService.css';

export default class LoopStartBinding extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoopModal: props.showLoopModal,
      currentNode: props.currentNode, // {id, type, x, y, qualifiedNodeId, unqualifiedNodeId, conditionList[]}
      editable: props.editable,
      loopCount: props.currentNode !== null ? props.currentNode.loopCount || null : null,
    };
  }

  setLoopCount = (event) => {
    this.setState({
      loopCount: event.target.value,
    });
  }

  onCancel = () => {
    this.props.onCancel();
    this.setState({
      showLoopModal: false
    });
  }

  onOk = () => {
    this.props.onOk(this.state.loopCount);
    this.setState({
      showLoopModal: false
    });
  }

  render() {
    const {
      currentNode, editable
    } = this.state;
    return (
      <Modal visible={this.state.showLoopModal} destroyOnClose title="循环参数绑定" onCancel={this.onCancel} onOk={this.onOk} footer={editable ? undefined : null}>
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
            循环次数
          </Row>
        </div>
        <Input onChange={this.setLoopCount} disabled={!editable} defaultValue={this.state.loopCount} />
      </Modal>
    );
  }
}
