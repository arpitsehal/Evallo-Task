import axios from 'axios';

const API_URL = 'http://localhost:3001/logs';

export const getLogs = async (filters) => {
  const params = {};
  if (filters.level && filters.level.length) params.level = filters.level.join(',');
  if (filters.message) params.message = filters.message;
  if (filters.resourceId) params.resourceId = filters.resourceId;
  if (filters.timestamp_start) params.timestamp_start = filters.timestamp_start;
  if (filters.timestamp_end) params.timestamp_end = filters.timestamp_end;
  // Add more filters as needed
  return axios.get(API_URL, { params }).then(res => res.data);
};

export const postLog = async (log) => {
  return axios.post(API_URL, log).then(res => res.data);
};

export const deleteLog = async (id) => {
  return axios.delete(`${API_URL}/${id}`).then(res => res.data);
};

export const clearAllLogs = async () => {
  return axios.delete(API_URL).then(res => res.data);
}; 