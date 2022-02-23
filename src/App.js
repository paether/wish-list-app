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

  useEffect(() => {
    (async function fetchData() {
      try {
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
      } catch (error) {
        console.log(error);
      }
    })();
  }, [wishListId, setWishListId]);

  function onWhishListCreation(wishListId) {
    setWishListId(wishListId);
  }

  if (wishList && userId) {
    console.log(wishList);
    return <WishListMenu wishList={wishList} wishListId={wishListId} />;
  }

  return (
    <div className="App">
      <CreateWishList onCreation={onWhishListCreation} userId={userId} />
    </div>
  );
}

export default App;
