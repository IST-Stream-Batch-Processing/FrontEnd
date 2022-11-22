import React from 'react';
import { Steps, message } from 'antd';
import OrchestrationServiceGraph from '../graph/OrchestrationServiceGraph';
import OrchestrationServiceType from '../service-create/OrchestrationServiceType';
import '../../../../css/osService.css';
import {updateOSService, getOSServiceDetailById} from '../../../../api/osService';
import {
convertGraph, findField, reconvertDescriptor, reverseGraph
} from '../../../../utils/orch-service/orchUtil';
import history from '../../../../utils/history';

const { Step } = Steps;

export default class OrchestrationServiceEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceId: props.location.state.serviceId,
      current: 0,
      inType: {},
      outType: {},
      name: '',
      processTopology: {},
      nodeId2ParamBindingList: {},
      conditionNodeId2Qualified: {},
      conditionNodeId2Unqualified: {},
      creator: null,
      loading: true
    };
  }

  async componentDidMount() {
    await this.getServiceDetail();
  }

  getServiceDetail = async() => {
    const { serviceId } = this.state;
    getOSServiceDetailById(serviceId).then((r) => {
      this.setState({
        processTopology: reverseGraph(r.processTopology),
        inType: r.inType,
        outType: r.outType,
        name: r.name,
        nodeId2ParamBindingList: r.nodeId2ParamBindingList || {},
        conditionNodeId2Qualified: r.conditionNodeId2Qualified || {},
        conditionNodeId2Unqualified: r.conditionNodeId2Unqualified || {},
        creator: r.creator || null,
      }, () => { this.setState({loading: false}); });
    });
  }

  updateBindingInType = (type, newType, map) => {
    if (type.name !== newType.name) {
      // 输入的类型不同，from绑定0的节点全部重置
      Object.keys(map).forEach((key) => {
        map[key] = map[key].filter((item) => item.fromNodeId !== '0');
      });
    } else if (type.name === 'Object') {
      // 输入的类型一样，且是object，比较fieldkey
      Object.keys(map).forEach((key) => {
        map[key] = map[key].map((binding) => {
          if (binding.fromNodeId === '0') {
            let flag = false;
            newType.fields.forEach((item) => {
              if (findField(item, '', binding.from.fieldKey, binding.from.fullFieldName)) flag = true;
            });
            if (!flag) return null;
          }
          return binding;
        });
        map[key] = map[key].filter((item) => item !== null);
      });
    }
    return map;
  }

  updateBindingOutType = (type, newType, map) => {
    if (type.name !== newType.name) {
      // 输出的类型不同，target为的节点重置
      map['0'] = [];
    } else if (type.name === 'Object') {
      // 输出的类型一样，且是object，比较fieldkey
      map['0'] = map['0'].map((binding) => {
        let flag = false;
        newType.fields.forEach((item) => {
          if (findField(item, '', binding.target.fieldKey, binding.target.fullFieldName)) flag = true;
        });
        if (!flag) return null;
        return binding;
      });
      map['0'] = map['0'].filter((item) => item !== null);
    }
    return map;
  }

  baseInfoSubmit = (newInType, newOutType, name) => {
    // 消除修改输入输出后绑定过nodeId为0的节点影响
    const {inType, outType} = this.state;
    let {nodeId2ParamBindingList, conditionNodeId2Qualified, conditionNodeId2Unqualified} = this.state;
    nodeId2ParamBindingList = this.updateBindingInType(inType, newInType, nodeId2ParamBindingList);
    conditionNodeId2Qualified = this.updateBindingInType(inType, newInType, conditionNodeId2Qualified);
    conditionNodeId2Unqualified = this.updateBindingInType(inType, newInType, conditionNodeId2Unqualified);
    nodeId2ParamBindingList = this.updateBindingOutType(outType, newOutType, nodeId2ParamBindingList);

    this.setState({
      inType: newInType,
      outType: newOutType,
      name,
      nodeId2ParamBindingList,
      conditionNodeId2Qualified,
      conditionNodeId2Unqualified
    });
    this.next();
  }

  graphSubmit = (processTopology, nodeId2ParamBindingList, conditionNodeId2Qualified, conditionNodeId2Unqualified) => {
    this.setState({
      processTopology,
      nodeId2ParamBindingList,
      conditionNodeId2Qualified,
      conditionNodeId2Unqualified
    }, this.finish);
  }

  next = () => {
    this.setState(prev => ({ current: prev.current + 1 }));
  }

  prev= () => {
    this.setState(prev => ({ current: prev.current - 1 }));
  }

  finish = async () => {
    const {
      serviceId,
      inType,
      outType,
      name,
      processTopology,
      nodeId2ParamBindingList,
      conditionNodeId2Qualified,
      conditionNodeId2Unqualified,
      creator
    } = this.state;
    const data = {
      inType,
      outType,
      name,
      processTopology: convertGraph(processTopology),
      nodeId2ParamBindingList,
      conditionNodeId2Qualified,
      conditionNodeId2Unqualified,
      creator
    };
    try {
      await updateOSService(serviceId, data);
      message.success('更新服务编排成功!');
      this.setState({
        current: 0
      });
    } catch (err) {
      console.error(err);
    } finally {
      history.push('/developer/orchestration');
      window.location.reload(); // 强制页面刷新
    }
  }

  steps = () => [
    {
      title: '基础信息设置',
      content: <OrchestrationServiceType
        key={this.state.loading}
        name={this.state.name}
        inType={reconvertDescriptor(this.state.inType)}
        outType={reconvertDescriptor(this.state.outType)}
        submit={(inType, outType, name) => this.baseInfoSubmit(inType, outType, name)}
      />
    },
    {
      title: '服务编排设置',
      content: <OrchestrationServiceGraph
        submit={(processTopology, nodeId2ParamBindingList, conditionNodeId2Qualified, conditionNodeId2Unqualified) => this.graphSubmit(processTopology, nodeId2ParamBindingList, conditionNodeId2Qualified, conditionNodeId2Unqualified)}
        key={this.state.current}
        inType={this.state.inType}
        outType={this.state.outType}
        processTopology={this.state.processTopology || null}
        nodeId2ParamBindingList={this.state.nodeId2ParamBindingList}
        conditionNodeId2Qualified={this.state.conditionNodeId2Qualified}
        conditionNodeId2Unqualified={this.state.conditionNodeId2UnQualified}
        editable
      />,
    }
  ];

  render() {
    const { current } = this.state;
    const steps = this.steps();
    return (
      <div>
        <Steps current={current} size="small">
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content" style={{height: '100%'}}>{steps[current].content}</div>
      </div>
    );
  }
}
