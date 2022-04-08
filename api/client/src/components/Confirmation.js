import { useEffect, useContext } from "react";
import { WishListIdContext, LanguageContext } from "../context";
import "./Confirmation.css";
import {axiosInstance} from "../config"

import lang from "../translation";


export default function Confirmation(props) {
  const [wishListId] = useContext(WishListIdContext);
  const [language] = useContext(LanguageContext);

  const handleBuyConfirmation = async () => {
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.put(
        `/wishList/${wishListId}/item/${props.listItem.id}/status`,
        {
          reserved: false,
          bought: true,
        },
        {
          headers: {
            token: "Bearer " + token,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
    props.setConfirmationId(null);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.delete(
        `/wishList/${wishListId}/item/${props.listItem.id}`,
        {
          headers: {
            token: "Bearer " + token,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
    props.setConfirmationId(null);
  };

  useEffect(() => {
    const removeConfirmationWindow = (e) => {
      if (e.target.className === "confirm-buy-container") {
        props.setConfirmationId(null);
      }
    };

    document.addEventListener("click", (e) => {
      removeConfirmationWindow(e);
    });

    return document.removeEventListener("click", (e) => {
      removeConfirmationWindow(e);
    });
  });

  return (
    <div className="confirm-buy-container">
      <div className="confirm-buy-window">
        <h2>
          {lang[language].confirm_please}
          {props.isDelete
            ? lang[language].confirm_delete
            : lang[language].confirm_bought}
        </h2>
        <div className="confirm-item">{props.listItem.itemName}</div>
        <div className="confirm-button-container">
          <button
            onClick={() => {
              props.isDelete ? handleDelete() : handleBuyConfirmation();
            }}
            className="confirm-button"
          >
            {lang[language].confirm}
          </button>
          <button
            onClick={() => props.setConfirmationId(null)}
            className="confirm-button cancel"
          >
            {lang[language].list_cancel}
          </button>
        </div>
      </div>
    </div>
  );
}
