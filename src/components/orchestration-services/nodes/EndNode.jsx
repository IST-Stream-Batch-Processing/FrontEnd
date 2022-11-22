import React from 'react';

import { CircleNode, CircleNodeModel, h } from '@logicflow/core';
import { repeatNode } from '../../../utils/orch-service/orchUtil';

class EndNodeModel extends CircleNodeModel {
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
      message: '结束节点不能有输出',
      validate: (source) => source.outgoing.edges.length < 0
    };
    sourceRules.push(numberOfOutgoing);
    return sourceRules;
  }
}

// 自定义节点的 view
class EndNodeView extends CircleNode {
  getLabelShape() {
    const { model } = this.props;
    const {
      x, y
    } = model;
    return h(
      'svg',
      {
        x: x - 19,
        y: y - 19,
        width: 38,
        height: 38,
        viewBox: '0 0 1024 1024'
      },
      h('path', {
        d:
          'M0 512C0 229.230208 229.805588 0 512 0 794.769792 0 1024 229.805588 1024 512 1024 794.769792 794.194412 1024 512 1024 229.230208 1024 0 794.194412 0 512Z'
      })
    );
  }

  /**
   * 完全自定义节点外观方法
   */
  getShape() {
    const { model } = this.props;
    const style = model.getNodeStyle();
    const {
      x, y, r, width, height
    } = model;
    return h('g', {}, [
      h('rect', {
        ...style,
        x: x - width / 2,
        y: y - width / 2,
        rx: r,
        ry: r,
        width,
        height,
        strokeWidth: 2
      }),
      this.getLabelShape()
    ]);
  }
}

export default {
  type: 'END_NODE',
  view: EndNodeView,
  model: EndNodeModel
};
