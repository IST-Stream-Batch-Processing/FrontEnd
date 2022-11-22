import {Form, Select} from 'antd';
import React from 'react';
import {
    changeSelectedProperty,
    findDataModelById,
    getComponentData,
    getSelectedProperty,
    getTableData,
    savePropertyBindingMap
} from "../../../../../../utils/gui-service/dataHelper";
import TypeTree from "../../../api-util/TypeTree";
import {
    fromBindingToContextSelector,
    generateApiFromDataSource,
    generateTypeFromTableFieldProperties
} from "../../../../../../utils/gui-service/guihelper";
import ContextSelector from "../../../../../../utils/gui-service/ContextSelector";

const {Item} = Form;

export default function DSSelector(props) {
    const editData = getComponentData(getSelectedProperty().containerId, getSelectedProperty().componentId, getSelectedProperty().buttonId);
    if (!editData.api) return null;

    const renderDataModelBindingMap = (selectedTable, selectedTableApi) => {
        if (!selectedTable) return null;

        const ifCleared = editData.api === null || editData.api.bindingMap === null || editData.api.type !== 'dataModel' || editData.api.actionType !== selectedTableApi;

        if (selectedTableApi === 'post' || selectedTableApi === 'put') {
            const fields = generateTypeFromTableFieldProperties(selectedTable, selectedTableApi);
            const field = {
                name: '',
                type: {
                    name: 'Object',
                    className: selectedTable.tableName,
                    fields
                }
            };
            return (
                <TypeTree
                    //  需要设置已经保存的绑定信息的时候，传入data={api}，这里的Api是后端直接传回来的格式就可以
                    data={ifCleared ? null : editData.api}
                    isButton
                    field={field}
                    saveBindingMap={(bindingMap) => savePropertyBindingMap(editData.api.tableId, "bindingMap", bindingMap)}
                />
            );
        }
        // TODO: 重构ContextSelector
        if (selectedTableApi === 'delete' || selectedTableApi === 'getOne') {
            return (
                <ContextSelector
                    key="data-id"
                    labelName="数据模型id"
                    cascaderKey="apiDataModel"
                    style={{width: 400}}
                    initialValue={ifCleared ? [] : (editData.api.bindingMap.id ? fromBindingToContextSelector(editData.api.bindingMap.id) : [])}
                    form={props.form}
                />
            );
        }
        return null;
    };

    const tableIdSelector = (
        <Form.Item key="table-id" label="选择数据模型">
            <Select
                placeholder="请选择数据模型"
                defaultValue={editData.api.type === 'dataModel' ? editData.api.tableId : null}
                style={{width: 400}}
                onSelect={(value) => {
                    editData.api = generateApiFromDataSource(findDataModelById(value));
                    changeSelectedProperty(editData);
                    console.log(editData.api);
                    props.reloadEditor();
                }}
            >
                {getTableData().map((table) => (
                    <Select.Option
                        key={table.id}
                        value={table.id}
                    >
                        {table.tableName}
                    </Select.Option>
                ))}
            </Select>
        </Form.Item>
    );

    const tableApiTypeSelector = editData.api.tableId ? (
        <Form.Item key="table-api-type" label="选择api类型">
            <Select
                placeholder="请选择api类型"
                defaultValue={editData.api.type === 'dataModel' ? editData.api.actionType : null}
                style={{width: 400}}
                onSelect={(value) => {
                    editData.api.actionType = value;
                    changeSelectedProperty(editData);
                    props.reloadEditor();
                }}
            >
                <Select.Option key="post" value="post">post</Select.Option>
                <Select.Option key="put" value="put">put</Select.Option>
                <Select.Option key="delete" value="delete">delete</Select.Option>
            </Select>
        </Form.Item>
    ) : null;

    return (
        <>
            {tableIdSelector}
            {tableApiTypeSelector}
            {editData.api.tableId === null ? null : renderDataModelBindingMap(getTableData().find((table) => table.id === editData.api.tableId), editData.api.actionType, editData)}
        </>
    );
}
