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
}

export async function googleSearch({
  page,
  searchTerm,
  ignoreResults,
}: GoogleSearchParams): Promise<GoogleSearchResults> {
  // await
  await page.goto(`https://www.google.com/search?q=${searchTerm}`);
  const bodyText = await page.evaluate(() => {
    return document.body.innerText;
  });
  const availableUrls = await page.evaluate(() => {
    const aTags = Array.from(document.querySelectorAll("a")).map(
      (anchor) => anchor.href
    );
    return aTags;
  });
  const filteredUrls = filterResults(availableUrls, ignoreResults);

  return { urls: filteredUrls, fullText: bodyText };
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
