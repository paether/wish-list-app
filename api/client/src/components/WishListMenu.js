import ListItems from "./ListItems";
import { useEffect, useState, useContext, useRef } from "react";
import "./WishListMenu.css";
import NotAuthorized from "./NotAuthorized";
import { axiosInstance } from "../config";

import lang from "../translation";
import Loading from "../pages/Loading";

import {
  AdminContext,
  AuthorizedContext,
  WishListIdContext,
  LanguageContext,
} from "../context";

export default function WishListMenu() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [listName, setListName] = useState("");

  const [, setIsAdmin] = useContext(AdminContext);
  const [isAuthorized, setIsAuthorized] = useContext(AuthorizedContext);
  const [wishListId, setWishListId] = useContext(WishListIdContext);
  const [language] = useContext(LanguageContext);

  const secretKeyElement = useRef(null);
  const adminKeyElement = useRef(null);
  const toggleButtonElement = useRef(null);

  const getListName = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axiosInstance.get("/wishList/" + wishListId, {
        headers: {
          token: "Bearer " + token,
        },
      });
      setListName(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!listName && isAuthorized) {
    getListName();
  }

  useEffect(() => {
    if (!isAuthorized) {
      toggleButtonElement.current.addEventListener("click", () => {
        if (toggleButtonElement.current.checked) {
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
    let adminKeyElementValue = false;

    if (secretKeyElement.current.validity.valueMissing) {
      displayError(secretKeyElement.current, lang[language].error_password);
      return;
    }

    if (toggleButtonElement.current.checked) {
      if (adminKeyElement.current.validity.valueMissing) {
        displayError(adminKeyElement.current, lang[language].error_password);
        return;
      }
      adminKeyElementValue = adminKeyElement.current.value;
    }

    try {
      const response = await axiosInstance.post("/auth/login", {
        listId: wishListId,
        password: secretKeyElement.current.value,
        adminPassword: adminKeyElementValue,
      });
      localStorage.setItem("token", response.data.token);
      setIsAuthorized(true);
      if (adminKeyElementValue) {
        setIsAdmin(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!isAuthorized) {
    return (
      <NotAuthorized
        {...{
          adminKeyElement,
          handleLogin,
          showAdmin,
          toggleButtonElement,
          secretKeyElement,
          setWishListId,
        }}
      />
    );
  }

  if (!listName) {
    return <Loading />;
  } else {
    return (
      <div className="wish-list-menu-container">
        <h1>{lang[language].menu_header1}</h1>
        <h2>{lang[language].menu_header2}</h2>
        <div className="list-name">{listName}</div>
        {isAuthorized && <ListItems />}
        <div className="open-another-list">
          <button
            className="open-another-list-btn"
            data-tool-tip={lang[language].list_copied}
            onClick={() => {
              setWishListId(null);
            }}
          >
            {lang[language].menu_open_another}
          </button>
        </div>
      </div>
    );
  }
}
