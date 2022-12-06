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

const createMCService = (data) => api.post(`${streamURL}/mapConstruct`, data).then(dataHandler);
const createATService = (data) => api.post(`${streamURL}/ascendingTimeStamp`, data).then(dataHandler);
const createFDCOService = (data) => api.post(`${streamURL}/filterDataClassOne`, data).then(dataHandler);
const createKBDCService = (data) => api.post(`${streamURL}/keyByDataClass`, data).then(dataHandler);
const createTWService = (data) => api.post(`${streamURL}/timeWindow`, data).then(dataHandler);

const getAllCombinationData = () => api.get(`${streamURL}/combination`).then(dataHandler);
const createCombination = (id) => api.post(`${streamURL}/combination/${id}`).then(dataHandler);
const deleteCombination = (id) => api.delete(`${streamURL}/combination/${id}`).then(dataHandler);

export {
    getAllModelData,
    createModelData,
    deleteModelData,
    getSingleModelData,
    updateModelData,
    getAllServiceData,
    deleteServiceData,
    getSingleServiceData,
    createMCService,
    createATService,
    createFDCOService,
    createKBDCService,
    createTWService,
    getAllCombinationData,
    createCombination,
    deleteCombination
};
