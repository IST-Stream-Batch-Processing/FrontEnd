import React from 'react';
import {
Button, Form, Input, message
} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import history from '../utils/history';
import {getRoles, getToken} from '../utils/token';
import '../css/login.css';
import {routeWithRole} from '../utils/routeUtil';
import {register} from '../api/user';

class RegisterForm extends React.Component {
    constructor() {
        const token = getToken();
        if (token != null) {
            routeWithRole('', JSON.parse(getRoles(token))[0]);
        }
        super();
    }

    doRegister = async (e) => {
        e.preventDefault();
        const {form} = this.props;
        try {
            // antd uses async validator
            await form.validateFields();
            const values = form.getFieldsValue();
            if (values.password !== values.repeatedPassword) {
                message.error('两次输入的密码不一致！');
                return;
            }
            await register(form.getFieldsValue());
            message.success('注册成功，请登录！');
            history.push('/login');
        } catch (err) {
            console.error(err);
        }
    }

    goLogin = () => {
        history.replace('/login');
    }

    render() {
        const {form} = this.props;
        const {getFieldDecorator} = form;
        return (
            <div className="login-form">
                <div className="login-text">用户注册</div>
                <Form onSubmit={this.doRegister} className="login-form">
                    <Form.Item>
                        {getFieldDecorator('username', {
                            rules: [{required: true, message: '请输入用户名!'}],
                        })(
                            <Input
                                className="login-item"
                                size="large"
                                placeholder="用户名"
                                prefix={<UserOutlined />}
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{required: true, message: '请输入密码!'}],
                        })(
                            <Input
                                className="login-item"
                                size="large"
                                placeholder="密码"
                                prefix={<LockOutlined />}
                                type="password"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('repeatedPassword', {
                            rules: [{required: true, message: '请重复输入密码！'}],
                        })(
                            <Input
                                className="login-item"
                                size="large"
                                placeholder="重复输入密码"
                                prefix={<LockOutlined />}
                                type="password"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType="submit" className="login-button">
                            注册
                        </Button>
                    </Form.Item>
                </Form>
                <Button className="login-button" onClick={this.goLogin}>返回登录</Button>
            </div>
        );
    }
}

const Register = Form.create({})(RegisterForm);

export default Register;
