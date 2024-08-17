import puppeteer from "puppeteer";
import { googleSearch } from "./functionality/search";
import { crawlUrls } from "./functionality/scrape";
import { CrawlingSession } from "./types";

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  // Do your google search
  const results = await googleSearch({
    page,
    searchTerm: "jackals",
    ignoreResults: ["google.com", "youtube.com", "wikipedia"],
    numPages: 1,
  });
  // Scrape your recursion
  const finalResults: CrawlingSession[] = [];
  for (const url of results.urls) {
    try {
      const drillThru = await crawlUrls(page, url, 0, 0, [
        "google.com",
        "youtube.com",
        "wikipedia",
      ]);
      finalResults.push({ mainUrl: url, results: drillThru });
    } catch (error) {
      console.error(`Error processing URL: ${url}: ${error}`);
    }
  }

  browser.close();
})();
