import React from 'react';
import {
Button, Divider, Layout, Table, Tag
} from 'antd';
import Title from "antd/es/typography/Title";
import {NavLink} from "react-router-dom";

const {Column} = Table;

class StreamModelPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const data = [{
            key: '1',
            firstName: 'John',
            lastName: 'Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
            tags: ['nice', 'developer'],
        }, {
            key: '2', firstName: 'Jim', lastName: 'Green', age: 42, address: 'London No. 1 Lake Park', tags: ['loser'],
        }, {
            key: '3',
            firstName: 'Joe',
            lastName: 'Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
            tags: ['cool', 'teacher'],
        }];

        return (
            <Layout>
                <div style={{flexDirection: 'row', display: 'flex'}}>
                    <Title level={4}>流数据源</Title>
                    <Button type="primary" style={{marginLeft: "auto"}} icon="form">
                        <NavLink to="/developer/streamProcess/model/create">
                            创建
                        </NavLink>
                    </Button>
                </div>
                <Divider />
                <Table dataSource={data} size="small">
                    <Column title="First Name" dataIndex="firstName" key="firstName" />
                    <Column title="Last Name" dataIndex="lastName" key="lastName" />
                    <Column title="Age" dataIndex="age" key="age" />
                    <Column title="Address" dataIndex="address" key="address" />
                    <Column
                        title="Tags"
                        dataIndex="tags"
                        key="tags"
                        render={tags => (
                            <span>
                                {tags.map(tag => (
                                    <Tag color="blue" key={tag}>
                                        {tag}
                                    </Tag>
                                ))}
                            </span>
                        )}
                    />
                    <Column
                        title="操作"
                        key="action"
                        render={(text, record) => (
                            <span>
                                <Button>编辑</Button>
                                <Divider type="vertical" />
                                <Button type="danger">删除</Button>
                            </span>
                        )}
                    />
                </Table>
            </Layout>
        );
    }
}

export default StreamModelPage;
