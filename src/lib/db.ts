import { openDB } from 'idb';

export interface ScrapingTask {
  id: string;
  url: string;
  selector: string;
  maxResults: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  results: any[];
  createdAt: Date;
  updatedAt: Date;
  error?: string;
}

const DB_NAME = 'web-scraper-db';
const STORE_NAME = 'scraping-tasks';

export const initDB = async () => {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      const store = db.createObjectStore(STORE_NAME, {
        keyPath: 'id',
      });
      store.createIndex('createdAt', 'createdAt');
      store.createIndex('status', 'status');
    },
  });
  return db;
};

export const dbOperations = {
  async getAllTasks() {
    const db = await initDB();
    return await db.getAll(STORE_NAME);
  },

  async addTask(task: ScrapingTask) {
    const db = await initDB();
    await db.add(STORE_NAME, task);
  },

  async updateTask(taskId: string, updates: Partial<ScrapingTask>) {
    const db = await initDB();
    const task = await db.get(STORE_NAME, taskId);
    if (task) {
      await db.put(STORE_NAME, { ...task, ...updates });
    }
  }
};