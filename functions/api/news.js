export async function onRequest() {
  const feedUrl = "https://feeds.bbci.co.uk/news/world/rss.xml";

  try {
    const response = await fetch(feedUrl);

    if (!response.ok) {
      return new Response("The news provider returned an error.", {
        status: 502
      });
    }

    const xml = await response.text();

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=300"
      }
    });
  } catch {
    return new Response("Unable to retrieve the news feed.", {
      status: 502
    });
  }
}
