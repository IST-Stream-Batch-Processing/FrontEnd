import {Form, Radio} from 'antd';
import React from 'react';
import {changeSelectedProperty, getSelectedPropertyData} from '../../../../../../utils/gui-service/dataHelper';

const {Item} = Form;

export default function Display(props) {
    const keys = {
        'flex': '流式',
        'inline': '内嵌',
        'block': '块式',
        'none': '无'
    };

    function changeProperty(value) {
        const layoutContainer = getSelectedPropertyData();
        if (value === 'flex') {
            layoutContainer.components.map((component) => {
                component.styleProperties.position = 'relative';
                return component;
            });
        } else {
            layoutContainer.components.map((component) => {
                component.styleProperties.position = 'absolute';
                return component;
            });
        }
        layoutContainer.styleProperties.display = value;
        changeSelectedProperty(layoutContainer);
        props.reloadEditor();
    }

    return (
        <Item label="布局">
            <Radio.Group
                buttonStyle="solid"
                style={{display: 'flex', flexDirection: 'row'}}
                defaultValue={getSelectedPropertyData().styleProperties.display}
                onChange={(e) => { changeProperty(e.target.value); }}
            >
                {Object.keys(keys).map((key) => (
                    <Radio.Button
                        key={`display-${key}`}
                        value={key}
                        style={{flex: 1, textAlign: 'center'}}
                    >
                        {keys[key]}
                    </Radio.Button>
                ))}
            </Radio.Group>
        </Item>
    );
}
