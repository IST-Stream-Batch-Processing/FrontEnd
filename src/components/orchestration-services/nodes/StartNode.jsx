import React from 'react';

import { CircleNode, CircleNodeModel} from '@logicflow/core';
import {repeatNode} from '../../../utils/orch-service/orchUtil';

class StartNodeModel extends CircleNodeModel {
  initNodeData(data) {
    super.initNodeData(data);
    this.r = 30;
  }

  getNodeStyle() {
    const style = super.getNodeStyle();
    style.stroke = 'black';
    return style;
  }

  // 设置连线规则
  getConnectedTargetRules() {
    const targetRules = super.getConnectedTargetRules();
    const notAsTarget = {
      message: '禁止自己连自己',
      validate: (source, target) => source.id !== target.id,
    };
    targetRules.push(notAsTarget);
    const notRepeat = {
      message: '禁止互为source和target',
      validate: (source, target) => repeatNode(target.outgoing.nodes, source.id)
    };
    targetRules.push(notRepeat);
    const numberOfIncoming = {
      message: '开始节点不能有输入',
      validate: (source, target) => target.incoming.edges.length < 0
    };
    targetRules.push(numberOfIncoming);
    return targetRules;
  }

  getConnectedSourceRules() {
    const sourceRules = super.getConnectedSourceRules();
    const notRepeat = {
      message: '禁止互为source和target',
      validate: (source, target) => repeatNode(source.incoming.nodes, target.id)
    };
    sourceRules.push(notRepeat);
    const numberOfOutgoing = {
      message: '开始节点有且只有一个输出',
      validate: (source) => source.outgoing.edges.length < 1
    };
    sourceRules.push(numberOfOutgoing);
    return sourceRules;
  }
}

export default {
  type: 'START_NODE',
  view: CircleNode,
  model: StartNodeModel
};
