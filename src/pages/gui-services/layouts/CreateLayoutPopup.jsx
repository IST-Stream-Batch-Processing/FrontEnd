import React from 'react';
import { Form, Input, Modal } from 'antd';
import {
    getProjectId, getToken, getUserId, getUsername
} from '../../../utils/token';
import { createLayout } from '../../../api/gui';
import {defaultLayoutStyleProperties} from '../../../utils/gui-service/guihelper';

class CreateLayoutPopup extends React.Component {
    createLayout = async (e) => {
        e.preventDefault();
        const { form } = this.props;
        try {
            await form.validateFields();
            const values = form.getFieldsValue();
            values.userId = getUserId(getToken());
            values.userName = getUsername(getToken());
            values.projectId = getProjectId(getToken());
            values.styleProperties = defaultLayoutStyleProperties;
            await createLayout(values);
            this.props.onClick();
        } catch (err) {
            console.error(err);
        }
    };

    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal title="新增界面" visible onCancel={this.props.onClick} onOk={this.createLayout}>
                <Form>
                    <Form.Item label="界面名称">
                        {getFieldDecorator('name', {
                            rules: [{ required: true }]
                        })(
                            <Input placeholder="新界面" />
                        )}
                    </Form.Item>
                    <Form.Item label="界面描述">
                        {getFieldDecorator('description', {
                            rules: [{ required: false }]
                        })(
                            <Input />
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

CreateLayoutPopup = Form.create({})(CreateLayoutPopup);
export default CreateLayoutPopup;
