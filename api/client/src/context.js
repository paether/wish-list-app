import { createContext, useState } from "react";
const AdminContext = createContext();
const AuthorizedContext = createContext();
const WishListIdContext = createContext();
const LanguageContext = createContext();
const LoadingContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [wishListId, setWishListId] = useState(localStorage.getItem("listId"));
  const [language, setLanguage] = useState(
    JSON.parse(localStorage.getItem("language")) || "en"
  );
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AdminContext.Provider value={[isAdmin, setIsAdmin]}>
      <AuthorizedContext.Provider value={[isAuthorized, setIsAuthorized]}>
        <WishListIdContext.Provider value={[wishListId, setWishListId]}>
          <LanguageContext.Provider value={[language, setLanguage]}>
            <LoadingContext.Provider value={[isLoading, setIsLoading]}>
              {children}
            </LoadingContext.Provider>
          </LanguageContext.Provider>
        </WishListIdContext.Provider>
      </AuthorizedContext.Provider>
    </AdminContext.Provider>
  );
};

export {
  AdminContext,
  AuthorizedContext,
  WishListIdContext,
  LanguageContext,
  LoadingContext,
};
