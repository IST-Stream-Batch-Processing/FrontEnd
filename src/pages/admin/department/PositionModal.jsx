import React from 'react';
import {
    Button, Form, Input, Select
} from 'antd';

class CreatePosition extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            positionList: props.currentId === null ? props.positionList : props.positionList.filter(item => item.id !== props.currentId),
            currentPosition: props.currentId === null ? null : props.positionList.find(item => item.id === props.currentId)
        };
    }

    submit = async (e) => {
        e.preventDefault();
        const { form } = this.props;
        try {
            await form.validateFields();
            this.props.submit(form.getFieldsValue());
        } catch (err) {
            console.error(err);
        }
    }

    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        const { currentPosition } = this.state;
        return (
            <Form onSubmit={this.submit}>
                <Form.Item>
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入角色名称!' }],
                        initialValue: currentPosition ? currentPosition.name : ''
                    })(
                        <Input
                            placeholder="角色名称"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit" type="primary">
                        提交
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

const PositionModal = Form.create({})(CreatePosition);

export default PositionModal;
