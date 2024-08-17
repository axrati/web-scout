# Web Scout

```typescript
import { SearchSession } from "./functionality/session";

(async () => {
  const sxt = new SearchSession();
  sxt.init({ headless: true, ocr: false });

  const searchResults = await sxt.search({
    searchTerm: "What is the cost of healthcare in CT?",
    ignoreResults: ["google.com", "youtube.com", "wikipedia.com"],
    recursion: 0,
  });

  console.log(searchResults); // [...{mainUrl,results:[...{url,text}]}]
})();
```

<br></br>

# It's that easy.

#### No more messy web-crawlers.

- Ignore results that match patterns with the `ignoreResults` parameter.
- Set how deep you drill for sub-urls crawling with `recursion`.

<br></br>
Get your data and get out.
<br></br>

## Process data via DOM or OCR

Enable ocr and read through the saved files

```typescript
import { SearchSession } from "./functionality/session";

(async () => {
  const sxt = new SearchSession();
  sxt.init({ headless: true, ocr: true });

  const searchResults = await sxt.search({
    searchTerm: "What is the cost of healthcare in CT?",
    ignoreResults: ["google.com", "youtube.com", "wikipedia.com"],
    recursion: 0,
  });

  await sxt.files((fileData) => {
    // Do-something
    console.log("File data:", fileData);
  });

  await sxt.save(); // Path of your choice
})();
```
