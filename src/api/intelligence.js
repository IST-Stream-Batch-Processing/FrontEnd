import {
    api, dataHandler
} from '../utils/http';

const intelligenceUrl = '/intelligenceApi';

const getAllDataSets = () => api.get(`${intelligenceUrl}/dataSet`).then(dataHandler);

const uploadDataSet = (data) => api.post(`${intelligenceUrl}/dataSet`, data).then(dataHandler);

const updateDataSet = (id, data) => api.put(`${intelligenceUrl}/dataSet/${id}`, data).then(dataHandler);

const deleteDataSet = (id) => api.delete(`${intelligenceUrl}/dataSet/${id}`).then(dataHandler);

const getAllIntelServices = () => api.get(`${intelligenceUrl}/intelligence-service`).then(dataHandler);

const getIntelServiceById = (id) => api.get(`${intelligenceUrl}/intelligence-service/${id}`).then(dataHandler);

const createIntelService = (data) => api.post(`${intelligenceUrl}/intelligence-service`, data).then(dataHandler);

const updateIntelService = (data) => api.put(`${intelligenceUrl}/intelligence-service`, data).then(dataHandler);

const deleteIntelService = (id) => api.delete(`${intelligenceUrl}/intelligence-service/${id}`).then(dataHandler);

const publishIntelService = (id, version) => api.put(`${intelligenceUrl}/intelligence-service/${id}/publish/${version}`).then(dataHandler);

const unPublishIntelService = (id) => api.put(`${intelligenceUrl}/intelligence-service/${id}/unpublish`).then(dataHandler);

const getTrainInstances = (id) => api.get(`${intelligenceUrl}/intelligence-service/${id}/instance`).then(dataHandler);

const intelServiceFirstTrain = (serviceId, dataSetId, params) => api.post(`${intelligenceUrl}/intelligence-service/${serviceId}/instance/data/${dataSetId}`, params).then(dataHandler);

const intelServiceTrain = (id, dataSetId, params) => api.post(`${intelligenceUrl}/intelligence-service/instance/${id}/data/${dataSetId}`, params).then(dataHandler);

export {
    getAllDataSets, uploadDataSet, updateDataSet, deleteDataSet, getAllIntelServices, createIntelService,
    updateIntelService, deleteIntelService, publishIntelService, unPublishIntelService, getIntelServiceById,
    getTrainInstances, intelServiceFirstTrain, intelServiceTrain
};
