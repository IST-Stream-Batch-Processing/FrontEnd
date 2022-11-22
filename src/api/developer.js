import {dataHandler, api, generalApi} from '../utils/http';

const asUrl = '/asApi';

const uploadCode = (data) => api.post(`${asUrl}/source_code`, data).then(dataHandler);
const getAllAS = () => api.get(`${asUrl}/as`).then(dataHandler);
const deleteAS = (id) => api.delete(`${asUrl}/as/${id}`).then(dataHandler);
const updateAS = (data, id) => api.put(`${asUrl}/as/${id}`, data).then(dataHandler);
const getInstances = (id) => api.get(`${asUrl}/as/${id}/instance`).then(dataHandler);
// 分别是运行服务和获取服务输出
const invokeASService = (id, data) => api.post(`${asUrl}/as/${id}/instance`, data).then(dataHandler);
const getInstance = (serviceId, instanceId) => api.get(`${asUrl}/as/${serviceId}/instance/${instanceId}`).then(dataHandler);
const invokeASServiceSync = (id, data) => api.post(`${asUrl}/as/${id}/instance/sync`, data).then(dataHandler);
const generalInvokeASServiceSync = (id, data) => generalApi.post(`${asUrl}/as/${id}/instance/sync`, data).then(dataHandler).catch((e) => 'error');

export {
    uploadCode,
    getAllAS,
    deleteAS,
    updateAS,
    getInstances,
    invokeASService,
    getInstance,
    invokeASServiceSync,
    generalInvokeASServiceSync
};
