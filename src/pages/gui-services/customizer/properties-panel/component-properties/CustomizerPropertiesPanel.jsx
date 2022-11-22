import React from 'react';
import {Divider, Typography} from 'antd';
import {convertTypeToDisplayName, } from '../../../../../utils/gui-service/guihelper';
import ComponentProperties from './ComponentProperties';
import {
    getComponentData,
    getContainerData,
    getSelectedProperty,
    getSelectedPropertyData
} from '../../../../../utils/gui-service/dataHelper';
import ContainerProperties from './ContainerProperties';

const {Title} = Typography;

export default function CustomizerPropertiesPanel(props) {
    const header = (title) => (
            <div>
                <Title level={4}>
                    {title}
                </Title>
                <Divider />
            </div>
        );
    // 如果选择容器
    const renderContainer = () => {
        const currentContainer = getContainerData(getSelectedProperty().containerId);
        return (
            <>
                {header(convertTypeToDisplayName[currentContainer.type])}
                <ContainerProperties reloadEditor={props.reloadEditor} />
            </>
        );
    };

    // 如果选择组件
    const renderCustomComponent = () => {
        const currentComponent = getSelectedPropertyData();
        return (
            <>
                {header(convertTypeToDisplayName[currentComponent.type])}
                <ComponentProperties reloadEditor={props.reloadEditor} />
            </>
        );
    };

    // 当前选择的是组件还是容器
    return (
        <div className="customizer-custom-panel">
            {getSelectedProperty().type !== null ?
                (getSelectedProperty().type !== 'con' ?
                    renderCustomComponent()
                    : renderContainer())
                : null}
        </div>
    );
}
