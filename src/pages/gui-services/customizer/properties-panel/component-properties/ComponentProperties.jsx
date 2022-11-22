import React from 'react';
import {
Button, Card, Divider, Form,
} from 'antd';
import PropertyEditor from './PropertyEditor';
import BindingMap from './BindingMap';
import {
    fromContextSelectorToBinding,
    generateApiFromDataModel,
    generateApiFromService,
    getSelectedApi,
    getTableDataSourceOptions,
} from '../../../../../utils/gui-service/guihelper';
import SetSelector from './SetSelector';
import ExpandableList from './ExpandableList';
import ContextSelector from '../../../../../utils/gui-service/ContextSelector';
import ConditionalOutputs from './ConditionalOutputs';
import {
    changeSelectedProperty,
    deleteSelectedProperty,
    getComponentData,
    getContainerData,
    getLayoutEditData,
    getLayoutsData,
    getSelectedProperty,
    getTableData,
    setComponentData
} from '../../../../../utils/gui-service/dataHelper';
import DisplayName from './style-edit/DisplayName';
import Flex from './style-edit/Flex';
import Display from './style-edit/Display';
import FlexDirection from './style-edit/FlexDirection';
import JustifyContent from './style-edit/JustifyContent';
import AlignItems from './style-edit/AlignItems';
import Margin from './style-edit/Margin';
import Padding from './style-edit/Padding';
import Size from './style-edit/Size';
import APISelector from "./APISelector/APISelector";

const {Item} = Form;

const getConstantValue = (key, constants) => {
    // eslint-disable-next-line consistent-return,no-restricted-syntax,guard-for-in
    const obj = constants.find(c => c?.name === key);
    return obj.value;
};

const getTableDataSource = (selection) => {
    switch (selection[0]) {
        case 'dataModel':
            return {
                type: selection[0],
                dataModelId: selection[1],
            };
        case 'atomicService':
            return {
                type: selection[0],
                serviceId: selection[1],
            };
        case 'multiService':
            return {
                type: selection[0],
                serviceId: selection[1],
            };
        default:
            return {
                type: null,
            };
    }
};

// 展示性容器的properties panel
class ComponentProperties extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        };
    }

    getApiServiceProperties = (serviceId, bindingMap, currentService, type) => {
        const data = currentService;
        data.bindingMap = bindingMap;
        this.props.form.setFieldsValue({
            apiData: generateApiFromService(data, type)
        });
    }

    getApiDataModelProperties = (dataModelId, bindingMap, currentTable, actionType, s) => {
        this.props.form.setFieldsValue({
            apiData: generateApiFromDataModel(currentTable, bindingMap, actionType, s)
        });
    }

    reloadEditor = (componentData) => {
        setComponentData(getSelectedProperty().containerId, getSelectedProperty().componentId, componentData, getSelectedProperty().buttonId);
        this.props.reloadEditor();
    }

    renderSpecializedProperties = (componentData) => {
        switch (componentData.type) {
            case 'button':
                return (
                    <>
                        <APISelector reloadEditor={() => this.props.reloadEditor()} form={this.props.form} />
                        <Divider />
                    </>
                );
            case 'input':
                return null;
            case 'switch':
                // return (<BindingMap form={this.props.form} reloadEditor={() => this.props.reloadEditor()} />);
                return null;
            case 'datepicker':
                return null;
            case 'image':
                return (
                    <BindingMap
                        ukey={`${componentData.id}-component`}
                        form={this.props.form}
                        reloadEditor={() => this.props.reloadEditor()}
                    />
                );
            case 'title':
                return (
                    <BindingMap
                        ukey={`${componentData.id}-component`}
                        form={this.props.form}
                        reloadEditor={() => this.props.reloadEditor()}
                    />
                );
            case 'text':
                return (
                    <BindingMap
                        ukey={`${componentData.id}-component`}
                        form={this.props.form}
                        reloadEditor={() => this.props.reloadEditor()}
                    />
                );
            case 'paragraph':
                return (
                    <BindingMap
                        ukey={`${componentData.id}-component`}
                        form={this.props.form}
                        reloadEditor={() => this.props.reloadEditor()}
                    />
                );
            case 'table':
                const selectedDataSourceApi = getSelectedApi(getLayoutEditData().apis, componentData.dataSource);
                return (
                    <>
                        <ContextSelector
                            form={this.props.form}
                            labelName="数据源信息配置"
                            cascaderKey="dataSourceSelector"
                            initialValue={[componentData.dataSource.type, componentData.dataSource.dataModelId ? componentData.dataSource.dataModelId : componentData.dataSource.serviceId]}
                            options={getTableDataSourceOptions(getLayoutEditData().apis)}
                        />
                        <Divider />
                        <Card title="展示属性" size="small">
                            <SetSelector
                                ukey={`${componentData.id}-component`}
                                form={this.props.form}
                                fieldKey="showFieldsSet"
                                values={componentData.showFields}
                                actionType={selectedDataSourceApi && selectedDataSourceApi.actionType ? selectedDataSourceApi.actionType : ''}
                                colCount={1}
                                fields={selectedDataSourceApi && selectedDataSourceApi.out.fields ? selectedDataSourceApi.out.fields : []}
                            />
                        </Card>
                        <ExpandableList reloadEditor={() => this.props.reloadEditor()} />
                    </>
                );
            case 'selector':
                return (
                    <ContextSelector
                        ukey={`${componentData.id}-component`}
                        form={this.props.form}
                        labelName="数据源信息配置"
                        cascaderKey="dataSourceSelector"
                        initialValue={[componentData.dataSource.type, componentData.dataSource.dataModelId ? componentData.dataSource.dataModelId : componentData.dataSource.serviceId]}
                        options={getTableDataSourceOptions(getLayoutEditData().apis)}
                    />
                );
            default:
                console.error(`Wrong Component Type${componentData.type}`);
                return null;
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const componentData = getComponentData(getSelectedProperty().containerId, getSelectedProperty().componentId, getSelectedProperty().buttonId);
        const containerData = getContainerData(getSelectedProperty().containerId);
        getFieldDecorator('apiData', {initialValue: componentData.api});
        return (
            <>
                <Form id="customizer-form-area">
                    <div id="customizer-properties-form">
                        <DisplayName reloadEditor={() => this.props.reloadEditor()} />
                        <Divider />
                        <div className="title-font">
                            静态属性
                        </div>
                        <PropertyEditor
                            ukey={`${componentData.id}-component`}
                            form={this.props.form}
                            propertiesKeyName={`formStaticProperties${componentData.id}`}
                            bindable
                            initialValue={componentData.staticProperties}
                            reloadEditor={() => this.props.reloadEditor()}
                        />
                        <Divider />
                        <div className="title-font">
                            样式属性
                        </div>
                        {containerData.styleProperties.display === 'flex' ?
                            <Flex reloadEditor={() => this.props.reloadEditor()} />
                            : null}
                        {componentData.staticProperties.display ?
                            <Display reloadEditor={() => this.props.reloadEditor()} /> : null}
                        {componentData.staticProperties.flexDirection ?
                            <FlexDirection reloadEditor={() => this.props.reloadEditor()} /> : null}
                        {componentData.staticProperties.justifyContent ?
                            <JustifyContent reloadEditor={() => this.props.reloadEditor()} /> : null}
                        {componentData.staticProperties.alignItems ?
                            <AlignItems reloadEditor={() => this.props.reloadEditor()} /> : null}
                        <Margin reloadEditor={() => this.props.reloadEditor()} />
                        <Padding reloadEditor={() => this.props.reloadEditor()} />
                        <Size reloadEditor={() => this.props.reloadEditor()} />
                        <Divider />
                        {this.renderSpecializedProperties(componentData) ? (
                            <div className="title-font">
                                特殊属性
                            </div>
                        ) : null}
                        {this.renderSpecializedProperties(componentData)}
                        <Divider />
                        <ConditionalOutputs
                            ukey={`${componentData.id}-component`}
                            form={this.props.form}
                            reloadEditor={this.props.reloadEditor}
                            componentData={componentData}
                        />
                    </div>
                    <div id="customizer-properties-bottom-btn-grp sticky">
                        <Button
                            key="2"
                            type="danger"
                            onClick={(e) => {
                                e.preventDefault();
                                deleteSelectedProperty();
                                this.props.reloadEditor();
                            }}
                            className="customizer-bottom-btn"
                            size="large"
                        >
                            删除
                        </Button>
                    </div>
                </Form>
            </>
        );
    }
}

ComponentProperties = Form.create({
    onValuesChange(props, changedValues, allValues) {
        const newComponent = getComponentData(getSelectedProperty().containerId, getSelectedProperty().componentId, getSelectedProperty().buttonId);
        // edit common properties
        if (changedValues.displayName) newComponent.displayName = changedValues.displayName;
        if (changedValues[`formStaticProperties${newComponent.id}`]) {
            const staticProperties = newComponent.staticProperties;
            Object.entries(changedValues[`formStaticProperties${newComponent.id}`]).forEach((entry) => {
                const [key, value] = entry;
                staticProperties[key] = value;
            });
            newComponent.staticProperties = {...staticProperties};
        }
        if (changedValues.styleProperties) {
            Object.keys(changedValues.styleProperties).forEach((key) => {
                newComponent.styleProperties[key] = changedValues.styleProperties[key];
            });
        }
        if (changedValues.dataSourceSelector) {
            newComponent.dataSource = getTableDataSource(changedValues.dataSourceSelector);
        }
        if (changedValues.showFieldsSet) {
            newComponent.showFields = changedValues.showFieldsSet;
        }
        if (changedValues.contextSelector) {
            const bindingMap = [];
            allValues.bindingMapKeys.forEach((key) => {
                let values = changedValues.contextSelector[key];
                if (values[0] === 'constant') {
                    values = [...values, getConstantValue(values[1], getLayoutEditData().constant)];
                }
                bindingMap[key] = fromContextSelectorToBinding(values);
            });
            newComponent.bindingMap = {...bindingMap};
        }
        if (changedValues.field) newComponent.field = changedValues.field;
        if (Object.keys(changedValues).length === 1) {
            if (Object.keys(changedValues)[0].indexOf('layout-id') > -1) {
                const itemId = Object.keys(changedValues)[0].split('_')[1];
                const itemPos = newComponent.conditionalOutputs.findIndex((item) => item.itemId == itemId);
                const jumpingLayoutPos = Object.keys(changedValues)[0].split('_')[2];
                const layoutId = Object.values(changedValues)[0];
                newComponent.conditionalOutputs[itemPos].jumpingLayouts[jumpingLayoutPos].layoutId = layoutId;
            }
            if (Object.keys(changedValues)[0].indexOf('jumpProperties') > -1) {
                const itemId = Object.keys(changedValues)[0].split('_')[1];
                const itemPos = newComponent.conditionalOutputs.findIndex((item) => item.itemId == itemId);
                const jumpingLayoutPos = Object.keys(changedValues)[0].split('_')[2];
                const jumpPropertiesKey = Object.keys(changedValues)[0];
                const jumpProperties = Object.values(changedValues)[0];
                const layoutIdKey = `layout-id_${itemId}_${jumpingLayoutPos}`;
                const layoutId = allValues[layoutIdKey];
                const bindings = [];
                const selectedLayout = getLayoutsData().find((layout) => layout.id === layoutId);
                selectedLayout.input.forEach((param) => {
                    let values = jumpProperties[param.name] ? jumpProperties[param.name] : allValues[jumpPropertiesKey][param.name];
                    if (values[0] === 'constant') values = [...values, getConstantValue(values[1], getLayoutEditData().constant)];
                    bindings[param.name] = fromContextSelectorToBinding(values);
                });
                newComponent.conditionalOutputs[itemPos].jumpingLayouts[jumpingLayoutPos].bindingMap = {...bindings};
            }
        }
        if (allValues['layout-id']) {
            const layoutId = changedValues['layout-id'] ? changedValues['layout-id'] : allValues['layout-id'];
            newComponent.jumpingLayout.layoutId = layoutId;
            if (layoutId) {
                if (changedValues.jumpProperties) {
                    const bindings = [];
                    const selectedLayout = getLayoutsData().find((layout) => layout.id === layoutId);
                    selectedLayout.input.forEach((param) => {
                        let values = changedValues.jumpProperties[param.name] ? changedValues.jumpProperties[param.name] : allValues.jumpProperties[param.name];
                        if (values[0] === 'constant') values = [...values, getConstantValue(values[1], getLayoutEditData().constant)];
                        bindings[param.name] = fromContextSelectorToBinding(values);
                    });
                    newComponent.jumpingLayout.bindingMap = {...bindings};
                }
            }
        }
        if (allValues['api-type']) {
            if (changedValues['api-type'] || changedValues['asService-id'] || changedValues['table-id'] || changedValues['osService-id']) {
                newComponent.conditionalOutputs = [];
            }
            const apiType = changedValues['api-type'] ? changedValues['api-type'] : allValues['api-type'];
            if (apiType === 'atomicService' || apiType === 'multiService') {
                newComponent.api = changedValues.apiData ? changedValues.apiData : allValues.apiData;
            } else if (apiType === 'dataModel') {
                const tableId = changedValues['table-id'] ? changedValues['table-id'] : allValues['table-id'];
                const selectedTable = getTableData().find((table) => table.id === tableId);
                const actionType = changedValues['table-api-type'] ? changedValues['table-api-type'] : allValues['table-api-type'];
                const bindingMap = {};
                if (actionType === 'post') {
                    newComponent.api = changedValues.apiData ? changedValues.apiData : allValues.apiData;
                } else if (actionType === 'put') {
                    const newApi = changedValues.apiData ? changedValues.apiData : allValues.apiData;
                    if (newApi.in) {
                        if (newApi.in.fields.find((field) => field.name === 'id')) {
                            newComponent.api = newApi;
                        } else {
                            newApi.in.fields.push({
                                key: null,
                                name: 'id',
                                alias: null,
                                type: {
                                    name: 'Integer'
                                }
                            });
                            newComponent.api = newApi;
                        }
                    }
                } else if (actionType === 'getOne' || actionType === 'delete') {
                    let values = changedValues.apiDataModel ? changedValues.apiDataModel : allValues.apiDataModel;
                    if (values[0] === 'constant') values = [...values, getConstantValue(values[1], getLayoutEditData().constant)];
                    bindingMap.id = fromContextSelectorToBinding(values);
                    newComponent.api = generateApiFromDataModel(selectedTable, bindingMap, actionType, 'generate');
                }
                if (newComponent.api && newComponent.api.out) newComponent.api.out = null;
            } else if (apiType === 'none') {
                newComponent.api = null;
            }
        }
        changeSelectedProperty(newComponent);
        props.reloadEditor();
    }
})(ComponentProperties);
export default ComponentProperties;
