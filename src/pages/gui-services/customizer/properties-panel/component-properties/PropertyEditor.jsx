import React from 'react';
import {
    Button, Form, Input, Select
} from 'antd';
import {fromStaticPropertyToBinding} from '../../../../../utils/gui-service/guihelper';
import {
    changeSelectedProperty,
    getComponentData,
    getContainerData,
    getSelectedProperty
} from '../../../../../utils/gui-service/dataHelper';
import ImageUploader from './ImageUploader';

const {Option} = Select;
const nullOrNotProperties = ['defaultChecked', 'allowClear', 'bordered', 'copyable', 'code', 'delete', 'ellipsis',
'mark', 'underline', 'italic'];

class PropertyEditor extends React.PureComponent {
    handleSwitchChange = (e, propertyName, editData) => {
        e.preventDefault();
        const newComponent = fromStaticPropertyToBinding(editData, propertyName);
        changeSelectedProperty(newComponent);
        this.props.reloadEditor();
    }

    toBindingButton = (k, editData) => {
        if (nullOrNotProperties.indexOf(k) > -1) { return null; }
        return (
            <Button
                key={`button-${k}`}
                onClick={(e) => this.handleSwitchChange(e, k, editData)}
                icon="arrow-down"
                style={{width: '15%', borderRadius: 20}}
            />
        );
    }

    renderBindableInput = (k) => {
        if (k === 'url') {
            return (
                <ImageUploader />
            );
        }
        if (nullOrNotProperties.indexOf(k) > -1) {
            return (
                <Select>
                    <Option value="true">true</Option>
                    <Option value="">false</Option>
                </Select>
            );
        }
        return (
        <Input style={{width: '80%', marginRight: '5%'}} type={(k === 'left' || k === 'top' || k === 'fontSize') ? 'number' : 'text'} />);
    }

    renderInput = (k) => {
        if (nullOrNotProperties.indexOf(k) > -1) {
            return (
            <Select>
                <Option value="true">true</Option>
                <Option value="">false</Option>
            </Select>
            );
        }
        if (k === 'picker') {
            return (
                <Select>
                    <Option value="time">time</Option>
                    <Option value="date">date</Option>
                    <Option value="month">month</Option>
                    <Option value="year">year</Option>
                    <Option value="decade">decade</Option>
                </Select>
            );
        }
        if (k === 'placement') {
            return (
                <Select>
                    <Option value="bottomLeft">bottomLeft</Option>
                    <Option value="bottomRight">bottomRight</Option>
                    <Option value="topLeft">topLeft</Option>
                    <Option value="topRight">topRight</Option>
                </Select>
            );
        }
        return <Input type="text" />;
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const editData = getSelectedProperty().type === 'con' ? getContainerData(getSelectedProperty().containerId) : getSelectedProperty().type === 'com' ? getComponentData(getSelectedProperty().containerId, getSelectedProperty().componentId) : getComponentData(getSelectedProperty().containerId, getSelectedProperty().componentId, getSelectedProperty().buttonId);
        const keys = this.props.initialValue ? Object.keys(this.props.initialValue) : [];
        const formItems = keys ? keys.map((k) => {
            if (k === 'position') return null;
            if (getSelectedProperty().type !== 'con' && editData.bindingMap && this.props.bindable) {
                return (
                    <div key={`div-${k}`}>
                        <Form.Item
                            required={false}
                            label={k}
                            key={k}
                        >
                            {getFieldDecorator(`${this.props.propertiesKeyName}[${k}]`, {
                                rules: [
                                    {
                                        required: false,
                                        message: '请输入属性值。',
                                    },
                                ],
                                initialValue: this.props.initialValue[k] ?
                                    this.props.initialValue[k] : ''
                            })(
                                this.renderBindableInput(k)
                            )}
                            {this.toBindingButton(k, editData)}
                        </Form.Item>
                    </div>
                );
            }
            return (
                <Form.Item
                    required={false}
                    label={k}
                    key={k}
                >
                    {getFieldDecorator(`${this.props.propertiesKeyName}[${k}]`, {
                        rules: [
                            {
                                required: false,
                                message: '请输入属性值。',
                            },
                        ],
                        initialValue: this.props.initialValue[k] ?
                            this.props.initialValue[k] : ''
                    })(
                        this.renderInput(k)
                    )}
                </Form.Item>
            );
        }) : null;
        return (
            <>
                {formItems}
            </>
        );
    }
}

export default PropertyEditor;
