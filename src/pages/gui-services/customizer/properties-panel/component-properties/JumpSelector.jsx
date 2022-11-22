import React from 'react';
import {Form, Select} from 'antd';
import ContextSelector from '../../../../../utils/gui-service/ContextSelector';
import {fromBindingToContextSelector} from '../../../../../utils/gui-service/guihelper';
import {getComponentData, getLayoutsData, getSelectedProperty} from '../../../../../utils/gui-service/dataHelper';

class JumpSelector extends React.PureComponent {
    renderJumpBindingMap = (selectedLayout, editData) => {
        const jumpingLayoutPos = this.props.isSuccess ? 0 : 1;
        // jumpingLayout0 条件成功跳转界面/无条件跳转界面 jumpingLayout1 条件失败跳转界面
        const {getFieldDecorator, getFieldValue} = this.props.form;
        const currentItem = editData.conditionalOutputs.find((item) => item.itemId === this.props.itemId);
        if (selectedLayout !== null) {
            if (currentItem.jumpingLayouts[jumpingLayoutPos].bindingMap === null || Object.keys(currentItem.jumpingLayouts[jumpingLayoutPos].bindingMap).length === 0) {
                return selectedLayout.input.map((param) => (
                    <ContextSelector
                        key={param.name}
                        labelName={param.name}
                        cascaderKey={`jumpProperties_${this.props.itemId}_${jumpingLayoutPos}[${param.name}]`}
                        initialValue={[]}
                        form={this.props.form}
                    />
                ));
            }
            getFieldDecorator(`jumpPropertiesBindingMapKeys_${this.props.itemId}_${jumpingLayoutPos}`,
                {initialValue: currentItem.jumpingLayouts[jumpingLayoutPos].bindingMap ? Object.keys(currentItem.jumpingLayouts[jumpingLayoutPos].bindingMap) : []});
            const keys = getFieldValue(`jumpPropertiesBindingMapKeys_${this.props.itemId}_${jumpingLayoutPos}`);
            return keys ? keys.map((k) =>
                // eslint-disable-next-line implicit-arrow-linebreak
                (
                    <ContextSelector
                        key={k}
                        labelName={k}
                        cascaderKey={`jumpProperties_${this.props.itemId}_${jumpingLayoutPos}[${k}]`}
                        initialValue={fromBindingToContextSelector(currentItem.jumpingLayouts[jumpingLayoutPos].bindingMap[k])}
                        form={this.props.form}
                    />
                )) : null;
        }
        return null;
    }

    render() {
        const {getFieldDecorator, getFieldValue} = this.props.form;
        const jumpingLayoutPos = this.props.isSuccess ? 0 : 1;
        const editData = getComponentData(getSelectedProperty().containerId, getSelectedProperty().componentId, getSelectedProperty().buttonId);
        const currentItem = editData.conditionalOutputs.find((item) => item.itemId === this.props.itemId);
        if (!currentItem) return null;
        const layoutIdSelector = (
            <Form.Item key={`layout-id_${this.props.itemId}_${jumpingLayoutPos}`} label="跳转界面">
                {getFieldDecorator(`layout-id_${this.props.itemId}_${jumpingLayoutPos}`, {
                    rules: [{required: false}],
                    initialValue: currentItem.jumpingLayouts[jumpingLayoutPos] ? currentItem.jumpingLayouts[jumpingLayoutPos].layoutId : null
                })(<Select placeholder="请选择数据模型">
                    <Select.Option key="no-layout" value={null}>不选择</Select.Option>
                    {getLayoutsData().map((layout) => (
                        <Select.Option
                            key={layout.id}
                            value={layout.id}
                        >
                            {layout.name}
                        </Select.Option>
                    ))}
                   </Select>)}
            </Form.Item>
        );

        const selectedLayout = getFieldValue(`layout-id_${this.props.itemId}_${jumpingLayoutPos}`) === null ? null : (getLayoutsData().find((layout) => layout.id === getFieldValue(`layout-id_${this.props.itemId}_${jumpingLayoutPos}`)));
        const bindingMap = this.renderJumpBindingMap(selectedLayout, editData);

        return (
            <>
                {layoutIdSelector}
                {bindingMap}
            </>
        );
    }
}

export default JumpSelector;
