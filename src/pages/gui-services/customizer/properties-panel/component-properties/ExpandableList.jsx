import React from 'react';
import {
Button, Divider, Icon, List
} from 'antd';
import {
    changeSelectedProperty,
    getNewTableButton,
    getSelectedProperty,
    getSelectedPropertyData,
    handleComponentFocus
} from '../../../../../utils/gui-service/dataHelper';

class ExpandableList extends React.PureComponent {
    remove = (k, componentData) => {
        const editData = getSelectedPropertyData();
        editData.buttons = editData.buttons.filter(key => key !== k);
        changeSelectedProperty(editData);
        this.props.reloadEditor();
    };

    add = (componentData) => {
        const newButton = getNewTableButton(componentData);
        const editData = getSelectedPropertyData();
        editData.buttons = editData.buttons.concat(newButton);
        changeSelectedProperty(editData);
        this.props.reloadEditor();
    };

    render() {
        const componentData = getSelectedPropertyData();

        return (
            <>
                <Divider />
                <div className="title-font">
                    附加操作
                </div>
                <List
                    bordered
                    dataSource={componentData.buttons}
                    renderItem={item => (
                        <List.Item
                            key={item.id}
                            onClick={(e) => {
                                e.preventDefault();
                                handleComponentFocus(null, 'btn', getSelectedProperty().containerId, componentData.id, item.id);
                                this.props.reloadEditor();
                            }}
                        >
                            {item.displayName}
                            <Divider type="vertical" />
                            {item.staticProperties.text}
                        </List.Item>
                    )}
                />
                <Button
                    type="dashed"
                    onClick={(e) => {
                        e.preventDefault();
                        this.add(componentData);
                    }}
                    style={{width: '100%', marginTop: '20px'}}
                >
                    <Icon type="plus" />
                    添加按钮
                </Button>
            </>
        );
    }
}

export default ExpandableList;
