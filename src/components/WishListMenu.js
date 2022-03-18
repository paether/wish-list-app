import ListItems from "./ListItems";
import bcrypt from "bcryptjs";
import { getWishList } from "../firebase";
import { useEffect, useState } from "react";
import "./WishListMenu.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
let toggleButton;

export default function WishListMenu({
  wishList,
  wishListId,
  isAuthorized,
  setIsAuthorized,
  isAdmin,
  setIsAdmin,
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
      setIsAuthorized(true);
      if (sessionExists.adminSessionId === localAdminSessionId) {
        setIsAdmin(true);
      }
    }
  }, [
    isAdmin,
    isAuthorized,
    localAdminSessionId,
    localSessionId,
    setIsAdmin,
    setIsAuthorized,
  ]);

  const checkPasswordAndId = async (e) => {
    e.preventDefault();
    const wishListDoc = await getWishList(wishListId);
    const secretKeyElement = document.getElementById("secret_key");
    let adminAllowed = false;
    if (
      bcrypt.compareSync(secretKeyElement.value, wishListDoc.data().secretKey)
    ) {
      if (toggleButton.checked) {
        const adminKeyElement = document.getElementById("admin_key");
        if (
          bcrypt.compareSync(
            adminKeyElement.value,
            wishListDoc.data().adminSecretKey
          )
        ) {
          setIsAdmin(true);
          adminAllowed = true;
        } else {
          adminKeyElement.setCustomValidity(
            "Wish List Admin Password is wrong!"
          );
          adminKeyElement.reportValidity();
          return;
        }
      }
      setIsAuthorized(true);
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
          <div className="not-authorized-headline">
            <h1>You need to provide a password for:</h1>
            <div className="access-item">{wishList.listName}</div>
            <h1>to access it.</h1>
          </div>

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
                autoComplete="password"
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
                  autoComplete="off"
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
        {...{
          localAdminSessionId,
          isAdmin,
          wishListId,
          setIsAdmin,
          updateSessionData,
        }}
      />
    </div>
  );
}
