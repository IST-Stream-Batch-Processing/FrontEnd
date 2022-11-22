import {api, dataHandler} from '../utils/http';

const userUrl = '/userApi';

const createPosition = (data) => api.post(`${userUrl}/position`, data).then(dataHandler);

const updatePosition = (data) => api.put(`${userUrl}/position`, data).then(dataHandler);

const getPositionList = () => api.get(`${userUrl}/position`).then(dataHandler);

const deletePosition = (id) => api.delete(`${userUrl}/position/${id}`).then(dataHandler);

export {
  createPosition,
  getPositionList,
  deletePosition,
  updatePosition
};
