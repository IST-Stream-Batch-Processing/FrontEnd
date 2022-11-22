import React from 'react';
import {
  Button, Form, Input, Select, Popconfirm, Card, Modal, message, Row, Col
} from 'antd';
import {
  getDepartmentList, deleteDepartment, createDepartment, getDepartmentUser
} from '../../../api/department';
import DepartmentNewModal from './DepartmentNewModal';
import DepartmentUserModal from './DepartmentUserModal';
import TableWithSearch from '../../../components/TableWithSearch';
import {
  allocate, getUsers
} from '../../../api/admin';

class EditDepartment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      departmentList: props.departmentList,
      currentDepartment: props.departmentList.find(item => item.id === props.currentId),
      userList: [],
      currentUserList: props.currentUserList,
      modalNewVisible: false,
      modalUserVisible: false,
      memberWindowVisible: false,
    };
  }

  async componentDidMount() {
    await this.getDepartments();
    await this.getUsers();
  }

  componentWillUnmount() {
    this.setState = () => false;
  }

  getDepartments = async () => {
    getDepartmentList().then((r) => {
      this.setState({ departmentList: r });
    });
  }

  getUsers = async () => {
    getUsers().then((r) => {
      this.setState({ userList: r });
    });
  }

  create = async (data) => {
    createDepartment(data).then((r) => {
      this.getDepartments();
      this.setState({
        modalNewVisible: false,
      });
      message.success('创建成功');
    }).catch((e) => {
      console.error(e);
    });
  }

  delete = async (id) => {
    deleteDepartment(id).then((r) => {
      this.setState(prev => ({ departmentList: prev.departmentList.filter(item => item.id !== id)}));
      message.success('删除成功');
      this.props.cancel();
    }).catch((e) => {
      console.error(e);
    });
  }

  update = () => {
    this.getUsers();
    this.getDepartments();
  }

  showCreateModal = () => {
    this.setState({
      modalNewVisible: true
    });
  }

  showAllocateModal = () => {
    this.setState({
      modalUserVisible: true
    });
  }

  showMemberWindow = () => {
    this.setState({
      memberWindowVisible: true
    });
  }

  closeWindow = () => {
    this.setState({
      memberWindowVisible: false
    });
  }

  cancel = () => {
    this.setState({
      modalNewVisible: false,
      modalUserVisible: false
    });
  }

  submit = async (e) => {
    e.preventDefault();
    const { form } = this.props;
    try {
      await form.validateFields();
      this.props.submit(form.getFieldsValue());
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { departmentList, currentDepartment } = this.state;
    const columnsMember = [{
      title: '用户名',
      key: 'name',
      align: 'center',
    },
    ];
    return (
      <div>
        <Card bordered={false} size="small">
              <Button type="primary" icon="plus" onClick={this.showCreateModal} style={{marginRight: 10}}>
                新建子部门
              </Button>
              <Button icon="search" type="primary" onClick={this.showAllocateModal} style={{marginRight: 10}}>
                查看成员列表
              </Button>
              <Popconfirm
                title="确定删除吗"
                onConfirm={() => this.delete(currentDepartment.id)}
                okText="Yes"
                cancelText="No"
                type="error"
              >
                <Button icon="delete" type="danger" ghost>
                  删除
                </Button>
              </Popconfirm>
            <Form onSubmit={this.submit} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} style={{marginTop: 40}}>
            <Form.Item label="重命名" style={{marginBottom: 10}}>
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入部门名称!' }],
                initialValue: currentDepartment.name
              })(
                <Input
                  placeholder="部门名称"
                />,
              )}
            </Form.Item>
            <Form.Item label="上级部门" style={{marginBottom: 10}}>
              {getFieldDecorator('parentId', {
                initialValue: currentDepartment.parentId
              })(
                <Select>
                  {
                    departmentList.map((item) => (
                      <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                    ))
                  }
                </Select>
              )}
            </Form.Item>
            <Form.Item style={{marginBottom: 10}}>
              <Button htmlType="submit" type="primary" icon="form">
                修改节点
              </Button>
            </Form.Item>
            </Form>
        </Card>
        <Modal
          title="新建子部门"
          visible={this.state.modalNewVisible}
          onCancel={this.cancel}
          destroyOnClose
          footer={null}
        >
          <DepartmentNewModal
            key={this.state.modalNewVisible + this.state.currentDepartment.id}
            submit={(data) => this.create(data)}
            currentDepartment={this.state.currentDepartment}
          />
        </Modal>
        <Modal
          title="成员列表"
          visible={this.state.memberWindowVisible}
          onOk={this.closeWindow}
          onCancel={this.closeWindow}
          footer={null}
        >
          <TableWithSearch
            rowKey={() => Math.random()}
            style={{ marginBottom: '10px' }}
            columns={columnsMember}
            dataSource={this.state.departmentList.length > 0 ? this.state.currentUserList.users : []}
            pagination={false}
          />
        </Modal>
        <Modal
          title="成员信息"
          visible={this.state.modalUserVisible}
          onCancel={this.cancel}
          destroyOnClose
          footer={null}
          maskTransitionName=""
        >
          <DepartmentUserModal
            key={this.state.modalUserVisible + this.state.currentDepartment}
            submit={() => this.update()}
            userList={this.state.userList}
            currentDepartment={this.state.currentDepartment}
            departmentListLength={this.state.departmentList.length}
            currentUserList={this.state.currentUserList}
          />
        </Modal>
      </div>
    );
  }
}

const DepartmentModal = Form.create({})(EditDepartment);

export default DepartmentModal;
