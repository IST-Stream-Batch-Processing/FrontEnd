import React from 'react';
import { Form, Input, Select } from 'antd';
import {getOr} from 'lodash/fp';
import types from '../../../constants/descriptor';

const { Option } = Select;

const typeOptions = Object.values(types)
  .map((type) => <Option key={type}>{type}</Option>);

// default extra value that should be added on data before submit
const addOnData = {
  Integer: {},
  String: {},
  Double: {},
  Char: {},
  Bool: {},
  File: {},
  Object: {
    className: '',
    children: [{
      name: null, alias: null, type: types.STRING
    }],
  },
  List: {},
};

export default class NodeEditor extends React.Component {
  constructor(props) {
    super(props);
    const { data } = this.props;
    const defaultName = getOr(null, 'name', data);
    const defaultType = getOr(types.STRING, 'type', data);
    const defaultAlias = getOr(null, 'alias', data);
    const defaultClassName = getOr(null, 'className', data);
    this.state = {
      data: {
        type: defaultType,
        name: defaultName,
        alias: defaultAlias,
        className: defaultClassName,
      },
      isObject: defaultType === types.OBJECT
    };
  }

  getData = ({
   type,
   name,
   alias,
   className
  }) => {
    const { data } = this.props;
    const dataToAddOn = (data != null && data.type === type) ? data : addOnData[type];
    return {
      ...dataToAddOn,
      type,
      name,
      alias,
      className
    };
  }

  handleSubmit = () => {
    const {
      path, callback
    } = this.props;
    const {
      data: {
        name, type, alias, className
      }
    } = this.state;
    // TODO: validate default value according to the type
    return callback(path, this.getData({
      name,
      type,
      alias,
      className
    }));
  }

  setDataField = (field) => (value) => {
    const { data } = this.state;
    this.setState({ data: { ...data, [field]: value } });
  }

  setName = (e) => this.setDataField('name')(e.target.value)

  setAlias = (e) => this.setDataField('alias')(e.target.value)

  setClassName = (e) => this.setDataField('className')(e.target.value)

  // the parameter of onChange function in antd select is the value
  setType = (value) => {
    this.setDataField('type')(value);
    this.setState({
      isObject: value === types.OBJECT
    });
  }

  render() {
    const { isChildNodeOfObject } = this.props;
    const {
      data: {
        alias, name, type, className
      }
    } = this.state;
    return (
      <Form>
        {
          isChildNodeOfObject ? (
            <Form.Item label="名称">
              <Input defaultValue={name} onChange={this.setName} />
            </Form.Item>
          ) : null
        }
        {
          isChildNodeOfObject ? (
            <Form.Item label="别名">
              <Input defaultValue={alias} onChange={this.setAlias} />
            </Form.Item>
          ) : null
        }
        {
          this.state.isObject ? (
            <Form.Item label="类名">
              <Input defaultValue={className} onChange={this.setClassName} />
            </Form.Item>
          ) : null
        }
        <Form.Item label="类型">
          <Select defaultValue={type} onChange={this.setType}>{typeOptions}</Select>
        </Form.Item>
      </Form>
    );
  }
}
