const MAX_MESSAGES = 100; // 32k can handle up to 280 messages
const ratio = 140;

export const tokensToMessages = (tokens: number) => {
  let value = tokens / ratio;
  if (value > MAX_MESSAGES) {
    value = MAX_MESSAGES;
  }
  return Math.round(value);
};
