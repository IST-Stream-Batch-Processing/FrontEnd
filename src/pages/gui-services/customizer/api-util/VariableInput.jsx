import {Input, Select} from 'antd';
import React from 'react';

const {Option} = Select;

export default function VariableInput(props) {
    const renderValueInput = (currentType) => {
        switch (currentType) {
            case 'Int':
                return (
                    <Input
                        placeholder="常量值"
                        style={{marginRight: 10, flex: 3}}
                        onChange={(e) => props.changeFieldValue(e.target.value)}
                        type="number"
                    />
                );
            case 'Double':
                return (
                    <Input
                        placeholder="常量值"
                        style={{marginRight: 10, flex: 3}}
                        onChange={(e) => props.changeFieldValue(e.target.value)}
                        type="number"
                        step={0.001}
                    />
                );
            case 'Char':
                return (
                    <Input
                        placeholder="常量值"
                        style={{marginRight: 10, flex: 3}}
                        onChange={(e) => props.changeFieldValue(e.target.value)}
                        type="text"
                        maxLength={1}
                    />
                );
            case 'Bool':
                return (
                    <Select
                        placeholder="常量值"
                        style={{marginRight: 10, flex: 3}}
                        onChange={(value) => props.changeFieldValue(value)}
                    >
                        <Option value={1}>True</Option>
                        <Option value={0}>False</Option>
                    </Select>
                );
            case 'String':
                return (
                    <Input
                        placeholder="常量值"
                        style={{marginRight: 10, flex: 3}}
                        onChange={(e) => props.changeFieldValue(e.target.value)}
                        type="text"
                    />
                );
            default:
                return null;
        }
    };

    return renderValueInput(props.currentValue);
}
