import React from 'react';
import {Modal, Tag} from 'antd';
import {useSelector} from 'react-redux';
import {UserOutlined} from '@ant-design/icons';
import {selectServiceDetail} from '../../../redux/reducers/detailSlice';
import Tree from './TypeTree';
import {updateAS} from '../../../api/developer';

export default function DetailModal(show = false, onClose, getData) {
    const detail = useSelector(selectServiceDetail);

    function modal() {
        return (
            <Modal
                title="服务详情"
                visible={show}
                onOk={() => {
                onClose();
                updateAS(detail, detail.id).then(() => {
                    getData();
                });
            }}
                onCancel={onClose}
                okText="保存"
            >
                <p>
                    服务名称：
                    {detail.name}
                </p>
                <p>
                    服务描述：
                    {detail.description}
                </p>
                <p>
                    创建人：
                    <Tag color="green">
                        <UserOutlined />
                        {detail.creator.username}
                    </Tag>
                </p>
                <p>
                    {Tree({name: 'In', type: detail.inType})}
                </p>
                <p>
                    {Tree({name: 'Out', type: detail.outType})}
                </p>
            </Modal>
        );
    }

    return (
        <div>
            {detail.name && modal()}
        </div>
    );
}
