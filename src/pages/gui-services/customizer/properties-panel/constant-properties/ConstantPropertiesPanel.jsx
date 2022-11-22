import React from 'react';
import {
Button, Divider, Input, List, Select, Tag, Typography
} from 'antd';
import {CloseCircleOutlined, TagOutlined} from '@ant-design/icons';
import {getColorByType} from '../../api-util/TypeTree';
import {getLayoutEditData, setLayoutEditData} from '../../../../../utils/gui-service/dataHelper';
import VariableInput from '../../api-util/VariableInput';

const {Title} = Typography;
const {Option} = Select;

// Type: String, Int, Double, Char, Bool
class ConstantPropertiesPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentType: 'Int', currentFieldName: '', currentFieldValue: ''
        };
    }

    alreadyHaveFieldName = (name) => getLayoutEditData().constant.find((item) => item.name === name)

    render() {
        const data = getLayoutEditData();

        return (
            <div className="customizer-custom-panel">
                <div className="sticky">
                    <Title level={4}>
                        输入常量
                    </Title>
                    <Divider />
                </div>
                 <List
                    bordered
                    size="small"
                    dataSource={data.constant}
                    renderItem={(item, index) => (
                        <List.Item key={index} style={{display: 'flex'}}>
                            <Tag color={getColorByType(item.type)}>
                                <TagOutlined />
                                {item.type}
                            </Tag>
                            <Divider type="vertical" />
                            {item.name}
                            <Divider type="vertical" />
                            {item.value}
                            <Divider type="vertical" />
                            <CloseCircleOutlined
                                style={{color: 'red', fontSize: '20px'}}
                                onClick={() => {
                                    data.constant.splice(index, 1);
                                    setLayoutEditData(data);
                                    this.props.reloadEditor();
                                }}
                            />
                        </List.Item>
                    )}
                 />
                <div style={{display: 'flex', marginTop: 10}}>
                    <Select
                        defaultValue="Int"
                        onChange={(value) => { this.setState({currentType: value}); }}
                        style={{marginRight: 10, flex: 2}}
                    >
                        <Option value="Int">Int</Option>
                        <Option value="String">String</Option>
                        <Option value="Double">Double</Option>
                        <Option value="Char">Char</Option>
                        <Option value="Bool">Bool</Option>
                    </Select>
                    <Input
                        placeholder="名称"
                        style={{marginRight: 10, flex: 3}}
                        onChange={(e) => {
                            this.setState({currentFieldName: e.target.value});
                        }}
                    />
                    <VariableInput currentValue={this.state.currentType} changeFieldValue={(newValue) => { this.setState({currentFieldValue: newValue}); }} />
                    <Button
                        style={{flex: 1}}
                        type="primary"
                        onClick={() => {
                            const {currentType, currentFieldName, currentFieldValue} = this.state;
                            if (!currentFieldName || currentFieldName === '' || this.alreadyHaveFieldName(currentFieldName)) return;
                            data.constant.push({type: currentType, name: currentFieldName, value: currentFieldValue});
                            setLayoutEditData(data);
                            this.props.reloadEditor();
                        }}
                    >
                        新建
                    </Button>
                </div>
            </div>
        );
    }
}

export default ConstantPropertiesPanel;
