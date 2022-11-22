import React from 'react';
import {styleHandler} from '../../../../utils/gui-service/guihelper';
import {addNewContainer, getLayoutEditData} from '../../../../utils/gui-service/dataHelper';
import CustomDiv from './containers/CustomDiv';

export default function CustomizerCanvas(props) {
    const allowDrop = (e) => {
        e.preventDefault();
    };

    // 界面允许拖拽的容器类型
    const drop = (e) => {
        e.preventDefault();
        const data = e.dataTransfer.getData('text');
        if (data !== 'layout' && data !== 'form') {
            return;
        }
        addNewContainer(data);
        props.reloadEditor();
    };

    const renderContainers = () => getLayoutEditData().containers.map((container) => (
        <CustomDiv containerId={container.id} reloadEditor={() => props.reloadEditor()} />
    ));

    return (
        <div
            id="customizer-canvas-page"
            className="layout-view"
            onDrop={drop}
            onDragOver={allowDrop}
            style={styleHandler(getLayoutEditData().styleProperties)}
        >
            {renderContainers()}
        </div>
    );
}
