import React from 'react';
import {UnControlled as CodeMirror} from 'react-codemirror2';
import 'codemirror/lib/codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/yonce.css';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/scroll/simplescrollbars';
import 'codemirror/addon/scroll/simplescrollbars.css';
import {withRouter} from 'react-router-dom';
import {Card} from 'antd';
import {getModel} from '../../../api/data';
import {getTableId} from '../../../utils/token';

class Model extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        this.getDataModel();
    }

    getDataModel=() => {
        try {
            getModel(getTableId()).then(r => {
                this.setState({
                    dataSource: r,
                });
            });
        } catch (err) {
            console.error(err);
        }
    }

    render() {
        const {dataSource} = this.state;
        return (
            <>
                <Card>
                    <CodeMirror
                        editorDidMount={editor => { this.instance = editor; }}
                        value={dataSource}
                        options={{
                            readOnly: true,
                            lineNumbers: true, // 显示行号
                            mode: {name: 'text/x-java'}, // 语言
                            autofocus: true, // 自动获取焦点
                            styleActiveLine: true, // 光标代码高亮
                            theme: 'yonce', // 主题
                            scrollbarStyle: 'overlay',
                            lineWrapping: false, // 代码自动换行
                            foldGutter: true,
                            gutters: ['CodeMirror-linenumbers', 'CodeMirrorfoldgutter'], // end
                        }}
                    />
                </Card>
            </>
        );
    }
}

export default withRouter(Model);
