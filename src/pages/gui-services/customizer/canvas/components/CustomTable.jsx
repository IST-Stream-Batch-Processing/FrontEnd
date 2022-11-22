import React from 'react';
import {Button, Table} from 'antd';
import {getSelectedApi, propertiesHandler, styleHandler} from '../../../../../utils/gui-service/guihelper';
import {getComponentData, getLayoutEditData, handleComponentFocus} from '../../../../../utils/gui-service/dataHelper';

const {Column} = Table;

export default function CustomTable(props) {
    const data = getComponentData(props.containerId, props.componentId);
    let mockData = {key: '1'};
    if (data.showFields) {
        data.showFields.forEach((field) => {
            mockData[field] = 'xxxxxx';
        });
    }

    mockData = [mockData];
    const currentApi = getSelectedApi(getLayoutEditData().apis, data.dataSource);
    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
        <div
            onClick={(e) => {
                e.stopPropagation();
                handleComponentFocus(e, 'com', props.containerId, props.componentId);
                props.reloadEditor();
            }}
            style={styleHandler(data.styleProperties)}
        >
            <Table
                dataSource={mockData}
                className="canvas-component"
                {...propertiesHandler(data.staticProperties)}
            >
                {data.showFields && currentApi && currentApi.out.fields ? currentApi.out.fields.map((field) => {
                    if (data.showFields.includes(field.name)) {
                        return <Column title={field.name} dataIndex={field.name} key={field.name} />;
                    }
                    return null;
                }) : null}
                {data.buttons.length > 0 ? (
                        <Column
                            title="动作"
                            key="action"
                            render={() => data.buttons.map((button) => (
                                <Button>{button.staticProperties.text}</Button>
                            ))}
                        />
                    )
                    : null}
            </Table>
        </div>

    );
}
