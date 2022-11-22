import React from 'react';
import {Tree, Tag} from 'antd';
import {
    TagOutlined, StarOutlined, ArrowRightOutlined
} from '@ant-design/icons';
import {useDispatch} from 'react-redux';
import Edit from './Edit';

const {TreeNode} = Tree;

export default function TypeTree(field = {}) {
    const dispatch = useDispatch();
    const myType = field.name;
    function handleAlias(fieldName, alias) {
        return (alias === '' || alias === undefined || alias === null) ? fieldName : alias;
    }

    function typeNameAndColorUtil(type) {
        const displayTypeName = type.name === 'Object' ? type.className : type.name;
        let color;
        switch (type.name) {
            case 'Object':
                color = 'cyan';
                break;
            case 'Bool':
                color = 'red';
                break;
            case 'Char':
                color = 'volcano';
                break;
            case 'Double':
                color = 'magenta';
                break;
            case 'Integer':
                color = 'gold';
                break;
            case 'List':
                color = 'lime';
                break;
            case 'Long':
                color = 'geekblue';
                break;
            case 'File':
                color = 'blue';
                break;
            default:
                color = 'purple';
        }
        return [displayTypeName, color];
    }

    function handleTitle(key, type, fieldName, alias, editable) {
        const [displayTypeName, color] = typeNameAndColorUtil(type);
        const element = (
            <>
                <ArrowRightOutlined />
                &nbsp;
                <Edit myKey={key} defaultValue={handleAlias(fieldName, alias)} myType={myType} />
            </>
        );

        return (
            <div>
                <Tag color={color}>
                    <TagOutlined />
                    &nbsp;
                    {displayTypeName}
                </Tag>
                {editable && element}
            </div>
        );
    }

    function handleType(type) {
        const [displayTypeName, color] = typeNameAndColorUtil(type);
        return (
            <div>
                <Tag color={color}>
                    <TagOutlined />
                    {displayTypeName}
                </Tag>
            </div>
        );
    }

    function render(currentField, editable = false) {
        const {
            name, alias, type, key
        } = currentField;

        switch (type.name) {
            case 'Object':
                return (
                    <TreeNode title={handleTitle(key, type, name, alias, editable)}>
                    {type.fields.map((item) => render(item, true))}
                    </TreeNode>
                );
            case 'List':
                return (
                    <TreeNode title={handleTitle(key, type, name, alias, editable)}>
                        <TreeNode title={handleType(type.memberType)} />
                    </TreeNode>
                );
            default:
                return (
                    <TreeNode title={handleTitle(key, type, name, alias, editable)} />
                );
        }
    }

    return (
        <div>
             <Tree>
                {render(field)}
             </Tree>
        </div>
    );
}
