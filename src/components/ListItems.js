import { streamWishListItems } from "../firebase";

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
      {wishListItems.map((listItem) => {
        return (
          <div key={listItem.id} className="list-item">
            {listItem.name}
          </div>
        );
      })}
    </div>
  );
}
