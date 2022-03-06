import React, { useEffect } from "react";
import Loading from "./Loading";
import bcrypt from "bcryptjs";
import { createWishList as createWishListFirebase } from "../firebase";
import "./CreateWishList.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion, faEye } from "@fortawesome/free-solid-svg-icons";

export default function CreateWishList({
  onCreation,
  userId,
  isLoading,
  language,
}) {
  const navigate = useNavigate();
  const handlePasswordVisibility = (elementId) => {
    const inputElement = document.getElementById(elementId);
    inputElement.type === "password"
      ? (inputElement.type = "text")
      : (inputElement.type = "password");
  };

  const createWishList = async (e) => {
    e.preventDefault();

    const listName = document.getElementById("list_name").value;
    const hashedPassword = bcrypt.hashSync(
      document.getElementById("secret_key").value,
      bcrypt.genSaltSync()
    );
    const hashedPasswordAdmin = bcrypt.hashSync(
      document.getElementById("secret_key").value,
      bcrypt.genSaltSync()
    );
    const docref = await createWishListFirebase(
      userId,
      listName,
      hashedPassword,
      hashedPasswordAdmin
    );
    navigate("/wishList");
    const headerItems = [...document.querySelectorAll(".header-item")];
    headerItems
      .find((item) => item.classList.contains("active"))
      ?.classList.remove("active");
    const openHeaderItem = document.querySelector(".open-list");
    openHeaderItem.classList.add("active");
    onCreation(docref.id);
  };

  return (
    <div className="create-wish-list-container">
      <div className="create-wish-list-headline">
        Create your Wish List right away,
        <br /> <span>NO</span> <br />
        registration is required!
      </div>
      {!isLoading ? (
        <form className="create-wish-list-form">
          <div className="input-container">
            <label htmlFor="username">Wish List Name</label>
            <div className="input-item-container">
              <input
                className="create-input"
                type="text"
                name="list_name"
                id="list_name"
                autoComplete="off"
              />
              <span
                className="tooltip"
                data-tool-tip="The name of your Wish List. Name it just as you want!"
              >
                <FontAwesomeIcon icon={faCircleQuestion} />
              </span>
            </div>
          </div>
          <div className="input-container">
            <label htmlFor="username">Wish List Password</label>
            <div className="input-item-container">
              <input
                className="create-input"
                type="password"
                name="secret_key"
                id="secret_key"
                autoComplete="off"
              />
              <FontAwesomeIcon
                onClick={() => handlePasswordVisibility("secret_key")}
                icon={faEye}
              />
              <span
                className="tooltip"
                data-tool-tip="The password of your list. This has to be shared with others in order to access it and pick their items."
              >
                <FontAwesomeIcon className="icon" icon={faCircleQuestion} />
              </span>
            </div>
          </div>
          <div className="input-container">
            <label htmlFor="username">Wish List Admin Password</label>
            <div className="input-item-container">
              <input
                className="create-input"
                type="password"
                name="admin_key"
                id="admin_key"
                autoComplete="off"
              />
              <FontAwesomeIcon
                onClick={() => handlePasswordVisibility("admin_key")}
                className="icon-eye"
                icon={faEye}
              />
              <span
                className="tooltip"
                data-tool-tip="With this password you will be able to add/delete/lock the list."
              >
                <FontAwesomeIcon className="icon" icon={faCircleQuestion} />
              </span>
            </div>
          </div>
          <button
            data-tool-tip="You can reset the table with this button, the maximum is 30!"
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
