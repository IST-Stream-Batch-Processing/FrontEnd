import React, {useEffect, useState} from 'react';
import {Button} from 'antd';
import {propertiesHandler, styleHandler} from '../../../../../utils/gui-service/guihelper';
import {getComponentData, handleComponentFocus} from '../../../../../utils/gui-service/dataHelper';

export default function CustomButton(props) {
    const data = getComponentData(props.containerId, props.componentId);

    return data ? (
        <Button
            className="canvas-component element"
            onClick={(e) => {
                e.stopPropagation();
                handleComponentFocus(e, 'com', props.containerId, props.componentId);
                props.reloadEditor();
            }}
            style={styleHandler(data.styleProperties)}
            {...propertiesHandler(data.staticProperties)}
        >
            {data.staticProperties.text ? data.staticProperties.text : data.displayName}
        </Button>
    ) : null;
}
