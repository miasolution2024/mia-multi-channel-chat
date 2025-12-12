import crypto from "crypto";

export function redirectToFrontend(res: any, frontendBaseUrl: string): void {
  const redirectUrl = `${frontendBaseUrl}/admin/content/omni_channels`;
  res.redirect(redirectUrl);
}

export function redirectToErrorPage(
  res: any,
  frontendBaseUrl: string,
  logId: string
): void {
  const redirectUrl = logId
    ? `${frontendBaseUrl}/admin/content/integration_logs/${logId}`
    : `${frontendBaseUrl}/admin/content/integration_logs`;
  res.redirect(redirectUrl);
}

export function generatePKCE() {
  const code_verifier = crypto.randomBytes(32).toString("base64url");

  const hash = crypto.createHash("sha256").update(code_verifier).digest();

  const code_challenge = hash.toString("base64url");

  return {
    code_verifier,
    code_challenge,
  };
}
