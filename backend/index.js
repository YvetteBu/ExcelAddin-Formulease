import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fetch from 'node-fetch';
import { AbortController } from 'abort-controller';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));

app.post('/api/gpt', async (req, res) => {
  console.time("total-gpt-endpoint");
  const { prompt } = req.body;
  console.log("[/api/gpt] Received prompt:", prompt);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 seconds

    console.time("openai-response");
    console.time("fetch-start");
    console.log("About to call OpenAI API...");
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
      }),
      signal: controller.signal
    });
    console.timeEnd("fetch-start");
    console.log("response.status:", response.status);
    console.log("response.ok:", response.ok);
    clearTimeout(timeout);
    console.log("OpenAI API call finished.");

    const data = await response.json();
    console.timeEnd("total-gpt-endpoint");
    res.json(data);
  } catch (err) {
    console.error(err);
    if (err.name === 'AbortError') {
      console.log("Fetch request was aborted due to timeout.");
    }
    res.status(500).json({ error: err.name === 'AbortError' ? "Request timeout" : "OpenAI API call failed" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
