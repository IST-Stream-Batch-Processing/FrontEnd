import {decode} from 'jsonwebtoken';
import history from './history';

const setToken = (token) => localStorage.setItem('token', token);
const getToken = () => localStorage.getItem('token');
const getUserId = (token) => decode(token).aud;
const getUsername = (token) => JSON.parse(decode(token).userFields).username;
const getPositionId = (token) => JSON.parse(decode(token).userFields).positionId;
const getPositionName = (token) => JSON.parse(decode(token).userFields).positionName;
const getDepartmentId = (token) => JSON.parse(decode(token).userFields).departmentId;
const getDepartmentName = (token) => JSON.parse(decode(token).userFields).departmentName;
const setProjectId = (id) => localStorage.setItem('projectId', id);
const getProjectId = () => localStorage.getItem('projectId');
const setTableId = (id) => localStorage.setItem('tableId', id);
const getTableId = () => localStorage.getItem('tableId');
// 获得用户的所有角色，返回是一个数组
const getRoles = (token) => {
  if (token === null) history.push('/login');
  return decode(token).roles;
};
const clearToken = () => localStorage.removeItem('token');
const getCurrentUserId = () => getUserId(getToken());
export {
  setTableId,
  getTableId,
  setToken,
  getToken,
  getUserId,
  getUsername,
  getRoles,
  clearToken,
  getCurrentUserId,
  setProjectId,
  getProjectId,
  getPositionId,
  getPositionName,
  getDepartmentName,
  getDepartmentId
};
