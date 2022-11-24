import React from 'react';
import {Divider, Layout} from 'antd';
import Title from "antd/es/typography/Title";

class StreamModelCreatePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Layout>
                <div style={{flexDirection: 'row', display: 'flex'}}>
                    <Title level={4}>创建流数据源</Title>
                </div>
                <Divider />
            </Layout>
        );
    }
}

export default StreamModelCreatePage;
