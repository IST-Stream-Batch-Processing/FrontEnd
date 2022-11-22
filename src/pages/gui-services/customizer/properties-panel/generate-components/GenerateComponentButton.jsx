import React from 'react';
import { Button, Icon } from 'antd';
import {componentIconMapping, convertTypeToDisplayName} from '../../../../../utils/gui-service/guihelper';

export default function GenerateComponentButton(props) {
    const drag = (e) => {
        e.dataTransfer.setData('text', e.target.value);
    };

    return (
        <Button
            size="large"
            onDragStart={drag}
            className="customizer-component-btn"
            draggable
            value={props.value}
        >
            <Icon
                size="large"
                type={componentIconMapping[props.value]}
                style={{fontSize: 24, marginBottom: 4}}
            />
            <br />
            {convertTypeToDisplayName[props.value]}
        </Button>
    );
}
