import "./App.css";
import { useState, useEffect } from "react";
import useQueryURL from "./hooks/useQueryURL";
import CreateWishList from "./pages/CreateWishList";
import Header from "./pages/Header";
import Footer from "./pages/Footer";
import Home from "./pages/Home";
import Loading from "./pages/Loading";
import OpenList from "./pages/OpenList";
import WishListMenu from "./components/WishListMenu";
import axios from "axios";
import { Routes, Route, BrowserRouter } from "react-router-dom";
let listName;

function App() {
  //const [wishListId, setWishListId] = useQueryURL("listId");
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

  const onWhishListCreation = (wishListId, token) => {
    setIsloading(true);
    localStorage.setItem("token", token);
    ///setWishListId(wishListId, "/wish-list-app/wishList");
    setWishListId(wishListId);
    setIsAuthorized(true);
    setIsAdmin(true);
    setIsloading(false);
  };

  return (
    <BrowserRouter>
      <Header wishListId={wishListId} />
      <Routes>
        <Route
          path="/wish-list-app"
          element={<Home {...{ wishListId, language, isLoading }} />}
        />
        <Route
          path="/wish-list-app/create"
          element={
            <CreateWishList {...{ isLoading, onWhishListCreation, language }} />
          }
        />
        <Route
          path="/wish-list-app/wishList"
          element={
            wishListId && !isLoading ? (
              <WishListMenu
                {...{
                  language,
                  wishListId,
                  isAuthorized,
                  setIsAuthorized,
                  isAdmin,
                  setIsAdmin,
                  isLoading,
                }}
              />
            ) : isLoading ? (
              <Loading {...{ error, language }} />
            ) : (
              <OpenList
                {...{
                  setIsAdmin,
                  language,
                  setIsAuthorized,
                  setWishListId,
                }}
              />
            )
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
