import React, {useState} from 'react';
import {
    Button, Form, Icon, Input, message, Popconfirm, Select
} from 'antd';
import {intelServiceFirstTrain, intelServiceTrain} from '../../../../api/intelligence';

const { TextArea } = Input;

const options = ['Int', 'Double'];

export default function TrainForm(props) {
    const [id, setId] = useState(props.current ? props.current.id : null);
    const [dataSetId, setDataSetId] = useState(props.current ? props.current.dataSetId || '' : '');
    const [lastInstanceId, setLastInstanceId] = useState(props.lastInstanceId ? props.lastInstanceId : '');
    const [params, setParams] = useState([]);
    const [loading, setLoading] = useState(false);

    function upload() {
        if (dataSetId === '') {
            message.error('信息不完整');
            return;
        }
        setLoading(true);
        if (lastInstanceId === '') {
            intelServiceFirstTrain(id, dataSetId, params).then(() => {
                setLoading(false);
                props.onFresh();
                props.onClose();
                message.success('开始新一轮训练');
            });
        } else {
            intelServiceTrain(lastInstanceId, dataSetId, params).then(() => {
                setLoading(false);
                props.onFresh();
                props.onClose();
                message.success('开始新一轮训练');
            });
        }
    }

    function addParam() {
        let newParams = [...params, {
            key: "key",
            type: "Int",
            value: ""
        }];
        setParams(newParams);
    }

    function renderParam(idx) {
        const param = params[idx];
        return (
            <span>
                <Input
                       addonBefore="key"
                       defaultValue={param.key}
                       rules={[{required: true, message: '请输入key'}]}
                       style={{width: '30%'}}
                       onChange={(e) => {
                           params[idx].key = e.target.value;
                           setParams(params);
                       }}
                />
                <Select
                        defaultValue={param.type}
                        style={{marginLeft: '2%', width: '20%'}}
                        placeholder="请选择参数类型"
                        onChange={(value) => {
                            params[idx].type = value;
                            setParams(params);
                        }}
                >
                        {
                            options.map((item) => (
                                <Select.Option value={item} key={item}>{item}</Select.Option>
                            ))
                        }
                </Select>
                <Input
                    addonBefore="value"
                    defaultValue={param.value}
                    rules={[{required: true, message: '请输入value'}]}
                    style={{marginLeft: '2%', width: '30%'}}
                    onChange={(e) => {
                        params[idx].value = e.target.value;
                        setParams(params);
                    }}
                />
                <Popconfirm
                    title="确定删除"
                    onConfirm={() => {
                        const newParams = params.filter((_, i) => i !== idx);
                        setParams(newParams);
                    }}
                    okText="Yes"
                    cancelText="No"
                    type="error"
                >
                  <Icon type="delete" theme="filled" style={{ color: 'red', marginLeft: '2%' }} />
                </Popconfirm>
            </span>
        );
    }

    return (
        <div>
            <Form>
                <Form.Item label="数据集" rules={[{required: true, message: '请选择数据集'}]}>
                    <Select defaultValue={dataSetId} placeholder="请选择数据集" onChange={(value => setDataSetId(value))}>
                        {
                            props.dataSets.map((item) => (
                                <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item label="参数">
                    {
                        params.map((item, idx) => (
                            <div key={idx}>
                                {renderParam(idx)}
                            </div>
                        ))
                    }
                </Form.Item>
            </Form>
            <div style={{textAlign: "right"}}>
                <Button onClick={addParam}>新增训练参数</Button>
            </div>
            <div style={{marginTop: 20, textAlign: "right"}}>
                <Button onClick={props.onClose} style={{marginRight: 10}}>取消</Button>
                <Button type="primary" onClick={upload}>确定</Button>
            </div>
        </div>
    );
}
