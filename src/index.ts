import { SearchSession } from "./functionality/session";

(async () => {
  const sxt = new SearchSession();
  sxt.init({ headless: true, ocr: false });

  const searchResults = await sxt.search({
    searchTerm: "What is the cost of healthcare in CT?",
    ignoreResults: ["google.com", "youtube.com", "wikipedia.com"],
    recursion: 0,
  });

  console.log(searchResults);
})();
