import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import puppeteer from 'puppeteer';

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// Validation schemas
const TaskSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  targetSelectors: z.array(z.string()),
});

// Start scraping task
app.post('/api/scrape', async (req, res) => {
  try {
    const task = TaskSchema.parse(req.body);
    
    const browser = await puppeteer.launch({
      headless: "new"
    });
    
    const page = await browser.newPage();
    
    // Set a user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    await page.goto(task.url, {
      waitUntil: 'networkidle0',
    });

    const results: Record<string, string> = {};

    for (const selector of task.targetSelectors) {
      try {
        const element = await page.$(selector);
        if (element) {
          const text = await page.evaluate(el => el.textContent, element);
          results[selector] = text?.trim() || '';
        }
      } catch (error) {
        console.error(`Error scraping selector ${selector}:`, error);
        results[selector] = `Error: Could not scrape ${selector}`;
      }
    }

    await browser.close();

    res.json({
      success: true,
      data: results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});