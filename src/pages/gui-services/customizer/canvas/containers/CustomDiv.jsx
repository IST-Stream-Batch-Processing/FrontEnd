import React, {useState} from 'react';
import {Layout} from 'antd';
import CustomText from '../components/CustomText';
import CustomTitle from '../components/CustomTitle';
import CustomParagraph from '../components/CustomParagraph';
import CustomImage from '../components/CustomImage';
import CustomTable from '../components/CustomTable';
import {
    convertTypeToDisplayName,
    handleHoverExit,
    handleHoverStart,
    styleHandler
} from '../../../../../utils/gui-service/guihelper';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import CustomDatePicker from '../components/CustomDatePicker';
import CustomSelector from '../components/CustomSelector';
import CustomSwitch from '../components/CustomSwitch';
import {addNewComponent, getContainerData, handleComponentFocus} from '../../../../../utils/gui-service/dataHelper';

export default function CustomDiv(props) {
    const allowDrop = (e) => {
        e.preventDefault();
    };

    // CustomDiv目前允许所有组件
    const drop = (e) => {
        e.preventDefault();
        const data = e.dataTransfer.getData('text');
        if (data === 'layout' || !Object.keys(convertTypeToDisplayName).find((key) => key === data)) return;
        console.log(data);
        addNewComponent(props.containerId, data);
        props.reloadEditor();
    };

    // 可以自定义该容器下组件的渲染
    const renderComponents = (container) => container.components.map((component) => {
        const customKey = `custom-com-container-${props.containerId}-component-${component.id}`;

        switch (component.type) {
            case 'text':
                return (
                    <CustomText
                        key={customKey}
                        containerId={container.id}
                        componentId={component.id}
                        reloadEditor={() => props.reloadEditor()}
                    />
                );
            case 'title':
                return (
                    <CustomTitle
                        key={customKey}
                        containerId={container.id}
                        componentId={component.id}
                        reloadEditor={() => props.reloadEditor()}
                    />
                );
            case 'paragraph':
                return (
                    <CustomParagraph
                        key={customKey}
                        containerId={container.id}
                        componentId={component.id}
                        reloadEditor={() => props.reloadEditor()}
                    />
                );
            case 'image':
                return (
                    <CustomImage
                        key={customKey}
                        containerId={container.id}
                        componentId={component.id}
                        reloadEditor={() => props.reloadEditor()}
                    />
                );
            case 'table':
                return (
                    <CustomTable
                        key={customKey}
                        containerId={container.id}
                        componentId={component.id}
                        reloadEditor={() => props.reloadEditor()}
                    />
                );
            case 'button':
                return (
                    <CustomButton
                        key={customKey}
                        containerId={container.id}
                        componentId={component.id}
                        reloadEditor={() => props.reloadEditor()}
                    />
                );
            case 'input':
                return (
                    <CustomInput
                        key={customKey}
                        containerId={container.id}
                        componentId={component.id}
                        reloadEditor={() => props.reloadEditor()}
                    />
                );
            case 'datepicker':
                return (
                    <CustomDatePicker
                        key={customKey}
                        containerId={container.id}
                        componentId={component.id}
                        reloadEditor={() => props.reloadEditor()}
                    />
                );
            case 'selector':
                return (
                    <CustomSelector
                        key={customKey}
                        containerId={container.id}
                        componentId={component.id}
                        reloadEditor={() => props.reloadEditor()}
                    />
                );
            case 'switch':
                return (
                    <CustomSwitch
                        key={customKey}
                        containerId={container.id}
                        componentId={component.id}
                        reloadEditor={() => props.reloadEditor()}
                    />
                );
            default:
                return null;
        }
    });

    return (
        <Layout
            className="canvas-element custom-div"
            onDrop={drop}
            onDragOver={allowDrop}
            onClick={(e) => {
                e.stopPropagation();
                handleComponentFocus(e, 'con', props.containerId);
                props.reloadEditor();
            }}
            onMouseOver={(e) => {
                e.stopPropagation();
                handleHoverStart(e);
            }}
            onMouseLeave={(e) => handleHoverExit(e)}
            style={styleHandler(getContainerData(props.containerId).styleProperties)}
        >
            {renderComponents(getContainerData(props.containerId))}
        </Layout>
    );
}
