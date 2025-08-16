var express=require("express");
var router=express.Router()
require('dotenv').config()
const {OpenAI} = require("openai");
const { HfInference } = require('@huggingface/inference');

const hf = new HfInference(process.env.OPEN_AI_SECRET_KEY);
router.post('/converse',async (req, res) => {
    const {message}=req.body
    console.log("Received message:", message);
    const conversationContextPrompt = "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How can I help you today?\nHuman: ";
     try {
        const response = await hf.textGeneration({
            model: 'gpt2',  // You can use other models available on Hugging Face
            inputs: conversationContextPrompt + message,
            parameters: {
              max_new_tokens: 150,
              temperature: 0.9,
              return_full_text: false,
            },
          });
          const generatedText = response.generated_text.trim();
          console.log("Generated text:", generatedText);
          const aiResponse = generatedText.split('AI:').pop().trim();
          console.log("AI response:",   aiResponse);
          res.send(aiResponse);
        } catch (error) {
          console.error('Error:', error);
          res.status(500).send("An error occurred while processing your request.");
        }
    
     
  });
module.exports=router