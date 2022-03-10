import ListItems from "./ListItems";
import bcrypt from "bcryptjs";
import { getWishList } from "../firebase";
import { useEffect, useState } from "react";
import "./WishListMenu.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import uniqid from "uniqid";
let toggleButton;

export default function WishListMenu({
  wishList,
  wishListId,
  isAuthorized,
  onSetIsAuthorized,
  isAdmin,
  onSetIsAdmin,
  localAdminSessionId,
  localSessionId,
  updateSessionData,
}) {
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    if (!isAuthorized) {
      toggleButton = document.querySelector(".switch-button-checkbox");
      toggleButton.addEventListener("click", () => {
        if (toggleButton.checked) {
          setShowAdmin(true);
        } else {
          setShowAdmin(false);
        }
      });
    }

    if (isAdmin || isAuthorized) return;

    let storage = JSON.parse(localStorage.getItem("authorization")) || [];
    const sessionExists = storage.find(
      (element) => element.sessionId === localSessionId
    );
    if (sessionExists) {
      onSetIsAuthorized(true);
      if (sessionExists.adminSessionId === localAdminSessionId) {
        onSetIsAdmin(true);
      }
    }
  }, [
    isAdmin,
    isAuthorized,
    localAdminSessionId,
    localSessionId,
    onSetIsAdmin,
    onSetIsAuthorized,
  ]);

  const checkPasswordAndId = async (e) => {
    e.preventDefault();
    const wishListDoc = await getWishList(wishListId);
    const secretKeyElement = document.getElementById("secret_key");
    const adminKeyElement = document.getElementById("admin_key");
    let adminAllowed = false;
    if (
      bcrypt.compareSync(secretKeyElement.value, wishListDoc.data().secretKey)
    ) {
      if (toggleButton.checked) {
        if (
          bcrypt.compareSync(
            adminKeyElement.value,
            wishListDoc.data().adminSecretKey
          )
        ) {
          onSetIsAdmin(true);
          adminAllowed = true;
        } else {
          adminKeyElement.setCustomValidity(
            "Wish List Admin Password is wrong!"
          );
          adminKeyElement.reportValidity();
          return;
        }
      }
      onSetIsAuthorized(true);
      updateSessionData(wishListId, adminAllowed);
    } else {
      secretKeyElement.setCustomValidity("Wish List Password is wrong!");
      secretKeyElement.reportValidity();
    }
  };
  const handlePasswordVisibility = (elementId) => {
    const inputElement = document.getElementById(elementId);
    inputElement.type === "password"
      ? (inputElement.type = "text")
      : (inputElement.type = "password");
  };

  if (!isAuthorized) {
    return (
      <div className="not-authorized-container">
        <form className="not-authorized-form">
          <div className="switch-button">
            <input className="switch-button-checkbox" type="checkbox"></input>
            <label className="switch-button-label" htmlFor="">
              <span className="switch-button-label-span">User</span>
            </label>
          </div>
          <h1>
            You need to provide a password for <br /> this list to access it.
          </h1>
          <div className="input-container">
            <label htmlFor="secret_key">Wish List Password</label>
            <div className="input-flex">
              <input
                className="access-input"
                type="password"
                onChange={(e) => {
                  e.target.setCustomValidity("");
                }}
                name="secret_key"
                id="secret_key"
              />
              <FontAwesomeIcon
                onClick={() => handlePasswordVisibility("secret_key")}
                icon={faEye}
              />
            </div>
          </div>
          {showAdmin && (
            <div className="input-container">
              <label htmlFor="admin_key">Admin Wish List Password</label>
              <div className="input-flex">
                <input
                  className="access-input"
                  type="password"
                  name="admin_key"
                  onChange={(e) => {
                    e.target.setCustomValidity("");
                  }}
                  id="admin_key"
                />
                <FontAwesomeIcon
                  onClick={() => handlePasswordVisibility("admin_key")}
                  icon={faEye}
                />
              </div>
            </div>
          )}

          <button className="access-button" onClick={checkPasswordAndId}>
            Access list
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="wish-list-menu-container">
      <h1>Welcome.</h1>
      <h2>It's time to pick presents!</h2>
      <div className="list-name">{wishList.listName}</div>
      <ListItems
        localAdminSessionId={localAdminSessionId}
        isAdmin={isAdmin}
        wishListId={wishListId}
      />
    </div>
  );
}
