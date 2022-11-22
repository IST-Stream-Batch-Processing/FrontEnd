import React from 'react';
import {Switch} from 'antd';
import {propertiesHandler, styleHandler} from '../../../../../utils/gui-service/guihelper';
import {getComponentData, handleComponentFocus} from '../../../../../utils/gui-service/dataHelper';

export default function CustomSwitch(props) {
    const data = getComponentData(props.containerId, props.componentId);

    return data ? (
        <Switch
            className="custom-input canvas-component"
            onClick={(val, e) => {
                e.stopPropagation();
                handleComponentFocus(e, 'com', props.containerId, props.componentId);
                props.reloadEditor();
            }}
            style={styleHandler(data.styleProperties)}
            {...propertiesHandler(data.staticProperties)}
        />
    ) : null;
}
