import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';

const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

    if (!isJpgOrPng) {
        message.error('您只可以上传格式为JPG/PNG的图片!');
    }

    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isLt2M) {
        message.error('图片大小不得大于2MB!');
    }

    return isJpgOrPng && isLt2M;
};

const ImageUploader = (props) => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(props.value);

    const handleChange = (info) => {
        getBase64(info.file.originFileObj, (url) => {
            setImageUrl(url);
            props.onChange(url);
        });
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div
                style={{
                    marginTop: 8
                }}
            >
                上传图片
            </div>
        </div>
    );
    return (
        <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={handleChange}
        >
            {imageUrl !== 'url' ? (
                <img
                    src={imageUrl}
                    alt="avatar"
                    style={{
                        width: '100%'
                    }}
                />
            ) : (
                uploadButton
            )}
        </Upload>
    );
};

export default ImageUploader;
