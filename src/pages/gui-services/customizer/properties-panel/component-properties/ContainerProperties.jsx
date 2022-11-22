import React from 'react';
import {Button, Form} from 'antd';
import {
    deleteSelectedProperty,
    getContainerData,
    getLayoutEditData,
    getSelectedProperty
} from '../../../../../utils/gui-service/dataHelper';
import Display from './style-edit/Display';
import FlexDirection from './style-edit/FlexDirection';
import Margin from './style-edit/Margin';
import Padding from './style-edit/Padding';
import DisplayName from './style-edit/DisplayName';
import Flex from './style-edit/Flex';
import Size from './style-edit/Size';
import JustifyContent from './style-edit/JustifyContent';
import AlignItems from './style-edit/AlignItems';

// 展示性容器的properties panel
class ContainerProperties extends React.PureComponent {
    render() {
        const layoutContainer = getContainerData(getSelectedProperty().containerId);
        return (
            <>
                <Form id="customizer-form-area">
                    <div id="customizer-properties-form" key={`${layoutContainer.id}-container`}>
                        <DisplayName reloadEditor={() => this.props.reloadEditor()} />
                        {getLayoutEditData().styleProperties.display === 'flex' ? (
                                <Flex reloadEditor={() => this.props.reloadEditor()} />
                            )
                            : null}
                        <Display reloadEditor={() => this.props.reloadEditor()} />
                        <FlexDirection reloadEditor={() => this.props.reloadEditor()} />
                        <JustifyContent reloadEditor={() => this.props.reloadEditor()} />
                        <AlignItems reloadEditor={() => this.props.reloadEditor()} />
                        <Margin reloadEditor={() => this.props.reloadEditor()} />
                        <Padding reloadEditor={() => this.props.reloadEditor()} />
                        <Size reloadEditor={() => this.props.reloadEditor()} />
                    </div>
                    <div id="customizer-properties-bottom-btn-grp">
                        <Button
                            key="2"
                            type="danger"
                            onClick={(e) => {
                                e.preventDefault();
                                deleteSelectedProperty();
                                this.props.reloadEditor();
                            }}
                            className="customizer-bottom-btn"
                        >
                            删除
                        </Button>
                    </div>
                </Form>
            </>
        );
    }
}

export default ContainerProperties;
