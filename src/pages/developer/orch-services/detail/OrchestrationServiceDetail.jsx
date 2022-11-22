import React from 'react';
import {Card} from 'antd';
import OrchestrationServiceGraph from '../graph/OrchestrationServiceGraph';
import OrchestrationServiceInstanceList from './OrchestrationServiceInstanceList';
import { getOSServiceDetailById } from '../../../../api/osService';
import { reverseGraph } from '../../../../utils/orch-service/orchUtil';

export default class OrchestrationServiceDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceId: props.location.state.serviceId,
      processTopology: null,
      inType: null,
      outType: null,
      nodeId2ParamBindingList: {},
      conditionNodeId2Qualified: {},
      conditionNodeId2Unqualified: {},
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
        nodeId2ParamBindingList: r.nodeId2ParamBindingList || {},
        conditionNodeId2Qualified: r.conditionNodeId2Qualified || {},
        conditionNodeId2Unqualified: r.conditionNodeId2Unqualified || {},
      });
    });
  }

  render() {
    const { serviceId } = this.state;
    return (
      <Card>
        <OrchestrationServiceInstanceList serviceId={serviceId} />
        <div className="panelSpan" style={{margin: '10px'}}>组合服务编排详情</div>
        <OrchestrationServiceGraph
          editable={false}
          processTopology={this.state.processTopology || null}
          key={this.state.processTopology + this.state.outType + this.state.inType}
          outType={this.state.outType}
          inType={this.state.inType}
          nodeId2ParamBindingList={this.state.nodeId2ParamBindingList}
          conditionNodeId2Qualified={this.state.conditionNodeId2Qualified}
          conditionNodeId2Unqualified={this.state.conditionNodeId2UnQualified}
        />
      </Card>
    );
  }
}
