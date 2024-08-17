import { ChildProcess } from "child_process";
import puppeteer, {
  Browser,
  BrowserContext,
  BrowserContextOptions,
  DebugInfo,
  Page,
  Target,
} from "puppeteer";
import { GoogleSearchResults, CrawlResult } from "../types";

interface GoogleSearchParams {
  page: Page;
  searchTerm: string;
  ignoreResults: string[];
  numPages: number;
}

export async function googleSearch({
  page,
  searchTerm,
  ignoreResults,
  numPages,
}: GoogleSearchParams): Promise<GoogleSearchResults> {
  // await
  let finalUrls: string[] = [];
  for (let scanThru = 1; scanThru < numPages + 1; scanThru++) {
    const startingIdx = scanThru * 10;
    await page.goto(
      `https://www.google.com/search?q=${searchTerm}&start=${startingIdx}`
    );
    const availableUrls = await page.evaluate(() => {
      const aTags = Array.from(document.querySelectorAll("a")).map(
        (anchor) => anchor.href
      );
      return aTags;
    });
    const filteredUrls = filterResults(availableUrls, ignoreResults);
    finalUrls = Array.from(new Set([...filteredUrls, ...finalUrls]));
  }
  return { urls: finalUrls };
}

export function filterResults(results: string[], ignoreResults: string[]) {
  const regulars: string[] = [];
  results.forEach((e, i) => {
    const containsAny = ignoreResults.some((substring) =>
      e.includes(substring)
    );
    if (!containsAny) {
      if (e.includes("https://")) {
        regulars.push(e);
      }
    }
  });
  return Array.from(new Set(regulars));
}
