import { OpenAI } from "langchain/llms/openai";

const outputFixer = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4o-mini",
  temperature: 0.1,
});

export { outputFixer };
