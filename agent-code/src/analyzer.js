const { callOpenAI } = require("./llmCaller");

async function analyzeWithGPT(textContent) {
  try {
    const systemMessage =
      "Extract all technical keywords from the given text and provide their frequency count in JSON format.";
    const response = await callOpenAI(systemMessage, textContent);
    return response;
  } catch (error) {
    console.error("Error analyzing text:", error.message);
    return null;
  }
}

module.exports = { analyzeWithGPT };
