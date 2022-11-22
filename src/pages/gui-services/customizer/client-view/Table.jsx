import React from 'react';
import {
    Table
} from 'antd';
import MyButton from './Button';

export default function MyTable(props) {
    function genOperateColumn(index) {
        const {buttons} = props.component;
        const currentLineButtons = buttons[index];
        if (!currentLineButtons || currentLineButtons.length === 0) return null;
        return currentLineButtons.map((button) => <MyButton setIsLoading={props.setIsLoading} component={button} />);
    }

    function genColumnFromFields(fields) {
        if (!fields) return [];
        const columns = fields.map((field) => ({
            title: field,
            dataIndex: field,
            key: field,
            render: (text, recorder) => (<div>{recorder[`${field}`]}</div>)
        }));
        // 检查是否有button，没有的话就不必有操作栏了
        if (props.component.buttons && props.component.buttons.length > 0 && props.component.buttons[0].length > 0) {
                columns.push({title: '操作', render: (text, recorder, index) => (<div>{genOperateColumn(index)}</div>)});
        }
        return columns;
    }

    return (
        <div>
            <Table
                className="element"
                style={props.style}
                columns={genColumnFromFields(props.component.showFields)}
                dataSource={props.component.dataSet}
            />
        </div>
    );
}
