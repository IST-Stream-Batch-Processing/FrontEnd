import React from 'react';

import {getOr} from 'lodash/fp';
import renderService from '../node-render/TreeSelectRender';
import {briefQueryTypes, conditionTypes} from '../../../../constants/query';
import ConditionTree from '../../../../components/query/ConditionTree';

export default class NodeCondition extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bindServices: props.bindServices || [],
      condition: props.condition || null, // nodeId,fieldPath{fieldKey, fullFieldName},value,operator}
      editable: getOr(false, 'editable', props),
      reversedCondition: this.dataFormatConversionReverse(props.condition)
    };
  }

  setDefaultTargetParam = (condition) => {
    let defaultTargetParam = '';
    if (condition && condition.fieldPath) {
      if (condition.fieldPath.fieldKey === undefined || condition.fieldPath.fieldKey === null) {
        defaultTargetParam = `Base,${condition.nodeId}`;
      } else {
        defaultTargetParam = `${condition.fieldPath.fieldKey},${condition.nodeId},${condition.fieldPath.fullFieldName}`;
      }
    }
    return defaultTargetParam;
  }

  // value: fieldKey,nodeId,fullFieldName 或者 Base,nodeId
  chooseTarget = (value) => {
    if (!value || value.length === 0) return;
    const values = value.split(',');
    const nodeId = values[1];
    let fieldPath;
    if (values[0] === 'Base') { // from是单层
      fieldPath = {fieldKey: undefined, fullFieldName: ''};
    } else {
      fieldPath = {fieldKey: values[0], fullFieldName: values[2]};
    }
    // eslint-disable-next-line consistent-return
    return {nodeId, fieldPath};
  }

  onChange = (value) => {
    this.setState({
      reversedCondition: value
    });
    this.props.onChange(this.dataFormatConversion(value));
  }

  dataFormatConversion = (data) => {
    if (!data) return null;
    return {
      ...data.condition,
      left: this.dataFormatConversion(data.left),
      right: this.dataFormatConversion(data.right),
      logicType: data.logicType,
    };
  }

  dataFormatConversionReverse = (data) => {
    if (!data) return null;
    return {
      condition: {
        nodeId: data.nodeId,
        fieldPath: data.fieldPath,
        operator: data.operator,
        value: data.value,
      },
      left: this.dataFormatConversionReverse(data.left),
      right: this.dataFormatConversionReverse(data.right),
      logicType: data.logicType,
      type: data.logicType ? conditionTypes.multi : conditionTypes.single
    };
  }

  render() {
    return (
      <ConditionTree
        key={this.state.condition}
        targets={this.state.bindServices}
        data={this.state.reversedCondition}
        chooseTarget={(value) => this.chooseTarget(value)}
        setDefaultTarget={(value) => this.setDefaultTargetParam(value)}
        renderTargets={(value) => renderService(value)}
        onChange={(value) => this.onChange(value)}
        operators={briefQueryTypes}
        editable
        displayable
      />
    );
  }
}
