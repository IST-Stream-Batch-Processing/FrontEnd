import React from 'react';
import {Form, Input} from 'antd';
import {useDispatch} from 'react-redux';
import {changeData} from '../../../../redux/reducers/inputDataSlice';
import MyButton from './Button';
import {clientStyleHandler, propertiesHandler} from '../../../../utils/gui-service/guihelper';
import {renderText} from './renderUtil';

const {Item} = Form;

export default function FormContainer(props) {
    function renderComponent(component) {
        const dispatch = useDispatch();
        const style = clientStyleHandler(component.styleProperties);
        const properties = propertiesHandler(component.staticProperties);
        switch (component.type) {
            case 'title':
            case 'text':
                return renderText(component);
            case 'input':
                return (
                    <Input
                        className="element"
                        style={style}
                        {...properties}
                        placeholder=""
                        onChange={(e) => {
                            dispatch(changeData({key: component.field, value: e.target.value}));
                        }}
                    />
                );
            case 'button':
                return (
                    <MyButton
                        properties={properties}
                        className="element"
                        style={style}
                        setIsLoading={props.setIsLoading}
                        component={component}
                    />
                );
            default:
                console.error('未知组件类型');
                return null;
        }
    }

    return (
        <Form
            style={{flex: 1}}
            className="custom-div client-element"
        >
            {props.container.components.map((item) => renderComponent(item))}
        </Form>
    );
}
