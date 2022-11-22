import React from 'react';
import {
  Button, Input, Modal, Table, Tree
} from 'antd';
import {dataHandler} from '../../../utils/http';
import {
    deleteAS, getAllAS, uploadCode, updateAS
} from '../../../api/developer';

const {TextArea} = Input;
const {TreeNode} = Tree;

export default class Service extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        data: [],
        showModal: false,
        showDescriptor: false,
        detailData: null,
        serviceName: '',
        serviceDescription: '',
        file: null,
        };
    }

    dataTmp = null;

    getData = () => {
        getAllAS().then((r) => {
        this.setState({data: dataHandler(r)});
      });
    }

    column = [
      {
        title: '服务名',
        dataIndex: 'serviceName',
        key: 'serviceName',
        width: '10%',
        render: (text, recorder) => (
          <div>
            {recorder.name}
          </div>
        ),
        onCell: () => ({style: {backgroundColor: 'white'}})
      },
      {
        title: '上传用户',
        dataIndex: 'username',
        key: 'username',
        width: '10%',
        render: (text, recorder) => (
          <div>
            {recorder.creator.username}
          </div>
        ),
        onCell: () => ({style: {backgroundColor: 'white'}})
      },
      {
        title: '服务描述',
        dataIndex: 'description',
        key: 'description',
        width: '10%',
        render: (text, recorder) => (
          <div>{recorder.description}</div>
        ),
        onCell: () => ({style: {backgroundColor: 'white'}})
      },
      {
        title: '操作',
        align: 'center',
        dataIndex: 'delete',
        key: 'delete',
        width: '10%',
        render: (text, recorder) => {
          const {showDescriptor} = this.state;
          return (
            <div>
              <Button
                        type="primary"
                        onClick={() => {
                            this.dataTmp = recorder;
                            this.setState({showDescriptor: !showDescriptor, detailData: recorder});
                        }}
              >
                查看
              </Button>
              <Button
                        type="danger"
                        onClick={() => {
                          deleteAS(recorder.id).then(r => {
                            dataHandler(r);
                            this.getData();
                          });
                        }}
              >
                删除
              </Button>
            </div>
          );
        },
        onCell: () => ({style: {backgroundColor: 'white'}})
      }
    ]

    componentDidMount() {
      this.getData();
    }

    uploadModal = () => {
      const {
        serviceName, showModal, serviceDescription, file
      } = this.state;
      return (
        <div>
          <Modal
                  onCancel={
                      () => {
                        this.setState({showModal: !showModal});
                      }
                  }
                  onOk={
                      () => {
                        if (serviceName === '' || !file) {
                          return;
                        }
                        const form = new FormData();
                        form.append('serviceName', serviceName);
                        form.append('description', serviceDescription);
                        form.append('sourceCode', file);
                        uploadCode(form).then(() => {
                          this.getData();
                        });
                        this.setState({showModal: !showModal});
                      }
                  }
                  title="上传jar包"
                  visible={showModal}
          >
            <Input
                      required
                      name="serviceName"
                      placeholder="请输入服务名"
                      value={serviceName}
                      onChange={this.handleInputChange}
            />
            <br />
            <br />
            <TextArea
                      rows="6"
                      name="serviceDescription"
                      placeholder="请输入服务描述"
                      value={serviceDescription}
                      onChange={this.handleInputChange}
            />
            <br />
            <br />
            <input
                      name="file"
                      type="file"
                      accept=".jar"
                      onChange={(e) => {
                        this.setState({file: e.target.files[0]});
                      }}
            />
          </Modal>
        </div>
      );
    }

    handleInputChange = (e) => {
      this.setState({[e.target.name]: e.target.value});
    }

    noAlias = (alias) => alias === null || alias === '' || alias === undefined

    changeAlias = (obj, key, newAlias) => {
        if (obj.key) {
            if (obj.key === key) {
                // eslint-disable-next-line no-param-reassign
                obj.alias = newAlias;
            } else {
                this.changeAlias(obj.type, key, newAlias);
            }
        } else if (obj.name === 'Object') {
            // eslint-disable-next-line array-callback-return
            obj.fields.map((item) => {
                this.changeAlias(item, key, newAlias);
            });
        } else if (obj.name === 'List') {
            this.changeAlias(obj.memberType, key, newAlias);
        }
    }

    handleTreeTitle = (type, field, editable, key) => {
      const edit = (
          <>
              -&gt;
              {
                  editable ? (
                      <Input
                      defaultValue={field}
                      contentEditable
                      onChange={(e) => {
                          this.changeAlias(this.dataTmp.inType, key, e.target.value);
                          this.changeAlias(this.dataTmp.outType, key, e.target.value);
                      }}
                      />
                      )
                      : (<>{field}</>)
              }
          </>
      );
      return (
          <div>
              {type}
              {(field !== undefined) && edit}
          </div>
      );
    }

    renderNode = (path, type, fieldName, fieldKey, editable = false) => {
      switch (type.name) {
          case 'Object':
              return (
                  <TreeNode
                      title={this.handleTreeTitle(type.className, fieldName, editable, fieldKey)}
                      key={path}
                  >
                      {type.fields.map(
                          (item, index) => (
                              this.renderNode(path + index.toString(),
                                  item.type, this.noAlias(item.alias) ? item.name : item.alias,
                              item.key, true)
                          )
                      )}
                  </TreeNode>
              );
          case 'List':
              return (
                  <TreeNode title={this.handleTreeTitle('List', undefined, false, fieldKey)}>
                      {
                          this.renderNode(`${path}List`, type.memberType, undefined, '')
                      }
                  </TreeNode>
              );
          default:
              return (
                  <TreeNode
                      title={this.handleTreeTitle(type.name, fieldName, editable, fieldKey)}
                  />
              );
      }
    }

    detailModal = () => {
      const {showDescriptor, detailData} = this.state;
      return (
        <div>
          <Modal
                    title="详情"
                    visible={showDescriptor}
                    onOk={() => {
                      this.setState({showDescriptor: !showDescriptor});
                      updateAS(this.dataTmp, this.dataTmp.id);
                      this.setState({detailData: this.dataTmp});
                    }}
                    onCancel={() => {
                      this.setState({showDescriptor: !showDescriptor});
                      this.forceUpdate();
                    }}
          >
              {detailData && this.descriptor(detailData)}
          </Modal>
        </div>
      );
    }

    descriptor = (detailData) => (
          <div>
              <p>
                  服务名称：
                  {detailData.name}
              </p>
              <p>
                  服务描述：
                  {detailData.description}
              </p>
              <p>
                  创建人：
                  {detailData.creator.username}
              </p>
              <Tree>
                  {this.renderNode('', detailData.inType, 'In')}
              </Tree>
              <Tree>
                  {this.renderNode('', detailData.outType, 'Out')}
              </Tree>
          </div>
      )

    render() {
        const {
            showModal, data
        } = this.state;
        return (
            <div>
                <div style={{display: 'flex', justifyContent: 'right', marginRight: '5%'}}>
                    <Button
                        type="primary"
                        onClick={() => {
                            this.setState({showModal: !showModal});
                        }}
                    >
                        点击上传Jar包
                    </Button>
                </div>
                {showModal && this.uploadModal()}
                {this.detailModal()}
                <Table bordered style={{marginTop: '2%'}} size="middle" dataSource={data} columns={this.column} />
            </div>
        );
    }
}
