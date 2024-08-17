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
import fs from "fs";
import path from "path";

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
  numPages: number;
}

export class SearchSession {
  public browser: Browser | null;
  private ocr: boolean;
  private active: boolean;
  public results: CrawlingSession[];
  constructor() {
    this.browser = null;
    this.ocr = false;
    this.active = false;
    this.results = [];
  }

  public async init({ headless = true, ocr = false }: SessionStartProps) {
    this.browser = await puppeteer.launch({ headless });
    this.active = true;
  }

  public async search({
    searchTerm,
    ignoreResults,
    recursion = 0,
    numPages = 1,
  }: searchProps): Promise<CrawlingSession[]> {
    if (!this.active) {
      throw Error("Activate your session with .init() first.");
    }
    const page = await this.browser?.newPage();
    if (page) {
      const results = await googleSearch({
        page,
        searchTerm,
        ignoreResults,
        numPages,
      });
      // Scrape your recursion
      const finalResults: CrawlingSession[] = [];
      for (const url of results.urls) {
        try {
          if (!ignoreResults.some((substring) => url.includes(substring))) {
            const drillThru = await crawlUrls(
              page,
              url,
              0,
              recursion,
              ignoreResults
            );
            this.results.push({ mainUrl: url, results: drillThru });
            finalResults.push({ mainUrl: url, results: drillThru });
          }
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

  public async save(filePath: string = "results.json"): Promise<void> {
    try {
      const fullPath = path.resolve(filePath);
      const data = JSON.stringify(this.results, null, 2); // Convert results to JSON format
      await fs.promises.writeFile(fullPath, data, "utf-8");
      console.log(`Results saved to ${fullPath}`);
    } catch (error) {
      console.error(`Failed to save results: ${error}`);
    }
  }

  public async files(callback: (fileData: Buffer) => void): Promise<void> {
    const imgsDir = path.join(__dirname, "imgs");

    // Ensure the directory exists
    if (!fs.existsSync(imgsDir)) {
      throw new Error("The ./imgs directory does not exist.");
    }
    // Read all png files in the imgs directory
    const files = fs
      .readdirSync("imgs")
      .filter((file) => file.endsWith(".png"));

    // Filter only .png files and process each one
    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join("imgs", file);
        const fileData = fs.readFileSync(filePath);
        await callback(fileData);
      })
    );
  }
}
