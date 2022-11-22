import React from 'react';
import {Collapse, Icon, Typography} from 'antd';
import GenerateComponentButton from './GenerateComponentButton';

const {Title} = Typography;
const {Panel} = Collapse;

export default function GenerateComponentPanel() {
    return (
        <Collapse
            bordered={false}
            expandIcon={({isActive}) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
            expandIconPosition="right"
            style={{backgroundColor: 'white'}}
            className="customizer-custom-panel"
        >
            <Panel key="容器" header="容器">
                <GenerateComponentButton value="layout" />
            </Panel>
            <Panel key="文字" header="文字">
                <GenerateComponentButton value="text" />
                <GenerateComponentButton value="title" />
                <GenerateComponentButton value="paragraph" />
            </Panel>
            <Panel key="输入框" header="输入框">
                <GenerateComponentButton value="input" />
                <GenerateComponentButton value="selector" />
                <GenerateComponentButton value="switch" />
                <GenerateComponentButton value="datePicker" />
            </Panel>
            <Panel key="表单" header="表单">
                <GenerateComponentButton value="table" />
                <GenerateComponentButton value="button" />
            </Panel>
            <Panel key="图片" header="图片">
                <GenerateComponentButton value="image" />
            </Panel>
        </Collapse>
    );
}
