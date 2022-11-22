import React from 'react';
import {
Cascader, Form, Tag, Tree
} from 'antd';
import {TagOutlined} from '@ant-design/icons';
import {fromBindingToContextSelector, fromContextSelectorToBinding} from '../../../../utils/gui-service/guihelper';
import {getContextOptions} from '../../../../utils/gui-service/ContextSelector';
import {getContext, getLayoutEditData} from '../../../../utils/gui-service/dataHelper';

const {TreeNode} = Tree;

const getConstantValue = (key, constants) => {
    // eslint-disable-next-line consistent-return,no-restricted-syntax,guard-for-in
    const obj = constants.find(c => c?.name === key);
    return obj.value;
};

export const getColorByType = (typeName) => {
    let color;
    switch (typeName) {
        case 'Object':
        case 'dataModel':
            color = 'cyan';
            break;
        case 'Bool':
        case 'atomicService':
            color = 'red';
            break;
        case 'Char':
            color = 'volcano';
            break;
        case 'Double':
            color = 'magenta';
            break;
        case 'Int':
        case 'Integer':
            color = 'gold';
            break;
        case 'List':
        case 'multiService':
            color = 'lime';
            break;
        case 'Long':
            color = 'geekblue';
            break;
        default:
            color = 'purple';
    }
    return color;
};

export const myConcat = (fatherPath, fieldName) => (fatherPath === '' ? fatherPath.concat(fieldName) : fatherPath.concat('.').concat(fieldName));

class TypeTree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            basicFields: []
        };
    }

    handleAlias = (fieldName, alias) => ((alias === '' || alias === undefined || alias === null) ? fieldName : alias)

    typeNameAndColorUtil = (type) => {
        const displayTypeName = type.name === 'Object' ? type.className : type.name;
        const color = getColorByType(type.name);
        return [displayTypeName, color];
    }

    getDefaultOptionsByKey = (key) => {
        if (!this.props.data || !this.props.data.bindingMap) return [];
        const binding = this.props.data.bindingMap[key];
        return fromBindingToContextSelector(binding);
    }

    handleTitle(key, type, fieldName, alias, bindable) {
        const [displayTypeName, color] = this.typeNameAndColorUtil(type);
        const {getFieldDecorator} = this.props.form;
        const element = (
            <div style={{display: 'flex', flex: 3, justifyContent: 'space-between'}}>
                <div style={{
                    display: 'inline-block',
                    flex: 1,
                    textAlign: 'center'
                }}
                >
                    {this.handleAlias(fieldName, alias)}
                </div>
                {
                    getFieldDecorator(key || '$', {
                        initialValue: this.getDefaultOptionsByKey(key || '$')
                    })(<Cascader
                        size="small"
                        options={getContextOptions(getContext(), !this.props.isButton)}
                        style={{flex: 4, marginLeft: 10}}
                        onPopupVisibleChange={(value) => {
                            if (!value) this.handleSubmit();
                        }}
                    />)
                }
            </div>
        );

        return (
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div style={{flex: 1}}>
                    <Tag color={color} style={{marginRight: '4px'}}>
                        <TagOutlined style={{marginRight: '4px'}} />
                        {displayTypeName}
                    </Tag>
                </div>
                {bindable && element}
            </div>
        );
    }

    handleType = (type) => {
        const [displayTypeName, color] = this.typeNameAndColorUtil(type);
        return (
            <Tag color={color} style={{marginRight: '4px'}}>
                <TagOutlined style={{marginRight: '4px'}} />
                {displayTypeName}
            </Tag>
        );
    }

    renderNode(key, currentField) {
        const {
            name, alias, type
        } = currentField;
        switch (type.name) {
            case 'Object':
                return (
                    <TreeNode title={this.handleTitle(null, type, name, alias, false)}>
                        {type.fields.map((item) => this.renderNode(myConcat(key, currentField.name), item, true))}
                    </TreeNode>
                );
            case 'List':
                return (
                    <TreeNode title={this.handleTitle(myConcat(key, currentField.name), type, name, alias, true)}>
                        <TreeNode title={this.handleType(type.memberType)} />
                    </TreeNode>
                );
            default:
                return (
                    <TreeNode title={this.handleTitle(myConcat(key, currentField.name), type, name, alias, true)} />
                );
        }
    }

    handleSubmit = () => {
        const {getFieldValue, validateFields} = this.props.form;
        validateFields((err) => {
            if (!err) {
                // 生成bindingMap，通过注入的函数传递给父组件
                const {basicFields} = this.state;
                const bindingMap = new Map();
                basicFields.forEach((fieldPath) => {
                    let values = getFieldValue(fieldPath);
                    if (values[0] === 'constant') values[2] = getConstantValue(values[1], getLayoutEditData().constant);
                    bindingMap[`${fieldPath}`] = fromContextSelectorToBinding(values);
                });
                this.props.saveBindingMap(bindingMap);
            } else {
                console.error('数据源绑定失败');
            }
        });
    }

    componentDidMount() {
        this.collectBasicFields('', this.props.field);
    }

    collectBasicFields = (path, currentField) => {
        const {type, name} = currentField;
        switch (type.name) {
            case 'Object':
                type.fields.forEach((field) => {
                    this.collectBasicFields(myConcat(path, name), field);
                });
                break;
            default:
                const {basicFields} = this.state;
                basicFields.push(myConcat(path, name));
                this.setState({basicFields});
        }
    }

    render() {
        if (!this.props.data) return null;
        return (
            <Tree style={{marginRight: '10%'}} defaultExpandAll>
                {this.renderNode('', this.props.field)}
            </Tree>
        );
    }
}

const tree = Form.create({})(TypeTree);

export default tree;
