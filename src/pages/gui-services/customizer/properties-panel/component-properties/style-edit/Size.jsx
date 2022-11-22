import {Form, Input, Select} from 'antd';
import React from 'react';
import {changeSelectedProperty, getSelectedPropertyData} from "../../../../../../utils/gui-service/dataHelper";

const {Item} = Form;

export default function Size(props) {
    const units = ['%', 'px', 'vh', 'vw'];

    const getUnit = (key) => units.find((unit) => key.endsWith(unit));

    const unitSelect = (key) => (
        <Select defaultValue={getUnit(key)} size="small">
            {units.map((unit) => (<Select.Option value={unit}>{unit}</Select.Option>))}
        </Select>
    );

    return (
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <Item key={`${props.ukey}-width`} label="Width">
                <Input
                    size="small"
                    defaultValue={getSelectedPropertyData().styleProperties.width}
                    onChange={(value) => {
                        const temp = getSelectedPropertyData();
                        temp.styleProperties.width = value.target.value;
                        changeSelectedProperty(temp);
                        props.reloadEditor();
                    }}
                />
            </Item>
            <Item key={`${props.ukey}-height`} label="Height">
                <Input
                    size="small"
                    defaultValue={getSelectedPropertyData().styleProperties.height}
                    onChange={(value) => {
                        const temp = getSelectedPropertyData();
                        temp.styleProperties.height = value.target.value;
                        changeSelectedProperty(temp);
                        props.reloadEditor();
                    }}
                />
            </Item>
        </div>
    );
}
