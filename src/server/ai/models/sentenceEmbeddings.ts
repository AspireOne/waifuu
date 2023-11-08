import { HuggingFaceInferenceEmbeddings } from "langchain/dist/embeddings/hf";

export const sentenceEmbeddings = new HuggingFaceInferenceEmbeddings({
  model: "sentence-transformers/paraphrase-MiniLM-L6-v2",
});
