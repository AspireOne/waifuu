import crypto from "crypto";

export const hmacEncode = (body: any) => {
  const nonce = crypto.randomBytes(8).toString("hex");
  const timestamp = Math.floor(Date.now() / 1000).toString();

  const msg = nonce + timestamp;
  console.log(msg);

  // Create the HMAC signature
  const signature = crypto
    .createHmac("sha256", process.env.NEXT_PUBLIC_HMAC_SHARED_KEY!)
    .update(msg)
    .digest("base64");

  return {
    headers: {
      "X-Signature": signature,
      "X-Nonce": nonce,
      "X-Timestamp": timestamp,
    },
  };
};
