import "./App.css";
import { useState, useEffect } from "react";
import * as FireBase from "./firebase";
import useQueryURL from "./hooks/useQueryURL";
import CreateWishList from "./components/CreateWishList";
import WishListMenu from "./components/WishListMenu";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Loading from "./components/Loading";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [wishList, setWishList] = useState();
  const [userId, setUserId] = useState();
  const [wishListId, setWishListId] = useQueryURL("listId");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsloading] = useState(false);

  const [storage, setStorage] = useState(
    JSON.parse(localStorage.getItem("authorizedListIds")) || []
  );
  const [language, setLanguage] = useState(
    JSON.parse(localStorage.getItem("language")) || "en"
  );

  useEffect(() => {
    localStorage.setItem("authorizedListIds", JSON.stringify(storage));
  }, [storage]);
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
          if (returnedWishList.exists) {
            setWishList(returnedWishList.data());
          } else {
            setWishListId();
          }
        }
        setIsloading(false);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [wishListId, setWishListId]);

  const addListIdToLocalStorage = (listId) => {
    setStorage((oldStorage) => [...oldStorage, listId]);
  };

  function onWhishListCreation(wishListId) {
    setWishListId(wishListId, "/wishList");
    setIsAuthorized(true);
    addListIdToLocalStorage(wishListId);
  }

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route
          path="/"
          element={<Home language={language} isLoading={isLoading} />}
        />
        <Route
          path="/create"
          element={
            <CreateWishList
              isLoading={isLoading}
              onCreation={onWhishListCreation}
              userId={userId}
              language={language}
            />
          }
        />
        <Route
          path="/wishList"
          element={
            wishList && userId ? (
              <WishListMenu
                isLoading={isLoading}
                language={language}
                wishList={wishList}
                userId={userId}
                wishListId={wishListId}
                isAuthorized={isAuthorized}
                onSetIsAuthorized={setIsAuthorized}
                localStorage={storage}
                onSetLocalStorage={addListIdToLocalStorage}
              />
            ) : (
              <Loading language={language} />
            )
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
