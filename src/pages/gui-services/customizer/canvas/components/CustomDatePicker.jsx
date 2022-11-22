import React from 'react';
import { DatePicker } from 'antd';
import {propertiesHandler, styleHandler} from '../../../../../utils/gui-service/guihelper';
import {getComponentData, handleComponentFocus} from '../../../../../utils/gui-service/dataHelper';

export default function CustomDatePicker(props) {
    const data = getComponentData(props.containerId, props.componentId);

    return data ? (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
        <div
            onClick={(e) => {
                e.stopPropagation();
                handleComponentFocus(e, 'com', props.containerId, props.componentId);
                props.reloadEditor();
            }}
        >
            <DatePicker
                className="canvas-component"
                style={styleHandler(data.styleProperties)}
                {...propertiesHandler(data.staticProperties)}
            />
        </div>
    ) : null;
}
