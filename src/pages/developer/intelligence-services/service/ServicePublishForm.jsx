import React, {useState} from 'react';
import {
    Button,
    Form, Input, message, Select
} from 'antd';
import {publishIntelService} from '../../../../api/intelligence';

const { TextArea } = Input;

export default function ServicePublishForm(props) {
    const [id, setId] = useState(props.current ? props.current.id : null);
    const [version, setVersion] = useState('');
    const [maxVersion, setMaxVersion] = useState(props.current ? props.current.latestVersion : null);
    const [loading, setLoading] = useState(false);

    function upload() {
        if (version === '') {
            message.error('信息不完整');
            return;
        }
        setLoading(true);
        publishIntelService(id, version).then(() => {
            setLoading(false);
            props.onFresh();
            props.onClose();
            message.success('发布成功');
        });
    }

    function getVersionOption() {
        let options = [];
        for (let i = 1; i <= maxVersion; i += 1) {
            options.push(i);
        }
        return options;
    }

    return (
        <div>
            <Form>
                <Form.Item label="服务发行版本" rules={[{required: true, message: '请选择服务发行版本'}]}>
                    <Select placeholder="请选择发布版本" onChange={(value => setVersion(value))}>
                        {
                            getVersionOption().map((item) => (
                                <Select.Option value={item} key={item}>{item}</Select.Option>
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
