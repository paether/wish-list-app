import React, { useState } from "react";
import bcrypt from "bcryptjs";
import {
  createWishList as createWishListFirabase,
  getWishList,
} from "../firebase";
import "./CreateWishList.css";

export default function CreateWishList({ onCreation, userId }) {
  const createWishList = async (e) => {
    e.preventDefault();
    const listName = document.getElementById("list_name").value;
    const hashedPassword = bcrypt.hashSync(
      document.getElementById("secret_key").value,
      bcrypt.genSaltSync()
    );
    const docref = await createWishListFirabase(
      userId,
      listName,
      hashedPassword
    );
    onCreation(docref.id);
  };

  const findList = async (e) => {
    e.preventDefault();
    const listId = document.getElementById("list_id").value;
    const wishListDoc = await getWishList(listId);
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
      onCreation(listId);
      return;
    }
    console.log("the provided password is not good!");
  };

  return (
    <div className="create-wish-list-container">
      <form className="create-wish-list-form">
        <input
          type="text"
          name="list_name"
          id="list_name"
          placeholder="Please provide a name for your Wish List.."
        />
        Or if you want to open an already existing list please provide the ID of
        the list and the secret key to it
        <input
          type="password"
          name="secret_key"
          id="secret_key"
          placeholder="Please provide the secret key.."
        />
        <input
          type="text"
          name="list_id"
          id="list_id"
          placeholder="Please provide the ID of the list"
        />
        <button onClick={createWishList}>Create list</button>
        <button onClick={findList}>find list</button>
      </form>
    </div>
  );
}
