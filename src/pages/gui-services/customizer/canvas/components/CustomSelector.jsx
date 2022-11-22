import React from 'react';
import {Select} from 'antd';
import ReactDOM from 'react-dom';
import {canvasElementsOnDragEnd, propertiesHandler, styleHandler} from '../../../../../utils/gui-service/guihelper';

class CustomSelector extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            x: null,
            y: null,
        };
    }

    render() {
        console.log(styleHandler(this.props.currentComponent.styleProperties));
        return (
            <Select
                className="canvas-component element"
                onClick={(e) => {
                    e.stopPropagation();
                    this.props.onClick(this.props.identity);
                }}
                style={styleHandler(this.props.currentComponent.styleProperties)}
                {...propertiesHandler(this.props.currentComponent.staticProperties)}
                // draggable
                // onDragEnd={(e) => canvasElementsOnDragEnd(e, this.props, this.state.x, this.state.y)}
                // onMouseDown={(e) => {
                //     console.log(e);
                //     this.setState((state) => ({
                //         // eslint-disable-next-line react/no-find-dom-node
                //         x: e.pageX - ReactDOM.findDOMNode(this).getBoundingClientRect().left,
                //         // eslint-disable-next-line react/no-find-dom-node
                //         y: e.pageY - ReactDOM.findDOMNode(this).getBoundingClientRect().top
                //     }));
                // }}
            >
                {/* {this.props.contents} */}
            </Select>
        );
    }
}

export default CustomSelector;
