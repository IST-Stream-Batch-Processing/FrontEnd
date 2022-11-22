import React from 'react';
import {Button, Form, Input} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import history from '../utils/history';
import {getRoles, getToken, setToken} from '../utils/token';
import '../css/login.css';
import {routeWithRole} from '../utils/routeUtil';
import {login} from '../api/user';

class LoginForm extends React.Component {
    constructor() {
        const token = getToken();
        if (token != null) {
            routeWithRole('', JSON.parse(getRoles(token))[0]);
        }
        super();
    }

    doLogin = async (e) => {
        e.preventDefault();
        const {form} = this.props;
        try {
            // antd uses async validator
            await form.validateFields();
            const token = await login(form.getFieldsValue());
            setToken(token);
            routeWithRole('', JSON.parse(getRoles(token))[0]);
        } catch (err) {
            console.error(err);
        }
    }

    goRegister = () => {
        history.replace('/register');
    }

    render() {
        const {form} = this.props;
        const {getFieldDecorator} = form;
        return (
            <div className="login-form">
                <div className="login-text">欢迎使用低代码平台</div>
                <Form onSubmit={this.doLogin} className="login-form">
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
                        <Button htmlType="submit" className="login-button">
                            登录
                        </Button>
                    </Form.Item>
                </Form>
                <Button className="login-button" onClick={this.goRegister}>注册</Button>
            </div>
        );
    }
}

const Login = Form.create({})(LoginForm);

export default Login;
