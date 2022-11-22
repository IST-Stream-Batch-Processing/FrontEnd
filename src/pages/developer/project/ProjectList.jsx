import React, {useEffect, useState} from 'react';
import {useRouteMatch} from 'react-router-dom';
import {
    List, Card, Button, Modal, Input
} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {getProjects, newProject} from '../../../api/project';
import history from '../../../utils/history';
import {getToken, getUserId, setProjectId} from '../../../utils/token';

export default function projectList(isDeveloper = false) {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  let {url} = useRouteMatch();
  url = url === '/' ? '/home' : url;

  useEffect(() => {
    getProjects().then(res => {
        setProjects(res);
    });
  }, []);
  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'right', marginRight: '13%'}}>
        {isDeveloper && (
          <Button type="primary" onClick={() => { setShowModal(!showModal); }}>
            <PlusOutlined />
            新建项目
          </Button>
        )}
      </div>
        <Modal
            title="新建项目"
            visible={showModal}
            onCancel={() => {
                setShowModal(!showModal);
            }}
            onOk={() => {
                const tmp = {'projectName': projectName, 'creatorId': getUserId(getToken())};
                newProject(tmp).then(() => {
                    getProjects().then(res => {
                        setProjects(res);
                    });
                });
                setShowModal(!showModal);
            }}
        >
            <Input
                value={projectName}
                onChange={(e) => {
                setProjectName(e.target.value);
            }}
            />
        </Modal>
      <div style={{marginLeft: '10%', marginRight: '10%', marginTop: '2%'}}>
        <List
                    grid={{gutter: 16, column: 4}}
                    dataSource={projects}
                    renderItem={item => (
                      <List.Item>
                        <Card
                            onClick={() => {
                            setProjectId(item.id);
                            history.push(`${url}/project`);
                        }}
                              title={item.projectName}
                        >
                          创建人：
                          {item.username}
                        </Card>
                      </List.Item>
                    )}
        />
      </div>
    </div>
  );
}
