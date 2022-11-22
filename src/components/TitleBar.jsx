import React, {useEffect, useState} from 'react';
import {
Button, Dropdown, Layout, Menu,
} from 'antd';
import {css, StyleSheet} from 'aphrodite';
import {DownOutlined} from '@ant-design/icons';
import history from '../utils/history';
import {
clearToken, getRoles, getToken, getUsername
} from '../utils/token';
import {route2home} from '../utils/routeUtil';
import titleImage from '../constants/titleIcon.png';

const styles = StyleSheet.create({
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 45,
        zIndex: 1,
        boxShadow: '0px 0px 1px 1px rgb(150,150,150,0.6)',
        backgroundColor: 'rgb(252,252,252)',
        paddingLeft: 20,
    },
    title: {
        flexGrow: 1,
        marginTop: 10,
    },
    headerText: {
        color: 'white',
    },
    titleText: {
        color: 'black',
        fontSize: 20,
        fontFamily: 'KaiTi',
        fontWeight: 'bold',
    },
    buttonText: {
        color: 'rgb(75,75,75)',
    }
});

const title = '低代码平台';

const {Header} = Layout;

export default function titleBar(props) {
    const token = getToken();
    if (token == null) {
        return <></>;
    }
    const [model, setModel] = useState('');
    const userRoles = JSON.parse(getRoles(token));

    const menu = (
        <Menu>
            {
                userRoles.map(role => {
                    let tmpRole = '';
                    let tmpUrl = '';
                    if (role === 'Developer') {
                        tmpRole = '研发模式';
                        tmpUrl = '/developer';
                    } else if (role === 'Customer') {
                        tmpRole = '用户模式';
                        tmpUrl = '/home';
                    } else {
                        tmpRole = '管理模式';
                        tmpUrl = '/admin';
                    }
                    return (
                        <Menu.Item
                            onClick={() => {
                                history.replace(tmpUrl);
                            }}
                            key={tmpRole}
                        >
                            {tmpRole}
                        </Menu.Item>
                    );
                })
            }

        </Menu>
    );

    useEffect(() => {
        if (props.props.currentModel === 'Customer') setModel('用户模式');
        else if (props.props.currentModel === 'Developer') setModel('研发模式');
        else setModel('管理模式');
    });

    return (
        <Header className={css(styles.header)}>
            <img src={titleImage} alt="" style={{width: 20, height: 20}} />
            <h2 className={css(styles.title)}>
                <Button onClick={() => route2home()} type="link">
                    <span className={css(styles.titleText)}>{title}</span>
                </Button>
            </h2>
            {
                userRoles.length > 1 ?
                    (
                        <Dropdown overlay={menu}>
                            <Button>
                                {model}
                                <DownOutlined />
                            </Button>
                        </Dropdown>
                    ) : null
            }
            {
                token == null ?
                    (
                        <>
                            <Button
                                icon="login"
                                type="link"
                                onClick={() => {
                                    history.replace('/login');
                                }}
                                className={css(styles.buttonText)}
                            >
                                登录
                            </Button>
                            <Button
                                icon="copy"
                                type="link"
                                onClick={() => {
                                    history.replace('/register');
                                }}
                                className={css(styles.buttonText)}
                            >
                                注册
                            </Button>
                        </>
                    )
                    :
                    (
                        <>
                            <Button
                                icon="user"
                                type="link"
                                onClick={() => {
                                    history.push('profile');
                                }}
                                className={css(styles.buttonText)}
                            >
                                {getUsername(getToken())}
                            </Button>
                            <Button
                                icon="logout"
                                type="link"
                                onClick={() => {
                                    clearToken();
                                    history.push('/login');
                                }}
                                className={css(styles.buttonText)}
                            >
                                登出
                            </Button>
                        </>
                    )
            }
        </Header>
    );
}
