import puppeteer, {
  Browser,
  BrowserContext,
  BrowserContextOptions,
  DebugInfo,
  Page,
  Target,
} from "puppeteer";
import { delay } from "./utils";
import { CrawlResult } from "../types";
import { url } from "inspector";

export async function crawlUrls(
  page: Page,
  currentUrl: string,
  depth: number,
  maxDepth: number,
  ignoreResults: string[],
  visitedUrls: Set<string> = new Set(),
  ocr: boolean = false,
  retryCount: number = 3
): Promise<CrawlResult[]> {
  if (
    depth > maxDepth ||
    visitedUrls.has(currentUrl) ||
    ignoreResults.some((substring) => currentUrl.includes(substring))
  ) {
    return [];
  }

  visitedUrls.add(currentUrl);
  console.log(`Crawling: ${currentUrl} at depth: ${depth}`);

  try {
    // Retry mechanism for navigation
    for (let attempt = 0; attempt < retryCount; attempt++) {
      try {
        // Introduce a delay before attempting navigation to avoid race conditions
        // await delay(1000);
        await page.goto(currentUrl, {
          waitUntil: "networkidle2",
          timeout: 60000,
        });
        // Introduce a delay for SPA's
        await delay(1000);
        if (ocr) {
          await page.screenshot({ path: `imgs/${url}.png`, fullPage: true });
        }
        break; // If successful, exit the retry loop
      } catch (error) {
        console.warn(
          `Attempt ${attempt + 1} to navigate to ${currentUrl} failed.`
        );
        if (attempt === retryCount - 1) throw error; // If all retries fail, throw the error
      }
    }

    // Get the text content of the body
    const bodyText = await page.evaluate(() => document.body.innerText);
    const results: CrawlResult[] = [{ url: currentUrl, text: bodyText }];

    // Get all <a> tags on the page and their href values
    const urls = await page.evaluate(
      () =>
        Array.from(document.querySelectorAll("a"))
          .map((anchor) => (anchor as HTMLAnchorElement).href)
          .filter((href) => href.startsWith("http")) // Ensure only valid URLs are included
    );

    // Recursively visit each URL using the same page
    for (const url of urls) {
      if (
        !Array.from(visitedUrls).includes(url) && // Dont visit pages you've already seen
        !ignoreResults.some((substring) => url.includes(substring)) // Dont visit pages that meet the ignoreResults pattern match
      ) {
        const nestedResults = await crawlUrls(
          page,
          url,
          depth + 1,
          maxDepth,
          ignoreResults,
          visitedUrls
        );
        results.push(...nestedResults);
      }
    }
    return results;
  } catch (error) {
    console.error(`Failed to crawl ${currentUrl}: ${error}`);
    return [];
  }
}
