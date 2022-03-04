import AddlistItem from "./AddListItem";
import ListItems from "./ListItems";
import bcrypt from "bcryptjs";
import { getWishList } from "../firebase";
import { useEffect } from "react";
import "./WishListMenu.css";

export default function WishListMenu({
  wishList,
  wishListId,
  isAuthorized,
  onSetIsAuthorized,
  localStorage,
  onSetLocalStorage,
  isLoading,
}) {
  useEffect(() => {
    const idInStorage = localStorage.find((id) => id === wishListId);
    if (idInStorage) {
      onSetIsAuthorized(true);
    }
  }, []);

  const checkPasswordAndId = async (e) => {
    e.preventDefault();
    const wishListDoc = await getWishList(wishListId);
    if (!wishListDoc) {
      console.log("cannot find list by ID!");
      return;
    }
    if (
      bcrypt.compareSync(
        document.getElementById("secret_key").value,
        wishListDoc.data().secretKey
      )
    ) {
      onSetIsAuthorized(true);
      onSetLocalStorage(wishListId);
      return;
    }
    console.log("the provided password is not good!");
  };

  if (!isAuthorized) {
    return (
      <div className="not-authorized-container">
        <form>
          <input
            type="password"
            name="item_desc"
            id="secret_key"
            placeholder="provide password.."
          />
          <div>you need to provide a password for this list to access it!</div>
          <button onClick={checkPasswordAndId}>check password</button>
        </form>
      </div>
    );
  } else {
    return (
      <div className="wish-list-menu-container">
        <h1>Welcome to the list:</h1>
        <div className="list-name">{wishList.listName}</div>
        <AddlistItem wishListId={wishListId} />
        <ListItems wishListId={wishListId} />
      </div>
    );
  }
}
