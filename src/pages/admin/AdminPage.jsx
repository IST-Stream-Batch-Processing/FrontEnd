import React from 'react';
import pageWrapper from '../../components/PageWrapper';
import Authorize from './Authorize';
import DepartmentTree from './department/DepartmentTree';
import PositionList from './department/PositionList';

const routes = (match) => [{
  key: 'authority',
  path: `${match.url}/authority`,
  component: Authorize,
},
{
  key: 'department',
  path: `${match.url}/department`,
  component: DepartmentTree,
},
{
  key: 'position',
  path: `${match.url}/position`,
  component: PositionList,
}
];

export default function AdminPage(match) {
  const items = [
    {
      id: 1,
      iconType: 'audit',
      title: '权限管理',
      path: `${match.url}/authority`,
      text: '权限管理',
    },
    {
      id: 2,
      iconType: 'menu-unfold',
      title: '部门管理',
      path: `${match.url}/department`,
      text: '部门管理',
    },
    {
      id: 3,
      iconType: 'team',
      title: '角色管理',
      path: `${match.url}/position`,
      text: '角色管理',
    }
  ];
  const r = routes(match);
  return (
    <div>
      {pageWrapper(items, r, { currentModel: 'Admin' })}
    </div>
  );
}
