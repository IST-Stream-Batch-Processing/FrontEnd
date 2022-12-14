import React from 'react';
import {
    Button,
    Card, Col, Layout, Row, Select
} from 'antd';
import LayoutSearchForm from './LayoutSearchForm';
import {deleteLayout, getLayoutsByProjectId} from '../../../api/gui';
import CreateLayoutPopup from './CreateLayoutPopup';
import LayoutCard from './LayoutCard';
import {getProjectId} from '../../../utils/token';

class LayoutPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: 'time_order',
            isCreating: false,
            dataSource: [],
        };
    }

    componentDidMount() {
        this.getLayouts();
    }

    getLayouts = async () => {
        let dataSource = [];
        try {
            dataSource = await getLayoutsByProjectId(getProjectId());
        } catch (err) {
            console.error(err);
        } finally {
            this.setState(state => ({
                dataSource
            }));
        }
    };

    deleteLayout = async (id) => {
        try {
            await deleteLayout(id).then(
                await this.getLayouts
            );
        } catch (err) {
            console.error(err);
        }
    }

    changeOrder = (value) => {
        this.setState(state => ({
            order: value
        }));
    };

    openCreatePopup = () => {
        this.setState(state => ({
            isCreating: true
        }));
    };

    closeCreatePopup = () => {
        this.setState(state => ({
            isCreating: false
        }));
        this.getLayouts();
    };

    render() {
        const createLayout = this.state.isCreating;
        const layoutCards = this.state.dataSource.map((src) => (
            <LayoutCard key={src.id} data={src} deleteLayout={(id) => this.deleteLayout(id)} />
        ));
        return (
            <>
                <Layout>
                    {/* <LayoutSearchForm /> */}
                    <Row type="flex" justify="start" style={{ marginBottom: 20 }}>
                        <Col span={4}>
                            <Button
                                type="primary"
                                style={{ marginRight: 10 }}
                                icon="plus"
                                onClick={this.openCreatePopup}
                            >
                                ??????
                            </Button>
                            {/* <Button type="default" icon="check">??????</Button> */}
                        </Col>
                        {/* <Col */}
                        {/*    offset={16} */}
                        {/*    span={4} */}
                        {/*    style={{ */}
                        {/*        display: 'flex', */}
                        {/*        justifyContent: 'end' */}
                        {/*    }} */}
                        {/* > */}
                        {/*    <Select */}
                        {/*        defaultValue="time_order" */}
                        {/*        style={{ width: 120 }} */}
                        {/*        onChange={this.changeOrder} */}
                        {/*    > */}
                        {/*        <Select.Option value="time_order">????????????</Select.Option> */}
                        {/*        <Select.Option value="time_order_reverse">????????????</Select.Option> */}
                        {/*    </Select> */}
                        {/* </Col> */}
                    </Row>
                    <Card title="????????????">
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap'
                        }}
                        >
                            {layoutCards}
                        </div>
                    </Card>
                </Layout>
                {createLayout ?
                    <CreateLayoutPopup onClick={() => this.closeCreatePopup()} /> : null}
            </>
        );
    }
}

export default LayoutPage;
