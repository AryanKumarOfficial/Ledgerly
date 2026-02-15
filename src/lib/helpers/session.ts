import crypto from "crypto";

export const generateToken = () => {
  return crypto.randomBytes(32).toString("base64url");
};

export const sessionExpiry = (days: number = 7) => {
  return new Date(Date.now() + 24 * 60 * 60 * 1_000 * days);
};

export const tokenExpiryMinutes = (minutes: number = 15) => {
  return new Date(Date.now() + 60 * 1_000 * minutes);
};
export const tokenExpiryHours = (hours: number = 3) => {
  return new Date(Date.now() + 60 * 60 * 1_000 * hours);
};
