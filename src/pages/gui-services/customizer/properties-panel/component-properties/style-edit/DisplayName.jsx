import {Form, Input} from 'antd';
import React from 'react';
import {changeSelectedProperty, getSelectedPropertyData} from "../../../../../../utils/gui-service/dataHelper";

const {Item} = Form;

export default function DisplayName(props) {
    return (
        <Item label="名称">
            <Input
                defaultValue={getSelectedPropertyData().displayName}
                onChange={(value) => {
                    const temp = getSelectedPropertyData();
                    temp.displayName = value.target.value;
                    changeSelectedProperty(temp);
                    props.reloadEditor();
                }}
            />
        </Item>
    );
}
