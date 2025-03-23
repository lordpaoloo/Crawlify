import axios from 'axios';
import type { ScrapingTask } from '../types';

const API_URL = 'http://localhost:3000/api';

export async function startScraping(task: ScrapingTask) {
  const response = await axios.post(`${API_URL}/scrape`, {
    name: task.name,
    url: task.url,
    targetSelectors: task.targetSelectors,
  });
  
  return response.data;
}

export async function checkHealth() {
  try {
    const response = await axios.get(`${API_URL}/health`);
    return response.data.status === 'ok';
  } catch (error) {
    return false;
  }
}