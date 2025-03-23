const express = require("express");
const { scrapeTextContent } = require("./src/scraper");
const { analyzeWithGPT } = require("./src/jd-parser/analyzeJD");
const { PORT } = require("./src/config");
const resumeParserRoutes = require("./src/resume-parser/resumeParser"); // Import resume parser routes
const path = require("path");

const app = express();

// Middleware
app.use(express.json());

// Serve static files (e.g., HTML)
app.use(express.static(path.join(__dirname, "public")));

// Use resume parser routes
app.use("/api/resume", resumeParserRoutes); // Mount resume parser routes under '/api/resume'

app.get("/analyzeJD", async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) {
      return res.status(400).json({ error: "URL parameter is required" });
    }

    console.log(`Scraping content from: ${url}`);
    const textContent = await scrapeTextContent(url);

    console.log("Sending text to OpenAI for analysis...");
    const keywordAnalysis = await analyzeWithGPT(textContent);

    if (!keywordAnalysis) {
      return res.status(500).json({ error: "Failed to analyze text" });
    }

    res.json({ keywords: JSON.parse(keywordAnalysis) });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred", details: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
