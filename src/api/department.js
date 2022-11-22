import {api, dataHandler} from '../utils/http';

const userUrl = '/userApi';

const createDepartment = (data) => api.post(`${userUrl}/department`, data).then(dataHandler);

const updateDepartment = (data) => api.put(`${userUrl}/department`, data).then(dataHandler);

const getDepartmentList = () => api.get(`${userUrl}/department`).then(dataHandler);

const getDepartmentTree = () => api.get(`${userUrl}/department/level`).then(dataHandler);

const getDepartmentUser = (id) => api.get(`${userUrl}/department/${id}/user`).then(dataHandler);

const deleteDepartment = (id) => api.delete(`${userUrl}/department/${id}`).then(dataHandler);

export {
  createDepartment,
  getDepartmentList,
  getDepartmentTree,
  getDepartmentUser,
  deleteDepartment,
  updateDepartment
};
