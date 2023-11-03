import { franc } from "franc-min";
import stopword from "stopword";
import tokenizer from "wink-tokenizer";
import lemmatizer from "lemmatizer";
import removeAccents from "remove-accents";

type DataPurpose =
  | "long-term-memory-augmentation"
  | "short-term-memory-augmentation";

// - Lemmatize
// - Remove stop words
// - lowercase
// - remove diacritics
// - remove punctuation
// - keyword extraction? Based on type of text?
// TODO: Test this function.
function preProcess(text: string): string {
  // Tokenization
  const tokens: string[] = new tokenizer()
    .tokenize(text)
    .map((t) => t.value.toLowerCase());

  console.log("=>(vectorDb.ts:19) tokens", tokens);

  // Remove punctuation
  const noPunct: string[] = tokens.filter((t) => !/['".,!?;:]/.test(t));
  console.log("=>(vectorDb.ts:24) noPunct", noPunct);

  // Remove diacritics
  const noDiacritics: string[] = noPunct.map((t) => removeAccents(t));
  console.log("=>(vectorDb.ts:28) noDiacritics", noDiacritics);

  // Remove stop words. This is language dependent so we use 'franc' library here to guess the language.
  // We default to English('eng') if 'franc' can't guess the language.
  const lang = franc(text) || "eng";
  // @ts-ignore
  const stopWords = stopword[lang];
  const noStop: string[] = noDiacritics.filter((t) => !stopWords.includes(t));
  console.log("=>(vectorDb.ts:36) noStop", noStop);

  // Lemmatization. This is language dependent and 'lemmatizer' only supports English.
  // So we only lemmatize if the language is guessed as English.
  // TODO: Support other langs.
  const lemmas = lang === "eng" ? noStop.map((t) => lemmatizer(t)) : noStop;
  console.log("=>(vectorDb.ts:42) lemmas", lemmas);
  const lemmasJoined = lemmas.join(" ");
  console.log("=>(vectorDb.ts:44) lemmasJoined", lemmasJoined);

  return lemmasJoined;
}

export type { DataPurpose };

export { preProcess };
