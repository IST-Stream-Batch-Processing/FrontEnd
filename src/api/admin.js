import {api, dataHandler} from '../utils/http';

const userUrl = '/userApi';

const getUsers = () => api.get(`${userUrl}/user`).then(dataHandler);

const authorize = (id, roles) => api.put(`${userUrl}/user/${id}/role`, roles).then(dataHandler);

const allocate = (id, departments) => api.put(`${userUrl}/user/${id}/department`, departments).then(dataHandler);

const assign = (id, positions) => api.put(`${userUrl}/user/${id}/position`, positions).then(dataHandler);

const deallocate = (id, department) => api.put(`${userUrl}/user/${id}/department/deallocation`, department).then(dataHandler);

const unassign = (id, position) => api.put(`${userUrl}/user/${id}/position/unassignment`, position).then(dataHandler);

export {
    getUsers,
    authorize,
    allocate,
    assign,
    deallocate,
    unassign
};
