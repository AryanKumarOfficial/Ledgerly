import { User } from "@/types/user.type";

export const getSanitizeUser = (user: User) => {
  const { password, ...safeUser } = user;
  return safeUser;
};
