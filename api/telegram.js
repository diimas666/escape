const ALLOWED_HOSTS = ["escape-webshop.com", "vercel.app", "localhost"];

function isAllowedRequest(req) {
  const candidates = [req.headers.origin, req.headers.referer].filter(Boolean);

  if (!candidates.length) {
    return false;
  }

  return candidates.some((value) => {
    try {
      const host = new URL(value).hostname;
      return ALLOWED_HOSTS.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
    } catch {
      return false;
    }
  });
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  if (!isAllowedRequest(req)) {
    return res.status(403).json({ ok: false, error: "Forbidden" });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return res.status(500).json({ ok: false, error: "Server is not configured" });
  }

  const text = req.body?.text;

  if (typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ ok: false, error: "Message is required" });
  }

  if (text.length > 4000) {
    return res.status(400).json({ ok: false, error: "Message is too long" });
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text.trim(),
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      console.error("Telegram API error:", data);
      return res.status(502).json({ ok: false, error: "Failed to send message" });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Telegram proxy error:", error);
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
};
