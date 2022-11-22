import React from 'react';
import {Layout} from 'antd';
import {css, StyleSheet} from 'aphrodite';

const styles = StyleSheet.create({
    copyright: {
        textAlign: 'center',
        color: 'gray',
        fontSize: 'small',
        backgroundColor: 'rgb(249,250,251)',
    },
});

const {Footer} = Layout;

const PageFooter = () => (
    <Footer className={css(styles.copyright)}>
        Copyright © 2022 IST. All Rights Reserved.
    </Footer>
);

export default PageFooter;
