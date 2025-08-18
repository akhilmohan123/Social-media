var express = require("express");
var router = express.Router();
require("dotenv").config();
const { OpenAI } = require("openai");
const { HfInference } = require("@huggingface/inference");
const axios = require("axios");
// const hf = new HfInference(process.env.OPEN_AI_SECRET_KEY);
router.post("/converse", async (req, res) => {
  // console.log("KEY:", process.env.OPEN_AI_SECRET_KEY);
  // const { message } = req.body;
  // console.log("Received message:", message);
  // const conversationContextPrompt = "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How can I help you today?\nHuman: ";
  //  try {
  //     const response = await hf.textGeneration({
  //         model: 'tiiuae/falcon-7b-instruct',  // You can use other models available on Hugging Face
  //         inputs: conversationContextPrompt + message,
  //         parameters: {
  //           max_new_tokens: 150,
  //           temperature: 0.9,
  //           return_full_text: false,
  //         },
  //       });
  //       const generatedText = response.generated_text.trim();
  //       console.log("Generated text:", generatedText);
  //       const aiResponse = generatedText.split('AI:').pop().trim();
  //       console.log("AI response:",   aiResponse);
  //       res.send(aiResponse);
  //     } catch (error) {
  //       console.error('Error:', error);
  //       res.status(500).send("An error occurred while processing your request.");
  //     }
  // try {
  //   const openai = new OpenAI({
  //     apiKey: process.env.DEEPSEEK_AI_SECRET_KEY,
  //     baseURL: "https://api.deepseek.com/v1",
  //   });
  //   const response = await openai.chat.completions.create({
  //     model: "deepseek-chat",
  //     messages: [
  //       {
  //         role: "system",
  //         content: "You are an AI assistant.",
  //       },
  //       {
  //         role: "user",
  //         content: "Tell me a fun fact about space!",
  //       },
  //     ],
  //     temperature: 0.7,
  //     max_tokens: 150,
  //   });

  //   console.log("Response:", response.choices[0].message.content);
  // } catch (error) {
  //   console.error("Error:", error);
  //   res.status(500).send("An error occurred while processing your request.");
  // 
//  const API_KEY = process.env.DEEPSEEK_AI_SECRET_KEY;

// async function askDeepSeek(prompt) {
//   try {
//     const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${API_KEY}` // if your local server requires key
//       },
//       body: JSON.stringify({
//         model: "deepseek-chat", // or deepseek-coder
//         messages: [{ role: "user", content: prompt }],
//         max_tokens: 200
//       })
//     });

//     const data = await response.json();
//     console.log("Raw DeepSeek Response:", JSON.stringify(data, null, 2));

//     // safe check before accessing
//     if (data.choices && data.choices.length > 0) {
//       return data.choices[0].message.content;
//     } else {
//       return "No response from model.";
//     }

//   } catch (err) {
//     console.error("Error asking DeepSeek:", err);
//     return "Error in request.";
//   }
// }

// // Example usage
// askDeepSeek("Hello DeepSeek! Tell me a fun fact.").then(console.log);
});
module.exports = router;
