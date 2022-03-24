import { createContext } from "react";

const AdminContext = createContext();
const AuthorizedContext = createContext();
const WishListIdContext = createContext();
const LanguageContext = createContext();
const LoadingContext = createContext();

export {
  AdminContext,
  AuthorizedContext,
  WishListIdContext,
  LanguageContext,
  LoadingContext,
};
