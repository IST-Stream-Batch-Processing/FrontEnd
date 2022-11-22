import React from 'react';
import {Layout} from 'antd';
import {css} from 'aphrodite';
import styles from '../constants/pageStyle';
import TitleBar from './TitleBar';
import Footer from './Footer';
import handleToken from '../utils/handleToken';

const {Content} = Layout;
/*
 * content 为传递过来的函数式组件
 */
export default function simplePageWrapper(content, props) {
    handleToken(props);
    return (
        <Layout className={css(styles.layout)}>
            <TitleBar props={props} />
            <Layout className={css(styles.content)}>
                <Content className={css(styles.mainContent)}>
                    {content}
                </Content>
            </Layout>
            <Footer />
        </Layout>
    );
}
