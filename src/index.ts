import { SearchSession } from "./functionality/session";

(async () => {
  const scout = new SearchSession();
  await scout.init({ headless: true, ocr: false });

  const searchResults = await scout.search({
    searchTerm: "CT Decorations",
    ignoreResults: [
      "google",
      "youtube",
      "wikipedia",
      "github",
      "facebook",
      "party",
    ],
    recursion: 1,
    numPages: 1,
  });

  await scout.save();
  await scout.close();
  console.log(scout.results);
  process.exit(0);
})();
