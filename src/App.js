import "./App.css";
import { useState, useEffect } from "react";
import * as FireBase from "./firebase";
import useQueryURL from "./hooks/useQueryURL";
import CreateWishList from "./pages/CreateWishList";
import Header from "./pages/Header";
import Footer from "./pages/Footer";
import Home from "./pages/Home";
import Loading from "./pages/Loading";
import OpenList from "./pages/OpenList";
import WishListMenu from "./components/WishListMenu";
import uniqid from "uniqid";
import { Routes, Route, HashRouter, BrowserRouter } from "react-router-dom";

function App() {
  const [wishList, setWishList] = useState();
  const [userId, setUserId] = useState();
  const [wishListId, setWishListId] = useQueryURL("listId");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [localAdminSessionId, setLocalAdminSessionId] = useState("");
  const [localSessionId, setLocalSessionId] = useState("");
  const [error, setError] = useState(null);

  const [language, setLanguage] = useState(
    JSON.parse(localStorage.getItem("language")) || "en"
  );

  useEffect(() => {
    localStorage.setItem("language", JSON.stringify(language));
  }, [language]);

  useEffect(() => {
    (async function fetchData() {
      try {
        setIsloading(true);
        const userCred = await FireBase.authenticateAnonymously();
        setUserId(userCred.user.uid);
        if (wishListId) {
          const returnedWishList = await FireBase.getWishList(wishListId);
          if (returnedWishList.data()) {
            setWishList(returnedWishList.data());
          } else {
            setError(
              "Cannot load this list. Please make sure the list ID is provided correctly!"
            );
          }
        }
        setIsloading(false);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [wishListId, setWishListId]);

  const addListIdToLocalStorage = (listId, sessionId, adminSessionId) => {
    let storage = JSON.parse(localStorage.getItem("authorization")) || [];
    storage = [...storage, { listId, sessionId, adminSessionId }];
    localStorage.setItem("authorization", JSON.stringify(storage));
  };

  const updateSessionData = (wishListId, isAdmin) => {
    let adminSessionId = "";
    if (isAdmin) {
      adminSessionId = uniqid();
      setLocalAdminSessionId(adminSessionId);
    }
    const sessionId = uniqid();
    setLocalSessionId(sessionId);
    addListIdToLocalStorage(wishListId, sessionId, adminSessionId);
  };

  const onWhishListCreation = (wishListId) => {
    setWishListId(wishListId, "/wish-list-app/wishList");
    setIsAuthorized(true);
    setIsAdmin(true);
    updateSessionData(wishListId);
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
            <CreateWishList
              {...{ isLoading, onWhishListCreation, userId, language }}
            />
          }
        />
        <Route
          path="/wish-list-app/wishList"
          element={
            wishList && userId && wishListId ? (
              <WishListMenu
                {...{
                  localSessionId,
                  updateSessionData,
                  localAdminSessionId,
                  language,
                  wishList,
                  wishListId,
                  isAuthorized,
                  setIsAuthorized,
                  isAdmin,
                  setIsAdmin,
                  addListIdToLocalStorage,
                  isLoading,
                }}
              />
            ) : wishListId ? (
              <Loading {...{ error, language }} />
            ) : (
              <OpenList
                {...{
                  setIsAdmin,
                  language,
                  setIsAuthorized,
                  updateSessionData,
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
