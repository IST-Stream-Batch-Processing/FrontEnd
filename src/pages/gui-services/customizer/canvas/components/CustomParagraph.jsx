import React from 'react';
import { Typography } from 'antd';
import {propertiesHandler, styleHandler} from '../../../../../utils/gui-service/guihelper';
import {getComponentData, handleComponentFocus} from '../../../../../utils/gui-service/dataHelper';

const {Paragraph} = Typography;

export default function CustomParagraph(props) {
    const data = getComponentData(props.containerId, props.componentId);

    return data ? (
        <Paragraph
            className="canvas-component"
            onClick={(e) => {
                e.stopPropagation();
                handleComponentFocus(e, 'com', props.containerId, props.componentId);
                props.reloadEditor();
            }}
            style={styleHandler(data.styleProperties)}
            {...propertiesHandler(data.staticProperties)}
        >
            {data.staticProperties.text ? data.staticProperties.text : data.displayName}
        </Paragraph>
    ) : null;
}
