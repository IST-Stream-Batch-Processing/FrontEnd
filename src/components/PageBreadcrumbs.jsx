import React from 'react';
import {Breadcrumb} from "antd";
import {useLocation} from "react-router-dom";
import {css} from "aphrodite";
import styles from '../constants/pageStyle';

// custom hook to get the current pathname in React
export const getPathname = () => {
    const location = useLocation();
    console.log(location.pathname);
    return location.pathname;
};

const breadcrumbsMapping = {
    '/developer/layouts': '界面',
    '/developer/streamProcess/model': '流处理服务/流数据源',
    '/developer/streamProcess/model/create': '流处理服务/流数据源/创建流数据源',
    '/developer/streamProcess/service': '流处理服务/流数据处理'
};

const PageBreadcrumbs = ({routes}) => (
        <Breadcrumb className={css(styles.breadCrumbs)}>
            {breadcrumbsMapping[getPathname()] ? breadcrumbsMapping[getPathname()].split("/").map((item) => <Breadcrumb.Item>{item}</Breadcrumb.Item>) : null}
        </Breadcrumb>
    );

export default PageBreadcrumbs;
