const axios = require("axios");
const { OPENAI_API_KEY } = require("./config");

async function analyzeWithGPT(textContent) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "Extract all technical keywords from the given text and provide their frequency count in JSON format.",
          },
          {
            role: "user",
            content: textContent,
          },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(
      "Error calling OpenAI API:",
      error.response?.data || error.message
    );
    return null;
  }
}

module.exports = { analyzeWithGPT };
