import React from 'react';
import '../../editor.css';
import {Icon, Menu} from 'antd';
import {componentIconMapping, } from '../../../../../utils/gui-service/guihelper';
import {getLayoutEditData, handleComponentFocus} from '../../../../../utils/gui-service/dataHelper';

const {Item, SubMenu} = Menu;

export default function Hierarchy(props) {
    const getItems = (items, grandParentId, parentId) => items.map((item) => (
        <Item
            key={`expandable-btn-container-${grandParentId}-component-${parentId}-button-${item.id}`}
            onClick={() => handleComponentFocus('btn', grandParentId, parentId, item.id)}
        >
            <Icon type={componentIconMapping[item.type]} />
            {item.displayName}
        </Item>
    ));

    const getComponents = (components, containerId) => components.map((component) => (
        component.type === 'table' && component.buttons.length > 0 ? (
            <SubMenu
                key={`hierarchy-com-container-${containerId}-component-${component.id}`}
                title={(
                    <span>
                    <Icon type={componentIconMapping[component.type]} />
                        {component.displayName}
                    </span>
                )}
                onTitleClick={() => handleComponentFocus('com', containerId, component.id)}
            >
                {getItems(component.buttons, containerId, component.id)}
            </SubMenu>
        ) : (
            <Item
                key={`hierarchy-com-container-${containerId}-component-${component.id}`}
                onClick={() => handleComponentFocus('com', containerId, component.id)}
            >
                <Icon type={componentIconMapping[component.type]} />
                {component.displayName}
            </Item>
        )

    ));

    const getContainers = (containers) => containers.map((container) => (
        <SubMenu
            key={`hierarchy-con-${container.id}`}
            title={(
                <span>
                    <Icon type={componentIconMapping[container.type]} />
                    {container.displayName}
                </span>
            )}
            onTitleClick={() => handleComponentFocus('con', container.id)}
        >
            {getComponents(container.components, container.id)}
        </SubMenu>
    ));
    return (
        <Menu mode="inline" className="customizer-custom-panel">
            {getContainers(getLayoutEditData().containers)}
        </Menu>
    );
}
