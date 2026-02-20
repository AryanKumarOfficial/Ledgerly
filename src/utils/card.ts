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
