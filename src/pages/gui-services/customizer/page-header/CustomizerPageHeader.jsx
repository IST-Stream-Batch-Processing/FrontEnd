import React, {useState} from 'react';
import {
    Button, Divider, Icon, Input, message, Switch
} from 'antd';
import {getLayoutEditData, setLayoutEditDataField} from '../../../../utils/gui-service/dataHelper';
import history from '../../../../utils/history';
import {updateLayout} from '../../../../api/gui';

export default function CustomizerPageHeader(props) {
    let [, setState] = useState();

    const changePublishState = (e, newPublishState) => {
        e.preventDefault();
        setLayoutEditDataField('state', newPublishState);
        setState({});
    };

    const changeName = (e) => {
        e.preventDefault();
        setLayoutEditDataField('name', e.target.value);
    };

    // 跳转到预览模式
    const gotoView = e => {
        e.preventDefault();
        history.push(`/view/${getLayoutEditData().id}`);
    };

    // 保存修改并传送到后端
    const saveData = async (e) => {
        e.preventDefault();
        try {
            await updateLayout(getLayoutEditData());
            message.success('保存成功！');
        } catch (err) {
            console.error(err);
        }
    };

    const viewButton = getLayoutEditData().state === 'unpublished' ?
        <Button key="1" onClick={(e) => gotoView(e)} disabled>预览模式</Button> :
        <Button key="1" onClick={(e) => gotoView(e)}>预览模式</Button>;

    const publishButton = getLayoutEditData().state === 'unpublished' ?
        <Button key="3" type="primary" onClick={(e) => changePublishState(e, 'published')}>发布界面</Button> :
        <Button key="3" type="danger" onClick={(e) => changePublishState(e, 'unpublished')}>取消发布</Button>;

    return (
        <div className="customizer-page-header">
            <Button
                onClick={() => window.history.back()}
                icon="arrow-left"
                style={{border: 'none'}}
            />
            <Input
                size="large"
                defaultValue={getLayoutEditData().name}
                onChange={(e) => changeName(e)}
                style={{
                    border: 'none',
                    width: '15vw'
                }}
            />
            <div className="customizer-right-btn-grp">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div style={{marginRight: 20}}>首页设置</div>
                    <Switch
                        checkedChildren={<Icon type="check" />}
                        unCheckedChildren={<Icon type="close" />}
                        checked={getLayoutEditData().atFrontPage}
                        onChange={(e) => {
                            setLayoutEditDataField('atFrontPage', e);
                            setState({});
                        }}
                    />
                    <Divider type="vertical" style={{marginLeft: 20}} />
                </div>
                {viewButton}
                <Button key="2" onClick={(e) => saveData(e)}>提交修改</Button>
                {publishButton}
            </div>
        </div>
    );
}
