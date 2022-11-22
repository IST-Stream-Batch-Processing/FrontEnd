import React, {useEffect, useState} from 'react';
import {useLocation, useParams} from 'react-router-dom';
import {Button, Spin, Typography} from 'antd';
import {getInstance} from '../../../../api/gui';
import FormContainer from './FormContainer';
import LayoutContainer from './LayoutContainer';
import {styleHandler} from '../../../../utils/gui-service/guihelper';

function containerRenderer(containers, setIsLoading) {
    return (
        containers.map((container) => {
            switch (container.type) {
                case 'layout':
                    return <LayoutContainer setIsLoading={setIsLoading} container={container} />;
                case 'form':
                    return <FormContainer setIsLoading={setIsLoading} container={container} />;
                default:
                    return null;
            }
        })
    );
}

function ClientView() {
    const {id} = useParams();
    const [layout, setLayout] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();

    useEffect(() => {
        try {
            getInstance(id, location.state ? location.state : {}).then((res) => {
                setLayout(res);
            });
        } catch (err) {
            console.error(err);
        }
    }, [id]);

    return (
        layout ? isLoading ?
            <Spin spinning={isLoading} size="large" style={{width: '100%', height: '100%'}} /> : (
                <div style={{
                    width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column'
                }}
                >
                    <div className="customizer-page-header">
                        <Button
                            onClick={() => window.history.back()}
                            icon="arrow-left"
                            size="large"
                            style={{border: 'none'}}
                        />
                        <Typography.Text style={{fontSize: 18, marginLeft: 20}}>返回首页</Typography.Text>
                    </div>
                    <div className="layout-view client-view" style={styleHandler(layout.styleProperties)}>
                        {containerRenderer(layout.containers, setIsLoading)}
                    </div>
                </div>
            ) : null

    );
}

export default ClientView;
