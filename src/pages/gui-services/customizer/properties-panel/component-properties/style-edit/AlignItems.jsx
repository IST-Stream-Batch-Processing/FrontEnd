import {Form, Select} from 'antd';
import React from 'react';
import {changeSelectedProperty, getSelectedPropertyData} from "../../../../../../utils/gui-service/dataHelper";

export default function AlignItems(props) {
    const keys = [
        'center',
        'start',
        'end',
        'flex-start',
        'flex-end',
        'baseline',
        'first baseline',
        'last baseline',
        'normal',
        'stretch',
        'safe center',
        'unsafe center',
        'inherit',
        'initial',
        'revert',
        'revert-layer',
        'unset',
    ];

    return (
        <Form.Item label="AlignItems">
            <Select
                defaultValue={getSelectedPropertyData().styleProperties.alignItems}
                onSelect={(value) => {
                    const temp = getSelectedPropertyData();
                    temp.styleProperties.alignItems = value;
                    changeSelectedProperty(temp);
                    props.reloadEditor();
                }}
            >
                {keys.map((key) => (
                    <Select.Option key={`alignItems-${key}`} value={key}>{key}</Select.Option>
                ))}
            </Select>
        </Form.Item>
    );
}
