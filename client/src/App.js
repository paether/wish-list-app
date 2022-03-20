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
import { Routes, Route, HashRouter, BrowserRouter } from "react-router-dom";
let listName;

function App() {
  // const [wishList, setWishList] = useState();
  //const [userId, setUserId] = useState();
  const [wishListId, setWishListId] = useQueryURL("listId");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  // const [localAdminSessionId, setLocalAdminSessionId] = useState("");
  // const [localSessionId, setLocalSessionId] = useState("");
  const [error, setError] = useState(null);

  const [language, setLanguage] = useState(
    JSON.parse(localStorage.getItem("language")) || "en"
  );

  useEffect(() => {
    localStorage.setItem("language", JSON.stringify(language));
  }, [language]);

  useEffect(() => {
    (async function fetchData() {})();
  }, [wishListId, setWishListId]);

  // const addListIdToLocalStorage = (listId, sessionId, adminSessionId) => {
  //   let storage = JSON.parse(localStorage.getItem("authorization")) || [];
  //   storage = [...storage, { listId, sessionId, adminSessionId }];
  //   localStorage.setItem("authorization", JSON.stringify(storage));
  // };

  // const updateSessionData = (wishListId, isAdmin) => {
  //   let adminSessionId = "";
  //   if (isAdmin) {
  //     adminSessionId = uniqid();
  //     setLocalAdminSessionId(adminSessionId);
  //   }
  //   const sessionId = uniqid();
  //   setLocalSessionId(sessionId);
  //   addListIdToLocalStorage(wishListId, sessionId, adminSessionId);
  // };

  const onWhishListCreation = async (wishListId, token) => {
    setIsloading(true);
    localStorage.setItem("token", token);
    setWishListId(wishListId, "/wish-list-app/wishList");
    setIsAuthorized(true);
    setIsAdmin(true, setIsloading(false));
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
            wishListId !== null ? (
              <WishListMenu
                {...{
                  // localSessionId,
                  // updateSessionData,
                  // localAdminSessionId,
                  language,
                  //  wishList,
                  wishListId,
                  isAuthorized,
                  setIsAuthorized,
                  isAdmin,
                  setIsAdmin,
                  //  addListIdToLocalStorage,
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
                  // wishList,
                  setIsAuthorized,
                  // updateSessionData,
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
