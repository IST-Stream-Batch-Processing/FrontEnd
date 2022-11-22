import { api, dataHandler } from '../utils/http';
import {instance} from './mock/guiInstance';

const guiURL = '/guiApi';

const getLayoutsByProjectId = (id) => api.get(`${guiURL}/layout/project/${id}`).then(dataHandler);

const getFrontLayoutsByProjectId = (id) => api.get(`${guiURL}/layout/project/${id}/at_front_page`).then(dataHandler);

const getSingleLayout = (id) => api.get(`${guiURL}/layout/${id}`).then(dataHandler);

const createLayout = (data) => api.post(`${guiURL}/layout`, data).then(dataHandler);

const updateLayout = (data) => api.put(`${guiURL}/layout`, data).then(dataHandler);

const deleteLayout = (id) => api.delete(`${guiURL}/layout/${id}`).then(dataHandler);

const getInstance = (id, data) => api.post(`${guiURL}/layout/${id}/instance`, data).then(dataHandler);

export {
    getLayoutsByProjectId,
    getSingleLayout,
    createLayout,
    updateLayout,
    deleteLayout,
    getInstance,
    getFrontLayoutsByProjectId
};
