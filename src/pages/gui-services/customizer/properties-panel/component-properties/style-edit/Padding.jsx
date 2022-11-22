import {Form, Input, Select} from 'antd';
import React from 'react';
import Text from 'antd/es/typography/Text';
import {changeSelectedProperty, getSelectedPropertyData} from "../../../../../../utils/gui-service/dataHelper";

const {Item} = Form;

export default function Padding(props) {
    const keys = ['paddingLeft', 'paddingTop', 'paddingRight', 'paddingBottom'];
    const units = ['%', 'px', 'vh', 'vw'];

    const getUnit = (key) => units.find((unit) => key.endsWith(unit));

    const unitSelect = (key) => (
        <Select defaultValue={getUnit(key)} size="small">
            {units.map((unit) => (<Select.Option value={unit}>{unit}</Select.Option>))}
        </Select>
    );

    return (
        <div>
            <Text>Padding: （左-上-右-下）</Text>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                {keys.map((key, index) => (
                    <Item style={{width: '22.5%'}}>
                        <Input
                            key={`padding-${key}`}
                            size="small"
                            defaultValue={getSelectedPropertyData().styleProperties[`${key}`]}
                            onChange={(value) => {
                                const temp = getSelectedPropertyData();
                                temp.styleProperties[`${key}`] = value.target.value;
                                changeSelectedProperty(temp);
                                props.reloadEditor();
                            }}
                        />
                    </Item>
                ))}
            </div>
        </div>
    );
}
