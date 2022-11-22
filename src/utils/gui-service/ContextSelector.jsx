import React from 'react';
import {Cascader, Form} from 'antd';
import {getContext} from './dataHelper';

export const getContextOptions = (context, isInitial = false) => {
    const options = [
        {
            value: 'atomicService',
            label: '原子服务',
            children: context.atomicService ? context.atomicService : []
        },
        {
            value: 'component',
            label: '组件输入',
            children: context.component ? context.component : []
        },
        {
            value: 'dataModel',
            label: '数据模型',
            children: context.dataModel ? context.dataModel : []
        },
        {
            value: 'embedded',
            label: '内置数据',
            children: context.embedded ? context.embedded : []
        },
        {
            value: 'input',
            label: '输入变量',
            children: context.input ? context.input : []
        },
        {
            value: 'constant',
            label: '输入常量',
            children: context.constant ? context.constant : []
        },
        {
            value: 'multiService',
            label: '组合服务',
            children: context.multiService ? context.multiService : []
        }
    ];
    if (isInitial) {
        return [options[3], options[4], options[5]];
    }
    if (context.tableApi !== null) {
        if (context.tableApi.actionType === 'getOne') {
            options.push({
                value: 'tableElement',
                label: '列表数据',
                children: context.tableApi
            });
        } else {
            options.push({
                value: 'tableElement',
                label: '列表数据',
                children: context.tableApi
            });
        }
    }
    return options;
};

class ContextSelector extends React.PureComponent {
    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form.Item style={{width: '100%'}} label={this.props.labelName} key={this.props.cascaderKey}>
                {getFieldDecorator(this.props.cascaderKey, {
                    rules: [{
                        required: true,
                        message: '请为输入变量指定数据来源!'
                    }],
                    initialValue: this.props.initialValue
                })(
                    <Cascader style={this.props.style} options={this.props.options ? this.props.options : getContextOptions(getContext())} />
                )}
                {this.props.bindingButton ? this.props.bindingButton : null}
            </Form.Item>
        );
    }
}

export default ContextSelector;
