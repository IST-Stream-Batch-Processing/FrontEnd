import React from 'react';
import {
  Button, Form, Input,
} from 'antd';

class CreateNewDepartment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDepartment: props.currentDepartment || null
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
    const { currentDepartment } = this.state;
    return (
      <Form onSubmit={this.submit}>
        <Form.Item>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入部门名称!' }],
            initialValue: ''
          })(
            <Input
              placeholder="部门名称"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('parentId', {
            initialValue: currentDepartment ? currentDepartment.id : null
          })(<></>)}
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

const DepartmentNewModal = Form.create({})(CreateNewDepartment);

export default DepartmentNewModal;
