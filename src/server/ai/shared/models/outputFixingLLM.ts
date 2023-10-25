import { OpenAI } from "langchain/llms/openai";

const fixingLlm = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-3.5-turbo",
  temperature: 0.05,
});

export { fixingLlm };
