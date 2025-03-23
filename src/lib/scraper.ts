interface ScrapeResult {
  text: string;
}

interface GroupedScrapeResults {
  [selector: string]: ScrapeResult[];
}

export class ScraperError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ScraperError';
  }
}

export async function scrapeWebsite(
  url: string,
  selectors: string[],
  maxResults: number
): Promise<GroupedScrapeResults> {
  try {
    if (!selectors || selectors.length === 0) {
      throw new ScraperError('No selectors provided');
    }

    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new ScraperError(`Failed to fetch URL: ${response.statusText}`);
    }

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const results: GroupedScrapeResults = {};
    
    // Process each selector independently
    for (const selector of selectors) {
      results[selector] = [];
      try {
        const elements = Array.from(doc.querySelectorAll(selector));
        
        for (const element of elements) {
          if (results[selector].length >= maxResults) break;

          const text = element.textContent?.trim() || '';
          if (text) {
            results[selector].push({ text });
          }
        }
      } catch (selectorError) {
        console.warn(`Error processing selector "${selector}":`, selectorError);
      }
    }

    const totalResults = Object.values(results).reduce((sum, arr) => sum + arr.length, 0);
    if (totalResults === 0) {
      throw new ScraperError('No elements found matching any of the selectors');
    }

    return results;
  } catch (error) {
    if (error instanceof ScraperError) {
      throw error;
    }
    throw new ScraperError(error instanceof Error ? error.message : 'Unknown error occurred');
  }
}