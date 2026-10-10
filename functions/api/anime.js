const ALLOWED_STYLES = [
  "smart",
  "cinematic",
  "dreamy",
  "dark",
  "watercolor",
  "retro"
];

export async function onRequestPost({ request, env }) {
  try {
    // Accept requests from this website only.
    const origin = request.headers.get("Origin");

    if (origin && origin !== new URL(request.url).origin) {
      return Response.json(
        { error: "Request not allowed." },
        { status: 403 }
      );
    }

    if (!env.AI) {
      return Response.json(
        { error: "AI binding is not configured." },
        { status: 503 }
      );
    }

    const body = await request.json();

    const title = String(body.title || "")
      .trim()
      .slice(0, 250);

    const style = ALLOWED_STYLES.includes(body.style)
      ? body.style
      : "smart";

    if (!title) {
      return Response.json(
        { error: "A news headline is required." },
        { status: 400 }
      );
    }

    const styles = {
      smart: "Choose a fitting anime illustration style for this news story",
      cinematic: "cinematic anime with dramatic lighting",
      dreamy: "dreamy pastel anime with soft colors",
      dark: "dark fantasy anime with atmospheric lighting",
      watercolor: "hand-painted watercolor anime",
      retro: "retro 1990s anime illustration"
    };

    const prompt = [
      "Create an original anime editorial illustration inspired by this news headline:",
      title,
      styles[style],
      "High-quality composition, expressive artwork, visually clear subject.",
      "Illustration only. No text, logos, watermarks, or fake news headlines.",
      "Do not depict real people as though the illustration were a real photograph."
    ].join(" ");

    const result = await env.AI.run(
      "@cf/black-forest-labs/flux-1-schnell",
      { prompt }
    );

    if (!result || !result.image) {
      throw new Error("The AI returned no image.");
    }

    return Response.json({
      image: `data:image/jpeg;base64,${result.image}`
    });

  } catch (error) {
    console.error("Anime image generation failed:", error);

    return Response.json(
      { error: "Image generation failed. Please try again later." },
      { status: 500 }
    );
  }
}
