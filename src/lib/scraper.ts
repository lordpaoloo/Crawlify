interface ScrapeResult {
  text: string;
  href?: string;
  src?: string;
  alt?: string;
}

export class ScraperError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ScraperError';
  }
}

export async function scrapeWebsite(url: string, selector: string, maxResults: number): Promise<ScrapeResult[]> {
  try {
    // Use a CORS proxy to fetch the content
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new ScraperError(`Failed to fetch URL: ${response.statusText}`);
    }

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const elements = Array.from(doc.querySelectorAll(selector));
    const results: ScrapeResult[] = elements
      .slice(0, maxResults)
      .map(element => ({
        text: element.textContent?.trim() || '',
        href: element instanceof HTMLAnchorElement ? element.href : undefined,
        src: element instanceof HTMLImageElement ? element.src : undefined,
        alt: element instanceof HTMLImageElement ? element.alt : undefined,
      }));

    if (results.length === 0) {
      throw new ScraperError('No elements found matching the selector');
    }

    return results;
  } catch (error) {
    if (error instanceof ScraperError) {
      throw error;
    }
    throw new ScraperError(error instanceof Error ? error.message : 'Unknown error occurred');
  }
}