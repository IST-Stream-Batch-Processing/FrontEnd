import React from 'react';
import {
  Button, Col, Icon,
  Input,
  Row, Select, TreeSelect, Popconfirm
} from 'antd';
import {getOr} from 'lodash/fp';

export default class Condition extends React.Component {
  constructor(props) {
    super(props);
    const editable = getOr(false, 'editable', props);
    this.state = {
      targets: props.targets || [],
      condition: props.condition || null,
      defaultTarget: props.setDefaultTarget(props.condition),
      isConfirmed: !!props.condition,
      editable,
    };
  }

  submit = () => {
    const {condition} = this.state;
    this.props.submit({condition});
    this.setState({
      isConfirmed: true
    });
  }

  chooseTarget = (value) => {
    const data = this.props.chooseTarget(value);
    this.setState(prev => ({
      condition: {
        ...prev.condition,
        ...data,
      },
      defaultTarget: value,
      isConfirmed: false
    }));
  }

  chooseOperator = (operator) => {
    this.setState(prev => ({
      condition: {
        ...prev.condition,
        operator,
      },
      isConfirmed: false
    }));
  }

  setValue = (event) => {
    this.setState(prev => ({
      condition: {
        ...prev.condition,
        value: event.target.value,
      },
      isConfirmed: false
    }));
  }

  render() {
    const { editable } = this.state;
    return (
      <Row>
          { editable ? (
            <Col span={2}>
              <Popconfirm title="确定变更类型?" onConfirm={() => this.props.changeType()}>
                <Icon className="descriptor-icon" type="form" style={{color: 'orangered', width: 10}} />
              </Popconfirm>
            </Col>
          ) : null}
        <Col span={6}>
          <TreeSelect
            placeholder="请选择条件对象"
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            onChange={(value) => this.chooseTarget(value)}
            value={this.state.defaultTarget}
            treeDefaultExpandAll
            disabled={!editable}
            size="small"
          >
            { this.props.renderTargets(this.state.targets) }
          </TreeSelect>
        </Col>
         <Col span={4}>
          <Select size="small" onChange={this.chooseOperator} defaultValue={!this.state.condition ? '' : this.state.condition.operator} disabled={!editable} style={{ width: '100%' }}>
            {
              Object.keys(this.props.operators).map((o, index) => (
                  <Select.Option value={o} key={index}>
                      {this.props.operators[o]}
                  </Select.Option>
                ))
            }
          </Select>
         </Col>
        <Col span={6}>
          <Input size="small" onChange={this.setValue} disabled={!editable} defaultValue={!this.state.condition ? '' : this.state.condition.value} />
        </Col>
          {
            this.state.isConfirmed ? (
              <Icon type="check-circle" style={{color: 'green', marginLeft: 5, width: 50}} />
            )
              : (
                <Button size="small" onClick={() => this.submit()} type="primary" style={{marginLeft: 5, width: 50}}>确认</Button>
              )
          }
      </Row>
    );
  }
}
