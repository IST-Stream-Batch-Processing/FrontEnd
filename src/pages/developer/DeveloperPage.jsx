import React from 'react';
import pageWrapper from '../../components/PageWrapper';
import ProjectList from './project/ProjectList';
import TestPage from '../test/TestPage';
import ServiceList from './service/ASPage';
import dataModel from './data/DataModel';
import NewData from './data/NewData';
import dataItem from './data/DataItem';
import Relation from './data/Relation';
import model from './data/Model';
import EditData from './data/EditData';
import DataSetPage from './intelligence-services/dataSet/DataSetPage';
import OrchestrationServiceList from './orch-services/OrchestrationServiceList';
import CreateOrchestrationService from './orch-services/service-create/CreateOrchestrationService';
import OrchestrationServiceDetail from './orch-services/detail/OrchestrationServiceDetail';
import OrchestrationServiceEdit from './orch-services/edit/OrchestrationServiceEdit';
import ModelList from './intelligence-services/model/ModelList';
import IntelServiceList from './intelligence-services/service/ServiceList';
import TrainPage from './intelligence-services/service/TrainPage';
import LayoutPage from "../gui-services/layouts/LayoutPage";
import StreamModelPage from "./stream-services/model/StreamModelPage";
import StreamServicePage from "./stream-services/service/StreamServicePage";
import StreamModelCreatePage from "./stream-services/model/StreamModelCreatePage";
import StreamModelDataPage from "./stream-services/model/StreamModelDataPage";
import StreamModelEditPage from "./stream-services/model/StreamModelEditPage";
import StreamServiceCreatePage from "./stream-services/service/StreamServiceCreatePage";
import StreamServiceEditPage from "./stream-services/service/StreamServiceEditPage";
import StreamCombinationPage from "./stream-services/StreamCombinationPage";

const routes = (match) => [
  {
    key: 'page',
    path: `${match.url}/test`,
    component: TestPage,
  },
  {
    key: 'dataModelPage',
    path: `${match.url}/dataModel`,
    component: dataModel,
  },
  {
    key: 'createDataPage',
    path: `${match.url}/createData`,
    component: NewData,
  },
  {
    key: 'editDataPage',
    path: `${match.url}/editData`,
    component: EditData,
  },
  {
    key: 'dataItemPage',
    path: `${match.url}/dataItem`,
    component: dataItem,
  },
  {
    key: 'relationPage',
    path: `${match.url}/relation`,
    component: Relation,
  },
  {
    key: 'modelPage',
    path: `${match.url}/model`,
    component: model,
  },
  {
    key: 'layoutPage',
    path: `${match.url}/layouts`,
    component: ProjectList,
  },
  {
    key: 'projectLayouts',
    path: `${match.url}/layouts/project`,
    component: LayoutPage,
  },
  {
    key: 'servicePage',
    path: `${match.url}/as`,
    component: ServiceList,
  },
  {
    key: 'OSServicePage',
    path: `${match.url}/orchestration`,
    component: OrchestrationServiceList,
  },
  {
    key: 'OSServiceCreatePage',
    path: `${match.url}/orchestration/new`,
    component: CreateOrchestrationService,
  },
  {
    key: 'OSServiceDetailPage',
    path: `${match.url}/orchestration/detail`,
    component: OrchestrationServiceDetail,
  },
  {
    key: 'OSServiceEditPage',
    path: `${match.url}/orchestration/edit`,
    component: OrchestrationServiceEdit,
  },
  {
    key: 'ModelPage',
    path: `${match.url}/intelligence/model`,
    component: ModelList,
  },
  {
    key: 'dataSetPage',
    path: `${match.url}/intelligence/dataSet`,
    component: DataSetPage,
  },
  {
    key: 'IntelligenceServicePage',
    path: `${match.url}/intelligence/service`,
    component: IntelServiceList,
  },
  {
    key: 'IntelligenceServiceTrainPage',
    path: `${match.url}/intelligence/service/train`,
    component: TrainPage,
  },
  {
    key: 'streamProcessModelPage',
    path: `${match.url}/streamProcess/model`,
    component: StreamModelPage,
  },
  {
    key: 'streamProcessModelCreatePage',
    path: `${match.url}/streamProcess/model/create`,
    component: StreamModelCreatePage,
  },
  {
    key: 'streamProcessModelDataPage',
    path: `${match.url}/streamProcess/model/data`,
    component: StreamModelDataPage,
  },
  {
    key: 'streamProcessModelEditPage',
    path: `${match.url}/streamProcess/model/edit/:id`,
    component: StreamModelEditPage,
  },
  {
    key: 'streamProcessServicePage',
    path: `${match.url}/streamProcess/service`,
    component: StreamServicePage,
  },
  {
    key: 'streamProcessServicePage',
    path: `${match.url}/streamProcess/service/create`,
    component: StreamServiceCreatePage,
  },
  {
    key: 'streamProcessServicePage',
    path: `${match.url}/streamProcess/service/edit/:id`,
    component: StreamServiceEditPage,
  },
  {
    key: 'streamProcessCombinationPage',
    path: `${match.url}/streamProcess/combination/:id`,
    component: StreamCombinationPage,
  },
];

export default function developerPage(match) {
  const items = [
    {
      id: 1,
      iconType: 'deployment-unit',
      path: `${match.url}`,
      title: '领域建模',
      text: '领域建模',
    },
    {
      id: 2,
      iconType: 'copy',
      title: '数据模型',
      path: `${match.url}/dataModel`,
      text: '数据模型',
    },
    {
      id: 3,
      iconType: 'radius-upright',
      title: '原子服务',
      path: `${match.url}/as`,
      text: '原子服务',
    },
    {
      id: 4,
      iconType: 'block',
      title: '服务编排',
      path: `${match.url}/orchestration`,
      text: '服务编排',
    },
    {
      id: 5,
      type: 'menu-group',
      iconType: 'appstore',
      title: '智能服务',
      text: '智能服务',
      item: [
        {
          id: 5.1,
          iconType: 'bar-chart',
          title: '数据集管理',
          path: `${match.url}/intelligence/dataSet`,
          text: '数据集管理'
        },
        {
          id: 5.2,
          iconType: 'book',
          title: '模型管理',
          path: `${match.url}/intelligence/model`,
          text: '模型管理'
        },
        {
          id: 5.3,
          iconType: 'snippets',
          title: '智能服务管理',
          path: `${match.url}/intelligence/service`,
          text: '智能服务管理'
        },
      ]
    },
    {
      id: 6,
      iconType: 'file-image',
      title: '页面设计',
      path: `${match.url}/layouts`,
      text: '页面设计',
    },
    {
      id: 7,
      type: 'menu-group',
      iconType: 'funnel-plot',
      title: '流处理服务',
      text: '流处理服务',
      item: [
        {
          id: 7.1,
          iconType: 'database',
          title: '流数据源',
          path: `${match.url}/streamProcess/model`,
          text: '流数据源'
        },
        {
          id: 7.2,
          iconType: 'filter',
          title: '流处理服务',
          path: `${match.url}/streamProcess/service`,
          text: '流处理服务'
        }
      ]
    }
  ];
  const r = routes(match);
  return (
    <div>
      {pageWrapper(items, r, {currentModel: 'Developer'})}
    </div>
  );
}
