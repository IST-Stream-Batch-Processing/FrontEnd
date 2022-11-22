import React from 'react';
import '../../../../css/osService.css';
import {
  Card, Input, Icon, Button
} from 'antd';
import Descriptor from '../../../../components/orchestration-services/descriptor/Descriptor';
import {convertDescriptor} from '../../../../utils/orch-service/orchUtil';

export default class OrchestrationServiceType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name ? props.name : '',
      inType: props.inType ? props.inType : null,
      outType: props.outType ? props.outType : null,
    };
  }

  onChange = (e) => {
      this.setState({
        name: e.target.value
      });
  }

  setInType = (i) => {
    this.setState({
      inType: i
    });
  }

  setOutType = (i) => {
    this.setState({
      outType: i
    });
  }

  submit = () => {
    const inType = convertDescriptor(this.state.inType);
    const outType = convertDescriptor(this.state.outType);
    this.props.submit(inType, outType, this.state.name);
  }

  render() {
    return (
      <>
      <Card>
        <div className="panelSpan">名称：</div>
        <Input
          placeholder="请输入服务名称"
          prefix={<Icon type="codepen" style={{ color: 'rgba(0,0,0,.25)' }} />}
          style={{width: '30%'}}
          defaultValue={this.state.name}
          onChange={(e) => this.onChange(e)}
        />
        <div className="panelSpan">输入数据格式定义：</div>
        <Descriptor editable onChange={(i) => this.setInType(i)} data={this.state.inType} />
        <div className="panelSpan">输出数据格式定义：</div>
        <Descriptor editable onChange={(i) => this.setOutType(i)} data={this.state.outType} />
      </Card>
          <div className="steps-action" style={{textAlign: 'center'}}>
            <Button type="primary" onClick={this.submit}>
              下一步
            </Button>
          </div>
      </>
    );
  }
}
