import React from 'react';
import {
  Tree, Icon, Popconfirm, Modal,
} from 'antd';
import {
  getOr, dropRight, set, last,
} from 'lodash/fp';
import types from '../../../constants/descriptor';
import NodeEditor from './NodeEditor';
import '../../../css/osService.css';

const { TreeNode } = Tree;

const creatorInitialState = {
  visible: false,
  path: null,
};

const editorInitialState = {
  ...creatorInitialState,
  isChildNodeOfObject: false,
  data: null,
};

const defaultData = {
  type: types.OBJECT,
  children: [],
};

// translate a custom path into a path that can be used to operate on descriptor
const translateToDescriptorPath = (path) => {
  const paths = path.split('.');
  return paths.reduce((currentPath, item) => {
    const optionalDot = (currentPath === '') ? '' : '.';
    if (item === '') return '';
    if (item === 'object') {
      return `${currentPath}${optionalDot}object`;
    }
    return `${currentPath}${optionalDot}children[${item}]`;
  }, '');
};

// get the path of the children of an object node
const getChildrenPath = (descriptorPath) => {
  const optionalDot = (descriptorPath === '') ? '' : '.';
  return `${descriptorPath}${optionalDot}children`;
};

/**
 * Descriptor viewer & editor.
 * props:
 *  - value: the descriptor data (empty object as default)
 *  - editable: whether this is editable (false as default)
 * Use refs to this component to access the method 'getData'
 * Can be used with antd's Form, but should explicitly specify 'editable'
 * example:
 *  <Form.Item label="descriptor">
 *    {
 *      getFieldDecorator('descriptor')(<Descriptor editable />)
 *    }
 *  </Form.Item>
 */
class Descriptor extends React.Component {
  constructor(props) {
    super(props);
    const editable = getOr(false, 'editable', props);
    const data = props.data ? {...props.data} : { ...defaultData };
    if (props.onChange && props.editable) {
        props.onChange(data);
    }
    this.state = {
      data,
      editable,
      editor: editorInitialState,
      creator: creatorInitialState,
    };
  }

  setData = (data) => {
    this.setState({data});
  }

  getData = () => {
    const { data } = this.state;
    return data;
  }

  openEditor = (path, data, isChildNodeOfObject) => this.setState({
    editor: {
      path, data, isChildNodeOfObject, visible: true,
    },
  });

  closeEditor = () => this.setState({ editor: editorInitialState })

  openCreator = (path) => this.setState({ creator: { path, visible: true } });

  closeCreator = () => this.setState({ creator: creatorInitialState })

  triggerChange = (data) => {
    const { onChange, editable } = this.props;
    if (onChange && editable) {
      onChange(data);
    }
  }

  // Note: only object-type node can create child node
  createNode = (path, value) => {
    const { data } = this.state;
    const translatedPath = translateToDescriptorPath(path);
    const descriptorPath = getChildrenPath(translatedPath);
    const children = getOr([], descriptorPath, data);
    const nextChildren = children.concat([value]);
    const nextData = set(descriptorPath, nextChildren, data);
    this.setState({ data: nextData });
    this.triggerChange(nextData);
    this.closeCreator();
  }

  updateValueAt = (path, newValue) => {
    const { data } = this.state;
    const descriptorPath = translateToDescriptorPath(path);
    const nextData = (descriptorPath === '') ? newValue : set(descriptorPath, newValue, data);
    this.setState({ data: nextData });
    this.triggerChange(nextData);
    this.closeEditor();
  }

  // Note: only children of object-type descriptors can be deleted
  deleteValueAt = (path) => {
    const { data } = this.state;
    const paths = path.split('.');
    // need to 'dropRight', since we're going to update the parent of the node at this path.
    const parentPath = dropRight(1, paths).join('.');
    const index = parseInt(last(paths), 10);
    const translatedPath = translateToDescriptorPath(parentPath);
    const descriptorPath = getChildrenPath(translatedPath);
    const children = getOr([], descriptorPath, data);
    const nextChildren = children.filter((_, i) => i !== index);
    const nextData = set(descriptorPath, nextChildren, data);
    this.setState({ data: nextData });
    this.triggerChange(nextData);
  };

  renderNode = (path, data, editable, isChildNodeOfObject = false) => {
    const {
      type, name, alias, children, className
    } = data;
    const isObject = (type === types.OBJECT);
    const isParameter = getOr(null, 'isParameter', this.props);
    const title = (
      <span>
        <span className="descriptor-type">{type}</span>
        {
          isObject && className !== undefined ?
            <span className="descriptor-className">{`<${className}>`}</span> : null
        }
        {
          (alias !== undefined && alias !== null) || (name !== undefined && name !== null) ?
          <span className="descriptor-name">{`(name:${(alias === undefined || alias === null || alias === '') ? name : alias})`}</span> : null
        }
        {editable ? (
          <>
            {
              isObject
                ? (
                  <Icon className="descriptor-icon" type="plus" onClick={() => this.openCreator(path)} />
                ) : null
            }
            <Icon className="descriptor-icon" type="edit" onClick={() => this.openEditor(path, data, isChildNodeOfObject || isParameter)} />
            {
              isChildNodeOfObject
                ? (
                  <Popconfirm title="确定删除?" onConfirm={() => this.deleteValueAt(path)}>
                    <Icon className="descriptor-icon" type="delete" style={{color: 'orangered'}} />
                  </Popconfirm>
                ) : null
            }
          </>
        ) : null}
      </span>
    );
    switch (type) {
      case types.OBJECT:
        return (
          <TreeNode key={path} title={title}>
            {children.map((item, index) => {
              const currentPath = `${path}.${index}`;
              return this.renderNode(currentPath, item, editable, true);
            })}
          </TreeNode>
        );
      default:
        return <TreeNode key={path} title={title} />;
    }
  }

  render() {
    const {
      data, editable, editor, creator,
    } = this.state;
    return (
      <>
        <Tree>
          {this.renderNode('', data, editable)}
        </Tree>
        {
          editable
            ? (
              <>
                <Modal
                  title="编辑节点信息"
                  visible={editor.visible}
                  onCancel={this.closeEditor}
                  onOk={() => { this.editorRef.handleSubmit(); }}
                  destroyOnClose
                >
                  <NodeEditor
                    ref={(ref) => { this.editorRef = ref; }}
                    callback={this.updateValueAt}
                    isChildNodeOfObject={editor.isChildNodeOfObject}
                    isObject={data.type === types.OBJECT}
                    path={editor.path}
                    data={editor.data}
                  />
                </Modal>
                <Modal
                  title="新增节点信息"
                  visible={creator.visible}
                  onCancel={this.closeCreator}
                  onOk={() => { this.creatorRef.handleSubmit(); }}
                  destroyOnClose
                >
                  <NodeEditor
                    ref={(ref) => { this.creatorRef = ref; }}
                    callback={this.createNode}
                    isChildNodeOfObject // only object-type node can create child node
                    isObject={false}
                    path={creator.path}
                    data={null}
                  />
                </Modal>
              </>
            ) : null
        }
      </>
    );
  }
}

export default Descriptor;
