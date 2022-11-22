import React from 'react';
import {Layout, } from 'antd';
import {css} from 'aphrodite';
import {Route} from 'react-router-dom';
import styles from '../constants/pageStyle';
import TitleBar from './TitleBar';
import Footer from './Footer';
import SiderWrapper from './SiderWrapper';
import handleToken from '../utils/handleToken';
import PageBreadcrumbs from "./PageBreadcrumbs";

const {Content} = Layout;

export default function pageWrapper(items, routes, props) {
    handleToken(props);
    return (
        <Layout className={css(styles.layout)}>
            <TitleBar props={props} />
            <Layout>
                <SiderWrapper items={items} />
                <Layout className={css(styles.content)}>
                    <Content className={css(styles.mainContent)}>
                        <PageBreadcrumbs routes={routes} />
                        {routes.map((route) => (
                                <Route
                                    exact
                                    path={route.path}
                                    component={route.component}
                                    key={route.path}
                                />
                        ))}
                    </Content>
                    <Footer />
                </Layout>
            </Layout>
        </Layout>
    );
}
