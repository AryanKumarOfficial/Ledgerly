import crypto from "crypto";

export const generateSessionToken = () => {
  return crypto.randomBytes(32).toString("base64url");
};

export const sessionExpiry = (days: number = 7) => {
  return new Date(Date.now() + 24 * 60 * 60 * 1000 * days);
};
