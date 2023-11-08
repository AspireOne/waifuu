import { OpenAIEmbeddings } from "langchain/embeddings/openai";

const openAiEmbeddings = new OpenAIEmbeddings({
  stripNewLines: true,
});

export { openAiEmbeddings };
