import axios from 'axios';

const apiInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
});

// Page Configuration endpoints
export const getPages = () => apiInstance.get('/pages');
export const getPage = (id) => apiInstance.get(`/pages/${id}`);
export const createPage = (pageData) => apiInstance.post('/pages', pageData);
export const updatePage = (id, pageData) => apiInstance.put(`/pages/${id}`, pageData);
export const deletePage = (id) => apiInstance.delete(`/pages/${id}`);

// Dynamic Data endpoints
export const getData = (tableName, page = 1, limit = 10) => {
    return apiInstance.get(`/data/${tableName}`, {
        params: { page, limit }
    });
};
export const createData = (tableName, data) => apiInstance.post(`/data/${tableName}`, data);
export const updateData = (tableName, id, data) => apiInstance.put(`/data/${tableName}/${id}`, data);
export const deleteData = (tableName, id) => apiInstance.delete(`/data/${tableName}/${id}`);

