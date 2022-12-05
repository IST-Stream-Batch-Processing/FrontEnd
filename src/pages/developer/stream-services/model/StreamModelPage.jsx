import React from 'react';
import {
Button, Divider, Icon, Layout, message, Table
} from 'antd';
import Title from "antd/es/typography/Title";
import {NavLink} from "react-router-dom";
import history from '../../../../utils/history';
import {deleteModelData, getAllModelData} from "../../../../api/stream";

const {Column} = Table;

class StreamModelPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  getAllData = () => {
    try {
      getAllModelData().then(result => {
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
              history.push("/developer/streamProcess/model/create");
            }}
          >
            创建
          </Button>
        </div>
        <Divider />
        <Table dataSource={this.state.data} size="small">
          <Column title="数据源id" dataIndex="id" key="id" />
          <Column title="用户id" dataIndex="userId" key="userId" />
          <Column title="数据源文件路径" dataIndex="filePath" key="filePath" />
          <Column title="数据名称" dataIndex="className" key="className" />
          <Column
            title="是否使用时间戳"
            render={(text, record) => (record.isTimeStamp ? (
              <Icon type="check" />
            ) : (<Icon type="close" />))}
          />
          <Column title="时间戳属性名称" dataIndex="timeStampName" key="timeStampName" />
          <Column
            title="操作"
            key="action"
            render={(text, record) => (
              <span>
                <Button>
                    <NavLink to="/developer/streamProcess/model/data">
                        查看
                    </NavLink>
                </Button>
                <Divider type="vertical" />
                <Button>
                    <NavLink to={`/developer/streamProcess/model/${record.id}`}>
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

export default StreamModelPage;
