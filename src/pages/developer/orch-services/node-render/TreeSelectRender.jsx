import {Icon, TreeSelect} from 'antd';

import React from 'react';
import '../../../../css/osService.css';

const iconTypeList = {
  'Object': 'codepen',
  'Base': 'appstore',
  'List': 'appstore',
  'Node': 'radius-setting'
};

const {TreeNode} = TreeSelect;

function handleTreeTitleOfNode(nodeId, name) {
  return (
    <div>
      <Icon type={iconTypeList.Node} className="icon" />
      {name}
      {nodeId === '0' ? '' : `->${nodeId}`}
    </div>
  );
}

function handleTreeTitleOfBase(fieldName, typeName) {
  if (fieldName === undefined) {
    return (
      <div>
        <Icon type={iconTypeList.Base} className="icon" />
        {typeName}
      </div>
    );
  }
  return (
    <div>
      <Icon type={iconTypeList.Base} className="icon" />
      {fieldName}
      {typeName !== undefined && `(${typeName})`}
    </div>
  );
}

function handleTreeTitleOfObject(className, fieldName) {
  return (
    <div>
      <Icon type={iconTypeList.Object} className="icon" />
      {fieldName !== undefined && fieldName}
      {
        fieldName === undefined ? className : `(${className})`
      }
    </div>
  );
}

function handleTreeTitleOfList(fieldName, memberType) {
  if (memberType === undefined) {
    return (
      <div>
        <Icon type={iconTypeList.List} className="icon" />
        List
      </div>
    );
  }
  let type = memberType.name === 'Object' ? memberType.className : memberType.name;
  type = fieldName === undefined ? `List<${type}>` : `${fieldName}(List<${type}>）`;
  return (
    <div>
      <Icon type={iconTypeList.List} className="icon" />
      {type}
    </div>
  );
}

function noAlias(alias) {
  return alias === null || alias === '' || alias === undefined;
}

function renderSelectNode (path, type, fieldName, fieldKey, nodeId, serviceId) {
  if (type === null || type === undefined) return (<></>);
  const optionDot = path === '' ? '' : '.';
  switch (type.name) {
    case 'Object':
      return (
        <TreeNode
          title={handleTreeTitleOfObject(type.className, fieldName)}
          disabled
          value={`${path}${nodeId}`}
          key={`${path}${nodeId}`}
        >
          {type.fields.map(
            (item, index) => (
              renderSelectNode(
                `${path}${optionDot}${item.name}`,
                item.type, noAlias(item.alias) ? item.name : item.alias,
                item.key, nodeId, serviceId
              )
            )
          )}
        </TreeNode>
      );
    case 'List':
      return (
        <TreeNode title={handleTreeTitleOfList(fieldName, type.memberType || undefined)} value={`${fieldKey},${nodeId},${path}`} key={fieldKey + nodeId} />
      );
    default:
      return (
        <TreeNode
          title={handleTreeTitleOfBase(fieldName, type.name)}
          value={`${fieldKey},${nodeId},${path}`}
          key={fieldKey + nodeId}
        />
      );
  }
}

// 只有一层的情况
function renderSingleLayerSelectNode (type, nodeId, serviceId) {
  switch (type.name) {
    case 'List':
      return (
        <TreeNode title={handleTreeTitleOfList(undefined, type.memberType)} value={`Base,${nodeId}`} key="List" />
      );
    default:
      return (
        <TreeNode
          title={handleTreeTitleOfBase(undefined, type.name)}
          value={`Base,${nodeId}`}
          key={type.name}
        />
      );
  }
}

export default function renderService(services) {
  const otherServices = services.filter((item) => item.inType !== undefined && item.inType !== null && item.outType !== undefined && item.outType !== null);
  return (
    otherServices.length > 0 ?
    otherServices.map(
      (item, index) => (
          <TreeNode
          title={handleTreeTitleOfNode(item.id, item.serviceName)}
          disabled
          key={item.id + index.toString()}
          value={item.id + index.toString()}
          >
           { item.outType.name === 'Object' ?
             renderSelectNode(
              '',
              item.outType, undefined,
              undefined, item.id, item.serviceId
            ) : renderSingleLayerSelectNode(item.outType, item.id, item.serviceId)}
          </TreeNode>
      )
    ) : null
  );
}
