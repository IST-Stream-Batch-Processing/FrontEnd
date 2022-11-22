import React from 'react';

import { DiamondNode, DiamondNodeModel, h } from '@logicflow/core';
import {repeatNode} from '../../../utils/orch-service/orchUtil';

class ParallelStartNodeModel extends DiamondNodeModel {
  initNodeData(data) {
    super.initNodeData(data);
    this.rx = 30;
    this.ry = 30;
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
    return sourceRules;
  }
}

// 自定义节点的 view
class ParallelStartNodeView extends DiamondNode {
  getLabelShape() {
    const { model } = this.props;
    const {
      x, y
    } = model;
    const style = model.getNodeStyle();
    return h(
      'svg',
      {
        x: x - 12,
        y: y - 12,
        width: 25,
        height: 25,
        viewBox: '0 0 1024 1024'
      },
      h('path', {
        fill: style.stroke,
        d:
          'M451.426413 64.076364h120.558773v386.382001h386.383024v120.509655H571.985186v388.142087H451.426413V570.96802H63.285349V450.458365h388.141064V64.076364z'
      })
    );
  }

  /**
   * 完全自定义节点外观方法
   */
  getShape() {
    const { model, graphModel } = this.props;
    const {
      x, y, rx, ry, width, height
    } = model;
    const style = model.getNodeStyle();
    return h('g', {}, [
      h('polygon', {
        ...style,
        points: `${x},${y - width / 2} ${x + width / 2},${y} ${x},${y + width / 2} ${x - width / 2},${y}`
      }),
      this.getLabelShape()
    ]);
  }
}

export default {
  type: 'PARALLEL_START_NODE',
  view: ParallelStartNodeView,
  model: ParallelStartNodeModel
};
