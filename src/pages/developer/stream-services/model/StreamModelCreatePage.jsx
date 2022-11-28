import React from 'react';
import {
Button, Divider, Form, Icon, Input, Layout, List, Select, Switch, Tag
} from 'antd';
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import {CloseCircleOutlined, TagOutlined} from "@ant-design/icons";
import {getColorByType} from "../../../gui-services/customizer/api-util/TypeTree";
import history from "../../../../utils/history";

class StreamModelCreatePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isTimeStamp: true
        };
    }

    render() {
        const {getFieldDecorator} = this.props.form;

        return (
            <Layout>
                <div style={{flexDirection: 'row', display: 'flex'}}>
                    <Title level={4}>创建流数据源</Title>
                </div>
                <Divider />
                <Form style={{
                    width: "400px", margin: "auto", display: "flex", flexDirection: "column"
                }}
                >
                    <Form.Item label="数据源名称">
                        {getFieldDecorator('className', {
                            rules: [
                                {
                                    required: true,
                                    message: "必须填写数据源名称！"
                                }
                            ]
                        })}
                        <Input placeholder="请输入数据源名称" />
                    </Form.Item>
                    <div style={{
                        display: "flex", flexDirection: "row", justifyContent: "space-around"
                    }}
                    >
                        <div style={{display: "flex", flexDirection: "column", flex: 3}}>
                            <Form.Item label="是否使用时间戳">
                                <div>
                                    <Switch
                                        checked={this.state.isTimeStamp}
                                        onChange={(checked) => {
                                            this.setState({isTimeStamp: checked});
                                        }}
                                    />
                                </div>
                            </Form.Item>
                        </div>
                        <div style={{display: "flex", flexDirection: "column", flex: 7}}>
                            <Form.Item label="时间戳名称">
                                {getFieldDecorator('timeStampName', {
                                    rules: [
                                        {
                                            required: this.state.isTimeStamp,
                                            message: "必须填写时间戳名称！"
                                        }
                                    ]
                                })}
                                <Input placeholder="请输入时间戳名称" />
                            </Form.Item>
                        </div>
                    </div>
                    <Form.Item label="DataSource Id">
                        {getFieldDecorator('dataSourceId', {
                            rules: [
                                {
                                    required: true,
                                    message: "必须选择DataSource Id！"
                                }
                            ]
                        })}
                        <Select />
                    </Form.Item>
                    <Text strong style={{marginBottom: 10}}>数据源属性列表</Text>
                    <List
                        bordered
                        size="small"
                        renderItem={(item, index) => (
                            <List.Item key={index} style={{display: 'flex'}}>
                                <Tag color={getColorByType(item.type)}>
                                    <TagOutlined />
                                </Tag>
                                <Divider type="vertical" />
                                {item.name}
                                <Divider type="vertical" />
                                <CloseCircleOutlined
                                    style={{color: 'red', fontSize: '20px'}}
                                    onClick={(e) => {
                                        e.preventDefault();
                                    }}
                                />
                            </List.Item>
                        )}
                    />
                    <Button
                        type="dashed"
                        onClick={(e) => {
                            e.preventDefault();
                            // this.add(componentData);
                        }}
                        style={{width: '100%', marginTop: '20px'}}
                    >
                        <Icon type="plus" />
                        创建
                    </Button>
                    <div style={{
                        flexDirection: 'row-reverse', display: "flex", marginTop: 80, justifyContent: "space-around"
                    }}
                    >
                        <Button
                            type="primary"
                            icon="form"
                            onClick={() => {
                                history.push("/developer/streamProcess/model/create");
                            }}
                        >
                            创建
                        </Button>
                        <Button icon="close">取消</Button>
                    </div>
                </Form>
            </Layout>
        );
    }
}

StreamModelCreatePage = Form.create({name: 'stream_model_create_page'})(StreamModelCreatePage);
export default StreamModelCreatePage;
