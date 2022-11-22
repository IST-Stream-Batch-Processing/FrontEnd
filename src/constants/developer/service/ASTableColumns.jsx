import React from 'react';
import {Tag} from 'antd';
import {UserOutlined} from '@ant-design/icons';

const columns = [
    {
        title: '服务名',
        dataIndex: 'serviceName',
        key: 'serviceName',
        width: '10%',
        render: (text, recorder) => (
            <div>
                {recorder.name}
            </div>
        ),
    },
    {
        title: '上传用户',
        dataIndex: 'username',
        key: 'username',
        width: '10%',
        render: (text, recorder) => (
            <div>
                <Tag color="green">
                    <UserOutlined />
                    {recorder.creator.username}
                </Tag>
            </div>
        ),
    },
    {
        title: '服务描述',
        dataIndex: 'description',
        key: 'description',
        width: '15%',
        render: (text, recorder) => (
            <div style={{fontSize: 'small'}}>{recorder.description}</div>
        ),
    },
    {
        title: '操作',
        align: 'center',
        dataIndex: 'operator',
        key: 'operator',
        width: '10%',
        render: null,
    }
];

export default function ASTableColumns(render) {
    columns[3].render = render;
    return columns;
}
