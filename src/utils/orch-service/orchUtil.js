import types from '../../constants/descriptor';
import {
convertNodeTypeMap, reverseNodeTypeMap
} from '../../constants/nodeType';

export const repeatNode = (nodes, id) => {
  const nodeIds = nodes.map((o) => o.id);
  return nodeIds.indexOf(id) <= -1;
};

export const generateUUID = () => {
  let d = new Date().getTime();
  if (window.performance && typeof window.performance.now === 'function') {
    d += performance.now(); // use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    // eslint-disable-next-line no-mixed-operators,no-bitwise
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    // eslint-disable-next-line no-mixed-operators,no-bitwise
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
};

/**
 * 从descriptor转换为后端需要的数据类型
 * @param child
 * @returns {{name, alias: *, type: {name: string, className, fields: *}, key: string}|{name, alias: *, type: {name}, key: string}}
 */
export const convertField = (child) => {
  let field;
  switch (child.type) {
    case 'Object':
      field = {
        key: child.key || generateUUID(),
        name: child.name,
        alias: child.alias,
        type: {
          name: types.OBJECT,
          className: child.className,
          fields: child.children.map((item) => convertField(item)),
        }
      };
      break;
    default:
      field = {
        key: child.key || generateUUID(),
        name: child.name,
        alias: child.alias,
        type: {
          name: child.type
        }
      };
  }
  return field;
};

export const convertDescriptor = (des) => {
  let res;
  switch (des.type) {
    case 'Object':
      res = {
        className: des.className,
        fields: des.children.map((item) => convertField(item)),
        name: types.OBJECT
      };
      break;
    default:
      res = {
        name: des.type,
      };
  }
  return res;
};

/**
 * 判断某一field中是否包含key为fieldKey和path为fullFieldName的元素
 * @param field
 * @param path
 * @param fieldKey
 * @param fullFieldName
 * @returns {boolean}
 */
export const findField = (field, path, fieldKey, fullFieldName) => {
  switch (field.type.name) {
    case 'Object':
      path = path === '' ? field.name : `${path}.${field.name}`;
      if (field.key === fieldKey && path !== fullFieldName) {
        return false;
      }
      if (field.key === fieldKey && path === fullFieldName) {
        return true;
      }
      let flag = false;
      field.type.fields.forEach((item) => {
        if (findField(item, path, fieldKey, fullFieldName)) flag = true;
      });
      return flag;
    default:
      path = path === '' ? field.name : `${path}.${field.name}`;
      if (field.key === fieldKey && path !== fullFieldName) {
        return false;
      }
      if (field.key === fieldKey && path === fullFieldName) {
        return true;
      }
  }
  return false;
};

/**
 * 从后端数据类型转换为descriptor需要的数据类型
 * @param field
 * @returns {{children: *[], name, alias: (*|string), className: string, type, key}}
 */
export const reconvertField = (field) => {
  let child;
  switch (field.type.name) {
    case types.OBJECT:
      child = {
        key: field.key,
        type: field.type.name,
        alias: field.alias || '',
        className: field.type.className || '',
        name: field.name,
        children: field.type.fields.map((item) => reconvertField(item)),
      };
      break;
    default:
      child = {
        key: field.key,
        type: field.type.name,
        alias: field.alias || '',
        name: field.name || '',
        className: '',
        children: []
      };
  }
  return child;
};

export const reconvertDescriptor = (tp) => {
  let res;
  switch (tp.name) {
    case types.OBJECT:
      res = {
        className: tp.className,
        children: tp.fields.map((item) => reconvertField(item)),
        type: tp.name,
      };
      break;
    default:
      res = {
        type: tp.name,
        alias: null,
        className: null,
        name: null,
        children: []
      };
  }
  return res;
};

export const convertNodeType = (type) => convertNodeTypeMap[type];

export const reverseNodeType = (type) => reverseNodeTypeMap[type];

export const getChildKeys = (child) => {
  const keys = [child.key];
  switch (child.type) {
    case 'Object':
      keys.concat(child.children.map((item) => getChildKeys(item)).flat(Infinity));
      break;
    default:
  }
  return keys;
};

export const getKeys = (des) => {
  switch (des.type) {
    case 'Object':
      return des.children.map((item) => getChildKeys(item)).flat(Infinity);
    default:
      return [];
  }
};

/* 将后端数据格式转为graph中的格式 */
export const reverseGraph = (processTopology) => {
  if (processTopology === null) return null;
  const nodes = processTopology.nodes.map((item) => ({type: reverseNodeType(item.nodeType), ...item}));
  return {
    nodes,
    edges: processTopology.links.map((link) => ({
      sourceNodeId: link.sourceId,
      targetNodeId: link.targetId,
      type: 'polyline'
    }))
  };
};

/* 将graph中的格式转为后端数据格式 */
export const convertGraph = (processTopology) => {
  processTopology.nodes = processTopology.nodes.filter((item) => item.id !== '0');
  processTopology.nodes = processTopology.nodes.map((item) => ({nodeType: convertNodeType(item.type), ...item}));
  return ({
    nodes: processTopology.nodes.filter((item) => item.id !== '0'),
    links: processTopology.edges.map((edge) => ({
      sourceId: edge.sourceNodeId,
      targetId: edge.targetNodeId,
    }))
  });
};

export default {
  repeatNode,
  convertDescriptor,
  convertNodeType,
  reconvertDescriptor,
  reconvertField,
  reverseGraph,
  convertGraph
};
