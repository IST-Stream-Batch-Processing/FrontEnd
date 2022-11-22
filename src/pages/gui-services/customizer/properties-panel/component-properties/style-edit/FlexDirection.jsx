import {Form, Select} from 'antd';
import React from 'react';
import {changeSelectedProperty, getSelectedPropertyData} from "../../../../../../utils/gui-service/dataHelper";

const {Item} = Form;

export default function FlexDirection(props) {
    const keys = ['row', 'row-reverse', 'column', 'column-reverse'];

    return (
        <Item label="FlexDirection">
            <Select
                defaultValue={getSelectedPropertyData().styleProperties.flexDirection}
                onSelect={(value) => {
                    const temp = getSelectedPropertyData();
                    temp.styleProperties.flexDirection = value;
                    changeSelectedProperty(temp);
                    props.reloadEditor();
                }}
            >
                {keys.map((key) => (
                    <Select.Option key={`flexDirection-${key}`} value={key}>{key}</Select.Option>
                ))}
            </Select>
        </Item>
    );
}
