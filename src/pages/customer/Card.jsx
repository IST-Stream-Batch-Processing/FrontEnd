import React from 'react';
import {Avatar, Card} from 'antd';
import history from '../../utils/history';
import page from '../../constants/pageAvatar.png';

export default function pageCard(props) {
    function openLViewPage() {
        history.push(`/view/${props.data.id}`);
    }

    return (
        <Card
            hoverable
            style={{
                width: 300,
                margin: 20
            }}
            onClick={openLViewPage}
        >
            <Card.Meta
                avatar={<img style={{width: '30px', height: '30px'}} alt="" src={page} />}
                title={`界面名称：${props.data.name}`}
                description={`描述：${props.data.description}`}
            />
        </Card>
    );
}
