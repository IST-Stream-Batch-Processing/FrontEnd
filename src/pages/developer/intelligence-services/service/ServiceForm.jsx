import React, {useState} from 'react';
import {
    Button,
    Form, Input, message, Select
} from 'antd';
import {createIntelService, updateIntelService} from '../../../../api/intelligence';

const { TextArea } = Input;

export default function ServiceForm(props) {
    const [id, setId] = useState(props.current ? props.current.id : null);
    const [name, setName] = useState(props.current ? props.current.name || '' : '');
    const [description, setDescription] = useState(props.current ? props.current.description || '' : '');
    const [modelId, setModelId] = useState(props.current ? props.current.modelId || '' : '');
    const [status, setStatus] = useState(props.current ? props.current.status || '' : '');
    const [loading, setLoading] = useState(false);

    function upload() {
        if (name === '' && modelId === '') {
            message.error('信息不完整');
            return;
        }
        setLoading(true);
        const data = {};
        data.name = name;
        data.description = description;
        data.modelId = modelId;
        if (!id) {
            createIntelService(data).then(() => {
                setLoading(false);
                props.onFresh();
                props.onClose();
                message.success('上传成功');
            });
        } else {
            data.id = id;
            data.status = status;
            updateIntelService(data).then(() => {
                setLoading(false);
                props.onFresh();
                props.onClose();
                message.success('修改成功');
            });
        }
    }

    return (
        <div>
            <Form>
                <Form.Item label="智能服务名称" rules={[{required: true, message: '请输入智能服务名称'}]}>
                    <Input
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                    />
                </Form.Item>
                <Form.Item label="智能服务描述">
                    <TextArea
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                        }}
                    />
                </Form.Item>
                <Form.Item label="模型" rules={[{required: true, message: '请选择模型'}]}>
                    <Select defaultValue={modelId} placeholder="请选择模型" onChange={(value => setModelId(value))}>
                        {
                            props.models.map((item) => (
                                <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
            </Form>
            <div style={{textAlign: "right"}}>
                <Button onClick={props.onClose} style={{marginRight: 10}}>取消</Button>
                <Button type="primary" onClick={upload}>确定</Button>
            </div>
        </div>
    );
}
