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
import StreamCombinationPage from "./stream-services/combination/StreamCombinationPage";
import StreamCombinationEditPage from "./stream-services/combination/StreamCombinationEditPage";

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
    path: `${match.url}/streamProcess/combination`,
    component: StreamCombinationPage,
  },
  {
    key: 'streamProcessCombinationEditPage',
    path: `${match.url}/streamProcess/combination/edit/:id`,
    component: StreamCombinationEditPage,
  },
];

export default function developerPage(match) {
  const items = [
    {
      id: 1,
      iconType: 'deployment-unit',
      path: `${match.url}`,
      title: '????????????',
      text: '????????????',
    },
    {
      id: 2,
      iconType: 'copy',
      title: '????????????',
      path: `${match.url}/dataModel`,
      text: '????????????',
    },
    {
      id: 3,
      iconType: 'radius-upright',
      title: '????????????',
      path: `${match.url}/as`,
      text: '????????????',
    },
    {
      id: 4,
      iconType: 'block',
      title: '????????????',
      path: `${match.url}/orchestration`,
      text: '????????????',
    },
    {
      id: 5,
      type: 'menu-group',
      iconType: 'appstore',
      title: '????????????',
      text: '????????????',
      item: [
        {
          id: 5.1,
          iconType: 'bar-chart',
          title: '???????????????',
          path: `${match.url}/intelligence/dataSet`,
          text: '???????????????'
        },
        {
          id: 5.2,
          iconType: 'book',
          title: '????????????',
          path: `${match.url}/intelligence/model`,
          text: '????????????'
        },
        {
          id: 5.3,
          iconType: 'snippets',
          title: '??????????????????',
          path: `${match.url}/intelligence/service`,
          text: '??????????????????'
        },
      ]
    },
    {
      id: 6,
      iconType: 'file-image',
      title: '????????????',
      path: `${match.url}/layouts`,
      text: '????????????',
    },
    {
      id: 7,
      type: 'menu-group',
      iconType: 'funnel-plot',
      title: '???????????????',
      text: '???????????????',
      item: [
        {
          id: 7.1,
          iconType: 'database',
          title: '????????????',
          path: `${match.url}/streamProcess/model`,
          text: '????????????'
        },
        {
          id: 7.2,
          iconType: 'filter',
          title: '???????????????',
          path: `${match.url}/streamProcess/service`,
          text: '???????????????'
        },
        {
          id: 7.3,
          iconType: 'filter',
          title: '???????????????',
          path: `${match.url}/streamProcess/combination`,
          text: '???????????????'
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
