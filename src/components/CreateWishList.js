import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState } from "react";
import {
  createWishList as createWishListFirabase,
  getWishLists,
} from "../firebase";

export default function CreateWishList({ onCreation, userId }) {
  const createWishList = async (e) => {
    e.preventDefault();
    const listName = document.getElementById("list_name").value;
    const secretKey = document.getElementById("secret_key").value;
    const docref = await createWishListFirabase(userId, listName, secretKey);
    onCreation(docref.id);
  };

  const test = async (e) => {
    e.preventDefault();
    const wishListsRef = getWishLists();
    const q = query(wishListsRef, where("secretKey", "==", "titkos"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot) {
      console.log(querySnapshot.docs[0].data());
    }
  };
  return (
    <div className="create-wish-list-container">
      <form name="create-wish-list-form">
        <input
          type="text"
          name="list_name"
          id="list_name"
          placeholder="Please provide a name for your Wish List.."
        />
        <input
          type="text"
          name="secret_key"
          id="secret_key"
          placeholder="Please provide a secret key.."
        />
        <input
          type="text"
          name="open_list"
          id="open_list"
          placeholder="key to open"
        />

        <button onClick={createWishList}>Create list</button>
        <button onClick={test}>Create list</button>
      </form>
    </div>
  );
}
