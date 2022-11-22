import React from 'react';
import {
  Button, Form, message, Popconfirm, Select
} from 'antd';
import {
    getDepartmentUser
} from '../../../api/department';
import {
  allocate,
  deallocate
} from '../../../api/admin';
import TableWithSearch from '../../../components/TableWithSearch';

class CreateDepartmentUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userList: props.userList,
            currentDepartment: props.currentDepartment,
            departmentListLength: props.departmentListLength,
            currentUserList: [],
            loading: true,
        };
    }

    async componentDidMount() {
        await this.getDepartmentUserList(this.state.currentDepartment.id);
    }

    componentWillUnmount() {
      this.setState = () => false;
    }

    getDepartmentUserList = async (id) => {
        getDepartmentUser(id).then((r) => {
            this.setState({ currentUserList: r, loading: false });
        });
    }

    submit = async (e) => {
        e.preventDefault();
        const { form } = this.props;
        this.setState({loading: true});
        try {
          form.validateFields().then((values) => {
            if (values && values.id) {
              allocate(values.id,
                this.state.currentDepartment).then((r) => {
                message.success('添加成功');
                this.getDepartmentUserList(this.state.currentDepartment.id);
                this.props.submit();
              });
            } else {
              message.error("请选择成员");
            }
          });
        } catch (err) {
            console.error(err);
        } finally {
          this.setState({loading: false});
        }
    }

    unallocate = async (id) => {
      this.setState({loading: true});
      deallocate(id, this.state.currentDepartment).then((r) => {
        message.success('移除成功');
        this.getDepartmentUserList(this.state.currentDepartment.id);
        this.props.submit();
      }).catch((err) => {
        console.error(err);
        this.setState({loading: false});
      });
    }

    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        const {
            userList,
            departmentListLength
        } = this.state;
        const columnsMember = [{
            title: '用户名',
            key: 'username',
            dataIndex: 'username',
            align: 'center',
          }, {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (text) => (
              <>
                  <Popconfirm
                    title="确定移除吗"
                    okText="Yes"
                    cancelText="No"
                    type="error"
                    onConfirm={() => this.unallocate(text.id)}
                  >
                      <Button icon="delete" type="danger" ghost style={{marginLeft: '5px' }} size="small">
                          移除
                      </Button>
                  </Popconfirm>
              </>
            )
        }
        ];
        return (
                <Form onSubmit={this.submit}>
                        <TableWithSearch
                            rowKey={() => Math.random()}
                            style={{ marginBottom: '10px' }}
                            columns={columnsMember}
                            dataSource={departmentListLength > 0 ? this.state.currentUserList.users : []}
                            pagination={false}
                            loading={this.state.loading}
                        />
                    <Form.Item>
                        {getFieldDecorator('id', {
                            initialValue: '',
                        })(
                            <Select placeholder="成员列表">
                                {
                                    userList.map((item) => (
                                        <Select.Option value={item.id} key={item.id}>{item.username}</Select.Option>
                                    ))
                                }
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType="submit" type="primary">
                            添加成员
                        </Button>
                    </Form.Item>
                </Form>
        );
    }
}

const DepartmentUserModal = Form.create({})(CreateDepartmentUser);

export default DepartmentUserModal;
