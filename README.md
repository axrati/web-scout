# Web Scout

```typescript
import { SearchSession } from "./functionality/session";

(async () => {
  const scout = new SearchSession();
  scout.init({ headless: true, ocr: false });

  const searchResults = await scout.search({
    searchTerm: "What is the cost of healthcare in CT?",
    ignoreResults: ["google.com", "youtube.com", "wikipedia.com"],
    recursion: 0,
    numPages: 1,
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
  const scout = new SearchSession();
  scout.init({ headless: true, ocr: true });

  const searchResults = await scout.search({
    searchTerm: "What is the cost of healthcare in CT?",
    ignoreResults: ["google.com", "youtube.com", "wikipedia.com"],
    recursion: 0,
    numPages: 3,
  });

  await scout.files((fileData) => {
    // Do-something
    console.log("File data:", fileData);
  });

  await scout.save(); // Path of your choice
})();
```

<br></br>

# Docker

Edit the Dockerfile however you want.

`docker build . -t web-scout`
<br></br>
`docker run -dit --name web-scout web-scout`
