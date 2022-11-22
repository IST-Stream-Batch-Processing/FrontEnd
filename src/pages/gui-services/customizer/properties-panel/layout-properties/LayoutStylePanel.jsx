import React from 'react';
import {Divider, Form} from 'antd';
import Title from 'antd/es/typography/Title';
import {getLayoutEditData, setLayoutEditData} from '../../../../../utils/gui-service/dataHelper';
import Display from '../component-properties/style-edit/Display';
import FlexDirection from '../component-properties/style-edit/FlexDirection';
import Margin from '../component-properties/style-edit/Margin';
import Padding from '../component-properties/style-edit/Padding';
import JustifyContent from '../component-properties/style-edit/JustifyContent';
import AlignItems from '../component-properties/style-edit/AlignItems';
import Size from '../component-properties/style-edit/Size';

// 展示性容器的properties panel
class LayoutStylePanel extends React.PureComponent {
    render() {
        return (
            <div className="customizer-custom-panel">
                <div className="sticky">
                    <Title level={4}>
                        界面样式
                    </Title>
                    <Divider />
                </div>
                <Form id="customizer-form-area">
                    <div id="customizer-properties-form">
                        <Display form={this.props.form} initialValue={getLayoutEditData().styleProperties.display} />
                        <FlexDirection
                            form={this.props.form}
                            initialValue={getLayoutEditData().styleProperties.flexDirection}
                        />
                        <JustifyContent
                            form={this.props.form}
                            initialValue={getLayoutEditData().styleProperties.justifyContent}
                        />
                        <AlignItems
                            form={this.props.form}
                            initialValue={getLayoutEditData().styleProperties.alignItems}
                        />
                        <Margin form={this.props.form} initialValue={getLayoutEditData().styleProperties} />
                        <Padding form={this.props.form} initialValue={getLayoutEditData().styleProperties} />
                        <Size form={this.props.form} initialValue={getLayoutEditData().styleProperties} />
                    </div>
                </Form>
            </div>
        );
    }
}

LayoutStylePanel = Form.create({
    onValuesChange(props, changedValues) {
        const {validateFields} = props.form;
        validateFields((err) => {
            if (!err) {
                const layoutData = getLayoutEditData();
                Object.keys(changedValues.styleProperties).forEach((key) => {
                    layoutData.styleProperties[key] = changedValues.styleProperties[key];
                    if (key === 'display') {
                        if (changedValues.styleProperties[key] === 'flex') {
                            layoutData.containers.map((container) => {
                                container.styleProperties.position = 'relative';
                                return container;
                            });
                        } else {
                            layoutData.containers.map((container) => {
                                container.styleProperties.position = 'absolute';
                                return container;
                            });
                        }
                    }
                });
                setLayoutEditData(layoutData);
                props.reloadEditor();
            }
        });
    }
})(LayoutStylePanel);
export default LayoutStylePanel;
