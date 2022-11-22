import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {Button, Card, Table} from 'antd';
import {
  CloudUploadOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';
import {deleteAS, getAllAS, getInstances} from '../../../api/developer';
import getASTableColumn from '../../../constants/developer/service/ASTableColumns';
import '../../../css/developer/service/ASPage.css';
import UploadModal from './UploadModal';
import detailModal from './Detail';
import {setServiceDetail} from '../../../redux/reducers/detailSlice';
import InstanceList from './InstanceList';

export default function ASPage() {
    const [showUpload, setShowUpload] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [showInstance, setShowInstance] = useState(false);
    const [current, setCurrent] = useState(null);
    const [instances, setInstances] = useState(null);
    const [asList, setAsList] = useState([]);
    const dispatch = useDispatch();

    function getData() {
        getAllAS().then(r => setAsList(r));
    }

    function editAS(id) {
      const as = asList.find(item => item.id === id);
      setCurrent(as);
      setShowUpload(!showUpload);
    }

    useEffect(() => {
        getData();
    }, []);

    function operator(text, recorder) {
        return (
            <div className="operator">
                <Button
                    onClick={() => {
                        setShowDetail(!showDetail);
                        dispatch(setServiceDetail(recorder));
                    }}
                    style={{ marginLeft: '3px'}}
                >
                    <SearchOutlined />
                    查看详情
                </Button>
                <Button
                    onClick={() => {
                        getInstances(recorder.id).then((res) => {
                            setInstances(res);
                            setShowInstance(!showInstance);
                        });
                    }}
                    style={{ marginLeft: '3px'}}
                >
                    <UnorderedListOutlined />
                    查看日志
                </Button>
              <Button
                onClick={() => editAS(recorder.id)}
                type="primary"
                ghost
                style={{ marginLeft: '3px'}}
              >
                <EditOutlined />
                编辑
              </Button>
                <Button
                    onClick={() => {
                        deleteAS(recorder.id).then(() => {
                            getData();
                        });
                    }}
                    type="danger"
                    ghost
                    style={{ marginLeft: '3px'}}
                >
                    <DeleteOutlined />
                    删除
                </Button>
            </div>
        );
    }

    return (
        <div>
              <Button
                  type="primary"
                  onClick={() => {
                      setCurrent(null);
                      setShowUpload(!showUpload);
                  }}
                  style={{marginBottom: '10px'}}
              >
                  <CloudUploadOutlined />
                  上传Jar包
              </Button>
          <UploadModal show={showUpload} current={current} onClose={() => { setShowUpload(!showUpload); }} onFresh={getData} key={current} />
            { detailModal(showDetail, () => { setShowDetail(!showDetail); }, getData) }
            <InstanceList show={showInstance} onClose={() => { setShowInstance(!showInstance); }} data={instances} />
          <Card>
            <div className="panelSpan" style={{margin: '10px'}}>原子服务列表</div>
            <Table columns={getASTableColumn(operator)} dataSource={asList} bordered rowKey="id" />
          </Card>
        </div>
    );
}
