import {api, dataHandler} from '../utils/http';

const userUrl = '/userApi';

const register = (data) => api.post(`${userUrl}/register?username=${data.username}&password=${data.password}`).then(dataHandler);

const login = (data) => api.post(`${userUrl}/login?username=${data.username}&password=${data.password}`).then(dataHandler);

export {
    register,
    login,
};
