import {dataHandler, api, generalApi} from '../utils/http';

const osUrl = '/osApi';

const getOSServices = () => api.get(`${osUrl}/orchestration`).then(dataHandler);

const createOSService = (data) => api.post(`${osUrl}/orchestration`, data).then(dataHandler);

const updateOSService = (id, data) => api.put(`${osUrl}/orchestration/${id}`, data).then(dataHandler);

const deleteOSService = (id) => api.delete(`${osUrl}/orchestration/${id}`).then(dataHandler);

const getOSServiceDetailById = (id) => api.get(`${osUrl}/orchestration/${id}`).then(dataHandler);

const getOSServiceInstanceByServiceId = (serviceId) => api.get(`${osUrl}/orchestration/${serviceId}/instance`).then(dataHandler);

const invokeOSService = (serviceId, data) => api.post(`${osUrl}/orchestration/${serviceId}/instance/sync`, data).then(dataHandler);

const generalInvokeOSService = (serviceId, data) => generalApi.post(`${osUrl}/orchestration/${serviceId}/instance/sync`, data).then(dataHandler).catch((e) => 'error');

const getOSServiceInstanceById = (serviceId, instanceId) => api.get(`${osUrl}/orchestration/${serviceId}/instance/${instanceId}`).then(dataHandler);

export {
  getOSServices,
  createOSService,
  deleteOSService,
  getOSServiceInstanceByServiceId,
  invokeOSService,
  generalInvokeOSService,
  getOSServiceDetailById,
  getOSServiceInstanceById,
  updateOSService
};
