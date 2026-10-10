export async function onRequest() {
  const feedUrl = "https://feeds.bbci.co.uk/news/world/rss.xml";

  try {
    const response = await fetch(feedUrl);

    if (!response.ok) {
      return new Response("Unable to retrieve BBC news.", {
        status: 502
      });
    }

    const xml = await response.text();

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=300",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch {
    return new Response("Unable to retrieve BBC news.", {
      status: 502
    });
  }
}
