import {api, dataHandler} from '../utils/http';

const streamURL = '/streamApi';

const getAllModelData = () => api.get(`${streamURL}/data`).then(dataHandler);

const createModelData = (data) => api.post(`${streamURL}/data`, data).then(dataHandler);

const deleteModelData = (id) => api.delete(`${streamURL}/data/${id}`).then(dataHandler);

const getSingleModelData = (id) => api.get(`${streamURL}/data/${id}`).then(dataHandler);

const updateModelData = (data) => api.put(`${streamURL}/data`, data).then(dataHandler);

const getAllServiceData = () => api.get(`${streamURL}/operator`).then(dataHandler);

const deleteServiceData = (id) => api.delete(`${streamURL}/operator/${id}`).then(dataHandler);

const getSingleServiceData = (id) => api.get(`${streamURL}/operator/${id}`).then(dataHandler);

export {
    getAllModelData,
    createModelData,
    deleteModelData,
    getSingleModelData,
    updateModelData,
    getAllServiceData,
    deleteServiceData,
    getSingleServiceData
};
