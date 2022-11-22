import React from 'react';
import pageWrapper from '../../components/PageWrapper';
import TestPage from './TestPage';

const routes = (match) => [{
    key: 'page',
    path: `${match.url}/test_page`,
    component: TestPage,
}];

export default function Test({match}) {
    const items = [{
        id: 1,
        type: 'menu-group',
        iconType: 'edit',
        title: '用户管理',
        item: [
            {
                id: 1.1,
                path: `${match.url}/test_page`,
                text: '权限管理',
            },
        ],
    }];
    const r = routes(match);
    return (
        <div>
            {pageWrapper(items, r)}
        </div>
    );
}
