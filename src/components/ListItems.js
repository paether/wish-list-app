import { streamWishListItems, updateWishListItemStatus } from "../firebase";
import React, { useEffect, useState } from "react";
import Confirmation from "./Confirmation";
import "./ListItems.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift, faEye } from "@fortawesome/free-solid-svg-icons";
import AddEditlistItem from "./AddEditListItem";
import bcrypt from "bcryptjs";
import { getWishList } from "../firebase";
let toggleButton;

export default function ListItems({
  wishListId,
  isAdmin,
  setIsAdmin,
  updateSessionData,
}) {
  const [wishListItems, setWishListItems] = useState([]);
  const [confirmationId, setConfirmationId] = useState("");
  const [showAdmin, setShowAdmin] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const handleCopytoClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    const copyButton = document.querySelector(".add-new-item-btn.copy");
    copyButton.classList.add("copied");

    setTimeout(() => {
      copyButton.classList.remove("copied");
    }, 2000);
  };

  const handlePasswordVisibility = (elementId) => {
    const inputElement = document.getElementById(elementId);
    inputElement.type === "password"
      ? (inputElement.type = "text")
      : (inputElement.type = "password");
  };

  const checkAdminPassword = async (e) => {
    e.preventDefault();
    const wishListDoc = await getWishList(wishListId);
    const adminKeyElement = document.getElementById("admin_key");
    if (
      bcrypt.compareSync(
        adminKeyElement.value,
        wishListDoc.data().adminSecretKey
      )
    ) {
      setIsAdmin(true);
      updateSessionData(wishListId, true);
      setShowAdmin(false);
    } else {
      adminKeyElement.setCustomValidity("Wish List Admin Password is wrong!");
      adminKeyElement.reportValidity();
      return;
    }
  };

  useEffect(() => {
    toggleButton = document.querySelector(".switch-button-checkbox");
    if (isAdmin) {
      toggleButton.checked = true;
    }
    toggleButton.addEventListener("click", () => {
      if (toggleButton.checked) {
        setShowAdmin(true);
      } else {
        setShowAdmin(false);
        setIsAdmin(false);
      }
    });
  });

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
    <div className="list-area">
      <div className="switch-button">
        <input className="switch-button-checkbox" type="checkbox"></input>
        <label className="switch-button-label" htmlFor="">
          <span className="switch-button-label-span">User</span>
        </label>
      </div>

      <div className="list-items-container">
        {showAdmin && (
          <div className="admin-login-container">
            <form className="admin-login-window">
              <h2>
                Please provide the admin password to switch to admin mode:
              </h2>
              <div className="input-container">
                <label htmlFor="admin_key">Admin password</label>
                <div className="input-flex">
                  <input
                    className="access-input"
                    type="password"
                    name="admin_key"
                    onChange={(e) => {
                      e.target.setCustomValidity("");
                    }}
                    id="admin_key"
                    autoComplete="off"
                  />
                  <FontAwesomeIcon
                    onClick={() => handlePasswordVisibility("admin_key")}
                    icon={faEye}
                  />
                </div>
              </div>
              <div className="access-button-container">
                <button className="access-button" onClick={checkAdminPassword}>
                  Access list
                </button>
                <button
                  onClick={() => {
                    toggleButton.checked = false;
                    setShowAdmin(false);
                  }}
                  className="access-button cancel"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="list-items">
          {wishListItems.map((listItem) => {
            return (
              <div key={listItem.id} className="grid-item-container">
                {isAdmin && (
                  <div className="admin-buttons-container">
                    <button
                      onClick={() => {
                        setIsDelete(true);
                        setConfirmationId(listItem.id);
                      }}
                      className="select-button"
                    >
                      Delete
                    </button>
                  </div>
                )}
                {confirmationId === listItem.id && (
                  <Confirmation
                    setConfirmationId={setConfirmationId}
                    wishListId={wishListId}
                    listItem={listItem}
                    isDelete={isDelete}
                  />
                )}
                {listItem.reserved && (
                  <span className="label-reserved">Reserved</span>
                )}
                {listItem.bought && (
                  <span className="label-bought">Bought</span>
                )}

                <div
                  data-key={listItem.id}
                  className={
                    "list-item-container " +
                    (listItem.reserved || listItem.bought ? "blur" : "")
                  }
                >
                  {listItem.pictureUrl ? (
                    <img
                      className="item-picture"
                      src={listItem.pictureUrl}
                      alt=""
                    />
                  ) : (
                    <FontAwesomeIcon className="item-picture" icon={faGift} />
                  )}
                  <div className="list-item-details">
                    <div className="list-item-name"> {listItem.itemName}</div>
                    <a href={listItem.itemUrl} rel="noreferrer" target="_blank">
                      Link to gift
                    </a>
                    <div className="list-item-description">
                      {listItem.itemDesc}
                    </div>

                    {/* <button
                  onClick={() => deleteWishListItem(wishListId, listItem.id)}
                >
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
                </button> */}
                  </div>
                </div>
                <div
                  className={
                    "item-status-button-container " +
                    (listItem.bought ? "bought" : "")
                  }
                >
                  <button
                    className={
                      "select-button " + (listItem.reserved ? "reserved" : "")
                    }
                    onClick={() =>
                      updateWishListItemStatus(
                        wishListId,
                        listItem.id,
                        !listItem.reserved,
                        listItem.bought
                      )
                    }
                    disabled={listItem.bought}
                  >
                    {listItem.reserved
                      ? "Unreserve this gift"
                      : "Reserve this gift"}
                  </button>
                  <button
                    className={
                      "select-button " + (listItem.bought ? "bought" : "")
                    }
                    onClick={() => {
                      setIsDelete(false);
                      setConfirmationId(listItem.id);
                    }}
                    disabled={listItem.bought}
                  >
                    Buy this gift
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <button
        className="add-new-item-btn copy"
        data-tool-tip={"Copied!"}
        onClick={() => handleCopytoClipboard()}
      >
        Copy list ID
      </button>
      <div className="admin-toggle"></div>
      {isAdmin && <AddEditlistItem wishListId={wishListId} />}
    </div>
  );
}
