import React from 'react';
import {
  Col, Icon,
  Popconfirm,
  Row, Select, Tree, TreeSelect
} from 'antd';
import {getOr, set} from 'lodash/fp';
import {conditionTypes, logicTypes} from '../../constants/query';
import Condition from './Condition';

const { TreeNode } = Tree;

const conditionInitialState = {
  type: conditionTypes.single,
  condition: null,
  left: null,
  right: null,
  logicType: null,
};

const conditionMultiInitialState = {
  type: conditionTypes.multi,
  condition: null,
  left: conditionInitialState,
  right: conditionInitialState,
  logicType: logicTypes.and,
};

// translate a custom path into a path that can be used to operate on conditionTree
const translateToConditionPath = (path) => {
  const paths = path.split('.');
  return paths.reduce((currentPath, item) => {
    const optionalDot = (!currentPath) ? '' : '.';
    if (item === '') return '';
    return `${currentPath}${optionalDot}${item}`;
  }, '');
};

export default class ConditionTree extends React.Component {
  constructor(props) {
    super(props);
    const editable = getOr(false, 'editable', props);
    const displayable = getOr(false, 'displayable', props);
    const data = props.data ? {...props.data} : { ...conditionInitialState };
    if (props.onChange && props.editable) {
      props.onChange(data);
    }
    this.state = {
      displayable,
      editable,
      data,
      expression: props.data ? this.getExpression(data) : null
    };
  }

  triggerChange = (data) => {
    const { onChange } = this.props;
    const { editable, displayable } = this.state;
    if (onChange && editable) {
      onChange(data);
      if (displayable) {
        this.updateExpression(data);
      }
    }
  }

  updateExpression = (data) => {
    this.setState({
      expression: this.getExpression(data)
    });
  }

  getExpression = (data) => {
    if (!data) return null;
    switch (data.type) {
      case conditionTypes.multi:
        return (
          <>
            {'('}
            {this.getExpression(data.left) || '--'}
            {`) ${logicTypes[data.logicType] || '--'} (`}
            {this.getExpression(data.right) || '--'}
            {')'}
          </>
        );
      default:
        return data.condition ? (
          <>
            {this.renderCondition(data.condition)}
            {` ${this.props.operators[data.condition.operator] || '--'} `}
            {data.condition.value || '--'}
          </>
        )
          : '--';
    }
  }

  renderCondition = (data) => {
    const condition = {...data};
    delete condition.operator;
    delete condition.value;
    const keys = Object.keys(condition);
    if (keys.length === 0) return '--';
    if (keys.length === 1) return condition[keys[0]];
    return (
    <TreeSelect
          value={this.props.setDefaultTarget(condition)}
          disabled
          size="small"
    >
          { this.props.renderTargets(this.props.targets) }
    </TreeSelect>
    );
  }

  updateValueAt = (path, newValue) => {
    const { data } = this.state;
    const conditionPath = translateToConditionPath(path);
    const nextData = (conditionPath === '') ? newValue : set(conditionPath, newValue, data);
    this.setState({ data: nextData });
    this.triggerChange(nextData);
  }

  changeType = (path) => {
    const { data } = this.state;
    const conditionPath = translateToConditionPath(path);
    let originData = conditionPath === '' ? data : getOr(conditionInitialState, conditionPath, data);
    if (originData.type === conditionTypes.multi) {
       originData = conditionInitialState;
    } else {
      originData = conditionMultiInitialState;
    }
    const nextData = (conditionPath === '') ? originData : set(conditionPath, originData, data);
    this.setState({ data: nextData });
    this.triggerChange(nextData);
  }

  chooseLogicType = (type, path) => {
    const { data } = this.state;
    const conditionPath = translateToConditionPath(path);
    const originData = conditionPath === '' ? data : getOr(conditionMultiInitialState, conditionPath, data);
    if (originData.type === conditionTypes.multi) {
      const newData = { ...originData, logicType: type};
      const nextData = (conditionPath === '') ? newData : set(conditionPath, newData, data);
      this.setState({ data: nextData });
      this.triggerChange(nextData);
    }
  }

  renderNode = (path, data) => {
    const {
      condition, left, right, logicType, type
      } = data;
    const {
      targets, operators, chooseTarget, setDefaultTarget, editable
    } = this.props;
    const isMultiple = (type === conditionTypes.multi);
    const title = (
      <span style={{zIndex: 1, position: 'absolute' }}>
          {isMultiple ? (
            <Row>
            {
              (editable ? (
                <Col span={4}>
                    <Popconfirm title="确定变更类型?" onConfirm={() => this.changeType(path)}>
                      <Icon className="descriptor-icon" type="form" style={{color: 'orangered', width: 10}} />
                    </Popconfirm>
                </Col>
              ) : null)
            }
            <Col span={12} offset={2}>
              <Select size="small" defaultValue={logicType} onChange={(value) => this.chooseLogicType(value, path)} style={{width: 100}} disabled={!editable}>
                {Object.keys(logicTypes).map((o, index) => (
                  <Select.Option value={o} key={index}>
                    {logicTypes[o]}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            </Row>
          ) : (
            <Condition
              condition={condition}
              setDefaultTarget={(value) => setDefaultTarget(value)}
              targets={targets}
              operators={operators}
              chooseTarget={(value) => chooseTarget(value)}
              renderTargets={(value) => this.props.renderTargets(value)}
              changeType={() => this.changeType(path)}
              submit={(value) => this.updateValueAt(path, value)}
              editable
            />
        )}
      </span>
    );
    switch (type) {
      case conditionTypes.multi:
        return (
          <TreeNode key={path} title={title}>
            {
              this.renderNode(`${path}.left`, left)
            }
            {
              this.renderNode(`${path}.right`, right)
            }
          </TreeNode>
        );
      default:
        return <TreeNode key={path} title={title} />;
    }
  }

  render() {
    const { data, displayable } = this.state;
    return (
      <>
        {displayable ? (
          <>
            {'表达式：'}
            {this.state.expression || '暂无'}
          </>
        ) : null}
        <Tree defaultExpandAll>
          {this.renderNode('', data)}
        </Tree>
      </>
    );
  }
}
