import React from 'react';

import { RectNode, RectNodeModel, h } from '@logicflow/core';
import {repeatNode} from '../../../utils/orch-service/orchUtil';

class CompositeServiceNodeModel extends RectNodeModel {
  initNodeData(data) {
    super.initNodeData(data);
    this.width = 120;
    this.height = 80;
    this.radius = 8;
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
      message: '组合服务节点有且只有一个输出',
      validate: (source) => source.outgoing.edges.length < 1
    };
    sourceRules.push(numberOfOutgoing);
    return sourceRules;
  }
}

// 自定义节点的 view
class CompositeServiceNodeView extends RectNode {
  getLabelShape() {
    const { model } = this.props;
    const {
      x, y, width, height
    } = model;
    const style = model.getNodeStyle();
    return h(
      'svg',
      {
        x: x - width / 2 + 5,
        y: y - height / 2,
        width: 40,
        height: 40,
        viewBox: '0 0 1274 1024'
      },
      h('path', {
        fill: style.stroke,
        d:
          'M891.8 65h-632c-35.5 0-64.4 28.8-64.4 64.4v125.3h-66.3c-35.5 0-64.4 28.8-64.4 64.4v575.6c0 35.5 28.8 64.4 64.4 64.4h572.6c35.5 0 64.4-28.8 64.4-64.4v-65.3h125.6c35.5 0 64.4-28.8 64.4-64.4V129.4c0.1-35.6-28.7-64.4-64.3-64.4zM702.2 894.6v0.1c0 0.1-0.2 0.2-0.2 0.2H129.1c-0.1 0-0.2-0.2-0.2-0.2V319v-0.1c0-0.1 0.2-0.2 0.2-0.2h0.1l66.3 0.1S194 794.1 194 797.4c0 17.7 14.3 32 32 32h476.2v65.2zM259.5 129.2c0-0.1 0.2-0.2 0.2-0.2h632.2c0.1 0 0.2 0.2 0.2 0.2V765.1c0 0.1-0.2 0.2-0.2 0.2H259.5V129.2z'
      })
    );
  }

  /**
   * 完全自定义节点外观方法
   */
  getShape() {
    const { model } = this.props;
    const {
      x, y, width, height, radius
    } = model;
    const style = model.getNodeStyle();
    return h('g', {}, [
      h('rect', {
        ...style,
        x: x - width / 2,
        y: y - height / 2,
        rx: radius,
        ry: radius,
        width,
        height
      }),
      this.getLabelShape()
    ]);
  }
}

export default {
  type: 'COMPOSITE_SERVICE_NODE',
  view: CompositeServiceNodeView,
  model: CompositeServiceNodeModel
};
