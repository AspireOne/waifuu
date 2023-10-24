import { OpenAI } from "langchain/llms/openai";

/**
 * LLM to use with FixingOutputParser (which parses and fixes output if necesary).
 * @param user
 * @constructor
 */
export function FixingOutputParserModel(user: string) {
  return new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-3.5-turbo",
    temperature: 0.05,
    user: user,
  });
}
