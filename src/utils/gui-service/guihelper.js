// 将英文的类型map到中文显示的名称
export const convertTypeToDisplayName = {
    layout: '基本容器',
    form: '表单',
    button: '按钮',
    text: '文字',
    input: '输入框',
    title: '标题',
    image: '图片',
    paragraph: '字段',
    datepicker: '日期选择',
    selector: '选择器',
    switch: '开关',
    table: '列表',
};

export const serviceDisplayTypeName = {
    atomicService: '原子服务',
    multiService: '组合服务',
    dataModel: '数据服务',
};

export const canvasPoints = ['e', 'w', 's', 'n', 'ne', 'nw', 'se', 'sw'];

export const ComponentList = ['input', 'selector', 'datepicker', 'switch'];

// export function getDataModelOptionsWithRelation(fieldProperties) {
//     const fields = [];
//     const relations = [];
//     fieldProperties.forEach((item) => {
//         const names = item.name.split('.');
//         console.log(item.name.split('.'));
//         if (names.length === 1) {
//             fields.push({value: names[0], label: names[0]});
//         } else {
//             relations.push({value: names[1], label: names[1]});
//         }
//     });
//     return fields.concat({value: '关联', label: '关联', children: relations});
// }

// 获取最大的新索引
export const findLastIndex = (arraylist) => {
    let lastIndex = -1;
    arraylist.forEach((item) => {
        if (item.id > lastIndex) lastIndex = item.id;
    });
    return lastIndex + 1;
};

// 使用容器id查找容器
export const findContainer = (containers, containerId) => containers.find((container) => container.id === parseInt(containerId, 10));

// 使用容器id与组件id查找组件
export const findComponent = (containers, containerId, componentId) => findContainer(findContainer(containers, containerId).components, componentId);

export const findTableButton = (containers, containerId, componentId, buttonId) => findContainer(findContainer(findContainer(containers, containerId).components, componentId).buttons, buttonId);

// 使用容器id查找对应容器的索引
export const findContainerIndex = (containers, containerId) => containers.findIndex((container) => container.id === parseInt(containerId, 10));

// 使用itemId查找context中条目的索引
export const findIndex = (array, dstId) => array.findIndex((item) => item.id === dstId);

// 使用容器id与新的容器更新容器列表
export const updateContainer = (containers, containerId, newContainer) => {
    const newContainers = containers;
    newContainers[findContainerIndex(containers, containerId)] = newContainer;
    return newContainers;
};

// 使用容器id、组件id与新的组件更新容器列表
export const updateComponent = (containers, containerId, componentId, newComponent) => {
    const newContainer = findContainer(containers, containerId);
    const newComponents = newContainer.components;
    newComponents[findContainerIndex(newComponents, componentId)] = newComponent;
    newContainer.components = newComponents;
    const newContainers = containers;
    newContainers[findContainerIndex(containers, containerId)] = newContainer;
    return newContainers;
};

export const updateTableButton = (containers, containerId, componentId, buttonId, newButton) => {
    const newContainer = findContainer(containers, containerId);
    const newComponents = newContainer.components;
    const newComponent = findContainer(newComponents, componentId);
    const newButtons = newComponent.buttons;
    newButtons[findContainerIndex(newButtons, buttonId)] = newButton;
    newComponent.buttons = newButtons;
    newComponents[findContainerIndex(newComponents, componentId)] = newComponent;
    newContainer.components = newComponents;
    const newContainers = containers;
    newContainers[findContainerIndex(containers, containerId)] = newContainer;
    return newContainers;
};

export const componentIconMapping = {
    'layout': 'layout',
    'form': 'form',
    'text': 'font-size',
    'title': 'line-height',
    'paragraph': 'file-text',
    'image': 'file-image',
    'table': 'unordered-list',
    'input': 'italic',
    'button': 'border-outer',
    'datepicker': 'calendar',
    'selector': 'database',
    'switch': 'check-circle'
};

// 画布中的悬浮高光效果
export const handleHoverStart = (e) => {
    const elements = document.getElementsByTagName('*');
    for (let i = 0; i < elements.length; i += 1) {
        elements[i].classList.remove('hover-canvas-element');
    }
    e.target.classList.add('hover-canvas-element');
};

export const handleFocus = (e) => {
    const elements = document.getElementsByTagName('*');
    for (let i = 0; i < elements.length; i += 1) {
        elements[i].classList.remove('focus-canvas-element');
        elements[i].classList.remove('hover-canvas-element');
    }
    if (e.target) e.target.classList.add('focus-canvas-element');
};

export const handleHoverExit = (e) => {
    e.target.classList.remove('hover-canvas-element');
};

function handleAlias(field) {
    return (field.alias === '' || field.alias === undefined || field.alias === null) ? field.name : field.alias;
}

/**
 * 原子服务生成Api
 * @param data
 * @param type
 * @returns {{}}
 */
export function generateApiFromService(data, type) {
    const api = {};
    api.in = data.inType;
    api.out = data.outType;
    api.bindingMap = data.bindingMap;
    api.serviceId = data.id;
    api.serviceName = data.name;
    api.type = type;
    return api;
}

/**
 * 将dataModel中的类型转换为common可识别的后类型名
 * @param fieldType
 * @returns {string|*}
 */
function dataTypeMapToType(fieldType) {
    if (fieldType === 'string') return 'String';
    if (fieldType === 'Int') return 'Integer';
    return fieldType;
}

export function generateApiFromDataSource(data) {
    const api = {};
    api.in = {name: 'Integer'};
    const fields = [];
    data.fieldProperty.forEach((item) => {
        console.log(item);
        fields.push({name: item.fieldName, type: {name: dataTypeMapToType(item.fieldType)}});
    });
    api.out = {name: 'Object', fields};
    api.bindingMap = data.bindingMap ? data.bindingMap : {};
    api.tableId = data.id;
    api.dataModelName = data.tableName;
    api.actionType = 'getOne';
    api.type = 'dataModel';
    api.queryCondition = data.queryCondition;
    return api;
}

export function generateTypeFromTableFieldProperties(table, type) {
    const fields = [];
    table.fieldProperty.forEach((item) => {
        const values = item.fieldName.split('.');
        if (values[0] !== '关联') fields.push({name: item.fieldName, type: {name: dataTypeMapToType(item.fieldType)}});
    });
    if (type === 'put') fields.push({name: 'id', type: {name: 'Integer'}});
    return fields;
}

export function generateApiFromDataModel(tableData, bindingMap, actionType) {
    const api = {};
    api.tableId = tableData.id;
    api.dataModelName = tableData.tableName;
    api.actionType = actionType;
    api.type = 'dataModel';
    const fields = generateTypeFromTableFieldProperties(tableData);

    if (actionType === 'getOne') {
        api.in = {name: 'Integer'};
        api.out = {
            name: 'Object',
            fields
        };
    }
    if (actionType === 'getAll') {
        api.out = {
            name: 'Object',
            fields
        };
    }
    if (actionType === 'post') {
        api.in = {
            name: 'Object',
            fields
        };
    }
    if (actionType === 'put') {
        api.in = {
            name: 'Object',
            fields
        };
    }
    if (actionType === 'delete') {
        api.in = {name: 'Integer'};
        api.out = {
            name: 'Object',
            fields
        };
    }
    api.bindingMap = bindingMap;
    return api;
}

export function fromBindingToStaticProperty(component, propertyName) {
    const newComponent = component;
    newComponent.staticProperties[propertyName] = '';
    delete newComponent.bindingMap[propertyName];
    return newComponent;
}

export function fromStaticPropertyToBinding(component, propertyName) {
    const newComponent = component;
    newComponent.bindingMap[propertyName] = {};
    delete newComponent.staticProperties[propertyName];
    return newComponent;
}

// 生成一个dataSource
export function fromContextSelectorToBinding(values) {
    if (!values || values === '' || values === [] || values.length === 0) return null;
    const contextType = values[0];
    const binding = {
        type: contextType,
    };
    if (contextType === 'atomicService' || contextType === 'multiService') {
        binding.serviceId = values[1];
        binding.field = '';
        for (let index = 2; index < values.length; index += 1) {
            binding.field = binding.field.concat(binding.field === '' ? values[index] : '.'.concat(values[index]));
        }
    }
    if (contextType === 'component') {
        binding.containerId = values[1];
        binding.componentId = values[2];
        binding.field = `${binding.containerId}-${binding.componentId}`;
    }
    if (contextType === 'dataModel') {
        binding.dataModelId = values[1];
        if (values[2] === '关联') binding.field = values[2].concat(values[3]);
        else binding.field = values[2];
    }
    if (contextType === 'embedded') {
        binding.field = values[1];
    }
    if (contextType === 'input') {
        binding.field = values[1];
    }
    if (contextType === 'tableElement') {
        binding.field = values[1];
    }
    if (contextType === 'constant') {
        binding.field = values[1];
        binding.value = values[2];
    }
    return binding;
}

// 将contextSelector的结果提取成bindingMap的数据格式
export function fromContextSelectorsToBindingMap(getFieldValue, keysName, fieldDecoratorName) {
    const bindingMap = [];
    getFieldValue(keysName).forEach((key) => {
        bindingMap[key] = fromContextSelectorToBinding(getFieldValue(`${fieldDecoratorName}[${key}]`));
    });
    return {...bindingMap};
}

export function fromBindingToContextSelector(binding) {
    if (!binding || !binding.type) return [];
    let values = [binding.type];
    if (values[0] === 'atomicService' || values[0] === 'multiService') {
        values[1] = binding.serviceName;
        values = values.concat(binding.field.split('.'));
    }
    if (values[0] === 'component') {
        values[1] = binding.containerId;
        values[2] = binding.componentId;
    }
    if (values[0] === 'dataModel') {
        values[1] = binding.dataModelId;
        values[2] = binding.field;
    }
    if (values[0] === 'embedded') {
        values[1] = binding.field;
    }
    if (values[0] === 'input') {
        values[1] = binding.field;
    }
    if (values[0] === 'tableElement') {
        values[1] = binding.field;
    }
    if (values[0] === 'constant') {
        values[1] = binding.field;
        values[2] = binding.value;
    }
    return values;
}

export function generateComponentContext(containers) {
    const componentContext = [];
    containers.forEach((container) => {
        componentContext.push({
            value: container.id,
            label: container.displayName,
            children: container.components.map((component) => {
                if (ComponentList.indexOf(component.type) > -1) {
                    return {
                        value: component.id,
                        label: component.displayName
                    };
                }
                return {};
            })
        });
    });
    return componentContext;
}

function generateInputContext(input) {
    const res = [];
    input.forEach((item) => {
        res.push({value: item.name, label: item.name});
    });
    return res;
}

function generateConstantContext(constant) {
    const res = [];
    constant.forEach((item) => {
        res.push({value: item.name, label: item.name, constantValue: item.value});
    });
    return res;
}

export function FieldToSelectOption(field) {
    const {type} = field;
    if (!type) return [];
    const res = [];
    if (type.name === 'Object') {
        type.fields.forEach((fieldItem) => {
            res.push({value: fieldItem.name, label: handleAlias(fieldItem), children: FieldToSelectOption(fieldItem)});
        });
    }
    return res;
}

export function isRelation(field) {
    return field.includes('.');
}

export function generateTableElementContext(tableApi) {
    if (tableApi === null) return [];
    const myOut = {};
    const res = [{label: 'id', value: 'id'}];
    // Object.keys(tableApi.out).forEach((key) => {
    //     myOut[`${key}`] =
    // });
    if (tableApi.actionType === 'getOne') {
        tableApi.out.fields.forEach((item) => {
            res.push({value: item.name, label: item.name});
        });
    } else {
        tableApi.out.fields.forEach((item) => {
            if (!isRelation(item.name)) {
                res.push({value: item.name, label: item.name});
            }
        });
    }
    return res;
}

function generateDataModelContext(containers, apis) {
    const res = [];
    apis.forEach((api) => {
        if (api.type === 'dataModel') {
            if (api.actionType === 'getOne') {
                res.push({
                    value: api.tableId,
                    label: api.dataModelName,
                    children: FieldToSelectOption({name: '', type: api.out})
                });
            } else res.push({value: api.tableId, label: api.dataModelName});
        }
    });
    containers.forEach((container) => {
        container.components.forEach((component) => {
            if (component.type === 'button' && component.api && component.api.type === 'dataModel') {
                res.push({
                    value: component.api.tableId,
                    label: component.api.dataModelName,
                    children: FieldToSelectOption({name: '', type: component.api.out})
                });
            }
        });
    });
    return res;
}

function generateASContext(containers, apis) {
    const res = [];
    apis.forEach((api) => {
        if (api.type === 'atomicService') {
            res.push({
                value: api.serviceId,
                label: api.serviceName,
                children: FieldToSelectOption({name: '', type: api.out})
            });
        }
    });
    containers.forEach((container) => {
        container.components.forEach((component) => {
            if (component.type === 'button' && component.api && component.api.type === 'atomicService') {
                res.push({
                    value: component.api.serviceId,
                    label: component.api.serviceName,
                    children: FieldToSelectOption({name: '', type: component.api.out})
                });
            }
        });
    });
    return res;
}

function generateOSContext(containers, apis) {
    const res = [];
    apis.forEach((api) => {
        if (api.type === 'multiService') {
            res.push({
                value: api.serviceId,
                label: api.serviceName,
                children: FieldToSelectOption({name: '', type: api.out})
            });
        }
    });
    containers.forEach((container) => {
        container.components.forEach((component) => {
            if (component.type === 'button' && component.api && component.api.type === 'multiService') {
                res.push({
                    value: component.api.serviceId,
                    label: component.api.serviceName,
                    children: FieldToSelectOption({name: '', type: component.api.out})
                });
            }
        });
    });
    return res;
}

export function getContextByData(layoutData, tableApi = null) {
    return {
        embedded: [{value: 'userId', label: '用户id'}, {value: 'username', label: '用户名'}, {value: 'positionId', label: '角色Id'}, {value: 'positionName', label: '角色名称'}, {value: 'departmentId', label: '部门Id'}, {value: 'departmentName', label: '部门名称'}],
        dataModel: generateDataModelContext(layoutData.containers, layoutData.apis),
        component: generateComponentContext(layoutData.containers),
        atomicService: generateASContext(layoutData.containers, layoutData.apis),
        input: generateInputContext(layoutData.input),
        constant: generateConstantContext(layoutData.constant),
        multiService: generateOSContext(layoutData.containers, layoutData.apis),
        tableApi: generateTableElementContext(tableApi)
    };
}

export const defaultLayoutStyleProperties = {
    'display': 'flex',
    'flexDirection': 'row',
    'justifyContent': 'center',
    'alignItems': 'center',
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
};

export const propertiesHandler = (staticProperties) => {
    const properties = {};
    Object.entries(staticProperties).forEach((entry) => {
        const [key, value] = entry;
        if (key !== 'text') properties[key] = value;
    });
    return properties;
};

export const getSelectedApi = (apis, dataSource) => {
    let selectedDataSourceApi = {};
    if (dataSource.type === 'dataModel') {
        selectedDataSourceApi = apis.find((api) => api.tableId === dataSource.dataModelId);
    } else if (dataSource.type === 'atomicService' || dataSource.type === 'multiService') {
        selectedDataSourceApi = apis.find((api) => api.serviceId === dataSource.serviceId);
    }
    return selectedDataSourceApi;
};

export const getTableDataSourceOptions = (apis) => {
    const options = [
        {
            value: 'dataModel',
            label: '数据模型',
            children: []
        },
        {
            value: 'atomicService',
            label: '原子服务',
            children: []
        },
        {
            value: 'multiService',
            label: '组合服务',
            children: []
        },
    ];
    apis.forEach((api) => {
        if (api.type === 'dataModel') {
            options[0].children.push({value: api.tableId, label: api.dataModelName});
        } else if (api.type === 'atomicService') {
            options[1].children.push({value: api.serviceId, label: api.serviceName});
        } else if (api.type === 'multiService') {
            options[2].children.push({value: api.serviceId, label: api.serviceName});
        }
    });
    options[0].disabled = options[0].children.length === 0;
    options[1].disabled = options[1].children.length === 0;
    options[2].disabled = options[2].children.length === 0;

    return options;
};

export const styleHandler = (styleProperties) => {
    // console.log(styleProperties);
    const styles = {};
    Object.entries(styleProperties).forEach((entry) => {
        const [key, value] = entry;
        if (!Number.isNaN(parseInt(value, 10)) && (typeof value === 'string' && value.indexOf('%') === -1)) styles[key] = parseInt(value, 10);
        else {
            styles[key] = value;
        }
    });
    return styles;
};

export const clientStyleHandler = (styleProperties) => {
    const styles = {};
    Object.entries(styleProperties).forEach((entry) => {
        const [key, value] = entry;
        if (!Number.isNaN(parseInt(value, 10)) && (typeof value === 'string' && value.indexOf('%') === -1)) styles[key] = parseInt(value, 10);
        else {
            styles[key] = value;
        }
        if (key === 'fontSize') {
            styles[key] = parseFloat(value) / 0.76;
        }
    });
    // console.log(styles);
    return styles;
};

export const canvasElementsOnDragEnd = (e, props, x, y) => {
    const newComponent = props.currentComponent;
    const newLeft = parseFloat(newComponent.styleProperties.left);
    const newTop = parseFloat(newComponent.styleProperties.top);
    newComponent.styleProperties.left = newLeft + e.nativeEvent.offsetX - x;
    newComponent.styleProperties.top = newTop + e.nativeEvent.offsetY - y;
    const newContainer = props.currentContainer;
    newContainer.components[newContainer.components.find((component) => component.id === newComponent.id)] = newComponent;
    props.refreshContainers(props.currentContainer.id, newContainer);
};
