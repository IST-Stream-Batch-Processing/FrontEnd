import React from 'react';
import './editor.css';
import {getLayoutsByProjectId, getSingleLayout} from '../../../api/gui';
import {getProjectId} from '../../../utils/token';
import CustomizerPageHeader from './page-header/CustomizerPageHeader';
import {getContextByData} from '../../../utils/gui-service/guihelper';
import {getDetailData} from '../../../api/data';
import {getAllAS} from '../../../api/developer';
import {getOSServices} from '../../../api/osService';
import {
    setAsServices,
    setContext,
    setLayoutEditData,
    setLayoutsData,
    setOsServices,
    setTableData
} from '../../../utils/gui-service/dataHelper';
import CustomizerCanvas from './canvas/CustomizerCanvas';
import PropertiesPanel from './properties-panel/PropertiesPanel';

class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            reload: {}
        };
    }

    /* --------------------------------传递给子组件的工具，用来更新整个界面--------------------------------------- */
    reloadEditor() {
        this.setState((state) => ({reload: {}}));
    }

    /* ----------------------------------------数据增删改查-------------------------------------------------- */

    componentDidMount() {
        this.getTableData();
        this.getLayouts();
        this.getData();
        this.getASServiceData();
        this.getOSServiceData();
    }

    // 获取所有数据模型数据
    getTableData = () => {
        try {
            getDetailData().then(result => {
                setTableData(result.filter((dataInfo) => dataInfo.builtIn === false));
            });
        } catch (err) {
            console.error(err);
        }
    }

    getASServiceData = () => {
        try {
            getAllAS().then(result => {
                setAsServices(result);
            });
        } catch (err) {
            console.error(err);
        }
    }

    getOSServiceData = () => {
        try {
            getOSServices().then(result => {
                setOsServices(result);
            });
        } catch (err) {
            console.error(err);
        }
    }

    getLayouts = () => {
        try {
            getLayoutsByProjectId(getProjectId()).then(result => {
                setLayoutsData(result);
            });
        } catch (err) {
            console.error(err);
        }
    }

    getData = () => {
        try {
            getSingleLayout(this.props.match.params.id).then(result => {
                setLayoutEditData(result);
                setContext(getContextByData(result));
            }).then(() => {
                this.setState(state => ({
                    isLoading: false
                }));
            });
        } catch (err) {
            console.error(err);
        }
    };

    /* ---------------------------------------容器与组件属性编辑---------------------------------------------- */

    render() {
        if (this.state.isLoading) {
            return null;
        }

        return (
            <div className="root-div">
                <CustomizerPageHeader />
                <div id="editor-customize-area">
                    <div id="customizer-canvas">
                        <CustomizerCanvas reloadEditor={() => this.reloadEditor()} />
                    </div>
                    <div id="properties-panel">
                        <PropertiesPanel reloadEditor={() => this.reloadEditor()} />
                    </div>
                </div>
            </div>
        );
    }
}

export default Editor;
