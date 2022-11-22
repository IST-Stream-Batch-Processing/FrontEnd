import {Form, Select} from 'antd';
import React from 'react';
import {changeSelectedProperty, getSelectedPropertyData} from "../../../../../../utils/gui-service/dataHelper";

export default function JustifyContent(props) {
    const keys = [
        'center',
        'start',
        'end',
        'flex-start',
        'flex-end',
        'left',
        'right',
        'normal',
        'space-between',
        'space-around',
        'space-evenly',
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
        <Form.Item label="JustifyContent">
            <Select
                defaultValue={getSelectedPropertyData().styleProperties.justifyContent}
                onSelect={(value) => {
                    const temp = getSelectedPropertyData();
                    temp.styleProperties.justifyContent = value;
                    changeSelectedProperty(temp);
                    props.reloadEditor();
                }}
            >
                {keys.map((key) => (
                    <Select.Option key={`justifyContent-${key}`} value={key}>{key}</Select.Option>
                ))}
            </Select>
        </Form.Item>
    );
}
