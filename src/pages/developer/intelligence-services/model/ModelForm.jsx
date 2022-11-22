import React, {useState} from 'react';
import {
  Button,
  Form, Input, message, Select
} from 'antd';
import {newModel, updateModel} from '../../../../api/model';
import {modelTypes, modelTypesNames} from '../../../../constants/developer/intelligence-services/model';

const { TextArea } = Input;

export default function ModelForm(props) {
  const [id, setId] = useState(props.current ? props.current.id : null);
  const [name, setName] = useState(props.current ? props.current.name || '' : '');
  const [description, setDescription] = useState(props.current ? props.current.description || '' : '');
  const [modelType, setModelType] = useState(props.current ? props.current.modelType || '' : '');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  function upload() {
    if ((name === '' && modelType === '') || (!id && !file)) {
      message.error('信息不完整');
      return;
    }
    setLoading(true);
    const form = new FormData();
    form.append('name', name);
    form.append('description', description);
    form.append('modelType', modelType);
    form.append('file', file);
    if (!id) {
      newModel(form).then(() => {
        setLoading(false);
        props.onFresh();
        props.onClose();
        message.success('上传成功');
      });
    } else {
      updateModel(id, form).then(() => {
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
          <Form.Item label="模型名称" rules={[{required: true, message: '请输入模型名称'}]}>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item label="模型描述">
            <TextArea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item label="模型种类" rules={[{required: true, message: '请选择模型种类'}]}>
            <Select defaultValue={modelType} placeholder="请选择模型种类" onChange={(value => setModelType(value))}>
              {
                modelTypes.map((item) => (
                  <Select.Option value={item} key={item}>{modelTypesNames[item]}</Select.Option>
                ))
              }
            </Select>
          </Form.Item>
          <Form.Item>
            <input
              type="file"
              accept=".*"
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
            />
          </Form.Item>
        </Form>
      <div style={{textAlign: "right"}}>
        <Button onClick={props.onClose} style={{marginRight: 10}}>取消</Button>
        <Button type="primary" onClick={upload}>确定</Button>
      </div>

    </div>
  );
}
