import { api, dataHandler } from '../utils/http';

const projectUrl = '/projectApi';
const getProjects = () => api.get(`${projectUrl}/project`).then(dataHandler);

const newProject = (data) => api.post(`${projectUrl}/project`, data).then(dataHandler);

export {
    getProjects,
    newProject
};
