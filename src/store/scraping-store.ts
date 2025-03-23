import { create } from 'zustand';
import { ScrapingTask, dbOperations } from '../lib/db';

interface ScrapingStore {
  tasks: ScrapingTask[];
  currentTask: ScrapingTask | null;
  setTasks: (tasks: ScrapingTask[]) => void;
  addTask: (task: ScrapingTask) => void;
  updateTask: (taskId: string, updates: Partial<ScrapingTask>) => void;
  setCurrentTask: (task: ScrapingTask | null) => void;
  loadTasksFromDB: () => Promise<void>;
  deleteTask: (taskId: string) => void;
}

export const useScrapingStore = create<ScrapingStore>((set) => ({
  tasks: [],
  currentTask: null,
  setTasks: (tasks) => set({ tasks }),
  addTask: async (task) => {
    await dbOperations.addTask(task);
    set((state) => ({ tasks: [...state.tasks, task] }));
  },
  updateTask: async (taskId, updates) => {
    await dbOperations.updateTask(taskId, updates);
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      ),
    }));
  },
  setCurrentTask: (task) => set({ currentTask: task }),
  loadTasksFromDB: async () => {
    const tasks = await dbOperations.getAllTasks();
    set({ tasks });
  },
  deleteTask: async (taskId) => {
    await dbOperations.deleteTask(taskId);
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    }));
  },
}));