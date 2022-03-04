import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import bcrypt from "bcryptjs";
import {
  createWishList as createWishListFirabase,
  getWishList,
} from "../firebase";
import "./CreateWishList.css";
import { useNavigate } from "react-router-dom";

let submitBtn;

export default function CreateWishList({
  onCreation,
  userId,
  isLoading,
  language,
}) {
  const navigate = useNavigate();

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
    navigate("/wishList");
    onCreation(docref.id);
  };

  return (
    <div className="create-wish-list-container">
      {!isLoading ? (
        <form className="create-wish-list-form">
          <input
            className="create-input"
            type="text"
            name="list_name"
            id="list_name"
            placeholder="Wish List name"
            autoComplete="off"
          />

          <input
            className="create-input"
            type="password"
            name="secret_key"
            id="secret_key"
            placeholder="Wish List password"
            autoComplete="off"
          />
          <input
            className="create-input"
            type="password"
            name="admin_key"
            id="admin_key"
            placeholder="Admin password"
            autoComplete="off"
          />
          <button
            className="create-button"
            id="submitBtn"
            type="button"
            onClick={createWishList}
          >
            Create
          </button>
        </form>
      ) : (
        <Loading language={language} />
      )}
    </div>
  );
}
