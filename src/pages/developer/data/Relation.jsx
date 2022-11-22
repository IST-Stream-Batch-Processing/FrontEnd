import React from 'react';
import {
    Button,
    Card, Table,
}
    from 'antd';
import {withRouter} from 'react-router-dom';
import {getTableId} from '../../../utils/token';
import {getTableDescriptor, getRelation} from '../../../api/data';
import downloadFile from '../../../utils/downloadFile';

class Relation extends React.Component {
    constructor() {
        super();
        this.state = {
            keys: [],
            dataSource: [],
            property: []
        };
    }

    getDataModel = () => {
        getTableDescriptor(this.props.location.state.relationTableId).then((r) => {
            this.setState({
                property: r.fieldProperty
            });
        }).catch((err) => {
            console.error(err);
        });
        getRelation(getTableId(), this.props.location.state.item, this.props.location.state.name).then(r => {
            this.setState({
                dataSource: r,
            });
            if (r.length > 0) {
                this.setState({
                    keys: Object.keys(r[0]),
                });
            }
        }).catch((err) => {
            console.error(err);
        });
    }

    componentDidMount() {
        this.getDataModel();
    }

    render() {
        const columns = [];
        const {keys} = this.state;
        const {dataSource, property} = this.state;
        keys.forEach((e) => {
            const pro = property.find((item) => item.fieldName === e);
            const row = {
                title: e,
                dataIndex: e,
                key: e,
                align: 'center',
                render: (text) => {
                    if (pro && pro.fieldType === 'File') {
                        return <Button icon="download" onClick={() => downloadFile(text)}>下载文件</Button>;
                    }
                    return <>{text}</>;
                }
            };
            columns.push(row);
        });
        return (
            <>
                <Card>
                    <Table bordered columns={columns} dataSource={dataSource} pagination={false} rowKey="id" key={this.state.property} />
                </Card>
            </>
);
    }
}

export default withRouter(Relation);
