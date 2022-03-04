import {
  streamWishListItems,
  updateWishListItemName,
  deleteWishListItem,
  updateWishListItemStatus,
  updateWishListStatus,
} from "../firebase";

import React, { useEffect, useState } from "react";

export default function ListItems({ wishListId }) {
  const [wishListItems, setWishListItems] = useState([]);

  useEffect(() => {
    const subscribe = streamWishListItems(wishListId, (querySnapshot) => {
      const updatedWishListItems = querySnapshot.docs.map((docSnapshot) => {
        return docSnapshot.data();
      });
      setWishListItems(updatedWishListItems);
    });
    return subscribe;
  }, [wishListId, setWishListItems]);

  return (
    <div className="list-items-container">
      <button
        onClick={() => navigator.clipboard.writeText(window.location.href)}
      >
        copy link
      </button>
      <button onClick={() => updateWishListStatus(wishListId, true)}>
        lock
      </button>
      {wishListItems.map((listItem) => {
        return (
          <div key={listItem.id} className="list-item">
            {listItem.name}
            <button onClick={() => deleteWishListItem(wishListId, listItem.id)}>
              delete
            </button>
            <button
              onClick={() =>
                updateWishListItemName(wishListId, listItem.id, "updated")
              }
            >
              update
            </button>
            <button
              onClick={() =>
                updateWishListItemStatus(wishListId, listItem.id, true)
              }
            >
              update
            </button>
          </div>
        );
      })}
    </div>
  );
}
