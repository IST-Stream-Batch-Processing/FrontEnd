import React from 'react';
import {Icon, Tabs} from 'antd';
import GenerateComponentPanel from './generate-components/GenerateComponentPanel';
import Hierarchy from './hierarchy/Hierarchy';
import CustomizerPropertiesPanel from './component-properties/CustomizerPropertiesPanel';
import ConstantPropertiesPanel from './constant-properties/ConstantPropertiesPanel';
import InputPropertiesPanel from './input-properties/InputPropertiesPanel';
import ApiPropertiesPanel from './api-properties/ApiPropertiesPanel';
import LayoutStylePanel from './layout-properties/LayoutStylePanel';

const {TabPane} = Tabs;

export const tabType = {
    COMPONENT: 'component',
    HIERARCHY: 'hierarchy',
    PROPERTIES: 'properties',
    CONSTANT: 'constant',
    PARAM: 'param',
    API: 'api',
    LAYOUT_STYLE: 'layout-style'
};

// 展示性容器的properties panel
class PropertiesPanel extends React.PureComponent {
    renderPane = (tabKey) => {
        switch (tabKey) {
            case tabType.COMPONENT:
                return <GenerateComponentPanel />;
            case tabType.HIERARCHY:
                return <Hierarchy reloadEditor={() => this.props.reloadEditor()} />;
            case tabType.PROPERTIES:
                return <CustomizerPropertiesPanel reloadEditor={() => this.props.reloadEditor()} />;
            case tabType.CONSTANT:
                return <ConstantPropertiesPanel reloadEditor={() => this.props.reloadEditor()} />;
            case tabType.PARAM:
                return <InputPropertiesPanel reloadEditor={() => this.props.reloadEditor()} />;
            case tabType.API:
                return <ApiPropertiesPanel reloadEditor={() => this.props.reloadEditor()} />;
            case tabType.LAYOUT_STYLE:
                return <LayoutStylePanel reloadEditor={() => this.props.reloadEditor()} />;
            default:
                return null;
        }
    };

    toolTab = (styleName, iconType, tabTitle, tabKey) => (
        <TabPane
            tab={(
                <div className={styleName}>
                    <Icon type={iconType} className="tab-icon" />
                    <div style={{fontSize: 12}}>{tabTitle}</div>
                </div>
            )}
            key={tabKey}
        >
            {this.renderPane(tabKey)}
        </TabPane>
    )

    render() {
        return (
            <Tabs defaultActiveKey="1" tabPosition="right" size="small" style={{height: '100%'}}>
                {this.toolTab('tool-tab pdt-5', 'plus-square', '组件', tabType.COMPONENT)}
                {this.toolTab('tool-tab', 'cluster', '结构', tabType.HIERARCHY)}
                {this.toolTab('tool-tab', 'profile', '属性', tabType.PROPERTIES)}
                {this.toolTab('tool-tab', 'project', '常量', tabType.CONSTANT)}
                {this.toolTab('tool-tab', 'login', '输入', tabType.PARAM)}
                {this.toolTab('tool-tab', 'api', 'API', tabType.API)}
                {this.toolTab('tool-tab', 'block', '样式', tabType.LAYOUT_STYLE)}
            </Tabs>
        );
    }
}

export default PropertiesPanel;
