import Papa from 'papaparse';
import { ScrapingTask } from './db';

export function exportToCSV(task: ScrapingTask): string {
  const csvData = task.results.map(result => ({
    url: task.url,
    selector: task.selector,
    content: result.text,
    href: result.href || '',
    src: result.src || '',
    alt: result.alt || '',
    timestamp: task.updatedAt.toISOString(),
  }));

  return Papa.unparse(csvData, {
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
  link.setAttribute('download', `scrape-${task.id}-${new Date().toISOString()}.csv`);
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}