import crypto from "crypto";

export function generatePKCE() {
  const code_verifier = crypto.randomBytes(32).toString("base64url");

  const hash = crypto.createHash("sha256").update(code_verifier).digest();

  const code_challenge = hash.toString("base64url");

  return {
    code_verifier,
    code_challenge,
  };
}
