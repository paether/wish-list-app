import "./App.css";
import { useState, useEffect } from "react";
import * as FireBase from "./firebase";
import useQueryURL from "./hooks/useQueryURL";
import CreateWishList from "./components/CreateWishList";
import WishListMenu from "./components/WishListMenu";

function App() {
  const [wishList, setWishList] = useState();
  const [userId, setUserId] = useState();
  const [wishListId, setWishListId] = useQueryURL("listId");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [storage, setStorage] = useState(
    JSON.parse(localStorage.getItem("authorizedListIds")) || []
  );

  useEffect(() => {
    localStorage.setItem("authorizedListIds", JSON.stringify(storage));
  }, [storage]);

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
    setWishListId(wishListId);
    setIsAuthorized(true);
    addListIdToLocalStorage(wishListId);
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-ring">
          {/* these empty divs are required for the loading animation */}
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="loading-text">Loading..</div>
      </div>
    );
  } else {
    return (
      <div className="App">
        {wishList && userId ? (
          <WishListMenu
            wishList={wishList}
            wishListId={wishListId}
            isAuthorized={isAuthorized}
            onSetIsAuthorized={setIsAuthorized}
            localStorage={storage}
            onSetLocalStorage={addListIdToLocalStorage}
          />
        ) : (
          <CreateWishList onCreation={onWhishListCreation} userId={userId} />
        )}
      </div>
    );
  }
}

export default App;
