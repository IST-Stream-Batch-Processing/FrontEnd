import React from 'react';
import {
    Cascader, Descriptions, Form, List
} from 'antd';
import {CloseCircleOutlined} from '@ant-design/icons';
import {fromBindingToContextSelector, fromContextSelectorToBinding, } from '../../../../utils/gui-service/guihelper';
import {getContextOptions} from '../../../../utils/gui-service/ContextSelector';
import {
    changeDataModelActionType,
    getContext,
    saveBindingMap,
    saveQueryList
} from '../../../../utils/gui-service/dataHelper';

const {Item} = Form;

export default class DataCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
            getType: ''
        };
    }

    // 寻找key对应的常量值
    getConstantValue = (key, constants) => {
        // eslint-disable-next-line consistent-return,no-restricted-syntax,guard-for-in
        const obj = constants.find(c => c?.value === key);
        return obj.constantValue;
    }

    // 增删改
    addQueryCondition = (fieldName) => {
        const queryCondition = {fieldName, queryType: 'eq', dataSource: null};
        saveQueryList(this.props.data.tableId, queryCondition);
    }

    deleteQueryCondition = (index) => {
        saveQueryList(this.props.data.tableId, null);
    }

    putQueryConditionByQueryType = (index, queryType) => {
        const {queryCondition} = this.props.data;
        queryCondition.queryType = queryType;
        saveQueryList(this.props.data.tableId, queryCondition);
    }

    putQueryConditionByTypeByDataSource = (index, dataSource) => {
        const {queryCondition} = this.props.data;
        queryCondition.dataSource = dataSource;
        saveQueryList(this.props.data.tableId, queryCondition);
    }

    conditionItem = (fieldName, queryType, index, dataSource) => (
        <List.Item key={index} style={{display: 'flex'}}>
            {fieldName}
            <Cascader
                style={{marginRight: 10, width: 50}}
                defaultValue={[queryType]}
                onChange={(values) => {
                    this.putQueryConditionByQueryType(index, values[0]);
                }}
                options={[
                    {value: 'lt', label: '<'},
                    {value: 'le', label: '<='},
                    {value: 'eq', label: '='},
                    {value: 'ge', label: '>='},
                    {value: 'gt', label: '>'},
                    {value: 'like', label: 'like'}
                ]}
            />
            <Cascader
                style={{marginRight: 10}}
                defaultValue={fromBindingToContextSelector(dataSource)}
                onChange={(values) => {
                    // alert(JSON.stringify(this.state.context));
                    if (values[0] === 'constant') {
                        values = [...values, this.getConstantValue(values[1], getContext().constant)];
                    }
                    this.putQueryConditionByTypeByDataSource(index, fromContextSelectorToBinding(values));
                }}
                options={getContextOptions(getContext(), true)}
            />
            <CloseCircleOutlined
                style={{color: 'red', fontSize: '20px'}}
                onClick={() => {
                    this.deleteQueryCondition(index);
                }}
            />
        </List.Item>
    )

    getDataOptions = () => {
        const {data} = this.props;
        if (!data || !data.out) return [];
        return data.out.fields.map((item) => ({value: item.name, label: item.name}));
    }

    getBindingDefaultValue = () => ((this.props.data && this.props.data.bindingMap) ? fromBindingToContextSelector(this.props.data.bindingMap['']) : [])

    queryConditions = () => {
        if (!this.props.data.queryCondition) return null;
        const list = [this.props.data.queryCondition];
        return (
            <List
                dataSource={list}
                renderItem={(item, index) => (
                    this.conditionItem(item.fieldName, item.queryType, index, item.dataSource)
                )}
            />
        );
    }

    queryUI = () => {
        const type = this.state.getType === '' ? this.props.data.actionType : this.state.getType;
        switch (type) {
            case 'getOne':
                return (
                    <Cascader
                        style={{marginTop: 10, marginBottom: 10}}
                        placeholder="请选择id来源"
                        defaultValue={this.getBindingDefaultValue()}
                        onChange={(values) => {
                            const bindingMap = new Map();
                            if (values[0] === 'constant') {
                                values = [...values, this.getConstantValue(values[1], getContext().constant)];
                            }
                            bindingMap.id = fromContextSelectorToBinding(values);
                            saveBindingMap(this.props.data.tableId, bindingMap);
                        }}
                        options={getContextOptions(getContext(), true)}
                    />
                );
            case 'getAll':
                return (
                    <div>
                        <Cascader
                            placeholder="请选择查询条件"
                            style={{marginTop: 10, marginBottom: 10}}
                            onChange={(values) => {
                                if (values[0] === '关联' && values.length === 2) this.addQueryCondition(values[0].concat('.', values[1]));
                                else this.addQueryCondition(values[0]);
                                this.props.reloadEditor();
                            }}
                            options={this.getDataOptions()}
                        />
                        {this.queryConditions()}
                    </div>
                );
            default:
                return null;
        }
    }

    render() {
        const {data} = this.state;
        return (
            <Descriptions bordered column={4}>
                <Descriptions.Item label="查询类型" span={4}>
                    <Cascader
                        placeholder="请选择查询类型"
                        // style={{width: 100}}
                        defaultValue={[this.props.data.actionType]}
                        options={[{value: 'getOne', label: 'id查询'}, {value: 'getAll', label: '条件查询'}]}
                        onChange={(value) => {
                            if (value[0] === 'getAll') {
                                // 需要先将查询项更新为空列表，满足条件查询功能
                                saveQueryList(this.props.data.tableId, []);
                            }
                            this.setState({getType: value[0]});
                            changeDataModelActionType(this.props.data.tableId, value[0]);
                        }}
                    />
                </Descriptions.Item>
                <Descriptions.Item label="查询条件" span={4}>
                    {this.queryUI()}
                </Descriptions.Item>
            </Descriptions>
        );
    }
}
