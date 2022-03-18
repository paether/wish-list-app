import React from "react";
import Loading from "./Loading";
import bcrypt from "bcryptjs";
import { createWishList as createWishListFirebase } from "../firebase";
import "./CreateWishList.css";
import { useNavigate } from "react-router-dom";
import WishListForm from "../components/WishListForm";

export default function CreateWishList({
  onWhishListCreation,
  userId,
  isLoading,
  language,
}) {
  const navigate = useNavigate();

  const createWishList = async (e) => {
    e.preventDefault();

    const listName = document.getElementById("list_id_name").value;
    const hashedPassword = bcrypt.hashSync(
      document.getElementById("secret_key").value,
      bcrypt.genSaltSync()
    );
    const hashedPasswordAdmin = bcrypt.hashSync(
      document.getElementById("admin_key").value,
      bcrypt.genSaltSync()
    );
    const docref = await createWishListFirebase(
      userId,
      listName,
      hashedPassword,
      hashedPasswordAdmin
    );
    navigate("/wish-list-app/wishList");
    const headerItems = [...document.querySelectorAll(".header-item")];
    headerItems
      .find((item) => item.classList.contains("active"))
      ?.classList.remove("active");
    const openHeaderItem = document.querySelector(".open-list");
    openHeaderItem.classList.add("active");
    onWhishListCreation(docref.id);
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
