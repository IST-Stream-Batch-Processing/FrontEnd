import React from 'react';
import {
    Button, Form, Select
} from 'antd';

class CreatePositionUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userList: props.userList,
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
        const { userList } = this.state;
        return (
            <Form onSubmit={this.submit}>
                <Form.Item>
                    {getFieldDecorator('id', {
                        initialValue: ''
                    })(
                        <Select placeholder="成员列表">
                            {
                                userList.map((item) => (
                                    <Select.Option value={item.id} key={item.id}>{item.username}</Select.Option>
                                ))
                            }
                        </Select>
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

const PositionUserModal = Form.create({})(CreatePositionUser);

export default PositionUserModal;
