import {
    api, dataHandler, generalApi
} from '../utils/http';

const dataUrl = '/dataApi';
const getData = () => api.get(`${dataUrl}/data_info`).then(dataHandler);

const getDetailData = () => api.get(`${dataUrl}/data_info/detail_descriptor`).then(dataHandler);

const getTableInfo = (id) => api.get(`${dataUrl}/data_info/${id}`).then(dataHandler);

const getTableDescriptor = (id) => api.get(`${dataUrl}/data_info/${id}/detail_descriptor`).then(dataHandler);

const newData = (data) => api.post(`${dataUrl}/data_info`, data).then(dataHandler);

const publish = (id) => api.put(`${dataUrl}/data_info/${id}/publish`).then(dataHandler);

const unpublish = (id) => api.put(`${dataUrl}/data_info/${id}/unpublish`).then(dataHandler);

const deleteDataModel = (id) => api.delete(`${dataUrl}/data_info/${id}`).then(dataHandler);

const updateTable = (id, data) => api.put(`${dataUrl}/data_info/${id}`, data).then(dataHandler);

const getDateItem = (id) => api.get(`${dataUrl}/data_item/${id}`).then(dataHandler);

const newDataItem = (id, data) => api.post(`${dataUrl}/data_item/${id}`, data).then(dataHandler);

// 错误时返回error而非触发errorHandler
const generalNewDataItem = (id, data) => generalApi.post(`${dataUrl}/data_item/${id}`, data).then(dataHandler).catch((e) => 'error');

const updateDataItem = (id, data) => api.put(`${dataUrl}/data_item/${id}`, data).then(dataHandler);

const generalUpdateDataItem = (id, data) => generalApi.put(`${dataUrl}/data_item/${id}`, data).then(dataHandler).catch((e) => 'error');

const getRelation = (tid, id, name) => api.get(`${dataUrl}/data_item/${tid}/relation/${id}/${name}`).then(dataHandler);

const deleteDataItem = (id, data) => api.delete(`${dataUrl}/data_item/${id}`, {params: {itemIds: data}}).then(dataHandler);

const generalDeleteDataItem = (id, data) => generalApi.delete(`${dataUrl}/data_item/${id}`, {params: {itemIds: data}}).then(dataHandler).catch((e) => 'error');

const getDisplay = (id) => api.get(`${dataUrl}/data_item/${id}/display`).then(dataHandler);

const getModel = (id) => api.get(`${dataUrl}/data_item/${id}/model`).then(dataHandler);

const conditionQuery = (data) => api.post(`${dataUrl}/data_item/query`, data).then(dataHandler);

export {
    getData, newData, publish, unpublish, getDateItem, newDataItem, generalNewDataItem, deleteDataItem, generalDeleteDataItem, getDetailData,
    getRelation, getTableInfo, updateDataItem, generalUpdateDataItem, getDisplay, getModel, conditionQuery, deleteDataModel,
    updateTable, getTableDescriptor
};
