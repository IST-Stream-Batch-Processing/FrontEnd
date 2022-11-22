import {Form, Select} from 'antd';
import React from 'react';
import {
    changeSelectedProperty,
    findServiceById,
    getComponentData,
    getOsServices,
    getSelectedProperty,
    savePropertyBindingMap
} from "../../../../../../utils/gui-service/dataHelper";
import TypeTree from "../../../api-util/TypeTree";
import {generateApiFromService} from "../../../../../../utils/gui-service/guihelper";

const {Item} = Form;

export default function OSSelector(props) {
    const editData = getComponentData(getSelectedProperty().containerId, getSelectedProperty().componentId, getSelectedProperty().buttonId);
    if (!editData.api) return null;
    const osServiceIdSelector = (
        <Form.Item label="选择服务">
            <Select
                placeholder="请选择服务"
                defaultValue={editData.api.type === 'dataModel' ? editData.api.tableId : editData.api.serviceId}
                style={{width: 400}}
                onSelect={(value) => {
                    editData.api = generateApiFromService(findServiceById(value), 'multiService');
                    changeSelectedProperty(editData);
                    props.reloadEditor();
                }}
            >
                {getOsServices().map((service) => (
                    <Select.Option
                        key={service.id}
                        value={service.id}
                    >
                        {service.name}
                    </Select.Option>
                ))}
            </Select>
        </Form.Item>
    );

    const selectedOSService = !editData.api.serviceId ? null : (
        getOsServices().find((service) => service.id === editData.api.serviceId));

    const inTypeBindings = selectedOSService === null ? null :
        (
            <TypeTree
                //  需要设置已经保存的绑定信息的时候，传入data={api}，这里的Api是后端直接传回来的格式就可以
                data={editData.api}
                saveBindingMap={(serviceId, bindingMap) => savePropertyBindingMap(editData.api.serviceId, "bindingMap", bindingMap)}
                field={{name: '', type: selectedOSService.inType}}
            />
        );

    return (
        <>
            {osServiceIdSelector}
            {inTypeBindings}
        </>
    );
}
