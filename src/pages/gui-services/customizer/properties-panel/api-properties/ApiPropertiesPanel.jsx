import React from 'react';
import {
Cascader, Divider, Form, Typography
} from 'antd';
import {generateApiFromDataSource, generateApiFromService} from '../../../../../utils/gui-service/guihelper';
import {
    deleteApiFromLayoutData,
    findDataModelById,
    findServiceById,
    getAsServices,
    getLayoutEditData,
    getOsServices,
    getTableData,
    saveBindingMap,
    setLayoutEditData
} from '../../../../../utils/gui-service/dataHelper';
import APIList from "../component-properties/APISelector/APIList";

const {Title} = Typography;
const {Item} = Form;

class ApiPropertiesPanel extends React.Component {
    checkAlreadyHave = (list, id) => !!list.find((item) => item.serviceId === id || item.tableId === id)

    onSelectChange = (value, data) => {
        if (!value[0] || !value[1]) return;
        if (this.checkAlreadyHave(data.apis, value[1])) return;
        switch (value[0]) {
            case 'asList':
                data.apis.push(generateApiFromService(findServiceById(value[1]), 'atomicService'));
                setLayoutEditData(data);
                break;
            case 'dataServiceList':
                data.apis.push(generateApiFromDataSource(findDataModelById(value[1])));
                setLayoutEditData(data);
                break;
            case 'orchestrationList':
                data.apis.push(generateApiFromService(findServiceById(value[1]), 'multiService'));
                setLayoutEditData(data);
                break;
            default:
        }
        this.props.reloadEditor();
    }

    getOption = () => {
        const options = [
            {
                value: 'asList',
                label: '原子服务',
                children: []
            },
            {
                value: 'dataServiceList',
                label: '数据服务',
                children: []
            },
            {
                value: 'orchestrationList',
                label: '组合服务',
                children: []
            }
        ];

        const asApis = [];
        getAsServices().forEach((item) => {
            asApis.push({value: item.id, label: item.name});
        });
        options[0].children = asApis;
        const osApis = [];
        getOsServices().forEach((item) => {
            osApis.push({value: item.id, label: item.name});
        });
        options[2].children = osApis;
        const dataApis = [];
        getTableData().forEach((item) => {
            dataApis.push({value: item.id, label: item.tableName});
        });
        options[1].children = dataApis;
        return options;
    }

    render() {
        const data = getLayoutEditData();

        return (
            <div className="customizer-custom-panel">
                <div className="sticky">
                    <Title level={4}>
                        输入API
                    </Title>
                    <Divider />
                </div>
                <APIList
                    data={data.apis}
                    deleteApi={(id) => {
                        deleteApiFromLayoutData(id);
                    }}
                    reloadEditor={() => {
                        this.props.reloadEditor();
                    }}
                    saveBindingMap={(serviceId, bindingMap) => saveBindingMap(serviceId, bindingMap)}
                />
                <Cascader
                    onChange={(value) => this.onSelectChange(value, data)}
                    options={this.getOption()}
                    placeholder="新增Api"
                    style={{marginBottom: 10, marginTop: 10}}
                />
            </div>
        );
    }
}

export default ApiPropertiesPanel;
