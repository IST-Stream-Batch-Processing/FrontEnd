import React from 'react';
import {
    DatePicker,
    Input, Select, Switch, Typography
} from 'antd';
import {useDispatch} from 'react-redux';
import MyTable from './Table';
import {renderText} from './renderUtil';
import {clientStyleHandler, propertiesHandler, styleHandler} from '../../../../utils/gui-service/guihelper';
import {changeData} from '../../../../redux/reducers/inputDataSlice';
import MyButton from './Button';

const {Title, Paragraph} = Typography;

export default function LayoutContainer(props) {
    function renderComponent(component) {
        const dispatch = useDispatch();
        const style = clientStyleHandler(component.styleProperties);
        const properties = propertiesHandler(component.staticProperties);
        switch (component.type) {
            case 'text':
                return (
                    <Paragraph {...properties} className="element" style={style}>{renderText(component)}</Paragraph>);
            case 'title':
                return (
                    <Title {...properties} className="element" style={style} level={4}>{renderText(component)}</Title>);
            case 'image':
                return (
                    <img src={properties.url} alt="" {...properties} className="element" style={style} />);
            case 'table':
                return <MyTable {...properties} setIsLoading={props.setIsLoading} style={style} component={component} />;
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
            case 'selector':
                return (
                    <Select
                        properties={properties}
                        className="element"
                        style={style}
                        setIsLoading={props.setIsLoading}
                        // options={component}
                    />
                );
            case 'paragraph':
                return (
                    <Paragraph {...properties} className="element" style={style}>{renderText(component)}</Paragraph>
                );
            case 'switch':
                return (
                    <Switch
                        {...properties}
                        className="element"
                        style={style}
                        onChange={(val) => {
                        dispatch(changeData({key: component.field, value: JSON.stringify(val)}));
                    }}
                    />
                );
            case 'datepicker':
                return (
                    <DatePicker
                        {...properties}
                        className="element"
                        style={style}
                        onChange={(moment, dateString) => {
                            dispatch(changeData({key: component.field, value: dateString}));
                        }}
                    />
                );
            default:
                return null;
        }
    }

    return (
        <div className="custom-div client-element" style={styleHandler(props.container.styleProperties)}>
            {props.container.components.map((component) => renderComponent(component))}
        </div>
    );
}
