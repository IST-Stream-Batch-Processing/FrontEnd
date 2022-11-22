import React from 'react';
import {
    Button, Card, Cascader, Collapse, Form, Input, Modal, TreeSelect
} from 'antd';
import ConditionTree from '../../../../../components/query/ConditionTree';
import {conditionTypes, logicTypes, queryTypes} from '../../../../../constants/query';
import {getComponentData, getSelectedProperty, setComponentData} from '../../../../../utils/gui-service/dataHelper';
import JumpSelector from './JumpSelector';

const {TreeNode} = TreeSelect;

const {Item} = Form;

const {Panel} = Collapse;

const specialFieldNames = ['none', 'requestSuccess', 'requestFail'];

class ConditionalOutputs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            currentItemId: null
        };
    }

    reloadEditor = (componentData) => {
        setComponentData(getSelectedProperty().containerId, getSelectedProperty().componentId, componentData, getSelectedProperty().buttonId);
        this.props.reloadEditor();
    }

    getOptionValue = (item) => {
        if (specialFieldNames.indexOf(item.queryCondition.fieldName) > -1 && item.queryCondition.queryType === null && item.queryCondition.value === null) {
            return [item.queryCondition.fieldName];
        }
        return ['query'];
    }

    getOutputOptions = (componentData) => {
        const api = componentData.api;
        let options = [
            {value: 'none', label: '无条件'},
        ];
        if (api) {
            switch (api.type) {
                case 'atomicService':
                case 'multiService':
                    if (api.out && api.out.fields) {
                        options = [...options, {
                            value: 'query', label: '条件判断'
                        }];
                    }
                    break;
                default:
                    break;
            }
        }
        return options;
    }

    getOutputMessageOptions = (componentData) => {
        const api = componentData.api;
        let options = [
            {value: 'default', label: '自定义'}
        ];
        if (api) {
            switch (api.type) {
                case 'atomicService':
                case 'multiService':
                    if (api.out && api.out.fields) {
                        api.out.fields.forEach((field) => {
                            options = [...options, {
                                value: `{${field.name}}`, label: field.name,
                            }];
                        });
                    }
                    break;
                default:
                    break;
            }
        }
        return options;
    }

    getExpression = (data) => {
        if (!data) return null;
        switch (data.type) {
            case conditionTypes.multi:
                return (
                    <>
                        {'('}
                        {this.getExpression(data.left) || '--'}
                        {`) ${logicTypes[data.logicType] || '--'} (`}
                        {this.getExpression(data.right) || '--'}
                        {')'}
                    </>
                );
            default:
                return data.condition ? (
                        <>
                            {this.renderCondition(data.condition)}
                            {` ${queryTypes[data.condition.operator] || '--'} `}
                            {data.condition.value || '--'}
                        </>
                    )
                    : '--';
        }
    }

    renderCondition = (data) => {
        const condition = {...data};
        delete condition.operator;
        delete condition.value;
        const keys = Object.keys(condition);
        const componentData = getComponentData(getSelectedProperty().containerId, getSelectedProperty().componentId, getSelectedProperty().buttonId);
        if (keys.length === 0) return '--';
        if (keys.length === 1) return condition[keys[0]];
        return (
            <TreeSelect
                value={this.setDefaultTarget(condition)}
                disabled
                size="small"
            >
                { this.renderTargets(componentData.api.out.fields) }
            </TreeSelect>
        );
    }

    addConditionalOutput = (componentData) => {
        const itemId = componentData.conditionalOutputs.length === 0 ? 0 : componentData.conditionalOutputs[componentData.conditionalOutputs.length - 1].itemId + 1;
        componentData.conditionalOutputs.push(
            {
                itemId,
                queryCondition: {
                    fieldName: 'none', queryType: null, value: null
                },
                jumpingLayout: {
                    layoutId: null, bindingMap: null
                },
                jumpingLayouts: [
                    { layoutId: null, bindingMap: null},
                    { layoutId: null, bindingMap: null}
                ],
                successMsg: '',
                failMsg: ''
            }
        );
        this.reloadEditor(componentData);
    }

    handleOk = () => {
        this.setState({
            showModal: false,
            currentItemId: null
        });
    };

    dataFormatConversion = (data) => {
        if (!data) return null;
        return {
            ...data.condition,
            queryType: data.condition ? data.condition.operator : null,
            left: this.dataFormatConversion(data.left),
            right: this.dataFormatConversion(data.right),
            logicType: data.logicType,
        };
    }

    dataInputConversion = (data) => {
        if (!data) return null;
        return {
            type: data.logicType ? '组合' : null,
            condition: data.logicType ? null : {
                fieldName: data.fieldName,
                operator: data.queryType,
                value: data.value
            },
            left: this.dataInputConversion(data.left),
            right: this.dataInputConversion(data.right),
            logicType: data.logicType
        };
    }

    renderKeys = (keys) => keys.map((item, index) => (
        <TreeNode
            title={item.name}
            key={item.name + index}
            value={item.name}
        />
    ))

    setDefaultTarget = (condition) => (condition ? condition.fieldName : null);

    chooseTarget = (fieldName) => ({fieldName})

    onQueryChange = (itemId, value) => {
        const componentData = getComponentData(getSelectedProperty().containerId, getSelectedProperty().componentId, getSelectedProperty().buttonId);
        const itemPos = componentData.conditionalOutputs.findIndex((item) => item.itemId == itemId);
        const formData = this.dataFormatConversion(value);
        componentData.conditionalOutputs[itemPos].queryCondition = formData;
        this.reloadEditor(componentData);
    }

    showQueryConditionModal = (item, fields) => {
        if (this.state.currentItemId !== null && item.itemId === this.state.currentItemId) {
            return (
                <Modal visible={this.state.showModal} onOk={this.handleOk} onCancel={this.handleOk} destroyOnClose>
                    <ConditionTree
                        key={fields}
                        targets={fields}
                        data={this.dataInputConversion(item.queryCondition)}
                        chooseTarget={(value) => this.chooseTarget(value)}
                        setDefaultTarget={(value) => this.setDefaultTarget(value)}
                        renderTargets={(value) => this.renderKeys(value)}
                        onChange={(value) => this.onQueryChange(item.itemId, value)}
                        operators={queryTypes}
                        editable
                        displayable
                    />
                </Modal>
            );
        }
        return null;
    }

    getOutputMessageOption = (message) => {
        if (message && message.indexOf('{') === 0 && message.indexOf('}') === message.length - 1) {
            return [message];
        }
        return ['default'];
    }

    outputMessage = (index, item, componentData, successFlag) => {
        const successMsgInput = successFlag && this.getOutputMessageOption(item.successMsg === '' ? null : item.successMsg)[0] === 'default' &&
            !(item.queryCondition.fieldName === 'requestFail' && item.queryCondition.queryType === null && item.queryCondition.value === null);
        const failMsgInput = !successFlag && this.getOutputMessageOption(item.failMsg === '' ? null : item.failMsg)[0] === 'default' &&
            !(item.queryCondition.fieldName === 'requestSuccess' && item.queryCondition.queryType === null && item.queryCondition.value === null);
        let defaultValue = '';
        if (successFlag) defaultValue = this.getOutputMessageOption(item.successMsg === '' ? null : item.successMsg);
        else defaultValue = this.getOutputMessageOption(item.failMsg === '' ? null : item.failMsg);
        return (
            <span>
                {successFlag ? '成功回调显示' : '失败回调显示'}
                <Cascader
                    placeholder="请选择界面输出"
                    defaultValue={defaultValue}
                    onChange={(values) => {
                        if (values[0] === 'default') {
                            if (successFlag) componentData.conditionalOutputs[index].successMsg = '';
                            else componentData.conditionalOutputs[index].failMsg = '';
                            this.reloadEditor(componentData);
                        } else {
                            if (successFlag) componentData.conditionalOutputs[index].successMsg = values[0];
                            else componentData.conditionalOutputs[index].failMsg = values[0];
                            this.reloadEditor(componentData);
                        }
                    }}
                    options={this.getOutputMessageOptions(componentData)}
                />
                {successMsgInput ? (
                    <Input
                        style={{marginTop: '10px'}}
                        addonBefore="显示内容"
                        placeholder="调用成功回调显示"
                        defaultValue={item.successMsg === '' ? null : item.successMsg}
                        onChange={(e) => {
                            componentData.conditionalOutputs[index].successMsg = e.target.value;
                            this.reloadEditor(componentData);
                        }}
                    />
                ) : null}
                {failMsgInput ? (
                    <Input
                        style={{marginTop: '10px'}}
                        addonBefore="显示内容"
                        placeholder="调用失败回调显示"
                        defaultValue={item.failMsg === '' ? null : item.failMsg}
                        onChange={(e) => {
                            componentData.conditionalOutputs[index].failMsg = e.target.value;
                            this.reloadEditor(componentData);
                        }}
                    />
                ) : null}
            </span>
        );
    }

    renderCallbackOutput = (index, item, componentData) => {
        if (componentData.api && componentData.api.type !== 'none') {
            return (
                <div>
                    {this.outputMessage(index, item, componentData, true)}
                    <JumpSelector form={this.props.form} itemId={item.itemId} isSuccess />
                    {this.outputMessage(index, item, componentData, false)}
                    <JumpSelector form={this.props.form} itemId={item.itemId} isSuccess={false} />
                </div>
            );
        }
        return (
            <div>
                <Input
                    style={{marginTop: '10px'}}
                    addonBefore="显示消息"
                    placeholder="显示消息"
                    defaultValue={item.successMsg === '' ? null : item.successMsg}
                    onChange={(e) => {
                        componentData.conditionalOutputs[index].successMsg = e.target.value;
                        this.reloadEditor(componentData);
                    }}
                />
                <JumpSelector form={this.props.form} itemId={item.itemId} isSuccess />
            </div>
        );
    }

    conditionalOutputItem = (index, item, componentData) => (
        <div>
            条件：
            <br />
            <Cascader
                style={{width: '100%'}}
                placeholder="请选择跳转条件"
                defaultValue={this.getOptionValue(item)}
                onChange={(values) => {
                    componentData.conditionalOutputs[index].queryCondition.fieldName = values[0];
                    if (values[0] === 'query') {
                        componentData.conditionalOutputs[index].queryCondition.fieldName = null;
                    } else { // none
                        componentData.conditionalOutputs[index].queryCondition.queryType = null;
                        componentData.conditionalOutputs[index].queryCondition.left = null;
                        componentData.conditionalOutputs[index].queryCondition.right = null;
                        componentData.conditionalOutputs[index].queryCondition.logicType = null;
                        componentData.conditionalOutputs[index].queryCondition.value = null;
                        componentData.conditionalOutputs[index].successMsg = '';
                        componentData.conditionalOutputs[index].failMsg = '';
                    }
                    this.reloadEditor(componentData);
                }}
                options={this.getOutputOptions(componentData)}
            />
            {(componentData.api && componentData.api.out && componentData.api.out.fields) ?
                this.showQueryConditionModal(item, componentData.api.out.fields) : null}
            {(specialFieldNames.indexOf(item.queryCondition.fieldName) > -1 && item.queryCondition.queryType === null && item.queryCondition.value === null) ? null : (
                <div>
                    <div style={{marginTop: '5px'}}>条件表达式：</div>
                    <div
                        style={{marginTop: '5px'}}
                    >
                        {this.getExpression(this.dataInputConversion(item.queryCondition))}
                    </div>
                    <Button
                        type="primary"
                        style={{
                            marginTop: '5px'
                        }}
                        onClick={() => {
                            this.setState({
                                showModal: true,
                                currentItemId: item.itemId
                            });
                        }}
                    >
                        修改条件
                    </Button>
                </div>
            )}
            <br />
            {this.renderCallbackOutput(index, item, componentData)}
            <Button
                type="danger"
                style={{
                    marginLeft: '60%'
                }}
                onClick={() => {
                    componentData.conditionalOutputs.splice(index, 1);
                    this.reloadEditor(componentData);
                }}
            >
                删除
            </Button>
        </div>
    )

    render() {
        const componentData = getComponentData(getSelectedProperty().containerId, getSelectedProperty().componentId, getSelectedProperty().buttonId);
        if (componentData.type === 'button') {
            return (
                <Card title="条件化输出/跳转" size="small">
                    <Collapse accordion>
                        {componentData.conditionalOutputs.map((item, index) => (
                            <Panel header={`条件化输出/跳转${index + 1}`} key={index}>
                                <Item>
                                    {this.conditionalOutputItem(index, item, componentData)}
                                </Item>
                            </Panel>
                        ))}
                    </Collapse>
                    <br />
                    <Button
                        type="primary"
                        onClick={() => this.addConditionalOutput(componentData)}
                    >
                        新增条件化输出/跳转
                    </Button>
                </Card>
            );
        } return null;
    }
}

export default ConditionalOutputs;
