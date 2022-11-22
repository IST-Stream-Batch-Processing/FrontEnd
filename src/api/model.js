import { api, dataHandler } from '../utils/http';

const intelligenceUrl = '/intelligenceApi';

const getModels = () => api.get(`${intelligenceUrl}/model`).then(dataHandler);

const newModel = (data) => api.post(`${intelligenceUrl}/model`, data).then(dataHandler);

const deleteModel = (id) => api.delete(`${intelligenceUrl}/model/${id}`).then(dataHandler);

const updateModel = (id, data) => api.put(`${intelligenceUrl}/model/${id}`, data).then(dataHandler);

export {
  getModels,
  newModel,
  deleteModel,
  updateModel
};
