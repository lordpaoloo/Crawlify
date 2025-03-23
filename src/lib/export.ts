import Papa from 'papaparse';
import { ScrapingTask } from './db';

export function exportToCSV(task: ScrapingTask): string {
  // Get all selectors
  const selectors = task.selectors;
  
  // Create a map to store results by index
  const resultsByIndex: { [key: string]: any }[] = [];
  
  // Initialize with base data
  const maxLength = Math.max(...Object.values(task.results).map(arr => arr.length));
  
  // Initialize rows
  for (let i = 0; i < maxLength; i++) {
    resultsByIndex[i] = {
      timestamp: task.updatedAt.toISOString(),
      url: task.url
    };
    
    // Initialize each selector's column with empty value
    selectors.forEach(selector => {
      resultsByIndex[i][selector] = '';
    });
  }
  
  // Fill in the data
  selectors.forEach(selector => {
    const selectorResults = task.results[selector] || [];
    selectorResults.forEach((result, index) => {
      if (index < maxLength) {
        resultsByIndex[index][selector] = result.text || '';
      }
    });
  });

  return Papa.unparse(resultsByIndex, {
    quotes: true,
    header: true,
  });
}

export function downloadCSV(task: ScrapingTask) {
  const csv = exportToCSV(task);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `crawlify-${task.id}-${new Date().toISOString()}.csv`);
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}