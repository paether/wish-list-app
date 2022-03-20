import React from "react";
import Loading from "./Loading";
import bcrypt from "bcryptjs";
import "./CreateWishList.css";
import { useNavigate } from "react-router-dom";
import WishListForm from "../components/WishListForm";
import axios from "axios";

export default function CreateWishList({
  onWhishListCreation,
  isLoading,
  language,
}) {
  const navigate = useNavigate();

  const displayError = (element, text) => {
    element.setCustomValidity(text);
    element.reportValidity();
  };

  const setActiveHeader = (headerClass) => {
    const headerItems = [...document.querySelectorAll(".header-item")];
    headerItems
      .find((item) => item.classList.contains("active"))
      ?.classList.remove("active");
    const openHeaderItem = document.querySelector(headerClass);
    openHeaderItem.classList.add("active");
  };

  const createWishList = async (e) => {
    e.preventDefault();

    const listName = document.getElementById("list_id_name");
    const password = document.getElementById("secret_key");
    const adminpassword = document.getElementById("admin_key");

    if (listName.validity.valueMissing) {
      displayError(listName, "You need to provide a Wish List name!");
      return;
    }
    if (password.validity.valueMissing) {
      displayError(password, "You need to provide a password!");
      return;
    }
    if (adminpassword.validity.valueMissing) {
      displayError(adminpassword, "You need to provide an admin password!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8800/api/auth/create",
        {
          listName: listName.value,
          password: password.value,
          adminPassword: adminpassword.value,
        }
      );
      navigate("/wish-list-app/wishList");
      setActiveHeader(".open-list");
      console.log("Bearer " + response.data.token);
      onWhishListCreation(response.data.listId, response.data.token);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="create-wish-list-container">
      <h2 className="create-wish-list-headline">
        Create your Wish List right away,
        <br /> <span>NO</span> <br />
        e-mail is required!
      </h2>

      {!isLoading ? (
        <WishListForm submitButtonAction={createWishList} isCreate={true} />
      ) : (
        <Loading language={language} />
      )}
    </div>
  );
}
