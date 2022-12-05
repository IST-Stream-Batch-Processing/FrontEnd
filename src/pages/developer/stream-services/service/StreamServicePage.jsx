import React from 'react';
import {
Button, Divider, Layout, message, Table
} from 'antd';
import Title from "antd/es/typography/Title";
import {NavLink} from "react-router-dom";
import Column from "antd/es/table/Column";
import {deleteModelData, getAllServiceData} from "../../../../api/stream";
import history from "../../../../utils/history";

class StreamServicePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  getAllData = () => {
    try {
      getAllServiceData().then(result => {
        this.setState(state => ({
          data: result
        }));
      });
    } catch (err) {
      console.error(err);
    }
  }

  deleteRecord = (id) => {
    try {
      deleteModelData(id).then(() => {
        this.getAllData();
      });
      message.success("成功删除！");
    } catch (err) {
      console.error(err);
      message.error("删除失败！");
    }
  }

  componentDidMount() {
    this.getAllData();
  }

  render() {
    console.log(this.state.data);
    return (
      <Layout>
        <div style={{flexDirection: 'row', display: 'flex'}}>
          <Title level={4}>流数据源</Title>
          <Button
            type="primary"
            style={{marginLeft: "auto"}}
            icon="form"
            onClick={() => {
              history.push("/developer/streamProcess/service/create");
            }}
          >
            创建
          </Button>
        </div>
        <Divider />
        <Table dataSource={this.state.data} size="small">
          <Column title="服务id" dataIndex="id" key="id" />
          <Column title="combinationId" dataIndex="combinationId" key="combinationId" />
          <Column title="名称" dataIndex="name" key="name" />
          <Column title="类型" dataIndex="type" key="type" />
          <Column title="originalType" dataIndex="originalType" key="originalType" />
          <Column title="finalType" dataIndex="finalType" key="finalType" />
          <Column title="input" dataIndex="input" key="input" />
          <Column title="output" dataIndex="input" key="output" />
          <Column title="inputType" dataIndex="inputType" key="inputType" />
          <Column title="outputType" dataIndex="outputType" key="outputType" />
          <Column
            title="操作"
            key="action"
            render={(text, record) => (
              <span>
                <Button>
                    <NavLink to="/developer/streamProcess/service/data">
                        查看
                    </NavLink>
                </Button>
                <Divider type="vertical" />
                <Button>
                    <NavLink to={`/developer/streamProcess/service/edit/${record.id}`}>
                        编辑
                    </NavLink>
                </Button>
                <Divider type="vertical" />
                <Button
                  type="danger"
                  onClick={(e) => {
                    e.preventDefault();
                    this.deleteRecord(record.id);
                  }}
                >
                  删除
                </Button>
              </span>
            )}
          />
        </Table>
      </Layout>
    );
  }
}

export default StreamServicePage;
