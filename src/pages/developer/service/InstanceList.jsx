import React from 'react';
import {
    Tree,
    Modal, Table, Tag, Typography
} from 'antd';
import renderTree from '../../../components/as-services/LogDataTreeRender';

const {Text} = Typography;

function handleTime(src) {
    let tmp = src.replace('T', ' ');
    tmp = tmp.split('.', 2)[0];
    return tmp;
}

function getTagColor(status) {
    switch (status) {
        case 'SUCCESS':
            return 'green';
        case 'FAIL':
            return 'red';
        default:
            return 'orange';
    }
}

function getOutputOrError(instance) {
    switch (instance.status) {
        case 'FAIL':
            return instance.failMessage;
        case 'SUCCESS':
            return <Tree>{renderTree('', JSON.parse(instance.outputData))}</Tree>;
        default:
            return '--';
    }
}

function getOutputStyle(status) {
    if (status === 'FAIL') {
        return {color: 'red'};
    }
    return {};
}

const columns = [
    {
        title: '状态',
        width: '5%',
        render: (text, recorder) => (
            <Tag color={getTagColor(recorder.status)}>
                {recorder.status}
            </Tag>
        )
    },
    {
        title: '输入',
        width: '10%',
        render: (text, recorder) => <Tree key={recorder.id}>{renderTree('', JSON.parse(recorder.inputData))}</Tree>
    },
    {
        title: '输出',
        width: '10%',
        render: (text, recorder) => <Text style={getOutputStyle(recorder.status)}>{getOutputOrError(recorder)}</Text>
    },
    {
        title: '开始时间',
        width: '8%',
        render: (text, recorder) => <>{handleTime(recorder.startTime)}</>
    },
    {
        title: '结束时间',
        width: '8%',
        render: (text, recorder) => <>{recorder.status === 'RUNNING' ? '--' : handleTime(recorder.endTime)}</>
    }
];

export default function InstanceList(props) {
    const { show, onClose, data } = props;
    return (
        <div>
            <Modal
                width="1200px"
                bodyStyle={{width: '100%'}}
                title="服务日志"
                visible={show}
                onCancel={onClose}
                onOk={onClose}
            >
                <Table columns={columns} dataSource={data} rowKey="id" />
            </Modal>
        </div>
    );
}
