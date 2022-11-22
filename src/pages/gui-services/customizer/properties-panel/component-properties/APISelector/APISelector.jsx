import React from 'react';
import {
    Divider, Drawer, Form, List, Radio, Tag
} from 'antd';
import {EditOutlined, TagOutlined} from "@ant-design/icons";
import {
    changeSelectedProperty,
    getComponentData,
    getSelectedProperty
} from '../../../../../../utils/gui-service/dataHelper';
import ASSelector from "./ASSelector";
import OSSelector from "./OSSelector";
import DSSelector from "./DSSelector";
import {getColorByType} from "../../../api-util/TypeTree";
import {serviceDisplayTypeName} from "../../../../../../utils/gui-service/guihelper";

class APISelector extends React.Component {
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

    renderApiSelector = (editData) => (
        <Form.Item label="选择类型">
            <Radio.Group
                defaultValue={editData.api !== null ? editData.api.type : 'none'}
                onChange={(e) => {
                    editData.api = {};
                    if (e.target.value === 'none') editData.api = null;
                    else editData.api.type = e.target.value;
                    changeSelectedProperty(editData);
                    this.props.reloadEditor();
                }}
            >
                <Radio.Button key="1" value="none">无</Radio.Button>
                <Radio.Button key="2" value="atomicService">原子服务</Radio.Button>
                <Radio.Button key="3" value="dataModel">数据服务</Radio.Button>
                <Radio.Button key="4" value="multiService">组合服务</Radio.Button>
            </Radio.Group>
        </Form.Item>
    )

    renderApiOptions = (editData) => {
        if (editData.api === null) return null;
        if (editData.api.type === 'atomicService') {
            return (
                <ASSelector reloadEditor={() => this.props.reloadEditor()} />);
        }
        if (editData.api.type === 'dataModel') {
            return (
                <DSSelector reloadEditor={() => this.props.reloadEditor()} form={this.props.form} />);
        }
        if (editData.api.type === 'multiService') return (<OSSelector reloadEditor={() => this.props.reloadEditor()} />);
        return null;
    }

    render() {
        const editData = getComponentData(getSelectedProperty().containerId, getSelectedProperty().componentId, getSelectedProperty().buttonId);
        return (
            <>
                <List
                    bordered
                    size="small"
                >
                    <List.Item style={{display: 'flex'}}>
                        {editData.api ? (
                            <div>
                                <Tag color={getColorByType(editData.api.type)}>
                                    <TagOutlined />
                                    {serviceDisplayTypeName[`${editData.api.type}`]}
                                </Tag>
                                <Divider type="vertical" />
                                {editData.api.type === 'dataModel' ? editData.api.dataModelName : editData.api.serviceName}
                                <Divider type="vertical" />
                            </div>
                        ) : null }
                        <EditOutlined
                            style={{color: 'dodgerblue', fontSize: '20px'}}
                            onClick={() => {
                                this.showDrawer(editData.api);
                            }}
                        />
                    </List.Item>
                </List>
                <Drawer
                    title="Api详细信息"
                    width={720}
                    onClose={this.onClose}
                    visible={this.state.visible}
                    bodyStyle={{paddingBottom: 80}}
                >
                    {this.renderApiSelector(editData)}
                    {this.renderApiOptions(editData)}
                </Drawer>
            </>
        );
    }
}

export default APISelector;
