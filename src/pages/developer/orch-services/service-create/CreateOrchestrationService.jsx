import React from 'react';

import { Steps, message } from 'antd';
import OrchestrationServiceGraph from '../graph/OrchestrationServiceGraph';
import OrchestrationServiceType from './OrchestrationServiceType';
import '../../../../css/osService.css';
import { createOSService } from '../../../../api/osService';
import { convertGraph } from '../../../../utils/orch-service/orchUtil';
import history from '../../../../utils/history';

const { Step } = Steps;

export default class CreateOrchestrationService extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      inType: {},
      outType: {},
      name: '',
      processTopology: {},
      nodeId2ParamBindingList: {}
    };
  }

  baseInfoSubmit = (inType, outType, name) => {
    this.setState({
      inType,
      outType,
      name
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
      inType,
      outType,
      name,
      processTopology,
      nodeId2ParamBindingList,
      conditionNodeId2Qualified,
      conditionNodeId2Unqualified
    } = this.state;
    const data = {
      inType,
      outType,
      name,
      processTopology: convertGraph(processTopology),
      nodeId2ParamBindingList,
      conditionNodeId2Qualified,
      conditionNodeId2Unqualified
    };
    try {
      await createOSService(data);
      message.success('创建服务编排成功!');
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
      content: <OrchestrationServiceType submit={(inType, outType, name) => this.baseInfoSubmit(inType, outType, name)} />
    },
    {
      title: '服务编排设置',
      content: <OrchestrationServiceGraph
        submit={(processTopology, nodeId2ParamBindingList, conditionNodeId2Qualified, conditionNodeId2Unqualified) => this.graphSubmit(processTopology, nodeId2ParamBindingList, conditionNodeId2Qualified, conditionNodeId2Unqualified)}
        key={this.state.current}
        inType={this.state.inType}
        outType={this.state.outType}
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
