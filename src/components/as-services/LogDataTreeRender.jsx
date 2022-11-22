import {Button, Tree} from 'antd';
import React from 'react';
import downloadFile from '../../utils/downloadFile';

const {TreeNode} = Tree;

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

function isArray(array) {
  return Object.prototype.toString.call(array) === '[object Array]';
}

function isString(str) {
  return Object.prototype.toString.call(str) === '[object String]';
}

function renderTitle(key, value, isUrl = false) {
  if (isUrl) {
    return (
      <span>
        {key ? `${key}:   ` : ''}
        <Button style={{marginLeft: 5}} size="small" shape="circle" ghost onClick={() => downloadFile(value)} icon="download" type="primary" />
      </span>
    );
  }
  return (
    <span>
      {key ? `${key}:   ` : ''}
      {`${value || 'null'}`}
    </span>
  );
}

export default function renderTree(path, data) {
  if (!data) return '';
  if (isObject(data)) {
    return Object.keys(data).map(key => {
      const value = data[key];
      if (value) path += value.toString();
      if (value && isObject(value)) {
        return <TreeNode title={key} key={path}>{renderTree(path, value)}</TreeNode>;
      }
      if (value && isArray(value)) {
        return (
          <TreeNode key={path} title={key}>
            {value.map((item, index) => <TreeNode key={path + index} title={index}>{renderTree(path + index, item)}</TreeNode>)}
          </TreeNode>
        );
      }
      if (value && isString(value) && value.indexOf('fileApi/file/') > -1) {
        return <TreeNode key={path} title={renderTitle(key, value, true)} />;
      }
      return <TreeNode key={path} title={renderTitle(key, value, false)} />;
    });
  }
  if (isArray(data)) {
    return (
      <TreeNode key={path} title="List">
        {data.map((item, index) => <TreeNode key={item + index} title={index}>{renderTree(path + index, item)}</TreeNode>)}
      </TreeNode>
    );
  }
  return <TreeNode key={path} title={renderTitle('', data.toString(), data.toString().indexOf('fileApi/file/') > -1)} />;
}
