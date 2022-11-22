import React from 'react';
import * as echarts from 'echarts';
import {
  message, Modal, Card, Button, Form
} from 'antd';
import {
  getDepartmentTree, getDepartmentList, updateDepartment, getDepartmentUser, createDepartment
} from '../../../api/department';
import DepartmentModal from './DepartmentModal';
import DepartmentNewModal from './DepartmentNewModal';

export default class DepartmentTree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      departments: null,
      departmentList: [],
      currentUserList: [],
      modalDepartmentVisible: false,
      loading: true,
      currentId: null,
      currentName: null,
      modalNewVisible: false,
    };
    this.myChart = null;
  }

  async componentDidMount() {
    await this.getDepartments();
  }

  componentWillUnmount() {
    this.setState = () => false;
  }

  getDepartments = async () => {
    this.setState({
      loading: true,
    });
    getDepartmentList().then((r) => {
      this.setState({ departmentList: r }, () => this.updateTree());
    });
  }

  updateTree = async () => {
    await this.getDepartmentTree();
  }

  getDepartmentTree = async () => {
    getDepartmentTree().then((r) => {
      this.setState({ departments: r }, () => this.initialTree());
    });
  }

  edit = async (data) => {
    data = {
      ...data,
      id: this.state.currentId
    };
    updateDepartment(data).then((r) => {
      this.getDepartments();
      this.setState({
        modalDepartmentVisible: false,
        currentId: null
      });
      message.success('修改成功');
    }).catch((e) => {
      console.error(e);
    });
    this.setState({
      loading: false
    });
  }

  getDepartmentUserList = (id) => {
    getDepartmentUser(id).then((r) => {
      this.setState({ currentUserList: r, loading: false });
    });
  }

  showDepartmentModal = async (params) => {
    this.getDepartmentUserList(params.data.id);
    this.setState({
      currentId: params.data.id,
      currentName: params.name,
      modalDepartmentVisible: true
    });
  }

  cancel = () => {
    this.setState({
      loading: true,
      modalDepartmentVisible: false,
      currentId: null,
    }, () => this.getDepartments());
  }

  initialTree = () => {
    const { departments } = this.state;
    if (!this.myChart) {
      const chartDom = document.getElementById('container');
      this.myChart = echarts.init(chartDom);
    }
    this.myChart.setOption({
      tooltip: {
        enterable: true,
        trigger: 'item',
        triggerOn: 'mousemove'
      },
      series: [
        {
          type: 'tree',
          id: 'departments',
          name: 'departments',
          data: departments == null ? [] : [departments],
          top: '1%',
          left: '7%',
          bottom: '1%',
          right: '20%',
          symbolSize: 15,
          label: {
            position: 'right',
            verticalAlign: 'middle',
            align: 'left',
            backgroundColor: 'rgb(134,157,217)',
            borderRadius: [11, 11, 11, 11],
            padding: [16, 16, 8, 16],
            color: 'white'
          },
          emphasis: {
            focus: 'descendant'
          },
          expandAndCollapse: false,
          animationDuration: 550,
          animationDurationUpdate: 750,
        }
      ]
    });
    this.myChart.on('click', (params) => this.showDepartmentModal(params));
    this.setState({
      loading: false
    });
  }

  showCreateModal = () => {
    this.setState({
      modalNewVisible: true
    });
  }

  create = async (data) => {
    this.setState({ loading: true });
    createDepartment(data).then((r) => {
      this.getDepartments();
      this.setState({
        modalNewVisible: false,
      });
      message.success('创建成功');
    }).catch((e) => {
      console.error(e);
    });
    this.setState({
      loading: false
    });
  }

  render() {
    return (
      <>
      {
        !this.state.departments ? (
          <Button
            onClick={this.showCreateModal}
            type="primary"
            icon="plus"
            style={{marginBottom: '10px'}}
          >
            建立最高层级部门
          </Button>
        ) : null
      }
        <Card>
          <div className="panelSpan" style={{ margin: '10px' }}>部门层级图</div>
          <Form>
          <Modal
            title="新建最高层级部门"
            visible={this.state.modalNewVisible}
            onCancel={() => this.setState({modalNewVisible: false})}
            destroyOnClose
            footer={null}
          >
            <DepartmentNewModal
              submit={(data) => this.create(data)}
            />
          </Modal>
          </Form>
          <div
            style={{ height: 500 }}
            id="container"
          >
            <Modal
              title={this.state.currentName}
              visible={this.state.modalDepartmentVisible}
              onCancel={this.cancel}
              destroyOnClose
              footer={null}
            >
              <DepartmentModal
                key={this.state.modalDepartmentVisible + this.state.currentId}
                submit={(data) => this.edit(data)}
                departmentList={this.state.departmentList}
                currentId={this.state.currentId}
                cancel={this.cancel}
                currentUserList={this.state.currentUserList}
              />
            </Modal>
          </div>
        </Card>
      </>
    );
  }
}
