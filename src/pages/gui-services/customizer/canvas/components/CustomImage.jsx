import React from 'react';
import {Card} from 'antd';
import {propertiesHandler, styleHandler} from '../../../../../utils/gui-service/guihelper';
import {getComponentData, handleComponentFocus} from '../../../../../utils/gui-service/dataHelper';

export default function CustomImage(props) {
    const data = getComponentData(props.containerId, props.componentId);

    return data ? (
        <Card
            className="canvas-component"
            onClick={(e) => {
                e.stopPropagation();
                handleComponentFocus(e, 'com', props.containerId, props.componentId);
                props.reloadEditor();
            }}
            style={styleHandler(data.styleProperties)}
            {...propertiesHandler(data.staticProperties)}
            cover={(
                <img
                    src={data.staticProperties.url}
                    {...propertiesHandler(data.staticProperties)}
                    style={styleHandler(data.styleProperties)}
                    alt=""
                />
            )}
        />
    ) : null;
}
