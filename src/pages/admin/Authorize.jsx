import React from 'react';
import {
  Button, Card, Table, Tag, PageHeader
} from 'antd';
import { withRouter } from 'react-router-dom';
import {
  getDepartmentList, deleteDepartment, createDepartment, updateDepartment
} from '../../api/department';
import {
  authorize, getUsers, assign, allocate
} from '../../api/admin';
import Role from '../../constants/role';

class Authorize extends React.Component {
  constructor() {
    super();
    this.state = {
      dataSource: [],
    };
  }

  getData = () => {
    try {
      getUsers().then(r => {
        this.setState({
          dataSource: r
        });
      });
    } catch (err) {
      console.error(err);
    }
  }

  componentDidMount() {
    this.getData();
  }

  deleteOneElement = (arr, ele) => {
    const index = arr.indexOf(ele);
    arr.splice(index, 1);
    return arr;
  }

  authorize = (id, roles) => {
    try {
      authorize(id, roles).then(() => {
        this.getData();
      });
    } catch (err) {
      console.error(err);
    }
  }

  allocate = (id, department) => {
    try {
      allocate(id, department).then(() => {
        this.getData();
      });
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const { dataSource } = this.state;
    const columns = [
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
        align: 'center',
      },
      {
        title: '用户权限',
        dataIndex: 'roles',
        key: 'roles',
        align: 'center',
        render: roles => (
          <>
            {roles.map(role => {
              let color = '';
              let roleName = '';
              if (role === Role.Customer) {
                color = 'geekblue';
                roleName = '普通用户';
              } else if (role === Role.Developer) {
                color = 'volcano';
                roleName = '研发人员';
              } else {
                color = 'green';
                roleName = '管理员';
              }
              return (
                <Tag color={color} key={role}>
                  {roleName}
                </Tag>
              );
            })}
          </>
        ),
      },
      {
        title: '研发人员授权',
        key: 'action',
        align: 'center',
        width: '300px',
        render: (record) => (
          record.roles.indexOf(Role.Developer) > -1 ?
            (
              <Button
                style={{ width: 90 }}
                onClick={() => {
                  this.authorize(record.id,
                    this.deleteOneElement(record.roles, Role.Developer));
                }}
              >
                取消授权
              </Button>
            )
            : (
              <Button
                style={{ width: 90 }}
                onClick={() => {
                  this.authorize(record.id, [...record.roles, Role.Developer]);
                }}
              >
                授权
              </Button>
            )
        )
      },
      {
        title: '管理人员授权',
        key: 'action2',
        align: 'center',
        width: '300px',
        render: (record) => (
          record.roles.indexOf(Role.Admin) > -1 ?
            (
              <Button
                style={{ width: 90 }}
                onClick={() => {
                  this.authorize(record.id,
                    this.deleteOneElement(record.roles, Role.Admin));
                }}
              >
                取消授权
              </Button>
            )
            : (
              <Button
                style={{ width: 90 }}
                onClick={() => {
                  this.authorize(record.id, [...record.roles, Role.Admin]);
                }}
              >
                授权
              </Button>
            )
        )
      },
    ];
    return (
      <>
        <Card>
          <div className="panelSpan" style={{ margin: '10px' }}>用户权限列表</div>
          <Table
            bordered
            columns={columns}
            dataSource={dataSource}
            size="middle"
            rowKey={record => record.id}
          />
        </Card>
      </>
    );
  }
}

export default withRouter(Authorize);
