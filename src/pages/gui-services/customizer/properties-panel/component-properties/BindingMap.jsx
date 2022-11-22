import React from 'react';
import {Button} from 'antd';
import {fromBindingToContextSelector, fromBindingToStaticProperty, } from '../../../../../utils/gui-service/guihelper';
import ContextSelector from '../../../../../utils/gui-service/ContextSelector';
import {
    changeSelectedProperty,
    getComponentData,
    getSelectedProperty
} from '../../../../../utils/gui-service/dataHelper';

class BindingMap extends React.PureComponent {
    handleSwitchChange = (e, propertyName, editData) => {
        e.preventDefault();
        const newComponent = fromBindingToStaticProperty(editData, propertyName);
        changeSelectedProperty(newComponent);
        this.props.reloadEditor();
    }

    toBindingButton = (k, editData) => (
        <Button
            key={`button-${k}`}
            onClick={(e) => this.handleSwitchChange(e, k, editData)}
            icon="arrow-up"
            style={{width: '15%', borderRadius: 20}}
        />
    )

    render() {
        const {getFieldDecorator, getFieldValue} = this.props.form;
        const editData = getComponentData(getSelectedProperty().containerId, getSelectedProperty().componentId, getSelectedProperty().buttonId);
        getFieldDecorator('bindingMapKeys', {initialValue: editData.bindingMap ? Object.keys(editData.bindingMap) : []});
        const keys = getFieldValue('bindingMapKeys');
        const formItems = keys ? keys.map((k) => (
            <div key={`div-${k}`} style={{display: 'flex', flexDirection: 'row'}}>
                <ContextSelector
                    style={{width: '80%', marginRight: '5%'}}
                    key={`bindingMap${k}`}
                    labelName={k}
                    cascaderKey={`contextSelector[${k}]`}
                    initialValue={fromBindingToContextSelector(editData.bindingMap[k])}
                    form={this.props.form}
                    bindingButton={this.toBindingButton(k, editData)}
                />
            </div>
        )) : null;
        return (
            <>
                {formItems}
            </>
        );
    }
}

export default BindingMap;
