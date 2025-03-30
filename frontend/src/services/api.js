import axios from 'axios';
import config from '../config';

const api = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Client API calls
export const fetchClients = () => api.get('/clients/');
export const fetchClient = (id) => api.get(`/clients/${id}`);
export const createClient = (data) => api.post('/clients/', data);
export const updateClient = (id, data) => api.put(`/clients/${id}`, data);
export const deleteClient = (id) => api.delete(`/clients/${id}`);

// PDF Template API calls
export const fetchTemplates = () => api.get('/pdf-templates/');
export const fetchTemplate = (id) => api.get(`/pdf-templates/${id}`);
export const fetchTemplateFields = (id) => api.get(`/pdf-templates/${id}/fields`);
export const updateFieldMappings = (id, mappings) => api.put(`/pdf-templates/${id}/mappings`, { mappings });
export const deleteTemplate = (id) => api.delete(`/pdf-templates/${id}`);

export const createTemplate = (data) => {
  const formData = new FormData();
  formData.append('name', data.name);
  if (data.description) {
    formData.append('description', data.description);
  }
  formData.append('file', data.file);
  
  return api.post('/pdf-templates/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// PDF Generation
export const generatePDF = (data) => api.post('/generate-pdf/', data);
export const downloadGeneratedPDF = (id) => api.get(`/generate-pdf/${id}`, { responseType: 'blob' });

export default api; 