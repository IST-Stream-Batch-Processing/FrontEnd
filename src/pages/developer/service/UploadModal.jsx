import React, {useState} from 'react';
import {
    Form, Modal, Input, message
} from 'antd';
import {uploadCode, updateAS} from '../../../api/developer';

const { TextArea } = Input;

export default function UploadModal(props) {
    const [id, setId] = useState(props.current ? props.current.id : null);
    const [serviceName, setServiceName] = useState(props.current ? props.current.name || '' : '');
    const [description, setDescription] = useState(props.current ? props.current.description || '' : '');
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);

    function upload() {
        if (serviceName === '' || (!id && !file)) {
            message.error('信息不完整');
            return;
        }
        setLoading(true);
        const form = new FormData();
        form.append('serviceName', serviceName);
        form.append('description', description);
        form.append('sourceCode', file);
        if (!id) {
            uploadCode(form).then(() => {
                setLoading(false);
                props.onFresh();
                props.onClose();
                message.success('上传成功');
            });
        } else {
            updateAS(form, id).then(() => {
                setLoading(false);
                props.onFresh();
                props.onClose();
                message.success('修改成功');
            });
        }
    }

    return (
        <div>
            <Modal confirmLoading={loading} visible={props.show} onCancel={props.onClose} onOk={upload} okText="上传" destroyOnClose>
                <Form>
                    <Form.Item label="服务名" rules={[{required: true, message: '请输入服务名'}]}>
                        <Input
                          value={serviceName}
                            onChange={(e) => {
                                setServiceName(e.target.value);
                            }}
                        />
                    </Form.Item>
                    <Form.Item label="服务描述">
                        <TextArea
                          value={description}
                            onChange={(e) => {
                                setDescription(e.target.value);
                            }}
                        />
                    </Form.Item>
                    <Form.Item>
                        <input
                            type="file"
                            accept=".jar"
                            onChange={(e) => {
                                setFile(e.target.files[0]);
                            }}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
