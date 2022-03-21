import ListItems from "./ListItems";
import { useEffect, useState } from "react";
import "./WishListMenu.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
let toggleButton;
let listName = "";
export default function WishListMenu({
  wishListId,
  isAuthorized,
  setIsAuthorized,
  isAdmin,
  setIsAdmin,
}) {
  const [showAdmin, setShowAdmin] = useState(false);

  const getListName = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        "http://localhost:8800/api/wishList/" + wishListId,
        {
          headers: {
            token: "Bearer " + token,
          },
        }
      );
      listName = response.data;
    } catch (error) {
      console.log("cannot get listname");
    }
  };

  if (!listName) {
    getListName();
  }

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
  }, [showAdmin, isAuthorized]);

  const displayError = (element, text) => {
    element.setCustomValidity(text);
    element.reportValidity();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    let adminKeyElementValue = "";
    const secretKeyElement = document.getElementById("secret_key");

    if (secretKeyElement.validity.valueMissing) {
      displayError(listName, "You need to provide a password!");
      return;
    }

    if (toggleButton.checked) {
      let adminKeyElement = document.getElementById("admin_key");

      if (adminKeyElement.validity.valueMissing) {
        displayError(listName, "You need to provide an admin password!");
        return;
      }
      adminKeyElementValue = adminKeyElement.value;
    }

    try {
      const response = await axios.post(
        "http://localhost:8800/api/auth/login",
        {
          listId: wishListId,
          password: secretKeyElement.value,
          adminPassword: adminKeyElementValue,
          isAdmin: adminKeyElementValue,
        }
      );
      if (adminKeyElementValue) {
        setIsAdmin(true);
      }
      setIsAuthorized(true);
      listName = response.data.listName;
      localStorage.setItem("token", response.data.token);
    } catch (error) {
      console.log(error);
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
            <h1>You need to provide a password to access this list</h1>
            {/* <div className="access-item">{listName}</div>
            <h1>to access it.</h1> */}
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
                required
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
                  required
                />
                <FontAwesomeIcon
                  onClick={() => handlePasswordVisibility("admin_key")}
                  icon={faEye}
                />
              </div>
            </div>
          )}

          <button className="access-button" onClick={handleLogin}>
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
      <div className="list-name">{listName}</div>
      {isAuthorized && (
        <ListItems
          {...{
            // localAdminSessionId,
            isAdmin,
            wishListId,
            setIsAdmin,
            // updateSessionData,
          }}
        />
      )}
    </div>
  );
}
