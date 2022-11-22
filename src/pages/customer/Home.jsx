import React from 'react';
import SimplePageWrapper from '../../components/SimplePageWrapper';
import ProjectList from '../developer/project/ProjectList';

export default function Home() {
  return (
    <div>
      {SimplePageWrapper(ProjectList(), {currentModel: 'Customer'})}
    </div>
  );
}
