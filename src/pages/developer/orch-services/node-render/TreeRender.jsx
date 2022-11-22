import {Icon, Tree} from 'antd';

import React from 'react';
import '../../../../css/osService.css';

const iconTypeList = {
  'Object': 'codepen',
  'Base': 'appstore',
  'List': 'appstore'
};

const {TreeNode} = Tree;

export function handleTreeTitleOfBase(fieldName, typeName, bindInfo) {
  if (fieldName === undefined) {
   return (
     <div>
       <Icon type={iconTypeList.Base} className="icon" />
       {typeName}
       {bindInfo}
     </div>
   );
 }
  return (
    <div>
      <Icon type={iconTypeList.Base} className="icon" />
      {fieldName}
      {typeName !== undefined && `(${typeName})`}
      {bindInfo}
    </div>
  );
}

export function handleTreeTitleOfObject(className, fieldName) {
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

export function handleTreeTitleOfList(fieldName, memberType, bindInfo) {
  if (!memberType) {
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
      {bindInfo}
    </div>
  );
}

function noAlias(alias) {
  return alias === null || alias === '' || alias === undefined;
}

function getBindInformation(paramBindingList, key, isSingle) {
  let bindInfo;
  if (paramBindingList.length === 0) bindInfo = undefined;
  else if (isSingle) {
      bindInfo = paramBindingList.length > 0 ? paramBindingList[0].from.fullFieldName || '' : undefined;
    } else {
      const binding = paramBindingList.find((item) => item.target.fieldKey === key);
      if (binding === undefined) {
        bindInfo = undefined;
      } else {
        bindInfo = binding.from.fullFieldName || '';
      }
    }
  return bindInfo === undefined ? '' : (
    <>
      <Icon type="check-circle" style={{color: 'green', marginLeft: '10px'}} />
      <span style={{color: 'green', marginLeft: '10px'}}>{bindInfo}</span>
    </>
  );
}

export function renderTreeNode (path, type, fieldName, fieldKey, isDisable = true, paramBindingList = []) {
  if (!type) return (<></>);
  const optionDot = path === '' ? '' : '.';
  switch (type.name) {
    case 'Object':
      return (
        <TreeNode
          title={handleTreeTitleOfObject(type.className, fieldName)}
          key={path + type.className}
          disabled={isDisable}
        >
          {type.fields.map(
            (item, index) => (
              renderTreeNode(`${path}${optionDot}${item.name}`,
                item.type, noAlias(item.alias) ? item.name : item.alias,
                item.key, isDisable, paramBindingList)
            )
          )}
        </TreeNode>
      );
    case 'List':
      return (
        <TreeNode title={handleTreeTitleOfList(fieldName, type.memberType || undefined, getBindInformation(paramBindingList, fieldKey, false))} key={`${fieldKey},${path}`} />
      );
    default:
      return (
        <TreeNode
          title={handleTreeTitleOfBase(fieldName, type.name, getBindInformation(paramBindingList, fieldKey, false))}
          key={`${fieldKey},${path}`}
        />
      );
  }
}

export function renderNode (path, type, isDisable = true, paramBindingList = []) {
  if (type === null || type === undefined) return null;
  switch (type.name) {
    case 'Object':
      return renderTreeNode(path, type, undefined, undefined, isDisable, paramBindingList);
    case 'List':
      return (
        <TreeNode title={handleTreeTitleOfList(undefined, type.memberType, getBindInformation(paramBindingList, undefined, true))} key="Base" />
      );
    default:
      return (
        <TreeNode
          title={handleTreeTitleOfBase(undefined, type.name, getBindInformation(paramBindingList, undefined, true))}
          key="Base"
        />
      );
  }
}

export default {
  renderTreeNode,
  renderNode
};
