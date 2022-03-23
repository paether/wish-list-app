import "./App.css";
import { useState, useEffect, useCallback } from "react";
import {
  AdminContext,
  AuthorizedContext,
  WishListIdContext,
  LanguageContext,
} from "./context";
import CreateWishList from "./pages/CreateWishList";
import Header from "./pages/Header";
import Footer from "./pages/Footer";
import Home from "./pages/Home";
import Loading from "./pages/Loading";
import OpenList from "./pages/OpenList";
import WishListMenu from "./components/WishListMenu";
import { Routes, Route, BrowserRouter } from "react-router-dom";

function App() {
  const [wishListId, setWishListId] = useState(
    new URLSearchParams(window.location.search).get("listId")
  );
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState(
    JSON.parse(localStorage.getItem("language")) || "en"
  );

  useEffect(() => {
    localStorage.setItem("language", JSON.stringify(language));
  }, [language]);

  const onWhishListCreation = useCallback((wishListId, token) => {
    setIsloading(true);
    localStorage.setItem("token", token);
    setWishListId(wishListId);
    setIsAuthorized(true);
    setIsAdmin(true);
    setIsloading(false);
  }, []);

  return (
    <BrowserRouter>
      <AdminContext.Provider value={[isAdmin, setIsAdmin]}>
        <AuthorizedContext.Provider value={[isAuthorized, setIsAuthorized]}>
          <WishListIdContext.Provider value={[wishListId, setWishListId]}>
            <LanguageContext.Provider value={[language, setLanguage]}>
              <Header />
              <Routes>
                <Route
                  path="/wish-list-app"
                  element={<Home {...{ language, isLoading }} />}
                />
                <Route
                  path="/wish-list-app/create"
                  element={
                    <CreateWishList {...{ isLoading, onWhishListCreation }} />
                  }
                />
                <Route
                  path="/wish-list-app/wishList"
                  element={
                    wishListId && !isLoading ? (
                      <WishListMenu
                        {...{
                          isLoading,
                        }}
                      />
                    ) : isLoading ? (
                      <Loading />
                    ) : (
                      <OpenList />
                    )
                  }
                />
              </Routes>
              <Footer />
            </LanguageContext.Provider>
          </WishListIdContext.Provider>
        </AuthorizedContext.Provider>
      </AdminContext.Provider>
    </BrowserRouter>
  );
}

export default App;
