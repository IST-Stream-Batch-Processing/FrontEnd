import React from 'react';
import {
 Button, Col, Form, Input, Row
} from 'antd';

class LayoutSearchForm extends React.Component {
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
        });
    };

    render() {
        return (
            <Form
                name="layout_search"
                onSubmit={this.handleSearch}
            >
                {/* <Row type="flex" justify="center"> */}
                {/*    <Col span={8} key="search"> */}
                        <Form.Item
                            name="Search"
                            rules={[
                                {
                                    required: false,
                                }
                            ]}
                            style={{display: 'flex', justifyContent: 'center'}}
                        >
                            <Input placeholder="界面名称" style={{width: 480, marginRight: 10}} />
                            <Button type="primary" htmlType="submit">搜索</Button>
                        </Form.Item>
                    {/* </Col> */}
                    {/* <Col span={3} style={{ textAlign: 'right' }}> */}
                    {/* </Col> */}
                {/* </Row> */}
            </Form>
        );
    }
}

// eslint-disable-next-line no-class-assign
LayoutSearchForm = Form.create({})(LayoutSearchForm);
export default LayoutSearchForm;
