async function applyBlocking() {
  const res = await fetch(browser.runtime.getURL("patterns.txt"));
  const text = await res.text();
  const patterns = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));

  const urls = patterns.map((p) => `*://${p}/*`);
  if (!urls.length) return;

  browser.webRequest.onHeadersReceived.addListener(
    (details) => {
      const headers = details.responseHeaders || [];
      headers.push({
        name: "Content-Security-Policy",
        value: "script-src 'none'",
      });
      return { responseHeaders: headers };
    },
    { urls, types: ["main_frame", "sub_frame"] },
    ["blocking", "responseHeaders"]
  );
}

applyBlocking();
