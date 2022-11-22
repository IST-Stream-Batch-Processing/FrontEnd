import React from 'react';
import { Input } from 'antd';
import ReactDOM from 'react-dom';
import {canvasElementsOnDragEnd, propertiesHandler, styleHandler} from '../../../../../utils/gui-service/guihelper';
import {getComponentData, handleComponentFocus} from '../../../../../utils/gui-service/dataHelper';

export default function CustomInput(props) {
    const data = getComponentData(props.containerId, props.componentId);

    return data ? (
        <Input
            className="canvas-component element"
            onClick={(e) => {
                e.stopPropagation();
                handleComponentFocus(e, 'com', props.containerId, props.componentId);
                props.reloadEditor();
            }}
            style={styleHandler(data.styleProperties)}
            {...propertiesHandler(data.staticProperties)}
        />
    ) : null;
}
