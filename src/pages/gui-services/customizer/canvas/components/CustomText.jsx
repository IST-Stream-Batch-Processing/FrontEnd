import React, {useEffect, useRef, useState} from 'react';
import {Typography} from 'antd';
import {canvasPoints, propertiesHandler, styleHandler} from '../../../../../utils/gui-service/guihelper';
import {
    getComponentData,
    handleComponentFocus,
    setComponentData,
    setSelectedProperty
} from '../../../../../utils/gui-service/dataHelper';

const {Text} = Typography;

export default function CustomText(props) {
    const data = getComponentData(props.containerId, props.componentId);

    const oriPos = useRef({
        top: 0,
        left: 0,
        cX: 0,
        cY: 0
    });

    const isDown = useRef(false);

    function onMouseDown(e) {
        e.stopPropagation();
        isDown.current = true;
        const top = e.target.offsetTop;
        const left = e.target.offsetLeft;
        const cY = e.clientY;
        const cX = e.clientX;
        oriPos.current = {
            top, left, cX, cY
        };
    }

    function onMouseMove(e) {
        e.stopPropagation();
        if (!isDown.current) return;
        const top = oriPos.current.top + (e.clientY - oriPos.current.cY);
        const left = oriPos.current.left + (e.clientX - oriPos.current.cX);
        // data.styleProperties.top = Math.max(0, Math.min(top,));
        data.styleProperties.top = top;
        data.styleProperties.left = left;
        setComponentData(props.containerId, props.componentId, data);
        props.reloadEditor();
    }

    function onMouseUp(e) {
        isDown.current = false;
    }

    return data ? (
        <Text
            className="canvas-component element"
            onClick={(e) => {
                e.stopPropagation();
                handleComponentFocus(e, 'com', props.containerId, props.componentId);
                props.reloadEditor();
            }}
            style={styleHandler(data.styleProperties)}
            {...propertiesHandler(data.staticProperties)}
            onMouseDown={(e) => onMouseDown(e)}
            onMouseMove={(e) => onMouseMove(e)}
            onMouseUp={(e) => onMouseUp(e)}
        >
            {canvasPoints.map(item => <div className={`control-point point-${item}`} />)}
            {data.staticProperties.text ? data.staticProperties.text : data.displayName}
        </Text>
    ) : null;
}
