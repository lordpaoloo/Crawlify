export interface ScrapingTask {
  id: string;
  name: string;
  url: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
  targetSelectors?: string[];
  schedule?: string;
  lastRunAt?: Date;
  error?: string;
  data?: Record<string, any>;
}

export interface ScrapedData {
  id: string;
  taskId: string;
  timestamp: Date;
  data: Record<string, any>;
}