import {
    ComponentList, findContainerIndex, findLastIndex, getContextByData, getSelectedApi, handleFocus,
} from './guihelper';

// 目前被选中的组件、容器详细数据
let selectedProperty = {
    type: null,
    containerId: null,
    componentId: null,
    buttonId: null
};

export function setSelectedProperty(newData = null) {
    if (!newData) {
        selectedProperty = {
            type: null,
            containerId: null,
            componentId: null,
            buttonId: null
        };
    } else {
        selectedProperty = newData;
    }
}

export function getSelectedProperty() {
    return selectedProperty;
}

export let tableData = [];

export function setTableData(newData) {
    tableData = newData;
}

export function getTableData() {
    return tableData;
}

export let layoutsData = [];

export function setLayoutsData(newData) {
    layoutsData = newData;
}

export function getLayoutsData() {
    return layoutsData;
}

export let asServices = [];

export function setAsServices(newData) {
    asServices = newData;
}

export function getAsServices() {
    return asServices;
}

export let osServices = [];

export function setOsServices(newData) {
    osServices = newData;
}

export function getOsServices() {
    return osServices;
}

export function findServiceById(id) {
    return getAsServices().find((item) => item.id === id) ? getAsServices().find((item) => item.id === id)
        : getOsServices().find((item) => item.id === id) ? getOsServices().find((item) => item.id === id)
            : {};
}

export function findDataModelById(id) {
    return getTableData().find((item) => item.id === id) ? getTableData().find((item) => item.id === id) : {};
}

export let layoutEditData = null;

export function getContainerData(containerId) {
    return layoutEditData.containers.find((container) => container.id === containerId);
}

export function setComponentData(containerId, componentId, newComponentData, buttonId = null) {
    const containerPos = layoutEditData.containers.findIndex((container) => container.id === containerId);
    const container = layoutEditData.containers[containerPos];
    const componentPos = container.components.findIndex((comp) => comp.id === componentId);
    const component = container.components[componentPos];
    if (buttonId === null) layoutEditData.containers[containerPos].components[componentPos] = newComponentData;
    else {
        const buttonPos = component.buttons.findIndex((button) => button.id === buttonId);
        layoutEditData.containers[containerPos].components[componentPos].buttons[buttonPos] = newComponentData;
    }
    // eslint-disable-next-line no-use-before-define
    setLayoutEditData(layoutEditData);
}

export function getComponentData(containerId, componentId, buttonId = null) {
    const container = getContainerData(containerId);
    const component = container.components.find((comp) => comp.id === componentId);
    if (buttonId === null) return component;
    return component.buttons.find((button) => button.id === buttonId);
}

export function deleteApiFromLayoutData(id) {
    const index = layoutEditData.apis.findIndex((item) => item.tableId === id || item.serviceId === id);
    layoutEditData.apis.splice(index, 1);
}

export function changeDataModelActionType(id, actionType) {
    const index = layoutEditData.apis.findIndex((item) => item.tableId === id || item.serviceId === id);
    if (layoutEditData.apis[index].type !== 'dataModel') return;
    layoutEditData.apis[index].actionType = actionType;
}

export function saveQueryList(id, queryList) {
    const index = layoutEditData.apis.findIndex((item) => item.tableId === id);
    if (layoutEditData.apis[index].type !== 'dataModel') return;
    layoutEditData.apis[index].queryCondition = queryList;
}

export function saveBindingMap(id, bindingMap) {
    const index = layoutEditData.apis.findIndex((item) => item.tableId === id || item.serviceId === id);
    layoutEditData.apis[index].bindingMap = bindingMap;
}

export let context = {
    embedded: [{value: 'userId', label: '用户id'}],
    dataModel: [],
    component: [],
    atomicService: [],
    input: [],
    constant: [],
    multiService: []
};

// TODO decouple getContextByData
export function setContext() {
    if (selectedProperty.type === 'btn') {
        const component = getComponentData(selectedProperty.containerId, selectedProperty.componentId);
        const tableApi = getSelectedApi(layoutEditData.apis, component.dataSource);
        context = getContextByData(layoutEditData, tableApi);
    }
    context = getContextByData(layoutEditData);
}

export function getContext() {
    return context;
}

export function setLayoutEditDataField(fieldName, value) {
    layoutEditData[fieldName] = value;
    setContext();
}

export function setLayoutEditData(newData) {
    layoutEditData = newData;
    setContext();
    console.log(layoutEditData);
}

export function getLayoutEditData() {
    return layoutEditData;
}

export function addNewContainer(type) {
    layoutEditData.containers.push({
        id: findLastIndex(getLayoutEditData().containers),
        displayName: `容器${findLastIndex(getLayoutEditData().containers) + 1}`,
        type,
        components: [],
        styleProperties: {
            'display': 'flex',
            'position': getLayoutEditData().styleProperties.display === 'flex' ? 'relative' : 'absolute',
            'top': getLayoutEditData().styleProperties.display === 'flex' ? null : '0',
            'left': getLayoutEditData().styleProperties.display === 'flex' ? null : '0',
            'flexDirection': 'row',
            'marginTop': '0%',
            'marginLeft': '0%',
            'marginRight': '0%',
            'marginBottom': '0%',
            'paddingTop': '0%',
            'paddingLeft': '0%',
            'paddingRight': '0%',
            'paddingBottom': '0%',
            'width': '100%',
            'height': '100%',
        },
    });
    setContext();
}

export function getNewTableButton(component) {
    const newComponentData = {
        type: 'button',
        staticProperties: {
            text: '按钮文本',
            type: 'primary',
        },
        styleProperties: {
            'position': component.styleProperties.display === 'flex' ? 'relative' : 'absolute',
            'top': component.styleProperties.display === 'flex' ? null : '0',
            'left': component.styleProperties.display === 'flex' ? null : '0',
            'marginTop': '0%',
            'marginLeft': '0%',
            'marginRight': '0%',
            'marginBottom': '0%',
            'width': '100px',
            'height': '30px',
            'fontSize': '14'
        },
        api: {
            type: 'atomicService',
            in: null,
            out: null,
            bindingMap: {}
        },
        conditionalOutputs: []
    };
    newComponentData.id = findLastIndex(component.buttons);
    newComponentData.displayName = `组件${findLastIndex(component.buttons) + 1}`;
    // 获取拖动位置的坐标
    newComponentData.type = 'button';
    return newComponentData;
}

export function getNewComponentData(container, type) {
    let newComponentData;
    switch (type) {
        case 'button':
            newComponentData = {
                type: 'button',
                staticProperties: {
                    text: '按钮文本',
                    type: 'primary',
                },
                styleProperties: {
                    'position': container.styleProperties.display === 'flex' ? 'relative' : 'absolute',
                    'top': container.styleProperties.display === 'flex' ? null : '0',
                    'left': container.styleProperties.display === 'flex' ? null : '0',
                    'marginTop': '0%',
                    'marginLeft': '0%',
                    'marginRight': '0%',
                    'marginBottom': '0%',
                    'width': '100px',
                    'height': '30px',
                    'fontSize': '14'
                },
                api: {
                    type: 'atomicService',
                    in: null,
                    out: null,
                    bindingMap: {}
                },
                conditionalOutputs: []
            };
            break;
        case 'input':
            newComponentData = {
                type: 'input',
                staticProperties: {
                    placeholder: '输入框文本',
                    prefix: '',
                    suffix: '',
                    // type: 'text',
                },
                styleProperties: {
                    'position': container.styleProperties.display === 'flex' ? 'relative' : 'absolute',
                    'top': container.styleProperties.display === 'flex' ? null : '0',
                    'left': container.styleProperties.display === 'flex' ? null : '0',
                    'marginTop': '0%',
                    'marginLeft': '0%',
                    'marginRight': '0%',
                    'marginBottom': '0%',
                    'width': '200px',
                    'height': '30px'
                },
                field: ''
            };
            break;
        case 'text':
            newComponentData = {
                type: 'text',
                staticProperties: {
                    text: '文字文本',
                },
                styleProperties: {
                    'position': container.styleProperties.display === 'flex' ? 'relative' : 'absolute',
                    'top': container.styleProperties.display === 'flex' ? null : '0',
                    'left': container.styleProperties.display === 'flex' ? null : '0',
                    'width': '100px',
                    'height': '30px',
                    'marginTop': '0%',
                    'marginLeft': '0%',
                    'marginRight': '0%',
                    'marginBottom': '0%',
                    'fontSize': '14',
                },
                bindingMap: {}
            };
            break;
        case 'title':
            newComponentData = {
                type: 'title',
                staticProperties: {
                    text: '标题文本'
                },
                styleProperties: {
                    'position': container.styleProperties.display === 'flex' ? 'relative' : 'absolute',
                    'top': container.styleProperties.display === 'flex' ? null : '0',
                    'left': container.styleProperties.display === 'flex' ? null : '0',
                    'width': '100px',
                    'height': '30px',
                    'marginTop': '0%',
                    'marginLeft': '0%',
                    'marginRight': '0%',
                    'marginBottom': '0%',
                    'fontSize': '20'
                },
                bindingMap: {}
            };
            break;
        case 'image':
            newComponentData = {
                type: 'image',
                staticProperties: {
                    url: 'url'
                },
                styleProperties: {
                    'position': container.styleProperties.display === 'flex' ? 'relative' : 'absolute',
                    'top': container.styleProperties.display === 'flex' ? null : '0',
                    'left': container.styleProperties.display === 'flex' ? null : '0',
                    'width': '100px',
                    'height': '30px',
                    'marginTop': '0%',
                    'marginLeft': '0%',
                    'marginRight': '0%',
                    'marginBottom': '0%',
                },
                bindingMap: {}
            };
            break;
        case 'table':
            newComponentData = {
                type: 'table',
                staticProperties: {
                    pageNumber: 10,
                    paginationPosition: 'bottom'
                },
                styleProperties: {
                    'position': container.styleProperties.display === 'flex' ? 'relative' : 'absolute',
                    'top': container.styleProperties.display === 'flex' ? null : '0',
                    'left': container.styleProperties.display === 'flex' ? null : '0',
                    'width': '100%',
                    'height': '100%',
                    'marginTop': '0%',
                    'marginLeft': '0%',
                    'marginRight': '0%',
                    'marginBottom': '0%',
                },
                dataSource: {
                    type: 'dataModel',
                    field: null,
                    dataModelId: null
                },
                buttons: [],
                showFields: []
            };
            break;
        case 'selector':
            newComponentData = {
                type: 'selector',
                staticProperties: {
                    mode: 'tags',
                    placeholder: '请选择'
                    // type: 'text',
                },
                styleProperties: {
                    'position': container.styleProperties.display === 'flex' ? 'relative' : 'absolute',
                    'top': container.styleProperties.display === 'flex' ? null : '0',
                    'left': container.styleProperties.display === 'flex' ? null : '0',
                    'marginTop': '0%',
                    'marginLeft': '0%',
                    'marginRight': '0%',
                    'marginBottom': '0%',
                    'width': '10%',
                    'height': '3%'
                },
                dataSource: {
                    type: 'dataModel',
                    field: null,
                    dataModelId: null
                },
            };
            break;
        case 'paragraph':
            newComponentData = {
                type: 'paragraph',
                staticProperties: {
                    text: '文字文本',
                    copyable: 'true',
                    code: null,
                    delete: null,
                    ellipsis: null,
                    mark: null,
                    underline: null,
                    italic: null
                },
                styleProperties: {
                    'position': container.styleProperties.display === 'flex' ? 'relative' : 'absolute',
                    'top': container.styleProperties.display === 'flex' ? null : '0',
                    'left': container.styleProperties.display === 'flex' ? null : '0',
                    'width': '100px',
                    'height': '30px',
                    'marginTop': '0%',
                    'marginLeft': '0%',
                    'marginRight': '0%',
                    'marginBottom': '0%',
                    'fontSize': '14'
                },
                bindingMap: {}
            };
            break;
        case 'switch':
            newComponentData = {
                type: 'switch',
                staticProperties: {
                    'checkedChildren': '选中时内容',
                    'unCheckedChildren': '未选中时内容',
                    'defaultChecked': null
                },
                styleProperties: {
                    'position': container.styleProperties.display === 'flex' ? 'relative' : 'absolute',
                    'top': container.styleProperties.display === 'flex' ? null : '0',
                    'left': container.styleProperties.display === 'flex' ? null : '0',
                    'marginTop': '0%',
                    'marginLeft': '0%',
                    'marginRight': '0%',
                    'marginBottom': '0%',
                    'width': '120px',
                    'height': '30px'
                },
                field: ''
            };
            break;
        case 'datepicker':
            newComponentData = {
                type: 'datepicker',
                staticProperties: {
                    'allowClear': null,
                    'bordered': null,
                    'picker': 'date',
                    'placeholder': '请选择时间',
                    'placement': 'bottomLeft'
                },
                styleProperties: {
                    'position': container.styleProperties.display === 'flex' ? 'relative' : 'absolute',
                    'top': container.styleProperties.display === 'flex' ? null : '0',
                    'left': container.styleProperties.display === 'flex' ? null : '0',
                    'marginTop': '0%',
                    'marginLeft': '0%',
                    'marginRight': '0%',
                    'marginBottom': '0%',
                    'width': '120px',
                    'height': '30px'
                },
                field: ''
            };
            break;
        default:
            console.error(`Wrong Component Type: ${type}`);
    }
    newComponentData.id = findLastIndex(container.components);
    if (ComponentList.indexOf(type) > -1) newComponentData.field = `${container.id}-${newComponentData.id}`;
    newComponentData.displayName = `组件${findLastIndex(container.components) + 1}`;
    // 获取拖动位置的坐标
    newComponentData.type = type;
    return newComponentData;
}

export function addNewComponent(containerId, type) {
    // const newComponentData = getNewComponentData(getContainerData(containerId).components, type, containerId);
    // 获取拖动位置的坐标
    // newComponentData.styleProperties.left = e.nativeEvent.offsetX;
    // newComponentData.styleProperties.top = e.nativeEvent.offsetY;
    layoutEditData.containers.map((container) => {
        if (container.id === containerId) {
            const containerData = getContainerData(containerId);
            return container.components.push(getNewComponentData(containerData, type));
        }
        return container;
    });
    setContext();
}

// 修改目前选中的组件
export function handleComponentFocus(e, type, containerId, componentId = null, buttonId = null) {
    selectedProperty.type = type;
    selectedProperty.containerId = containerId;
    selectedProperty.componentId = componentId;
    selectedProperty.buttonId = buttonId;
    if (e) handleFocus(e);
    setContext();
}

export function getSelectedPropertyData() {
    switch (getSelectedProperty().type) {
        case 'con':
            return layoutEditData.containers.find((container) => container.id === selectedProperty.containerId);
        case 'com':
            return layoutEditData.containers.find((container) => container.id === selectedProperty.containerId).components
                .find((component) => component.id === selectedProperty.componentId);
        case 'btn':
            return layoutEditData.containers.find((container) => container.id === selectedProperty.containerId).components
                .find((component) => component.id === selectedProperty.componentId).buttons
                .find((button) => button.id === selectedProperty.buttonId);
        default:
            return null;
    }
}

export function changeSelectedProperty(newData) {
    switch (getSelectedProperty().type) {
        case 'con':
            layoutEditData.containers.map((container) => {
                if (container.id === selectedProperty.containerId) {
                    return newData;
                }
                return container;
            });
            break;
        case 'com':
            layoutEditData.containers.map((container) => {
                if (container.id === selectedProperty.containerId) {
                    return container.components.map((component) => {
                        if (component.id === selectedProperty.componentId) {
                            return newData;
                        }
                        return component;
                    });
                }
                return container;
            });
            break;
        case 'btn':
            layoutEditData.containers.map((container) => {
                if (container.id === selectedProperty.containerId) {
                    return container.components.map((component) => {
                        if (component.id === selectedProperty.componentId) {
                            return component.buttons.map((button) => {
                                if (button.id === selectedProperty.buttonId) {
                                    return newData;
                                }
                                return button;
                            });
                        }
                        return component;
                    });
                }
                return container;
            });
            break;
        default:
            break;
    }
    setContext();
}

// 删除组件或容器的详细信息，由详细面板保存修改时触发
export function deleteSelectedProperty() {
    switch (getSelectedProperty().type) {
        case 'con':
            layoutEditData.containers.splice(findContainerIndex(getLayoutEditData().containers, getSelectedProperty().containerId), 1);
            break;
        case 'com':
            layoutEditData.containers.map((container) => {
                if (container.id === selectedProperty.containerId) {
                    return container.components.splice(findContainerIndex(container.components, getSelectedProperty().componentId), 1);
                }
                return container;
            });
            break;
        case 'btn':
            layoutEditData.containers.map((container) => {
                if (container.id === selectedProperty.containerId) {
                    container.components.map((component) => {
                        if (component.id === selectedProperty.componentId) {
                            component.buttons.splice(findContainerIndex(component.buttons, getSelectedProperty().buttonId), 1);
                        }
                        return component;
                    });
                }
                return container;
            });
            break;
        default:
            return;
    }
    setSelectedProperty();
    setContext();
}

export function savePropertyBindingMap(id, fieldName, bindingMap) {
    const data = getSelectedPropertyData();
    data.api[fieldName] = bindingMap;
    changeSelectedProperty(data);
}
