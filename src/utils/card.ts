import { systemEnv } from "@/env";
import crypto from "crypto";
export const detectCardNetwork = (CIN: string) => {
  const number = sanitizeCardNumber(CIN);
  const length = number.length;
  const first1 = number.slice(0, 1);
  const first2 = parseInt(number.slice(0, 2));
  const first3 = parseInt(number.slice(0, 3));
  const first4 = parseInt(number.slice(0, 4));
  if (first1 === "4" && [13, 16, 19].includes(length)) {
    return "Visa";
  }
  if (
    ((first2 >= 51 && first2 <= 55) || (first4 >= 2221 && first4 <= 2720)) &&
    length === 16
  ) {
    return "MasterCard";
  }
  if ((first2 === 34 || first2 === 37) && length === 15) {
    return "American Express";
  }

  if (
    (first4 === 6011 || first2 === 65 || (first3 >= 644 && first3 <= 649)) &&
    length === 16
  ) {
    return "Discover";
  }
  if (
    ((first3 >= 300 && first3 <= 305) || first2 === 36 || first2 === 38) &&
    length === 14
  ) {
    return "Diners Club";
  }
  if (
    (first2 === 60 ||
      first2 === 65 ||
      first2 === 81 ||
      first2 === 82 ||
      first3 === 508) &&
    length === 16
  ) {
    return "RuPay";
  }
  return "Unknown Card Network";
};

export const sanitizeCardNumber = (CIN: string) => {
  return CIN.replace(/\D/g, "");
};
export const generateMaskedCardNumber = (CIN: string) => {
  return CIN.slice(-4);
};

export class CardSecurity {
  private static algorithm = "aes-256-cbc";
  private static key = systemEnv.cardEncryptionKey;
  private static ivLength = 16;
  public static encryptCard(CIN: string) {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv(
      this.algorithm,
      Buffer.from(this.key),
      iv,
    );
    let encrypted = cipher.update(CIN);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
  }

  public static decryptCard(encryptedCard: string) {
    const parts = encryptedCard.split(":");
    const iv = Buffer.from(parts.shift()!, "hex");
    const encryptedText = Buffer.from(parts.join(":"), "hex");
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      Buffer.from(this.key),
      iv,
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}

const encrypted = CardSecurity.encryptCard("5334670043961776");

console.log(`ENcryption....`);

console.log(encrypted);
const decrypted = CardSecurity.decryptCard(encrypted);

console.log(decrypted);
