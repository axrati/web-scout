import puppeteer, {
  Browser,
  BrowserContext,
  BrowserContextOptions,
  DebugInfo,
  Page,
  Target,
} from "puppeteer";

import { googleSearch } from "./search";
import { CrawlResult } from "../types";
import { crawlUrls } from "./scrape";
import { CrawlingSession } from "../types";

interface SessionStartProps {
  headless: boolean;
  ocr: boolean;
}

interface SessionProps {
  headless: boolean;
  searchTerm: string;
  ignoreResults: string[];
  ocr: boolean;
  recursion: number;
}

interface searchProps {
  searchTerm: string;
  ignoreResults: string[];
  recursion: number;
}

export class SearchSession {
  public browser: Browser | null;
  private ocr: boolean;
  private active: boolean;
  constructor() {
    this.browser = null;
    this.ocr = false;
    this.active = false;
  }

  public async init({ headless = true, ocr = false }: SessionStartProps) {
    this.browser = await puppeteer.launch({ headless });
    this.active = true;
  }

  public async search({
    searchTerm,
    ignoreResults,
    recursion = 0,
  }: searchProps): Promise<CrawlingSession[]> {
    if (!this.active) {
      throw Error("Activate your session with .init() first.");
    }
    const page = await this.browser?.newPage();
    if (page) {
      const results = await googleSearch({ page, searchTerm, ignoreResults });
      // Scrape your recursion
      const finalResults: CrawlingSession[] = [];
      for (const url of results.urls) {
        try {
          const drillThru = await crawlUrls(page, url, 0, recursion);
          finalResults.push({ mainUrl: url, results: drillThru });
        } catch (error) {
          console.error(`Error processing URL: ${url}: ${error}`);
        }
      }
      return finalResults;
    } else {
      return [];
    }
  }

  public async close() {
    this.browser?.close;
  }
}
