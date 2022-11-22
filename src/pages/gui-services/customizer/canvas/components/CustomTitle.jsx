import React from 'react';
import ReactDOM from 'react-dom';
import { Typography } from 'antd';
import {canvasElementsOnDragEnd, propertiesHandler, styleHandler} from '../../../../../utils/gui-service/guihelper';
import {getComponentData, handleComponentFocus} from '../../../../../utils/gui-service/dataHelper';

const {Title} = Typography;

export default function CustomTitle(props) {
    const data = getComponentData(props.containerId, props.componentId);

    return data ? (
        <Title
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
        </Title>
    ) : null;
}
