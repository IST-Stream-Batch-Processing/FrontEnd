import React from 'react';
import {
Descriptions, Divider, Drawer, Form, List, Tag, Typography
} from 'antd';
import {CloseCircleOutlined, EditOutlined, TagOutlined} from "@ant-design/icons";
import {saveBindingMap} from "../../../../../../utils/gui-service/dataHelper";
import DataCard from "../../../api-util/DataCard";
import TypeTree, {getColorByType} from "../../../api-util/TypeTree";
import {serviceDisplayTypeName} from "../../../../../../utils/gui-service/guihelper";

const {Title} = Typography;
const {Item} = Form;

class APIList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            editApi: {}
        };
    }

    showDrawer = (data) => {
        this.setState({
            visible: true,
            editApi: data
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    renderCards = (data) => (
        <List
            bordered
            size="small"
            dataSource={data}
            renderItem={(item, index) => (
                <List.Item key={index} style={{display: 'flex'}}>
                    <Tag color={getColorByType(item.type)}>
                        <TagOutlined />
                        {serviceDisplayTypeName[`${item.type}`]}
                    </Tag>
                    <Divider type="vertical" />
                    {item.type === 'dataModel' ? item.dataModelName : item.serviceName}
                    <Divider type="vertical" />
                    <EditOutlined
                        style={{color: 'dodgerblue', fontSize: '20px'}}
                        onClick={() => {
                            this.showDrawer(item);
                        }}
                    />
                    <CloseCircleOutlined
                        style={{color: 'red', fontSize: '20px'}}
                        onClick={(e) => {
                            e.preventDefault();
                            const id = item.type === 'dataModel' ? item.tableId : item.serviceId;
                            this.props.deleteApi(id);
                            this.props.reloadEditor();
                        }}
                    />
                </List.Item>
            )}
        />
    )

    newApiForm = () => {
        if (this.state.editApi === {}) return null;
        switch (this.state.editApi.type) {
            case 'atomicService':
                return (
                    <>
                        <Descriptions layout="vertical" bordered>
                            <Descriptions.Item label="id">{this.state.editApi.serviceId}</Descriptions.Item>
                            <Descriptions.Item label="Api名称">{this.state.editApi.serviceName}</Descriptions.Item>
                            <Descriptions.Item label="Api类型">原子服务</Descriptions.Item>
                            <Descriptions.Item label="数据源绑定">
                                <TypeTree
                                    data={this.state.editApi}
                                    field={{name: '', type: this.state.editApi.in}}
                                    saveBindingMap={(bindingMap) => saveBindingMap(this.state.editApi.serviceId, bindingMap)}
                                />
                            </Descriptions.Item>
                        </Descriptions>
                    </>
                );
            case 'multiService':
                return (
                    <>
                        <Descriptions layout="vertical" bordered>
                            <Descriptions.Item label="id">{this.state.editApi.serviceId}</Descriptions.Item>
                            <Descriptions.Item label="Api名称">{this.state.editApi.serviceName}</Descriptions.Item>
                            <Descriptions.Item label="Api类型">组合服务</Descriptions.Item>
                            <Descriptions.Item label="数据源绑定">
                                <TypeTree
                                    data={this.state.editApi}
                                    seriveId={this.state.editApi.serviceId}
                                    field={{name: '', type: this.state.editApi.in}}
                                    saveBindingMap={(bindingMap) => saveBindingMap(this.state.editApi.serviceId, bindingMap)}
                                />
                            </Descriptions.Item>
                        </Descriptions>
                    </>
                );
            case 'dataModel':
                return (
                    <>
                        <Descriptions layout="vertical" bordered style={{marginBottom: 10}}>
                            <Descriptions.Item label="tableId">{this.state.editApi.tableId}</Descriptions.Item>
                            <Descriptions.Item label="名称">{this.state.editApi.dataModelName}</Descriptions.Item>
                            <Descriptions.Item label="Api类型">数据服务</Descriptions.Item>
                        </Descriptions>
                        <DataCard
                            data={this.state.editApi}
                            reloadEditor={() => {
                                this.props.reloadEditor();
                            }}
                        />
                    </>
                );

            default:
                return null;
        }
    }

    render() {
        return (
            <>
                {this.renderCards(this.props.data)}
                <Drawer
                    title="Api详细信息"
                    width={720}
                    onClose={this.onClose}
                    visible={this.state.visible}
                    bodyStyle={{paddingBottom: 80}}
                >
                    {this.newApiForm()}
                </Drawer>
            </>
        );
    }
}

export default APIList;
