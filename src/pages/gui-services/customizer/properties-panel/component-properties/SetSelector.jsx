import React from 'react';
import {
Checkbox, Col, Form
} from 'antd';
import {isRelation} from '../../../../../utils/gui-service/guihelper';

class SetSelector extends React.PureComponent {
    render() {
        const {getFieldDecorator} = this.props.form;
        const {actionType} = this.props;

        return (
            <Form.Item key={this.props.fieldKey}>
                {getFieldDecorator(this.props.fieldKey ? this.props.fieldKey : 'set-selector', {
                    initialValue: this.props.values ? this.props.values : []
                })(
                    <Checkbox.Group style={{width: '100%'}}>
                        {this.props.fields ? this.props.fields.map((field) => (
                            actionType === 'getOne' || !isRelation(field.name) ? (
                                <Col key={field.name} span={24 / this.props.colCount}>
                                    <Checkbox key={field.name} value={field.name}>{field.name}</Checkbox>
                                </Col>
                              ) : null
                            )) : null}
                    </Checkbox.Group>
                )}
            </Form.Item>
        );
    }
}

export default SetSelector;
