import React from 'react';

import { DiamondNode, DiamondNodeModel, h } from '@logicflow/core';
import {repeatNode} from '../../../utils/orch-service/orchUtil';

class LoopStartNodeModel extends DiamondNodeModel {
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
    const numberOfOutgoing = {
      message: '循环开始节点有且只有两个输出',
      validate: (source) => source.outgoing.edges.length < 2
    };
    sourceRules.push(numberOfOutgoing);
    return sourceRules;
  }
}

// 自定义节点的 view
class LoopStartNodeView extends DiamondNode {
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
          'M512.271856 139.636751 512.271856 0 326.090231 186.181624l186.181624 186.181624L512.271856 232.727563c153.599467 0 279.272437 125.67297 279.272437 279.272437 0 46.544873-13.963782 93.090812-32.582157 130.327563l69.817843 69.817843c32.582157-60.508655 55.854061-125.67297 55.854061-200.145406C884.635104 307.2 717.071856 139.636751 512.271856 139.636751zM512.271856 791.272437c-153.599467 0-279.272437-125.67297-279.272437-279.272437 0-46.545939 13.963782-93.090812 32.582157-130.327563l-69.817843-69.817843c-32.582157 60.508655-55.854061 125.67297-55.854061 200.145406 0 204.8 167.563249 372.363249 372.363249 372.363249l0 139.636751 186.181624-186.181624-186.181624-186.181624L512.272922 791.272437z'
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
  type: 'LOOP_START_NODE',
  view: LoopStartNodeView,
  model: LoopStartNodeModel
};
