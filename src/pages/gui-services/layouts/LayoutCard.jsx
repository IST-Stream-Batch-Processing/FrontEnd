import React from 'react';
import { Card } from 'antd';
import { SettingOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import history from '../../../utils/history';

const stateMap = new Map(
    [
        ['unpublished', '未发布'],
        ['submitted', '已提交'],
        ['published', '已发布']
    ]
);

export default function LayoutCard(props) {
    const openLayoutPage = () => {
        history.push(`/layout/${props.data.id}`);
    };

    return (
        <Card
            hoverable
            style={{
                width: 240,
                // height: 320,
                margin: 20
            }}
            cover={(
                <img
                    alt="example"
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
            )}
            actions={[
                <SettingOutlined key="setting" />,
                <EditOutlined key="edit" onClick={openLayoutPage} />,
                <DeleteOutlined key="delete" onClick={() => props.deleteLayout(props.data.id)} />
            ]}
        >
            <Card.Meta
                title={props.data.name}
                description={(
                    <div>
                        {props.data.description}
                        <br />
                        状态：
                        {stateMap.get(props.data.state)}
                    </div>
                )}
            />
        </Card>
    );
}
