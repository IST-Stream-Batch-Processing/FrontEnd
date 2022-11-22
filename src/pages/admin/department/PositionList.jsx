import React, { useRef } from 'react';
import {
    Button, Card, message, Modal, Popconfirm, Table, Badge
} from 'antd';
import {
    getPositionList, deletePosition, createPosition, updatePosition
} from '../../../api/position';
import {
    assign, getUsers, unassign
} from '../../../api/admin';

import TableWithSearch from '../../../components/TableWithSearch';
import PositionModal from './PositionModal';
import PositionUserModal from './PositionUserModal';

export default class PositionList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [], // User 数据库
            positions: [], // Position 数据库
            loading: true,
            modalVisible: false,
            modalUserVisible: false,
            memberWindow: false,
            currentId: null,
            usersOfOnePosition: [],
        };
    }

    async componentDidMount() {
        await this.getPositions();
        await this.getUsers();
    }

    getUsers = async () => {
        getUsers().then((r) => {
            this.setState({ users: r, loading: false });
        });
    }

    getPositions = async () => {
        getPositionList().then((r) => {
            this.setState({ positions: r, loading: false });
        });
    }

    delete = async (id) => {
        this.setState({ loading: true });
        deletePosition(id).then((r) => {
            this.setState(prev => ({ positions: prev.positions.filter(item => item.id !== id), loading: false }));
        }).catch((e) => {
            console.error(e);
        });
        this.setState({
            loading: false
        });
    }

    create = async (data) => {
        this.setState({ loading: true });
        if (this.state.currentId !== null) {
            await this.edit(data);
            return;
        }
        createPosition(data).then((r) => {
            this.getPositions();
            this.setState({
                modalVisible: false,
                currentId: null,
            });
            message.success('创建成功');
        }).catch((e) => {
            console.error(e);
        });
        this.setState({
            loading: false
        });
    }

    edit = async (data) => {
        data = {
            ...data,
            id: this.state.currentId
        };
        updatePosition(data).then((r) => {
            this.getPositions();
            this.setState({
                modalVisible: false,
                currentId: null
            });
            message.success('重命名成功');
        }).catch((e) => {
            console.error(e);
        });
        this.setState({
            loading: false
        });
    }

    showCreateModal = () => {
        this.setState({
            currentId: null,
            modalVisible: true
        });
    }

    showEditModal = (id) => {
        this.setState({
            currentId: id,
            modalVisible: true
        });
    }

    cancel = () => {
        this.setState({
            modalVisible: false,
            modalUserVisible: false
        });
    }

    assign = (user) => {
        this.setState({ loading: true });
        assign(user.id,
            this.state.positions.find(item => item.id === this.state.currentId)).then((r) => {
                this.getUsers();
                this.getPositions();
                this.setState({
                    modalUserVisible: false,
                    currentId: null,
                });
                message.success('添加成功');
            }).catch((e) => {
                console.error(e);
            });
        this.setState({
            loading: false
        });
    }

    showAssignModal = (id) => {
        this.showEditModal(id);
        this.setState({
            modalUserVisible: true,
            modalVisible: false
        });
    }

    showWindowM = async (e) => {
        const position = this.state.positions.find(item => item.id === e);
        this.setState((prev) => ({
            currentId: e,
            memberWindow: true,
            usersOfOnePosition: position.users
        }));
    }

    unassign = async (id) => {
        this.setState({userLoading: true});
        unassign(id,
          this.state.positions.find(item => item.id === this.state.currentId)).then((r) => {
            this.getUsers();
            this.getPositions();
            this.showWindowM(this.state.currentId);
            this.setState((prev) => ({
                usersOfOnePosition: prev.usersOfOnePosition.filter(item => item.id !== id)
            }));
            message.success('移除成功');
        }).catch((e) => {
            console.error(e);
        });
        this.setState({
            userLoading: false
        });
    }

    closeWindow = () => {
        this.setState({
            memberWindow: false
        });
    }

    render() {
        // 加部门显示
        const columnsM = [{
            title: '用户名',
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
                    onConfirm={() => this.unassign(text.id)}
                  >
                      <Button icon="delete" type="danger" ghost style={{marginLeft: '5px' }} size="small">
                          移除
                      </Button>
                  </Popconfirm>
              </>
            )
        }
        ];
        const columns = [
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
                align: 'center',
            },
            {
                title: '操作',
                align: 'center',
                key: 'action',
                render: (index, text) => (
                    <>
                        <Button
                            icon="tags"
                            onClick={() => this.showWindowM(text.id)}
                        >
                            获取成员
                        </Button>
                        <Button
                            icon="form"
                            type="primary"
                            style={{ marginLeft: '5px' }}
                            ghost
                            onClick={k => {
                                k.preventDefault();
                                this.showAssignModal(text.id);
                            }}
                        >
                            添加成员
                        </Button>
                        <Button
                            icon="edit"
                            type="primary"
                            ghost
                            style={{ marginLeft: '5px' }}
                            onClick={k => {
                                k.preventDefault();
                                this.showEditModal(text.id);
                            }}
                        >
                            重命名
                        </Button>
                        <Popconfirm
                            title="确定删除吗"
                            onConfirm={() => this.delete(text.id)}
                            okText="Yes"
                            cancelText="No"
                            type="error"
                        >
                            <Button icon="delete" type="danger" ghost style={{ marginLeft: '5px' }}>
                                删除
                            </Button>
                        </Popconfirm>
                    </>
                )
            },
        ];
        return (
            <div>
                <Button type="primary" onClick={this.showCreateModal} style={{ marginBottom: '10px' }} icon="plus">新建角色</Button>
                <Modal
                    title="角色信息"
                    visible={this.state.modalVisible}
                    onCancel={this.cancel}
                    destroyOnClose
                    footer={null}
                >
                    <PositionModal
                        key={this.state.modalVisible + this.state.currentId}
                        submit={(data) => this.create(data)}
                        positionList={this.state.positions}
                        currentId={this.state.currentId}
                    />
                </Modal>
                <Modal
                    title="成员信息"
                    visible={this.state.modalUserVisible}
                    onCancel={this.cancel}
                    destroyOnClose
                    footer={null}
                >
                    <PositionUserModal
                        key={this.state.modalUserVisible + this.state.currentId}
                        submit={(data) => this.assign(data)}
                        userList={this.state.users}
                        positionList={this.state.positions}
                        currentId={this.state.currentId}
                    />
                </Modal>
                <Modal
                    title="成员列表"
                    visible={this.state.memberWindow}
                    onOk={this.closeWindow}
                    onCancel={this.closeWindow}
                    footer={null}
                >
                    <Table
                        rowKey={() => Math.random()}
                        style={{ marginBottom: '10px' }}
                        columns={columnsM}
                        dataSource={this.state.usersOfOnePosition || []}
                        pagination={false}
                        loading={this.state.userLoading}
                    />
                </Modal>
                <Card>
                    <div className="panelSpan" style={{ margin: '10px' }}>角色列表</div>
                    <TableWithSearch rowKey="id" dataSource={this.state.positions} columns={columns} size="middle" bordered loading={this.state.loading} />
                </Card>
            </div>
        );
    }
}
