import {Form, Input} from 'antd';
import React from 'react';
import {changeSelectedProperty, getSelectedPropertyData} from "../../../../../../utils/gui-service/dataHelper";

const {Item} = Form;

export default function Flex(props) {
    return (
        <Item label="Flex">
            <Input
                defaultValue={getSelectedPropertyData().styleProperties.flex}
                onChange={(value) => {
                    const temp = getSelectedPropertyData();
                    temp.styleProperties.flex = value.target.value;
                    changeSelectedProperty(temp);
                    props.reloadEditor();
                }}
            />
        </Item>
    );
}
