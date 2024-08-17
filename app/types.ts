export interface GoogleSearchResults {
  urls: string[];
}

export interface CrawlResult {
  url: string;
  text: string;
}

export interface CrawlingSession {
  mainUrl: string;
  results: CrawlResult[];
}
